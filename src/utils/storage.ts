// localStorage = "מגירה" קטנה בדפדפן ששומרת מידע גם אחרי שסוגרים את האתר.
// היא יודעת לשמור רק טקסט, לכן הופכים את המידע לטקסט (JSON.stringify) ובחזרה (JSON.parse).

/** קורא מידע שמור. אם אין, או שמשהו השתבש, מחזיר את ערך ברירת המחדל. */
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const text = localStorage.getItem(key)
    return text ? (JSON.parse(text) as T) : fallback
  } catch {
    return fallback
  }
}

/** שומר מידע במגירה */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // אם הדפדפן חוסם שמירה (למשל במצב פרטי), פשוט ממשיכים בלי לשמור
  }
}
