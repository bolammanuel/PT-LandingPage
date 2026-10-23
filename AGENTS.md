# Repository Guidelines

## Project Structure & Module Organization

This repository contains the Precious Tega course landing page. `dist/` is the editable website and deployment source; there is no separate build output or framework.

- `dist/index.html`: page sections, navigation, FAQs, and dialogs.
- `dist/style.css`: branding, layout, responsive styles, and gallery presentation.
- `dist/script.js`: galleries, filters, dialogs, checkout links, and countdown behavior.
- `dist/gallery-data.js`: evidence entries and six client feedback slots.
- `dist/course-config.js`: Selar URL, pricing, currency, and offer deadline.
- `dist/assets/`: create this directory for approved client images.
- `.cpanel.yml`: deployment tasks; keep this beside `README.md`.

## Build, Test, and Development Commands

No dependency installation or build step is required. Open `dist/index.html` directly, or run `python3 -m http.server 8000 --directory dist` and visit `http://localhost:8000`.

Run JavaScript syntax checks before submitting changes:

```bash
node --check dist/script.js
node --check dist/gallery-data.js
node --check dist/course-config.js
git diff --check
```

## Coding Style & Naming Conventions

Use vanilla HTML, CSS, and JavaScript. Match surrounding formatting: JavaScript uses two-space indentation, single quotes, semicolons, and camelCase identifiers. Existing HTML and CSS are compact; avoid unrelated reformatting. Use kebab-case CSS classes, element IDs, and asset names, such as `client-feedback-01.jpg`. No formatter or linter is configured.

Keep gallery entries uniquely identified, with descriptive titles and meaningful image alt text. Preserve accessible button labels, keyboard navigation, and visible focus indicators.

## Testing Guidelines

There is no automated test framework or coverage threshold. Verify desktop and mobile layouts manually. Check gallery filters, all six feedback slots, full-size images, previous/next navigation, arrow keys, Escape dismissal, and focus restoration. Confirm unconfigured checkout shows the registration dialog; when changing offers, check valid checkout links and expired deadlines. Include relevant validation results in the pull request.

## Commit & Pull Request Guidelines

History uses imperative, descriptive subjects such as `Add cPanel deployment configuration`. Keep commits focused. Pull requests should explain the change and validation performed, link relevant issues when available, and include desktop/mobile screenshots for visual changes.

## Content & Deployment Configuration

Use approved client-owned evidence; never present reference screenshots as testimonials. Keep credentials out of public files. Confirm pricing and deadlines with the client and match them on Selar. cPanel copies `dist/` contents into the configured site directory; repository documentation stays outside the published page.
