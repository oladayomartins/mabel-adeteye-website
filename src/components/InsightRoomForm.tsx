"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { focusNextField, reveal } from "@/lib/forms";
import { person } from "@/lib/site";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY?.trim() ?? "";

const QUESTION_WORD_LIMIT = 30;

/** "Prefer not to say" added to the brief's Male/Female — a public professional
 *  form should not force the answer. Remove it if that is deliberate. */
const GENDERS = ["Male", "Female", "Prefer not to say"] as const;

/**
 * "41 and above" is not in the brief, which stopped at 31–40. Without it anyone
 * over 40 cannot complete the form — and the session is aimed at business
 * leaders, who skew older. Remove this entry if the cut-off is deliberate.
 */
const AGE_BRACKETS = ["18–25", "26–30", "31–40", "41 and above"] as const;

const EMPLOYMENT = [
  "Government employed",
  "Privately employed",
  "Self-employed",
  "Student",
] as const;

const EXPERIENCE = ["1–3 years", "4–5 years", "6–10 years", "11 years and above"] as const;

type Values = {
  name: string;
  email: string;
  gender: string;
  age: string;
  location: string;
  employment: string;
  experience: string;
  question: string;
  rationale: string;
};

const EMPTY: Values = {
  name: "",
  email: "",
  gender: "",
  age: "",
  location: "",
  employment: "",
  experience: "",
  question: "",
  rationale: "",
};

const STEPS = ["About you", "Your work", "Your question"] as const;

type Status = "idle" | "sending" | "sent" | "error";

