"use client";

import { useState } from "react";
import { focusNextField } from "@/lib/forms";
import { enquiryTopics, person } from "@/lib/site";

/**
 * Web3Forms. The access key is public by design — it only authorises posting to
 * this one form, and Web3Forms rate-limits it server side. Nothing sensitive.
 */
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY?.trim() ?? "";

type Status = "idle" | "sending" | "sent" | "error";

export default function EnquiryForm() {
  const [topic, setTopic] = useState<string>(enquiryTopics[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot — bots fill hidden fields, humans do not. Web3Forms rejects a
    // filled `botcheck` server side too; this just saves the round trip.
    if (data.botcheck) return;

    if (!ACCESS_KEY) {
      // No access key configured: hand off to the visitor's mail client so the
      // form is never a dead end.
      const body = [
        `Topic: ${data.topic}`,
        `Name: ${data.name}`,
        `Organisation: ${data.organisation || "—"}`,
        `Email: ${data.email}`,
        "",
        String(data.message ?? ""),
      ].join("\n");
      window.location.href = `mailto:${person.email}?subject=${encodeURIComponent(
        `${data.topic} enquiry — ${data.name}`,
      )}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          // Capitalised keys because Web3Forms uses them as the labels in the
          // notification email.
          Topic: data.topic,
          Name: data.name,
          Organisation: data.organisation || "—",
          Email: data.email,
          Message: data.message,
          subject: `${data.topic} enquiry from ${data.name} — mabeladeteye.com`,
          from_name: "mabeladeteye.com",
          replyto: data.email,
          botcheck: "",
        }),
      });

      // Web3Forms answers 200 with { success: false } for a rejected key or a
      // tripped spam rule, so the status code alone is not enough.
      const result = (await res.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!res.ok || !result?.success) {
        // Web3Forms' own messages are aimed at developers — "This method is not
        // allowed. Use our API in client side..." helps nobody filling in a
        // form. Log the detail, show the visitor something useful.
        console.error("Web3Forms rejected the submission:", res.status, result);
        throw new Error("We could not send that just now.");
      }

      form.reset();
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="card bg-[color:var(--color-tint)]" role="status">
        <h3 className="h3">Thank you — your message is on its way.</h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
          You will hear back as soon as possible. For anything urgent, email{" "}
          <a
            className="underline underline-offset-4"
            href={`mailto:${person.email}`}
          >
            {person.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} onKeyDown={focusNextField} className="card">
      <fieldset>
        <legend className="eyebrow">What is this about?</legend>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {enquiryTopics.map((t) => (
            <label
              key={t}
              className={`flex min-h-[48px] cursor-pointer items-center justify-center rounded-[10px] border px-3 text-[0.9375rem] font-medium transition-colors ${
                topic === t
                  ? "border-[color:var(--color-burgundy)] bg-[color:var(--color-tint)] text-[color:var(--color-burgundy)]"
                  : "border-[color:var(--color-rule)]"
              }`}
            >
              <input
                type="radio"
                name="topic"
                value={t}
                checked={topic === t}
                onChange={() => setTopic(t)}
                className="sr-only"
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-3">
        <label className="sr-only" htmlFor="name">
          Name
        </label>
        <input id="name" name="name" required autoComplete="name" placeholder="Name" enterKeyHint="next" className="field" />

        <label className="sr-only" htmlFor="organisation">
          Organisation
        </label>
        <input
          id="organisation"
          name="organisation"
          autoComplete="organization" enterKeyHint="next"
          placeholder="Organisation"
          className="field"
        />

        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          inputMode="email"
          autoComplete="email" enterKeyHint="next"
          placeholder="Email"
          className="field"
        />

        <label className="sr-only" htmlFor="message">
          Tell me about the brief
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell me about the brief — dates, audience, and what success looks like."
          className="field resize-y"
        />

        {/* Honeypot — `botcheck` is the name Web3Forms checks for. */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-primary mt-5 w-full disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>

      {status === "error" ? (
        <p role="alert" className="mt-3 text-sm text-[color:var(--color-burgundy)]">
          {error} Please email{" "}
          <a className="underline underline-offset-4" href={`mailto:${person.email}`}>
            {person.email}
          </a>{" "}
          instead.
        </p>
      ) : null}
    </form>
  );
}
