# Glamget · glam on a budget

אפליקציה להרכבת לוקים לנשים לפי **סוג האירוע** ו**התקציב**.
בוחרים אירוע (חתונה, ערב בחוץ, עבודה או יום-יום) ותקציב בשקלים, והאפליקציה מראה רק פריטים שמתאימים. אפשר להרכיב לוק של בגד, נעליים, תיק ואקססורי, לראות בזמן אמת כמה הוא עולה וכמה נשאר מהתקציב, ולשמור לוקים לפעם הבאה.

פרויקט גמר בקורס 4255, פלטפורמות מתקדמות לפיתוח ב-WEB ושימוש ב-AI.

## עמודים

| כתובת | עמוד |
|---|---|
| `/` | פתיחה: בחירת אירוע ותקציב |
| `/items` | קטלוג: רשימה עם סינון לפי סוג וחיפוש לפי שם |
| `/items/:id` | פריט: תמונות, מחיר, הנחה, תיאור והוספה ללוק |
| `/look` | הלוק שלי: הפריטים שנבחרו, סכום מול התקציב ושמירה |
| `/saved` | לוקים שמורים: פתיחה לעריכה ומחיקה (נשמר ב-localStorage) |
| כל כתובת אחרת | עמוד 404 |

## ה-API

[DummyJSON](https://dummyjson.com/docs/products): חנות לדוגמה, ציבורית וחינמית, **בלי מפתח**.

- כל המוצרים: `GET https://dummyjson.com/products?limit=0`
- מוצר אחד: `GET https://dummyjson.com/products/{id}`

משתמשים רק בקטגוריות של נשים: שמלות, חולצות, נעליים, תיקים, תכשיטים, שעונים ומשקפי שמש.
המחירים מגיעים בדולרים, והאפליקציה ממירה אותם לשקלים לפי שער קבוע (3.7).

## איך מריצים

צריך [Node.js](https://nodejs.org) (גרסה 20 ומעלה).

```bash
npm install      # התקנה, פעם אחת
npm run dev      # הרצה. פותחים את הכתובת שמופיעה (בדרך כלל http://localhost:5173)
npm run build    # בדיקה שהפרויקט נבנה בלי שגיאות
```

## איך בודקים

```bash
npm test         # מריץ את כל הבדיקות פעם אחת
npm run test:ui  # פותח את Vitest UI בדפדפן ומראה את הבדיקות בצורה ויזואלית
```

יש שני קבצי בדיקות:
- `src/utils/styleLogic.test.ts`: 18 בדיקות ללוגיקה. המרת מחירים, הנחות, סינון לפי אירוע, תקציב וחיפוש, הרכבת הלוק, חישוב התקציב ושמירת לוקים.
- `src/components/BudgetBar.test.tsx`: 2 בדיקות לרכיב (Testing Library). מה כתוב כשהלוק בתוך התקציב, ומה כשחורגים.

## טכנולוגיות

React 19, Vite, TypeScript, React Router, Vitest, Testing Library. CSS רגיל, בלי ספריות עיצוב.

## מבנה הפרויקט

```
src/
├── main.tsx              נקודת ההתחלה
├── App.tsx               השלד: ניתוב, והמידע המשותף (בחירות, לוק, לוקים שמורים)
├── App.css               כל העיצוב
├── api.ts                הפניות ל-API (fetch)
├── types.ts              הטיפוסים של TypeScript
├── components/           חלקים קטנים שחוזרים על עצמם
│   ├── NavBar.tsx
│   ├── ProductCard.tsx
│   ├── FilterBar.tsx
│   ├── StatusMessage.tsx
│   └── BudgetBar.tsx
├── pages/                עמוד לכל כתובת
│   ├── HomePage.tsx
│   ├── CatalogPage.tsx
│   ├── ProductPage.tsx
│   ├── MyLookPage.tsx
│   ├── SavedLooksPage.tsx
│   └── NotFoundPage.tsx
├── utils/
│   ├── styleLogic.ts     "המוח": חישובים וכללים
│   └── storage.ts        שמירה וקריאה מ-localStorage
└── data/
    └── sampleProducts.ts מוצרים לדוגמה (לבדיקות)
```

הסבר מפורט על הזרימה בין החלקים: [docs/architecture.md](./docs/architecture.md).

## מסמכי תהליך

- [PRD.md](./PRD.md): מה בונים, למי ולמה.
- [tasks.md](./tasks.md): תוכנית העבודה, משימה אחרי משימה.
- [PROMPTS.md](./PROMPTS.md): כל הפרומפטים ששלחתי לסוכן ה-AI.
