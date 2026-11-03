import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { EventId, Settings } from '../types'
import { EVENTS, formatShekels } from '../utils/styleLogic'

interface HomePageProps {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

// מסך הפתיחה: בוחרים אירוע ותקציב, ועוברים לקטלוג
function HomePage({ settings, onSettingsChange }: HomePageProps) {
  // הבחירות נשמרות כאן רק עד שלוחצים על הכפתור
  const [eventId, setEventId] = useState<EventId>(settings.eventId)
  const [budget, setBudget] = useState<number>(settings.budget)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function changeBudget(value: number) {
    setBudget(value)
    setError('')
  }

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
        <p className="eyebrow">GLAM ON A BUDGET</p>
        <h1>
          הלוק המושלם.
          <br />
          בתקציב שלך.
        </h1>
        <p className="hero-text">
          בחרי לאיזה אירוע את מתלבשת וכמה את רוצה להוציא. Glamget תראה לך רק פריטים שמתאימים, ותחשב בשבילך כמה עולה
          הלוק.
        </p>
      </div>

      <form className="setup-form" onSubmit={handleSubmit}>
        <h2 className="step-title">
          <span>01</span> לאיזה אירוע?
        </h2>
        <div className="event-grid">
          {EVENTS.map((event) => (
            <button
              type="button"
              key={event.id}
              className={`event-tile event-${event.id}${event.id === eventId ? ' event-active' : ''}`}
              onClick={() => setEventId(event.id)}
              aria-pressed={event.id === eventId}
            >
              <span className="event-name">{event.label}</span>
              <span className="event-check" aria-hidden="true">
                ✓
              </span>
            </button>
          ))}
        </div>

        <h2 className="step-title">
          <span>02</span> מה התקציב?
        </h2>
        <div className="budget-picker">
          <p className="budget-value">{formatShekels(budget || 0)}</p>
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
          <label className="budget-exact">
            או סכום מדויק:
            <input
              type="number"
              min={1}
              value={budget || ''}
              onChange={(e) => changeBudget(Number(e.target.value))}
              aria-label="תקציב בשקלים"
            />
          </label>
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
