import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import { LayoutGrid, TrendingUp, Users, Wallet } from 'lucide-react'
import AnalyticsLayout, { ChartCard, fadeUp } from './AnalyticsLayout'
import { nivoTheme, chartColors } from '../../lib/nivoTheme'
import {
  fetchProcessStats,
  buildWeeklySalesData,
  getStoredUsers,
  getActiveConnections,
} from '../../lib/analyticsData'
import { formatAr } from '../../lib/salary'

function KpiCard({ icon: Icon, label, value, accent }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.02 }}
      className="rounded-xl border border-slate-600/40 bg-slate-800/25 dark:bg-black/70 p-5
        hover:border-green-500/40 hover:shadow-[0_16px_40px_-12px_rgba(34,197,94,0.2)] transition-all"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${accent}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="text-2xl font-black text-white mt-1">{value}</p>
    </motion.div>
  )
}

const Overview = () => {
  const [process, setProcess] = useState(null)
  const [weekly, setWeekly] = useState([])
  const [lineData, setLineData] = useState([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchProcessStats()
      setProcess(data)
      const w = buildWeeklySalesData()
      setWeekly(w)
      setLineData([
        {
          id: 'Ventes',
          color: chartColors[0],
          data: w.map((d, i) => ({ x: d.day, y: d.ventes })),
        },
        {
          id: 'Salaire',
          color: chartColors[2],
          data: w.map((d) => ({ x: d.day, y: d.salaire })),
        },
      ])
    }
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [])

  const users = getStoredUsers()
  const active = getActiveConnections()

  return (
    <AnalyticsLayout
      icon={LayoutGrid}
      title="Vue d'ensemble"
      subtitle="KPIs et tendances en temps réel"
      badge={process ? `${formatAr(process.total_now || 0)} aujourd'hui` : 'Chargement…'}
    >
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={Wallet} label="Ventes du jour" value={formatAr(process?.total_now || 0)} accent="bg-green-600" />
        <KpiCard icon={TrendingUp} label="Revenus totaux" value={formatAr(process?.total_all || 0)} accent="bg-emerald-700" />
        <KpiCard icon={Users} label="Utilisateurs" value={process?.number_of_rows ?? users.length} accent="bg-blue-600" />
        <KpiCard icon={LayoutGrid} label="Connexions actives" value={active.length} accent="bg-purple-600" />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Évolution 7 jours" subtitle="Ventes & salaire journalier">
          <ResponsiveLine
            data={lineData}
            theme={nivoTheme}
            colors={chartColors}
            margin={{ top: 20, right: 24, bottom: 50, left: 56 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', stacked: false }}
            curve="monotoneX"
            axisBottom={{ tickRotation: -25 }}
            axisLeft={{ format: (v) => `${(v / 1000).toFixed(0)}k` }}
            pointSize={8}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enableArea
            areaOpacity={0.12}
            useMesh
            enableSlices="x"
            legends={[
              {
                anchor: 'top-right',
                direction: 'row',
                translateY: -16,
                itemWidth: 80,
                itemHeight: 18,
                symbolSize: 10,
              },
            ]}
          />
        </ChartCard>

        <ChartCard title="Ventes vs seuil" subtitle="Comparaison par jour">
          <ResponsiveBar
            data={weekly}
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
                translateY: -16,
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

export default Overview
