import type {
  BudgetStatus,
  EventId,
  EventOption,
  Look,
  Product,
  ProductFilters,
  SavedLook,
  Settings,
  SlotId,
  SlotOption,
  SortOption,
} from '../types'

// "המוח" של האפליקציה: חישובים וכללים, בלי שום תצוגה.
// כל פונקציה פה מקבלת מידע ומחזירה תשובה, ולכן קל לבדוק אותה בבדיקות.

/** שער דולר-שקל קבוע (לצורך הדוגמה) */
export const USD_TO_ILS = 3.7

/** אילו קטגוריות מתאימות לכל אירוע. את הכלל הזה קבענו בעצמנו, ה-API לא יודע מה זה "חתונה". */
export const EVENTS: EventOption[] = [
  {
    id: 'wedding',
    label: 'חתונה',
    categories: ['womens-dresses','tops','womens-shoes', 'womens-bags', 'womens-jewellery'],
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
  tops: 'שמלות קיץ',
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

// ---------- הלוק ----------

/** המקומות בלוק, ואילו קטגוריות נכנסות לכל מקום */
export const SLOTS: SlotOption[] = [
  { id: 'outfit', label: 'בגד', categories: ['womens-dresses', 'tops'] },
  { id: 'shoes', label: 'נעליים', categories: ['womens-shoes'] },
  { id: 'bag', label: 'תיק', categories: ['womens-bags'] },
  { id: 'accessory', label: 'אקססורי', categories: ['womens-jewellery', 'womens-watches', 'sunglasses'] },
]

/** לאיזה מקום בלוק שייך מוצר מקטגוריה מסוימת */
export function getSlotForCategory(category: string): SlotId | null {
  const slot = SLOTS.find((s) => s.categories.includes(category))
  return slot ? slot.id : null
}

/**
 * מוסיף מוצר ללוק. אם כבר יש מוצר באותו מקום (למשל נעליים), החדש מחליף את הישן.
 * הפונקציה לא משנה את הלוק הישן, אלא מחזירה לוק חדש (כך React יודע שמשהו השתנה).
 */
export function addToLook(look: Look, product: Product): Look {
  const slot = getSlotForCategory(product.category)
  if (!slot) return look
  return { ...look, [slot]: product }
}

/** מוציא מהלוק את המוצר שנמצא במקום מסוים */
export function removeFromLook(look: Look, slot: SlotId): Look {
  const newLook = { ...look }
  delete newLook[slot]
  return newLook
}

/** כל המוצרים שבלוק, כרשימה רגילה */
export function getLookItems(look: Look): Product[] {
  return SLOTS.map((slot) => look[slot.id]).filter((product): product is Product => product !== undefined)
}

/** כמה עולה כל הלוק, בשקלים */
export function lookTotal(look: Look): number {
  return getLookItems(look).reduce((sum, product) => sum + finalPriceInShekels(product), 0)
}

/** סיכום מול התקציב: כמה הוצאתי, כמה נשאר, באיזה אחוז, והאם חרגתי */
export function getBudgetStatus(total: number, budget: number): BudgetStatus {
  const percentUsed = budget > 0 ? Math.round((total / budget) * 100) : 0
  return {
    total,
    remaining: budget - total,
    percentUsed,
    isOver: total > budget,
  }
}

/** כמה יעלה הלוק אם אוסיף את המוצר הזה (כולל החלפה של מוצר באותו מקום) */
export function totalIfAdded(look: Look, product: Product): number {
  return lookTotal(addToLook(look, product))
}

// ---------- לוקים שמורים ----------

/** יוצר לוק שמור מהלוק הנוכחי. השם מנוקה מרווחים, והמזהה נוצר מהזמן. */
export function createSavedLook(name: string, look: Look, settings: Settings, now: Date = new Date()): SavedLook {
  return {
    id: String(now.getTime()),
    name: name.trim(),
    eventId: settings.eventId,
    budget: settings.budget,
    look,
    createdAt: now.toISOString(),
  }
}

/** מעדכן לוק שמור קיים: אותו מזהה ואותו תאריך יצירה, עם הלוק, השם והבחירות החדשים */
export function updateSavedLook(saved: SavedLook, name: string, look: Look, settings: Settings): SavedLook {
  return {
    ...saved,
    name: name.trim() || saved.name,
    eventId: settings.eventId,
    budget: settings.budget,
    look,
  }
}

/** מחליף לוק שמור ברשימה לפי המזהה שלו, ומשאיר את כל השאר כמו שהם */
export function replaceSavedLook(list: SavedLook[], updated: SavedLook): SavedLook[] {
  return list.map((saved) => (saved.id === updated.id ? updated : saved))
}

// ---------- מיון ----------

/** אפשרויות המיון, עם שם בעברית */
export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'recommended', label: 'מומלץ' },
  { id: 'price-asc', label: 'מחיר: מהזול ליקר' },
  { id: 'price-desc', label: 'מחיר: מהיקר לזול' },
  { id: 'discount', label: 'ההנחה הגדולה ביותר' },
]

/**
 * ממיין מוצרים. מחזיר רשימה חדשה ולא משנה את המקורית.
 * 'recommended' = הסדר שבו המוצרים הגיעו מה-API.
 */
export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const copy = [...products]
  if (sort === 'price-asc') copy.sort((a, b) => finalPriceInShekels(a) - finalPriceInShekels(b))
  if (sort === 'price-desc') copy.sort((a, b) => finalPriceInShekels(b) - finalPriceInShekels(a))
  if (sort === 'discount') copy.sort((a, b) => b.discountPercentage - a.discountPercentage)
  return copy
}

// ---------- השלימי את הלוק ----------

/**
 * מציעה פריטים למקום ריק בלוק. פריט מוצע רק אם:
 * 1. הוא שייך למקום הזה (למשל נעליים)
 * 2. הוא מתאים לאירוע
 * 3. הלוק, אחרי שמוסיפים אותו, לא עובר את התקציב
 * ההצעות ממוינות מהזולה ליקרה, וחוזרות רק כמה (limit).
 */
export function suggestForSlot(
  products: Product[],
  slot: SlotId,
  look: Look,
  settings: Settings,
  limit = 3,
): Product[] {
  const eventCategories = getCategoriesForEvent(settings.eventId)
  const fitting = products.filter(
    (product) =>
      getSlotForCategory(product.category) === slot &&
      eventCategories.includes(product.category) &&
      totalIfAdded(look, product) <= settings.budget,
  )
  return sortProducts(fitting, 'price-asc').slice(0, limit)
}

/** חלופות לפריט שכבר בלוק: אותו סוג, מתאימות לאירוע ולתקציב (אחרי ההחלפה), בלי הפריט הנוכחי */
export function alternativesFor(products: Product[], current: Product, look: Look, settings: Settings, limit = 3): Product[] {
  const slot = getSlotForCategory(current.category)
  if (!slot) return []
  const others = products.filter((product) => product.id !== current.id)
  return suggestForSlot(others, slot, look, settings, limit)
}
