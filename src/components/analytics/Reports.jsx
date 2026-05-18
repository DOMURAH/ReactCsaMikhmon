import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { FileText } from 'lucide-react'
import AnalyticsLayout, { ChartCard, fadeUp } from './AnalyticsLayout'
import { nivoTheme, chartColors } from '../../lib/nivoTheme'
import {
  fetchProcessStats,
  buildMonthlyBarData,
  buildHeatmapData,
  buildProfileBarData,
  getStoredUsers,
} from '../../lib/analyticsData'
import { formatAr } from '../../lib/salary'

const Reports = () => {
  const [process, setProcess] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [heatmap, setHeatmap] = useState([])
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    const load = async () => {
      setProcess(await fetchProcessStats())
      setMonthly(buildMonthlyBarData())
      setHeatmap(buildHeatmapData())
      setProfiles(buildProfileBarData(getStoredUsers()))
    }
    load()
    const id = setInterval(load, 8000)
    return () => clearInterval(id)
  }, [])

  return (
    <AnalyticsLayout
      icon={FileText}
      title="Rapports"
      subtitle="Analyses détaillées et répartition"
      badge="Export CSV disponible"
    >
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-600/30 bg-slate-900/30"
      >
        <motion.div whileHover={{ scale: 1.02 }} className="text-center p-3">
          <p className="text-xs text-slate-500 uppercase">Lignes CSV</p>
          <p className="text-2xl font-bold text-green-400">{process?.number_of_rows ?? '—'}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="text-center p-3 border-x border-slate-700/40">
          <p className="text-xs text-slate-500 uppercase">Total journalier</p>
          <p className="text-2xl font-bold text-white">{formatAr(process?.total_now || 0)}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="text-center p-3">
          <p className="text-xs text-slate-500 uppercase">Total cumulé</p>
          <p className="text-2xl font-bold text-emerald-300">{formatAr(process?.total_all || 0)}</p>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        <ChartCard title="Revenus par mois" subtitle="Historique salaire / ventes">
          <ResponsiveBar
            data={monthly.length ? monthly : [{ mois: '—', total: 0 }]}
            keys={['total']}
            indexBy="mois"
            theme={nivoTheme}
            colors={chartColors}
            margin={{ top: 16, right: 20, bottom: 48, left: 56 }}
            padding={0.4}
            axisBottom={{ tickRotation: -30 }}
            labelTextColor="#0f172a"
          />
        </ChartCard>

        <ChartCard title="Profils utilisateurs" subtitle="Répartition MikroTik">
          <ResponsiveBar
            data={profiles.length ? profiles : [{ profile: 'Aucun', utilisateurs: 0 }]}
            keys={['utilisateurs']}
            indexBy="profile"
            theme={nivoTheme}
            colors={chartColors}
            layout="horizontal"
            margin={{ top: 16, right: 24, bottom: 40, left: 80 }}
            padding={0.35}
            labelTextColor="#0f172a"
          />
        </ChartCard>
      </div>

      <ChartCard title="Activité par créneau" subtitle="Heatmap hebdomadaire (simulation)">
        <ResponsiveHeatMap
          data={heatmap}
          theme={nivoTheme}
          margin={{ top: 24, right: 24, bottom: 48, left: 48 }}
          valueFormat=">-.0f"
          axisTop={null}
          axisRight={null}
          colors={{
            type: 'sequential',
            scheme: 'greens',
          }}
          emptyColor="#1e293b"
          legends={[
            {
              anchor: 'bottom',
              translateY: 36,
              length: 280,
              thickness: 10,
              direction: 'row',
              tickPosition: 'after',
            },
          ]}
        />
      </ChartCard>
    </AnalyticsLayout>
  )
}

export default Reports
