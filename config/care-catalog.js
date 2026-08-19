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
];

function findCareOptions(text) {
    const query = String(text || "").toLowerCase();
    return CARE_OPTIONS.find((item) => item.keywords.some((keyword) => query.includes(keyword))) || null;
}

function isCareNavigationRequest(text) {
    return /\b(hospital|clinic|doctor|specialist|treatment|surgery|procedure|cost|price|where should|recommend|referred|diagnos(?:ed|is)|next step)\b/i.test(String(text || ""));
}

module.exports = { CARE_OPTIONS, findCareOptions, isCareNavigationRequest };
