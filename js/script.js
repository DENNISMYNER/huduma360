// ===================================================================
// DATA
// ===================================================================

const CATEGORIES = [
  {
    id: "health",
    name: "Health",
    icon: "🏥",
    desc: "Coverage, facilities and medical services",
  },
  {
    id: "land",
    name: "Land & Housing",
    icon: "🏠",
    desc: "Land records, titles, rates and housing programs",
  },
  {
    id: "identity",
    name: "Identity & Civil Registration",
    icon: "🪪",
    desc: "IDs, certificates and passports",
  },
  {
    id: "transport",
    name: "Transport",
    icon: "🚗",
    desc: "Licences, vehicles and road services",
  },
  {
    id: "education",
    name: "Education",
    icon: "🎓",
    desc: "Placement, funding and student services",
  },
  {
    id: "business",
    name: "Business",
    icon: "💼",
    desc: "Registration, permits and licensing",
  },
  {
    id: "tax",
    name: "Taxes & Revenue",
    icon: "💰",
    desc: "KRA services, returns and compliance",
  },
  {
    id: "justice",
    name: "Justice & Legal",
    icon: "⚖️",
    desc: "Courts, case tracking and legal aid",
  },
  {
    id: "agriculture",
    name: "Agriculture",
    icon: "🌾",
    desc: "Farmer support, subsidies and licences",
  },
  {
    id: "county",
    name: "County Services",
    icon: "🏛️",
    desc: "Local permits, rates and county contacts",
  },
];

// helper to shorten service definitions below
const svc = (id, categoryId, name, desc, opts = {}) => ({
  id,
  categoryId,
  name,
  desc,
  fee: opts.fee ?? 0,
  processingTime: opts.time || "3–5 working days",
  eligibility: opts.eligibility || [
    "Kenyan citizen or legal resident",
    "Valid identification document",
  ],
  documents: opts.documents || [
    "National ID or passport",
    "Passport-size photo",
  ],
  steps: opts.steps || [
    "Create or log in to your account",
    "Fill in the application form",
    "Upload required documents",
    "Submit and pay any applicable fee",
    "Track status under My Applications",
  ],
  popular: !!opts.popular,
});

