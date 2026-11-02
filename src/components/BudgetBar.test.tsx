import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import BudgetBar from './BudgetBar'

// בדיקות לרכיב: "מציירים" אותו בזיכרון ובודקים מה כתוב על המסך

describe('BudgetBar', () => {
  it('מראה כמה נשאר כשהלוק בתוך התקציב', () => {
    render(<BudgetBar total={300} budget={1000} />)
    expect(screen.getByText('נשארו לך 700 ₪')).toBeInTheDocument()
  })

  it('מראה אזהרה כשהלוק עובר את התקציב', () => {
    render(<BudgetBar total={1250} budget={1000} />)
    expect(screen.getByText('חרגת מהתקציב ב-250 ₪')).toBeInTheDocument()
  })
})
