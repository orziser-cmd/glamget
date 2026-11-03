import { NavLink } from 'react-router-dom'

interface NavBarProps {
  lookCount: number
  savedCount: number
}

// הכותרת העליונה של האתר: פס הודעה, ומתחתיו ניווט משני הצדדים והלוגו באמצע.
// NavLink הוא כמו קישור רגיל, אבל הוא יודע לסמן את העמוד שאנחנו נמצאות בו.
function NavBar({ lookCount, savedCount }: NavBarProps) {
  return (
    <header className="site-header">
      <p className="announcement">GLAM ON A BUDGET · לוק שלם לכל אירוע, בלי לחרוג מהתקציב</p>
      <div className="navbar">
        <nav>
          <NavLink to="/" end>
            בית
          </NavLink>
          <NavLink to="/items">קטלוג</NavLink>
        </nav>
        <NavLink to="/" className="logo">
          GLAMGET
        </NavLink>
        <nav className="nav-side">
          <NavLink to="/look">
            הלוק שלי {lookCount > 0 && <span className="count">{lookCount}</span>}
          </NavLink>
          <NavLink to="/saved">
            שמורים {savedCount > 0 && <span className="count">{savedCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default NavBar
