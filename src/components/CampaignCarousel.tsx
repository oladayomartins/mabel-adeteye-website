import Image from "next/image";
import Carousel from "./Carousel";
import { brandLogo, campaigns } from "@/lib/site";

/**
 * Signature campaigns.
 *
 * Each card shows the brand's own logo, pulled from the same `brands` array as
 * the logo wall. Campaigns with no logo available fall back to a typographic
 * block rather than a placeholder image.
 */
export default function CampaignCarousel() {
  return (
    <Carousel label="Signature campaigns">
      {campaigns.map((campaign) => {
        const logo = brandLogo(campaign.brand);

        return (
          <li
            key={campaign.title + campaign.sector}
            className="w-[268px] shrink-0 snap-start sm:w-[300px]"
          >
            <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-rule)] bg-white">
              <div className="flex h-[132px] items-center justify-center bg-[color:var(--color-tint)] px-8">
                {logo ? (
                  <span className="relative block h-10 w-full">
                    <Image
                      src={logo.src}
                      alt={`${logo.name} logo`}
                      fill
                      loading="lazy"
                      sizes="160px"
                      className="object-contain"
                    />
                  </span>
                ) : (
                  <span className="text-center font-mono text-[0.75rem] uppercase tracking-[0.18em] text-[color:var(--color-burgundy)]">
                    TVC
                    <br />
                    Communications
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="h3">{campaign.title}</h3>
                <p className="mt-1.5 text-[0.8125rem] text-[color:var(--color-muted)]">
                  {campaign.sector}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {campaign.tags.map((tag) => (
                    <li key={tag} className="chip !min-h-[28px] !text-[0.625rem]">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        );
      })}
    </Carousel>
  );
}
