"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/site";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const openable = items.filter((i) => i.src);
  const [index, setIndex] = useState<number | null>(null);
  const active = index === null ? null : openable[index];

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setIndex((i) =>
        i === null ? i : (i + delta + openable.length) % openable.length,
      ),
    [openable.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {items.map((item, i) => {
          const openIndex = item.src ? openable.indexOf(item) : -1;
          const ratio = item.tall ? "aspect-[3/4]" : "aspect-square";

          return (
            <li key={item.alt}>
              {item.src ? (
                <button
                  type="button"
                  onClick={() => setIndex(openIndex)}
                  className={`group relative block w-full overflow-hidden rounded-[var(--radius-card)] bg-[color:var(--color-tint)] ${ratio}`}
                  aria-label={`Open image: ${item.alt}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    loading={i < 4 ? "eager" : "lazy"}
                    sizes="(max-width: 767px) 48vw, 33vw"
                    style={item.focus ? { objectPosition: item.focus } : undefined}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {item.caption ? (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3 text-left text-[0.75rem] font-medium text-white">
                      {item.caption}
                    </span>
                  ) : null}
                </button>
              ) : (
                <div
                  className={`hatch relative flex items-end rounded-[var(--radius-card)] p-3 ${ratio}`}
                >
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[color:var(--color-burgundy)]/70">
                    {item.caption ?? item.alt}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/88 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white"
          >
            ×
          </button>

          {openable.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl text-white"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl text-white"
              >
                ›
              </button>
            </>
          ) : null}

          <figure
            className="max-h-full w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.src as string}
              alt={active.alt}
              width={active.width ?? 1200}
              height={active.height ?? 1600}
              sizes="100vw"
              className="mx-auto h-auto max-h-[80dvh] w-auto object-contain"
            />
            {active.caption ? (
              <figcaption className="mt-4 text-center text-sm text-white/70">
                {active.caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </>
  );
}
