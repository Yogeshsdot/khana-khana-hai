# Khana khana hai Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a client-side grocery shopping list web app where users can create multiple lists and manage items within them.

**Architecture:** Single-page React app with all state managed by a custom hook (`useShoppingLists`). Data persists in localStorage under the key `khana-khana-hai-lists`. Two screens — Home (all lists) and ListDetail (items in one list) — toggled via React state, no router.

**Tech Stack:** Vite, React 18, TypeScript, plain CSS with CSS variables.

---

## File Structure

```
├── index.html               # Vite entry HTML
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
├── src/
│   ├── main.tsx             # ReactDOM.createRoot, renders <App />
│   ├── App.tsx              # Screen switching (Home ↔ ListDetail)
│   ├── index.css            # Global styles, CSS variables, all component styles
│   ├── types.ts             # ShoppingList, ShoppingItem interfaces
│   ├── utils/
│   │   └── storage.ts       # localStorage read/write/clear helpers
│   ├── hooks/
│   │   └── useShoppingLists.ts  # CRUD operations + localStorage sync
│   └── components/
│       ├── Home.tsx             # All lists view + "New List" button
│       ├── ListCard.tsx         # Single list card (name, count, progress)
│       ├── ListDetail.tsx       # Items view for one list
│       ├── ShoppingItemRow.tsx  # Single item row (checkbox, name, qty, delete)
│       └── AddItemForm.tsx      # Input row to add new items
```

---

### Task 1: Scaffold the Vite + React project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

- [ ] **Step 1: Create the project using Vite**

Run:
```bash
npm create vite@latest . -- --template react-ts
```

If prompted about existing files, allow overwrite. This generates the scaffold.

- [ ] **Step 2: Clean up generated files**

Delete all files in `src/` except `main.tsx` and `vite-env.d.ts`. Delete `src/assets/` if created. Then replace `src/main.tsx` with:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return <div className="app">Khana khana hai</div>
}
```

Create `src/index.css`:

```css
:root {
  --bg: #f8f9fa;
  --surface: #ffffff;
  --border: #e8e8e8;
  --accent: #e85d04;
  --accent-shadow: rgba(232, 93, 4, 0.3);
  --text-primary: #1a1a1a;
  --text-secondary: #888888;
  --danger: #dc3545;
  --radius-lg: 12px;
  --radius-md: 8px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}

.app {
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
  min-height: 100dvh;
}
```

Replace `index.html` title with:

```html
<title>Khana khana hai</title>
```

- [ ] **Step 3: Install dependencies and verify**

Run:
```bash
npm install
npm run dev
```

Expected: Dev server starts, browser shows "Khana khana hai" text on a light gray background.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React project with base styles"
```

---

### Task 2: Types and localStorage utilities

**Files:**
- Create: `src/types.ts`
- Create: `src/utils/storage.ts`

- [ ] **Step 1: Create type definitions**

Create `src/types.ts`:

```typescript
export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: string
  checked: boolean
}

export interface ShoppingList {
  id: string
  name: string
  items: ShoppingItem[]
  createdAt: string
  updatedAt: string
}
```

- [ ] **Step 2: Create localStorage utilities**

Create `src/utils/storage.ts`:

```typescript
import type { ShoppingList } from '../types'

const STORAGE_KEY = 'khana-khana-hai-lists'

export function loadLists(): ShoppingList[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function saveLists(lists: ShoppingList[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
    alert('Storage is full. Please delete some lists to continue.')
  }
}
```

- [ ] **Step 3: Verify the app still runs**

Run:
```bash
npm run dev
```

Expected: No errors. App still shows placeholder text.

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/utils/storage.ts
git commit -m "feat: add types and localStorage utilities"
```

---

### Task 3: useShoppingLists hook

**Files:**
- Create: `src/hooks/useShoppingLists.ts`

- [ ] **Step 1: Create the custom hook**

Create `src/hooks/useShoppingLists.ts`:

```typescript
import { useState, useCallback } from 'react'
import type { ShoppingList } from '../types'
import { loadLists, saveLists } from '../utils/storage'

function generateId(): string {
  return crypto.randomUUID()
}

