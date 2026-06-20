# Magic Clip - Complete Feature Design Document

## Product Vision
A clean, minimal clipboard manager extension for Chrome/Edge. No gimmicks, no bloat. It does one thing extremely well: manage everything you copy, with image OCR as a bonus.

---

## UI Layout (Floating Panel)

When user clicks the floating bubble, a panel opens with this structure:

```
┌─────────────────────────────────┐
│  Magic Clip              [X]   │  ← Header with close button
├─────────────────────────────────┤
│  [ Search... 🔍 ]              │  ← Search bar
├─────────────────────────────────┤
│  [Recent]  [Collections]       │  ← Two tabs
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │ Some copied text here...  │  │  ← Clipboard item card
│  │ 2 min ago                 │  │
│  │ [👁 View] [📋 Copy] [📷] │  │  ← Action buttons
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [Image Thumbnail]         │  │  ← Image item
│  │ 5 min ago                 │  │
│  │ [👁 View] [📋 Copy] [Aa] │  │  ← [Aa] = Extract text (OCR)
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ https://shopee.vn/item... │  │  ← Link (auto-detected)
│  │ 8 min ago    🔗 Link      │  │
│  │ [👁 View] [📋 Copy]      │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### "Collections" Tab
```
┌─────────────────────────────────┐
│  [Recent]  [Collections]       │
├─────────────────────────────────┤
│  [+ New Collection]            │  ← Button to create
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📁 Work Notes        [⋮] │  │  ← Collection with menu
│  │    3 items                │  │     Menu: Rename, Delete
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📁 Shopping Links    [⋮] │  │
│  │    7 items                │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### Inside a Collection
```
┌─────────────────────────────────┐
│  ← Back     Work Notes   [⋮]  │  ← Back button + collection name
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │ Meeting notes text...     │  │
│  │ [👁 View] [📋 Copy] [🗑] │  │  ← Delete button visible here
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Preview Modal (Full Content View)
When user clicks [👁 View]:
```
┌─────────────────────────────────┐
│  Preview               [X]    │
├─────────────────────────────────┤
│                                 │
│  Full text content displayed    │
│  here without truncation.       │
│  All lines visible.             │
│  Images shown at full size.     │
│                                 │
├─────────────────────────────────┤
│  [📋 Copy]  [Save to Collection]│
└─────────────────────────────────┘
```

---

## Feature Specifications

### 1. Clipboard Capture
- **Text**: Captured on every `Ctrl+C` / right-click Copy inside the browser.
- **Images**: Captured via `navigator.clipboard.read()` when panel opens. This catches:
  - Right-click → Copy Image on any webpage
  - Screenshots from Snipping Tool / Print Screen
  - Images copied from other apps (Word, Paint, etc.)
- **Links**: Auto-detected from text content. Tagged as "Link" type.
- **Deduplication**: If the same content is copied twice in a row, skip the duplicate.

### 2. Item Cards
Each clipboard item is displayed as a card with:
- **Content preview**: Truncated to 3 lines for text, thumbnail for images.
- **Timestamp**: Relative time (e.g., "2 min ago", "Yesterday").
- **Type badge**: Shows 🔗 for links, 📷 for images, 📝 for text.
- **Action buttons** (always visible, small icons at bottom of card):
  - `👁 View` — Opens preview modal with full content
  - `📋 Copy` — Copies to OS clipboard, shows "Copied!" feedback, auto-closes panel
  - `📷 Aa` (images only) — Runs OCR to extract text
  - `🗑 Delete` (only inside Collections) — Removes item from collection
  - `📁 Save` (only in Recent tab) — Opens dropdown to pick a collection

### 3. Collections (renamed from "Folders")
- User can create, rename, and delete collections.
- Each collection has a name (editable) and a list of saved items.
- Creating: Click [+ New Collection], type a name, press Enter.
- Renaming: Click the [⋮] menu on a collection → Rename.
- Deleting: Click the [⋮] menu → Delete (with confirmation).
- Items can be saved to a collection from the "Recent" tab via the [📁 Save] button.
- Items inside a collection have a [🗑 Delete] button to remove them.

### 4. OCR (Image to Text)
- Only shown on image items as an [Aa] button.
- Uses Tesseract.js loaded locally (eng + vie language packs).
- Runs in a Web Worker to avoid freezing the page.
- Progress shown on the button itself: "Scanning 45%..."
- Result: Extracted text is saved as a NEW text item in Recent, AND copied to clipboard.
- Error handling: If no text found, show message "No text detected in this image."

### 5. Smart Paste (Auto Clean Links)
- When copying a URL, automatically strip tracking parameters:
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
  - `fbclid`, `gclid`, `ref`, `affiliate`
- Show a small "🧹 Cleaned" badge when a link has been cleaned.

### 6. Search
- Simple text search across all Recent items.
- Filters items in real-time as user types.

---

## Technical Architecture

### Storage: IndexedDB via Dexie.js
```
Database: MagicClipDB

Tables:
  history:
    id (auto-increment)
    type: "text" | "image" | "link"
    content: string (text/URL) or base64 (image)
    timestamp: number
    collectionId: number | null

  collections:
    id (auto-increment)
    name: string
    createdAt: number
```

### File Structure
```
magic-clip/
├── manifest.json
├── background/
│   ├── service_worker.js    ← Message handler + DB operations
│   └── db.js                ← Dexie database setup
├── content/
│   ├── bubble.js            ← Injects bubble + panel (Shadow DOM)
│   └── bubble.css           ← All panel styling
├── libs/
│   ├── dexie.min.js
│   ├── tesseract.min.js
│   ├── worker.min.js
│   ├── tesseract-core.wasm.js
│   ├── eng.traineddata.gz
│   └── vie.traineddata.gz
└── popup/
    ├── index.html           ← Settings page (popup)
    └── app.js
```

### Message Protocol (content ↔ background)
| Action | Direction | Data |
|---|---|---|
| `saveItem` | content → bg | `{type, content, collectionId?}` |
| `getRecent` | content → bg | `{limit, search?}` |
| `getCollections` | content → bg | — |
| `getCollectionItems` | content → bg | `{collectionId}` |
| `createCollection` | content → bg | `{name}` |
| `renameCollection` | content → bg | `{id, name}` |
| `deleteCollection` | content → bg | `{id}` |
| `moveToCollection` | content → bg | `{itemId, collectionId}` |
| `deleteItem` | content → bg | `{itemId}` |

---

## Design Guidelines
- **No emoji overload.** Use simple SVG icons or minimal Unicode symbols.
- **Neutral colors.** White/light gray cards, subtle borders. No bright gradients.
- **Readable fonts.** System font stack (-apple-system, Segoe UI, etc.)
- **Small footprint.** Panel width: 340px. Max height: 460px.
- **Smooth but subtle animations.** Fade in/out, no bouncing or sliding.
- **Dark text on light background.** High contrast for readability.
