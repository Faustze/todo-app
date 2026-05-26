export function getPeriodRange(periodId: string): { from: Date, to: Date } | undefined {
  const to = new Date()
  const from = new Date(to)

  switch (periodId) {
    case 'today':
      from.setHours(0, 0, 0, 0)
      break
    case '7-days':
      from.setDate(from.getDate() - 7)
      break
    case '30-days':
      from.setDate(from.getDate() - 30)
      break
    case 'quarter':
      from.setMonth(from.getMonth() - 3)
      break
    case 'year':
      from.setFullYear(from.getFullYear() - 1)
      break
    default:
      return undefined
  }

  return { from, to }
}

export function displayDate(date: Date): string {
  // 30.12.2026
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
