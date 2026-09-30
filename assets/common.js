// ===== بيانات عامة مشتركة =====
const TEACHER = {
    name: "سيف محمد",
    nameEn: "Mr. Saif Mohamed",
    grade: "الرياضيات - الصف الخامس الابتدائى",
    term: "الفصل الدراسى الأول",
    unit: "الوحدة الأولى - المفهوم 1-2 : جمع وطرح الكسور العشرية"
};

const LESSONS = {
    "6": {
        title: "تقدير مجموع الأعداد العشرية", order: "الدرس السادس", color: "from-blue-600 to-indigo-700", icon: "fa-plus",
        tips: [
            "لتقدير المجموع: نقرّب كل عدد أولًا، ثم نجمع الأعداد المقرَّبة.",
            "التقريب لأقرب عدد صحيح: ننظر إلى رقم الأجزاء من عشرة ($2.361 + 3.783 ≈ 2 + 4 = 6$).",
            "التقريب لأقرب جزء من عشرة: ننظر إلى رقم الأجزاء من مائة ($2.4 + 3.8 = 6.2$).",
            "الأعداد المميزة: $4.981 + 5.019 ≈ 5 + 5 = 10$",
            "إذا كان الرقم الذى ننظر إليه 5 أو أكبر نقرّب لأعلى، وإذا كان أقل من 5 نقرّب لأسفل."
        ]
    },
    "9": {
        title: "تقدير الفرق بين عددين عشريين", order: "الدرس التاسع", color: "from-orange-500 to-red-600", icon: "fa-minus",
        tips: [
            "لتقدير الفرق: نقرّب كل عدد أولًا، ثم نطرح العددين المقرَّبين.",
            "مثال: $29.98 − 11.99 ≈ 30 − 12 = 18$ والناتج الفعلى $17.99$",
            "عندما يكون العددان متقاربين نقرّب لأقرب جزء من عشرة: $4.45 − 4.32 ≈ 4.5 − 4.3 = 0.2$",
            "كلمات مثل: حوالى ، تقريبًا ، ما يقرب من ، تدل على أن العدد مقدَّر."
        ]
    }
};

// ===== تنسيق النصوص الرياضية =====
// $...$  => تعبير رياضى يُعرض من اليسار لليمين
// {a/b}  => كسر مكتوب بشكل رأسى (بسط فوق مقام)
function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function fracify(s) {
    return s.replace(/\{([^{}\/]+)\/([^{}]+)\}/g, '<span class="frac"><span class="num">$1</span><span class="den">$2</span></span>');
}
const TK_OPEN = "", TK_CLOSE = "";
const MATH_RUN = /[0-9A-Za-z(−\-+|][0-9A-Za-z.,:×÷+\-−=<>≤≥≠≈\/()°%²³ \t|]*[0-9A-Za-z)°%²³|]|[0-9A-Za-z]/g;
function fmt(raw) {
    const store = [];
    // كل جزء محفوظ يُستبدل بحرف واحد من المنطقة الخاصة (بدون أرقام) حتى لا يتأثر بعزل الأرقام
    const tok = html => { store.push(html); return String.fromCharCode(0xE100 + store.length - 1); };
    let s = String(raw);
    const hasArabic = /[؀-ۿ]/.test(s.replace(/\$[^$]*\$/g, ""));
    s = escapeHtml(s).replace(/&(amp|lt|gt);/g, m => tok(m));
    s = s.replace(/\$([^$]+)\$/g, (m, inner) => tok('<span class="m" dir="ltr">' + fracify(inner) + '</span>'));
    if (hasArabic) s = s.replace(MATH_RUN, m => '<span class="m" dir="ltr">' + m + '</span>');
    else s = '<span class="m" dir="ltr">' + s + '</span>';
    for (let i = 0; i < 4 && /[\uE100-\uEFFF]/.test(s); i++) s = s.replace(/[\uE100-\uEFFF]/g, c => store[c.charCodeAt(0) - 0xE100]);
    return s;
}
