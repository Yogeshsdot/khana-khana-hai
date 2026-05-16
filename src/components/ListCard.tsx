import type { ShoppingList } from '../types'

const ACCENT_COLORS = ['violet', 'pink', 'yellow', 'mint'] as const

interface ListCardProps {
  list: ShoppingList
  index: number
  onClick: () => void
  onDelete: () => void
}

export default function ListCard({ list, index, onClick, onDelete }: ListCardProps) {
  const total = list.items.length
  const checked = list.items.filter(i => i.checked).length
  const allDone = total > 0 && checked === total
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length]

  return (
    <div className="list-card" style={{ animationDelay: `${index * 0.06}s` }}>
      <div className={`list-card-accent list-card-accent--${color}`} />
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
