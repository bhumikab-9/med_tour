/**
 * Medical safety / triage engine.
 *
 * Rule-based screening that runs on BOTH the user's message and the model's
 * response. It is a safety backstop, not a diagnosis tool. The LLM remains the
 * primary source of clinical reasoning; these rules only ensure that
 * high-risk language reliably produces an emergency escalation even if the
 * model under-reacts.
 *
 * Design notes:
 *  - Plain symptom mentions ("I have chest pain") are triaged conservatively
 *    (same_day) so the assistant can ask follow-up questions; only concrete
 *    high-risk signals (severity, combinations, specific emergencies) escalate
 *    to "emergency".
 *  - The model-response scan may only RAISE urgency when the user's own message
 *    already contains a non-routine clinical signal. This prevents educational
 *    answers ("if you have these symptoms, seek immediate care") from falsely
 *    triggering the emergency banner for general questions.
 */

const URGENCY = Object.freeze({
    ROUTINE: "routine",
    SOON: "soon",
    SAME_DAY: "same_day",
    EMERGENCY: "emergency",
});

const URGENCY_RANK = Object.freeze({
    [URGENCY.ROUTINE]: 0,
    [URGENCY.SOON]: 1,
    [URGENCY.SAME_DAY]: 2,
    [URGENCY.EMERGENCY]: 3,
});

// Each rule is a RegExp tested against lowercased text. The highest level
// present wins.