const SERVICES = [
  // HEALTH
  svc(
    "h1",
    "health",
    "SHA Registration & Coverage",
    "Register for the Social Health Authority (SHA) scheme and check your coverage status.",
    {
      fee: 0,
      time: "Instant – 2 days",
      popular: true,
      eligibility: ["Kenyan citizen aged 18+", "Valid National ID"],
      documents: [
        "National ID",
        "Phone number for verification",
        "KRA PIN (optional)",
      ],
      steps: [
        "Provide your National ID number",
        "Verify your phone number via OTP",
        "Choose your household details",
        "Confirm registration",
      ],
    },
  ),
  svc(
    "h2",
    "health",
    "Find a Health Facility",
    "Search public, private and faith-based health facilities near you by county and services offered.",
    { fee: 0, time: "Instant" },
  ),
  svc(
    "h3",
    "health",
    "Health Insurance Services",
    "Manage contributions, view claims and update your SHA/insurance details.",
    { fee: 0, time: "1–3 working days" },
  ),
  svc(
    "h4",
    "health",
    "NHIF/SHA Information",
    "View historical NHIF records and understand the transition to SHA.",
    { fee: 0, time: "Instant" },
  ),
  svc(
    "h5",
    "health",
    "Medical Assistance Fund",
    "Apply for the Emergency Medical Fund for critical or emergency treatment support.",
    {
      fee: 0,
      time: "5–10 working days",
      documents: [
        "National ID",
        "Medical report from a licensed facility",
        "Cost estimate from hospital",
      ],
    },
  ),
  svc(
    "h6",
    "health",
    "Medical / Health Certificate",
    "Apply for an official medical fitness certificate for employment, school or travel.",
    {
      fee: 1050,
      time: "3–5 working days",
      documents: [
        "National ID",
        "Referral or request letter",
        "Passport photo",
      ],
    },
  ),

  // LAND & HOUSING
  svc(
    "l1",
    "land",
    "Land Search",
    "Search land ownership, encumbrance and registration details for a parcel.",
    {
      fee: 500,
      time: "3–7 working days",
      popular: true,
      documents: ["Parcel/title number", "National ID"],
    },
  ),
  svc(
    "l2",
    "land",
    "Title Deed Services",
    "Apply for a new title deed, replacement, or transfer of ownership.",
    {
      fee: 5000,
      time: "2–4 weeks",
      documents: [
        "National ID",
        "Land control board consent",
        "Signed transfer forms",
      ],
    },
  ),
  svc(
    "l3",
    "land",
    "Land Rates Payment",
    "Check and pay outstanding land rates for a property.",
    { fee: 0, time: "Instant" },
  ),
  svc(
    "l4",
    "land",
    "Property Information",
    "View zoning, valuation and registered property details.",
    { fee: 300, time: "1–3 working days" },
  ),
  svc(
    "l5",
    "land",
    "Housing Programs",
    "Browse affordable housing units and check application eligibility.",
    { fee: 0, time: "Varies" },
  ),
  svc(
    "l6",
    "land",
    "Affordable Housing Application",
    "Apply for a unit under the Affordable Housing Programme.",
    {
      fee: 0,
      time: "4–8 weeks",
      popular: true,
      documents: [
        "National ID",
        "KRA PIN",
        "Proof of income",
        "Boma Yangu account",
      ],
      steps: [
        "Register on the housing portal",
        "Save towards your deposit",
        "Select a project and unit",
        "Submit application for review",
        "Await allocation notification",
      ],
    },
  ),

  // IDENTITY
  svc(
    "i1",
    "identity",
    "National ID Application",
    "Apply for a first-time National Identity Card.",
    {
      fee: 0,
      time: "2–4 weeks",
      popular: true,
      eligibility: ["Kenyan citizen aged 18 or turning 18"],
      documents: [
        "Birth certificate",
        "Parents' National IDs",
        "Passport photo",
      ],
      steps: [
        "Visit or start application online",
        "Fill in Huduma Namba details",
        "Book biometric capture appointment",
        "Attend appointment for fingerprints & photo",
        "Collect ID or request delivery",
      ],
    },
  ),
  svc(
    "i2",
    "identity",
    "Birth Certificate",
    "Apply for a new birth certificate or a certified copy.",
    {
      fee: 150,
      time: "5–10 working days",
      popular: true,
      documents: [
        "Notification of birth",
        "Parents' National IDs",
        "Hospital discharge summary",
      ],
    },
  ),
  svc(
    "i3",
    "identity",
    "Death Certificate",
    "Register a death and apply for an official death certificate.",
    {
      fee: 150,
      time: "5–10 working days",
      documents: ["Notification of death", "Burial permit", "Next of kin ID"],
    },
  ),
  svc(
    "i4",
    "identity",
    "Passport Services",
    "Apply for a new passport, renewal, or replacement of a lost passport.",
    {
      fee: 7550,
      time: "10–15 working days",
      popular: true,
      documents: [
        "National ID",
        "Birth certificate",
        "Passport photo (white background)",
        "Old passport (if renewing)",
      ],
      steps: [
        "Complete the online application",
        "Pay the passport fee",
        "Book an appointment at a passport office",
        "Submit biometrics in person",
        "Collect your passport or request delivery",
      ],
    },
  ),
  svc(
    "i5",
    "identity",
    "Marriage Certificate",
    "Register a civil, customary or religious marriage and obtain a certificate.",
    {
      fee: 2600,
      time: "5–15 working days",
      documents: [
        "National IDs of both parties",
        "Passport photos",
        "Sworn affidavit (customary marriages)",
      ],
    },
  ),
  svc(
    "i6",
    "identity",
    "Citizenship Services",
    "Apply for citizenship by registration, birth confirmation, or dual citizenship.",
    {
      fee: 10000,
      time: "3–6 months",
      documents: [
        "Proof of residency",
        "National ID or foreign passport",
        "Supporting affidavits",
      ],
    },
  ),

  // TRANSPORT
  svc(
    "t1",
    "transport",
    "Driving Licence",
    "Apply for a new driving licence or renew an existing one.",
    {
      fee: 3050,
      time: "5–10 working days",
      popular: true,
      documents: [
        "National ID",
        "Certificate of good conduct",
        "Medical report (Form 129)",
      ],
    },
  ),
  svc(
    "t2",
    "transport",
    "Vehicle Registration",
    "Register a new or imported vehicle and obtain a logbook.",
    {
      fee: 8000,
      time: "7–14 working days",
      documents: [
        "Import declaration form",
        "National ID / company PIN",
        "Pre-export inspection certificate",
      ],
    },
  ),
  svc(
    "t3",
    "transport",
    "Vehicle Inspection",
    "Book a mandatory inspection for commercial or PSV vehicles.",
    { fee: 2500, time: "Same day – 3 days" },
  ),
  svc(
    "t4",
    "transport",
    "Number Plate Services",
    "Apply for replacement, custom or additional number plates.",
    { fee: 3000, time: "5–10 working days" },
  ),
  svc(
    "t5",
    "transport",
    "Driving Test Booking",
    "Book a practical or theory driving test slot.",
    { fee: 1000, time: "Slot dependent" },
  ),
  svc(
    "t6",
    "transport",
    "Traffic Fine & Offence Services",
    "Check and pay outstanding traffic offence notices (NTSA).",
    { fee: 0, time: "Instant" },
  ),

  // EDUCATION
  svc(
    "e1",
    "education",
    "KUCCPS Placement",
    "Apply for or check university and college placement.",
    { fee: 0, time: "Per admission cycle", popular: true },
  ),
  svc(
    "e2",
    "education",
    "HELB Loan Application",
    "Apply for a HELB loan or bursary for higher education.",
    {
      fee: 0,
      time: "4–8 weeks",
      popular: true,
      documents: [
        "National ID",
        "Admission letter",
        "Parent/guardian ID",
        "Introduction letter from chief",
      ],
    },
  ),
  svc(
    "e3",
    "education",
    "Scholarships",
    "Browse and apply for national and county government scholarships.",
    { fee: 0, time: "Varies" },
  ),
  svc(
    "e4",
    "education",
    "Student Services Portal",
    "Manage your student profile, results slips and college transfers.",
    { fee: 0, time: "Instant – 3 days" },
  ),
  svc(
    "e5",
    "education",
    "School Information",
    "Search registered schools, capacity and NEMIS details.",
    { fee: 0, time: "Instant" },
  ),
  svc(
    "e6",
    "education",
    "Examination Services (KNEC)",
    "Register for KCPE/KCSE exams and access results verification.",
    { fee: 0, time: "Per exam cycle" },
  ),

  // BUSINESS
  svc(
    "b1",
    "business",
    "Business Name Registration",
    "Register a sole proprietorship or partnership business name.",
    {
      fee: 950,
      time: "1–3 working days",
      popular: true,
      documents: ["National ID", "Proposed business name(s)", "KRA PIN"],
    },
  ),
  svc(
    "b2",
    "business",
    "Business Permits",
    "Apply for a single business permit for your trading premises.",
    { fee: 0, time: "3–5 working days" },
  ),
  svc(
    "b3",
    "business",
    "Company Registration",
    "Incorporate a limited company and obtain a certificate of incorporation.",
    {
      fee: 10650,
      time: "3–7 working days",
      documents: [
        "National IDs of directors",
        "KRA PINs of directors",
        "Proposed company name",
      ],
    },
  ),
  svc(
    "b4",
    "business",
    "Business Licences",
    "Apply for sector-specific operating licences (food, health, alcohol, etc).",
    { fee: 0, time: "Varies by licence" },
  ),
  svc(
    "b5",
    "business",
    "Business Name Search",
    "Check availability of a proposed business or company name.",
    { fee: 150, time: "Instant – 1 day" },
  ),
  svc(
    "b6",
    "business",
    "eCitizen Business Services",
    "Access linked business services such as tax compliance and permits.",
    { fee: 0, time: "Instant" },
  ),

  // TAX
  svc(
    "x1",
    "tax",
    "KRA PIN Registration",
    "Register for a Personal Identification Number (PIN) with KRA.",
    {
      fee: 0,
      time: "Instant",
      popular: true,
      documents: ["National ID", "Email address"],
    },
  ),
  svc(
    "x2",
    "tax",
    "File Tax Returns",
    "File your annual individual or business income tax returns.",
    {
      fee: 0,
      time: "Instant",
      popular: true,
      documents: [
        "KRA PIN",
        "P9 form (employees)",
        "Financial statements (businesses)",
      ],
    },
  ),
  svc(
    "x3",
    "tax",
    "Tax Compliance Certificate",
    "Apply for a Tax Compliance Certificate (TCC) for tenders or employment.",
    { fee: 0, time: "Instant – 3 days" },
  ),
  svc(
    "x4",
    "tax",
    "Tax Payment (KRA)",
    "Generate a payment slip and pay taxes due via M-Pesa, card or bank.",
    { fee: 0, time: "Instant" },
  ),
  svc(
    "x5",
    "tax",
    "Customs Services",
    "Access import/export duty information and customs declarations.",
    { fee: 0, time: "Varies" },
  ),
  svc(
    "x6",
    "tax",
    "PIN Certificate Retrieval",
    "Retrieve a lost or forgotten KRA PIN certificate.",
    { fee: 0, time: "Instant" },
  ),

  // JUSTICE
  svc(
    "j1",
    "justice",
    "Court Case Search",
    "Search the status and cause list of a court case by case number.",
    { fee: 0, time: "Instant" },
  ),
  svc(
    "j2",
    "justice",
    "e-Filing of Court Documents",
    "File pleadings and documents electronically with the Judiciary.",
    { fee: 0, time: "1–2 working days" },
  ),
  svc(
    "j3",
    "justice",
    "Legal Resources",
    "Access legal guides, statutes and self-help resources.",
    { fee: 0, time: "Instant" },
  ),
  svc(
    "j4",
    "justice",
    "Small Claims Court",
    "File or track a small claims case (up to KES 1,000,000).",
    {
      fee: 1000,
      time: "Hearing within 60 days",
      popular: true,
      documents: ["National ID", "Statement of claim", "Evidence/receipts"],
    },
  ),
  svc(
    "j5",
    "justice",
    "Legal Aid Services",
    "Apply for state-funded legal aid if you cannot afford representation.",
    {
      fee: 0,
      time: "5–10 working days",
      documents: ["National ID", "Means-testing declaration", "Case summary"],
    },
  ),
  svc(
    "j6",
    "justice",
    "Certified Court Documents",
    "Request certified copies of judgments, orders or rulings.",
    { fee: 500, time: "3–5 working days" },
  ),

  // AGRICULTURE
  svc(
    "a1",
    "agriculture",
    "Farmer Registration (KilimoSTAT)",
    "Register as a farmer to access government agricultural programs.",
    { fee: 0, time: "Instant – 3 days", popular: true },
  ),
  svc(
    "a2",
    "agriculture",
    "Agricultural Subsidies",
    "Apply for input subsidies including seeds and equipment support.",
    { fee: 0, time: "Per season cycle" },
  ),
  svc(
    "a3",
    "agriculture",
    "Fertilizer Subsidy Program",
    "Access the e-Voucher system for subsidized fertilizer.",
    {
      fee: 0,
      time: "Per season",
      documents: [
        "National ID",
        "Farmer registration number",
        "Land parcel details",
      ],
    },
  ),
  svc(
    "a4",
    "agriculture",
    "Livestock Services",
    "Register livestock, request veterinary services and movement permits.",
    { fee: 200, time: "1–3 working days" },
  ),
  svc(
    "a5",
    "agriculture",
    "Agricultural Licences",
    "Apply for licences covering produce trade, milling and export.",
    { fee: 1500, time: "5–10 working days" },
  ),
  svc(
    "a6",
    "agriculture",
    "Market Information System",
    "View real-time crop and livestock market prices by region.",
    { fee: 0, time: "Instant" },
  ),

  // COUNTY
  svc(
    "c1",
    "county",
    "County Business Permits",
    "Apply for a single business permit issued by your county government.",
    { fee: 0, time: "3–5 working days", popular: true },
  ),
  svc(
    "c2",
    "county",
    "County Rates & Levies",
    "View and pay county rates, parking and cess levies.",
    { fee: 0, time: "Instant" },
  ),
  svc(
    "c3",
    "county",
    "County Business Licences",
    "Apply for county-issued sector licences (markets, liquor, health).",
    { fee: 0, time: "Varies" },
  ),
  svc(
    "c4",
    "county",
    "Waste Management Services",
    "Request garbage collection services or report illegal dumping.",
    { fee: 0, time: "1–3 working days" },
  ),
  svc(
    "c5",
    "county",
    "Local Government Services",
    "Access ward-level services including social services and bursaries.",
    { fee: 0, time: "Varies" },
  ),
  svc(
    "c6",
    "county",
    "County Contacts Directory",
    "Find contact details for county offices and departments.",
    { fee: 0, time: "Instant" },
  ),
];

