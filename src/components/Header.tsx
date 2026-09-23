"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { assets, nav, person } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef<HTMLSpanElement>(null);

  /*
   * The header is transparent while the top of the hero is still in view, and
   * picks up a background once the page scrolls past it.
   *
   * Driven by an IntersectionObserver on a zero-width sentinel pinned to the top
   * of the document rather than a scroll listener, so nothing runs on the main
   * thread on every scroll frame.
   */
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // The drawer's panel is opaque, so the bar behind it must be too.
  const solid = scrolled || open;

  return (
    <>
      {/*
        Absolutely positioned with no positioned ancestor, so it anchors to the
        top of the document and takes up no layout space. Its height is the
        distance the user must scroll before the header gains a background.
      */}
      <span
        ref={sentinel}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-[72px] w-px md:h-[88px]"
      />

      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
          solid
            ? "border-[color:var(--color-rule)] bg-[color:var(--color-paper)]/85 shadow-[0_1px_24px_rgba(20,20,20,0.05)] backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-4 md:h-[84px]">
          <Link
            href="/"
            aria-label={`${person.name} — home`}
            className="relative block h-9 w-[104px] shrink-0 md:h-11 md:w-[128px]"
          >
            <Image
              src={assets.logo}
              alt={`${person.name} logo`}
              fill
              priority
              sizes="128px"
              className="object-contain object-left"
            />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {nav.slice(0, -1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`text-[0.9375rem] font-medium transition-colors hover:text-[color:var(--color-burgundy)] ${
                  isActive(item.href)
                    ? "text-[color:var(--color-burgundy)]"
                    : "text-[color:var(--color-ink)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/bookings" className="btn btn-primary !min-h-[44px] !text-sm">
              Book Mabel
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
          >
            <span className="relative block h-[14px] w-[22px]">
              <span
                className={`absolute left-0 block h-[2px] w-full rounded bg-[color:var(--color-ink)] transition-all duration-300 ${
                  open ? "top-[6px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[6px] block h-[2px] w-full rounded bg-[color:var(--color-ink)] transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-[2px] w-full rounded bg-[color:var(--color-ink)] transition-all duration-300 ${
                  open ? "top-[6px] -rotate-45" : "top-[12px]"
                }`}
              />
            </span>
          </button>
        </div>

      </header>

      {/*
        Rendered as a sibling of <header>, not a child. The header carries
        `backdrop-blur`, and an element with a backdrop-filter becomes the
        containing block for its `position: fixed` descendants — nested inside,
        this drawer resolved `top-[68px] bottom-0` against the 68px header box
        and collapsed to zero height.
      */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[68px] z-40 md:top-[84px] bg-[color:var(--color-paper)] lg:hidden"
      >
        <nav aria-label="Mobile" className="shell flex h-full flex-col pt-6">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.href} className="border-b border-[color:var(--color-rule)]">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-baseline gap-4 py-5"
                >
                  <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-[color:var(--color-muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`h2 ${
                      isActive(item.href)
                        ? "text-[color:var(--color-burgundy)]"
                        : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pb-10 pt-8">
            <Link
              href="/bookings"
              onClick={() => setOpen(false)}
              className="btn btn-primary w-full"
            >
              Book Mabel
            </Link>
            <p className="mt-4 text-sm text-[color:var(--color-muted)]">
              {person.location}
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
