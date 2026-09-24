# Service Delivery Standard — Client Web Work

This document is the **craft floor** for paid client websites and portfolios delivered by ai-ulu.

It sits under the commercial model in `80-SERVICE-MODEL.md` (Blueprint → Build → Verify → Launch) and locks visual / interaction standards so quotes, builds, and handoffs stay consistent.

**Out of scope for this standard**
- HUQAN and other internal product UIs (they are examples, not client templates)
- Inventing requirements the client did not approve
- Guaranteeing traffic, rankings, or AI citations

**Related tools**
- Delivery engine / design floor: [scroll-craft](https://github.com/ali-ulu/scroll-craft) (taste floor includes golden ratio & spiral guidance)
- Lead pipeline: [LeadScout](https://github.com/ali-ulu/lead) (discovery, audit, Opportunity Gap, CRM, outreach)

---

## 1. Commercial packages (default menu)

Use these names in proposals. Scope may shrink with client budget; do not invent new package names mid-sale without updating this list.

| Package | What the client gets | Typical shape |
|---------|----------------------|---------------|
| **A — Cinematic landing** | One scroll-driven page: hero with clear focal CTA, 3–6 acts, verify pass | Single HTML/CSS/JS or static export |
| **B — Product / brand page** | Layered or scrub hero, product story, proof, strong close CTA | Landing + optional secondary section |
| **C — Tech / Web3 portfolio** | Case-led work, dark or calm default, proof blocks only with real evidence | Portfolio + case pages or long one-pager |
| **D — Full brand experience** | Distinct page grammar, signature interaction, multi-act uniqueness | Multi-section or multi-page within agreed scope |

### Package rules
- Every package includes: mobile pass, reduced-motion respect, contrast-conscious type, no invented statistics.
- **A/B** default to scroll-craft taste floor + φ composition where it helps hierarchy.
- **C** prefers case study structure over thumbnail-only galleries.
- **D** requires a written “signature move” (one bespoke interaction that is not a recoloured spotlight).
- HUQAN is **not** a package.

### Rough effort bands (internal only — adjust per market)
Use for capacity planning, not as public price list until sales locks numbers.

- A: focused 1–3 day craft cycle after brief is clear  
- B: 3–7 day cycle  
- C: 5–10 day cycle depending on case depth  
- D: scoped only after Blueprint  

---

## 2. Design floor (always on)

### 2.1 Golden ratio & spiral

- Tokens: `--phi: 1.618;` `--phi-inverse: 0.618;`
- Prefer main/side columns near `1fr / 0.618fr` or `61.8% / 38.2%` when hierarchy needs asymmetry.
- Typography and large spacing *may* step by φ; keep a fine base (e.g. 4px) for small rhythm.
- Cards / key media *may* use `aspect-ratio: 1.618 / 1` when it serves composition.
- **Spiral is a placement guide, not a decoration:**
  - Primary: headline + primary CTA near spiral centre of the hero
  - Secondary: next turn (supporting visual / proof)
  - Tertiary: outer content
  - Do not draw a visible Fibonacci overlay on the live site
- On mobile, spiral collapses → vertical order; keep focal content high.
- If a φ layout fails the squint test (blur the page; primary/secondary still clear), abandon φ for that block.

### 2.2 Scroll & motion

- Prefer scroll as narrative timeline when the brief is immersive (packages A/B/D).
- Animate primarily `transform` and `opacity`; avoid layout thrash.
- Respect `prefers-reduced-motion`: fewer/gentler moves, keep opacity that carries meaning.
- No scroll-cue chrome (“↓ scroll”, animated mouse) unless the client insists in writing.

### 2.3 Type, colour, depth

- At most two type families unless brand kit forces more.
- Body measure roughly 45–75ch; avoid full-bleed paragraphs on wide screens.
- Six colour roles max + one accent; lock accent across the page (exception: hard light/dark cuts need documented two-stop accent of the **same hue**).
- No pure black; secondary text tinted, not flat grey.
- Depth tools: offset shadow, edge light, scale/blur as distance, overlap, light grain — not zero-offset neon halos by default.

### 2.4 Refuse list (client builds)

Do not ship unless the brief explicitly requires it:

- Identical feature-card grids as page structure  
- Three equal columns of icon + title + text  
- AI-purple gradients / glowing generic CTAs as the whole identity  
- Em dashes in visible marketing copy  
- Invented metrics (`4.1×`, `92%`, fake user counts)  
- Scroll cues and decorative “01 / 06” section numbers without informational value  
- Nested cards and empty trailing grid cells  

Full refuse vocabulary lives in scroll-craft `references/taste.md`; this list is the sales-facing subset.

---

## 3. Page composition checklist

Use before calling Build done.

### Hero
- [ ] One primary message, max ~two lines of headline on desktop  
- [ ] One primary CTA visible without scrolling on common laptop heights  
- [ ] Focal pair (type + CTA) placed with spiral / hierarchy intent  
- [ ] Subtext short; no wall of claims  

### Body
- [ ] Acts or sections have distinct jobs (no two adjacent “same feeling” fillers)  
- [ ] More space above headings than below (section boundaries)  
- [ ] Images have width+height strategy (no surprise reflow)  
- [ ] Text over media uses corner/band/column density, not lazy full-frame wash  

### Close
- [ ] Single clear next step (contact, book, request access)  
- [ ] Contact path real (email / form / agreed channel)  

### Mobile
- [ ] Hero type stepped down so it does not explode to six lines  
- [ ] CTAs tappable; no hover-only critical actions  
- [ ] Horizontal overflow none  

### Accessibility & honesty
- [ ] Contrast checked on real backgrounds  
- [ ] Reduced motion path exists  
- [ ] No fake social proof  

---

## 4. Package-specific notes

### A — Cinematic landing
- One engineered peak (peak-end), not three competing peaks  
- Scroll devices only where they advance the argument  
- Verify: no dead scroll, cues reach full opacity where used  

### B — Product / brand page
- Product truth before decoration  
- Proof section only with client-approved assets  
- CTA consistent wording site-wide  

### C — Tech / Web3 portfolio
- Full section order, proof rules and builder checklist: [TECH-PORTFOLIO-PATH.md](TECH-PORTFOLIO-PATH.md)  
- Case study minimum: problem → approach → outcome  
- Proof blocks: GitHub, live URLs, on-chain links — **only if real**  
- Dark or calm default; avoid matrix-neon cliché  
- Bento allowed for skills/stack; not as lazy feature-card wallpaper  

### D — Full brand experience
- Written grammar choice (what this page forbids vs requires)  
- One signature move documented  
- Differs from prior client pages on uniqueness dimensions when applicable  

---

## 5. Blueprint → Build → Verify → Launch (web clients)

| Stage | Web delivery focus |
|-------|--------------------|
| **Blueprint** | Brief, package (A–D), brand constraints, asset list, success CTA, out-of-scope, mobile priority |
| **Build** | Implement against this standard + approved mock/copy; no silent scope creep |
| **Verify** | Checklist in §3; scroll-craft verify pass when immersive; real-device glance on phone |
| **Launch** | Hosting target, DNS, analytics only if requested, handoff notes, rollback path if redesigning live site |

Human approval required for: final copy claims, pricing on page, legal text, third-party scripts, and any deviation from refuse list.

---

## 6. LeadScout → delivery pipeline

LeadScout finds and scores businesses; this standard defines what we sell them.

### Suggested mapping (heuristics, not guarantees)

| LeadScout signal | Lean toward package |
|------------------|---------------------|
| High Opportunity Gap + weak/no owned site | **A** cinematic landing |
| Has site, weak structure / no product story | **B** product page |
| Creator / studio / dev with thin case narrative | **C** portfolio |
| Multi-property or high-stakes brand | **D** after Blueprint |

### Outreach discipline
- Cite **inspectable** audit observations (e.g. missing title, no HTTPS, thin content) — not “you will rank #1”.  
- Scores are readiness heuristics, not traffic predictions.  
- CRM states stay in LeadScout; delivery tasks stay in ai-ulu.com project board.  

---

## 7. Handoff artifact (minimum)

Every paid web job closes with:

1. Live URL (or staged URL + go-live steps)  
2. Source location (repo / zip)  
3. Package letter (A–D) and agreed deviations  
4. Asset list used  
5. How to edit common copy (or “ai-ulu retains edit access”)  
6. Verify notes (what was checked)  

---

## 8. Change control

- Updates to this standard are intentional commits on `ai-ulu.com`.  
- Client exceptions are written on the Blueprint / proposal, not implied by chat.  
- scroll-craft taste floor remains the detailed craft reference; this file is the **commercial + checklist** layer.  

---

*Issue reference: ai-ulu.com #3 — Service stack: scroll-craft + golden ratio as default delivery standard.*
