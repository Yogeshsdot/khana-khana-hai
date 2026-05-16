import type { ShoppingList } from '../types'
import { createPortal } from 'react-dom'
import ListCard from './ListCard'
import { useState, useEffect, useRef } from 'react'

interface HomeProps {
  lists: ShoppingList[]
  onAddList: (name: string) => void
  onDeleteList: (listId: string) => void
  onSelectList: (listId: string) => void
}

export default function Home({ lists, onAddList, onDeleteList, onSelectList }: HomeProps) {
  const [newName, setNewName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showModal) {
      const t = setTimeout(() => inputRef.current?.focus(), 300)
      return () => clearTimeout(t)
    }
  }, [showModal])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed) return
    onAddList(trimmed)
    setNewName('')
    setShowModal(false)
  }

  function handleClose() {
    setShowModal(false)
    setNewName('')
  }

  const portalTarget = document.querySelector('.phone-screen')

  const sheetModal = showModal && portalTarget
    ? createPortal(
        <div className="sheet-overlay" onClick={handleClose}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h3 className="sheet-title">Create new list</h3>
            <form onSubmit={handleSubmit}>
              <label className="sheet-label" htmlFor="new-list-name">List name</label>
              <input
                ref={inputRef}
                id="new-list-name"
                className="sheet-input"
                type="text"
                placeholder="e.g. Weekly Groceries"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
              <div className="sheet-actions">
                <button className="btn-accent sheet-btn" type="submit">Create List</button>
                <button
                  className="btn-cancel sheet-btn"
                  type="button"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>,
        portalTarget
      )
    : null

  return (
    <div>
      <div className="home-header">
        <h1 className="app-title">🥬 Khana khana hai</h1>
        <p className="app-subtitle">
          Your <span className="highlight">fresh</span> grocery companion
        </p>
      </div>

      {lists.length === 0 && (
        <p className="empty-state">No lists yet — tap below to start shopping!</p>
      )}

      {lists.map((list, i) => (
        <ListCard
          key={list.id}
          list={list}
          index={i}
          onClick={() => onSelectList(list.id)}
          onDelete={() => onDeleteList(list.id)}
        />
      ))}

      <button className="btn-new-list" onClick={() => setShowModal(true)}>
        + New List
      </button>

      {sheetModal}
    </div>
  )
}
