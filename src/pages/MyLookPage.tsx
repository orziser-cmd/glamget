import { Link } from 'react-router-dom'
import BudgetBar from '../components/BudgetBar'
import type { Look, Settings, SlotId } from '../types'
import { SLOTS, finalPriceInShekels, formatShekels, getEventLabel, lookTotal } from '../utils/styleLogic'

interface MyLookPageProps {
  look: Look
  settings: Settings
  onRemove: (slot: SlotId) => void
}

// הלוק שלי: מקום לכל סוג פריט, סכום מול התקציב
function MyLookPage({ look, settings, onRemove }: MyLookPageProps) {
  const total = lookTotal(look)

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
                    <span>{product.title}</span>
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
    </section>
  )
}

export default MyLookPage