const ANNOUNCEMENTS = [
  {
    title: "SHA registration now open nationwide",
    body: "All citizens are encouraged to complete SHA registration to maintain uninterrupted access to health coverage.",
    date: "28 Aug 2026",
  },
  {
    title: "Passport appointment slots added",
    body: "Additional biometric capture slots have been released at regional passport offices for September.",
    date: "20 Aug 2026",
  },
  {
    title: "HELB second-round applications open",
    body: "Continuing students can now apply for the second disbursement cycle of the academic year.",
    date: "12 Aug 2026",
  },
];

const SAMPLE_APPLICATIONS = [
  {
    id: "app1",
    serviceName: "Land Search",
    status: "processing",
    progress: 65,
    ref: "H360-LS-88213",
  },
  {
    id: "app2",
    serviceName: "Passport Services",
    status: "approved",
    progress: 100,
    ref: "H360-PP-40217",
  },
  {
    id: "app3",
    serviceName: "County Business Permits",
    status: "payment",
    progress: 40,
    ref: "H360-BP-11209",
  },
  {
    id: "app4",
    serviceName: "National ID Application",
    status: "submitted",
    progress: 15,
    ref: "H360-ID-77004",
  },
];

// ===================================================================
// STATE (persisted to localStorage)
// ===================================================================

