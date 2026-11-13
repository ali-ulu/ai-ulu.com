# MOTION.md — ai-ulu.com

Motion ledger for this site, kept to the format in `ulu-design-dna/docs/MOTION-AND-VIDEO-SYSTEM.md`.
One ledger; update it when a scene changes.

## Route `/` — profile: Immersive (film) then Reading (rest of the page)

| | |
|---|---|
| Scroll authority | Native browser scroll. No Lenis, no snapping, no hijack. |
| Clock | Scroll. One normalised value 0–1 from `client/home/progress.js`. |
| Renderer | One WebGL canvas (`#gl`), OGL 1.0.11, lazy chunk. Copy stays HTML. |
| Property owners | Chapter `opacity/visibility/transform`: `chapters.js` only. Canvas `opacity`: CSS only. 3D poses: `scene/pose.js` only. |
| Pin | `#film` 460vh, `.stage` sticky for one viewport. |

### Art direction

Thesis: **the site as an object, cut into its four layers.** The visitor picks
their line of work and the top layer becomes their site. Rejected: the previous
laptop (a device mock-up, 670 KB of three.js, desktop only); a hero video in the
manner of the Entropia reference (no footage, and generating it is unapproved spend).

Learned from the reference (entropiauniverse.com, inspected 2026-11-13, 1280×598):
*Measured* — six sections, each exactly one viewport tall; a dot rail with
up/down arrows on the right. *Observed* — oversized headline with one accent
word, a facts strip under the hero, a "choose your path" selector that swaps
the subject, square-cornered controls. Adopted as patterns: one viewport per
beat, the rail, the selector, the facts strip. Not adopted: its typeface,
palette, imagery, copy.

### Beats

| # | Stop | Range (a–b) | Beat | Visual job | Verb |
|---|---|---|---|---|---|
| 0 | 0.00 | 0–0.10 | Hook + choice | closed stack; sector picker | swap |
| 1 | 0.25 | 0.17–0.33 | Design | top sheet pulled out | pull |
| 2 | 0.50 | 0.42–0.58 | Speed | second sheet | pull |
| 3 | 0.75 | 0.67–0.83 | Visibility | third sheet | pull |
| 4 | 1.00 | 0.92–1 | Conversion + action | base sheet stays out | hold |

Source of truth for the numbers: `STOPS` / `RANGES` in `scene/pose.js`
(`test/home-scene.test.js` checks the markup against them).

### Behaviour by mode

- **Desktop ≥ 861px:** copy alternates left/right, stack on the other side.
- **Phone:** copy top (hero) or bottom (chapters), stack between, picker in thumb
  reach, the call bar is the call to action. Same scene, portrait camera.
- **Reduced motion, Data Saver, deviceMemory < 4, no WebGL, script failure:**
  `.no-3d` — ordinary flow, every chapter readable, hero box unchanged (no CLS).
- **No JavaScript:** same column via `<noscript>` styles; picker hidden.
- **Leaving:** skip link "Filmi geç"; the rail's last step scrolls past the film.

### Cost

Entry `js/home.js` 2.9 KB gzip; scene chunk 19 KB gzip (was 670 KB raw three.js).
Renders on demand: no frame runs unless scroll or a sector swap is in progress,
and none while the film is off screen. DPR capped at 2. 13 draw calls, no depth buffer.

### QA evidence (2026-11-13, headless Chrome 1440×900, 1440×620, 1024×768, 768×1024, 390×844, SwiftShader)

Checked: stops 0/0.25/0.5/0.75/1 at every viewport; rail forward to the exit;
sector tap → WhatsApp href, CTA label, form prefill; reduced motion; no-JS;
no horizontal overflow; console and failed requests clean; unit 141/141, e2e 29 passed.

**Not verified:** real iOS Safari and real Android devices; Lighthouse mobile
score; frame rate on a real GPU; resize while mid-film; WebGL context loss.
