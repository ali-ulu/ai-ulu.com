# Tech / Web3 Portfolio Path (Package C)

The composition path for **Package C** client jobs: developer, studio, Web3 or technical-founder portfolios.
It narrows [`SERVICE-DELIVERY.md`](SERVICE-DELIVERY.md) (design floor, refuse list, checklist) to one page type, so a builder can take the next tech-portfolio brief without inventing structure.

**Reference implementation:** `ornekler/c-portfoy/` on ai-ulu.com. It follows every rule below, using our own public work (HUQAN, LEVH).

**Out of scope**
- HUQAN or any internal product UI as a template (it is content in our own portfolio, not a layout to fork)
- Wallet connect, on-chain reads or token gating unless the client asks in writing (see §6)
- Traffic, ranking or hiring-outcome promises

---

## 1. Section order

Fixed order. A section may be dropped when the client has nothing true to put in it; sections are never reordered to hide a gap.

| # | Section | Job | Must contain |
|---|---------|-----|--------------|
| 1 | **Hero** | Who, what they build, one next step | Name or studio, one-line positioning, primary CTA to Selected work, secondary CTA to contact |
| 2 | **Selected work** | Prove capability through cases | 2–4 cases in the §3 format, strongest first |
| 3 | **Proof** | Let the visitor check the claims | Only items from §4, each with a link and a date |
| 4 | **Services / availability** | Say what can be bought now | What the client offers, how to engage, current availability |
| 5 | **Contact** | One clear next step | A real channel (email, form, booking link) that works |

Hero composition follows the spiral rule in `SERVICE-DELIVERY.md` §2.1: headline and primary CTA at the focal point, supporting visual on the next turn. On mobile the spiral collapses to a vertical order with the headline and CTA in the first screen.

## 2. Visual defaults

| Decision | Default | Change it when |
|----------|---------|----------------|
| Ground | Dark and calm (near-black, not pure black) | The brand kit is light, or the client's work is print/editorial; then use paper |
| Accent | One colour, used for the primary CTA and one motif | Never add a second accent |
| Layout | φ columns (`1fr / 0.618fr`) for hero, cases and services | A block fails the squint test |
| Type | Two families: one grotesk or serif for display, one mono for labels and data | Brand kit forces otherwise |
| Depth | Glass or liquid surfaces only over a real background (generative field, photo, video) | There is nothing behind them; glass over flat colour is decoration |
| Motion | Hero background may move; case content holds still while read | Reduced motion: no loops, no parallax |

Refuse on top of the general list: matrix-rain or neon-grid heroes, AI-purple gradients, hexagon/circuit wallpaper, "Web3" as a colour scheme, logo walls of chains or tools the client did not ship with.

## 3. Case study minimum

Every case uses the same three labelled parts. A case missing a true outcome is shown as **in progress**, not padded.

| Part | Content | Rule |
|------|---------|------|
| **Problem** | What was wrong or missing, for whom | One or two sentences, no jargon the buyer would not use |
| **Approach** | What the client did and the key technical decision | Name the client's role if the work was a team effort |
| **Outcome** | What exists now | Numbers only if true, sourced and dated; otherwise a concrete artefact (live URL, release, merged PR, audit report) |

Each case links out to at least one inspectable artefact: repository, live URL, package page, contract address or audit report.

## 4. Proof blocks

A proof block is a single claim plus the link that verifies it.

**Allowed, when real and owned by the client:** repository links, releases and version numbers, package registry pages, merged PR counts from a linked query, live product URLs, contract addresses with an explorer link, published audit reports, talks or papers with a link.

**Never:** invented or rounded-up metrics (`4.1×`, `92%`, "10k+ users"), stars or follower counts presented as proof of quality, testimonials without a named and consenting source, logos of companies the client did not work for, "trusted by" rows.

**Dating rule:** every number carries the date it was read ("Figures read from GitHub and npm on 24.09.2026") and links to the live source, because it will go stale.

Small real numbers beat large vague ones. If a number does not help the buyer decide, leave it out rather than dress it up.

## 5. Bento

Bento grids are allowed for **proof, stack and live links**, where items are genuinely different in kind and size. They are not allowed as the page structure or for services (that is the identical-card-grid refusal in a new shape).

- Tile size follows importance: the claim a buyer should see first gets the wide tile.
- Every tile carries information; no decorative or empty tiles.
- Mobile: single column, same order as desktop reading order.

## 6. Web3 specifics

- On-chain claims link to a block explorer, never a screenshot.
- Wallet connect is **not** added for looks. Adding it needs a written user need, a security review of the connect flow, and a fallback for visitors without a wallet.
- Token or NFT imagery appears only when it is the client's own work and they hold the rights.

## 7. Builder checklist

Tick before calling Build done (in addition to `SERVICE-DELIVERY.md` §3).

### Content
- [ ] Section order matches §1; any dropped section is noted in the handoff
- [ ] Every case has Problem, Approach and Outcome
- [ ] Every number is true, sourced, linked and dated
- [ ] No proof item from the §4 "never" list

### Layout and visuals
- [ ] Hero headline and primary CTA visible without scrolling at 1440×900 and 390×844
- [ ] One accent colour, used on the primary CTA and at most one motif
- [ ] Glass/blur surfaces sit over a real background and have an opaque fallback when `backdrop-filter` is unsupported or reduced transparency is requested
- [ ] Bento used only for proof, stack or live links

### Behaviour
- [ ] Reduced motion: background loops and parallax off, all content still present
- [ ] JavaScript disabled: all copy, links and contact path still usable
- [ ] No horizontal overflow on mobile; no console errors

### Handoff
- [ ] Where each number came from and when it must be refreshed
- [ ] Which sections were dropped and why

---

*Issue reference: ai-ulu.com #7. Web3 / tech portfolio template path (client-facing, not HUQAN).*
