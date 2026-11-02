import { Link, useParams } from 'react-router-dom'
import { sampleProducts } from '../data/sampleProducts'

// עמוד הפרטים של מוצר אחד.
// useParams קורא את המספר מהכתובת: בכתובת /items/3 נקבל id = "3"
function ProductPage() {
  const { id } = useParams()
  const product = sampleProducts.find((p) => p.id === Number(id))

  if (!product) {
    return <p>המוצר לא נמצא</p>
  }

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
