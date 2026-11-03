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

/** "המקומות" בלוק: בגד, נעליים, תיק, אקססורי. בכל מקום יש פריט אחד לכל היותר. */
export type SlotId = 'outfit' | 'shoes' | 'bag' | 'accessory'

/** מקום בלוק: מזהה, שם בעברית, ואילו קטגוריות נכנסות אליו */
export interface SlotOption {
  id: SlotId
  label: string
  categories: string[]
}

/** הלוק: לכל מקום יש מוצר, או שהוא ריק (לכן Partial = לא חובה שיהיו כולם) */
export type Look = Partial<Record<SlotId, Product>>

/** סיכום של הלוק מול התקציב */
export interface BudgetStatus {
  total: number
  remaining: number
  percentUsed: number
  isOver: boolean
}

/** לוק ששמרתי, עם שם ותאריך */
export interface SavedLook {
  id: string
  name: string
  eventId: EventId
  budget: number
  look: Look
  createdAt: string // תאריך בפורמט טקסט, כדי שאפשר יהיה לשמור אותו ב-localStorage
}

/** אפשרויות המיון בקטלוג */
export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'discount'

/** כל מה שאפשר לסנן לפיו בקטלוג */
export interface ProductFilters {
  eventId: EventId
  budget: number
  category: string // 'all' = כל הקטגוריות
  search: string
}
