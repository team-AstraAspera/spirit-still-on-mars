# Spirit: Still on Mars

Team AstraAspera's project for the 2026 NASA Space Apps Challenge,
**Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars.**

A one-page interactive site for kids (ages 8 to 12) built around our Scratch game about NASA's Spirit rover.

| Section | What it does |
|---|---|
| Hero | Spirit's own photo of the trench its broken wheel dug, with an animated starfield |
| Mission numbers | Animated counters: 3 months planned, 6+ years worked, 7.73 km, 124,000+ images |
| Story | Clickable timeline from launch (2003) to the end of the mission (2011); a rover icon drives to each moment |
| Play | Our Scratch game, embedded |
| Evidence Lab | Real NASA photos of Adirondack, Halley and Gertrude Weise with a magnifier lens and a 3-choice science question for each, plus a gallery of Spirit's science tools |
| Find Spirit | A real HiRISE orbital photo from 2009: click to find the rover, with warmer/colder hints |
| Legacy | Closing story plus a field notebook that fills in as you finish each activity |

Progress badges in the top bar light up as you complete each activity.

## Run it

No install needed. Open `index.html` in a browser. (The Scratch game and NASA photos load from the internet.)

## Put it online with GitHub Pages

1. Create a public repo on GitHub (for example `spirit-still-on-mars`).
2. Upload every file in this folder, keeping the folder structure (`index.html` at the top level).
3. In the repo go to **Settings > Pages**, set **Source** to "Deploy from a branch", pick `main` and `/ (root)`, and save.
4. After about a minute the site is live at `https://YOUR-USERNAME.github.io/spirit-still-on-mars/`. Use that as the **Link to Final Project**.

## Editing content

All text, dates, questions and image IDs live in `data.js`. Change them there; you do not need to touch `main.js`.

- `SCRATCH_PROJECT_ID` is the game that gets embedded. If the team makes a new version, put its number here.
- `FIND_SPIRIT.x` / `.y` is where Spirit is in the HiRISE photo (as a fraction of width/height).

## NASA data used

| Image | What it shows | Credit |
|---|---|---|
| PIA05223 | First rock ever ground on Mars (Adirondack), Feb 2004, Pancam | NASA/JPL/Cornell |
| PIA08567 | Bright material at Halley, Pancam false color, 2006 | NASA/JPL-Caltech/Cornell |
| PIA09491 | Silica-rich soil "Gertrude Weise", Pancam, 2007 | NASA/JPL/Cornell |
| PIA11757 | Trench dug by the broken wheel, Pancam, false color | NASA/JPL-Caltech/Cornell |
| PIA12205 | Spirit at Troy seen from orbit, HiRISE (MRO), June 2009 | NASA/JPL-Caltech/University of Arizona |
| PIA04983 | Overhead view of Spirit taken by its Navcam (used on the Navcam card) | NASA/JPL |
| PIA05111 | The Moessbauer spectrometer (used on the Moessbauer card) | NASA/JPL/University of Mainz |
| Other tool photos | Lab photos of Pancam, Mini-TES, Microscopic Imager, APXS, Rock Abrasion Tool and magnets | NASA/JPL / MER Athena science team |

Mission facts come from NASA's Spirit mission page and JPL's 2011 end-of-mission release. Science tool descriptions come from Squyres et al. (2003), "Athena Mars rover science investigation," Journal of Geophysical Research, https://doi.org/10.1029/2003JE002121. Full source links are in the Sources list at the bottom of the site.

## Notes

- Spirit's dialogue in the game is fictional. Events, places and science are real.
- Built with plain HTML, CSS and JavaScript. AI assistance (Claude, by Anthropic) was used to write the website code, find and check NASA sources, and test the Scratch game; this is disclosed in our project submission. The Scratch game was made by our team.
- Fonts: Space Grotesk and Inter (Google Fonts, SIL Open Font License).
