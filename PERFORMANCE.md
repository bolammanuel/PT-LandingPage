# Loading and interaction performance

The static site keeps the approved layout, PDF wording below the hero, before/after comparisons, original evidence viewer, and accessibility controls. The shorter hero uses the client's latest supplied headline and description. Its initial rendering no longer depends on a Google Fonts stylesheet or JavaScript-generated hero images. The top price notice reuses the existing transform animation and pause/reduced-motion controls.

## Image delivery

Seven original images remain byte-for-byte unchanged for the full-size viewer and recovery. The page uses responsive AVIF and WebP pictures, with progressive JPEG fallbacks. Each image has 360px, 720px, and original-width variants. The browser chooses a size based on the image's rendered width and screen density; it downloads one supported format per picture. The portrait and comparison images load lazily with reserved dimensions. The front hero image loads eagerly with high priority. All three hero previews are present in the initial HTML and remain usable without JavaScript.

The following are measured file sizes for the set of seven images, excluding HTML, fonts, and original images opened in the viewer:

| Image set | Original assets | AVIF | WebP | JPEG fallback |
| --- | ---: | ---: | ---: | ---: |
| 360px wide | 1,904,686 bytes | 91,437 bytes | 103,660 bytes | 167,067 bytes |
| 720px wide | 1,904,686 bytes | 214,447 bytes | 243,468 bytes | 421,940 bytes |
| Original width | 1,904,686 bytes | 431,555 bytes | 466,578 bytes | 928,394 bytes |

The 720px AVIF set is about 89% smaller. These are asset comparisons, not measured total page transfers or load times. Browsers can request a larger image when the viewport or device pixel ratio changes. Full-size originals load when the viewer is opened. All variants are deployed, but visitors download only selected resources.

## Fonts, scripts, and scrolling

Only the fonts used by the approved design are served: DM Sans normal and Playfair Display normal/italic, as variable WOFF2 files. Their combined size is 114,140 bytes. The two normal faces are preloaded; `font-display: swap` allows fallback text while fonts arrive. The unused Manrope request and external font stylesheet/preconnections are removed. Fontsource distributes these fonts under the included SIL Open Font Licenses in `dist/assets/fonts/`.

The three small application scripts are deferred in dependency order. The bottom enrolment bar uses IntersectionObserver instead of repeatedly measuring the hero, checkout, and footer on scroll. It measures its own height when shown or resized and updates styles when state changes. Browsers without observers retain the previous viewport/resize fallback. Keyboard focus protection, reduced motion, ribbon pause/resume, and the compact footer remain.

## Hosting and updates

`dist/.htaccess` enables gzip for text through Apache's compression/filter modules, with guarded directives for hosts without those modules. HTML revalidates; versioned CSS/JS/SVG URLs and fingerprinted image/font filenames can be cached for a year. Unversioned original JPEG/PNG files have a one-day cache lifetime. Existing canonical redirects remain.

Run `python3 scripts/refresh-assets.py` after editing CSS, JavaScript, or the favicon. For future source-image changes, run `python3 scripts/optimize-images.py` with Pillow supporting AVIF/WebP; it creates hashed derivatives and refreshes existing picture markup. The script and its image manifest are maintenance files outside `dist/`; the deployed website needs no Python, dependency installation, or build step.

Font binaries are sourced from `fontsource/font-files`. Their pinned Git blob IDs are `01383d7e5c4340847b8fe4570ad0458e6582989d` (DM Sans), `5a3fbbdae8f66414a2754017de622f3c74c536b0` (Playfair normal), and `8ae1f1f7ed71f4b63c71218cb61c8fcb795099ff` (Playfair italic).

## Verification

Local checks cover JavaScript syntax, the original approved PDF passages (with the newer hero copy checked separately), unchanged client originals and preserved PDF-layout files, all 63 decoded image variants, resource hashes/paths, source widths, deferred script order, static hero images, image viewer collections, Selar routing, ribbon keyboard/reduced-motion controls, and the enrolment bar's visibility/focus/resize behavior. Apache configuration syntax passes with the relevant modules loaded. A simulated 100 repeated scroll updates performs no new element measurements or repeated body-style writes after the bar's initial measurement.

Browser rendering and throttled mobile/desktop network measurements are unavailable in this execution environment. After deploying the entire `dist/` directory, verify response `Content-Encoding`, `Cache-Control`, font/image MIME types, and resource loading in browser developer tools. Run PageSpeed Insights and check real mobile Safari/Chrome, desktop browsers, keyboard navigation, and reduced motion. No live Lighthouse score, universal device compatibility, or fixed load-time guarantee is claimed.

References: [responsive pictures](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture), [critical content loading](https://web.dev/articles/optimize-lcp), and [Apache gzip compression](https://httpd.apache.org/docs/2.4/mod/mod_deflate.html).
