# SEO and Root URL Launch

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
- Check that the deployed `/robots.txt` references the sitemap and that hosting HTTP headers do not set `noindex`.
- Verify site ownership in Google Search Console, submit `/sitemap.xml`, and inspect/request indexing of the root URL. Search Console access is required; none of these account actions have been completed by this repository change.
- Run PageSpeed Insights, mobile/keyboard checks, and the Schema Markup Validator against the deployed URL. Course markup describes the course; it does not guarantee a Google rich result.

## Content and measurement

Initial target: “social media business course”, supported by positioning, service packaging, content strategy, and client communication. Confirm audience and location before adding geographic claims.

Replace placeholders with client-approved photos and genuine feedback. Confirm the curriculum, biography, actual Selar URL, price, duration, access period, and delivery details. Competitor pages often supply these decision-making details; do not invent them or add ratings/reviews to structured data without real evidence.

Use real professional/social profiles and relevant partner links to help discovery. Publish useful, original answers to actual customer questions rather than adding repetitive keywords or bulk pages. Track Search Console impressions, queries, clicks, and indexing after launch; rankings are not guaranteed.

## Future edits

Keep the title, description, visible course content, JSON-LD, canonical, social URLs, and sitemap consistent. Run `python3 scripts/refresh-assets.py` whenever an asset changes, followed by `git diff --check`. No account credentials or verification tokens are included.
