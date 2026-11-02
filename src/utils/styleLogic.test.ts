import { describe, expect, it } from 'vitest'
import { sampleProducts } from '../data/sampleProducts'
import type { Look, ProductFilters } from '../types'
import {
  addToLook,
  filterProducts,
  finalPriceInShekels,
  getBudgetStatus,
  getCategoriesForEvent,
  getLookItems,
  getSlotForCategory,
  lookTotal,
  priceAfterDiscount,
  removeFromLook,
  toShekels,
  totalIfAdded,
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
