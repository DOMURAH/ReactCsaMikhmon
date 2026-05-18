import React from 'react'
import { motion } from 'framer-motion'

const springSmooth = { type: 'spring', stiffness: 260, damping: 22 }

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, borderColor: 'rgba(34, 197, 94, 0.35)' }}
      transition={springSmooth}
      className={`rounded-2xl border border-slate-600/40 bg-slate-800/20 dark:bg-black/60 p-5
        hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] transition-shadow duration-500 ${className}`}
    >
      <motion.div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </motion.div>
      <div className="h-[300px] w-full">{children}</div>
    </motion.div>
  )
}

export default function AnalyticsLayout({ icon: Icon, title, subtitle, badge, children }) {
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
        className="group relative overflow-hidden rounded-3xl border border-green-700/30 p-6 md:p-8
          bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-green-950/40
          dark:from-black/80 dark:to-green-950/30
          hover:border-green-500/45 hover:shadow-[0_-25px_60px_-15px_rgba(34,197,94,0.18)]
          transition-[box-shadow,border-color] duration-500"
      >
        <motion.div
          className="absolute -top-20 -right-20 w-56 h-56 bg-green-500/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 8 }}
              transition={springSmooth}
              className="p-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-900/30"
            >
              <Icon className="w-7 h-7 text-white" />
            </motion.div>
            <motion.div>
              <h1 className="text-2xl md:text-3xl font-bold text-white italic">{title}</h1>
              <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
            </motion.div>
          </div>
          {badge && (
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-2 rounded-full text-sm font-semibold
                bg-green-500/15 border border-green-500/30 text-green-400"
            >
              {badge}
            </motion.span>
          )}
        </div>
      </motion.div>
      {children}
    </motion.div>
  )
}
