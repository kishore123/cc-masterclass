# Slide deck

`cc-masterclass-deck.pptx` — the ~21-slide companion deck for the workshop. Light theme,
slide-light/anchor style: 5 hero diagrams carry the mental model, the rest are signposts
between live demos. Present from this; the real teaching happens in the terminal.

## Contents

| # | Slide | Type |
|---|---|---|
| 1 | Title | section |
| 2 | What you'll leave with | outcomes |
| 3 | The agent loop | **hero diagram** |
| 4 | Capability ladder rises with autonomy | **hero diagram** |
| 5 | Three levels of autonomy (L2/L3/L4) | **hero diagram** |
| 6 | firmware-lab — the sensor gateway | lab intro + module map |
| 7 | Two repos: work vs. learning | **hero diagram** |
| 8–16 | Requirements → Orchestration | anchor (one per SDLC stage) |
| 17 | SDLC × autonomy ceiling | matrix table |
| 18 | Your team's autonomy rubric | fill-in-live table |
| 19 | Roll out: managed-local | install commands |
| 20 | Where everything lives | resources |
| 21 | Go ship | closing |

## Regenerating / editing

The deck is generated from `gen.js` (PptxGenJS) — diagrams are native PowerPoint shapes, so
the `.pptx` is fully editable in PowerPoint. To rebuild after editing `gen.js`:

```bash
npm install pptxgenjs
node gen.js          # writes cc-masterclass-deck.pptx
```

Note: code/monospace text uses **Consolas** (a standard Windows/PowerPoint font). It renders
correctly in PowerPoint; LibreOffice without Consolas substitutes a font that adds odd
intra-word gaps — cosmetic, render-only.
