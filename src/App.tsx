import { useState } from 'react'
import { useShoppingLists } from './hooks/useShoppingLists'
import Home from './components/Home'
import ListDetail from './components/ListDetail'

export default function App() {
  const { lists, addList, deleteList, addItem, toggleItem, deleteItem } = useShoppingLists()
  const [activeListId, setActiveListId] = useState<string | null>(null)

  const activeList = activeListId ? lists.find(l => l.id === activeListId) : null

  const content = activeList ? (
    <ListDetail
      list={activeList}
      onBack={() => setActiveListId(null)}
      onAddItem={(name, qty, unit) => addItem(activeList.id, name, qty, unit)}
      onToggleItem={(itemId) => toggleItem(activeList.id, itemId)}
      onDeleteItem={(itemId) => deleteItem(activeList.id, itemId)}
    />
  ) : (
    <Home
      lists={lists}
      onAddList={addList}
      onDeleteList={deleteList}
      onSelectList={setActiveListId}
    />
  )

  return (
    <div className="phone-stage">
      <div className="phone-frame">
        <div className="phone-notch">
          <div className="phone-notch-camera" />
        </div>
        <div className="phone-status-bar">
          <span>9:41</span>
          <div className="phone-status-icons">
            <span>●●●●○</span>
            <span>🔋</span>
          </div>
        </div>
        <div className="phone-screen">
          <div className="app">
            {content}
          </div>
        </div>
        <div className="phone-home-indicator" />
      </div>
    </div>
  )
}
