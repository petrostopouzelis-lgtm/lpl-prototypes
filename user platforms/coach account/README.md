# Coach account (working copy)

The coach account prototype from `../cursor archive/coach account/`, made to run on its own. Open `dashboard.html` by double-click; every page links to the others through the sidebar.

Made with `python "user platforms/restore-account.py" "coach account"` (run from the repo root). The archive itself is unchanged. The script will not overwrite this folder now that it holds new work (`--force` starts it over).

## TEIQue 360°

James Okoro (the candidate with a full profile page) has a completed TEIQue 360° assignment:

- **Candidate page → TEIQue 360° row → `assignment-360.html`**: the assignment, built like the other individual assignments, with the raters listed by group. "Read" opens the results; "Download" saves the PDF.
- **`report-360.html`**: the results inside the app, from the same report code and wording as the PDF: tabs for Results, Factors and facets, Development, About the report and Coach data, and switches to leave rater groups out of the charts. Reached from the assignment page and from **Reports → Read** (its back link follows where you came from).
- **Assignments** and **Reports** list the new assignment and report.
- **Add Assignment wizard**: TEIQue → "360° report" (next to Individual and Group). It picks the TEIQue 360° Report, uses the full form, and adds a **Raters** step: rater groups (Boss, Other superiors, Direct reports, Peers, plus any you add) with each rater's name and email, and the smallest group shown on its own. A 360° is for one candidate at a time. The review lists the raters. `assignments.html?new=1&instrument=teique&scope=360` opens the wizard at the 360°.
- **No prices** for the 360°: the credit prices live in the missing `shared/admin-credits.js`, and the 360° price is not known yet.

`teique360/` (report code, wording, James's data), `assets/reports/teique360-james-okoro.pdf` and `assets/report-covers/teique-360.png` are made by `node teique-360/tools/sync-coach-account.js`; run it after changing the report. `teique360/results.css` and `teique360/coach360.js` are this account's own files.

## What was changed

- **Images.** The archived pages pointed at `005_PLATFORM ICONS/` and `006_RASTER/`, which were not uploaded. Each image now comes from its counterpart in the design system's asset library (`design-system/assets`), copied into `assets/` with a plain name: the sidebar logo, search, dropdown, close and file icons, the notification icons, and the report covers.
- **Two stand-ins.** `assets/illustrations/gift.svg` and `basket.svg` replace `blue gift.png` and `white basket.png` (Credits and Premium pages), which are not in the design system either. They are simple drawings, to swap for the real ones.
- **Styles are untouched.** The archive's `app.css` uses the same tokens as the current design system (colours, type, spacing, radius, shadows); the design system was compiled from this file.

## Still missing

- `shared/admin-credits.js` and `shared/promotions.js` (in the original folder they sat next to the account folders, as `../shared/`). Without them the **Credits** page shows no prices or basket totals and the **Promotions** page shows no offers. Put the two files in `shared/` here and both pages work (copy them in by hand: re-running the restore script would replace this folder).
- The **Log out** item in the profile menu points at a design-system showcase page outside the account; it leads nowhere here.
- Fixed: at phone width the assignment pages scrolled sideways (also in the archive); one line in `app.css` (`.detail-grid > * { min-width: 0 }`).