/** Card-style radio group — easier to tap than native radios, and legible. */
function Choice({
  legend,
  name,
  options,
  value,
  onChange,
  columns = 2,
  invalid,
}: {
  legend: string;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  columns?: number;
  invalid?: boolean;
}) {
  return (
    <fieldset id={`ir-${name}`}>
      <legend className="eyebrow">{legend}</legend>
      <div
        className={`mt-3 grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}
      >
        {options.map((option) => {
          const selected = value === option;
          return (
            <label
              key={option}
              className={`flex min-h-[48px] cursor-pointer items-center justify-center rounded-[10px] border px-3 text-center text-[0.875rem] font-medium transition-colors ${
                selected
                  ? "border-[color:var(--color-burgundy)] bg-[color:var(--color-tint)] text-[color:var(--color-burgundy)]"
                  : invalid
                    ? "border-[color:var(--color-burgundy)]/40"
                    : "border-[color:var(--color-rule)] hover:border-[color:var(--color-burgundy)]/50"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {option}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function InsightRoomForm({ sessionLabel }: { sessionLabel: string }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLParagraphElement>(null);
  const firstRender = useRef(true);

  // A new step replaces the fields under the visitor's thumb, and the step
  // lengths differ, so without this they land below the form looking at the
  // buttons. Bring the top of the step back into view and move focus to its
  // label, so screen readers announce the step too.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    reveal(form.current, heading.current);
  }, [step]);

  const set = (key: keyof Values) => (v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const questionWords = useMemo(
    () => values.question.trim().split(/\s+/).filter(Boolean).length,
    [values.question],
  );
  const overLimit = questionWords > QUESTION_WORD_LIMIT;

  const missing = useMemo(() => {
    if (step === 0)
      return [
        !values.name && "name",
        !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email) && "email",
        !values.gender && "gender",
        !values.age && "age",
        !values.location && "location",
      ].filter(Boolean) as string[];
    if (step === 1)
      return [!values.employment && "employment", !values.experience && "experience"].filter(
        Boolean,
      ) as string[];
    return [
      !values.question && "question",
      overLimit && "question-length",
      !values.rationale && "rationale",
    ].filter(Boolean) as string[];
  }, [step, values, overLimit]);

  /** Takes the visitor to the first field that still needs an answer. */
  const showFirstMissing = () => {
    setShowErrors(true);
    const id = `ir-${missing[0].replace("-length", "")}`;
    const el = document.getElementById(id);
    reveal(el, el?.matches("fieldset") ? el.querySelector("input") : el);
  };

  const next = () => {
    if (missing.length) {
      showFirstMissing();
      return;
    }
    setShowErrors(false);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    setShowErrors(false);
    setStep((s) => Math.max(s - 1, 0));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (missing.length) {
      showFirstMissing();
      return;
    }

    const summary = [
      `Session: ${sessionLabel}`,
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Gender: ${values.gender}`,
      `Age bracket: ${values.age}`,
      `Location: ${values.location}`,
      `Employment: ${values.employment}`,
      `Experience: ${values.experience}`,
      "",
      `Question: ${values.question}`,
      "",
      `Rationale: ${values.rationale}`,
    ].join("\n");

    if (!ACCESS_KEY) {
      window.location.href = `mailto:${person.email}?subject=${encodeURIComponent(
        `MAA Insight Room registration — ${values.name}`,
      )}&body=${encodeURIComponent(summary)}`;
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `MAA Insight Room registration — ${values.name} — ${sessionLabel}`,
          from_name: "MAA Insight Room",
          replyto: values.email,
          botcheck: "",
          Session: sessionLabel,
          Name: values.name,
          Email: values.email,
          Gender: values.gender,
          "Age bracket": values.age,
          Location: values.location,
          Employment: values.employment,
          "Years of experience": values.experience,
          Question: values.question,
          Rationale: values.rationale,
        }),
      });
      const result = (await res.json().catch(() => null)) as { success?: boolean } | null;
      if (!res.ok || !result?.success) {
        console.error("Web3Forms rejected the registration:", res.status, result);
        throw new Error("rejected");
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card bg-[color:var(--color-tint)]" role="status">
        <p className="eyebrow">You&rsquo;re registered</p>
        <h3 className="h2 mt-3">See you on {sessionLabel}</h3>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
          Access details will arrive by email before the session. Your question goes into
          the running order — the room is built around what participants actually bring.
        </p>
      </div>
    );
  }

  const invalid = (field: string) => showErrors && missing.includes(field);

  return (
    <form
      ref={form}
      onSubmit={onSubmit}
      onKeyDown={(e) => {
        // Enter on the last typed field of an early step means "continue".
        if (focusNextField(e) === false && step < STEPS.length - 1) next();
      }}
      className="card"
    >
      {/* Progress */}
      <div className="flex items-center justify-between gap-4">
        <p ref={heading} tabIndex={-1} aria-live="polite" className="eyebrow outline-none">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[color:var(--color-muted)]">
          {Math.round(((step + 1) / STEPS.length) * 100)}%
        </span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[color:var(--color-rule)]">
        <div
          className="h-full rounded-full bg-[color:var(--color-burgundy)] transition-[width] duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="mt-7 space-y-6">
        {step === 0 ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="ir-name" className="eyebrow">
                  Name
                </label>
                <input
                  id="ir-name"
                  value={values.name}
                  onChange={(e) => set("name")(e.target.value)}
                  aria-invalid={invalid("name") || undefined}
                  autoComplete="name"
                  enterKeyHint="next"
                  className="field mt-2"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="ir-email" className="eyebrow">
                  Email
                </label>
                <input
                  id="ir-email"
                  type="email"
                  inputMode="email"
                  value={values.email}
                  onChange={(e) => set("email")(e.target.value)}
                  aria-invalid={invalid("email") || undefined}
                  autoComplete="email"
                  enterKeyHint="next"
                  className="field mt-2"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <Choice
              legend="Gender"
              name="gender"
              options={GENDERS}
              value={values.gender}
              onChange={set("gender")}
              columns={1}
              invalid={invalid("gender")}
            />

            <Choice
              legend="Age bracket"
              name="age"
              options={AGE_BRACKETS}
              value={values.age}
              onChange={set("age")}
              invalid={invalid("age")}
            />

            <div>
              <label htmlFor="ir-location" className="eyebrow">
                Location
              </label>
              <input
                id="ir-location"
                value={values.location}
                onChange={(e) => set("location")(e.target.value)}
                aria-invalid={invalid("location") || undefined}
                autoComplete="address-level2"
                enterKeyHint="next"
                className="field mt-2"
                placeholder="City and country"
              />
            </div>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <Choice
              legend="Employment"
              name="employment"
              options={EMPLOYMENT}
              value={values.employment}
              onChange={set("employment")}
              columns={1}
              invalid={invalid("employment")}
            />
            <Choice
              legend="Years of experience"
              name="experience"
              options={EXPERIENCE}
              value={values.experience}
              onChange={set("experience")}
              invalid={invalid("experience")}
            />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor="ir-question" className="eyebrow">
                  Your question
                </label>
                <span
                  aria-live="polite"
                  className={`font-mono text-[0.625rem] uppercase tracking-[0.12em] ${
                    overLimit
                      ? "text-[color:var(--color-burgundy)]"
                      : "text-[color:var(--color-muted)]"
                  }`}
                >
                  {questionWords}/{QUESTION_WORD_LIMIT} words
                </span>
              </div>
              <textarea
                id="ir-question"
                rows={3}
                value={values.question}
                onChange={(e) => set("question")(e.target.value)}
                aria-invalid={invalid("question") || overLimit || undefined}
                className="field mt-2 resize-y"
                placeholder="What do you want addressed in the room?"
              />
              {overLimit ? (
                <p className="mt-2 text-sm text-[color:var(--color-burgundy)]">
                  {questionWords - QUESTION_WORD_LIMIT} word
                  {questionWords - QUESTION_WORD_LIMIT === 1 ? "" : "s"} over — tighten it
                  and the question gets sharper.
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="ir-rationale" className="eyebrow">
                Rationale behind your question
              </label>
              <textarea
                id="ir-rationale"
                rows={4}
                value={values.rationale}
                onChange={(e) => set("rationale")(e.target.value)}
                aria-invalid={invalid("rationale") || undefined}
                className="field mt-2 resize-y"
                placeholder="What is going on behind it? Context helps Mabel answer the real problem."
              />
            </div>
          </>
        ) : null}
      </div>

      {showErrors && missing.length ? (
        <p role="alert" className="mt-5 text-sm text-[color:var(--color-burgundy)]">
          Please complete the highlighted fields before continuing.
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        {step > 0 ? (
          <button key="back" type="button" onClick={back} className="btn btn-secondary sm:w-auto">
            Back
          </button>
        ) : null}

        {step < STEPS.length - 1 ? (
          /*
           * Distinct keys matter: without them React reuses this <button> for
           * the submit one below, flips its type mid-click, and the same tap
           * that opens the last step also submits it.
           */
          <button key="continue" type="button" onClick={next} className="btn btn-primary flex-1">
            Continue
          </button>
        ) : (
          <button
            key="submit"
            type="submit"
            disabled={status === "sending"}
            className="btn btn-primary flex-1 disabled:opacity-60"
          >
            {status === "sending" ? "Registering…" : "Register for this session"}
          </button>
        )}
      </div>

      {status === "error" ? (
        <p role="alert" className="mt-3 text-sm text-[color:var(--color-burgundy)]">
          We could not register you just now. Please email{" "}
          <a className="underline underline-offset-4" href={`mailto:${person.email}`}>
            {person.email}
          </a>{" "}
          instead.
        </p>
      ) : null}
    </form>
  );
}
