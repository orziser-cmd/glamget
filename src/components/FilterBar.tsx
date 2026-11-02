import { CATEGORY_LABELS } from '../utils/styleLogic'

interface FilterBarProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  search: string
  onSearchChange: (search: string) => void
}

// שורת החיפוש והכפתורים לסינון לפי סוג פריט.
// הרכיב לא "זוכר" כלום בעצמו: הוא מקבל הכול ב-props ומדווח על שינויים דרך הפונקציות.
function FilterBar({ categories, selectedCategory, onCategoryChange, search, onSearchChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <input
        type="search"
        placeholder="חיפוש לפי שם, למשל dress"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="חיפוש פריטים"
      />
      <div className="chips">
        <button
          type="button"
          className={selectedCategory === 'all' ? 'chip chip-active' : 'chip'}
          onClick={() => onCategoryChange('all')}
        >
          הכול
        </button>
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={selectedCategory === category ? 'chip chip-active' : 'chip'}
            onClick={() => onCategoryChange(category)}
          >
            {CATEGORY_LABELS[category] ?? category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterBar
