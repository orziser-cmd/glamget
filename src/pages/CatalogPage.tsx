import { useEffect, useState } from 'react'
import { fetchAllProducts } from '../api'
import ProductCard from '../components/ProductCard'
import StatusMessage from '../components/StatusMessage'
import type { Product } from '../types'

// עמוד הרשימה: מביא את המוצרים מהאינטרנט ומציג אותם
function CatalogPage() {
  // state = "זיכרון" של הרכיב. כשהוא משתנה, React מצייר את המסך מחדש.
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // useEffect רץ אחרי שהעמוד מופיע. [] בסוף = רק פעם אחת.
  useEffect(() => {
    fetchAllProducts()
      .then((data) => setProducts(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  // שלושה מצבים: טוען, שגיאה, או יש מידע
  if (isLoading) return <StatusMessage type="loading" />
  if (error) return <StatusMessage type="error" message={error} />

  return (
    <section>
      <h1>קטלוג</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default CatalogPage
