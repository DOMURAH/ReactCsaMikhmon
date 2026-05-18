import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Radio, Server, Clock, Sparkles } from 'lucide-react'

const springSmooth = { type: 'spring', stiffness: 260, damping: 22 }

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
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

function OnlineRow({ user, index }) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      whileHover={{
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        scale: 1.008,
      }}
      className="group border-t border-slate-700/40"
    >
      <td className="p-4">
        <motion.div className="flex items-center justify-center gap-2" whileHover={{ scale: 1.05 }}>
          <motion.span
            className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">
            {user.user}
          </span>
        </motion.div>
      </td>
      <td className="p-4 text-center">
        <motion.span
          whileHover={{ scale: 1.08 }}
          className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold
            bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        >
          1H
        </motion.span>
      </td>
      <td className="p-4 text-center font-mono text-sm text-slate-400 group-hover:text-green-300 transition-colors">
        {user.uptime}
      </td>
      <td className="p-4 text-center text-slate-300">{user['session-time-left']}</td>
      <td className="p-4 text-center">
        <motion.span
          whileHover={{ y: -2 }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400
            group-hover:text-slate-200 transition-colors"
        >
          <Server className="w-3.5 h-3.5" />
          {user.server}
        </motion.span>
      </td>
    </motion.tr>
  )
}

const OnlineUser = () => {
  const [active, setActive] = useState([])

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem('active_connections_now')
      setActive(stored ? JSON.parse(stored) : [])
    }
    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [])

  const liveCount = active.length

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={fadeUp}
        whileHover={{ scale: 1.002 }}
        transition={springSmooth}
        className="group relative overflow-hidden rounded-2xl border border-green-700/30 p-6 md:p-8
          bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-emerald-950/30
          dark:from-black/80 dark:to-green-950/30
          hover:border-green-500/45 hover:shadow-[0_25px_60px_-15px_rgba(34,197,94,0.2)]
          transition-[box-shadow,border-color] duration-500"
      >
        <motion.div
          className="absolute -top-20 -right-20 w-56 h-56 bg-green-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
            bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.12),_transparent_65%)]"
        />

        <motion.div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.12, rotate: -8 }}
              transition={springSmooth}
              className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg shadow-green-500/30"
            >
              <Radio className="w-7 h-7 text-white" />
            </motion.div>
            <motion.div>
              <h1 className="text-2xl md:text-3xl font-bold italic text-transparent bg-clip-text
                bg-gradient-to-r from-slate-200 via-green-300 to-emerald-400">
                Active connections now
              </h1>
              <p className="text-sm text-slate-400 mt-1">Sessions en temps réel</p>
            </motion.div>
          </motion.div>
          <motion.div
            key={liveCount}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 px-5 py-3 rounded-xl
              bg-black/40 border border-green-500/30 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Activity className="w-5 h-5 text-green-400" />
            </motion.div>
            <div>
              <p className="text-3xl font-black text-green-400 tabular-nums">{liveCount}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">en ligne</p>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-400/80" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        whileHover={{ borderColor: 'rgba(34, 197, 94, 0.35)' }}
        className="rounded-2xl border border-slate-600/40 overflow-hidden bg-slate-800/20 dark:bg-black/60"
      >
        <motion.div
          className="px-5 py-4 border-b border-slate-700/40 flex items-center gap-2"
          whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}
        >
          <Clock className="w-5 h-5 text-green-500" />
          <span className="font-bold text-slate-800 dark:text-white">Connexions actives</span>
        </motion.div>

        <motion.div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-center text-slate-500 border-b border-slate-700/40 bg-slate-900/30">
                <th className="p-4 font-semibold">Utilisateur</th>
                <th className="p-4 font-semibold">Profil</th>
                <th className="p-4 font-semibold">Uptime</th>
                <th className="p-4 font-semibold">Temps restant</th>
                <th className="p-4 font-semibold">Serveur</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {active.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td colSpan={5} className="p-12 text-center text-slate-500">
                      <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Aucune connexion active pour le moment
                      </motion.p>
                    </td>
                  </motion.tr>
                ) : (
                  active.map((user, index) => (
                    <OnlineRow key={`${user.user}-${index}`} user={user} index={index} />
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default OnlineUser
