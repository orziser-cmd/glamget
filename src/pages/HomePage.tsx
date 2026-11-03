import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAllProducts } from '../api'
import EventIcon from '../components/EventIcon'
import type { EventId, Product, Settings } from '../types'
import { EVENTS, formatShekels } from '../utils/styleLogic'

interface HomePageProps {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

// התמונות בפס העליון: פריט אחד מכל אחת מהקטגוריות האלה
const HERO_CATEGORIES = [
  'womens-dresses',
  'womens-shoes',
  'womens-bags',
  'tops',
  'womens-jewellery',
  'womens-watches',
  'sunglasses',
]

// מחזיר את התמונה של המוצר הראשון בקטגוריה (או undefined אם עוד אין מוצרים)
function coverImage(products: Product[], category: string): string | undefined {
  const product = products.find((p) => p.category === category)
  return product ? (product.images[0] ?? product.thumbnail) : undefined
}

// מסך הפתיחה: בוחרים אירוע ותקציב, ועוברים לקטלוג
function HomePage({ settings, onSettingsChange }: HomePageProps) {
  // הבחירות נשמרות כאן רק עד שלוחצים על הכפתור
  // אף אירוע לא מסומן מראש: המשתמשת בוחרת בעצמה בכל פעם (null = עוד לא נבחר)
  const [eventId, setEventId] = useState<EventId | null>(null)
  const [eventError, setEventError] = useState('')
  const [budget, setBudget] = useState<number>(settings.budget)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // מוצרים, רק בשביל התמונות בדף. אם הטעינה נכשלת, מופיעים רקעים צבעוניים בלי תמונה.
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    fetchAllProducts()
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
  }, [])

  function changeBudget(value: number) {
    setBudget(value)
    setError('')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault() // מונע מהדפדפן לרענן את הדף
    if (!eventId) {
      setEventError('בחרי לאיזה אירוע')
      return
    }
    if (!budget || budget <= 0) {
      setError('הקלידי תקציב גדול מ-0')
      return
    }
    onSettingsChange({ eventId, budget })
    navigate('/items') // מעבר לעמוד הקטלוג
  }

  return (
    <section className="home">
      <div className="hero-collage" aria-hidden="true">
        {HERO_CATEGORIES.map((category, index) => {
          const image = coverImage(products, category)
          return (
            <div key={category} className={`collage-item collage-${index + 1}`}>
              {image && <img src={image} alt="" />}
            </div>
          )
        })}
      </div>

      <div className="hero">
        <p className="eyebrow">GLAM ON A BUDGET</p>
        <h1>הלוק המושלם, בתקציב שלך</h1>
        <p className="hero-text">בחרי אירוע ותקציב, ו-Glamget תראה לך רק פריטים שמתאימים ותחשב כמה עולה הלוק.</p>
      </div>

      <form className="setup-form" onSubmit={handleSubmit}>
        <h2 className="step-title">לאיזה אירוע?</h2>
        <div className="event-grid">
          {EVENTS.map((event) => {
            const isActive = event.id === eventId
            return (
              <button
                type="button"
                key={event.id}
                className={`event-card event-${event.id}${isActive ? ' event-active' : ''}`}
                onClick={() => {
                  setEventId(event.id)
                  setEventError('')
                }}
                aria-pressed={isActive}
              >
                <EventIcon eventId={event.id} />
                <span className="event-name">{event.label}</span>
              </button>
            )
          })}
        </div>
        {eventError && <p className="form-error">{eventError}</p>}

        <h2 className="step-title">מה התקציב?</h2>
        <div className="budget-picker">
          <div className="budget-row">
            <p className="budget-value">{formatShekels(budget || 0)}</p>
            <label className="budget-exact">
              סכום מדויק:
              <input
                type="number"
                min={1}
                value={budget || ''}
                onChange={(e) => changeBudget(Number(e.target.value))}
                aria-label="תקציב בשקלים"
              />
            </label>
          </div>
          <input
            type="range"
            min={100}
            max={5000}
            step={50}
            value={budget || 100}
            onChange={(e) => changeBudget(Number(e.target.value))}
            aria-label="סרגל תקציב"
          />
          <div className="range-labels">
            <span>100 ₪</span>
            <span>5,000 ₪</span>
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>

        <button type="submit" className="btn btn-primary btn-wide">
          לקטלוג שלי ←
        </button>
      </form>
    </section>
  )
}

export default HomePage
