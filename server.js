require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "meddatabase",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(express.json());
app.use(express.static(__dirname));

function filters(q) {
    const c = [], p = [];
    const search = (q.search || "").trim();
    const city = (q.city || "").trim();
    const speciality = (q.speciality || "").trim();

    if (search) {
        const term = `%${search}%`;
        c.push(`(
            h.name LIKE ? OR h.address LIKE ? OR l.city_state LIKE ?
            OR EXISTS (
                SELECT 1 FROM hospitalspeciality hs2
                JOIN speciality s2 ON s2.id = hs2.speciality_id
                WHERE hs2.hospital_id = h.id AND s2.name LIKE ?
            )
        )`);
        p.push(term, term, term, term);
    }
    if (city) { c.push("l.city_state = ?"); p.push(city); }
    if (speciality) {
        c.push(`EXISTS (
            SELECT 1 FROM hospitalspeciality hs3
            JOIN speciality s3 ON s3.id = hs3.speciality_id
            WHERE hs3.hospital_id = h.id AND s3.name = ?
        )`);
        p.push(speciality);
    }
    return { where: c.length ? "WHERE " + c.join(" AND ") : "", params: p };
}

function orderBy(sort) {
    if (sort === "name_asc") return "h.name ASC";
    if (sort === "established_asc") return "h.established_year ASC";
    if (sort === "cost_asc") return "ht.starting_cost IS NULL, ht.starting_cost ASC";
    return "r.rating IS NULL, r.rating DESC, r.review_count DESC, h.name ASC";
}

app.get("/api/hospitals", async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 24);
        const offset = (page - 1) * limit;
        const f = filters(req.query);

        const from = `
            FROM hospital h
            LEFT JOIN location l ON l.id = h.location_id
            LEFT JOIN (
                SELECT hospital_id, ROUND(AVG(rating),1) rating, COUNT(*) review_count
                FROM review GROUP BY hospital_id
            ) r ON r.hospital_id = h.id
            LEFT JOIN (
                SELECT hospital_id, MIN(cost) starting_cost
                FROM hospitaltreatment GROUP BY hospital_id
            ) ht ON ht.hospital_id = h.id
            ${f.where}
        `;

        const [[count]] = await pool.query(`SELECT COUNT(*) total ${from}`, f.params);
        const total = Number(count.total || 0);
        const totalPages = Math.max(Math.ceil(total / limit), 1);

        const [rows] = await pool.query(`
            SELECT h.id, h.name, h.address, h.pincode, h.phone, h.email,
                   h.established_year, l.city_state, r.rating,
                   COALESCE(r.review_count,0) review_count, ht.starting_cost,
                   COALESCE(GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR '||'),'') speciality_list
            ${from}
            LEFT JOIN hospitalspeciality hs ON hs.hospital_id = h.id
            LEFT JOIN speciality s ON s.id = hs.speciality_id
            GROUP BY h.id,h.name,h.address,h.pincode,h.phone,h.email,h.established_year,
                     l.city_state,r.rating,r.review_count,ht.starting_cost
            ORDER BY ${orderBy(req.query.sort)}
            LIMIT ? OFFSET ?
        `, [...f.params, limit, offset]);

        res.json({
            hospitals: rows.map(r => ({
                ...r,
                rating: r.rating == null ? null : Number(r.rating),
                review_count: Number(r.review_count || 0),
                starting_cost: r.starting_cost == null ? null : Number(r.starting_cost),
                specialities: r.speciality_list ? r.speciality_list.split("||") : []
            })),
            total, page, limit, totalPages
        });
    } catch (e) {
        console.error("Hospital API error:", e);
        res.status(500).json({ message: "Database query failed", error: e.message });
    }
});

app.get("/api/hospitals/filters", async (req, res) => {
    try {
        const [cities] = await pool.query(`
            SELECT DISTINCT l.city_state FROM location l
            JOIN hospital h ON h.location_id=l.id
            WHERE l.city_state IS NOT NULL AND l.city_state <> ''
            ORDER BY l.city_state
        `);
        const [specialities] = await pool.query(`SELECT id,name FROM speciality ORDER BY name`);
        res.json({
            cities: cities.map(x => x.city_state),
            specialities
        });
    } catch (e) {
        console.error("Filter API error:", e);
        res.status(500).json({ message: "Could not load hospital filters", error: e.message });
    }
});

/* =========================================
   TREATMENTS  (used by treatments.html,
   treatments-details.html and appointment.html)
========================================= */

app.get("/api/treatments", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, name, description FROM treatment ORDER BY name"
        );
        res.json(rows);
    } catch (e) {
        console.error("Treatments API error:", e);
        res.status(500).json({ message: "Could not load treatments", error: e.message });
    }
});