const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

let state = {
  theme: store.get("h360_theme", "light"),
  saved: store.get("h360_saved", []),
  recent: store.get("h360_recent", []),
  applications: store.get("h360_applications", SAMPLE_APPLICATIONS),
  activeCategory: null,
  activeSubcat: "all",
};

function persist() {
  store.set("h360_saved", state.saved);
  store.set("h360_recent", state.recent);
  store.set("h360_applications", state.applications);
}

// ===================================================================
// UTIL
// ===================================================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const byId = (id) => SERVICES.find((s) => s.id === id);
const catById = (id) => CATEGORIES.find((c) => c.id === id);
const fmtFee = (fee) => (fee > 0 ? `KES ${fee.toLocaleString()}` : "Free");

function toast(message, type = "") {
  const stack = $("#toastStack");
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity .2s ease";
    setTimeout(() => el.remove(), 200);
  }, 2800);
}

function openOverlay(overlay) {
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeOverlay(overlay) {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

// ===================================================================
// THEME
// ===================================================================

function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  store.set("h360_theme", state.theme);
}
$("#themeToggle").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme();
});
applyTheme();

// ===================================================================
// MOBILE DRAWER
// ===================================================================

const drawer = $("#drawer");
const drawerOverlay = $("#drawerOverlay");
function openDrawer() {
  drawer.classList.add("open");
  drawerOverlay.classList.add("open");
}
function closeDrawer() {
  drawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
}
$("#menuToggle").addEventListener("click", openDrawer);
$("#drawerClose").addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);
$$(".drawer-link[data-close]").forEach((l) =>
  l.addEventListener("click", closeDrawer),
);

// ===================================================================
// RENDER: QUICK ACTIONS, POPULAR, CATEGORIES, RECENT, SAVED, APPS, ANNOUNCEMENTS
// ===================================================================

const QUICK_ACTIONS = [
  { emoji: "🪪", label: "Apply for National ID", serviceId: "i1" },
  { emoji: "🛂", label: "Passport Services", serviceId: "i4" },
  { emoji: "🏥", label: "SHA Registration", serviceId: "h1" },
  { emoji: "🚗", label: "Driving Licence", serviceId: "t1" },
];

function renderQuickActions() {
  $("#quickActions").innerHTML = QUICK_ACTIONS.map(
    (qa) => `
    <button class="quick-action-btn" data-service="${qa.serviceId}">
      <span class="qa-emoji">${qa.emoji}</span> ${qa.label}
    </button>`,
  ).join("");
  $("#quickActions").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-service]");
    if (btn) openServiceModal(btn.dataset.service);
  });
}

function miniCardHTML(s) {
  const cat = catById(s.categoryId);
  return `
    <button class="mini-card" data-service="${s.id}">
      <div class="mini-card-top">
        <span class="mini-card-icon">${cat.icon}</span>
        ${s.popular ? '<span class="mini-card-badge">Popular</span>' : ""}
      </div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <span class="mini-card-cat">${cat.name}</span>
    </button>`;
}

