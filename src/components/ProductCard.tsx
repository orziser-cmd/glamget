import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { CATEGORY_LABELS, finalPriceInShekels, formatShekels, toShekels } from '../utils/styleLogic'

// props = המידע שהרכיב מקבל מבחוץ, כמו פרמטרים של פונקציה
interface ProductCardProps {
  product: Product
}

// כרטיס של מוצר אחד. לחיצה עליו פותחת את עמוד הפריט.
function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discountPercentage >= 1

  return (
    <Link to={`/items/${product.id}`} className="product-card">
      <div className="product-image">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        {hasDiscount && <span className="badge" dir="ltr">-{Math.round(product.discountPercentage)}%</span>}
      </div>
      <div className="product-info">
        <p className="product-category">{CATEGORY_LABELS[product.category] ?? product.category}</p>
        <h3 dir="auto">{product.title}</h3>
        <p className="price">
          <strong>{formatShekels(finalPriceInShekels(product))}</strong>
          {hasDiscount && <s>{formatShekels(toShekels(product.price))}</s>}
        </p>
      </div>
    </Link>
  )
}

export default ProductCard
