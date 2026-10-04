import type { IconName } from "@/components/ui/Icon";

// Details of the parent company, Odd Creatives & Management (footer credit, socials).

export const site = {
  name: "Odd Creatives & Management",
  short: "Odd Creatives",
  tagline: "Innovate. Integrate. Elevate.",
  founded: "2021",
  city: "Pune",
  email: "contact@oddcreatives.in",
  phones: [
    { label: "90113 94304", href: "tel:+919011394304" },
    { label: "84858 34885", href: "tel:+918485834885" },
  ],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/odd_creatives/", icon: "instagram" as IconName },
    { label: "LinkedIn", href: "https://in.linkedin.com/company/odd-creatives-management", icon: "linkedin" as IconName },
  ],
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.888383060927!2d73.7621210747232!3d18.579070182525896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9e98b0366c1%3A0x8312c6366e37c3a2!2sODD%20CREATIVESS%20%26%20MANAGEMENT!5e0!3m2!1sen!2sin!4v1783280555004!5m2!1sen!2sin",
  mapDirections: "https://www.google.com/maps/search/?api=1&query=ODD+CREATIVES+%26+MANAGEMENT",
};

export const process = [
  { t: "Discover", d: "Understand the business, the audience, and the real problem behind the brief." },
  { t: "Strategy", d: "Turn that understanding into a plan: positioning, channels, and a timeline." },
  { t: "Design", d: "Shape the idea into something people can see, feel, and react to." },
  { t: "Develop", d: "Build it, whether it's a site, campaign, film or event, to spec and on schedule." },
  { t: "Launch & Grow", d: "Ship it, measure it, and keep sharpening based on real results." },
];
