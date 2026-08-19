/**
 * LLM configuration + Gemini client.
 *
 * Reads credentials from environment variables (loaded from .env by
 * server.js) so that no secret ever lives in frontend code.
 *
 * Gemini "AQ."-prefixed auth keys must be sent via the x-goog-api-key header,
 * not the Authorization header.
 */

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Tried in order when the primary model fails (404/503 etc.).
const FALLBACK_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash-lite"];

function getApiKey() {
    const key = (process.env.GEMINI_API_KEY || "").trim();
    if (!key) {
        throw new Error("GEMINI_API_KEY is not set. Copy .env.example to .env and add your key.");
    }
    return key;
}

/**
 * @param {Array<{role:'user'|'model', parts:Array<{text:string}>}>} history
 * @returns {Promise<{ text: string, model: string }>}
 */
async function chat({ systemPrompt, history, maxOutputTokens = 2048, timeoutMs = 45000 }) {
    const apiKey = getApiKey();
    const primaryModel = (process.env.GEMINI_MODEL || DEFAULT_MODEL).trim();
    const models = [primaryModel, ...FALLBACK_MODELS].filter((m, i, arr) => arr.indexOf(m) === i);

    let lastError = null;

    for (const model of models) {
        try {
            const text = await callModel({ apiKey, model, systemPrompt, history, maxOutputTokens, timeoutMs });
            return { text, model };
        } catch (err) {
            // Transient upstream failures (5xx, overload, not-found model) should fall through.
            lastError = err;
        }
    }

    throw new Error("All model attempts failed: " + lastError.message);
}

async function callModel({ apiKey, model, systemPrompt, history, maxOutputTokens, timeoutMs }) {
    const url = `${BASE_URL}/${encodeURIComponent(model)}:generateContent`;

    const payload = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: history.map((h) => ({
            role: h.role === "model" ? "model" : "user",
            parts: h.parts,
        })),
        generationConfig: {
            temperature: 0.3,
            topP: 0.95,
            maxOutputTokens,
        },
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });

        if (!res.ok) {
            // Do not log the request body (may contain patient information).
            const detail = await safeErrorText(res);
            throw new Error(`Upstream error ${res.status}${detail ? ` (${detail})` : ""}`);
        }

        const data = await res.json();

        const candidate = data && data.candidates && data.candidates[0];
        const finishReason = candidate && candidate.finishReason;
        const parts = candidate && candidate.content && candidate.content.parts;

        if (finishReason === "SAFETY") {
            throw new Error("The model refused to answer (safety filter).");
        }

        const text = Array.isArray(parts)
            ? parts.map((p) => (p && typeof p.text === "string" ? p.text : "")).join("").trim()
            : "";

        if (!text) {
            throw new Error("Empty model response" + (finishReason ? ` (${finishReason})` : ""));
        }

        return text;
    } catch (err) {
        if (err.name === "AbortError") {
            throw new Error("Model request timed out.");
        }
        throw err;
    } finally {
        clearTimeout(timer);
    }
}

async function safeErrorText(res) {
    try {
        const data = await res.json();
        const message =
            data && data.error && data.error.message
                ? String(data.error.message)
                : String(data.error && data.error.status ? data.error.status : "");
        // Cap length and strip control characters.
        return message.replace(/[\u0000-\u001f]/g, " ").slice(0, 160);
    } catch {
        return "";
    }
}

module.exports = { chat, DEFAULT_MODEL };