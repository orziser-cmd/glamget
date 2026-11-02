import { NavLink } from 'react-router-dom'

// תפריט הניווט בראש כל עמוד.
// NavLink הוא כמו קישור רגיל, אבל הוא יודע לסמן את העמוד שאנחנו נמצאות בו.
function NavBar() {
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
      </nav>
    </header>
  )
}

export default NavBar
