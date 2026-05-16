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
  const percent = total > 0 ? Math.round((checkedCount / total) * 100) : 0

  return (
    <div>
      <div className="detail-header">
        <button className="detail-back" onClick={onBack} aria-label="Back to lists">←</button>
        <h2 className="detail-title">{list.name}</h2>
      </div>

      <AddItemForm onAdd={onAddItem} />

      {total === 0 && (
        <p className="empty-state">No items yet — add something above!</p>
      )}

      {unchecked.map((item, i) => (
        <ShoppingItemRow
          key={item.id}
          item={item}
          index={i}
          onToggle={() => onToggleItem(item.id)}
          onDelete={() => onDeleteItem(item.id)}
        />
      ))}

      {checked.map((item, i) => (
        <ShoppingItemRow
          key={item.id}
          item={item}
          index={unchecked.length + i}
          onToggle={() => onToggleItem(item.id)}
          onDelete={() => onDeleteItem(item.id)}
        />
      ))}

      {total > 0 && (
        <div className="detail-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <p className="progress-text">
            <strong>{checkedCount}</strong> of <strong>{total}</strong> item{total !== 1 ? 's' : ''} checked
          </p>
        </div>
      )}
    </div>
  )
}
