import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Crawl policy.
 *
 * AI crawlers are allowed explicitly rather than left to the wildcard. The goal
 * here is visibility: blocking them (or leaving Google-Extended undeclared and
 * relying on a publisher default) keeps Mabel out of AI Overviews, ChatGPT
 * search, Perplexity and Claude answers — which is where a growing share of
 * "who is a good communications speaker in Nigeria" style questions now land.
 *
 * Two are deliberately excluded from the allow list below, because they are
 * scrapers rather than answer engines that cite sources.
 */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI — training + ChatGPT browsing
  "OAI-SearchBot", // OpenAI — ChatGPT search index
  "ChatGPT-User", // OpenAI — user-initiated fetches
  "ClaudeBot", // Anthropic
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot", // Perplexity index
  "Perplexity-User",
  "Google-Extended", // Gemini + AI Overviews grounding
  "Applebot-Extended", // Apple Intelligence
  "meta-externalagent", // Meta AI
  "cohere-ai",
  "CCBot", // Common Crawl — feeds many downstream models
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
      // Scrapers that take content without sending traffic or citing.
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "Amazonbot", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
