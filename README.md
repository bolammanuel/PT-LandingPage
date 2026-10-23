# PT Landingpage

An early responsive design concept for a social media training sales page. All programme copy is provisional. The brand name is Precious Tega. Contact: +234 811 417 0437.

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

Client feedback has six screenshot slots, shared between the evidence filter and the dedicated feedback grid. Add each image to the corresponding `feedback-01` through `feedback-06` entry in `dist/gallery-data.js`.
