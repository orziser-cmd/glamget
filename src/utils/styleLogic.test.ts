import { describe, expect, it } from 'vitest'
import { sampleProducts } from '../data/sampleProducts'
import type { ProductFilters } from '../types'
import {
  filterProducts,
  finalPriceInShekels,
  getCategoriesForEvent,
  priceAfterDiscount,
  toShekels,
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
