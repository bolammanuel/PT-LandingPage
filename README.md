# Precious Tega — Original Template with Client Content

The active page uses the original pre-PDF template from commit `8e5670d`, populated with the client's **The Complete Social Media Management Blueprint** copy. Its original section order, two-column hero, overlapping proof images, evidence area with dedicated before/after comparisons, explanation columns, lesson accordion, instructor layout, four completed disclosures, and closing course-offer card are retained. The hero now uses the client's newer “The High income skill…” headline and supplied description, with centered copy/actions on mobile. A moving price-increase notice sits above the navigation.

The original template’s appearance is retained, with source cleanup for the completed portrait. The appended rules support already-approved controls: equal-sized wordmarks, accessible vector ornaments, accessible pause/resume on the moving ribbon itself, keyboard-visible/reduced-motion content, the scrolling enrolment bar, and supplied media. The main section order remains the original template. The requested comparison subsection and wider closing offer are scoped changes within those sections; the active version does not use the separate thirteen-section PDF layout.

## Preserved versions

- [Active original template with PDF content](dist/index.html).
- [Previous thirteen-section PDF-layout version](../Versions/precious-tega-pdf-layout/dist/index.html), preserved with its complete source and images.
- [Untouched pre-PDF template ZIP](../Others/precious-tega-template-before-client-pdf-8e5670d.zip).
- [Previous PDF-layout ZIP](../Others/precious-tega-client-blueprint-2026-10-25.zip).

`../Versions/` and `../Others/` sit outside the deployment directory. The cPanel configuration publishes only `dist/`.

## Preview and edit

Open `dist/index.html`, or run:

```bash
python3 -m http.server 8000 --directory dist
```

There is no dependency installation or build step. The previous PDF-layout version can be opened independently at its linked `dist/index.html`, or served with a separate static server.

- `dist/index.html`: original template sections filled with approved copy.
- `dist/style.css`: original stylesheet and previously approved control fixes.
- `dist/script.js`: supplied hero images, full-size image viewer, Selar links, confirmed pricing, navigation, animation, and pricing bar.
- `dist/gallery-data.js`: only the six supplied before/after screenshots; no dummy evidence entries or unfilled media slots.
- `dist/course-config.js`: confirmed ₦20,000 price and the pending Selar URL.
- `dist/assets/optimized/`: responsive AVIF/WebP images and JPEG fallbacks; full-size originals remain in `dist/assets/`.
- `dist/assets/fonts/`: the approved fonts served locally, with their licenses.

See [PERFORMANCE.md](PERFORMANCE.md) for measured image reductions, compression/cache settings, and image-maintenance commands. Responsive image delivery preserves the original layout and full-size evidence links. The initial HTML includes all three hero previews; application scripts are deferred.

## Content placement

The PDF supplies the wording below the hero, and the original template supplies the presentation. The client's latest supplied hero copy replaces the longer PDF introduction.

| Original template area | PDF content |
| --- | --- |
| Two-column hero | Latest supplied headline and description, access CTA, and preview images; text and controls center on mobile |
| Evidence section | A dedicated before/after page-growth comparison and the supplied evidence copy |
| Explanation columns | The supplied “You may be making this harder than it needs to be” copy |
| Existing course accordion | All eleven lesson titles and descriptions, plus the supplied course CTA |
| Instructor columns | Precious Tega's complete supplied biography |
| Four existing disclosures | Audience, three templates, mentorship/community, and certificate |
| Original closing offer | Final word, complete inclusions, ₦20,000 price, and enrolment CTAs |

Bracketed production notes are excluded from the page. The supplied Precious Tega portrait is displayed in the original instructor area. Empty course, template, community and certificate preview slots have been removed. The three template bonuses, mentorship and certificate descriptions remain because they are approved PDF content.

## Screenshots and evidence

All six supplied screenshots are copied without edits into `dist/assets/`. They appear as three permanently visible before/after pairs, with account headings, explicit Before/After labels, displayed follower counts, alt text, text descriptions, and intrinsic dimensions. Each pair sits side by side on desktop and stacks vertically on phones; there is no horizontal image carousel. The original hero's three overlapping proof cards show the three after screenshots. Clicking a comparison image opens the full-size viewer for that pair; arrow keys and buttons switch between its before and after images, and Escape closes it. The image links also open the original assets when JavaScript is unavailable.

The observed pairs are Helejené Homes, Jeleosinmi, and Precious Tega's own Instagram page. Captions use the displayed counts without inventing dates, percentages, or revenue results. The before/after comparisons are the only evidence view. The empty Client feedback view and unnecessary category switches have been removed. Unsupplied evidence entries and placeholder-rendering logic are removed from the active site; earlier scaffolding remains recoverable from the preserved versions and the pre-cleanup ZIP.

## Checkout and accessibility

The confirmed price is `20000` in `NGN`. Supply the actual HTTPS Selar product URL in `course-config.js` when available. Until then, all enrolment controls open the official Selar homepage in a new tab. Once `selarUrl` is supplied, that one setting updates every enrolment control. The closing offer card keeps one purchase button. There is no discount, deadline, or hidden countdown in the review build. The unused contact/registration popup has also been removed; all enrolment buttons lead directly to Selar.

Keep the skip link, visible focus, native dialogs and disclosures, focus restoration, keyboard navigation, readable text, 44px controls, and reduced-motion support. The moving strip above the navigation displays “₦20,000 NOW · PRICE INCREASES SOON”, replacing the highlights strip below the hero. ₦20,000 remains the current price; no future amount or deadline has been supplied. It has no separate Pause button. Clicking the strip, or pressing Enter/Space when it is focused, persistently pauses/resumes motion; hover pause and reduced-motion support remain. Repeated visual messages receive one accessible label. Reduced motion presents one static message. The previously requested bottom pricing bar appears after the hero and yields to the closing course offer and footer. Bottom clearance is reserved only while the bar is visible; footer padding stays compact, with inline clearance for the floating back-to-top control. The closing card is capped at 960px on desktop, with fluid mobile width, and its introductory copy uses a wider reading measure. These implementation details do not establish full WCAG conformance; browser, screen-reader, reflow, and zoom checks are still required before launch.

```bash
node --check dist/script.js
node --check dist/gallery-data.js
node --check dist/course-config.js
python3 scripts/refresh-assets.py
git diff --check
```

## Client review package

`../Others/precious-tega-client-review-2026-10-25.zip` contains only the static website for review. The pre-cleanup source is preserved separately in `../Others/precious-tega-before-client-cleanup-2026-10-25.zip`. The earlier PDF-layout version remains unchanged. The actual Selar product URL is the only intentionally pending destination. Browser and screen-reader verification remain required before production launch.

## VS Code save conflicts

“Failed to save: The content of the file is newer” concerns a stale unsaved editor buffer, rather than a Git merge. Use Compare to preserve intentional unsaved edits. When the saved file is the version to keep, **File: Revert File** reloads the affected editor from disk. Avoid Overwrite on a stale tab. **Git: Discard Changes** is a different operation that can remove the updated page.

See `SEO-LAUNCH.md` for existing cPanel deployment, canonical URL, redirects, and launch checks. Nothing has been deployed by this local content update.
