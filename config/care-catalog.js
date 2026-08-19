/* Curated, local demo data mirrored from meddatabase.sql. */

const CARE_OPTIONS = [
    {
        treatment: "Knee replacement",
        keywords: ["knee", "joint replacement", "arthritis"],
        hospitals: [
            { name: "Bathinda General Hospital", city: "Bathinda, Punjab", cost: "₹2,50,000", note: "Joint replacement and trauma care" },
            { name: "Jaipur Multispeciality Hospital", city: "Jaipur, Rajasthan", cost: "₹3,00,000", note: "Advanced knee replacement and sports injury care" },
            { name: "Patiala City Hospital", city: "Patiala, Punjab", cost: "₹2,20,000", note: "Standard knee replacement and orthopedic trauma" },
        ],
        sponsored: { name: "Jaipur Multispeciality Hospital", city: "Jaipur, Rajasthan", label: "Sponsored care navigation", note: "Ask about orthopedic consultation availability" },
    },
    {
        treatment: "Heart angioplasty",
        keywords: ["angioplasty", "heart", "cardiac", "coronary"],
        hospitals: [
            { name: "Bathinda General Hospital", city: "Bathinda, Punjab", cost: "₹1,80,000", note: "Standard angioplasty procedure" },
            { name: "Fortis Ludhiana", city: "Ludhiana, Punjab", cost: "₹2,20,000", note: "Advanced angioplasty and cardiac catheterization" },
            { name: "Delhi Advanced Medical Institute", city: "Delhi", cost: "₹3,50,000", note: "Advanced cardiac intervention" },
        ],
    },
    {
        treatment: "MRI diagnostic scan",
        keywords: ["mri", "magnetic resonance", "brain scan", "spine scan"],
        hospitals: [
            { name: "Fortis Ludhiana", city: "Ludhiana, Punjab", cost: "₹7,000", note: "MRI diagnostic scan" },
            { name: "Chandigarh Medical Centre", city: "Chandigarh", cost: "₹6,500", note: "MRI brain and spine scan" },
            { name: "Mohali Health Institute", city: "Mohali, Punjab", cost: "₹7,500", note: "MRI diagnostic imaging" },
        ],
    },
    {
        treatment: "Cataract surgery",
        keywords: ["cataract", "eye surgery", "vision"],
        hospitals: [
            { name: "Chandigarh Medical Centre", city: "Chandigarh", cost: "₹55,000", note: "Standard cataract surgery" },
            { name: "Mohali Health Institute", city: "Mohali, Punjab", cost: "₹60,000", note: "Cataract surgery with premium lens" },
        ],
    },
    {
        treatment: "Appendectomy",
        keywords: ["appendectomy", "appendicitis", "appendix"],
        hospitals: [
            { name: "Fortis Ludhiana", city: "Ludhiana, Punjab", cost: "₹45,000", note: "Laparoscopic appendectomy" },
            { name: "Delhi Advanced Medical Institute", city: "Delhi", cost: "₹60,000", note: "Advanced laparoscopic appendectomy" },
            { name: "Patiala City Hospital", city: "Patiala, Punjab", cost: "₹40,000", note: "Appendectomy surgery" },
        ],
    },
    {
        treatment: "Cancer care",
        keywords: ["cancer", "oncology", "tumor", "chemotherapy", "radiotherapy"],
        hospitals: [
            { name: "Tata Memorial Hospital", city: "Mumbai, Maharashtra", cost: "₹1,00,000–₹12,00,000", note: "Comprehensive oncology and cancer surgery" },
            { name: "AIIMS New Delhi", city: "New Delhi", cost: "₹80,000–₹10,00,000", note: "Medical, surgical and radiation oncology" },
            { name: "Apollo Hospitals", city: "Chennai, Tamil Nadu", cost: "₹2,00,000–₹15,00,000", note: "Multidisciplinary cancer care" },
        ],
        sponsored: { name: "Apollo Hospitals", city: "Chennai, Tamil Nadu", label: "Sponsored care navigation", note: "Ask about oncology second-opinion services" },
    },
    {
        treatment: "Neurology and stroke care",
        keywords: ["stroke", "neurology", "brain tumor", "epilepsy", "parkinson", "seizure"],
        hospitals: [
            { name: "NIMHANS", city: "Bengaluru, Karnataka", cost: "₹25,000–₹8,00,000", note: "National centre for neurology and neurosurgery" },
            { name: "AIIMS New Delhi", city: "New Delhi", cost: "₹30,000–₹10,00,000", note: "Neurology, neurosurgery and stroke services" },
            { name: "Apollo Hospitals", city: "Hyderabad, Telangana", cost: "₹50,000–₹12,00,000", note: "Advanced neuro and stroke care" },
        ],
    },
    {
        treatment: "Kidney care and transplant",
        keywords: ["kidney", "renal", "dialysis", "kidney transplant", "nephrology"],
        hospitals: [
            { name: "Institute of Kidney Diseases and Research Centre", city: "Ahmedabad, Gujarat", cost: "₹50,000–₹8,00,000", note: "Nephrology and transplant services" },
            { name: "Medanta Hospital", city: "Gurugram, Haryana", cost: "₹2,00,000–₹15,00,000", note: "Kidney transplant and complex nephrology" },
            { name: "Apollo Hospitals", city: "Chennai, Tamil Nadu", cost: "₹2,00,000–₹14,00,000", note: "Transplant and dialysis programmes" },
        ],
    },
];

function findCareOptions(text) {
    const query = String(text || "").toLowerCase();
    return CARE_OPTIONS.find((item) => item.keywords.some((keyword) => query.includes(keyword))) || null;
}

function isCareNavigationRequest(text) {
    return /\b(hospital|clinic|doctor|specialist|treatment|surgery|procedure|cost|price|where should|recommend|referred|diagnos(?:ed|is)|next step)\b/i.test(String(text || ""));
}

module.exports = { CARE_OPTIONS, findCareOptions, isCareNavigationRequest };
