import ProductCard from '../components/ProductCard'
import { sampleProducts } from '../data/sampleProducts'

// עמוד הרשימה: כל המוצרים
function CatalogPage() {
  return (
    <section>
      <h1>קטלוג</h1>
      <div className="product-grid">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default CatalogPage
