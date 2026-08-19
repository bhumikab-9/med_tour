const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MySQL@2026_Project!',
    database: 'meddatabase'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.get('/api/hospitals', (req, res) => {
    db.query('SELECT * FROM hospital', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/treatments', (req, res) => {
    db.query('SELECT * FROM treatment', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/search', (req, res) => {
    const { query } = req.body;

    db.query(
        'SELECT * FROM treatment WHERE name LIKE ?',
        [`%${query}%`],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
});

app.get('/api/treatment-hospitals', (req, res) => {
    const { ids } = req.query;
    if (!ids) return res.status(400).json({ error: 'ids parameter is required' });
    const idArray = ids.split(',').map(Number);

    const query = `
    SELECT h.name as hospital_name, l.city_state as location, ht.cost, ht.description
    FROM hospitaltreatment ht
    JOIN hospital h ON ht.hospital_id = h.id
    JOIN location l ON h.location_id = l.id
    WHERE ht.treatment_id IN (?)
  `;

    db.query(query, [idArray], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});