/* =========================================
   SIMPLE HOSPITAL LIST
   (lightweight id/name list for dropdowns,
   as opposed to the paginated /api/hospitals)
========================================= */

app.get("/api/hospitals/list", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT h.id, h.name, l.city_state
            FROM hospital h
            LEFT JOIN location l ON l.id = h.location_id
            ORDER BY h.name
        `);
        res.json(rows);
    } catch (e) {
        console.error("Hospital list API error:", e);
        res.status(500).json({ message: "Could not load hospitals", error: e.message });
    }
});

/* =========================================
   APPOINTMENT AVAILABILITY
========================================= */

async function ensureAvailabilityTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS appointment_availability (
            id INT AUTO_INCREMENT PRIMARY KEY,
            available_date DATE NOT NULL,
            slots_available INT NOT NULL DEFAULT 5,
            UNIQUE KEY uniq_available_date (available_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    const [[{ total }]] = await pool.query(
        "SELECT COUNT(*) total FROM appointment_availability WHERE available_date >= CURDATE()"
    );

    if (Number(total) === 0) {
        // Seed the next ~120 days, open Monday-Saturday (closed Sundays),
        // with a random-ish number of remaining slots per day.
        await pool.query(`
            INSERT INTO appointment_availability (available_date, slots_available)
            WITH RECURSIVE seq AS (
                SELECT 0 AS n
                UNION ALL
                SELECT n + 1 FROM seq WHERE n < 119
            )
            SELECT DATE_ADD(CURDATE(), INTERVAL n DAY),
                   FLOOR(2 + RAND() * 8)
            FROM seq
            WHERE DAYOFWEEK(DATE_ADD(CURDATE(), INTERVAL n DAY)) <> 1
            ON DUPLICATE KEY UPDATE slots_available = VALUES(slots_available)
        `);
        console.log("Seeded appointment_availability with upcoming open dates.");
    }
}

app.get("/api/available-dates", async (req, res) => {
    try {
        const from = (req.query.from || "").trim();
        const to = (req.query.to || "").trim();

        const conditions = ["available_date >= CURDATE()", "slots_available > 0"];
        const params = [];

        if (from) { conditions.push("available_date >= ?"); params.push(from); }
        if (to) { conditions.push("available_date <= ?"); params.push(to); }

        const [rows] = await pool.query(`
            SELECT DATE_FORMAT(available_date, '%Y-%m-%d') AS date, slots_available
            FROM appointment_availability
            WHERE ${conditions.join(" AND ")}
            ORDER BY available_date ASC
        `, params);

        res.json({
            dates: rows.map(r => ({
                date: r.date,
                slots: Number(r.slots_available)
            }))
        });
    } catch (e) {
        console.error("Available dates API error:", e);
        res.status(500).json({ message: "Could not load available dates", error: e.message });
    }
});

/* =========================================
   CREATE APPOINTMENT
========================================= */

app.post("/api/appointments", async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const {
            username, email, startDate, endDate,
            treatmentId, hospitalId, notes
        } = req.body || {};

        if (!username || !email || !startDate || !endDate || !treatmentId) {
            return res.status(400).json({ message: "username, email, startDate, endDate and treatmentId are required" });
        }

        await conn.beginTransaction();

        const [result] = await conn.query(
            `INSERT INTO appointment (username, email, start_date, end_date, treatment_id, hospital_id, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [username, email, startDate, endDate, treatmentId, hospitalId || null, notes || null]
        );

        // Best-effort: decrement the remaining slots on the chosen start date.
        await conn.query(
            `UPDATE appointment_availability
             SET slots_available = GREATEST(slots_available - 1, 0)
             WHERE available_date = ? AND slots_available > 0`,
            [startDate]
        );

        await conn.commit();
        res.status(201).json({ id: result.insertId, message: "Appointment request submitted successfully" });
    } catch (e) {
        await conn.rollback();
        console.error("Create appointment error:", e);
        res.status(500).json({ message: "Could not submit appointment", error: e.message });
    } finally {
        conn.release();
    }
});

app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({ ok: true, database: process.env.DB_NAME || "meddatabase" });
    } catch (e) {
        res.status(500).json({ ok: false, message: e.message });
    }
});

app.listen(PORT, async () => {
    console.log(`MedTour India running on http://localhost:${PORT}`);
    try {
        await pool.query("SELECT 1");
        console.log("MySQL connected successfully.");
        console.log(`Database: ${process.env.DB_NAME || "meddatabase"}`);

        await ensureAvailabilityTable();
    } catch (e) {
        console.error("MySQL connection failed:", e.message);
        console.error("Check MySQL Server, port 3306, and .env credentials.");
    }
});