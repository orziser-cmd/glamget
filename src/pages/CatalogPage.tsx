import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllProducts } from '../api'
import FilterBar from '../components/FilterBar'
import ProductCard from '../components/ProductCard'
import StatusMessage from '../components/StatusMessage'
import type { Product, Settings, SortOption } from '../types'
import { filterProducts, formatShekels, getCategoriesForEvent, getEventLabel, sortProducts } from '../utils/styleLogic'

interface CatalogPageProps {
  settings: Settings
}

// עמוד הרשימה: מביא את המוצרים מהאינטרנט, מסנן ומציג
function CatalogPage({ settings }: CatalogPageProps) {
  // state = "זיכרון" של הרכיב. כשהוא משתנה, React מצייר את המסך מחדש.
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('recommended')

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

  // הסינון והמיון עצמם קורים ב-styleLogic. כאן רק מעבירים להם את הבחירות.
  const filtered = filterProducts(products, {
    eventId: settings.eventId,
    budget: settings.budget,
    category,
    search,
  })
  const visibleProducts = sortProducts(filtered, sort)

  return (
    <section>
      <div className="page-header">
        <h1>קטלוג</h1>
        <p className="summary">
          {getEventLabel(settings.eventId)} · עד {formatShekels(settings.budget)} · מוצגים {visibleProducts.length} פריטים ·{' '}
          <Link to="/">שינוי</Link>
        </p>
      </div>

      <FilterBar
        categories={getCategoriesForEvent(settings.eventId)}
        selectedCategory={category}
        onCategoryChange={setCategory}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
      />

      {visibleProducts.length === 0 ? (
        <p className="empty">לא מצאנו פריטים שמתאימים. נסי מילת חיפוש אחרת, קטגוריה אחרת או תקציב גדול יותר.</p>
      ) : (
        <div className="product-grid">
          {/* map עובר על כל מוצר ויוצר לו כרטיס. key = מזהה ייחודי שעוזר ל-React */}
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

export default CatalogPage
