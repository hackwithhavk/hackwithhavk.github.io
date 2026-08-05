# HAVK website

Hi! The first HAVK site is a dependency-free static site made for GitHub Pages. It uses the curated assets from the shared `havk assets` folder and keeps repeatable content in [data/content.json](data/content.json).

## Run it locally

From this folder:

```bash
python3 serve.py
```

Then open [http://localhost:800](http://localhost:800) in a browser. This server disables browser caching while the design is changing and lets the JSON content file load.

## Updating content

Edit `data/content.json` to update:

- the intro copy and Discord link;
- quick stats and program descriptions;
- event posters and captions;
- officers, roles, bios, and campus group tags;
- gallery photos and alt text.

Images used by the page live in `assets/images/` and `assets/posters/`. Keep new assets web-friendly (JPG, PNG, or WebP) and reasonably sized for GitHub Pages.

## Publishing on GitHub Pages

Push the repository to GitHub, then choose **Settings → Pages → Deploy from a branch**, select `main` and the repository root, and save. The site has no build command and includes `.nojekyll` for predictable static hosting.

## Content still worth adding

The visual and structure are ready for the full officer roster, campus affiliations, official social links, sponsor contact, and the `web.pdf` partner brief mentioned in the planning notes. Add those details to `data/content.json` once they are confirmed.
