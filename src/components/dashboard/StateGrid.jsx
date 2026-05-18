import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  CircleDashed,
  LayoutDashboard,
  Server,
  TrendingUp,
  User2,
  Target,
  Wallet,
} from 'lucide-react'
import CountUpModule from 'react-countup'
import { motion, useSpring } from 'framer-motion'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import TextType from '../ReactBits/TextSplit/TextType'
import { StatsContext } from '../../StatsContext'
import AnalyticsLayout, { ChartCard, fadeUp } from '../analytics/AnalyticsLayout'
import { nivoTheme, chartColors } from '../../lib/nivoTheme'
import { buildWeeklySalesData } from '../../lib/analyticsData'
import {
  SALARY_THRESHOLD,
  calculateDailySalary,
  formatAr,
  getProgressToThreshold,
  upsertTodayRecord,
} from '../../lib/salary'

const CountUp = CountUpModule.default
const springSmooth = { type: 'spring', stiffness: 260, damping: 22 }

function useTilt() {
  const rotateX = useSpring(0, { stiffness: 180, damping: 18 })
  const rotateY = useSpring(0, { stiffness: 180, damping: 18 })

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateX.set(py * -8)
    rotateY.set(px * 8)
  }

  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return { rotateX, rotateY, onMove, onLeave }
}

function StateCard({ stat, index }) {
  const { rotateX, rotateY, onMove, onLeave } = useTilt()
  const isPositive = stat.change?.startsWith('+')

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-600/40
        bg-slate-800/25 dark:bg-black/75 p-5 min-h-[160px]
        hover:border-green-500/40 hover:shadow-[0_20px_50px_-12px_rgba(34,197,94,0.2)]
        transition-shadow duration-500"
    >
      <motion.div
        className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-green-500/10 blur-2xl
          opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <div className="flex items-start justify-between mb-4">
        <motion.div
          whileHover={{ rotate: 8, scale: 1.1 }}
          transition={springSmooth}
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.accent}`}
        >
          <stat.icon className="w-5 h-5 text-white" />
        </motion.div>
        {stat.change && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${
              isPositive
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/15 text-red-400'
            }`}
          >
            {stat.change}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{stat.title}</p>
      <p className={`text-2xl md:text-3xl font-black tabular-nums ${stat.valueColor}`}>
        <CountUp start={0} end={stat.value} duration={2.5} suffix={stat.suffix} />
      </p>
      <motion.div className="mt-4 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${stat.barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, stat.progress)}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </motion.div>
  )
}

const getSaleMessage = (totalNow) => {
  if (totalNow <= 1000) {
    return "😞 Ventes très faibles aujourd'hui — l'objectif de 6 000 Ar semble loin."
  }
  if (totalNow < 3000) {
    return '⚠️ Ventes en progression — encore en dessous des 6 000 Ar, mais on avance.'
  }
  if (totalNow < 5000) {
    return '🙂 Ventes stables — on se rapproche progressivement de l\'objectif journalier.'
  }
  if (totalNow < 6000) {
    return '🚀 Presque là ! L\'objectif de 6 000 Ar est à portée de main.'
  }
  if (totalNow === 6000) {
    return '🎉 Objectif journalier de 6 000 Ar atteint — excellent travail !'
  }
  return '🏆 Objectif dépassé ! Les ventes explosent aujourd\'hui — continuez ainsi.'
}