function renderPopular() {
  const popular = SERVICES.filter((s) => s.popular);
  $("#popularRow").innerHTML = popular.map(miniCardHTML).join("");
}

function renderCategories() {
  $("#categoryGrid").innerHTML = CATEGORIES.map((c) => {
    const count = SERVICES.filter((s) => s.categoryId === c.id).length;
    return `
      <button class="category-card" data-category="${c.id}">
        <div class="category-card-icon">${c.icon}</div>
        <h3>${c.name}</h3>
        <p>${c.desc}</p>
        <span class="category-card-count">${count} services &rarr;</span>
      </button>`;
  }).join("");
}

function renderRecent() {
  const items = state.recent.map(byId).filter(Boolean);
  $("#recentRow").innerHTML = items.map(miniCardHTML).join("");
  $("#recentRow").hidden = items.length === 0;
  $("#recentEmpty").hidden = items.length !== 0;
}

function renderSaved() {
  const items = state.saved.map(byId).filter(Boolean);
  $("#savedRow").innerHTML = items.map(miniCardHTML).join("");
  $("#savedRow").hidden = items.length === 0;
  $("#savedEmpty").hidden = items.length !== 0;
}

const STATUS_LABEL = {
  processing: "Processing",
  approved: "Approved",
  payment: "Payment Required",
  submitted: "Submitted",
};

function renderApplications() {
  $("#applicationsList").innerHTML = state.applications
    .map(
      (a) => `
    <div class="application-item">
      <div class="application-info">
        <h4>${a.serviceName}</h4>
        <span>Ref: ${a.ref}</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${a.progress}%"></div></div>
      <span class="progress-pct">${a.progress}%</span>
      <span class="application-status status-${a.status}">${STATUS_LABEL[a.status]}</span>
    </div>`,
    )
    .join("");
}

function renderAnnouncements() {
  $("#announcementList").innerHTML = ANNOUNCEMENTS.map(
    (a) => `
    <div class="announcement-item">
      <h4>${a.title}</h4>
      <p>${a.body}</p>
      <span class="announcement-date">${a.date}</span>
    </div>`,
  ).join("");
}

// clicking any mini-card / service card opens the modal (event delegation)
document.addEventListener("click", (e) => {
  const card = e.target.closest("[data-service]");
  if (card && !e.target.closest(".save-btn") && !e.target.closest(".btn")) {
    openServiceModal(card.dataset.service);
  }
});

// ===================================================================
// CATEGORY DETAIL VIEW
// ===================================================================

function serviceCardHTML(s) {
  const isSaved = state.saved.includes(s.id);
  return `
    <div class="service-card">
      <div class="service-card-top">
        <h3>${s.name}</h3>
        <button class="save-btn ${isSaved ? "saved" : ""}" data-save="${s.id}" aria-label="Save service">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2.4 4.5 6 4.2c2-.2 3.7 1 4.9 2.6C12.3 5.2 14 4 16 4.2c3.6.3 5.5 3.8 4 7.5C19.5 16.4 12 21 12 21z" fill="${isSaved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8"/></svg>
        </button>
      </div>
      <p class="service-card-desc">${s.desc}</p>
      <div class="service-card-meta">
        <span>⏱ ${s.processingTime}</span>
        <span class="badge ${s.fee > 0 ? "badge-fee" : "badge-free"}">${fmtFee(s.fee)}</span>
      </div>
      <div class="service-card-actions">
        <button class="btn btn-outline" data-service="${s.id}">View details</button>
      </div>
    </div>`;
}

function openCategoryView(categoryId, subcatId = "all") {
  state.activeCategory = categoryId;
  state.activeSubcat = subcatId;
  const cat = catById(categoryId);
  const services = SERVICES.filter((s) => s.categoryId === categoryId);

  $("#categoryViewHead").innerHTML = `
    <div class="icon-box">${cat.icon}</div>
    <div><h2>${cat.name}</h2><p>${cat.desc}</p></div>`;

  $("#subcatTabs").innerHTML = [
    `<button class="subcat-tab ${subcatId === "all" ? "active" : ""}" data-subcat="all">All (${services.length})</button>`,
  ]
    .concat(
      services.map(
        (s) =>
          `<button class="subcat-tab ${subcatId === s.id ? "active" : ""}" data-subcat="${s.id}">${s.name}</button>`,
      ),
    )
    .join("");

  renderCategoryServices();

  $("#browseWrap").hidden = true;
  $("#searchResultsSection").hidden = true;
  $("#categoryView").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCategoryServices() {
  const services = SERVICES.filter(
    (s) => s.categoryId === state.activeCategory,
  );
  const filtered =
    state.activeSubcat === "all"
      ? services
      : services.filter((s) => s.id === state.activeSubcat);
  $("#categoryServicesGrid").innerHTML = filtered.map(serviceCardHTML).join("");
}

$("#subcatTabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".subcat-tab");
  if (!tab) return;
  state.activeSubcat = tab.dataset.subcat;
  $$("#subcatTabs .subcat-tab").forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
  renderCategoryServices();
});

$("#categoryBackBtn").addEventListener("click", closeCategoryView);
function closeCategoryView() {
  $("#categoryView").hidden = true;
  $("#browseWrap").hidden = false;
}

$("#categoryGrid").addEventListener("click", (e) => {
  const card = e.target.closest("[data-category]");
  if (card) openCategoryView(card.dataset.category);
});

// save button delegation (works in category view & modal)
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-save]");
  if (!btn) return;
  e.stopPropagation();
  toggleSave(btn.dataset.save);
});

