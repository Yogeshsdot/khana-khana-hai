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
