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
