function performSearch() {

    const input = document.getElementById("mainSearch");
    const city = document.getElementById("citySelect");

    const searchValue = input.value.trim();

    if (searchValue === "") {
        input.focus();

        input.placeholder = "Try searching for a treatment...";
        return;
    }

    const selectedCity = city.value;

    console.log("Search:", searchValue);
    console.log("City:", selectedCity);

    /*
        For now this is a frontend demo.

        Later we'll connect this to:
        - treatment database
        - hospital database
        - doctor database
        - AI assistant
    */

    alert(
        "Searching for: " +
        searchValue +
        "\nLocation: " +
        selectedCity
    );
}


function quickSearch(value) {

    const input = document.getElementById("mainSearch");

    input.value = value;

    input.focus();
}

// --- SPA ROUTER ---

function navigate(e, path) {
    e.preventDefault();
    // Using hash routing prevents SecurityErrors when opening index.html directly from a folder
    window.location.hash = path;
    handleRoute();
}

function handleRoute() {
    // Check the hash instead of the pathname
    const path = window.location.hash;
    
    // Hide all main sections by default when routing
    document.querySelectorAll("main > section").forEach(sec => sec.style.display = "none");
    
    // Show specific section based on the URL path
    if (path.includes("compare-cost")) {
        document.getElementById("route-compare-cost").style.display = "block";
    } else if (path.includes("hospitals")) {
        document.getElementById("route-hospitals").style.display = "block";
    } else if (path.includes("ai-assistant")) {
        document.getElementById("route-ai-assistant").style.display = "flex";
    } else {
        // Default (Home page): show all sections EXCEPT the simple route pages
        document.querySelectorAll("main > section").forEach(sec => {
            if (sec.id !== "route-hospitals" && sec.id !== "route-compare-cost" && sec.id !== "route-ai-assistant") {
                sec.style.display = "";
            }
        });
    }
}

// Listen for browser back/forward buttons
window.addEventListener("hashchange", handleRoute);

// Run router on initial load
document.addEventListener("DOMContentLoaded", handleRoute);


/* =====================================================
   AI HEALTH ASSISTANT
   ===================================================== */

