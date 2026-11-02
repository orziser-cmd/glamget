import { Link } from 'react-router-dom'

// עמוד שמופיע כשנכנסים לכתובת שלא קיימת באפליקציה
function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="big-number">404</p>
      <h1>העמוד הזה לא בארון</h1>
      <p>חיפשנו בכל המדפים ולא מצאנו את הכתובת הזו.</p>
      <Link to="/" className="btn btn-primary">
        חזרה לדף הבית
      </Link>
    </section>
  )
}

export default NotFoundPage
