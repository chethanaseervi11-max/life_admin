# Life Admin

> **"Life Admin — Put it somewhere you'll remember."**

A calm, personal "don't forget it" dashboard for responsibilities, deadlines, renewals, appointments, warranties, and life administration.

---

## 🎯 The Problem

People frequently remember that they need to do something important—renew a passport, service a laptop before warranty expires, cancel a trial subscription, pay a college fee, or schedule a doctor checkup. They jot it down in a random note, calendar, or to-do app, only to forget about it until the deadline has already passed.

Most existing productivity tools are:
- Over-engineered project management tools with epics, kanban boards, and sprints.
- Complex calendars requiring 10-field event creation dialogs.
- Habit trackers gamifying daily streaks rather than protecting your future self.

## 💡 The Solution

Life Admin answers one question with zero friction:

> **"What do I need to take care of?"**

### The Core Experience:
**Think of something → type it → save it → Life Admin brings it back to your attention at the right time.**

There are no tedious multi-field forms. A single prominent input parses your natural language input, identifies dates, times, and categories automatically, and organizes your responsibilities into an intuitive urgency radar.

---

## ✨ Features

- **Natural Language Quick-Add**:
  - Type naturally: *"Submit scholarship application by October 12"*, *"Doctor appointment tomorrow at 4 PM"*, *"Laptop warranty expires March 15 2027"*, *"Cancel Netflix subscription before November 5"*.
  - Recognizes relative terms (*today*, *tomorrow*, *Friday*, *next week*, *in 30 days*), calendar dates (*March 15*, *10/12/2026*), and times (*4 PM*, *18:00*).
  - Automatically identifies categories (*Documents*, *Payments*, *Renewals*, *Warranties*, *Appointments*, *Applications*, *Subscriptions*, etc.).
- **Smart Date Clarification**:
  - If no date is identified in your text, Life Admin **never invents one**. It presents a clean, rapid-selection dialog (*Today*, *Tomorrow*, *This week*, *Pick a date*, or *No date*).
- **Automatic Urgency Grouping**:
  - ⚠️ **Overdue**: Critical items whose deadline has elapsed.
  - 🔴 **Today**: Urgent responsibilities that require attention today.
  - 🟠 **This Week**: Approaching deadlines within the next 7 days.
  - 🟡 **Coming Up**: Future deadlines on your radar.
  - ⚪ **Unscheduled**: Items to keep in mind without a hard deadline.
- **Multiple Focused Views**:
  - **Dashboard**: Urgency radar with minimal stats and live filtering.
  - **Timeline**: A chronological visual stream showing what is approaching sequentially.
  - **Upcoming**: Horizon buckets (*Next 7 Days*, *Next 30 Days*, *Next 3 Months*, *Later*) to help plan ahead before items become urgent.
  - **Completed**: History log with original due dates, completion timestamps, and instant restore.
  - **Settings**: Theme control, data backup, sample loader, and danger zone.
- **Recurring Responsibilities**:
  - Support for Daily, Weekly, Monthly, and Yearly recurrence.
  - Completing a recurring item archives the current occurrence and automatically schedules the next cycle.
- **Instant Search & Urgency Filtering**:
  - Search across item titles, categories, dates, and reference notes.
  - Quick filter pills for Overdue, Today, This Week, and Coming Up, plus Category dropdowns.
- **Undo Support**:
  - Action toasts allow instant reversal if you complete or check off an item by accident.
- **Theme & Appearance**:
  - Light mode (default) and dark mode with system theme detection.
- **Data Privacy & Portability**:
  - 100% client-side. Your data never touches a remote server.
  - Export and import all data anytime via standard JSON backups.
- **Progressive Web App (PWA)**:
  - Installable on mobile phones, tablets, and desktop.
  - Works fully offline with Service Worker caching.

---

## 📸 Screenshots

*(Screenshots can be placed in `assets/screenshots/`)*

| Main Dashboard | Timeline View |
| :---: | :---: |
| ![Dashboard View Placeholder](assets/icons/icon.svg) | ![Timeline View Placeholder](assets/icons/icon.svg) |

---

## 🛠️ Tech Stack

- **HTML5**: Semantic, accessible markup.
- **CSS3**: Custom design system with CSS custom properties, responsive grid, flexbox, and smooth micro-interactions.
- **Vanilla JavaScript (ES6+)**: Zero external framework dependencies for blazing fast load times and clean maintenance.
- **Web Storage API (`localStorage`)**: Fast, resilient client-side persistence.
- **Service Worker & Manifest**: Full PWA offline readiness.
- **Lucide Icons**: Crisp, lightweight vector iconography with embedded fallbacks.

---

## 🔒 Privacy & Local-First Architecture

**Your data stays in your browser.**

Life Admin V1 is deliberately built without a backend server or third-party tracking scripts:
- No account or registration is required.
- No personal data or deadlines are sent over the network.
- Everything is stored in your device's browser `localStorage`.
- Use the **Export Data (JSON)** feature in Settings to create backups anytime.

---

## 🚀 Local Development

To run Life Admin locally on your machine:

1. Clone or download this repository.
2. Open `index.html` directly in any modern web browser:
   ```bash
   # On Windows (PowerShell)
   Start-Process index.html

   # On macOS
   open index.html

   # On Linux
   xdg-open index.html
   ```
3. Alternatively, serve with any local HTTP server:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node (npx)
   npx serve .
   ```
4. Navigate to `http://localhost:8000`.

---

## 🌐 Deployment Instructions

Life Admin is a static web application and requires zero build steps or server runtime.

### Deploy to GitHub Pages
1. Push this folder to a GitHub repository.
2. Navigate to **Settings > Pages** in your repository.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your site will be published at `https://<username>.github.io/<repo>/`.

### Deploy to Netlify
1. Log in to [Netlify](https://www.netlify.com/).
2. Drag and drop the `life-admin/` folder into the Netlify drop zone.
3. Your app is live instantly with an SSL certificate.

### Deploy to Vercel
1. Install Vercel CLI (`npm i -g vercel`) or import via GitHub in the [Vercel Dashboard](https://vercel.com/).
2. Run `vercel` in the project root.
3. Deploy with default settings (Output Directory: `./`).

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `/` or `N` | Focus Quick-Add input |
| `Esc` | Close any modal or clear search |
| `1` | Switch to **Dashboard** |
| `2` | Switch to **Timeline** |
| `3` | Switch to **Upcoming** |
| `4` | Switch to **Completed** |
| `5` | Switch to **Settings** |

---

## 🔮 Future-Ready Architecture

The code is modularly structured to allow seamless extension in future versions:
- Web Push & Browser Notifications API
- Cloud sync (e.g. via encrypted CouchDB / Supabase / iCloud)
- Optional calendar export (.ics file generation)
- Email digest integration
- OCR extraction for warranty receipts and documents

---

## 📄 License

MIT License. Free for personal and commercial use.
