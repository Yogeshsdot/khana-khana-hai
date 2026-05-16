# Khana khana hai — Design Spec

## Overview

Grocery shopping list web app for household use. Users create multiple shopping lists, add items with quantities, and check them off while shopping. No authentication — all data stored in the browser via localStorage.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Purpose | Grocery shopping list | Core use case — plan what to buy |
| Users | Household | Shared lists with family/roommates (future) |
| Platform | Web app (browser) | Works on any device, no install |
| V1 scope | Create multiple lists, add/check/delete items | Lean MVP — ship fast, add features later |
| Auth | None (localStorage) | No accounts needed for V1 |
| Stack | Vite + React (TypeScript) | Fast DX, modern tooling |
| Theme | Light with warm orange accent (#e85d04) | Clean, readable while shopping |
| Routing | React state (no library) | Two screens don't justify a router |
| Styling | Plain CSS with CSS variables | Simple, no build-time overhead |

## Data Model

```typescript
interface ShoppingList {
  id: string;           // UUID
  name: string;         // e.g. "Weekly Groceries"
  items: ShoppingItem[];
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}

interface ShoppingItem {
  id: string;           // UUID
  name: string;         // e.g. "Tomatoes"
  quantity: number;     // e.g. 2
  unit: string;         // e.g. "kg", "pcs", "packet"
  checked: boolean;     // true = crossed off
}
```

**Storage key:** `khana-khana-hai-lists` — JSON array of `ShoppingList` in localStorage.

## Architecture

Single-page app, fully client-side. No backend, no API calls.

```
Browser
├── React App (Vite)
│   ├── State managed via useShoppingLists() hook
│   └── Persistence via localStorage
└── Deployed as static files (Vercel/Netlify)
```

## Screens

### Screen 1: Home (All Lists)

- App title with emoji branding
- List of shopping list cards, each showing name, item count, and checked count
- Tapping a card navigates to List Detail
- "+ New List" button at the bottom (prompts for list name)

### Screen 2: List Detail

- Back arrow returns to Home
- List name as page title
- Add item form: text input (item name) + number input (quantity) + "Add" button
- Item rows showing: checkbox, item name, quantity with unit, delete (X) button
- Checked items get strikethrough + faded opacity, appear below unchecked items
- Progress indicator at the bottom: "X of Y items checked"

## Visual Design

- **Background:** Soft gray (#f8f9fa)
- **Cards/rows:** White with subtle border (#e8e8e8) and light shadow
- **Accent:** Warm orange (#e85d04) for buttons, checkboxes, navigation
- **Text:** Dark (#1a1a1a) primary, gray (#888) secondary
- **Delete:** Red (#dc3545)
- **Border radius:** 12px for cards, 8px for inputs/rows
- **Mobile-first** layout, responsive on desktop

## File Structure

```
src/
├── App.tsx                  # Screen switching (Home ↔ ListDetail)
├── main.tsx                 # Entry point
├── index.css                # Global styles, CSS variables
├── types.ts                 # ShoppingList, ShoppingItem interfaces
├── hooks/
│   └── useShoppingLists.ts  # All CRUD + localStorage sync
├── components/
│   ├── Home.tsx             # All lists view
│   ├── ListCard.tsx         # Single list card
│   ├── ListDetail.tsx       # Items view for one list
│   ├── ShoppingItemRow.tsx  # Single item row
│   └── AddItemForm.tsx      # Add item input row
└── utils/
    └── storage.ts           # localStorage helpers
```

## Hook: useShoppingLists

Single custom hook managing all state:

- `lists` — array of all ShoppingList objects
- `addList(name)` — create a new empty list
- `deleteList(listId)` — remove a list
- `addItem(listId, name, quantity, unit)` — add item to a list (unit defaults to "pcs")
- `toggleItem(listId, itemId)` — toggle checked state
- `deleteItem(listId, itemId)` — remove item from a list

On every mutation, the full lists array is serialized to localStorage.

## Error Handling

- Empty list name: prevent creation, show inline validation
- Empty item name: prevent addition, show inline validation
- localStorage full: catch quota errors, show a toast/alert
- Corrupted localStorage: fall back to empty state, don't crash

## Future Considerations (Not in V1)

- Household sharing (requires backend + auth)
- Categories for items (produce, dairy, etc.)
- Purchase history and smart suggestions
- Budget tracking
- PWA for offline + install
- Dark theme toggle
