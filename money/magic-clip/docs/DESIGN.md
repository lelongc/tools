# NeoClip - Premium SaaS Product Design Document

## Product Vision & Monetization Strategy
NeoClip is a **Premium Web Browser Research Assistant & Smart Clipboard Manager**. 
It is designed from the ground up to be a **$1/month SaaS product**, targeting **2,000+ active paying subscribers** ($2,000 MRR). 

To convince users to pay $1/month, NeoClip cannot just be a "basic clipboard history". It must feel **Premium, Indispensable, and Aesthetically Stunning**. The product focuses on solving the chaos of browser research (copying text, saving images, extracting text from images, organizing links) without forcing the user to leave their current tab.

### The Freemium Model (Proposed)
- **Free Tier:** Basic clipboard history (up to 50 items), no collections, standard search.
- **Pro Tier ($1/month):** 
  - Unlimited History (up to browser storage limits).
  - Smart Collections (Unlimited folders).
  - Google Lens Integration (Reverse image search directly from clipboard).
  - Local OCR (Extract text from copied images instantly).
  - "Smart Clean" for URLs (Removes tracking tags automatically).

---

## UI / UX Aesthetic (The "Premium" Feel)
To justify a subscription, the UI must wow the user immediately.
- **Color System:** Indigo-Cyan Gradient (`linear-gradient(135deg, #6366f1, #06b6d4)`).
- **Surfaces:** Modern glassmorphism, soft drop shadows (`rgba(99,102,241,0.12)`), rounded corners (`16px`-`20px`).
- **Typography:** `Inter` font, high contrast, clean hierarchy.
- **Animations:** Fluid, Apple-like spring physics (`cubic-bezier(0.34, 1.56, 0.64, 1)`), subtle micro-animations on hover (glow effects, translating elements).
- **Themes:** First-class Dark Mode support.
- **Workflow:** Inline floating bubble & panel. **No disruptive popups**.

---

## Core Workflows & Features

### 1. The Win+V "Pure Web" Architecture
Chrome extensions cannot securely read background OS clipboards without focus. Instead of forcing users to install sketchy `.bat`/`.exe` Native Apps, NeoClip uses a **Smart UX Workflow**:
- It perfectly captures everything copied *inside* Chrome.
- **The Win+V Bridge:** For items copied outside Chrome, the UI provides a beautiful "Hint Bar". Users simply press `Win+V` while on any webpage and click the image they missed. NeoClip instantly catches the physical `paste` event and saves it. 100% secure, no external installs required.

### 2. Smart Clipboard Engine
- **Images:** Auto-compressed and resized to max 1600px to save storage.
- **Text:** Deduplicated automatically.
- **Links:** Auto-detects URLs. Strips tracking parameters (`utm_source`, `fbclid`, etc.) and tags them as 🔗 Links.

### 3. Action Hub
Every item card has powerful action buttons:
- `👁 Detail View`: Full preview of text or image.
- `📋 Copy`: Instant copy to clipboard.
- `🔍 Lens` (Images only): One-click reverse search via Google Lens.
- `📷 Aa` (Images only): Offline OCR using Tesseract.js to extract text.
- `📁 Save`: Move items into organized Collections.

### 4. Smart Collections
Users can create folders for "Design Inspiration", "Shopping", "Research Notes", etc., moving items from the raw Recent history into permanent structured collections.

---

## Technical Architecture

NeoClip is built as a **Manifest V3 Pure Web Extension**.

### Storage: IndexedDB via Dexie.js
- **100% Offline & Private:** A massive selling point for Pro users handling sensitive research.
- **Schema (v2):**
  - `history`: `++id, type, timestamp, collectionId`
  - `collections`: `++id, name, createdAt`
- **Performance:** History queries are strictly limited (`.limit(50)`) to prevent RAM bloat, automatically cleaning up old uncollected items to keep the extension lightning fast.

### File Structure
```text
magic-clip/
├── manifest.json            ← MV3 Config (Zero unnecessary permissions)
├── background/
│   ├── service_worker.js    ← Lightweight message router
│   └── db.js                ← Dexie DB logic & storage limits
├── content/
│   ├── bubble.js            ← Core UI injection, active-tab clipboard polling, paste listener
│   └── bubble.css           ← Premium CSS variables & animations
├── libs/
│   └── dexie.min.js         ← Local database
├── popup/
│   ├── index.html           ← Settings menu & Win+V instructions
│   └── app.js
└── icons/                   ← High-res branding
```

### Security & Privacy (Store Compliance)
- No `offscreen` permission (Removed to speed up Chrome Web Store review).
- No external server calls (except user-initiated Google Lens searches).
- Easy to pass automated and manual Google reviews.
