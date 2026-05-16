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