const StateGrid = () => {
  const { stats, setStats } = useContext(StatsContext)

  const [state, setState] = useState(null)
  const [supabaseData, setSupabaseData] = useState(null)
  const [pourcentNow, setPourcentNow] = useState(0)
  const [saleMessage, setSaleMessage] = useState('Chargement des données…')
  const [weekly, setWeekly] = useState([])
  const [lineData, setLineData] = useState([])

  useEffect(() => {
    const fetchstate = () => {
      fetch('http://127.0.0.1:8000/mikrotik', { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => {
          setState(data)
          localStorage.setItem(
            'active_connections_now',
            JSON.stringify(data.active_connect_now || data.active_connections || [])
          )

          const number_of_rows = localStorage.getItem('number_of_rows')
            ? JSON.parse(localStorage.getItem('number_of_rows'))
            : 0

          const allUser = data.all_user || []
          const allNames = localStorage.getItem('stats')
            ? JSON.parse(localStorage.getItem('stats')).all_name || []
            : []

          let user_number = number_of_rows
          for (const user of allUser) {
            if (!allNames.includes(user.name) && user.profile === '1H') {
              user_number++
              localStorage.setItem('number_of_rows2', JSON.stringify(user_number))
            }
          }
          localStorage.setItem('number_of_rows', JSON.stringify(number_of_rows))
          setStats(stats)
        })
        .catch((err) => console.error(err))
    }

    const uploadFile = async () => {
      const fileUrl = localStorage.getItem('csv_url')
      if (!fileUrl) return

      try {
        const blob = await (await fetch(fileUrl)).blob()
        const formData = new FormData()
        formData.append('file', blob, 'report.csv')

        const res = await fetch('http://127.0.0.1:8000/process', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        setSupabaseData(data)

        const totalNow = data.total_now ?? 0
        const progress = getProgressToThreshold(totalNow)
        setPourcentNow(progress)
        setSaleMessage(getSaleMessage(totalNow))
        upsertTodayRecord(totalNow)

        const w = buildWeeklySalesData()
        setWeekly(w)
        setLineData([
          {
            id: 'Ventes',
            color: chartColors[0],
            data: w.map((d) => ({ x: d.day, y: d.ventes })),
          },
        ])

        localStorage.setItem('number_of_all_user', JSON.stringify(data.number_of_rows))
        localStorage.setItem('total_all', JSON.stringify(data.total_all))
      } catch (err) {
        console.error(err)
      }
    }

    fetchstate()
    uploadFile()
    const uploadInterval = setInterval(uploadFile, 2000)
    const interval = setInterval(fetchstate, 5000)
    return () => {
      clearInterval(interval)
      clearInterval(uploadInterval)
    }
  }, [])

  const totalNow = supabaseData?.total_now ?? 0
  const salaryToday = calculateDailySalary(totalNow)

  const statCards = useMemo(
    () => [
      {
        title: 'Total revenus',
        value: supabaseData?.total_all || 0,
        suffix: ' Ar',
        change: '+5.2%',
        icon: CircleDashed,
        accent: 'bg-green-600',
        barColor: 'bg-green-500',
        valueColor: 'text-green-400',
        progress: 70,
      },
      {
        title: 'Utilisateurs',
        value: supabaseData?.number_of_rows || 0,
        change: '+3.8%',
        icon: User2,
        accent: 'bg-blue-600',
        barColor: 'bg-blue-500',
        valueColor: 'text-blue-400',
        progress: 50,
      },
      {
        title: 'Actifs maintenant',
        value: state?.active_connections ?? state?.active_connect_now?.length ?? 0,
        change: '+8.1%',
        icon: Activity,
        accent: 'bg-purple-600',
        barColor: 'bg-purple-500',
        valueColor: 'text-purple-400',
        progress: Math.min(100, (state?.active_connections || 0) * 10),
      },
      {
        title: 'Ventes du jour',
        value: totalNow,
        suffix: ' Ar',
        change: pourcentNow >= 100 ? '+100%' : `+${Math.round(pourcentNow)}%`,
        icon: Server,
        accent: 'bg-slate-600',
        barColor: 'bg-emerald-500',
        valueColor: 'text-slate-100',
        progress: pourcentNow,
      },
    ],
    [supabaseData, state, totalNow, pourcentNow]
  )

  return (
    <AnalyticsLayout
      icon={LayoutDashboard}
      title="Dashboard"
      subtitle="Vue globale de votre hotspot en temps réel"
      badge={formatAr(totalNow)}
    >
      {/* Alerte ventes */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-xl border border-green-700/30 p-4 md:p-5
          bg-gradient-to-r from-slate-900/80 via-green-950/30 to-slate-900/80"
      >
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-emerald-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <p className="text-sm text-slate-500 uppercase tracking-widest mb-2 pl-3">Statut du jour</p>
        <h2 className="text-base md:text-lg font-semibold text-slate-200 pl-3 leading-relaxed">
          <TextType text={saleMessage} typingSpeed={22} />
        </h2>
      </motion.div>

      {/* KPIs */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {statCards.map((stat, index) => (
          <StateCard key={stat.title} stat={stat} index={index} />
        ))}
      </motion.div>

      {/* Objectif & salaire */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          { icon: Target, label: 'Objectif journalier', value: formatAr(SALARY_THRESHOLD), color: 'text-amber-400' },
          { icon: Wallet, label: 'Salaire du jour', value: formatAr(salaryToday), color: 'text-green-400' },
          { icon: TrendingUp, label: 'Progression', value: `${Math.round(pourcentNow)}%`, color: 'text-emerald-300' },
        ].map((item) => (
          <motion.div
            key={item.label}
            whileHover={{ y: -4, scale: 1.02 }}
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-600/40 bg-slate-800/20 dark:bg-black/50"
          >
            <motion.div className="p-2.5 rounded-xl bg-green-500/15">
              <item.icon className="w-5 h-5 text-green-500" />
            </motion.div>
            <motion.div>
              <p className="text-xs text-slate-500 uppercase">{item.label}</p>
              <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Graphiques NIVO */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Tendance des ventes" subtitle="7 derniers jours enregistrés">
          <ResponsiveLine
            data={lineData.length ? lineData : [{ id: 'Ventes', data: [{ x: '—', y: 0 }] }]}
            theme={nivoTheme}
            colors={chartColors}
            margin={{ top: 20, right: 24, bottom: 50, left: 56 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto' }}
            curve="monotoneX"
            axisBottom={{ tickRotation: -25 }}
            pointSize={8}
            enableArea
            areaOpacity={0.15}
            useMesh
            enableSlices="x"
          />
        </ChartCard>

        <ChartCard title="Ventes vs seuil 6 000 Ar" subtitle="Comparaison journalière">
          <ResponsiveBar
            data={weekly.length ? weekly : [{ day: '—', ventes: 0, seuil: SALARY_THRESHOLD }]}
            keys={['ventes', 'seuil']}
            indexBy="day"
            theme={nivoTheme}
            colors={['#22c55e', '#475569']}
            margin={{ top: 20, right: 24, bottom: 50, left: 56 }}
            padding={0.35}
            groupMode="grouped"
            axisBottom={{ tickRotation: -25 }}
            labelSkipWidth={12}
            labelTextColor="#0f172a"
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'top-right',
                direction: 'row',
                translateY: -12,
                itemWidth: 72,
                itemHeight: 18,
              },
            ]}
          />
        </ChartCard>
      </div>
    </AnalyticsLayout>
  )
}

export default StateGrid
