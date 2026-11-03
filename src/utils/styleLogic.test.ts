import { describe, expect, it } from 'vitest'
import { sampleProducts } from '../data/sampleProducts'
import type { Look, ProductFilters } from '../types'
import {
  addToLook,
  alternativesFor,
  createSavedLook,
  filterProducts,
  finalPriceInShekels,
  firstSentence,
  getBudgetStatus,
  getCategoriesForEvent,
  getLookItems,
  getSlotForCategory,
  lookTotal,
  priceAfterDiscount,
  removeFromLook,
  replaceSavedLook,
  sortProducts,
  suggestForSlot,
  toShekels,
  totalIfAdded,
  updateSavedLook,
} from './styleLogic'

// כל בדיקה = "אני מצפה שאם אתן לפונקציה X, אקבל Y"

describe('המרת מחירים', () => {
  it('ממירה דולרים לשקלים ומעגלת לשקל שלם', () => {
    expect(toShekels(10)).toBe(37)
    expect(toShekels(49.99)).toBe(185) // 184.963 מתעגל ל-185
  })

  it('מחשבת מחיר אחרי הנחה', () => {
    expect(priceAfterDiscount(100, 20)).toBe(80)
    expect(priceAfterDiscount(50, 0)).toBe(50)
  })

  it('מחשבת מחיר סופי בשקלים: קודם הנחה ואז המרה', () => {
    // נעליים זהובות: 39.99 דולר עם 20% הנחה = 31.992 דולר = 118 ₪
    const goldenShoes = sampleProducts.find((p) => p.id === 3)!
    expect(finalPriceInShekels(goldenShoes)).toBe(118)
  })
})

describe('אירועים', () => {
  it('לחתונה מתאימות שמלות ולא משקפי שמש', () => {
    const categories = getCategoriesForEvent('wedding')
    expect(categories).toContain('womens-dresses')
    expect(categories).not.toContain('sunglasses')
  })
})

describe('סינון הקטלוג', () => {
  const baseFilters: ProductFilters = {
    eventId: 'everyday',
    budget: 10000,
    category: 'all',
    search: '',
  }

  it('מוציאה מוצרים שלא קשורים לאופנה (כמו טלפון)', () => {
    const result = filterProducts(sampleProducts, baseFilters)
    expect(result.some((p) => p.category === 'smartphones')).toBe(false)
  })

  it('מציגה רק קטגוריות שמתאימות לאירוע', () => {
    const result = filterProducts(sampleProducts, { ...baseFilters, eventId: 'wedding' })
    const allowed = getCategoriesForEvent('wedding')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((p) => allowed.includes(p.category))).toBe(true)
  })

  it('מסירה מוצרים שעוברים את התקציב', () => {
    const result = filterProducts(sampleProducts, { ...baseFilters, eventId: 'wedding', budget: 100 })
    expect(result.every((p) => finalPriceInShekels(p) <= 100)).toBe(true)
    // השמלה השחורה עולה יותר מ-100 ₪, ולכן לא אמורה להופיע
    expect(result.find((p) => p.id === 1)).toBeUndefined()
  })

  it('מחפשת לפי שם בלי הבדל בין אותיות גדולות לקטנות', () => {
    const result = filterProducts(sampleProducts, { ...baseFilters, search: '  SHOES ' })
    expect(result.map((p) => p.id)).toEqual([3, 4])
  })

  it('מסננת לפי קטגוריה שנבחרה', () => {
    const result = filterProducts(sampleProducts, { ...baseFilters, category: 'womens-bags' })
    expect(result.map((p) => p.id)).toEqual([5])
  })
})