export function useShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>(() => loadLists())

  const persist = useCallback((updated: ShoppingList[]) => {
    setLists(updated)
    saveLists(updated)
  }, [])

  const addList = useCallback((name: string) => {
    const now = new Date().toISOString()
    const newList: ShoppingList = {
      id: generateId(),
      name,
      items: [],
      createdAt: now,
      updatedAt: now,
    }
    persist([...lists, newList])
  }, [lists, persist])

  const deleteList = useCallback((listId: string) => {
    persist(lists.filter(l => l.id !== listId))
  }, [lists, persist])

  const addItem = useCallback((
    listId: string,
    name: string,
    quantity: number,
    unit: string = 'pcs',
  ) => {
    persist(lists.map(l => {
      if (l.id !== listId) return l
      return {
        ...l,
        updatedAt: new Date().toISOString(),
        items: [...l.items, {
          id: generateId(),
          name,
          quantity,
          unit,
          checked: false,
        }],
      }
    }))
  }, [lists, persist])

  const toggleItem = useCallback((listId: string, itemId: string) => {
    persist(lists.map(l => {
      if (l.id !== listId) return l
      return {
        ...l,
        updatedAt: new Date().toISOString(),
        items: l.items.map(i =>
          i.id === itemId ? { ...i, checked: !i.checked } : i
        ),
      }
    }))
  }, [lists, persist])

  const deleteItem = useCallback((listId: string, itemId: string) => {
    persist(lists.map(l => {
      if (l.id !== listId) return l
      return {
        ...l,
        updatedAt: new Date().toISOString(),
        items: l.items.filter(i => i.id !== itemId),
      }
    }))
  }, [lists, persist])

  return { lists, addList, deleteList, addItem, toggleItem, deleteItem }
}
```

- [ ] **Step 2: Verify the app still compiles**

Run:
```bash
npm run dev
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useShoppingLists.ts
git commit -m "feat: add useShoppingLists hook with CRUD operations"
```

---

### Task 4: ListCard component

**Files:**
- Create: `src/components/ListCard.tsx`
- Modify: `src/index.css` (append styles)

- [ ] **Step 1: Create the ListCard component**

Create `src/components/ListCard.tsx`:

```tsx
import type { ShoppingList } from '../types'

interface ListCardProps {
  list: ShoppingList
  onClick: () => void
}

export default function ListCard({ list, onClick }: ListCardProps) {
  const total = list.items.length
  const checked = list.items.filter(i => i.checked).length
  const allDone = total > 0 && checked === total

  return (
    <button className="list-card" onClick={onClick}>
      <div className="list-card-info">
        <span className="list-card-name">{list.name}</span>
        <span className="list-card-meta">
          {total} item{total !== 1 ? 's' : ''}
          {total > 0 && ` · ${checked} checked`}
          {allDone && ' ✅'}
        </span>
      </div>
      <span className="list-card-arrow">→</span>
    </button>
  )
}
```

- [ ] **Step 2: Add ListCard styles to index.css**

Append to `src/index.css`:

```css
/* ListCard */
.list-card {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px;
  margin-bottom: 12px;
  cursor: pointer;
  font: inherit;
  text-align: left;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.15s;
}

.list-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.list-card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-card-name {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
}

.list-card-meta {
  font-size: 13px;
  color: var(--text-secondary);
}

