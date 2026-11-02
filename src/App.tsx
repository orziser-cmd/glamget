import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import CatalogPage from './pages/CatalogPage'
import HomePage from './pages/HomePage'
import MyLookPage from './pages/MyLookPage'
import ProductPage from './pages/ProductPage'
import type { Look, Product, Settings, SlotId } from './types'
import { addToLook, getLookItems, removeFromLook } from './utils/styleLogic'

// App הוא "השלד" של האפליקציה: תפריט למעלה, ומתחתיו העמוד שמתאים לכתובת.
// המידע שכמה עמודים צריכים (הבחירות והלוק) נשמר כאן, למעלה, ועובר לעמודים ב-props.
function App() {
  const [settings, setSettings] = useState<Settings>({ eventId: 'wedding', budget: 1000 })
  const [look, setLook] = useState<Look>({})

  function handleAddToLook(product: Product) {
    setLook((current) => addToLook(current, product))
  }

  function handleRemoveFromLook(slot: SlotId) {
    setLook((current) => removeFromLook(current, slot))
  }

  return (
    <>
      <NavBar lookCount={getLookItems(look).length} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage settings={settings} onSettingsChange={setSettings} />} />
          <Route path="/items" element={<CatalogPage settings={settings} />} />
          <Route
            path="/items/:id"
            element={<ProductPage look={look} settings={settings} onAddToLook={handleAddToLook} />}
          />
          <Route
            path="/look"
            element={<MyLookPage look={look} settings={settings} onRemove={handleRemoveFromLook} />}
          />
        </Routes>
      </main>
    </>
  )
}

export default App
