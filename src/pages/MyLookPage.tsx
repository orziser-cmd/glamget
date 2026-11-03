import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllProducts } from '../api'
import BudgetBar from '../components/BudgetBar'
import type { Look, Product, Settings, SlotId } from '../types'
import {
  SLOTS,
  alternativesFor,
  finalPriceInShekels,
  formatShekels,
  getBudgetStatus,
  getEventLabel,
  getLookItems,
  lookTotal,
  suggestForSlot,
} from '../utils/styleLogic'

interface MyLookPageProps {
  look: Look
  settings: Settings
  onAdd: (product: Product) => void
  onRemove: (slot: SlotId) => void
  onSave: (name: string) => void
  editingName: string | null // שם הלוק השמור שעורכים, או null אם זה לוק חדש
  onNewLook: () => void
}

// הלוק שלי: מקום לכל סוג פריט, הצעות והחלפות, סכום מול התקציב, ושמירה
function MyLookPage({ look, settings, onAdd, onRemove, onSave, editingName, onNewLook }: MyLookPageProps) {
  const [name, setName] = useState(editingName ?? '')
  const [message, setMessage] = useState('')
  const [swapSlot, setSwapSlot] = useState<SlotId | null>(null) // באיזה מקום פתוחות עכשיו החלופות

  // כל המוצרים, כדי שנוכל להציע פריטים וחלופות
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    fetchAllProducts()
      .then((data) => setProducts(data))
      .catch(() => setLoadError(true))
      .finally(() => setIsLoading(false))
  }, [])

  const total = lookTotal(look)
  const isEmpty = getLookItems(look).length === 0
  const remaining = getBudgetStatus(total, settings.budget).remaining
  const isEditing = editingName !== null

  function handleSave(e: FormEvent) {
    e.preventDefault()
    if (isEmpty) {
      setMessage('הוסיפי לפחות פריט אחד לפני השמירה')
      return
    }
    if (!name.trim()) {
      setMessage('תני ללוק שם, למשל "החתונה של רוני"')
      return
    }
    onSave(name)
    setName('')
    setSwapSlot(null)
    setMessage(isEditing ? 'updated' : 'saved')
  }

  function handleNewLook() {
    onNewLook()
    setName('')
    setSwapSlot(null)
    setMessage('')
  }

  // רשימה קטנה של מוצרים עם כפתור: משמשת גם להצעות וגם לחלופות
  function renderProductList(list: Product[], buttonText: string, emptyText: string) {
    if (isLoading) return <p className="suggest-note">טוענת הצעות…</p>
    if (loadError) return <p className="suggest-note">לא הצלחנו לטעון הצעות כרגע</p>
    if (list.length === 0) return <p className="suggest-note">{emptyText}</p>

    return list.map((product) => (
      <div key={product.id} className="suggestion">
        <Link to={`/items/${product.id}`} className="suggestion-link">
          <img src={product.thumbnail} alt="" />
          <span dir="auto">{product.title}</span>
        </Link>
        <div className="suggestion-footer">
          <strong>{formatShekels(finalPriceInShekels(product))}</strong>
          <button
            type="button"
            className="btn-add"
            onClick={() => {
              onAdd(product)
              setSwapSlot(null)
            }}
            aria-label={`${buttonText}: ${product.title}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    ))
  }

  return (
    <section className="my-look">
      <div className="page-header">
        <h1>הלוק שלי</h1>
        <p className="summary">ל{getEventLabel(settings.eventId)}</p>
      </div>

      {isEditing && (
        <div className="editing-banner">
          <span>
            עורכת את הלוק השמור: <b>{editingName}</b>
          </span>
          <button type="button" className="btn-link" onClick={handleNewLook}>
            ביטול העריכה והתחלת לוק חדש
          </button>
        </div>
      )}

      <div className="look-slots">
        {SLOTS.map((slot) => {
          const product = look[slot.id]

          // מקום ריק: מציגים הצעות שנכנסות בתקציב
          if (!product) {
            const emptyText =
              remaining > 0
                ? `אין ${slot.label} שנכנס ב-${formatShekels(remaining)} שנשארו`
                : 'התקציב נגמר. הסירי או החליפי פריט יקר'
            return (
              <div key={slot.id} className="slot slot-empty">
                <p className="slot-label">{slot.label}</p>
                <p className="suggest-title">השלימי את הלוק</p>
                {renderProductList(suggestForSlot(products, slot.id, look, settings), '+ הוסיפי', emptyText)}
                <Link to="/items" className="suggest-more">
                  לכל הקטלוג ←
                </Link>
              </div>
            )
          }

          // מקום מלא: הפריט שנבחר, עם החלפה והסרה
          const isSwapping = swapSlot === slot.id
          return (
            <div key={slot.id} className="slot">
              <p className="slot-label">{slot.label}</p>
              <Link to={`/items/${product.id}`} className="slot-product">
                <img src={product.images[0] ?? product.thumbnail} alt={product.title} />
                <span dir="auto">{product.title}</span>
              </Link>
              <div className="slot-footer">
                <strong>{formatShekels(finalPriceInShekels(product))}</strong>
                <div className="slot-actions">
                  <button type="button" className="btn-add" onClick={() => setSwapSlot(isSwapping ? null : slot.id)}>
                    {isSwapping ? 'סגירה' : 'החלפה'}
                  </button>
                  <button type="button" className="btn-link" onClick={() => onRemove(slot.id)}>
                    הסרה
                  </button>
                </div>
              </div>
              {isSwapping && (
                <div className="swap-panel">
                  <p className="suggest-title">חלופות שנכנסות בתקציב</p>
                  {renderProductList(
                    alternativesFor(products, product, look, settings),
                    'החליפי',
                    `אין ${slot.label} אחר שנכנס בתקציב`,
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <BudgetBar total={total} budget={settings.budget} />

      <form className="card save-form" onSubmit={handleSave}>
        <label htmlFor="look-name">{isEditing ? 'עדכון הלוק השמור' : 'שמירת הלוק'}</label>
        <div className="save-row">
          <input
            id="look-name"
            type="text"
            placeholder="שם ללוק, למשל: החתונה של רוני"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setMessage('')
            }}
          />
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'עדכון הלוק' : 'שמירה'}
          </button>
        </div>
        {message === 'saved' || message === 'updated' ? (
          <p className="added-message">
            {message === 'saved' ? 'הלוק נשמר' : 'הלוק עודכן'}, ואפשר להתחיל לוק חדש!{' '}
            <Link to="/saved">ללוקים השמורים ←</Link>
          </p>
        ) : (
          message && <p className="form-error">{message}</p>
        )}
      </form>
    </section>
  )
}

export default MyLookPage
