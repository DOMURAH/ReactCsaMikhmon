import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResponsiveBar } from '@nivo/bar'
import CountUpModule from 'react-countup'
import {
  Calendar,
  CalendarRange,
  Filter,
  Loader2,
  Moon,
  Sun,
  AlignVerticalJustifyCenter,
  Sparkles,
  FileSpreadsheet,
  Clock,
} from 'lucide-react'
import AnalyticsLayout, { ChartCard, fadeUp } from '../analytics/AnalyticsLayout'
import { nivoTheme, chartColors } from '../../lib/nivoTheme'
import { formatAr } from '../../lib/salary'
import DottedGlowBackgroundDemo from '../dotted-glow-background-demo'

const CountUp = CountUpModule.default
const springSmooth = { type: 'spring', stiffness: 260, damping: 22 }

const FILTER_OPTIONS = [
  { value: 'Date précis', label: 'Date précise', icon: Calendar, api: 'date_precis', desc: 'Filtrer un jour exact (AAAA-MM-JJ)' },
  { value: 'Intervalle de dates', label: 'Intervalle', icon: CalendarRange, api: 'intervalle_de_dates', desc: 'Période entre deux dates' },
  { value: 'annees', label: 'Année', icon: AlignVerticalJustifyCenter, api: 'annees', desc: "Toutes les ventes d'une année" },
  { value: 'Mois', label: 'Mois', icon: Moon, api: 'mois', desc: "Ventes d'un mois (1–12)" },
  { value: 'Jour', label: 'Jour', icon: Sun, api: 'jour', desc: "Ventes d'un jour du mois (1–31)" },
]

const inputClass =
  'w-full px-4 py-3.5 rounded-xl bg-black/50 border border-slate-600/50 text-green-400 font-semibold text-base outline-none focus:border-green-500/60 focus:shadow-[0_0_24px_rgba(34,197,94,0.12)] transition-all placeholder:text-slate-600'

const labelClass = 'text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block'

function FilterButton({ onClick, loading }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-center gap-2.5 w-full px-6 py-4 mt-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-base shadow-lg shadow-green-900/30 hover:shadow-green-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Filter className="w-5 h-5" />}
      {loading ? 'Analyse en cours…' : 'Appliquer le filtre'}
    </motion.button>
  )
}

function Field({ label, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <label className={labelClass}>{label}</label>
      {children}
    </motion.div>
  )
}

