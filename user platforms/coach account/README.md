# Coach account (working copy)

The coach account prototype from `../cursor archive/coach account/`, made to run on its own. Open `dashboard.html` by double-click; every page links to the others through the sidebar.

Made with `python "user platforms/restore-account.py" "coach account"` (run from the repo root). The archive itself is unchanged.

## What was changed

- **Images.** The archived pages pointed at `005_PLATFORM ICONS/` and `006_RASTER/`, which were not uploaded. Each image now comes from its counterpart in the design system's asset library (`design-system/assets`), copied into `assets/` with a plain name: the sidebar logo, search, dropdown, close and file icons, the notification icons, and the report covers.
- **Two stand-ins.** `assets/illustrations/gift.svg` and `basket.svg` replace `blue gift.png` and `white basket.png` (Credits and Premium pages), which are not in the design system either. They are simple drawings, to swap for the real ones.
- **Styles are untouched.** The archive's `app.css` uses the same tokens as the current design system (colours, type, spacing, radius, shadows); the design system was compiled from this file.

## Still missing

- `shared/admin-credits.js` and `shared/promotions.js` (in the original folder they sat next to the account folders, as `../shared/`). Without them the **Credits** page shows no prices or basket totals and the **Promotions** page shows no offers. Put the two files in `shared/` here (or in `../cursor archive/shared/` and re-run the script) and both pages work.
- The **Log out** item in the profile menu points at a design-system showcase page outside the account; it leads nowhere here.
- At phone width the two assignment pages scroll sideways, as they do in the archive.