function toggleSave(serviceId) {
  const idx = state.saved.indexOf(serviceId);
  if (idx === -1) {
    state.saved.push(serviceId);
    toast("Service saved", "success");
  } else {
    state.saved.splice(idx, 1);
    toast("Removed from saved");
  }
  persist();
  renderSaved();
  if (state.activeCategory) renderCategoryServices();
  const modalBody = $("#serviceModalBody");
  if (modalBody.dataset.service === serviceId)
    openServiceModal(serviceId, true);
}

// ===================================================================
// SERVICE DETAIL MODAL
// ===================================================================

const serviceModalOverlay = $("#serviceModalOverlay");

function openServiceModal(serviceId, silent = false) {
  const s = byId(serviceId);
  if (!s) return;
  const cat = catById(s.categoryId);
  const isSaved = state.saved.includes(s.id);

  $("#serviceModalBody").dataset.service = serviceId;
  $("#serviceModalBody").innerHTML = `
    <div class="sm-header">
      <span class="sm-icon">${cat.icon}</span>
      <div>
        <div class="sm-title">${s.name}</div>
        <div class="sm-cat">${cat.name}</div>
      </div>
    </div>
    <p class="sm-desc">${s.desc}</p>
    <div class="sm-grid">
      <div class="sm-fact"><div class="sm-fact-label">Processing time</div><div class="sm-fact-value">${s.processingTime}</div></div>
      <div class="sm-fact"><div class="sm-fact-label">Service fee</div><div class="sm-fact-value">${fmtFee(s.fee)}</div></div>
    </div>
    <div class="sm-block">
      <h4>Eligibility</h4>
      <ul class="sm-list">${s.eligibility.map((x) => `<li>${x}</li>`).join("")}</ul>
    </div>
    <div class="sm-block">
      <h4>Required documents</h4>
      <ul class="sm-list">${s.documents.map((x) => `<li>${x}</li>`).join("")}</ul>
    </div>
    <div class="sm-block">
      <h4>Step-by-step process</h4>
      <ol class="sm-steps">${s.steps.map((x) => `<li>${x}</li>`).join("")}</ol>
    </div>
    <div class="sm-actions">
      <button class="btn btn-green" id="startApplicationBtn">Start Application</button>
      <button class="btn btn-outline save-btn ${isSaved ? "saved" : ""}" data-save="${s.id}" style="flex:0 0 auto;width:44px;">
        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2.4 4.5 6 4.2c2-.2 3.7 1 4.9 2.6C12.3 5.2 14 4 16 4.2c3.6.3 5.5 3.8 4 7.5C19.5 16.4 12 21 12 21z" fill="${isSaved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8"/></svg>
      </button>
    </div>`;

  $("#startApplicationBtn").addEventListener("click", () => {
    closeOverlay(serviceModalOverlay);
    openApplyModal(s.id);
  });

  if (!silent) {
    addToRecent(s.id);
    openOverlay(serviceModalOverlay);
  }
}

function addToRecent(serviceId) {
  state.recent = [
    serviceId,
    ...state.recent.filter((id) => id !== serviceId),
  ].slice(0, 8);
  persist();
  renderRecent();
}

$("#serviceModalClose").addEventListener("click", () =>
  closeOverlay(serviceModalOverlay),
);
serviceModalOverlay.addEventListener("click", (e) => {
  if (e.target === serviceModalOverlay) closeOverlay(serviceModalOverlay);
});

// ===================================================================
// APPLICATION / PAYMENT FLOW MODAL
// ===================================================================

const applyModalOverlay = $("#applyModalOverlay");
let applyFlow = {
  service: null,
  step: "form",
  payMethod: "mpesa",
  formData: {},
};

function openApplyModal(serviceId) {
  const s = byId(serviceId);
  applyFlow = { service: s, step: "form", payMethod: "mpesa", formData: {} };
  renderApplyFlow();
  openOverlay(applyModalOverlay);
}