const Filtrage = () => {
  const now = new Date()
  const [selectedFilter, setSelectedFilter] = useState('Date précis')
  const [years, setYears] = useState(String(now.getFullYear()))
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'))
  const [day, setDay] = useState(String(now.getDate()).padStart(2, '0'))
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [lastLabel, setLastLabel] = useState('Sélectionnez un filtre et cliquez sur « Appliquer »')
  const [history, setHistory] = useState([])
  const [startDate, setStartDate] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  )
  const [endDate, setEndDate] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  )

  const hasCsv = Boolean(localStorage.getItem('csv_url'))
  const selectedOption = FILTER_OPTIONS.find((f) => f.value === selectedFilter)

  const previewValue = () => {
    if (selectedFilter === 'Date précis') return `${years}-${month}-${day}`
    if (selectedFilter === 'Intervalle de dates') return `${startDate} → ${endDate}`
    if (selectedFilter === 'annees') return years
    if (selectedFilter === 'Mois') return `Mois ${month}`
    if (selectedFilter === 'Jour') return `Jour ${day}`
    return '—'
  }

  const sendDateFiltred = async (fullDate, typeOfFilter, startDates = null, endDates = null) => {
    const urlFile = localStorage.getItem('csv_url')
    if (!urlFile) {
      setLastLabel('Fichier CSV non chargé — importez d’abord un rapport via Upload')
      return
    }

    setLoading(true)
    try {
      const blob = await (await fetch(urlFile)).blob()
      const formData = new FormData()
      formData.append('file', blob, 'report.csv')
      if (fullDate) formData.append('textData', fullDate)
      formData.append('filterType', typeOfFilter)
      if (startDates && endDates) {
        formData.append('textData2', startDates)
        formData.append('textData3', endDates)
      }

      const res = await fetch('http://127.0.0.1:8000/date_precis', { method: 'POST', body: formData })
      const data = await res.json()
      const amount = data.total ?? 0
      setTotal(amount)

      const label =
        typeOfFilter === 'date_precis'
          ? fullDate
          : typeOfFilter === 'intervalle_de_dates'
            ? `${startDates} → ${endDates}`
            : fullDate || `${startDates}`

      setLastLabel(`${selectedOption?.label} · ${label}`)
      setHistory((prev) => [
        { filtre: (selectedOption?.label || label).slice(0, 14), total: amount, full: label },
        ...prev.slice(0, 7),
      ])
    } catch (err) {
      console.error(err)
      setLastLabel('Erreur réseau — vérifiez que le serveur backend est démarré')
    } finally {
      setLoading(false)
    }
  }

  const runFilter = () => {
    const api = selectedOption?.api
    if (selectedFilter === 'Date précis') sendDateFiltred(`${years}-${month}-${day}`, api)
    else if (selectedFilter === 'annees') sendDateFiltred(String(years), api)
    else if (selectedFilter === 'Mois') sendDateFiltred(String(month), api)
    else if (selectedFilter === 'Intervalle de dates') sendDateFiltred(null, api, startDate, endDate)
    else if (selectedFilter === 'Jour') sendDateFiltred(String(day), api)
  }

  const renderFilterFields = () => {
    if (selectedFilter === 'Date précis') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Année">
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} placeholder="2026" />
          </Field>
          <Field label="Mois">
            <input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} className={inputClass} placeholder="05" />
          </Field>
          <Field label="Jour">
            <input type="number" min={1} max={31} value={day} onChange={(e) => setDay(e.target.value)} className={inputClass} placeholder="17" />
          </Field>
        </div>
      )
    }
    if (selectedFilter === 'annees') {
      return (
        <Field label="Année">
          <input type="number" min={2020} max={2100} value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} />
        </Field>
      )
    }
    if (selectedFilter === 'Mois') {
      return (
        <Field label="Mois (1 – 12)">
          <input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} className={inputClass} />
        </Field>
      )
    }
    if (selectedFilter === 'Jour') {
      return (
        <Field label="Jour du mois (1 – 31)">
          <input type="number" min={1} max={31} value={day} onChange={(e) => setDay(e.target.value)} className={inputClass} />
        </Field>
      )
    }
    if (selectedFilter === 'Intervalle de dates') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Date de début">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Date de fin">
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
          </Field>
        </div>
      )
    }
    return null
  }

  return (
    <AnalyticsLayout
      icon={Filter}
      title="Filtrage"
      subtitle="Analysez vos revenus hotspot par période"
      badge={total > 0 ? formatAr(total) : hasCsv ? 'Prêt' : 'CSV requis'}
    >
      <motion.div
        variants={fadeUp}
        className={`flex items-center gap-4 p-4 rounded-xl border ${
          hasCsv ? 'border-green-500/30 bg-green-950/20' : 'border-amber-500/30 bg-amber-950/20'
        }`}
      >
        <FileSpreadsheet className={`w-5 h-5 shrink-0 ${hasCsv ? 'text-green-400' : 'text-amber-400'}`} />
        <p className={`text-sm ${hasCsv ? 'text-slate-300' : 'text-amber-200/90'}`}>
          {hasCsv
            ? 'Fichier CSV détecté — vous pouvez lancer un filtrage.'
            : 'Aucun CSV chargé. Allez dans Upload pour importer votre rapport.'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8 items-stretch">
        {/* Résultat */}
        <motion.div
          variants={fadeUp}
          className="xl:col-span-5 flex flex-col min-h-[440px] relative overflow-hidden rounded-2xl border border-green-700/35 bg-gradient-to-br from-slate-800/60 via-slate-900/80 to-green-950/40 dark:from-black/90 shadow-xl"
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <DottedGlowBackgroundDemo />
          </div>

          <div className="relative z-10 flex flex-col flex-1 p-6 md:p-8 gap-6">
            <motion.div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Résultat</p>
                <h2 className="text-xl font-bold text-white">Total revenus</h2>
              </div>
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                <Sparkles className="w-6 h-6 text-green-400" />
              </motion.div>
            </motion.div>

            <div className="flex-1 flex flex-col justify-center py-6 min-h-[120px]">
              <AnimatePresence mode="wait">
                <motion.div key={total} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <p className="text-5xl md:text-6xl font-black tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-500">
                    <CountUp start={0} end={total} duration={2.2} suffix=" Ar" />
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div key={lastLabel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-black/35 border border-slate-700/50">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-400 leading-relaxed">{lastLabel}</p>
              </div>
            </motion.div>

            {history.length > 0 && (
              <div className="pt-4 border-t border-slate-700/50 space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Historique récent</p>
                <div className="space-y-2">
                  {history.slice(0, 4).map((h, i) => (
                    <motion.div
                      key={`${h.filtre}-${i}`}
                      whileHover={{ x: 4, backgroundColor: 'rgba(34,197,94,0.08)' }}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60"
                    >
                      <span className="text-sm text-slate-400 truncate" title={h.full}>{h.filtre}</span>
                      <span className="text-sm font-bold text-green-400 shrink-0">{formatAr(h.total)}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Filtres */}
        <motion.div
          variants={fadeUp}
          className="xl:col-span-7 flex flex-col min-h-[440px] rounded-2xl border border-slate-600/40 bg-slate-800/25 dark:bg-black/70 shadow-lg p-6 md:p-8 gap-8"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Configuration</p>
            <h2 className="text-xl font-bold text-white mb-2">Type de filtre</h2>
            <p className="text-sm text-slate-500 leading-relaxed">{selectedOption?.desc}</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {FILTER_OPTIONS.map((opt) => {
              const active = selectedFilter === opt.value
              return (
                <motion.button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedFilter(opt.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                    active ? 'text-white' : 'text-slate-400 hover:text-slate-200 border border-slate-700/50'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="filterTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 shadow-md"
                      transition={springSmooth}
                    />
                  )}
                  <opt.icon className="relative w-4 h-4 shrink-0" />
                  <span className="relative">{opt.label}</span>
                </motion.button>
              )
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/40">
            <p className={labelClass}>Aperçu de la requête</p>
            <p className="font-mono text-green-400 text-lg break-all">{previewValue()}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFilter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex flex-col gap-6 flex-1"
            >
              {renderFilterFields()}
              <div className="mt-auto pt-4 border-t border-slate-700/30">
                <FilterButton onClick={runFilter} loading={loading} />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="w-full mt-2">
        {history.length > 0 ? (
          <ChartCard title="Historique des filtres" subtitle="Comparaison visuelle de vos dernières recherches" className="p-6 md:p-8">
            <ResponsiveBar
              data={[...history].reverse()}
              keys={['total']}
              indexBy="filtre"
              theme={nivoTheme}
              colors={chartColors}
              margin={{ top: 24, right: 28, bottom: 56, left: 72 }}
              padding={0.5}
              axisBottom={{ tickRotation: -20 }}
              axisLeft={{ format: (v) => `${(v / 1000).toFixed(0)}k` }}
              enableLabel={false}
            />
          </ChartCard>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-600/50 p-12 md:p-16 text-center bg-slate-800/10 dark:bg-black/40">
            <Filter className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Le graphique comparatif apparaîtra ici après votre premier filtrage.
            </p>
          </div>
        )}
      </motion.div>
    </AnalyticsLayout>
  )
}

export default Filtrage
