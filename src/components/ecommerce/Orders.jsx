import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveLine } from '@nivo/line'
import { ShoppingCart, CheckCircle } from 'lucide-react'
import AnalyticsLayout, { ChartCard, fadeUp } from '../analytics/AnalyticsLayout'
import { nivoTheme, chartColors } from '../../lib/nivoTheme'
import { buildWeeklySalesData, fetchProcessStats } from '../../lib/analyticsData'
import { formatAr } from '../../lib/salary'

const Orders = () => {
  const [process, setProcess] = useState(null)
  const [lineData, setLineData] = useState([])

  useEffect(() => {
    const load = async () => {
      const p = await fetchProcessStats()
      setProcess(p)
      const w = buildWeeklySalesData()
      setLineData([
        {
          id: 'Commandes (ventes)',
          color: chartColors[0],
          data: w.map((d) => ({ x: d.day, y: d.ventes })),
        },
      ])
    }
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [])

  const orders = [
    { id: '#001', client: 'CSV Hotspot', montant: process?.total_now || 0, statut: 'En cours' },
    { id: '#002', client: 'MikroTik', montant: process?.total_all || 0, statut: 'Validé' },
  ]

  return (
    <AnalyticsLayout
      icon={ShoppingCart}
      title="Commandes"
      subtitle="Suivi des ventes et transactions"
      badge={`${process?.number_of_rows ?? 0} lignes`}
    >
      <ChartCard title="Volume commandes" subtitle="Évolution sur 7 jours">
        <ResponsiveLine
          data={lineData}
          theme={nivoTheme}
          colors={chartColors}
          margin={{ top: 20, right: 20, bottom: 50, left: 56 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto' }}
          curve="monotoneX"
          axisBottom={{ tickRotation: -25 }}
          pointSize={8}
          enableArea
          areaOpacity={0.1}
          useMesh
        />
      </ChartCard>

      <motion.div variants={fadeUp} className="space-y-3">
        {orders.map((o, i) => (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ x: 8, borderColor: 'rgba(34,197,94,0.4)' }}
            className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl
              border border-slate-600/40 bg-slate-800/25"
          >
            <motion.div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-bold text-white">{o.id} — {o.client}</p>
                <p className="text-xs text-slate-500">{o.statut}</p>
              </div>
            </motion.div>
            <p className="text-xl font-black text-green-400">{formatAr(o.montant)}</p>
          </motion.div>
        ))}
      </motion.div>
    </AnalyticsLayout>
  )
}

export default Orders
