# PT Landingpage

An early responsive design concept for a social media training sales page. All programme copy is provisional. The brand name is Precious Tega.

## Preview

Open `dist/index.html`, or serve `dist` with a static web server. No build or dependencies required. Google Fonts are optional; system fallbacks are included.

## Editing

- `dist/index.html`: copy, programme sections, FAQs, and links.
- `dist/style.css`: palette, typography, layout, and mobile styles.
- `dist/script.js`: programme details dialog.

Before launch, confirm the proposed curriculum; supply the approved headline, programme name, audience, biography, portrait, verified testimonials, price, dates, delivery details, registration link, contact information, and applicable policies. The draft deliberately does not collect visitor information or take payments.

## Evidence galleries

Edit `dist/gallery-data.js` to replace the image placeholders. Put approved images in `dist/assets/` and set each item's `src` to its relative path, e.g. `assets/payment-01.jpg`. Update its `title`, `description`, and `alt` with approved context. Images display in full using contain sizing; clicking opens a modal. Filters apply to the results gallery, and the viewer browses the selected collection, wrapping at both ends. Arrow keys navigate; Escape closes the native dialog.

Only add evidence belonging to this client; reference-site screenshots are not presented as her results. Final copy and any financial claims still require her confirmed details.

## Selar checkout and optional offer

Set `selarUrl` in `dist/course-config.js` to the actual HTTPS Selar product URL. All purchase buttons will open that listing. Until configured, they open the registration message.

Set the regular `price`, optional `discountPrice`, and a fixed `discountEndsAt` ISO timestamp with timezone. A timed offer only appears when a valid Selar URL, valid lower discount price, and future deadline are configured. It expires without resetting and returns to the regular displayed price. Configure the matching price and deadline on Selar as well: this page does not change Selar pricing or enforce its discount. The page copy remains a proposed draft; confirm curriculum, instructor biography, and other claims with the client before launch. Review notes have been removed from visitor-facing sales copy.

Section 01 contains payments, invoices, and six client feedback screenshot slots. Use the Client feedback filter to view feedback together. Add each image to the corresponding `feedback-01` through `feedback-06` entry in `dist/gallery-data.js`.

## Accessibility

Aim for WCAG 2.2 AA. Body text uses 1.125rem (18px at default settings), supporting text is at least 0.875rem, and controls have 44px minimum touch targets. Preserve the skip link, visible focus, native dialog/accordion behavior, reduced-motion settings, and responsive navigation.

Before publishing, verify keyboard-only navigation, screen-reader labels/dialog announcements, 200% text resizing, 400% browser zoom, and reflow at 320 CSS pixels. Check text-spacing overrides and contrast on any new colour combinations. Add accurate alt text and a text equivalent in each image entry's `description` for meaningful screenshot text, with permission and private information removed. The viewer displays this description for supplied images. Image placeholders are not client evidence. These implementation changes alone do not establish full WCAG conformance.

## SEO and deployment URL

The canonical homepage is `https://precioustega.suavedigitals.com/`. Deployment now targets the subdomain document root. See `SEO-LAUNCH.md` for the root homepage deployment, old `/site/` redirects, Search Console submission, and remaining content requirements. WordPress has been removed; `dist/.htaccess` serves the static homepage and `dist/robots.txt` permits crawling. Metadata and course structured data describe existing course content; rankings and rich results are not guaranteed. Run `python3 scripts/refresh-assets.py` after changing CSS, JavaScript, or the favicon.
