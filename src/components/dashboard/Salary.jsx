import React, { useEffect, useMemo, useState } from 'react'
import { motion, useSpring, AnimatePresence } from 'framer-motion'
import CountUpModule from 'react-countup'
import {
  Banknote,
  CalendarDays,
  CircleDollarSign,
  TrendingUp,
  Wallet,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react'
import {
  SALARY_THRESHOLD,
  calculateDailySalary,
  formatAr,
  formatDateFr,
  getExcessOverThreshold,
  getHistoryEntries,
  getProgressToThreshold,
  getRemainingToThreshold,
  sumSalaryInRange,
  todayDateKey,
  upsertTodayRecord,
} from '../../lib/salary'

const CountUp = CountUpModule.default

const EXAMPLES = [
  { sales: 8000, label: "Aujourd'hui" },
  { sales: 4000, label: 'Demain' },
  { sales: 6500, label: 'Exemple' },
]

const springSmooth = { type: 'spring', stiffness: 260, damping: 22 }

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -6,
    transition: springSmooth,
  },
}

function useTilt() {
  const rotateX = useSpring(0, { stiffness: 180, damping: 18 })
  const rotateY = useSpring(0, { stiffness: 180, damping: 18 })

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateX.set(py * -10)
    rotateY.set(px * 10)
  }

  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return { rotateX, rotateY, onMove, onLeave }
}

function ExampleRow({ sales, label, index }) {
  const salary = calculateDailySalary(sales)
  const excess = getExcessOverThreshold(sales)

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
      whileHover={{ x: 6, scale: 1.01 }}
      className="group relative flex flex-wrap items-center gap-2 sm:gap-3 p-3 rounded-xl
        bg-slate-800/30 dark:bg-black/40 border border-slate-600/30
        hover:border-green-500/50 hover:bg-slate-800/50 dark:hover:bg-green-950/20
        transition-colors duration-300 cursor-default overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0
          opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={false}
      />
      <span className="relative text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 min-w-[72px]">
        {label}
      </span>
      <span className="relative text-slate-300 group-hover:text-white transition-colors">
        {formatAr(sales)}
      </span>
      <ArrowRight className="relative w-4 h-4 text-green-500 shrink-0 group-hover:translate-x-1 transition-transform" />
      <span className="relative text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
        {sales > SALARY_THRESHOLD
          ? `${formatAr(SALARY_THRESHOLD)} + ${formatAr(excess)}`
          : `sous ${formatAr(SALARY_THRESHOLD)}`}
      </span>
      <ArrowRight className="relative w-4 h-4 text-green-500 shrink-0 group-hover:translate-x-1 transition-transform" />
      <motion.span
        className={`relative font-bold ${salary > 0 ? 'text-green-400' : 'text-slate-500'}`}
        whileHover={{ scale: 1.08 }}
      >
        {formatAr(salary)}
      </motion.span>
    </motion.div>
  )
}

function StatCard({ icon: Icon, title, value, suffix, accent, delay = 0 }) {
  const { rotateX, rotateY, onMove, onLeave } = useTilt()

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.02, y: -6, transition: springSmooth }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      transition={{ delay }}
      className="group relative bg-slate-800/20 dark:bg-black/80 p-5 rounded-xl
        border border-slate-600/30 overflow-hidden cursor-default
        hover:border-green-500/40 hover:shadow-[0_20px_50px_-12px_rgba(34,197,94,0.25)]
        transition-shadow duration-500"
    >
      <motion.div
        variants={cardHover}
        className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0
          group-hover:from-green-500/10 group-hover:to-emerald-500/5 transition-all duration-500 pointer-events-none"
      />
      <motion.div
        className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-green-500/20 blur-2xl
          opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        variants={{
          rest: { scale: 1, rotate: 0 },
          hover: { scale: 1.12, rotate: 6 },
        }}
        transition={springSmooth}
        className={`relative w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${accent}
          shadow-lg group-hover:shadow-green-500/30`}
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>
      <p className="relative text-sm text-slate-500 dark:text-slate-400 mb-1 group-hover:text-slate-300 transition-colors">
        {title}
      </p>
      <motion.p
        variants={{
          rest: { x: 0 },
          hover: { x: 4 },
        }}
        className="relative text-2xl font-bold text-slate-800 dark:text-white"
      >
        <CountUp start={0} end={value} duration={2} suffix={suffix} />
      </motion.p>
    </motion.div>
  )
}

