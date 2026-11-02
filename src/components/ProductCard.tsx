import { Link } from 'react-router-dom'
import type { Product } from '../types'

// props = המידע שהרכיב מקבל מבחוץ, כמו פרמטרים של פונקציה
interface ProductCardProps {
  product: Product
}

// כרטיס של מוצר אחד. לחיצה עליו פותחת את עמוד הפריט.
function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/items/${product.id}`} className="product-card">
      <img src={product.thumbnail} alt={product.title} loading="lazy" />
      <h3>{product.title}</h3>
      <p>${product.price}</p>
    </Link>
  )
}

export default ProductCard
