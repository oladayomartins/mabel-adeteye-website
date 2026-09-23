import Image from "next/image";
import Link from "next/link";
import { assets, nav, person } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[color:var(--color-ink)] text-white">
      <div className="shell py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="relative h-12 w-[132px]">
              <Image
                src={assets.logo}
                alt={`${person.name} logo`}
                fill
                sizes="132px"
                className="object-contain object-left brightness-0 invert"
              />
            </div>
            <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-white/60">
              {person.summary}
            </p>
          </div>

          <div>
            <h2 className="eyebrow text-white/50">Pages</h2>
            <ul className="mt-4 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.9375rem] text-white/80 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-white/50">Elsewhere</h2>
            <ul className="mt-4 space-y-3">
              {person.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    rel="me noopener noreferrer"
                    target="_blank"
                    className="text-[0.9375rem] text-white/80 transition-colors hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${person.email}`}
                  className="text-[0.9375rem] text-white/80 transition-colors hover:text-white"
                >
                  {person.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${person.phone}`}
                  className="text-[0.9375rem] text-white/80 transition-colors hover:text-white"
                >
                  {person.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/12 pt-7 text-[0.8125rem] text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {person.name}. All rights reserved.
          </p>
          <p>{person.location}</p>
        </div>
      </div>
    </footer>
  );
}
