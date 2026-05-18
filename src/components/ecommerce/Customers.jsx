import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveRadar } from '@nivo/radar'
import { UserCircle } from 'lucide-react'
import AnalyticsLayout, { ChartCard, fadeUp } from '../analytics/AnalyticsLayout'
import { nivoTheme } from '../../lib/nivoTheme'
import { buildRadarData, fetchProcessStats, getStoredUsers, getActiveConnections } from '../../lib/analyticsData'

function getInitials(name = '') {
  return name.slice(0, 2).toUpperCase() || '?'
}

const Customers = () => {
  const [users, setUsers] = useState([])
  const [radar, setRadar] = useState([])

  useEffect(() => {
    const load = async () => {
      const process = await fetchProcessStats()
      setUsers(getStoredUsers().slice(0, 12))
      setRadar(buildRadarData(process, getStoredUsers(), getActiveConnections()))
    }
    load()
  }, [])

  return (
    <AnalyticsLayout
      icon={UserCircle}
      title="Clients"
      subtitle="Base clients hotspot"
      badge={`${users.length}+ clients`}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-slate-600/40 p-4 bg-slate-800/20 max-h-[400px] overflow-y-auto"
        >
          <h3 className="font-bold text-white mb-4 px-2">Liste clients</h3>
          <motion.div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-slate-500 p-4 text-center">Aucun client chargé</p>
            ) : (
              users.map((u, i) => (
                <motion.div
                  key={u.name + i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ x: 6, backgroundColor: 'rgba(34,197,94,0.08)' }}
                  className="flex items-center gap-3 p-3 rounded-xl"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/40 to-emerald-800/30 flex items-center justify-center text-sm font-bold text-green-300 border border-green-500/30"
                  >
                    {getInitials(u.name)}
                  </motion.div>
                  <div>
                    <p className="font-semibold text-slate-200">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.profile || '—'}</p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>

        <ChartCard title="Engagement clients" subtitle="Score agrégé">
          <ResponsiveRadar
            data={radar}
            keys={['value']}
            indexBy="metric"
            theme={nivoTheme}
            colors={['#22c55e']}
            margin={{ top: 32, right: 48, bottom: 32, left: 48 }}
            fillOpacity={0.2}
            dotSize={8}
          />
        </ChartCard>
      </div>
    </AnalyticsLayout>
  )
}

export default Customers