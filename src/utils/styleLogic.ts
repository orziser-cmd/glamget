import type { EventId, EventOption, Product, ProductFilters } from '../types'

// "המוח" של האפליקציה: חישובים וכללים, בלי שום תצוגה.
// כל פונקציה פה מקבלת מידע ומחזירה תשובה, ולכן קל לבדוק אותה בבדיקות.

/** שער דולר-שקל קבוע (לצורך הדוגמה) */
export const USD_TO_ILS = 3.7

/** אילו קטגוריות מתאימות לכל אירוע. את הכלל הזה קבענו בעצמנו, ה-API לא יודע מה זה "חתונה". */
export const EVENTS: EventOption[] = [
  {
    id: 'wedding',
    label: 'חתונה',
    categories: ['womens-dresses', 'womens-shoes', 'womens-bags', 'womens-jewellery'],
  },
  {
    id: 'evening',
    label: 'ערב בחוץ',
    categories: ['womens-dresses', 'tops', 'womens-shoes', 'womens-bags', 'womens-jewellery', 'womens-watches'],
  },
  {
    id: 'work',
    label: 'עבודה',
    categories: ['tops', 'womens-shoes', 'womens-bags', 'womens-watches'],
  },
  {
    id: 'everyday',
    label: 'יום-יום',
    categories: ['tops', 'womens-shoes', 'womens-bags', 'sunglasses', 'womens-watches'],
  },
]

/** שמות בעברית לקטגוריות של ה-API */
export const CATEGORY_LABELS: Record<string, string> = {
  'womens-dresses': 'שמלות',
  tops: 'חולצות',
  'womens-shoes': 'נעליים',
  'womens-bags': 'תיקים',
  'womens-jewellery': 'תכשיטים',
  'womens-watches': 'שעונים',
  sunglasses: 'משקפי שמש',
}

/** ממיר מחיר מדולרים לשקלים, מעוגל לשקל שלם */
export function toShekels(usd: number): number {
  return Math.round(usd * USD_TO_ILS)
}

/** מציג מספר כמחיר בשקלים, למשל 1200 → "1,200 ₪" */
export function formatShekels(amount: number): string {
  return `${amount.toLocaleString('en-US')} ₪`
}

/** מחיר אחרי הנחה. למשל 100 עם 20% הנחה = 80 */
export function priceAfterDiscount(price: number, discountPercentage: number): number {
  return price * (1 - discountPercentage / 100)
}

/** המחיר הסופי של מוצר בשקלים, אחרי הנחה */
export function finalPriceInShekels(product: Product): number {
  return toShekels(priceAfterDiscount(product.price, product.discountPercentage))
}

/** מחזיר את הקטגוריות שמתאימות לאירוע */
export function getCategoriesForEvent(eventId: EventId): string[] {
  const event = EVENTS.find((e) => e.id === eventId)
  return event ? event.categories : []
}

/** מחזיר את השם בעברית של אירוע */
export function getEventLabel(eventId: EventId): string {
  const event = EVENTS.find((e) => e.id === eventId)
  return event ? event.label : ''
}

/**
 * הסינון של הקטלוג. מוצר נשאר ברשימה רק אם:
 * 1. הקטגוריה שלו מתאימה לאירוע
 * 2. הוא מהקטגוריה שנבחרה (או שנבחר "הכול")
 * 3. המחיר הסופי שלו בשקלים לא עובר את התקציב
 * 4. השם שלו כולל את מילת החיפוש (בלי הבדל בין אותיות גדולות לקטנות)
 */
export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const eventCategories = getCategoriesForEvent(filters.eventId)
  const search = filters.search.trim().toLowerCase()

  return products.filter((product) => {
    const fitsEvent = eventCategories.includes(product.category)
    const fitsCategory = filters.category === 'all' || product.category === filters.category
    const fitsBudget = finalPriceInShekels(product) <= filters.budget
    const fitsSearch = product.title.toLowerCase().includes(search)
    return fitsEvent && fitsCategory && fitsBudget && fitsSearch
  })
}
