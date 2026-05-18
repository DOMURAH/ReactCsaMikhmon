export const SALARY_THRESHOLD = 6000
const HISTORY_KEY = 'salary_daily_history'

export function calculateDailySalary(salesTotal) {
  const sales = Number(salesTotal) || 0
  return Math.max(0, sales - SALARY_THRESHOLD)
}

export function getProgressToThreshold(salesTotal) {
  const sales = Number(salesTotal) || 0
  return Math.min(100, (sales / SALARY_THRESHOLD) * 100)
}

export function getRemainingToThreshold(salesTotal) {
  const sales = Number(salesTotal) || 0
  return Math.max(0, SALARY_THRESHOLD - sales)
}

export function getExcessOverThreshold(salesTotal) {
  const sales = Number(salesTotal) || 0
  return Math.max(0, sales - SALARY_THRESHOLD)
}

export function todayDateKey(date = new Date()) {
  return date.toISOString().split('T')[0]
}

export function loadSalaryHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveSalaryHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function upsertTodayRecord(salesTotal) {
  const key = todayDateKey()
  const history = loadSalaryHistory()
  history[key] = {
    sales: Number(salesTotal) || 0,
    salary: calculateDailySalary(salesTotal),
    updatedAt: new Date().toISOString(),
  }
  saveSalaryHistory(history)
  return history
}

export function getHistoryEntries(history = loadSalaryHistory()) {
  return Object.entries(history)
    .map(([date, record]) => ({ date, ...record }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function sumSalaryInRange(entries, days) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days + 1)
  const cutoffKey = todayDateKey(cutoff)
  return entries
    .filter((e) => e.date >= cutoffKey)
    .reduce((acc, e) => acc + (e.salary || 0), 0)
}

export function formatAr(amount) {
  return `${Number(amount).toLocaleString('fr-FR')} Ar`
}

export function formatDateFr(dateKey) {
  const [y, m, d] = dateKey.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
