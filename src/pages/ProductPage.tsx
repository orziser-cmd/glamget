import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductById } from '../api'
import StatusMessage from '../components/StatusMessage'
import type { Product } from '../types'

// עמוד הפרטים של מוצר אחד.
// useParams קורא את המספר מהכתובת: בכתובת /items/3 נקבל id = "3"
function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // [id] בסוף = להביא שוב בכל פעם שהמספר בכתובת משתנה
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    fetchProductById(Number(id))
      .then((data) => setProduct(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return <StatusMessage type="loading" />
  if (error || !product) return <StatusMessage type="error" message={error ?? undefined} />

  return (
    <section>
      <Link to="/items">→ חזרה לקטלוג</Link>
      <h1>{product.title}</h1>
      <img src={product.thumbnail} alt={product.title} />
      <p>{product.description}</p>
      <p>${product.price}</p>
    </section>
  )
}

export default ProductPage
