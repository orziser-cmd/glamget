import type { EventId } from '../types'

interface EventIconProps {
  eventId: EventId
}

// איור קו קטן לכל אירוע. ה-SVG משתמש בצבע של הטקסט (currentColor),
// ולכן כשהכרטיס נבחר והטקסט הופך ללבן, גם האיור הופך ללבן.
function EventIcon({ eventId }: EventIconProps) {
  return (
    <svg
      className="event-icon"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {eventId === 'wedding' && (
        // שתי טבעות, ויהלום על אחת מהן
        <>
          <circle cx="25" cy="38" r="12" />
          <circle cx="39" cy="38" r="12" />
          <path d="M21 21 L25 16 L29 21 L25 26 Z" />
        </>
      )}
      {eventId === 'evening' && (
        // כוס קוקטייל וכוכב נוצץ
        <>
          <path d="M14 18 H40 L27 33 Z" />
          <path d="M27 33 V48" />
          <path d="M20 48 H34" />
          <path d="M48 12 L50 18 L56 20 L50 22 L48 28 L46 22 L40 20 L46 18 Z" />
        </>
      )}
      {eventId === 'work' && (
        // מזוודת עבודה
        <>
          <rect x="12" y="22" width="40" height="27" rx="3" />
          <path d="M25 22 V18 Q25 15 28 15 H36 Q39 15 39 18 V22" />
          <path d="M12 33 H52" />
          <path d="M29 31 V36 H35 V31" />
        </>
      )}
      {eventId === 'everyday' && (
        // כוס קפה עם אדים
        <>
          <path d="M14 28 H40 V38 Q40 49 29 49 H25 Q14 49 14 38 Z" />
          <path d="M40 31 H44 Q49 31 49 36 Q49 41 44 41 H40" />
          <path d="M22 22 Q20 19 22 16 Q24 13 22 10" />
          <path d="M31 22 Q29 19 31 16 Q33 13 31 10" />
        </>
      )}
    </svg>
  )
}

export default EventIcon
