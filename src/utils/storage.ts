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
