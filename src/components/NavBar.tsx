import { NavLink } from 'react-router-dom'

interface NavBarProps {
  lookCount: number
}

// תפריט הניווט בראש כל עמוד.
// NavLink הוא כמו קישור רגיל, אבל הוא יודע לסמן את העמוד שאנחנו נמצאות בו.
function NavBar({ lookCount }: NavBarProps) {
  return (
    <header className="navbar">
      <NavLink to="/" className="logo">
        Glamget
      </NavLink>
      <nav>
        <NavLink to="/" end>
          בית
        </NavLink>
        <NavLink to="/items">קטלוג</NavLink>
        <NavLink to="/look">
          הלוק שלי {lookCount > 0 && <span className="count">{lookCount}</span>}
        </NavLink>
      </nav>
    </header>
  )
}

export default NavBar
