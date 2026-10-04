"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { SHEET_ENDPOINT } from "@/lib/sheetEndpoint";
import { budgets, projectTypes, timelines } from "@/lib/oddtech";

function Chips({
  options,
  value,
  onToggle,
  multi = false,
}: {
  options: string[];
  value: string[];
  onToggle: (v: string) => void;
  multi?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button
            type="button"
            key={o}
            onClick={() => onToggle(o)}
            aria-pressed={on}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              on ? "border-brand bg-brand text-white shadow-glow" : "border-line bg-surface text-ink hover:border-brand/40"
            }`}
          >
            {multi && on && <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.6} />}
            {o}
          </button>
        );
      })}
    </div>
  );
}

// Project enquiry form. It posts to the same Google Sheet endpoint as the
// main contact form (formType "contact"), folding the OddTech-specific
// answers into the message so nothing is lost whatever columns the sheet has.
export default function QuoteForm() {
  const [types, setTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState(budgets[budgets.length - 1]);
  const [timeline, setTimeline] = useState(timelines[timelines.length - 1]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const details = data.get("details") ?? "";
    data.delete("details");
    data.set(
      "message",
      `[OddTech enquiry]\nProject type: ${types.join(", ") || "Not specified"}\nTimeline: ${timeline}\n\n${details}`
    );
    setStatus("sending");
    try {
      // Apps Script returns no CORS headers, so the response can't be read;
      // a non-throwing fetch is treated as sent.
      await fetch(SHEET_ENDPOINT, { method: "POST", mode: "no-cors", body: data });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 py-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-aqua-50 text-aqua-deep">
          <Icon name="check" className="h-7 w-7" strokeWidth={2.4} />
        </span>
        <h3 className="font-display text-3xl font-extrabold text-ink">Thanks, your brief is in.</h3>
        <p className="text-muted">The OddTech team will get back to you within one business day.</p>
      </div>
    );
  }

  const toggleType = (t: string) => setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-7">
      <input type="hidden" name="formType" value="contact" />
      <input type="hidden" name="budget" value={budget} />

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">What do you need? (pick any)</legend>
        <Chips options={projectTypes} value={types} onToggle={toggleType} multi />
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { id: "name", label: "Name", type: "text", auto: "name", ph: "Your name", req: true },
          { id: "email", label: "Email", type: "email", auto: "email", ph: "you@company.com", req: true },
          { id: "phone", label: "Mobile number", type: "tel", auto: "tel", ph: "+91", req: true },
          { id: "company", label: "Company", type: "text", auto: "organization", ph: "Company / brand", req: false },
        ].map((f) => (
          <div key={f.id} className="flex flex-col gap-2">
            <label htmlFor={`qf-${f.id}`} className="text-sm font-semibold text-ink">
              {f.label} {!f.req && <span className="font-normal text-muted">(optional)</span>}
            </label>
            <input id={`qf-${f.id}`} name={f.id} type={f.type} autoComplete={f.auto} placeholder={f.ph} required={f.req} className="input" />
          </div>
        ))}
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">Budget</legend>
        <Chips options={budgets} value={[budget]} onToggle={setBudget} />
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">Timeline</legend>
        <Chips options={timelines} value={[timeline]} onToggle={setTimeline} />
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="qf-details" className="text-sm font-semibold text-ink">
          Tell us about your project
        </label>
        <textarea
          id="qf-details"
          name="details"
          required
          rows={5}
          placeholder="What are you building, who is it for, and what should it do?"
          className="input resize-none"
        />
      </div>

      {status === "error" && (
        <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-deep">
          Something went wrong. Please try again, or email oddtechteam@gmail.com.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex h-[3.4rem] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-deep via-brand to-plum px-8 font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:opacity-60 sm:w-fit"
      >
        {status === "sending" ? "Sending…" : "Send my brief"}
        <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
      </button>
    </form>
  );
}
