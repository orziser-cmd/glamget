import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import CatalogPage from './pages/CatalogPage'
import HomePage from './pages/HomePage'
import MyLookPage from './pages/MyLookPage'
import NotFoundPage from './pages/NotFoundPage'
import ProductPage from './pages/ProductPage'
import SavedLooksPage from './pages/SavedLooksPage'
import type { Look, Product, SavedLook, Settings, SlotId } from './types'
import { addToLook, createSavedLook, getLookItems, removeFromLook } from './utils/styleLogic'
import { loadFromStorage, saveToStorage } from './utils/storage'

const DEFAULT_SETTINGS: Settings = { eventId: 'wedding', budget: 1000 }

// App הוא "השלד" של האפליקציה: תפריט למעלה, ומתחתיו העמוד שמתאים לכתובת.
// המידע שכמה עמודים צריכים (הבחירות, הלוק והלוקים השמורים) נשמר כאן, למעלה, ועובר לעמודים ב-props.
function App() {
  // בפעם הראשונה קוראים מה-localStorage, כדי שהמידע יחזור גם אחרי סגירת הדפדפן
  const [settings, setSettings] = useState<Settings>(() => loadFromStorage('glamget-settings', DEFAULT_SETTINGS))
  const [look, setLook] = useState<Look>(() => loadFromStorage('glamget-look', {}))
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(() => loadFromStorage('glamget-saved', []))

  // בכל פעם שמשהו משתנה, שומרים אותו מחדש
  useEffect(() => saveToStorage('glamget-settings', settings), [settings])
  useEffect(() => saveToStorage('glamget-look', look), [look])
  useEffect(() => saveToStorage('glamget-saved', savedLooks), [savedLooks])

  function handleAddToLook(product: Product) {
    setLook((current) => addToLook(current, product))
  }

  function handleRemoveFromLook(slot: SlotId) {
    setLook((current) => removeFromLook(current, slot))
  }

  function handleSaveLook(name: string) {
    const saved = createSavedLook(name, look, settings)
    setSavedLooks((current) => [saved, ...current]) // החדש ראשון ברשימה
  }

  function handleLoadLook(saved: SavedLook) {
    setLook(saved.look)
    setSettings({ eventId: saved.eventId, budget: saved.budget })
  }

  function handleDeleteLook(id: string) {
    setSavedLooks((current) => current.filter((saved) => saved.id !== id))
  }

  return (
    <>
      <NavBar lookCount={getLookItems(look).length} savedCount={savedLooks.length} />
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
            element={
              <MyLookPage look={look} settings={settings} onRemove={handleRemoveFromLook} onSave={handleSaveLook} />
            }
          />
          <Route
            path="/saved"
            element={<SavedLooksPage savedLooks={savedLooks} onLoad={handleLoadLook} onDelete={handleDeleteLook} />}
          />
          {/* כוכבית = כל כתובת אחרת שלא מופיעה למעלה */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
