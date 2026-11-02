import ProductCard from './components/ProductCard'
import { sampleProducts } from './data/sampleProducts'

function App() {
  return (
    <main>
      <h1>Glamget</h1>
      <div className="product-grid">
        {/* map עובר על כל מוצר ברשימה ויוצר לו כרטיס. key = מזהה ייחודי שעוזר ל-React */}
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}

export default App
