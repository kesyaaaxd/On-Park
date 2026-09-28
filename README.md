# ON PARK — Smart Parking Platform (Midterm Project)

A role-based smart parking web application built with **React 19 + Vite**,
deployed as a static single-page app on GitHub Pages.

## What the app does

On Park lets two kinds of users manage and use a parking system from a
single dashboard:

- **Administrator** — manage parking data:
  - add / edit / delete **Parking Locations** (name, address, slots, price)
  - add / edit / delete **Parking Slots** and their status
  - view **all client reservations** in a table
  - monitor **slot occupancy** per location (available / held / reserved /
    occupied / maintenance)
- **Client** — use the parking service:
  - browse available parking on the **Dashboard**
  - make a **Reservation** (location, slot, start/end time, vehicle number)
  - track their own reservations on **My Reservations**
  - complete **Payment** for confirmed reservations and get a
    **Reservation Confirmation**

All data is **hardcoded** in `src/data/mockData.js` (arrays of objects with
`id`s) and kept in React state — there is no backend; changes are
in-memory and reset on page reload. The logged-in role drives both the
sidebar menu and the dashboard content, and every inner route is protected
(unknown routes show a 404 page, and any route opened without a session
lands on the login page).

## What the app does NOT do (out of scope for the midterm)

- No real backend / database — data is mock data in memory only.
- No real authentication (accounts are hardcoded; passwords are in
  `mockData.js` and must never be reused in production).
- No real payment gateway — "Pay Now" only simulates a successful payment
  and marks the reservation as paid.
- No reservation cancellation flow yet (not part of the midterm use cases).
- "Find Parking" is still a placeholder ("Coming Soon") page.

## Demo accounts

| Role | Username | Password |
| --- | --- | --- |
| Administrator | `admin01` | `admin123` |
| Client | `client01` | `client123` |

Wrong credentials show an inline error message on the login page.

## How to run it

```bash
# 1. install dependencies
npm install

# 2a. development (http://localhost:5173)
npm run dev

# 2b. production build + local preview (http://localhost:4173)
npm run build
npm run preview

# code checks
npm run lint
```

## Tech & architecture notes

- **React 19 + Vite**, functional components with hooks only.
- **Routing:** `react-router-dom` with a **HashRouter** (`src/main.jsx`).
  Hash-based URLs (`/#/dashboard`, `/#/occupancy`, ...) keep the app fully
  static-friendly: **refreshing any page still works** because the route
  lives in the URL fragment, not on the server.
- **Vite `base: './'`** in `vite.config.js` makes asset paths relative so
  the built app works when deployed under a sub-path on GitHub Pages.
- **Auth guard:** `src/App.jsx` restores the session from `localStorage`
  (`onpark_user` key) on load; if no session exists, the app renders the
  login page regardless of the route.
- **State lifting:** all data + handlers live in `App.jsx`; child pages
  receive data and callbacks via props (one-way data flow).
- **Semantic layout:** `header` (topbar), `nav` (sidebar), `main`
  (content), `footer`; every input is associated with a `<label>` via
  `htmlFor`/`id`; layout is flexbox-based and responsive (usable from
  ~375px phone width up to desktop).

## Deploying to GitHub Pages

The app is configured for GitHub Pages (HashRouter + relative base), so
any path that 404s on the server still loads `index.html` and the hash
route works.

```bash
# 1. build
npm run build

# 2. publish the dist folder to the gh-pages branch
npx gh-pages -d dist
```

Then enable **Settings → Pages → Source: gh-pages** in the repository
(once, per repo). The site is served at
`https://<username>.github.io/<repo-name>/`.

## Folder structure

```
src/
  data/          mockData.js — single source of hardcoded data
  pages/         LoginPage.jsx
  components/    Navigation, Dashboard, ParkingLocationManager,
                 ParkingSlotManager, ReservationManager, MyReservations,
                 Payment, ReservationConfirmation, OccupancyMonitoring, Login
  App.jsx        session/auth guard + state lifting + 404 fallback
  main.jsx       HashRouter entry point
```
