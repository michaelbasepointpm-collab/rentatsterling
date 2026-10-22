# Sterling · Basepoint leasing proposal + website concept

Two separate sites in one folder, ready for GitHub Pages:

| Site | Address once live | Look |
|---|---|---|
| **Leasing proposal** (for Pennyfarthing Homes) | `…/sterling-proposal/` | Basepoint brand: forest green, Garamond + Montserrat |
| **Sterling website concept** (the site we'd launch) | `…/sterling-proposal/sterling/` | Sterling brand: navy, Cormorant + Poppins |

Both have the **"Talk to Michael"** widget with your photo. It has a green "Online now" dot, a typing animation, quick Call / Text / Email / Book-a-call buttons and a message box. Every Sterling page also has a floating **"Back to the proposal"** button at the bottom left.

Plain HTML, CSS and JavaScript. No build step, about 12 MB. Every page has `noindex`, so Google won't list it, and every Sterling page carries a bar saying it's a Basepoint concept, not the official site.

## 1. Put it online (GitHub Pages, free, about 5 minutes)

1. Sign in at https://github.com.
2. Click **+ → New repository**, name it `sterling-proposal`, choose **Public** and click **Create repository**.
3. Click **uploading an existing file**. Select **everything inside this `github` folder** (`index.html`, `README.md`, the `assets` folder and the `sterling` folder) and drag it in. Wait until every file is listed, then click **Commit changes**.
   *If the browser won't take folders, upload in two rounds: first `index.html` + `assets`, then `sterling`.*
4. Go to **Settings → Pages**, set **Deploy from a branch → main → / (root)**, and click **Save**.
5. After 1–2 minutes:
   - Proposal: `https://YOUR-USERNAME.github.io/sterling-proposal/`
   - Sterling website: `https://YOUR-USERNAME.github.io/sterling-proposal/sterling/`

## 2. Your contact details (one place for both sites)

Open `assets/js/talk.js`. The top block is all you edit:

```js
name: 'Michael',
phone: '+16043794504',          // Call and Text buttons
phoneLabel: '(604) 379-4504',
email: 'michael@basepointpm.com',
calendly: '',                    // paste your Calendly link to make "Book a call" open it
formEndpoint: '',                // see step 3
alwaysOnline: true,              // false = green dot only Mon–Sat 9 am–6 pm (the hours line)
hours: { days: [1,2,3,4,5,6], start: 9, end: 18, tz: 'America/Vancouver' },
```

Phone and email on every page, the widget, and the "Book a call" buttons all read from here.

## 3. Make forms arrive without opening an email app (optional, free)

Right now the widget and the **Book a tour** form open the visitor's email app with everything filled in, addressed to the email above. That works with no setup.

To receive submissions directly instead:
1. Create a free form at https://formspree.io (it gives you a link like `https://formspree.io/f/abcdwxyz`).
2. Paste it into `formEndpoint: ''` in `assets/js/talk.js`.
3. Upload `talk.js` again. Tour requests and chat messages now arrive in your inbox, and visitors see "Got it" right away.

## 4. Update availability and rents

Open `sterling/js/data.js`. Each floor plan has `from` (starting rent) and `units` (homes available now). Example:

```js
{ code: 'B1', ... from: 4200, units: [{ no: '213', sqft: 898, rent: 4200 }, { no: '208', sqft: 898, rent: 4200 }] },
```

Remove a home when it's leased and add one when it opens. Prices, "x available" counts and the home picker on every page update automatically.

## What's in the Sterling website concept

| Page | What works |
|---|---|
| `index.html` Home | Photo hero, offer badge, Studio / 1 Bed / 2 Bed picker with live "from" prices and counts, rooftop, neighbourhood, an offer calculator (net-effective rent), gallery preview |
| `homes.html` Homes | All 24 plans. Filter by type, "available now" or "has a den", and sort by price or size. Each plan opens its drawing, the available homes, net-effective rent, and Tour / Apply buttons |
| `amenities.html` | Building amenities, finishes and appliances, pet policy (with a family + baby + dog photo), feature-sheet PDF |
| `neighbourhood.html` | Travel times, Walk Score 91, an interactive map with numbered pins for transit, parks and shops (filter chips; click a list item to fly to its pin), and a photo mosaic |
| `gallery.html` | 55 photos with room filters and a full-screen viewer (arrow keys and swipe) |
| `book-a-tour.html` | Pick a type, plan, home, day, time, and in person or video. Fills in automatically from "Book a tour" buttons and validates required fields |
| `thank-you.html` | Confirms the request and shows a summary |

**Apply** and **Resident login** go to Sterling's existing RentCafe portals.

**No API keys anywhere.** The neighbourhood map uses Leaflet (a free open-source map library) with Esri's free street-map tiles, credited in the map corner. If those ever fail to load, it switches by itself to Esri's light-gray map, then to Humanitarian OpenStreetMap tiles. (OpenStreetMap's own tile servers are not used: they block pages opened from a computer or with privacy settings that hide the referring site.) To move or add a pin, edit `places` in `sterling/js/data.js` (name, note, latitude, longitude).

**AI image:** the family-with-baby-and-dog photo on the Amenities page was generated with ChatGPT and is illustrative. The original is in `Sterling Website Assets/07 Generated images (AI)/`.

## What's in the proposal

Hero with your contact card → snapshot → 6 findings with screenshots → Today vs With Basepoint → **the website we'd launch** (links into the concept) → services → **Team** (your portrait, bio and facts, then Basepoint's 7 rental communities as your experience, and the Basepoint team) → 3 ways to work together + first 30 days → contact.

## Listings checked (21 Oct 2026)

- Zumper building: https://www.zumper.com/address/4118-cambie-st-vancouver-bc-v5y-none-can
- Zumper studio: https://www.zumper.com/address/4118-cambie-st-vancouver-bc-v5y-none-can?listing_id=l-24598152p
- Craigslist 1 bed $2,371: https://www.craigslist.org/view/d/vancouver-bed-at-sterling-king-edward/pGoWGv7cXQNsndGC8h8erV
- Craigslist 1 bed $2,414: https://www.craigslist.org/view/d/vancouver-bed-at-sterling-king-edward/h6oP8rK2u7bEU2Jh7dYRwE
- Craigslist 2 bed $3,557: https://www.craigslist.org/view/d/vancouver-spacious-bed-at-sterling-king/jKJNKBsfzdMMZpmiGjpn3e
- Craigslist 2 bed $3,514: https://www.craigslist.org/view/d/vancouver-spacious-bed-at-sterling-king/s2MKc2haCFvGn4UPY8LviC

Listings change often. Re-check them right before you send the link.

## Folder layout

```
index.html                  proposal
assets/css/style.css        proposal styles (Basepoint brand)
assets/css/talk.css         Talk-to-Michael widget (shared)
assets/js/talk.js           widget + form sending + YOUR CONTACT DETAILS (shared)
assets/js/main.js           proposal screenshot viewer
assets/img/                 evidence screenshots, concept previews, team photos, logos, projects
sterling/*.html             the Sterling website concept (7 pages)
sterling/css/site.css       Sterling styles (Sterling brand)
sterling/js/data.js         floor plans, available homes, gallery list
sterling/js/site.js         finder, gallery, tour form, offer calculator
sterling/img/               gallery (55 + thumbnails), 17 plan drawings, area photos, logos
sterling/docs/              feature sheet PDF
```

Sterling's photos, logo and floor plans belong to their owners and are used only to illustrate the proposal to the building's developer.