describe('הלוק', () => {
  // עוזר קטן: מוצא מוצר לדוגמה לפי המספר שלו
  const byId = (id: number) => sampleProducts.find((p) => p.id === id)!

  it('יודעת לאיזה מקום בלוק שייך כל סוג פריט', () => {
    expect(getSlotForCategory('womens-dresses')).toBe('outfit')
    expect(getSlotForCategory('sunglasses')).toBe('accessory')
    expect(getSlotForCategory('smartphones')).toBeNull()
  })

  it('פריט חדש מאותו סוג מחליף את הישן', () => {
    let look: Look = {}
    look = addToLook(look, byId(3)) // נעליים זהובות
    look = addToLook(look, byId(4)) // נעליים אדומות
    expect(look.shoes?.id).toBe(4)
    expect(getLookItems(look)).toHaveLength(1)
  })

  it('לא משנה את הלוק הישן אלא מחזירה לוק חדש', () => {
    const empty: Look = {}
    const withDress = addToLook(empty, byId(2))
    expect(getLookItems(empty)).toHaveLength(0)
    expect(getLookItems(withDress)).toHaveLength(1)
  })

  it('מוציאה פריט מהלוק', () => {
    const look = addToLook(addToLook({}, byId(2)), byId(5))
    const after = removeFromLook(look, 'outfit')
    expect(after.outfit).toBeUndefined()
    expect(after.bag?.id).toBe(5)
  })

  it('מחברת את המחירים של כל הלוק', () => {
    // שמלה (185) + נעליים אדומות (93) = 278
    const look = addToLook(addToLook({}, byId(2)), byId(4))
    expect(lookTotal(look)).toBe(278)
  })

  it('מחשבת כמה יעלה הלוק אם אוסיף פריט', () => {
    const look = addToLook({}, byId(4)) // נעליים אדומות: 93
    expect(totalIfAdded(look, byId(2))).toBe(278) // + שמלה
    expect(totalIfAdded(look, byId(3))).toBe(118) // נעליים זהובות מחליפות את האדומות
  })
})

describe('תקציב', () => {
  it('מחשבת כמה נשאר ובאיזה אחוז', () => {
    expect(getBudgetStatus(250, 1000)).toEqual({ total: 250, remaining: 750, percentUsed: 25, isOver: false })
  })

  it('מזהה חריגה מהתקציב', () => {
    const status = getBudgetStatus(1200, 1000)
    expect(status.isOver).toBe(true)
    expect(status.remaining).toBe(-200)
  })
})

describe('לוקים שמורים', () => {
  it('יוצרת לוק שמור עם שם נקי, האירוע, התקציב והתאריך', () => {
    const look = addToLook({}, sampleProducts[1])
    const date = new Date('2026-11-05T10:00:00.000Z')
    const saved = createSavedLook('  החתונה של רוני ', look, { eventId: 'wedding', budget: 800 }, date)
    expect(saved.name).toBe('החתונה של רוני')
    expect(saved.eventId).toBe('wedding')
    expect(saved.budget).toBe(800)
    expect(saved.createdAt).toBe('2026-11-05T10:00:00.000Z')
    expect(lookTotal(saved.look)).toBe(185)
  })
})

