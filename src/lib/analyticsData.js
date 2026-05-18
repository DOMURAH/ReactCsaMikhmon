import { getHistoryEntries, loadSalaryHistory, calculateDailySalary, SALARY_THRESHOLD } from './salary'

export async function fetchProcessStats() {
  const fileUrl = localStorage.getItem('csv_url')
  if (!fileUrl) return null

  try {
    const blob = await (await fetch(fileUrl)).blob()
    const formData = new FormData()
    formData.append('file', blob, 'report.csv')
    const res = await fetch('http://127.0.0.1:8000/process', { method: 'POST', body: formData })
    return await res.json()
  } catch {
    return null
  }
}

export function getStoredUsers() {
  try {
    const raw = localStorage.getItem('all_user')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getActiveConnections() {
  try {
    const raw = localStorage.getItem('active_connections_now')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function buildWeeklySalesData(history = getHistoryEntries(loadSalaryHistory())) {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const last7 = history.slice(0, 7).reverse()

  if (last7.length === 0) {
    return days.map((day) => ({
      day,
      ventes: 0,
      salaire: 0,
      seuil: SALARY_THRESHOLD,
    }))
  }

  return last7.map((entry) => {
    const d = new Date(entry.date)
    const day = days[d.getDay() === 0 ? 6 : d.getDay() - 1] || entry.date.slice(5)
    return {
      day: day.length <= 3 ? day : entry.date.slice(8, 10) + '/' + entry.date.slice(5, 7),
      ventes: entry.sales || 0,
      salaire: entry.salary || 0,
      seuil: SALARY_THRESHOLD,
    }
  })
}

export function buildProfileBarData(users = getStoredUsers()) {
  const counts = {}
  users.forEach((u) => {
    const p = u.profile || u['limit-uptime'] || 'Autre'
    counts[p] = (counts[p] || 0) + 1
  })
  return Object.entries(counts).map(([profile, count]) => ({ profile, utilisateurs: count }))
}

export function buildHeatmapData() {
  const hours = ['08h', '10h', '12h', '14h', '16h', '18h', '20h']
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  return days.map((day) => ({
    id: day,
    data: hours.map((h, i) => ({
      x: h,
      y: Math.floor(Math.random() * 40) + 10 + (i % 3) * 8,
    })),
  }))
}

export function buildRadarData(process, users, active) {
  const sales = process?.total_now ?? 0
  const max = Math.max(SALARY_THRESHOLD, sales, 1)
  return [
    { metric: 'Ventes', value: Math.round((sales / max) * 100) },
    { metric: 'Utilisateurs', value: Math.min(100, (users?.length || 0) * 5) },
    { metric: 'Actifs', value: Math.min(100, (active?.length || 0) * 15) },
    { metric: 'Objectif', value: Math.min(100, Math.round((sales / SALARY_THRESHOLD) * 100)) },
    { metric: 'Revenus', value: Math.min(100, Math.round(((process?.total_all ?? 0) / 50000) * 100)) },
  ]
}

export function buildMonthlyBarData(history = getHistoryEntries(loadSalaryHistory())) {
  const byMonth = {}
  history.forEach(({ date, sales }) => {
    const m = date.slice(0, 7)
    byMonth[m] = (byMonth[m] || 0) + (sales || 0)
  })
  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, total]) => ({
      mois: month.slice(5) + '/' + month.slice(0, 4),
      total,
    }))
}

export function getInsightCards(process, history) {
  const sales = process?.total_now ?? 0
  const salary = calculateDailySalary(sales)
  const avg =
    history.length > 0
      ? history.reduce((a, h) => a + (h.sales || 0), 0) / history.length
      : 0

  return [
    {
      title: sales >= SALARY_THRESHOLD ? 'Objectif atteint' : 'En progression',
      desc:
        sales >= SALARY_THRESHOLD
          ? `Les ventes dépassent ${SALARY_THRESHOLD.toLocaleString('fr-FR')} Ar — salaire: ${salary.toLocaleString('fr-FR')} Ar`
          : `Encore ${(SALARY_THRESHOLD - sales).toLocaleString('fr-FR')} Ar pour déclencher le salaire`,
      type: sales >= SALARY_THRESHOLD ? 'success' : 'warning',
    },
    {
      title: 'Moyenne historique',
      desc: `Moyenne des ventes sur ${history.length} jour(s) enregistré(s): ${Math.round(avg).toLocaleString('fr-FR')} Ar`,
      type: 'info',
    },
    {
      title: 'Recommandation',
      desc:
        sales < avg
          ? 'Les ventes du jour sont sous la moyenne — intensifier les heures de pointe.'
          : 'Performance au-dessus de la moyenne — maintenir le rythme actuel.',
      type: 'tip',
    },
  ]
}
