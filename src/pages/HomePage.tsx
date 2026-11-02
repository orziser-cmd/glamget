import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { EventId, Settings } from '../types'
import { EVENTS } from '../utils/styleLogic'

interface HomePageProps {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

const QUICK_BUDGETS = [300, 500, 1000, 2000]

// מסך הפתיחה: בוחרים אירוע ותקציב, ועוברים לקטלוג
function HomePage({ settings, onSettingsChange }: HomePageProps) {
  // הבחירות נשמרות כאן רק עד שלוחצים "בואי נתחיל"
  const [eventId, setEventId] = useState<EventId>(settings.eventId)
  const [budget, setBudget] = useState<number>(settings.budget)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent) {
    e.preventDefault() // מונע מהדפדפן לרענן את הדף
    if (!budget || budget <= 0) {
      setError('הקלידי תקציב גדול מ-0')
      return
    }
    onSettingsChange({ eventId, budget })
    navigate('/items') // מעבר לעמוד הקטלוג
  }

  return (
    <section className="home">
      <div className="hero">
        <p className="eyebrow">glam on a budget</p>
        <h1>הלוק המושלם, בתקציב שלך</h1>
        <p className="hero-text">
          בחרי לאיזה אירוע את מתלבשת וכמה את רוצה להוציא. Glamget תראה לך רק פריטים שמתאימים, ותחשב בשבילך כמה עולה
          הלוק.
        </p>
      </div>

      <form className="card setup-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>לאיזה אירוע?</legend>
          <div className="chips">
            {EVENTS.map((event) => (
              <button
                type="button"
                key={event.id}
                className={event.id === eventId ? 'chip chip-active' : 'chip'}
                onClick={() => setEventId(event.id)}
              >
                {event.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>מה התקציב? (בשקלים)</legend>
          <input
            type="number"
            min={1}
            value={budget || ''}
            onChange={(e) => {
              setBudget(Number(e.target.value))
              setError('')
            }}
            aria-label="תקציב בשקלים"
          />
          <div className="chips">
            {QUICK_BUDGETS.map((amount) => (
              <button type="button" key={amount} className="chip chip-small" onClick={() => setBudget(amount)}>
                {amount} ₪
              </button>
            ))}
          </div>
          {error && <p className="form-error">{error}</p>}
        </fieldset>

        <button type="submit" className="btn btn-primary">
          בואי נתחיל
        </button>
      </form>
    </section>
  )
}

export default HomePage
