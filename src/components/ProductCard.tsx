import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { CATEGORY_LABELS, finalPriceInShekels, formatShekels } from '../utils/styleLogic'

// props = המידע שהרכיב מקבל מבחוץ, כמו פרמטרים של פונקציה
interface ProductCardProps {
  product: Product
}

// כרטיס של מוצר אחד. לחיצה עליו פותחת את עמוד הפריט.
function ProductCard({ product }: ProductCardProps) {
  // התמונה הגדולה (images) איכותית יותר מ-thumbnail, שהיא גרסה מוקטנת
  const mainImage = product.images[0] ?? product.thumbnail
  // תמונה שנייה, שמופיעה כשמעבירים עכבר (כמו באתרי אופנה)
  const hoverImage = product.images[1]

  return (
    <Link to={`/items/${product.id}`} className="product-card">
      <div className="product-image">
        <img className={hoverImage ? 'img-main has-hover' : 'img-main'} src={mainImage} alt={product.title} loading="lazy" />
        {hoverImage && <img className="img-hover" src={hoverImage} alt="" loading="lazy" />}
      </div>
      <div className="product-info">
        <p className="product-category">{CATEGORY_LABELS[product.category] ?? product.category}</p>
        <h3 dir="auto">{product.title}</h3>
        <p className="price">
          <strong>{formatShekels(finalPriceInShekels(product))}</strong>
        </p>
      </div>
    </Link>
  )
}

export default ProductCard
