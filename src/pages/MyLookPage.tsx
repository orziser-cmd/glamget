import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import BudgetBar from '../components/BudgetBar'
import type { Look, Settings, SlotId } from '../types'
import { SLOTS, finalPriceInShekels, formatShekels, getEventLabel, getLookItems, lookTotal } from '../utils/styleLogic'

interface MyLookPageProps {
  look: Look
  settings: Settings
  onRemove: (slot: SlotId) => void
  onSave: (name: string) => void
}

// הלוק שלי: מקום לכל סוג פריט, סכום מול התקציב, ושמירה
function MyLookPage({ look, settings, onRemove, onSave }: MyLookPageProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const total = lookTotal(look)
  const isEmpty = getLookItems(look).length === 0

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
    setMessage('saved')
  }

  return (
    <section className="my-look">
      <div className="page-header">
        <h1>הלוק שלי</h1>
        <p className="summary">ל{getEventLabel(settings.eventId)}</p>
      </div>

      <div className="look-slots">
        {SLOTS.map((slot) => {
          const product = look[slot.id]
          return (
            <div key={slot.id} className={product ? 'slot' : 'slot slot-empty'}>
              <p className="slot-label">{slot.label}</p>
              {product ? (
                <>
                  <Link to={`/items/${product.id}`} className="slot-product">
                    <img src={product.thumbnail} alt={product.title} />
                    <span dir="auto">{product.title}</span>
                  </Link>
                  <div className="slot-footer">
                    <strong>{formatShekels(finalPriceInShekels(product))}</strong>
                    <button type="button" className="btn-link" onClick={() => onRemove(slot.id)}>
                      הסרה
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/items" className="slot-add">
                  + בחרי {slot.label}
                </Link>
              )}
            </div>
          )
        })}
      </div>

      <BudgetBar total={total} budget={settings.budget} />

      <form className="card save-form" onSubmit={handleSave}>
        <label htmlFor="look-name">שמירת הלוק</label>
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
            שמירה
          </button>
        </div>
        {message === 'saved' ? (
          <p className="added-message">
            הלוק נשמר! <Link to="/saved">ללוקים השמורים ←</Link>
          </p>
        ) : (
          message && <p className="form-error">{message}</p>
        )}
      </form>
    </section>
  )
}

export default MyLookPage
