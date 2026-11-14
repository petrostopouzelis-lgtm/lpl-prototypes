# TEIQue 360 report data format (v1, draft)

One JSON file per report. `sample-360.json` is a made-up example. Nothing here is agreed with the dashboard team yet.

## Shape

```json
{
  "schema": "teique-360/1",
  "report":   { "form": "TEIQue-360", "language": "en", "norm": "UK", "date": "2026-10-14", "id": "SAMPLE-0001", "sample": true, "valid": true },
  "subject":  { "name": "Alex Morgan", "role": "Sales Manager", "time_in_role_years": 3 },
  "settings": { "minGroupSize": 1, "alwaysShowGroups": [], "textFollows": "self", "watermark": false },
  "self":     { "global": 53, "wellbeing": 52, "happiness": 53, "...": 0 },
  "self_raw": { "wellbeing": 5, "happiness": 5, "...": 0 },
  "others":   { "responded": 9, "invited": 9, "scores": { "global": 52, "...": 0 } },
  "groups": [
    { "id": "boss", "label": "Boss", "invited": 1, "responded": 1, "scores": { "global": 35, "...": 0 },
      "raters": [ { "name": "Jordan Ellis", "known_years": 2, "contact": "very regular" } ] }
  ]
}
```

## Rules

- **Scores are percentiles, 1 to 99**, already worked out by the scoring system. The report never averages or converts scores. Averaging percentiles is not statistically sound, so every aggregate (others' average, each group's score, factor and Global scores) must arrive in the file.
- **Score keys are fixed ids**, never display names:
  - `global`
  - Factors: `wellbeing`, `self_control`, `emotionality`, `sociability`
  - Facets: `happiness`, `optimism`, `self_esteem`, `emotion_regulation`, `impulse_control`, `stress_management`, `empathy`, `emotion_perception`, `emotion_expression`, `relationships`, `emotion_management`, `assertiveness`, `social_awareness`, `adaptability`, `self_motivation`
  - Display names live in `src/model.js` (and later the text library), because the 2010 and 2025 reports name some facets differently.
- `self`, `others.scores` and every `groups[].scores` carry all 20 keys.
- **Groups** are free-form: any `id` and `label`, in the order they should appear. Old-report equivalents: boss, other superiors, direct reports, peers.
- **Anonymity** (`settings`): a group with fewer than `minGroupSize` responses is not shown on its own, unless its id is in `alwaysShowGroups`. Its raters still count in `others`. Both values are placeholders until LPL decides the rule.
- `report.sample: true` plus `settings.watermark` control the sample watermark.
- **Optional fields, all taken from the 2010 report's pages.** `subject.role` and `subject.time_in_role_years` (Rater Groups page). `groups[].raters` with `name`, `known_years`, `contact` (Rater Groups page; leave it out and only the group counts print). `self_raw` (the Raw Score column on Coach Data). `report.valid: true` (prints "This report is Valid and Interpretable.").
- `settings.textFollows`: `"self"` (default) or `"others"`: which score's band picks the interpretation text and the development suggestions.
- The sample's self scores, averages and raw scores are the ones printed in the 2010 sample report, so each score lands in a band that report has wording for. Group scores and names are made up.

## Not decided

1. Does the export hold each rater's scores or only group scores? The format only needs group scores. A `raters` array can be added if individual scores are ever shown.
2. The anonymity threshold, and whether small groups are hidden or merged into one "Other raters" group.
3. Whether the Manager group is exempt (the 2010 report plots a single boss).
4. Whether rater names should appear (the 2010 report lists them, so the sample does too; `groups[].raters` is optional).
5. Support for the short form (TEIQue-360-S): same shape with factors and Global only, facets omitted.
