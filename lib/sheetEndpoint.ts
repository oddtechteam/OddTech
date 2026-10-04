// Paste the URL from Deploy → New deployment → Web app (ends in /exec).
// See google-apps-script/Code.gs for the backend + setup steps.
// Both ContactForm and the Footer newsletter form post to this same
// endpoint — the Apps Script tells them apart by a hidden `formType`
// field and routes each into its own sheet tab.
export const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbyYr-PnwC2-EcS5PITm8qKoNJtV9J8CPLNdY7zn7o207eXpJRrAKsgpbHEu4KaO4FQ/exec";
