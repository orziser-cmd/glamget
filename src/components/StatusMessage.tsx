interface StatusMessageProps {
  type: 'loading' | 'error'
  message?: string
}

// הודעה אחת לשני מצבים: "טוען..." או "משהו השתבש"
function StatusMessage({ type, message }: StatusMessageProps) {
  if (type === 'loading') {
    return (
      <div className="status" role="status">
        <span className="spinner" aria-hidden="true" />
        <p>טוענת את הפריטים…</p>
      </div>
    )
  }

  return (
    <div className="status status-error" role="alert">
      <p>אופס, משהו השתבש בטעינה.</p>
      {message && <p className="status-detail">{message}</p>}
      <p className="status-detail">בדקי את החיבור לאינטרנט ונסי לרענן את הדף.</p>
    </div>
  )
}

export default StatusMessage
