import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductById } from '../api'
import StatusMessage from '../components/StatusMessage'
import type { Look, Product, Settings } from '../types'
import {
  CATEGORY_LABELS,
  finalPriceInShekels,
  firstSentence,
  formatShekels,
  getSlotForCategory,
  totalIfAdded,
} from '../utils/styleLogic'

interface ProductPageProps {
  look: Look
  settings: Settings
  onAddToLook: (product: Product) => void
}

// עמוד הפרטים של מוצר אחד.
// useParams קורא את המספר מהכתובת: בכתובת /items/3 נקבל id = "3"
function ProductPage({ look, settings, onAddToLook }: ProductPageProps) {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [added, setAdded] = useState(false)

  // [id] בסוף = להביא שוב בכל פעם שהמספר בכתובת משתנה
  useEffect(() => {
    setIsLoading(true)
    setError(null)
    setAdded(false)
    fetchProductById(Number(id))
      .then((data) => {
        setProduct(data)
        setSelectedImage(data.images[0] ?? data.thumbnail)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return <StatusMessage type="loading" />
  if (error || !product) return <StatusMessage type="error" message={error ?? undefined} />

  const finalPrice = finalPriceInShekels(product)
  const canBeInLook = getSlotForCategory(product.category) !== null
  const newTotal = totalIfAdded(look, product)
  const fitsBudget = newTotal <= settings.budget

  function handleAdd() {
    if (!product) return
    onAddToLook(product)
    setAdded(true)
  }

  return (
    <section className="product-page">
      <Link to="/items" className="back-link">
        → חזרה לקטלוג
      </Link>

      <div className="product-layout">
        <div className="gallery">
          <img className="gallery-main" src={selectedImage} alt={product.title} />
          {product.images.length > 1 && (
            <div className="gallery-thumbs">
              {product.images.map((image) => (
                <button
                  type="button"
                  key={image}
                  className={image === selectedImage ? 'thumb thumb-active' : 'thumb'}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-details">
          <p className="product-category">{CATEGORY_LABELS[product.category] ?? product.category}</p>
          <h1 dir="auto">{product.title}</h1>
          {product.brand && <p className="brand">{product.brand}</p>}

          <p className="price price-large">
            <strong>{formatShekels(finalPrice)}</strong>
          </p>

          {/* רק המשפט הראשון: התיאור מגיע מה-API באנגלית, ומשפט אחד מספיק כדי להבין מה הפריט */}
          <p className="description" dir="auto">
            {firstSentence(product.description)}
          </p>

          {canBeInLook && (
            <div className={fitsBudget ? 'look-hint' : 'look-hint look-hint-over'}>
              {fitsBudget
                ? `עם הפריט הזה הלוק יעלה ${formatShekels(newTotal)}, בתוך התקציב.`
                : `עם הפריט הזה הלוק יעלה ${formatShekels(newTotal)}, יותר מהתקציב (${formatShekels(settings.budget)}).`}
            </div>
          )}

          {canBeInLook && (
            <button type="button" className="btn btn-primary" onClick={handleAdd}>
              + הוסיפי ללוק
            </button>
          )}
          {added && (
            <p className="added-message">
              נוסף ללוק! <Link to="/look">לצפייה בלוק שלי ←</Link>
            </p>
          )}

          <a
            className="similar-link"
            href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(product.title)}`}
            target="_blank"
            rel="noreferrer"
          >
            מצאי פריט דומה לקנייה ↗
          </a>
        </div>
      </div>
    </section>
  )
}

export default ProductPage
