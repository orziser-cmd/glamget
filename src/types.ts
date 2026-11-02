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
