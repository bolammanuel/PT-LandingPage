# SEO and Root URL Launch

The active version now uses the original pre-PDF template structure with the approved Blueprint copy and six supplied screenshots. The previous PDF-layout version is preserved independently in `../Versions/precious-tega-pdf-layout/`; it is outside the deployment source.

The preferred public URL is `https://precioustega.suavedigitals.com/`.
`.cpanel.yml` now copies `dist/` into the subdomain document root instead of `/site/`.
Confirm that cPanel Domains lists `/home2/suavedig/public_html/precioustega.suavedigitals.com` as this subdomain's document root before deploying.

## Switch the homepage

WordPress has been removed. Deployment includes `.htaccess`, which serves `index.html` and permanently redirects `/site/`, `/site/index.html`, and explicit `/index.html` requests to the root URL. Internal homepage resolution does not trigger the redirect.

1. Confirm the subdomain document root matches the deployment destination above.
2. Deploy the new commit through cPanel and open the root URL in a private browser window.
3. Check the redirect URLs and assets. The old `/site/` files remain after deployment; remove them only after verifying the root site works.
4. Clear hosting/CDN caches. Asset query versions do not purge a cached HTML page.

The deployed `.htaccess` replaces a file of the same name. If hosting-specific directives remain after WordPress removal, merge those into the repository copy before deployment. `robots.txt` now permits crawling and references the sitemap.

## Search launch checks

- Verify root HTML returns HTTP 200, CSS/JS load, `/site/` redirects once to root, and HTTPS works.
- Verify text compression, revalidated HTML, and long-lived caching of versioned assets. Confirm AVIF/WebP/WOFF2 content types and responsive image loading; see `PERFORMANCE.md` for the local measurements and deployment checks.
- Check that the deployed `/robots.txt` references the sitemap and that hosting HTTP headers do not set `noindex`.
- Verify site ownership in Google Search Console, submit `/sitemap.xml`, and inspect/request indexing of the root URL. Search Console access is required; none of these account actions have been completed by this repository change.
- Run PageSpeed Insights, mobile/keyboard checks, and the Schema Markup Validator against the deployed URL. Course markup describes the course; it does not guarantee a Google rich result.

## Content and measurement

The approved course is “The Complete Social Media Management Blueprint”. The PDF supplies eleven lessons on social media management, content strategy, content calendars, hooks, content creation, video editing, Canva, page growth, analysis, client acquisition, and portfolios/interviews. Keep metadata aligned with that copy; do not add unsupported geographic claims.

The client PDF supplies the curriculum, biography, ₦20,000 price, three templates, two weeks of free mentorship, community access, and completion certificate. The supplied portrait and six approved before/after screenshots are included. Empty feedback and preview slots are removed from the review build. Add the actual Selar product URL when supplied; the buttons currently open Selar. No conditional ₦45,000 comparison or unconfirmed deadline is published. Do not add ratings/reviews to structured data without real evidence.

Use real professional/social profiles and relevant partner links to help discovery. Publish useful, original answers to actual customer questions rather than adding repetitive keywords or bulk pages. Track Search Console impressions, queries, clicks, and indexing after launch; rankings are not guaranteed.

## Future edits

Keep the title, description, visible course content, JSON-LD, canonical, social URLs, and sitemap consistent. Run `python3 scripts/refresh-assets.py` whenever an asset changes, followed by `git diff --check`. No account credentials or verification tokens are included.

## Social link previews

Open Graph and Twitter Card tags are included in the initial HTML, with Precious Tega's name, the complete blueprint course title and description, and a 1200 × 630 black, white, and dark pink branded PNG at `/assets/precious-tega-blueprint-preview.png`. Deploy both the HTML and image. The new filename distinguishes it from the previous cream graphic, which remains available for previously shared links. Confirm the new image URL returns HTTP 200 with an image content type, without a login or crawler block.

To rebuild the graphic on macOS, run `swift -module-cache-path /tmp/pt-swift-module-cache scripts/build-social-preview.swift`. The published website needs no Swift installation or build step.

WhatsApp, Telegram, and other clients control their preview layout and may cache previous previews; image, title, or description display can vary by app and settings. Check a newly shared root URL after deployment. If a preview is stale, refresh it with the platform's supported preview/debug tools where available. Local metadata checks do not verify live in-app previews.
