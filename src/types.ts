// כאן מגדירים את "הצורה" של המידע באפליקציה.
// TypeScript בודק שכל מקום בקוד משתמש במידע בדיוק לפי הצורה הזו.

/** מוצר אחד כמו שהוא מגיע מ-DummyJSON (רק השדות שאנחנו צריכות) */
export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number // בדולרים, כמו שמגיע מה-API
  discountPercentage: number
  rating: number
  stock: number
  brand?: string // סימן שאלה = שדה שלפעמים חסר
  thumbnail: string
  images: string[]
}

/** מה שה-API מחזיר כשמבקשים רשימה של מוצרים */
export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

/** סוגי האירועים שאפשר לבחור. רק אחד מהערכים האלה מותר. */
export type EventId = 'wedding' | 'evening' | 'work' | 'everyday'

/** אירוע: מזהה, שם בעברית, ואילו קטגוריות מתאימות לו */
export interface EventOption {
  id: EventId
  label: string
  categories: string[]
}

/** מה שהמשתמשת בחרה במסך הפתיחה */
export interface Settings {
  eventId: EventId
  budget: number // בשקלים
}

/** כל מה שאפשר לסנן לפיו בקטלוג */
export interface ProductFilters {
  eventId: EventId
  budget: number
  category: string // 'all' = כל הקטגוריות
  search: string
}
