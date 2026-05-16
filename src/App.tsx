import { useState } from 'react'
import { useShoppingLists } from './hooks/useShoppingLists'
import Home from './components/Home'
import ListDetail from './components/ListDetail'

export default function App() {
  const { lists, addList, deleteList, addItem, toggleItem, deleteItem } = useShoppingLists()
  const [activeListId, setActiveListId] = useState<string | null>(null)

  const activeList = activeListId ? lists.find(l => l.id === activeListId) : null

  if (activeList) {
    return (
      <div className="app">
        <ListDetail
          list={activeList}
          onBack={() => setActiveListId(null)}
          onAddItem={(name, qty, unit) => addItem(activeList.id, name, qty, unit)}
          onToggleItem={(itemId) => toggleItem(activeList.id, itemId)}
          onDeleteItem={(itemId) => deleteItem(activeList.id, itemId)}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <Home
        lists={lists}
        onAddList={addList}
        onDeleteList={deleteList}
        onSelectList={setActiveListId}
      />
    </div>
  )
}
