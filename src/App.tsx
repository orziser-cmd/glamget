import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import CatalogPage from './pages/CatalogPage'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import type { Settings } from './types'

// App הוא "השלד" של האפליקציה: תפריט למעלה, ומתחתיו העמוד שמתאים לכתובת.
// הבחירות של המשתמשת נשמרות כאן, למעלה, כדי שכל העמודים יוכלו לקבל אותן ב-props.
function App() {
  const [settings, setSettings] = useState<Settings>({ eventId: 'wedding', budget: 1000 })

  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage settings={settings} onSettingsChange={setSettings} />} />
          <Route path="/items" element={<CatalogPage settings={settings} />} />
          <Route path="/items/:id" element={<ProductPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
