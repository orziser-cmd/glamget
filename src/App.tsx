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
import {
  addToLook,
  createSavedLook,
  getLookItems,
  removeFromLook,
  replaceSavedLook,
  updateSavedLook,
} from './utils/styleLogic'
import { loadFromStorage, saveToStorage } from './utils/storage'

const DEFAULT_SETTINGS: Settings = { eventId: 'wedding', budget: 1000 }

// App הוא "השלד" של האפליקציה: תפריט למעלה, ומתחתיו העמוד שמתאים לכתובת.
// המידע שכמה עמודים צריכים (הבחירות, הלוק והלוקים השמורים) נשמר כאן, למעלה, ועובר לעמודים ב-props.
function App() {
  // בפעם הראשונה קוראים מה-localStorage, כדי שהמידע יחזור גם אחרי סגירת הדפדפן
  const [settings, setSettings] = useState<Settings>(() => loadFromStorage('glamget-settings', DEFAULT_SETTINGS))
  const [look, setLook] = useState<Look>(() => loadFromStorage('glamget-look', {}))
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(() => loadFromStorage('glamget-saved', []))
  // אם פתחנו לוק שמור לעריכה, כאן נשמר המזהה שלו (null = לוק חדש)
  const [editingId, setEditingId] = useState<string | null>(() => loadFromStorage<string | null>('glamget-editing', null))

  // בכל פעם שמשהו משתנה, שומרים אותו מחדש
  useEffect(() => saveToStorage('glamget-settings', settings), [settings])
  useEffect(() => saveToStorage('glamget-look', look), [look])
  useEffect(() => saveToStorage('glamget-saved', savedLooks), [savedLooks])
  useEffect(() => saveToStorage('glamget-editing', editingId), [editingId])

  const editingLook = savedLooks.find((saved) => saved.id === editingId) ?? null

  function handleAddToLook(product: Product) {
    setLook((current) => addToLook(current, product))
  }

  function handleRemoveFromLook(slot: SlotId) {
    setLook((current) => removeFromLook(current, slot))
  }

  function handleSaveLook(name: string) {
    if (editingLook) {
      // עריכה של לוק קיים: מעדכנים אותו במקום ליצור עוד אחד
      const updated = updateSavedLook(editingLook, name, look, settings)
      setSavedLooks((current) => replaceSavedLook(current, updated))
    } else {
      const saved = createSavedLook(name, look, settings)
      setSavedLooks((current) => [saved, ...current]) // החדש ראשון ברשימה
    }
    handleNewLook() // אחרי השמירה מתחילים לוק חדש ונקי
  }

  function handleNewLook() {
    setLook({})
    setEditingId(null)
  }

  function handleLoadLook(saved: SavedLook) {
    setLook(saved.look)
    setSettings({ eventId: saved.eventId, budget: saved.budget })
    setEditingId(saved.id)
  }

  function handleDeleteLook(id: string) {
    setSavedLooks((current) => current.filter((saved) => saved.id !== id))
    if (id === editingId) setEditingId(null)
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
              <MyLookPage
                look={look}
                settings={settings}
                onAdd={handleAddToLook}
                onRemove={handleRemoveFromLook}
                onSave={handleSaveLook}
                editingName={editingLook?.name ?? null}
                onNewLook={handleNewLook}
              />
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
