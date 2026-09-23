const TYPEABLE =
  "input:not([type=hidden]):not([type=radio]):not([type=checkbox]):not([tabindex='-1']), textarea, select";

/**
 * Enter in a single-line field moves to the next typeable field instead of
 * submitting.
 *
 * Implicit submission on Enter is what makes a half-filled form jump: the
 * browser submits early and scrolls to its first validation bubble, or, in a
 * step with no submit button, nothing happens at all. Walking forward keeps the
 * visitor in the form. Returns false on the last field so the caller decides
 * what "done" means; null when the key press is not ours to handle.
 */
export function focusNextField(e: React.KeyboardEvent<HTMLFormElement>): boolean | null {
  const target = e.target;
  if (e.key !== "Enter" || e.nativeEvent.isComposing) return null;
  if (!(target instanceof HTMLInputElement) || !target.matches(TYPEABLE)) return null;

  e.preventDefault();
  const fields = [...e.currentTarget.querySelectorAll<HTMLElement>(TYPEABLE)];
  const next = fields[fields.indexOf(target) + 1];
  if (!next) return false;
  next.focus();
  return true;
}

/**
 * Scrolls `el` to the top of the view (its `scroll-margin-top` clears the
 * sticky header) and moves focus to `focus`, defaulting to `el`.
 * `preventScroll` stops the browser doing its own, header-blind scroll.
 */
export function reveal(el: HTMLElement | null | undefined, focus: HTMLElement | null = el ?? null) {
  if (!el) return;
  el.scrollIntoView({ block: "start" });
  focus?.focus({ preventScroll: true });
}
