import { Link, useNavigate } from 'react-router-dom'
import type { SavedLook } from '../types'
import { formatShekels, getBudgetStatus, getEventLabel, getLookItems, lookTotal } from '../utils/styleLogic'

interface SavedLooksPageProps {
  savedLooks: SavedLook[]
  onLoad: (saved: SavedLook) => void
  onDelete: (id: string) => void
}

// כל הלוקים ששמרתי: אפשר לפתוח שוב לעריכה או למחוק
function SavedLooksPage({ savedLooks, onLoad, onDelete }: SavedLooksPageProps) {
  const navigate = useNavigate()

  if (savedLooks.length === 0) {
    return (
      <section>
        <h1>לוקים שמורים</h1>
        <p className="empty">
          עוד לא שמרת לוקים. <Link to="/items">בואי נרכיב את הראשון ←</Link>
        </p>
      </section>
    )
  }

  return (
    <section>
      <div className="page-header">
        <h1>לוקים שמורים</h1>
        <p className="summary">{savedLooks.length} לוקים</p>
      </div>

      <div className="saved-grid">
        {savedLooks.map((saved) => {
          const items = getLookItems(saved.look)
          const status = getBudgetStatus(lookTotal(saved.look), saved.budget)
          return (
            <article key={saved.id} className="card saved-card">
              <h3>{saved.name}</h3>
              <p className="summary">
                {getEventLabel(saved.eventId)} · {new Date(saved.createdAt).toLocaleDateString('he-IL')}
              </p>
              <div className="saved-thumbs">
                {items.map((product) => (
                  <img key={product.id} src={product.thumbnail} alt={product.title} />
                ))}
              </div>
              <p className={status.isOver ? 'saved-total over' : 'saved-total'}>
                {formatShekels(status.total)} מתוך {formatShekels(saved.budget)}
              </p>
              <div className="saved-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    onLoad(saved)
                    navigate('/look')
                  }}
                >
                  פתיחה לעריכה
                </button>
                <button type="button" className="btn-link" onClick={() => onDelete(saved.id)}>
                  מחיקה
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default SavedLooksPage