(function () {
    var form = document.getElementById("aiForm");
    if (!form) return; // This page has no chat (e.g. treatments.html)

    var MAX_LEN = 2000;
    var API_PATH = "/api/medical-chat";

    var els = {
        messages: document.getElementById("aiMessages"),
        empty: document.getElementById("aiEmptyState"),
        input: document.getElementById("aiInput"),
        send: document.getElementById("aiSendBtn"),
        count: document.getElementById("aiCharCount"),
        clear: document.getElementById("aiClearBtn")
    };

    var state = {
        conversationId: null,
        loading: false,
        errorEl: null,
        history: [], // { role: "user"|"model", content: "..." }
        lastFailedText: null
    };

    // Use the local server when the page is opened straight from disk.
    function apiBase() {
        return window.location.protocol === "file:" ? "http://localhost:3000" : "";
    }

    function timeNow() {
        return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    function scrollBottom(smooth) {
        els.messages.scrollTo({
            top: els.messages.scrollHeight,
            behavior: smooth ? "smooth" : "auto"
        });
    }

    /* ---------- Markdown (safe, tiny, server-content only) ---------- */

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function inlineMd(s) {
        var t = escapeHtml(s);
        t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
        t = t.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
        t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
        t = t.replace(
            /(https?:\/\/[^\s<]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        return t;
    }

    function renderMarkdown(text) {
        var lines = String(text).replace(/\r\n/g, "\n").split("\n");
        var html = "";
        var listType = null;
        var paragraph = [];

        function closeList() {
            if (listType) { html += "</" + listType + ">"; listType = null; }
        }
        function flushParagraph() {
            if (paragraph.length) {
                html += "<p>" + inlineMd(paragraph.join(" ")) + "</p>";
                paragraph = [];
            }
        }

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line) { flushParagraph(); closeList(); continue; }

            var m;
            if ((m = line.match(/^(#{1,4})\s+(.*)/))) {
                flushParagraph(); closeList();
                var lvl = m[1].length;
                html += "<h" + lvl + ">" + inlineMd(m[2]) + "</h" + lvl + ">";
            } else if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
                flushParagraph(); closeList();
                html += "<hr>";
            } else if ((m = line.match(/^([-*+])\s+(.*)/))) {
                flushParagraph();
                if (listType !== "ul") { closeList(); html += "<ul>"; listType = "ul"; }
                html += "<li>" + inlineMd(m[2]) + "</li>";
            } else if ((m = line.match(/^\d+[.)]\s+(.*)/))) {
                flushParagraph();
                if (listType !== "ol") { closeList(); html += "<ol>"; listType = "ol"; }
                html += "<li>" + inlineMd(m[1]) + "</li>";
            } else if ((m = line.match(/^>\s?(.*)/))) {
                flushParagraph(); closeList();
                html += "<blockquote>" + inlineMd(m[1]) + "</blockquote>";
            } else {
                paragraph.push(line);
            }
        }
        flushParagraph(); closeList();
        return html;
    }

    /* ---------- Rendering ---------- */

    function appendUser(text) {
        state.history.push({ role: "user", content: text });
        var wrap = document.createElement("div");
        wrap.className = "ai-msg ai-msg-user";
        wrap.innerHTML = '<div class="ai-bubble"></div>' +
            '<span class="ai-meta">' + escapeHtml(timeNow()) + "</span>";
        wrap.querySelector(".ai-bubble").textContent = text;
        els.messages.appendChild(wrap);
        scrollBottom(true);
        return wrap;
    }

    function appendCareOptions(options) {
        if (!options || !Array.isArray(options.hospitals) || !options.hospitals.length) return;
        var wrap = document.createElement("div");
        wrap.className = "ai-care-options";
        var cards = options.hospitals.map(function (hospital) {
            return '<article class="ai-care-card">' +
                '<div><strong>' + escapeHtml(hospital.name) + '</strong>' +
                '<span>' + escapeHtml(hospital.city) + '</span></div>' +
                '<b>' + escapeHtml(hospital.cost) + '</b>' +
                '<small>' + escapeHtml(hospital.note) + '</small>' +
                '</article>';
        }).join("");
        wrap.innerHTML = '<div class="ai-care-heading"><strong>Local catalog matches</strong>' +
            '<span>Estimated costs for ' + escapeHtml(options.treatment) + '</span></div>' +
            '<div class="ai-care-grid">' + cards + '</div>' +
            '<p class="ai-care-note">Catalog estimates are for comparison only. Confirm current pricing, availability, eligibility, and clinical suitability directly with a qualified hospital.</p>';
        els.messages.appendChild(wrap);
        scrollBottom(true);
    }

    var URGENCY_LABEL = {
        emergency: "Emergency",
        same_day: "Same day",
        soon: "Soon"
    };

    function appendAi(text, meta) {
        state.history.push({ role: "model", content: text });
        meta = meta || {};
        var urgency = meta.urgency || "routine";
        var tagHtml = "";
        if (URGENCY_LABEL[urgency]) {
            tagHtml = '<span class="ai-urgency ai-urgency-' + urgency + '">' + URGENCY_LABEL[urgency] + "</span> ";
        }
        var wrap = document.createElement("div");
        wrap.className = "ai-msg ai-msg-ai";
        wrap.innerHTML =
            '<div class="ai-msg-row">' +
            '<div class="ai-msg-avatar" aria-hidden="true">✚</div>' +
            '<div class="ai-bubble ai-bubble-md"></div>' +
            "</div>" +
            '<span class="ai-meta">' + tagHtml + escapeHtml(timeNow()) + "</span>";
        wrap.querySelector(".ai-bubble-md").innerHTML = renderMarkdown(text);
        els.messages.appendChild(wrap);
        scrollBottom(true);
        return wrap;
    }

    function showTyping() {
        var wrap = document.createElement("div");
        wrap.className = "ai-msg ai-msg-ai ai-typing";
        wrap.innerHTML =
            '<div class="ai-msg-row">' +
            '<div class="ai-msg-avatar" aria-hidden="true">✚</div>' +
            '<div class="ai-bubble" role="status" aria-label="AI Health Assistant is typing">' +
            '<span class="ai-dot"></span><span class="ai-dot"></span><span class="ai-dot"></span>' +
            "</div>" +
            "</div>";
        els.messages.appendChild(wrap);
        scrollBottom(true);
        return wrap;
    }

    function hideTyping() {
        var t = els.messages.querySelector(".ai-typing");
        if (t) t.remove();
    }

    function showEmergencyBanner() {
        var existing = document.getElementById("aiEmergencyBanner");
        if (existing) return;
        var banner = document.createElement("div");
        banner.className = "ai-emergency";
        banner.id = "aiEmergencyBanner";
        banner.setAttribute("role", "alert");
        banner.innerHTML =
            '<span aria-hidden="true">⚠️</span>' +
            "<div><strong>This may be a medical emergency.</strong> " +
            "Please contact your local emergency medical services or go to the nearest " +
            "emergency department immediately. This is not a diagnosis.</div>";
        els.messages.prepend(banner);
    }

    function appendError() {
        hideTyping();
        removeError();
        var wrap = document.createElement("div");
        wrap.className = "ai-msg-error";
        wrap.innerHTML =
            '<div class="ai-error-bubble">' +
            '<span aria-hidden="true">!</span>' +
            "<div>Something went wrong and your message could not be sent. " +
            "Please check your connection and try again.</div>" +
            "</div>" +
            '<button type="button" class="ai-retry">Retry</button>';
        wrap.querySelector(".ai-retry").addEventListener("click", retryLast);
        els.messages.appendChild(wrap);
        state.errorEl = wrap;
        scrollBottom(true);
    }

    function removeError() {
        if (state.errorEl) { state.errorEl.remove(); state.errorEl = null; }
    }

    function setEmptyVisible(visible) {
        if (els.empty) els.empty.style.display = visible ? "" : "none";
    }

    /* ---------- Actions ---------- */

    function setBusy(busy) {
        state.loading = busy;
        updateSendState();
        if (busy) {
            els.send.classList.add("is-busy");
        } else {
            els.send.classList.remove("is-busy");
        }
    }

    function updateSendState() {
        var value = els.input.value;
        var trimmed = value.trim();
        els.send.disabled = state.loading || trimmed.length === 0 || value.length > MAX_LEN;
        els.count.textContent = value.length + " / " + MAX_LEN;
        els.count.classList.toggle("over", value.length > MAX_LEN);
    }

    function resizeInput() {
        els.input.style.height = "auto";
        els.input.style.height = Math.min(els.input.scrollHeight, 150) + "px";
    }

    function sendMessage(raw) {
        var text = String(raw || "").trim();
        if (!text || state.loading) return;
        if (text.length > MAX_LEN) return;

        els.input.value = "";
        resizeInput();
        updateSendState();

        appendUser(text);
        setEmptyVisible(false);
        state.lastFailedText = text;
        doRequest(text);
    }

    function doRequest(text) {
        state.loading = true;
        setBusy(true);
        showTyping();
        removeError();

        fetch(apiBase() + API_PATH, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: text,
                conversation_id: state.conversationId,
                // The current user turn is sent via `message`; the server pushes
                // it itself, so exclude it from the replayed history.
                conversation_history: state.history.slice(0, -1)
            })
        })
            .then(function (res) {
                return res.json().catch(function () { return null; }).then(function (data) {
                    if (!res.ok) {
                        throw new Error(data && data.message ? data.message : "Request failed (" + res.status + ")");
                    }
                    if (!data || typeof data.message !== "string" || !data.message) {
                        throw new Error("Invalid response");
                    }
                    return data;
                });
            })
            .then(function (data) {
                state.conversationId = data.conversation_id || state.conversationId;
                state.lastFailedText = null;
                hideTyping();
                removeError();
                appendAi(data.message, { urgency: data.urgency });
                appendCareOptions(data.care_options);
                if (data.safety_flag) showEmergencyBanner();
            })
            .catch(function () {
                hideTyping();
                appendError();
            })
            .then(function () {
                state.loading = false;
                setBusy(false);
                els.input.focus();
            });
    }

    function retryLast() {
        if (state.lastFailedText && !state.loading) {
            doRequest(state.lastFailedText);
        }
    }

    function clearConversation() {
        state.conversationId = null;
        state.history = [];
        state.lastFailedText = null;
        state.loading = false;
        removeError();
        var stale = els.messages.querySelectorAll(".ai-msg, .ai-msg-error, #aiEmergencyBanner");
        for (var i = 0; i < stale.length; i++) stale[i].remove();
        setEmptyVisible(true);
        setBusy(false);
        els.input.focus();
    }

    /* ---------- Events ---------- */

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!state.loading) sendMessage(els.input.value);
    });

    els.input.addEventListener("input", function () {
        resizeInput();
        updateSendState();
    });

    els.input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!state.loading) sendMessage(els.input.value);
        }
    });

    els.clear.addEventListener("click", clearConversation);

    document.querySelectorAll(".ai-chip").forEach(function (chip) {
        chip.addEventListener("click", function () {
            var prompt = chip.getAttribute("data-prompt") || chip.textContent.trim();
            if (!state.loading) sendMessage(prompt);
        });
    });

    /* ---------- Init ---------- */

    setEmptyVisible(true);
    updateSendState();

})();
