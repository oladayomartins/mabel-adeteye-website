/**
 * Hero background animation.
 *
 * Pure CSS + inline SVG — no JavaScript, no canvas, nothing on the main thread.
 *
 * Smoothness notes:
 * - Every animation drives only `transform` / `opacity`, which the compositor
 *   handles off-thread.
 * - Each rotating ring set is its own positioned element, so the browser can
 *   promote it to a layer and spin it on the GPU. Rotating a `<g>` *inside* one
 *   SVG would instead repaint the whole SVG every frame.
 * - No blur filters: the softness comes from radial gradients, which cost
 *   nothing to composite.
 *
 * Motifs are taken from the brand rather than invented: the concentric rings
 * echo the circular swoosh in the logo, and they sit centred behind the arch
 * standing behind the portrait.
 *
 * Decorative, so aria-hidden, non-interactive, and behind the content in the
 * hero's own stacking context. All motion stops under prefers-reduced-motion,
 * leaving a static composition.
 */
export default function HeroBackdrop() {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      {/* Tinted wash under the transparent header */}
      <span className="hero-wash" />

      {/* Soft brand light, drifting slowly */}
      <span className="hero-orb hero-orb--one" />
      <span className="hero-orb hero-orb--two" />

      {/* Counter-rotating ring sets, each its own compositor layer */}
      <div className="hero-ringset hero-ringset--slow">
        <svg viewBox="0 0 800 800" fill="none" focusable="false">
          <circle cx="400" cy="400" r="384" className="hero-ring hero-ring--hair" />
          <circle
            cx="400"
            cy="400"
            r="300"
            className="hero-ring hero-ring--dashed"
            strokeDasharray="2 14"
          />
        </svg>
      </div>

      <div className="hero-ringset hero-ringset--fast">
        <svg viewBox="0 0 800 800" fill="none" focusable="false">
          <circle cx="400" cy="400" r="232" className="hero-ring hero-ring--hair" />
          <circle
            cx="400"
            cy="400"
            r="168"
            className="hero-ring hero-ring--dashed"
            strokeDasharray="1 10"
          />
        </svg>
      </div>

      {/*
        Ripples: three copies of the same ring on one long, staggered cycle, so
        there is always one growing outward and fading. Scale + opacity only.
      */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="hero-ringset hero-ripple"
          style={{ animationDelay: `${i * 4}s` }}
        >
          <svg viewBox="0 0 800 800" fill="none" focusable="false">
            <circle cx="400" cy="400" r="200" className="hero-ring hero-ring--ripple" />
          </svg>
        </div>
      ))}

      {/* Fine editorial dot texture, faded out towards the edges */}
      <span className="hero-texture" />
    </div>
  );
}
