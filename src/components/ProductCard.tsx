import type { Product } from '../types'

// props = המידע שהרכיב מקבל מבחוץ, כמו פרמטרים של פונקציה
interface ProductCardProps {
  product: Product
}

// כרטיס של מוצר אחד: תמונה, שם ומחיר
function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <img src={product.thumbnail} alt={product.title} loading="lazy" />
      <h3>{product.title}</h3>
      <p>${product.price}</p>
    </article>
  )
}

export default ProductCard
