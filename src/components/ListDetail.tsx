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
