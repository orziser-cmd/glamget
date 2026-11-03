import type { SortOption } from '../types'
import { CATEGORY_LABELS, SORT_OPTIONS } from '../utils/styleLogic'

interface FilterBarProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  search: string
  onSearchChange: (search: string) => void
  sort: SortOption
  onSortChange: (sort: SortOption) => void
}

// שורת החיפוש, הכפתורים לסינון לפי סוג פריט, והמיון.
// הרכיב לא "זוכר" כלום בעצמו: הוא מקבל הכול ב-props ומדווח על שינויים דרך הפונקציות.
function FilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
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
      <div className="filter-tools">
        <input
          type="search"
          placeholder="חיפוש לפי שם, למשל dress"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="חיפוש פריטים"
        />
        <select value={sort} onChange={(e) => onSortChange(e.target.value as SortOption)} aria-label="מיון">
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FilterBar
