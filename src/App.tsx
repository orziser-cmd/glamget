import { Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'

// App הוא "השלד" של האפליקציה: תפריט למעלה, ומתחתיו העמוד שמתאים לכתובת.
function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<h1>Glamget · glam on a budget</h1>} />
          <Route path="/items" element={<CatalogPage />} />
          <Route path="/items/:id" element={<ProductPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
