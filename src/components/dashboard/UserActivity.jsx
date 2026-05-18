import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResponsiveLine } from '@nivo/line'
import { Activity, Clock, User } from 'lucide-react'
import AnalyticsLayout, { ChartCard, fadeUp } from '../analytics/AnalyticsLayout'
import { nivoTheme, chartColors } from '../../lib/nivoTheme'
import { getActiveConnections, getStoredUsers } from '../../lib/analyticsData'

const springSmooth = { type: 'spring', stiffness: 260, damping: 22 }

const UserActivity = () => {
  const [active, setActive] = useState([])
  const [history, setHistory] = useState([])
  const [lineData, setLineData] = useState([])

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/mikrotik', { credentials: 'include' })
        const data = await res.json()
        const connections = data.active_connect_now || data.active_connections || []
        setActive(connections)
        localStorage.setItem('active_connections_now', JSON.stringify(connections))

        setHistory((prev) => {
          const next = [
            ...prev.slice(-19),
            {
              time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              count: connections.length,
            },
          ]
          setLineData([
            {
              id: 'Actifs',
              color: chartColors[0],
              data: next.map((p) => ({ x: p.time, y: p.count })),
            },
          ])
          return next
        })
      } catch {
        const stored = getActiveConnections()
        setActive(stored)
      }
    }

    poll()
    const id = setInterval(poll, 4000)
    return () => clearInterval(id) // Nettoyage de l'intervalle
  }, [])

  const users = getStoredUsers()

  return (
    <AnalyticsLayout
      icon={Activity}
      title="Activité utilisateurs"
      subtitle="Sessions live & historique de connexion"
      badge={`${active.length} en ligne`}
    >
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Connectés', value: active.length, color: 'text-green-400' },
          { label: 'Comptes total', value: users.length, color: 'text-white' },
          {
            label: 'Taux activité',
            value: users.length ? `${Math.round((active.length / users.length) * 100)}%` : '0%',
            color: 'text-emerald-300',
          },
        ].map((s) => (
          <motion.div
            key={s.label}
            whileHover={{ y: -4 }}
            className="p-4 rounded-xl border border-slate-600/40 bg-slate-800/30 text-center"
          >
            <p className="text-xs text-slate-500 uppercase">{s.label}</p>
            <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <ChartCard title="Connexions dans le temps" subtitle="Polling toutes les 4s">
        <ResponsiveLine
          data={lineData.length ? lineData : [{ id: 'Actifs', data: [{ x: '—', y: 0 }] }]}
          theme={nivoTheme}
          colors={chartColors}
          margin={{ top: 20, right: 20, bottom: 50, left: 48 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 0, stacked: false }}
          axisBottom={{ tickRotation: -35 }}
          pointSize={8}
          enableArea
          areaOpacity={0.15}
          useMesh
        />
      </ChartCard>

      <motion.div
        variants={fadeUp}
        className="rounded-2xl border border-slate-600/40 overflow-hidden bg-slate-800/20 dark:bg-black/60"
      >
        <div className="p-4 border-b border-slate-700/40 flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-500" />
          <h3 className="font-bold text-white">Sessions en cours</h3>
        </div>
        <div className="divide-y divide-slate-800/60 max-h-[320px] overflow-y-auto">
          <AnimatePresence>
            {active.length === 0 ? (
              <p className="p-8 text-center text-slate-500">Aucune activité détectée</p>
            ) : (
              active.map((s, i) => (
                <motion.div
                  key={`${s.user}-${i}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ x: 6, backgroundColor: 'rgba(34,197,94,0.06)' }}
                  transition={springSmooth}
                  className="flex items-center gap-4 p-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]"
                  />
                  <User className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-200">{s.user}</p>
                    <p className="text-xs text-slate-500">{s.uptime} · {s.server}</p>
                  </div>
                  <span className="text-xs text-green-400 font-mono">{s['session-time-left']}</span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnalyticsLayout>
  )
}

export default UserActivity