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
      <div className="home-header">
        <h1 className="app-title">🍽️ Khana khana hai</h1>
        <span className="squiggle" aria-hidden="true" />
        <p className="app-subtitle">
          Your <span className="highlight">playful</span> grocery companion
        </p>
      </div>

      {lists.length === 0 && (
        <p className="empty-state">No lists yet — tap below to create your first one!</p>
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