function renderApplyFlow() {
  const s = applyFlow.service;
  const body = $("#applyModalBody");

  if (applyFlow.step === "form") {
    body.innerHTML = `
      <div class="progress-steps">
        <div class="ps-dot active"></div><div class="ps-dot"></div><div class="ps-dot"></div>
      </div>
      <div class="am-title">Apply — ${s.name}</div>
      <div class="am-sub">Fill in your details to begin this application.</div>
      <div class="form-group" id="fg-name">
        <label>Full name</label>
        <input type="text" id="fld-name" placeholder="e.g. Wanjiru Kamau">
        <div class="form-error">Please enter your full name.</div>
      </div>
      <div class="form-group" id="fg-id">
        <label>National ID number</label>
        <input type="text" id="fld-id" placeholder="e.g. 30xxxxxx" inputmode="numeric">
        <div class="form-error">Enter a valid ID number (7–8 digits).</div>
      </div>
      <div class="form-group" id="fg-phone">
        <label>Phone number</label>
        <input type="text" id="fld-phone" placeholder="e.g. 07xx xxx xxx">
        <div class="form-error">Enter a valid Kenyan phone number.</div>
      </div>
      <div class="form-group" id="fg-county">
        <label>County</label>
        <select id="fld-county">
          <option value="">Select county</option>
          ${["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kilifi", "Uasin Gishu", "Machakos", "Kiambu"].map((c) => `<option>${c}</option>`).join("")}
        </select>
        <div class="form-error">Please select your county.</div>
      </div>
      <button class="btn btn-primary btn-full" id="applyContinueBtn">Continue</button>`;

    $("#applyContinueBtn").addEventListener("click", validateAndContinue);
  }

  if (applyFlow.step === "pay") {
    const fee = s.fee;
    body.innerHTML = `
      <div class="progress-steps">
        <div class="ps-dot active"></div><div class="ps-dot active"></div><div class="ps-dot"></div>
      </div>
      <div class="am-title">Payment <span class="demo-tag">DEMO</span></div>
      <div class="am-sub">${fee > 0 ? "This service requires a fee before submission." : "No fee is required — confirm to submit your application."}</div>
      ${
        fee > 0
          ? `
      <div class="pay-methods" id="payMethods">
        <button class="pay-method active" data-method="mpesa"><span class="pm-emoji">📱</span>M-Pesa</button>
        <button class="pay-method" data-method="card"><span class="pm-emoji">💳</span>Card</button>
        <button class="pay-method" data-method="bank"><span class="pm-emoji">🏦</span>Bank</button>
      </div>
      <div id="payFieldsWrap"></div>
      `
          : ""
      }
      <div class="pay-summary">
        <div class="pay-summary-row"><span>${s.name}</span><span>${fmtFee(fee)}</span></div>
        <div class="pay-summary-row"><span>Processing fee</span><span>${fee > 0 ? "KES 0" : "—"}</span></div>
        <div class="pay-summary-row total"><span>Total</span><span>${fmtFee(fee)}</span></div>
      </div>
      <button class="btn btn-green btn-full" id="payConfirmBtn">${fee > 0 ? "Pay & Submit (Demo)" : "Confirm & Submit"}</button>`;

    if (fee > 0) {
      renderPayFields();
      $("#payMethods").addEventListener("click", (e) => {
        const btn = e.target.closest(".pay-method");
        if (!btn) return;
        applyFlow.payMethod = btn.dataset.method;
        $$(".pay-method").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderPayFields();
      });
    }
    $("#payConfirmBtn").addEventListener("click", processPayment);
  }

  if (applyFlow.step === "processing") {
    body.innerHTML = `
      <div class="progress-steps">
        <div class="ps-dot active"></div><div class="ps-dot active"></div><div class="ps-dot active"></div>
      </div>
      <div class="loading-spinner"></div>
      <p class="loading-text">Processing your ${s.fee > 0 ? "payment" : "submission"}…</p>`;
  }

  if (applyFlow.step === "success" || applyFlow.step === "fail") {
    const ok = applyFlow.step === "success";
    const ref =
      "H360-" +
      s.id.toUpperCase() +
      "-" +
      Math.floor(10000 + Math.random() * 89999);
    body.innerHTML = `
      <div class="result-state">
        <div class="result-icon ${ok ? "success" : "fail"}">${ok ? "✓" : "✕"}</div>
        <div class="am-title">${ok ? "Application submitted" : "Payment failed"}</div>
        <div class="am-sub">${ok ? `Your application for ${s.name} has been received and is now being processed.` : "We couldn't process your demo payment. No real charge was made — please try again."}</div>
        ${ok ? `<div class="result-ref">Reference number: ${ref}</div>` : ""}
        <button class="btn ${ok ? "btn-primary" : "btn-green"} btn-full" id="resultCloseBtn" style="margin-top:24px;">${ok ? "View in My Applications" : "Try again"}</button>
      </div>`;

    $("#resultCloseBtn").addEventListener("click", () => {
      closeOverlay(applyModalOverlay);
      if (ok) {
        state.applications.unshift({
          id: "app_" + Date.now(),
          serviceName: s.name,
          status: s.fee > 0 ? "processing" : "submitted",
          progress: s.fee > 0 ? 30 : 10,
          ref,
        });
        persist();
        renderApplications();
        toast("Application submitted successfully", "success");
        document
          .getElementById("applications")
          .scrollIntoView({ behavior: "smooth" });
      } else {
        applyFlow.step = "pay";
        renderApplyFlow();
      }
    });
  }
}

function renderPayFields() {
  const wrap = $("#payFieldsWrap");
  if (!wrap) return;
  if (applyFlow.payMethod === "mpesa") {
    wrap.innerHTML = `<div class="form-group"><label>M-Pesa phone number</label><input type="text" id="fld-mpesa" placeholder="07xx xxx xxx"></div>`;
  } else if (applyFlow.payMethod === "card") {
    wrap.innerHTML = `
      <div class="form-group"><label>Card number</label><input type="text" id="fld-card" placeholder="4111 1111 1111 1111"></div>
      <div class="form-group" style="display:flex;gap:10px;">
        <div style="flex:1"><label>Expiry</label><input type="text" placeholder="MM/YY"></div>
        <div style="flex:1"><label>CVV</label><input type="text" placeholder="123"></div>
      </div>`;
  } else {
    wrap.innerHTML = `<div class="form-group"><label>Bank</label><select><option>KCB</option><option>Equity Bank</option><option>Co-operative Bank</option><option>NCBA</option></select></div>`;
  }
}

