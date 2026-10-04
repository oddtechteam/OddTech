import type { IconName } from "@/components/ui/Icon";

// All copy for the OddTech IT Solutions website.
// Items marked REVIEW are sensible defaults — confirm or edit them.

export const oddtech = {
  name: "OddTech IT Solutions",
  tagline: "Innovate. Integrate. Elevate.",
  sub: "Not ordinary. Just oddly effective.",
  intro:
    "The technology arm of Odd Creatives & Management, building websites, apps, stores, and business systems that scale with the business, not just launch and stall.",
  email: "oddtechteam@gmail.com",
  phone: { label: "+91 9922575715", href: "tel:+919922575715" },
  whatsapp: "https://wa.me/919922575715",
};

// The parent agency site (a separate project). Used by every "Back to Odd Creatives" link.
export const agencyUrl = "https://oddcreatives.in";

export const oddtechNav = [
  { href: "/", label: "Overview" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/#stack", label: "Technology" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export type TechService = {
  key: string;
  icon: IconName;
  title: string;
  short: string;
  long: string;
  deliverables: string[];
  isNew?: boolean; // shows a "New" badge (recently launched)
};

export const services: TechService[] = [
  {
    key: "web",
    icon: "globe",
    title: "Website Development",
    short: "Fast, responsive, SEO-friendly websites.",
    long: "Marketing sites and corporate websites designed to load fast, rank well, and turn visitors into enquiries.",
    deliverables: ["Corporate & business websites", "Landing pages", "CMS-powered sites", "Speed & SEO optimisation"],
  },
  {
    key: "seo",
    icon: "trending",
    title: "SEO & Performance Marketing",
    short: "Get found on Google, then turn clicks into customers.",
    long: "Search optimisation and paid campaigns run on data. We fix what holds your site back, target the searches that matter, and track every rupee from click to enquiry.",
    deliverables: ["SEO audits & technical fixes", "Keyword research & on-page SEO", "Google & Meta ad campaigns", "Analytics, tracking & monthly reports"],
    isNew: true,
  },
  {
    key: "linkedin",
    icon: "linkedin",
    title: "LinkedIn Management",
    short: "A business LinkedIn presence that builds trust and leads.",
    long: "We run your company page and leadership profiles (content, posting, and engagement) so decision-makers see your brand consistently and reach out.",
    deliverables: ["Company page setup & optimisation", "Founder & leadership profiles", "Content calendar & regular posting", "Lead generation & outreach"],
    isNew: true,
  },
  {
    key: "mobile",
    icon: "smartphone",
    title: "Mobile App Development",
    short: "Android & iOS apps built to actually ship.",
    long: "Fast, reliable, secure native and cross-platform apps, from first prototype to Play Store and App Store launch.",
    deliverables: ["Android apps", "iOS apps", "Cross-platform apps", "Store publishing & updates"],
  },
  {
    key: "ecommerce",
    icon: "cart",
    title: "E-commerce & Shopify",
    short: "Custom stores that sell smarter and scale faster.",
    long: "Online stores with smooth checkout, payment gateways, and the product and order tools your team needs every day.",
    deliverables: ["Shopify & custom stores", "Payment gateway integration", "Product & order management", "SEO-ready storefronts"],
  },
  {
    key: "software",
    icon: "layout",
    title: "Custom Software & Web Apps",
    short: "Business apps tailored to your workflow.",
    long: "Portals, dashboards, booking engines and internal tools that streamline operations and replace spreadsheets.",
    deliverables: ["Web applications & portals", "Booking & scheduling systems", "Admin dashboards", "APIs & integrations"],
  },
  {
    key: "crm",
    icon: "users",
    title: "CRM Solutions",
    short: "Leads, sales & customers in one place.",
    long: "CRM systems set up around how you actually sell: pipelines, follow-ups, automation, and reporting.",
    deliverables: ["CRM setup & customisation", "Sales pipelines", "Workflow automation", "Integrations with your tools"],
  },
  {
    key: "design",
    icon: "palette",
    title: "UI/UX Design",
    short: "Interfaces people enjoy using.",
    long: "Research-led product design, from wireframes to polished, on-brand interfaces and reusable design systems.",
    deliverables: ["Wireframes & prototypes", "UI design", "Design systems", "Usability reviews"],
  },
  {
    key: "security",
    icon: "shield",
    title: "Cyber Security",
    short: "Robust, scalable protection.",
    long: "Find and fix weak spots before someone else does: audits, hardening, and data protection for your systems.",
    deliverables: ["Security audits", "Vulnerability assessment", "Secure configuration", "Data protection & backups"],
  },
  {
    key: "cloud",
    icon: "cloud",
    title: "Cloud & Hosting",
    short: "Infrastructure that stays up.",
    long: "Cloud setup, hosting, domains and monitoring: the infrastructure and systems setup behind a reliable product.",
    deliverables: ["Cloud setup & migration", "Hosting & domains", "Monitoring & backups", "Infrastructure setup"],
  },
  {
    key: "support",
    icon: "headset",
    title: "IT Support & Maintenance",
    short: "Complete IT solutions, strategy to deployment.",
    long: "Ongoing technical support, updates and performance audits so your systems keep running as you grow.",
    deliverables: ["Technical support", "Updates & maintenance", "Performance audits", "IT consulting"],
  },
];

// Grounded in what the business already states elsewhere on the site.
// (Defined after `services` so the count stays in sync.)
export const highlights = [
  { value: String(services.length), label: "Services under one roof" },
  { value: "24/7", label: "Support available" },
  { value: "3", label: "Platforms: Web, Android & iOS" },
  { value: "2023", label: "Building since" },
];

export const industries: { icon: IconName; t: string; d: string }[] = [
  { icon: "bed", t: "Hospitality & Travel", d: "Hotels, homestays, and booking engines." },
  { icon: "bag", t: "Retail & Luxury", d: "Premium storefronts and e-commerce." },
  { icon: "utensils", t: "Food & Beverage", d: "Brands, ordering, and loyalty." },
  { icon: "video", t: "Media & Creators", d: "Platforms for content and communities." },
  { icon: "building", t: "Real Estate", d: "Project sites, CRMs, and lead capture." },
  { icon: "book", t: "Education", d: "Institutes, courses, and portals." },
  { icon: "heart", t: "Healthcare", d: "Clinics, appointments, and records." },
  { icon: "rocket", t: "Startups & SMEs", d: "MVPs that are ready to scale." },
];

// REVIEW: adjust to the tools your team actually uses.
export const stack: { key: string; label: string; items: string[] }[] = [
  { key: "frontend", label: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5 & CSS3"] },
  { key: "mobile", label: "Mobile", items: ["Flutter", "React Native", "Kotlin", "Swift", "Android", "iOS"] },
  { key: "backend", label: "Backend", items: ["Node.js", "Express", "PHP", "Laravel", "Python", "REST APIs"] },
  { key: "data", label: "Data & Cloud", items: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "AWS", "Google Cloud"] },
  { key: "commerce", label: "Commerce & CMS", items: ["Shopify", "WooCommerce", "WordPress", "Razorpay", "Payment gateways", "Headless CMS"] },
  { key: "tools", label: "Design & Tools", items: ["Figma", "Git & GitHub", "Docker", "Postman", "Jira", "Google Analytics"] },
];

export const devProcess = [
  { t: "Discovery", d: "We learn your business, users, and goals, and turn them into a clear scope." },
  { t: "UI/UX Design", d: "Wireframes and designs you can see and click before a line of code is written." },
  { t: "Development", d: "Clean, scalable code built in short cycles with regular demos." },
  { t: "Testing & QA", d: "Every feature checked across devices, browsers, and edge cases." },
  { t: "Launch", d: "Deployment, store submission, and a smooth go-live." },
  { t: "Support & Growth", d: "Monitoring, updates, and improvements as you grow." },
];

export const reasons: { icon: IconName; t: string; d: string }[] = [
  { icon: "code", t: "100% custom-built", d: "No templates. Every product is designed and engineered around your business." },
  { icon: "layers", t: "Design to deployment", d: "Strategy, UI/UX, development, and launch by one accountable team." },
  { icon: "palette", t: "Backed by a creative agency", d: "Branding and marketing from Odd Creatives, under the same roof." },
  { icon: "trending", t: "Built to scale", d: "Architecture that grows with the business, not just launch and stall." },
  { icon: "shield", t: "Security-first", d: "Secure configuration, protected data, and regular audits." },
  { icon: "headset", t: "24/7 support available", d: "We stay with you after launch with support and maintenance." },
];

// REVIEW: confirm these match how you price and staff projects.
export const engagement = [
  {
    icon: "target" as IconName,
    t: "Fixed-scope project",
    d: "A defined scope, timeline, and quote agreed upfront.",
    best: "Websites, online stores, and MVPs",
    points: ["Clear deliverables", "Milestone-based delivery", "Fixed quote"],
  },
  {
    icon: "users" as IconName,
    t: "Dedicated team",
    d: "Designers and developers working as an extension of your team.",
    best: "Growing products with an evolving roadmap",
    points: ["Flexible scope", "Regular sprints & demos", "Scale the team up or down"],
    featured: true,
  },
  {
    icon: "wrench" as IconName,
    t: "Support & maintenance",
    d: "A monthly plan to keep everything secure, fast, and up to date.",
    best: "Live websites, apps, and systems",
    points: ["Updates & security patches", "Monitoring & backups", "Priority support"],
  },
];

// Real client projects. Screenshots live in public/work/ (captured from the live sites).
export type WorkItem = {
  client: string;
  industry: string;
  url: string;
  image: string;
  summary: string;
  services: string[];
  quote?: string;
  featured?: boolean;
};

export const work: WorkItem[] = [
  {
    client: "Zurrii Luxury",
    industry: "Fashion & E-commerce",
    url: "https://www.zurriiluxury.com/",
    image: "/work/zurrii.jpg",
    summary: "An online store for exclusive chikankari garments for women, with collections, new arrivals, and a premium shopping experience.",
    services: ["UI/UX Design", "E-commerce Development"],
    quote:
      "From UI/UX design to development, the Odd Creatives team delivered a premium website that aligns perfectly with our luxury brand identity. Their professionalism, responsiveness, and commitment to quality exceeded our expectations.",
    featured: true,
  },
  {
    client: "Nirwana Stays",
    industry: "Hospitality & Travel",
    url: "https://nirwanastays.com/",
    image: "/work/nirwana.jpg",
    summary: "A lake-view resort in Lonavala offering Pawna Lake camping, glamping, and nature stays, with destinations, offers, and stay listings.",
    services: ["Website Design", "Web Development"],
    quote:
      "Odd Creatives designed and developed a modern, high-performing website that perfectly reflects our hospitality experience. Their attention to detail, seamless execution, and technical expertise made the entire process effortless.",
    featured: true,
  },
  {
    client: "Sahyadri World School",
    industry: "Education",
    url: "https://www.sahyadriworldschool.com/",
    image: "/work/sahyadri.jpg",
    summary: "A school website for Chikhali, Pimpri-Chinchwad, covering holistic education, campus facilities, and admissions for 2026-27.",
    services: ["Website Design", "Web Development"],
    featured: true,
  },
  {
    client: "Lakhe Global",
    industry: "Manufacturing Group",
    url: "https://lakheglobal.com/",
    image: "/work/lakhe.jpg",
    summary: "The corporate website of the Lakhe Group of Companies, a diversified Pune-based group spanning sixteen businesses.",
    services: ["Website Design", "Web Development"],
  },
  {
    client: "Apurva Samant",
    industry: "Public Figure",
    url: "https://apurvasamant.org/",
    image: "/work/apurva.jpg",
    summary: "The official Marathi-language website of youth leader Apurva Samant, Lanja-Rajapur, covering initiatives, schemes, and grassroots work.",
    services: ["Website Design", "Web Development"],
  },
];

// REVIEW: especially the ownership answer — keep it only if it matches your contracts.
export const faqs = [
  {
    q: "How much does a website or app cost?",
    a: "It depends on scope: pages, features, integrations, and platforms. Share your requirements and we'll send a detailed proposal with a clear, itemised quote.",
  },
  {
    q: "How long does a project take?",
    a: "A typical business website takes a few weeks; apps, stores, and custom systems take longer depending on features. We agree on a timeline with milestones before we start.",
  },
  {
    q: "Do you build for both Android and iOS?",
    a: "Yes. We build native Android and iOS apps as well as cross-platform apps that run on both from a single codebase.",
  },
  {
    q: "Can you redesign or improve my existing website or app?",
    a: "Absolutely. We can audit what you have, then redesign, rebuild, or improve performance, security, and SEO.",
  },
  {
    q: "Do you provide support after launch?",
    a: "Yes. Support & maintenance plans cover updates, security patches, monitoring, and backups, with 24/7 support available.",
  },
  {
    q: "Will I own the code and design?",
    a: "Yes. Once the project is complete, the source code, designs, and accounts are handed over to you.",
  },
  {
    q: "Do you work with clients outside Pune?",
    a: "Yes. We're based in Pune and work with clients across India through calls, video meetings, and shared project boards.",
  },
];

export const projectTypes = [
  "Website",
  "SEO & performance marketing",
  "LinkedIn management",
  "Mobile app",
  "E-commerce store",
  "Custom software / web app",
  "CRM",
  "UI/UX design",
  "Cyber security",
  "Cloud & hosting",
  "IT support",
  "Something else",
];

export const budgets = ["Under ₹1L", "₹1L to 5L", "₹5L to 15L", "₹15L+", "Not sure yet"];
export const timelines = ["ASAP", "Within 1 month", "1 to 3 months", "Flexible"];