describe('מיון', () => {
  it('ממיינת מהזול ליקר לפי המחיר הסופי בשקלים', () => {
    const prices = sortProducts(sampleProducts, 'price-asc').map(finalPriceInShekels)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  it('ממיינת מהיקר לזול', () => {
    const sorted = sortProducts(sampleProducts, 'price-desc')
    expect(sorted[0].id).toBe(9) // הטלפון הוא היקר ביותר ברשימה לדוגמה
  })

  it('לא משנה את הרשימה המקורית', () => {
    const before = sampleProducts.map((p) => p.id)
    sortProducts(sampleProducts, 'price-desc')
    expect(sampleProducts.map((p) => p.id)).toEqual(before)
  })
})

describe('השלימי את הלוק', () => {
  const byId = (id: number) => sampleProducts.find((p) => p.id === id)!

  it('מציעה רק פריטים מהסוג החסר, מהזול ליקר', () => {
    const suggestions = suggestForSlot(sampleProducts, 'shoes', {}, { eventId: 'wedding', budget: 1000 })
    expect(suggestions.map((p) => p.id)).toEqual([4, 3]) // אדומות (93) ואז זהובות (118)
  })

  it('מציעה רק מה שנכנס בתקציב שנשאר', () => {
    // שמלה ב-185 ₪ ותקציב 300 ₪: נשארו 115 ₪, ולכן רק הנעליים האדומות (93) נכנסות
    const look = addToLook({}, byId(2))
    const suggestions = suggestForSlot(sampleProducts, 'shoes', look, { eventId: 'wedding', budget: 300 })
    expect(suggestions.map((p) => p.id)).toEqual([4])
  })

  it('לא מציעה פריטים שלא מתאימים לאירוע', () => {
    // משקפי שמש לא מתאימים לחתונה
    const suggestions = suggestForSlot(sampleProducts, 'accessory', {}, { eventId: 'wedding', budget: 1000 })
    expect(suggestions.some((p) => p.category === 'sunglasses')).toBe(false)
  })

  it('מחזירה לכל היותר את מספר ההצעות שביקשו', () => {
    const suggestions = suggestForSlot(sampleProducts, 'outfit', {}, { eventId: 'evening', budget: 5000 }, 1)
    expect(suggestions).toHaveLength(1)
  })
})

describe('עריכת לוק שמור', () => {
  const byId = (id: number) => sampleProducts.find((p) => p.id === id)!
  const original = createSavedLook('חתונה', addToLook({}, byId(2)), { eventId: 'wedding', budget: 800 }, new Date('2026-11-01T10:00:00.000Z'))

  it('מעדכנת את הלוק ושומרת על אותו מזהה ותאריך', () => {
    const newLook = addToLook(original.look, byId(4))
    const updated = updateSavedLook(original, 'חתונה', newLook, { eventId: 'wedding', budget: 900 })
    expect(updated.id).toBe(original.id)
    expect(updated.createdAt).toBe(original.createdAt)
    expect(updated.budget).toBe(900)
    expect(getLookItems(updated.look)).toHaveLength(2)
  })

  it('משאירה את השם הישן אם השם החדש ריק', () => {
    const updated = updateSavedLook(original, '   ', original.look, { eventId: 'wedding', budget: 800 })
    expect(updated.name).toBe('חתונה')
  })

  it('מחליפה ברשימה רק את הלוק עם אותו מזהה, בלי ליצור כפילות', () => {
    const other = { ...original, id: 'other', name: 'אחר' }
    const updated = { ...original, name: 'חתונה מעודכנת' }
    const result = replaceSavedLook([original, other], updated)
    expect(result).toHaveLength(2)
    expect(result.map((s) => s.name)).toEqual(['חתונה מעודכנת', 'אחר'])
  })
})

describe('חלופות לפריט בלוק', () => {
  const byId = (id: number) => sampleProducts.find((p) => p.id === id)!

  it('מציעה פריטים מאותו סוג, בלי הפריט הנוכחי', () => {
    const look = addToLook({}, byId(4)) // נעליים אדומות
    const alternatives = alternativesFor(sampleProducts, byId(4), look, { eventId: 'wedding', budget: 1000 })
    expect(alternatives.map((p) => p.id)).toEqual([3]) // רק הזהובות
  })

  it('לוקחת בחשבון שהפריט הישן יוצא מהלוק', () => {
    // תקציב 120: אדומות (93) בלוק. זהובות (118) מחליפות אותן ולכן נכנסות בתקציב
    const look = addToLook({}, byId(4))
    const alternatives = alternativesFor(sampleProducts, byId(4), look, { eventId: 'wedding', budget: 120 })
    expect(alternatives.map((p) => p.id)).toEqual([3])
  })
})

describe('תיאור קצר', () => {
  it('מחזירה רק את המשפט הראשון', () => {
    expect(firstSentence('A classic black bag. It goes with everything. Buy now!')).toBe('A classic black bag.')
  })

  it('מחזירה את כל הטקסט אם יש בו משפט אחד בלי נקודה', () => {
    expect(firstSentence('  Simple and elegant  ')).toBe('Simple and elegant')
  })
})
