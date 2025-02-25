// import { useEffect, useContext } from 'react'
// import { db } from '../firebaseConfig'
// import { doc, setDoc } from 'firebase/firestore'
// import { UserContext } from '../UserContext'

// interface RowData {
//     id: number
//     date: Date
//     hr?: number | null
//     RMSSD?: number | null
//     lnRMSSD?: number | null
//     Suggestion: string
// }

// const { user } = useContext(UserContext)

// const generateRows = (): RowData[] => [
//     { id: 1, date: new Date('2025-01-19'), hr: 68, RMSSD: 46, lnRMSSD: 3.83, Suggestion: translations.Rest },
//     { id: 2, date: new Date('2025-01-20'), hr: 67, RMSSD: 49, lnRMSSD: 3.89, Suggestion: translations.LowIntensity },
//     { id: 3, date: new Date('2025-01-21'), hr: 66, RMSSD: 53, lnRMSSD: 3.97, Suggestion: translations.HighIntensity },
//     { id: 4, date: new Date('2025-01-22'), hr: 65, RMSSD: 46, lnRMSSD: 3.83, Suggestion: translations.LowIntensity },
//     { id: 5, date: new Date('2025-01-23'), hr: 69, RMSSD: 50, lnRMSSD: 3.91, Suggestion: translations.HighIntensity },
// ]

// const saveGeneratedRows = async (rows: RowData[]) => {
//     if (user) {
//         for (const row of rows) {
//             const userDocRef = doc(db, 'hrv-logs', `${user.uid}_${row.date.toISOString().split('T')[0].replace(/-/g, '-')}`)
//             const rowData = {
//                 uid: user.uid,
//                 date: row.date.toISOString(),
//                 hr: row.hr ?? null,
//                 RMSSD: row.RMSSD ?? null,
//                 lnRMSSD: row.lnRMSSD ?? null,
//                 Suggestion: row.Suggestion ?? '',
//             }
//             await setDoc(userDocRef, rowData, { merge: true })
//         }
//     }
// }

// useEffect(() => {
//     generateRows()
//         .then(rows => saveGeneratedRows(rows))
//         .catch(error => console.error(error))
// }, [user])