function DetailRow({ row, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 + index * 0.06 }}
      whileHover={{ x: 4, backgroundColor: 'rgba(34, 197, 94, 0.06)' }}
      className="flex justify-between items-center py-2 px-2 -mx-2 rounded-lg
        border-b border-slate-700/30 last:border-0 transition-colors"
    >
      <dt className="text-slate-500 dark:text-slate-400 text-sm">{row.label}</dt>
      <dd
        className={`font-bold tabular-nums ${
          row.highlight ? 'text-green-400 text-xl' : 'text-slate-800 dark:text-slate-200'
        }`}
      >
        {row.value}
      </dd>
    </motion.div>
  )
}

function HistoryRow({ entry, index, todayKey }) {
  const isToday = entry.date === todayKey
  const reached = entry.sales >= SALARY_THRESHOLD

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{
        backgroundColor: isToday ? 'rgba(6, 78, 59, 0.35)' : 'rgba(51, 65, 85, 0.35)',
        scale: 1.005,
      }}
      className={`border-b border-slate-800/50 transition-colors ${
        isToday ? 'bg-green-950/20' : ''
      }`}
    >
      <td className="p-4 text-slate-300">
        {formatDateFr(entry.date)}
        {isToday && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-2 text-[10px] uppercase bg-green-600/30 text-green-400 px-2 py-0.5 rounded-full"
          >
            Aujourd&apos;hui
          </motion.span>
        )}
      </td>
      <td className="p-4 font-medium text-slate-200">{formatAr(entry.sales)}</td>
      <td className="p-4 text-slate-400">{formatAr(SALARY_THRESHOLD)}</td>
      <td
        className={`p-4 font-bold ${
          entry.salary > 0 ? 'text-green-400' : 'text-slate-500'
        }`}
      >
        {formatAr(entry.salary)}
      </td>
      <td className="p-4 hidden sm:table-cell">
        <motion.span
          whileHover={{ scale: 1.06 }}
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
            reached
              ? 'bg-green-500/20 text-green-400'
              : 'bg-slate-700/50 text-slate-400'
          }`}
        >
          {reached ? 'Objectif dépassé' : 'Sous le seuil'}
        </motion.span>
      </td>
    </motion.tr>
  )
}

const Salary = () => {
  const [salesToday, setSalesToday] = useState(0)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState([])

  const salaryToday = calculateDailySalary(salesToday)
  const progress = getProgressToThreshold(salesToday)
  const remaining = getRemainingToThreshold(salesToday)
  const excess = getExcessOverThreshold(salesToday)
  const todayKey = todayDateKey()

  const weekTotal = useMemo(() => sumSalaryInRange(history, 7), [history])
  const monthTotal = useMemo(() => sumSalaryInRange(history, 30), [history])

  const statusMessage = useMemo(() => {
    if (salesToday === 0 && loading) return 'Chargement des ventes du jour…'
    if (salaryToday === 0) {
      if (remaining === SALARY_THRESHOLD) {
        return `Aucun salaire aujourd'hui — les ventes n'ont pas encore dépassé ${formatAr(SALARY_THRESHOLD)}.`
      }
      return `Encore ${formatAr(remaining)} de ventes pour déclencher le salaire.`
    }
    return `Objectif dépassé de ${formatAr(excess)} — votre salaire du jour est ${formatAr(salaryToday)}.`
  }, [salesToday, salaryToday, remaining, excess, loading])

  const detailRows = useMemo(
    () => [
      { label: 'Ventes enregistrées', value: formatAr(salesToday), highlight: false },
      { label: 'Seuil à dépasser', value: formatAr(SALARY_THRESHOLD), highlight: false },
      {
        label: 'Reste avant salaire',
        value: salaryToday > 0 ? '—' : formatAr(remaining),
        highlight: false,
      },
      {
        label: 'Excédent (salaire)',
        value: formatAr(excess),
        highlight: salaryToday > 0,
      },
      {
        label: 'Salaire final',
        value: formatAr(salaryToday),
        highlight: true,
      },
    ],
    [salesToday, salaryToday, remaining, excess]
  )

  useEffect(() => {
    const fetchSales = async () => {
      const fileUrl = localStorage.getItem('csv_url')
      if (!fileUrl) {
        setLoading(false)
        return
      }

      try {
        const responses = await fetch(fileUrl)
        const blob = await responses.blob()
        const formData = new FormData()
        formData.append('file', blob, 'report.csv')

        const res = await fetch('http://127.0.0.1:8000/process', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        const total = data.total_now ?? 0
        setSalesToday(total)
        const updated = upsertTodayRecord(total)
        setHistory(getHistoryEntries(updated))
      } catch (err) {
        console.error(err)
        setHistory(getHistoryEntries())
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
    const interval = setInterval(fetchSales, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* En-tête */}
      <motion.div
        variants={fadeUp}
        whileHover={{ scale: 1.005 }}
        transition={springSmooth}
        className="group relative overflow-hidden rounded-2xl border border-green-700/30 p-6 md:p-8
          bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-green-950/40
          dark:from-black/80 dark:to-green-950/30
          hover:border-green-500/50 hover:shadow-[0_25px_60px_-15px_rgba(34,197,94,0.2)]
          transition-[box-shadow,border-color] duration-500"
      >
        <motion.div
          className="absolute -top-20 -right-20 w-56 h-56 bg-green-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
            bg-[radial-gradient(ellipse_at_top_right,_rgba(34,197,94,0.12),_transparent_55%)]"
        />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 8 }}
              transition={springSmooth}
              className="p-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500
                shadow-lg shadow-green-900/30 group-hover:shadow-green-500/40"
            >
              <Wallet className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div>
              <h1 className="text-2xl md:text-3xl font-bold text-white italic">
                Salaire journalier
              </h1>
              <p className="text-sm text-slate-400 mt-0.5 group-hover:text-slate-300 transition-colors">
                Seuil fixe : {formatAr(SALARY_THRESHOLD)} — au-delà, l&apos;excédent =
                votre salaire
              </p>
            </motion.div>
            {salaryToday > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Bonus actif
              </motion.div>
            )}
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
          >
            <div>
              <p className="text-sm uppercase tracking-widest text-green-400/90 font-semibold mb-2">
                Salaire du jour
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={salaryToday}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={springSmooth}
                  className={`text-5xl md:text-6xl font-black tabular-nums ${
                    salaryToday > 0
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300'
                      : 'text-slate-500'
                  }`}
                >
                  <CountUp start={0} end={salaryToday} duration={2.5} suffix=" Ar" />
                </motion.p>
              </AnimatePresence>
              <motion.p
                key={statusMessage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-slate-300 text-sm md:text-base max-w-xl"
              >
                {statusMessage}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, borderColor: 'rgba(34, 197, 94, 0.5)' }}
              transition={{ delay: 0.2, ...springSmooth }}
              className="lg:min-w-[280px] p-4 rounded-xl bg-black/40 border border-slate-600/40 backdrop-blur-sm"
            >
              <motion.div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Progression vers {formatAr(SALARY_THRESHOLD)}</span>
                <motion.span
                  key={Math.round(progress)}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="text-green-400 font-bold"
                >
                  {Math.round(progress)}%
                </motion.span>
              </motion.div>
              <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-400 relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/25"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              </div>
              <p className="text-xs text-slate-500 mt-2 group-hover:text-slate-400 transition-colors">
                Ventes actuelles : {formatAr(salesToday)}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        <StatCard
          icon={CircleDollarSign}
          title="Ventes du jour"
          value={salesToday}
          suffix=" Ar"
          accent="bg-slate-600"
          delay={0.05}
        />
        <StatCard
          icon={Banknote}
          title="Seuil salaire"
          value={SALARY_THRESHOLD}
          suffix=" Ar"
          accent="bg-amber-600"
          delay={0.1}
        />
        <StatCard
          icon={TrendingUp}
          title="Salaire (7 jours)"
          value={weekTotal}
          suffix=" Ar"
          accent="bg-green-600"
          delay={0.15}
        />
        <StatCard
          icon={CalendarDays}
          title="Salaire (30 jours)"
          value={monthTotal}
          suffix=" Ar"
          accent="bg-emerald-700"
          delay={0.2}
        />
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Formule */}
        <motion.div
          whileHover={{ y: -4, borderColor: 'rgba(34, 197, 94, 0.35)' }}
          transition={springSmooth}
          className="group rounded-xl border border-slate-600/40 p-6 bg-slate-800/20 dark:bg-black/60
            hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] transition-shadow duration-500"
        >
          <motion.div
            className="flex items-center gap-2 mb-4"
            whileHover={{ x: 4 }}
          >
            <motion.div whileHover={{ rotate: 12, scale: 1.1 }} transition={springSmooth}>
              <Info className="w-5 h-5 text-green-500" />
            </motion.div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Comment ça marche ?
            </h2>
          </motion.div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 leading-relaxed">
            Chaque jour est recalculé indépendamment. Si les ventes dépassent{' '}
            <span className="text-green-400 font-semibold">{formatAr(SALARY_THRESHOLD)}</span>,
            votre salaire = ventes − {formatAr(SALARY_THRESHOLD)}. En dessous du seuil, le
            salaire repasse à <span className="font-semibold text-white">0 Ar</span>.
          </p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {EXAMPLES.map((ex, i) => (
              <ExampleRow key={ex.label} sales={ex.sales} label={ex.label} index={i} />
            ))}
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={springSmooth}
            className="mt-5 p-4 rounded-xl bg-green-950/30 border border-green-700/30
              group-hover:border-green-500/50 transition-colors"
          >
            <p className="text-sm font-mono text-green-300/90">
              salaire = max(0, ventes − {SALARY_THRESHOLD})
            </p>
          </motion.div>
        </motion.div>

        {/* Détail aujourd'hui */}
        <motion.div
          whileHover={{ y: -4, borderColor: 'rgba(34, 197, 94, 0.35)' }}
          transition={springSmooth}
          className="rounded-xl border border-slate-600/40 p-6 bg-slate-800/20 dark:bg-black/60
            hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] transition-shadow duration-500"
        >
          <motion.h2
            className="text-lg font-bold text-slate-800 dark:text-white mb-5"
            whileHover={{ x: 4 }}
          >
            Détail — {formatDateFr(todayKey)}
          </motion.h2>
          <dl className="space-y-1">
            {detailRows.map((row, i) => (
              <DetailRow key={row.label} row={row} index={i} />
            ))}
          </dl>
        </motion.div>
      </motion.div>

      {/* Historique */}
      <motion.div
        variants={fadeUp}
        whileHover={{ borderColor: 'rgba(34, 197, 94, 0.3)' }}
        className="rounded-xl border border-slate-600/40 overflow-hidden bg-slate-800/20 dark:bg-black/60
          transition-colors duration-500"
      >
        <motion.div
          className="p-5 border-b border-slate-700/40 flex items-center justify-between"
          whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}
        >
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <motion.div whileHover={{ rotate: 15 }} transition={springSmooth}>
              <CalendarDays className="w-5 h-5 text-green-500" />
            </motion.div>
            Historique journalier
          </h2>
          <span className="text-xs text-slate-500 uppercase tracking-wide">
            recalcul chaque jour
          </span>
        </motion.div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-700/40">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Ventes</th>
                <th className="p-4 font-semibold">Seuil</th>
                <th className="p-4 font-semibold">Salaire</th>
                <th className="p-4 font-semibold hidden sm:table-cell">Statut</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Aucun historique pour le moment. Les données apparaîtront après la
                    première synchronisation.
                  </td>
                </tr>
              ) : (
                history.map((entry, i) => (
                  <HistoryRow
                    key={entry.date}
                    entry={entry}
                    index={i}
                    todayKey={todayKey}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Salary
