import { formatShekels, getBudgetStatus } from '../utils/styleLogic'

interface BudgetBarProps {
  total: number
  budget: number
}

// פס שמראה כמה מהתקציב כבר "תפוס": ירוק כשבסדר, אדום כשחורגים
function BudgetBar({ total, budget }: BudgetBarProps) {
  const status = getBudgetStatus(total, budget)
  // הפס לא יכול להיות רחב מ-100%, גם אם חרגנו
  const width = Math.min(status.percentUsed, 100)

  return (
    <div className={status.isOver ? 'budget budget-over' : 'budget'}>
      <div className="budget-numbers">
        <span>סה״כ</span>
        <strong>
          {formatShekels(status.total)} מתוך {formatShekels(budget)}
        </strong>
      </div>
      <div className="budget-track" aria-hidden="true">
        <div className="budget-fill" style={{ width: `${width}%` }} />
      </div>
      <p className="budget-message">
        {status.isOver
          ? `חרגת מהתקציב ב-${formatShekels(-status.remaining)}`
          : `נשארו לך ${formatShekels(status.remaining)}`}
      </p>
    </div>
  )
}

export default BudgetBar
