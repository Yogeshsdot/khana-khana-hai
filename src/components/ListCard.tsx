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
