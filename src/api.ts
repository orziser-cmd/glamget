import type { Product, ProductsResponse } from './types'

// הכתובת של "המחסן" באינטרנט
const BASE_URL = 'https://dummyjson.com/products'

/** מביא את כל המוצרים מהחנות. limit=0 אומר "בלי הגבלה, תביאי הכול". */
export async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}?limit=0`)
  // response.ok אומר שהשרת ענה "הכול בסדר". אחרת זורקים שגיאה.
  if (!response.ok) {
    throw new Error(`השרת החזיר שגיאה (${response.status})`)
  }
  const data: ProductsResponse = await response.json()
  return data.products
}

/** מביא מוצר אחד לפי המספר שלו */
export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/${id}`)
  if (!response.ok) {
    throw new Error(`המוצר לא נמצא (${response.status})`)
  }
  const data: Product = await response.json()
  return data
}