const EMERGENCY_RULES = [
    { label: "severe_chest", re: /(severe|sudden|crushing|squeezing|unbearable|intense|pressure|tight).{0,22}(chest pain|chest pressure|chest tightness|chest discomfort|pain in (the )?chest|chest)/i },
    { label: "chest_pressure", re: /(chest pressure|pressure in (the )?chest|chest tightness|tightness in (the )?chest|heaviness in (the )?chest|crushing chest)/i },
    { label: "radiating_chest", re: /(chest|pain).{0,40}(radiat|spread|spreading|moving|goes to|going to).{0,25}(arm|jaw|neck|back|shoulder)/i },
    { label: "chest_with_sign", re: /(chest pain|chest discomfort|chest tightness|chest pressure).{0,45}(arm|jaw|neck|back|shoulder|short(ness)? of breath|sweat|sweating|nausea|dizzy|dizziness|faint|pale)/i },
    { label: "breath_emergency", re: /(sudden|severe|extreme|worse|at rest).{0,25}(short(ness)? of breath|breathing|breathe)|(can'?t breathe|cannot breathe|unable to breathe|struggling to breathe|gasping)/i },
    { label: "faint", re: /(faint(ed|ing)?|passed out|loss of consciousness|unconscious|blacked out|collapsed)/i },
    { label: "stroke_weakness", re: /(sudden|one.?sided).{0,30}(weakness|numbness|paralysis)|(weakness|numbness).{0,20}(one side|left side|right side|face|arm|leg)/i },
    { label: "stroke_face", re: /(face droop|drooping face|droopy|facial droop)/i },
    { label: "stroke_speech", re: /(slurred speech|difficulty speaking|trouble speaking|can'?t speak|cannot speak|can'?t talk)/i },
    { label: "stroke_confusion", re: /(sudden confusion|severely confused|disoriented|confused.{0,20}(sudden|acute))/i },
    { label: "stroke_headache", re: /(worst headache|thunderclap headache|sudden severe headache)/i },
    { label: "pe_blood", re: /(cough(ing)? up blood|coughing blood|hemoptysis|spitting up blood|blood.{0,15}cough)/i },
    { label: "pe_leg", re: /(leg swelling|swollen leg|calf pain).{0,40}(short(ness)? of breath|chest pain|breathing)/i },
    { label: "anaphylaxis", re: /(anaphylaxis|severe allergic reaction)/i },
    { label: "airway_swelling", re: /(swell(ing|en)|closed|closing).{0,25}(lips?|tongue|throat|face)|(throat|airway).{0,20}(closing|swelling|tight)/i },
    { label: "sepsis", re: /(sepsis|blood infection|septic|septicemia)/i },
    { label: "fever_confusion", re: /(high fever|fever).{0,30}(confus|drowsy|difficulty waking|rapid breathing|very weak|rash)/i },
    { label: "blue_lips", re: /(blue|bluish|gray|grey|purple).{0,20}(lips?|face|skin|fingertips|nail)/i },
    { label: "seizure", re: /(seizure|convulsion|convulsing|fitting)/i },
    { label: "bleeding", re: /(uncontrolled bleeding|bleeding heavily|coughing up blood|vomiting blood|can'?t stop the bleeding)/i },
    { label: "head_injury", re: /(hit my head|head injury|bumped my head).{0,40}(confus|vomit|drowsy|unconscious)/i },
    { label: "suicide", re: /(suicid|kill myself|end my life|take my life|self.?harm)/i },
];

const SAME_DAY_RULES = [
    { label: "chest_pain", re: /(chest pain|pain in (the )?chest|chest hurts|chest discomfort)/i },
    { label: "sob_plain", re: /(short(ness)? of breath|difficulty breathing|trouble breathing|breathless)/i },
    { label: "high_fever", re: /(fever (of|over|above) 10[0-9]|temperature (of|over|above) 10[0-9]|high fever|very high fever)/i },
    { label: "vomiting", re: /(persistent vomiting|vomiting (since|for).{0,15}(hours|all day)|vomiting blood)/i },
    { label: "dehydration", re: /(can'?t keep (down|anything)|unable to keep (down|anything|fluids)|dehydrat|not urinating)/i },
    { label: "severe_abdominal", re: /(severe abdominal pain|severe stomach pain|excruciating (stomach|abdominal) pain)/i },
    { label: "blood_urine", re: /(blood in (my )?(urine|stool|puke|vomit)|bloody (urine|stool|vomit))/i },
    { label: "moderate_chest", re: /(chest pain.{0,20}(worse|not going away|lasts))/i },
    { label: "urinary", re: /(burning urination|painful urination|difficulty urinating|cannot urinate)/i },
];

const SOON_RULES = [
    { label: "persistent_headache", re: /(headache.{0,25}(persistent|for (several|a few|3|4|5|6|7) days|worse in the morning))/i },
    { label: "persistent_cough", re: /(cough.{0,25}(over a week|more than a week|persistent|for weeks))/i },
    { label: "weight_loss", re: /(unexplained weight loss|losing weight without)/i },
    { label: "lump", re: /(lump|hard swelling|new mole|changing mole)/i },
    { label: "chronic_digestion", re: /(blood.?stained (stool)|black stool|persistent (heartburn|diarrhea))/i },
];

// Urgency signals extracted from the MODEL's own response text. These may only
// RAISE urgency when the user's message was already non-routine (see finalUrgency).
const RESPONSE_RULES = [
    { level: URGENCY.EMERGENCY, label: "escalation_direct", re: /(you (should|need to|must) .{0,40}(call|go|seek|contact|visit)|call (an ambulance|emergency services|your local emergency|911|112|108|000)|go(ing)? to the (nearest )?(emergency department|emergency room|ER|casualty)|this (is|may be) a medical emergency|seek immediate emergency care)/i },
    { level: URGENCY.SAME_DAY, label: "same_day", re: /(same[- ]?day|see a doctor today|today if possible|urgent care|within 24 hours|evaluated today)/i },
    { level: URGENCY.SOON, label: "soon", re: /(book an appointment|within (the next )?(few days|week)|make an appointment soon|schedule an appointment)/i },
];

function highestLevel(rules, text) {
    const lower = String(text || "").toLowerCase();
    for (const rule of rules) {
        if (rule.re.test(lower)) return rule;
    }
    return null;
}

/**
 * Screen a user message.
 * @returns {{ urgency: string, safety_flag: boolean, matched: string|null }}
 */
function triageUserText(text) {
    const emergency = highestLevel(EMERGENCY_RULES, text);
    if (emergency) {
        return { urgency: URGENCY.EMERGENCY, safety_flag: true, matched: emergency.label };
    }
    const sameDay = highestLevel(SAME_DAY_RULES, text);
    if (sameDay) {
        return { urgency: URGENCY.SAME_DAY, safety_flag: false, matched: sameDay.label };
    }
    const soon = highestLevel(SOON_RULES, text);
    if (soon) {
        return { urgency: URGENCY.SOON, safety_flag: false, matched: soon.label };
    }
    return { urgency: URGENCY.ROUTINE, safety_flag: false, matched: null };
}

/**
 * Scan a model response for explicit urgency language.
 * @returns {string} highest urgency level mentioned, or "routine".
 */
function scanResponse(text) {
    const lower = String(text || "").toLowerCase();
    let best = URGENCY.ROUTINE;
    for (const rule of RESPONSE_RULES) {
        if (rule.re.test(lower) && URGENCY_RANK[rule.level] > URGENCY_RANK[best]) {
            best = rule.level;
        }
    }
    return best;
}

/**
 * Final urgency = rule-based screen on the user message, optionally raised by
 * the model's own escalation language — but only when the user message already
 * carried a non-routine signal. Educational responses to routine or general
 * questions must not trigger the emergency banner.
 */
function finalUrgency(userTriage, responseUrgency) {
    if (userTriage.urgency === URGENCY.ROUTINE) return URGENCY.ROUTINE;
    return URGENCY_RANK[responseUrgency] > URGENCY_RANK[userTriage.urgency]
        ? responseUrgency
        : userTriage.urgency;
}

module.exports = { URGENCY, triageUserText, scanResponse, finalUrgency };