.list-card-arrow {
  font-size: 20px;
  color: var(--accent);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ListCard.tsx src/index.css
git commit -m "feat: add ListCard component"
```

---

### Task 5: Home component

**Files:**
- Create: `src/components/Home.tsx`
- Modify: `src/index.css` (append styles)

- [ ] **Step 1: Create the Home component**

Create `src/components/Home.tsx`:

```tsx
import type { ShoppingList } from '../types'
import ListCard from './ListCard'
import { useState } from 'react'

interface HomeProps {
  lists: ShoppingList[]
  onAddList: (name: string) => void
  onSelectList: (listId: string) => void
}

export default function Home({ lists, onAddList, onSelectList }: HomeProps) {
  const [newName, setNewName] = useState('')
  const [showInput, setShowInput] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed) return
    onAddList(trimmed)
    setNewName('')
    setShowInput(false)
  }

  return (
    <div>
      <h1 className="app-title">🍽️ Khana khana hai</h1>

      {lists.length === 0 && (
        <p className="empty-state">No lists yet. Create one to get started!</p>
      )}

      {lists.map(list => (
        <ListCard
          key={list.id}
          list={list}
          onClick={() => onSelectList(list.id)}
        />
      ))}

      {showInput ? (
        <form className="new-list-form" onSubmit={handleSubmit}>
          <input
            className="new-list-input"
            type="text"
            placeholder="List name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
          />
          <button className="btn-accent" type="submit">Create</button>
          <button
            className="btn-cancel"
            type="button"
            onClick={() => { setShowInput(false); setNewName('') }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <button className="btn-new-list" onClick={() => setShowInput(true)}>
          + New List
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add Home styles to index.css**

Append to `src/index.css`:

```css
/* Home */
.app-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  color: var(--text-secondary);
  padding: 40px 0;
  font-size: 15px;
}

.btn-new-list {
  width: 100%;
  padding: 14px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  box-shadow: 0 2px 8px var(--accent-shadow);
  font-family: inherit;
}

.new-list-form {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.new-list-input {
  flex: 1;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-family: inherit;
  color: var(--text-primary);
}

.new-list-input:focus {
  outline: 2px solid var(--accent);
  outline-offset: -1px;
}

.btn-accent {
  padding: 12px 16px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.btn-cancel {
  padding: 12px 16px;
  background: var(--surface);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: inherit;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Home.tsx src/index.css
git commit -m "feat: add Home component with new list creation"
```

---

### Task 6: AddItemForm component

**Files:**
- Create: `src/components/AddItemForm.tsx`
- Modify: `src/index.css` (append styles)

- [ ] **Step 1: Create the AddItemForm component**

Create `src/components/AddItemForm.tsx`:

```tsx
import { useState } from 'react'

interface AddItemFormProps {
  onAdd: (name: string, quantity: number, unit: string) => void
}

export default function AddItemForm({ onAdd }: AddItemFormProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const qty = Number(quantity) || 1
    onAdd(trimmed, qty, 'pcs')
    setName('')
    setQuantity('')
  }

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <input
        className="add-item-name"
        type="text"
        placeholder="Add item..."
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="add-item-qty"
        type="number"
        placeholder="Qty"
        min="1"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
      />
      <button className="btn-accent" type="submit">Add</button>
    </form>
  )
}
```

- [ ] **Step 2: Add AddItemForm styles to index.css**

Append to `src/index.css`:

```css
/* AddItemForm */
.add-item-form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.add-item-name {
  flex: 1;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-family: inherit;
  color: var(--text-primary);
}

.add-item-name:focus {
  outline: 2px solid var(--accent);
  outline-offset: -1px;
}

.add-item-qty {
  width: 64px;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 15px;
  text-align: center;
  font-family: inherit;
  color: var(--text-primary);
}

.add-item-qty:focus {
  outline: 2px solid var(--accent);
  outline-offset: -1px;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/AddItemForm.tsx src/index.css
git commit -m "feat: add AddItemForm component"
```

---

### Task 7: ShoppingItemRow component

**Files:**
- Create: `src/components/ShoppingItemRow.tsx`
- Modify: `src/index.css` (append styles)

- [ ] **Step 1: Create the ShoppingItemRow component**

Create `src/components/ShoppingItemRow.tsx`:

```tsx
import type { ShoppingItem } from '../types'

interface ShoppingItemRowProps {
  item: ShoppingItem
  onToggle: () => void
  onDelete: () => void
}

export default function ShoppingItemRow({ item, onToggle, onDelete }: ShoppingItemRowProps) {
  return (
    <div className={`item-row ${item.checked ? 'item-row--checked' : ''}`}>
      <button
        className={`item-checkbox ${item.checked ? 'item-checkbox--checked' : ''}`}
        onClick={onToggle}
        aria-label={item.checked ? 'Uncheck item' : 'Check item'}
      >
        {item.checked && <span className="item-checkmark">✓</span>}
      </button>
      <span className="item-name">{item.name}</span>
      <span className="item-qty">{item.quantity} {item.unit}</span>
      <button className="item-delete" onClick={onDelete} aria-label="Delete item">✕</button>
    </div>
  )
}
```

- [ ] **Step 2: Add ShoppingItemRow styles to index.css**

Append to `src/index.css`:

```css
/* ShoppingItemRow */
.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 12px;
  margin-bottom: 8px;
  transition: opacity 0.2s;
}

.item-row--checked {
  opacity: 0.5;
}

.item-checkbox {
  width: 22px;
  height: 22px;
  min-width: 22px;
  border-radius: 6px;
  border: 2px solid var(--accent);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.item-checkbox--checked {
  background: var(--accent);
  border-color: var(--accent);
}

.item-checkmark {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
}

.item-name {
  flex: 1;
  font-size: 15px;
}

.item-row--checked .item-name {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.item-qty {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.item-delete {
  background: none;
  border: none;
  color: var(--danger);
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ShoppingItemRow.tsx src/index.css
git commit -m "feat: add ShoppingItemRow component"
```

---

### Task 8: ListDetail component

**Files:**
- Create: `src/components/ListDetail.tsx`
- Modify: `src/index.css` (append styles)

- [ ] **Step 1: Create the ListDetail component**

Create `src/components/ListDetail.tsx`:

```tsx
import type { ShoppingList } from '../types'
import AddItemForm from './AddItemForm'
import ShoppingItemRow from './ShoppingItemRow'

interface ListDetailProps {
  list: ShoppingList
  onBack: () => void
  onAddItem: (name: string, quantity: number, unit: string) => void
  onToggleItem: (itemId: string) => void
  onDeleteItem: (itemId: string) => void
}

export default function ListDetail({
  list,
  onBack,
  onAddItem,
  onToggleItem,
  onDeleteItem,
}: ListDetailProps) {
  const unchecked = list.items.filter(i => !i.checked)
  const checked = list.items.filter(i => i.checked)
  const total = list.items.length
  const checkedCount = checked.length

  return (
    <div>
      <div className="detail-header">
        <button className="detail-back" onClick={onBack} aria-label="Back to lists">←</button>
        <h2 className="detail-title">{list.name}</h2>
      </div>

      <AddItemForm onAdd={onAddItem} />

      {total === 0 && (
        <p className="empty-state">No items yet. Add something above!</p>
      )}

      {unchecked.map(item => (
        <ShoppingItemRow
          key={item.id}
          item={item}
          onToggle={() => onToggleItem(item.id)}
          onDelete={() => onDeleteItem(item.id)}
        />
      ))}

      {checked.map(item => (
        <ShoppingItemRow
          key={item.id}
          item={item}
          onToggle={() => onToggleItem(item.id)}
          onDelete={() => onDeleteItem(item.id)}
        />
      ))}

      {total > 0 && (
        <div className="detail-progress">
          {checkedCount} of {total} item{total !== 1 ? 's' : ''} checked
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add ListDetail styles to index.css**

Append to `src/index.css`:

```css
/* ListDetail */
.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.detail-back {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.detail-title {
  font-size: 20px;
  font-weight: 700;
}

.detail-progress {
  text-align: center;
  color: var(--text-secondary);
  font-size: 13px;
  margin-top: 16px;
  padding: 8px;
  border-top: 1px solid var(--border);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ListDetail.tsx src/index.css
git commit -m "feat: add ListDetail component with sorted items"
```

---

### Task 9: Wire everything up in App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace App.tsx with screen switching logic**

Replace the contents of `src/App.tsx` with:

```tsx
import { useState } from 'react'
import { useShoppingLists } from './hooks/useShoppingLists'
import Home from './components/Home'
import ListDetail from './components/ListDetail'

export default function App() {
  const { lists, addList, deleteList, addItem, toggleItem, deleteItem } = useShoppingLists()
  const [activeListId, setActiveListId] = useState<string | null>(null)

  const activeList = activeListId ? lists.find(l => l.id === activeListId) : null

  if (activeList) {
    return (
      <div className="app">
        <ListDetail
          list={activeList}
          onBack={() => setActiveListId(null)}
          onAddItem={(name, qty, unit) => addItem(activeList.id, name, qty, unit)}
          onToggleItem={(itemId) => toggleItem(activeList.id, itemId)}
          onDeleteItem={(itemId) => deleteItem(activeList.id, itemId)}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <Home
        lists={lists}
        onAddList={addList}
        onSelectList={setActiveListId}
      />
    </div>
  )
}
```

- [ ] **Step 2: Run the app and verify full flow**

Run:
```bash
npm run dev
```

Verify:
1. Home screen shows title, empty state message, and "+ New List" button
2. Click "+ New List", type a name, click "Create" — list card appears
3. Click the card — navigates to ListDetail
4. Add items with name + quantity — items appear
5. Check/uncheck items — strikethrough + fade works, checked items go below
6. Delete items — they disappear
7. Click back arrow — returns to Home, list card shows updated counts
8. Refresh the page — all data persists

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire up App with screen switching and full CRUD flow"
```

---

### Task 10: Delete list functionality and final polish

**Files:**
- Modify: `src/components/Home.tsx`
- Modify: `src/components/ListCard.tsx`
- Modify: `src/index.css` (append styles)

- [ ] **Step 1: Add delete button to ListCard**

Replace the contents of `src/components/ListCard.tsx` with:

```tsx
import type { ShoppingList } from '../types'

interface ListCardProps {
  list: ShoppingList
  onClick: () => void
  onDelete: () => void
}

export default function ListCard({ list, onClick, onDelete }: ListCardProps) {
  const total = list.items.length
  const checked = list.items.filter(i => i.checked).length
  const allDone = total > 0 && checked === total

  return (
    <div className="list-card">
      <button className="list-card-main" onClick={onClick}>
        <div className="list-card-info">
          <span className="list-card-name">{list.name}</span>
          <span className="list-card-meta">
            {total} item{total !== 1 ? 's' : ''}
            {total > 0 && ` · ${checked} checked`}
            {allDone && ' ✅'}
          </span>
        </div>
        <span className="list-card-arrow">→</span>
      </button>
      <button
        className="list-card-delete"
        onClick={onDelete}
        aria-label={`Delete ${list.name}`}
      >
        ✕
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Update Home to pass onDelete**

Replace the contents of `src/components/Home.tsx` with:

```tsx
import type { ShoppingList } from '../types'
import ListCard from './ListCard'
import { useState } from 'react'

interface HomeProps {
  lists: ShoppingList[]
  onAddList: (name: string) => void
  onDeleteList: (listId: string) => void
  onSelectList: (listId: string) => void
}

export default function Home({ lists, onAddList, onDeleteList, onSelectList }: HomeProps) {
  const [newName, setNewName] = useState('')
  const [showInput, setShowInput] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed) return
    onAddList(trimmed)
    setNewName('')
    setShowInput(false)
  }

  return (
    <div>
      <h1 className="app-title">🍽️ Khana khana hai</h1>

      {lists.length === 0 && (
        <p className="empty-state">No lists yet. Create one to get started!</p>
      )}

      {lists.map(list => (
        <ListCard
          key={list.id}
          list={list}
          onClick={() => onSelectList(list.id)}
          onDelete={() => onDeleteList(list.id)}
        />
      ))}

      {showInput ? (
        <form className="new-list-form" onSubmit={handleSubmit}>
          <input
            className="new-list-input"
            type="text"
            placeholder="List name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
          />
          <button className="btn-accent" type="submit">Create</button>
          <button
            className="btn-cancel"
            type="button"
            onClick={() => { setShowInput(false); setNewName('') }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <button className="btn-new-list" onClick={() => setShowInput(true)}>
          + New List
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Update App.tsx to pass deleteList**

In `src/App.tsx`, change the `<Home` element to include `onDeleteList`:

```tsx
      <Home
        lists={lists}
        onAddList={addList}
        onDeleteList={deleteList}
        onSelectList={setActiveListId}
      />
```

- [ ] **Step 4: Update ListCard styles for delete button**

Replace the `.list-card` block in `src/index.css` with:

```css
/* ListCard */
.list-card {
  display: flex;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.15s;
  overflow: hidden;
}

.list-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.list-card-main {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.list-card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-card-name {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
}

.list-card-meta {
  font-size: 13px;
  color: var(--text-secondary);
}

.list-card-arrow {
  font-size: 20px;
  color: var(--accent);
}

.list-card-delete {
  background: none;
  border: none;
  border-left: 1px solid var(--border);
  color: var(--danger);
  font-size: 16px;
  cursor: pointer;
  padding: 14px 12px;
  align-self: stretch;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.list-card-delete:hover {
  opacity: 1;
}
```

- [ ] **Step 5: Run the app and verify delete works**

Run:
```bash
npm run dev
```

Verify:
1. Each list card shows a delete (✕) button on the right
2. Clicking ✕ removes the list
3. All previous functionality still works

- [ ] **Step 6: Commit**

```bash
git add src/components/ListCard.tsx src/components/Home.tsx src/App.tsx src/index.css
git commit -m "feat: add delete list functionality and final polish"
```

---

### Task 11: Build and verify production output

**Files:** None (verification only)

- [ ] **Step 1: Run the production build**

Run:
```bash
npm run build
```

Expected: Build succeeds with no errors or warnings. Output in `dist/`.

- [ ] **Step 2: Preview the production build**

Run:
```bash
npm run preview
```

Expected: App runs from `dist/`, all features work identically to dev mode.

- [ ] **Step 3: Final commit and push**

```bash
git add -A
git commit -m "chore: verify production build"
git push origin main
```
