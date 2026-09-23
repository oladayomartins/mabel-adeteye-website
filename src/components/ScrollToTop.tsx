"use client";

import { useEffect } from "react";

/**
 * Starts every page load at the top.
 *
 * Browsers restore the previous scroll position on reload (`scrollRestoration:
 * "auto"`), so refreshing part-way down a long page drops you back into the
 * middle of it — which reads as the site "loading from the bottom". On a
 * marketing site the first screen is the point, so restoration is turned off.
 *
 * A hash is respected: /insight-room#register must still land on the form.
 */
export default function ScrollToTop() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  return null;
}