function validateAndContinue() {
  const name = $("#fld-name").value.trim();
  const id = $("#fld-id").value.trim();
  const phone = $("#fld-phone").value.trim();
  const county = $("#fld-county").value;

  let valid = true;
  const set = (fieldId, ok) => {
    $(fieldId).classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  };

  set("#fg-name", name.length > 2);
  set("#fg-id", /^\d{7,8}$/.test(id));
  set("#fg-phone", /^(0|\+254)\d{9}$/.test(phone.replace(/\s/g, "")));
  set("#fg-county", county !== "");

  if (!valid) {
    toast("Please fix the highlighted fields", "error");
    return;
  }

  applyFlow.formData = { name, id, phone, county };
  applyFlow.step = "pay";
  renderApplyFlow();
}

function processPayment() {
  applyFlow.step = "processing";
  renderApplyFlow();
  setTimeout(() => {
    const success = Math.random() > 0.12; // demo: ~88% success rate
    applyFlow.step = success ? "success" : "fail";
    renderApplyFlow();
  }, 1600);
}

$("#applyModalClose").addEventListener("click", () =>
  closeOverlay(applyModalOverlay),
);
applyModalOverlay.addEventListener("click", (e) => {
  if (e.target === applyModalOverlay) closeOverlay(applyModalOverlay);
});

// ===================================================================
// SEARCH
// ===================================================================

function matchServices(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q) ||
      catById(s.categoryId).name.toLowerCase().includes(q),
  );
}

function runSearch(query) {
  const results = matchServices(query);
  $("#searchResultsTitle").textContent = `Results for "${query}"`;
  $("#searchResultsGrid").innerHTML = results.map(serviceCardHTML).join("");
  $("#searchEmptyState").hidden = results.length !== 0;
  $("#searchResultsGrid").hidden = results.length === 0;

  $("#categoryView").hidden = true;
  $("#browseWrap").hidden = true;
  $("#searchResultsSection").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function clearSearch() {
  $("#searchResultsSection").hidden = true;
  $("#browseWrap").hidden = false;
  $("#navSearchInput").value = "";
  $("#navSearchInputMobile").value = "";
  $("#heroSearchInput").value = "";
}
$("#clearSearchBtn").addEventListener("click", clearSearch);

$("#heroSearchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = $("#heroSearchInput").value;
  if (q.trim()) runSearch(q);
});

let navSearchTimer;
function liveSearchHandler(e) {
  clearTimeout(navSearchTimer);
  const val = e.target.value;
  navSearchTimer = setTimeout(() => {
    if (val.trim()) runSearch(val);
    else clearSearch();
  }, 350);
}
$("#navSearchInput").addEventListener("input", liveSearchHandler);
$("#navSearchInputMobile").addEventListener("input", liveSearchHandler);

const SUGGESTIONS = [
  "Passport",
  "National ID",
  "SHA registration",
  "Land search",
  "HELB",
  "Business permit",
];
$("#heroSuggestions").innerHTML = SUGGESTIONS.map(
  (s) => `<button type="button">${s}</button>`,
).join("");
$("#heroSuggestions").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  $("#heroSearchInput").value = btn.textContent;
  runSearch(btn.textContent);
});

// clicking service cards inside search results grid
$("#searchResultsGrid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-service]");
  if (btn && !e.target.closest(".save-btn"))
    openServiceModal(btn.dataset.service);
});
$("#categoryServicesGrid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-service]");
  if (btn && !e.target.closest(".save-btn"))
    openServiceModal(btn.dataset.service);
});

// ===================================================================
// FOOTER INFO MODAL
// ===================================================================

const infoModalOverlay = $("#infoModalOverlay");
const INFO_CONTENT = {
  help: {
    title: "Help centre",
    body: "This is a concept/demo project — the help centre here is illustrative. In a production platform, this space would host FAQs, live chat and support ticketing.",
  },
  accessibility: {
    title: "Accessibility",
    body: "Huduma360 aims for keyboard-navigable menus, visible focus states, and support for reduced-motion preferences throughout this demo.",
  },
  about: {
    title: "About this project",
    body: "Huduma360 is a portfolio concept exploring how a unified digital front door to Kenyan government services could look and feel. It is not affiliated with, or endorsed by, the Government of Kenya.",
  },
  privacy: {
    title: "Privacy (demo)",
    body: "No real personal data is transmitted anywhere. All form fields, applications and payments in this demo are stored only in your browser's local storage.",
  },
  contact: {
    title: "Contact",
    body: "This is a demo project built for portfolio purposes. For the real equivalent services, please visit the official eCitizen platform.",
  },
};

document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-info]");
  if (!link) return;
  e.preventDefault();
  const info = INFO_CONTENT[link.dataset.info];
  $("#infoModalBody").innerHTML =
    `<div class="info-modal-title">${info.title}</div><div class="info-modal-body"><p>${info.body}</p></div>`;
  openOverlay(infoModalOverlay);
});
$("#infoModalClose").addEventListener("click", () =>
  closeOverlay(infoModalOverlay),
);
infoModalOverlay.addEventListener("click", (e) => {
  if (e.target === infoModalOverlay) closeOverlay(infoModalOverlay);
});

// ===================================================================
// GLOBAL: close modals on Escape, logo returns home
// ===================================================================

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  [serviceModalOverlay, applyModalOverlay, infoModalOverlay].forEach(
    closeOverlay,
  );
  closeDrawer();
});

$("#logoHome").addEventListener("click", (e) => {
  e.preventDefault();
  closeCategoryView();
  clearSearch();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===================================================================
// INIT
// ===================================================================

renderQuickActions();
renderPopular();
renderCategories();
renderRecent();
renderSaved();
renderApplications();
renderAnnouncements();
