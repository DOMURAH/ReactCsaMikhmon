import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users as UsersIcon,
  UserPlus,
  Shield,
  Search,
  Wifi,
  Upload,
  Sparkles,
} from 'lucide-react'

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

function getInitials(name = '') {
  return name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || '?'
}

function profileStyle(profile) {
  const p = String(profile || '').toLowerCase()
  if (p.includes('1h') || p.includes('hour'))
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
  if (p.includes('day') || p.includes('jour'))
    return 'bg-blue-500/20 text-blue-400 border-blue-500/40'
  return 'bg-purple-500/20 text-purple-400 border-purple-500/40'
}

function StatBadge({ icon: Icon, label, value, accent, delay = 0 }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.02, transition: springSmooth }}
      className="group relative overflow-hidden rounded-xl border border-slate-600/40
        bg-slate-800/25 dark:bg-black/70 p-5
        hover:border-green-500/40 hover:shadow-[0_20px_50px_-12px_rgba(34,197,94,0.2)]
        transition-shadow duration-500"
    >
      <motion.div
        className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-green-500/10 blur-2xl
          opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        whileHover={{ rotate: 8, scale: 1.1 }}
        transition={springSmooth}
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${accent}`}
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>
      <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-3xl font-black text-slate-800 dark:text-white mt-1"
      >
        {value}
      </motion.p>
    </motion.div>
  )
}

function UserRow({ user, index, source, columns }) {
  const name = user.name || user.user || '—'
  const col2 = columns[1].get(user)
  const col3 = columns[2].get(user)

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      whileHover={{
        backgroundColor: 'rgba(34, 197, 94, 0.08)',
        scale: 1.005,
      }}
      className="group border-t border-slate-700/40 transition-colors"
    >
      <td className="p-4">
        <motion.div className="flex items-center gap-3" whileHover={{ x: 4 }}>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 6 }}
            transition={springSmooth}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
              bg-gradient-to-br from-green-500/30 to-emerald-700/20 border border-green-500/30
              text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.15)] group-hover:shadow-[0_0_28px_rgba(34,197,94,0.35)]"
          >
            {getInitials(name)}
            <motion.span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-slate-900"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <motion.div>
            <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">
              {name}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{source}</p>
          </motion.div>
        </motion.div>
      </td>
      <td className="p-4 font-mono text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
        {col2 || '—'}
      </td>
      <td className="p-4">
        <motion.span
          whileHover={{ scale: 1.08 }}
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${profileStyle(col3)}`}
        >
          {col3 || '—'}
        </motion.span>
      </td>
    </motion.tr>
  )
}

const Users = () => {
  const [allUser, setAllUser] = useState([])
  const [userUpload, setUserUpload] = useState([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('mikrotik')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/mikrotik', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setAllUser(data.all_user || [])
        localStorage.setItem('all_user', JSON.stringify(data.all_user || []))
        setUserUpload(
          localStorage.getItem('user_by_upload')
            ? JSON.parse(localStorage.getItem('user_by_upload'))
            : []
        )
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filterUsers = (list, getName) => {
    const q = search.trim().toLowerCase()
    if (!q) return list
    return list.filter((u) => getName(u).toLowerCase().includes(q))
  }

  const mikrotikFiltered = useMemo(
    () => filterUsers(allUser, (u) => u.name || ''),
    [allUser, search]
  )
  const uploadFiltered = useMemo(
    () => filterUsers(userUpload, (u) => u.name || ''),
    [userUpload, search]
  )

  const displayed = activeTab === 'mikrotik' ? mikrotikFiltered : uploadFiltered
  const totalCount = allUser.length + userUpload.length

  const mikrotikColumns = [
    { label: 'Utilisateur', get: () => null },
    { label: 'Mot de passe', get: (u) => u.password },
    { label: 'Profil', get: (u) => u.profile },
  ]
  const uploadColumns = [
    { label: 'Utilisateur', get: () => null },
    { label: 'Mot de passe', get: (u) => u.password },
    { label: 'Limite', get: (u) => u['limit-uptime'] },
  ]
  const columns = activeTab === 'mikrotik' ? mikrotikColumns : uploadColumns

  const tabs = [
    { id: 'mikrotik', label: 'MikroTik', icon: Wifi, count: allUser.length },
    { id: 'upload', label: 'Import CSV', icon: Upload, count: userUpload.length },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Hero */}
      <motion.div
        variants={fadeUp}
        whileHover={{ scale: 1.002 }}
        transition={springSmooth}
        className="group relative overflow-hidden rounded-2xl border border-green-700/30 p-6 md:p-8
          bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-green-950/40
          dark:from-black/80 dark:to-green-950/30
          hover:border-green-500/45 hover:shadow-[0_25px_60px_-15px_rgba(34,197,94,0.18)]
          transition-[box-shadow,border-color] duration-500"
      >
        <motion.div
          className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
            bg-[radial-gradient(ellipse_at_bottom_left,_rgba(34,197,94,0.1),_transparent_60%)]"
        />

        <motion.div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <motion.div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.12, rotate: 10 }}
              transition={springSmooth}
              className="p-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500
                shadow-lg shadow-green-900/40"
            >
              <UsersIcon className="w-7 h-7 text-white" />
            </motion.div>
            <motion.div>
              <h1 className="text-2xl md:text-3xl font-bold text-white italic">All users</h1>
              <p className="text-sm text-slate-400 mt-1 group-hover:text-slate-300 transition-colors">
                Gestion centralisée — MikroTik & import CSV
              </p>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full
              bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Synchronisation…' : `${totalCount} comptes`}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <StatBadge icon={Wifi} label="MikroTik" value={allUser.length} accent="bg-green-600" />
        <StatBadge icon={Upload} label="Import CSV" value={userUpload.length} accent="bg-blue-600" />
        <StatBadge icon={Shield} label="Total" value={totalCount} accent="bg-emerald-700" />
      </motion.div>

      {/* Toolbar */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"
      >
        <motion.div className="flex gap-2 p-1 rounded-xl bg-slate-800/40 dark:bg-black/50 border border-slate-600/30">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="userTab"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600
                    shadow-[0_4px_20px_rgba(34,197,94,0.35)]"
                  transition={springSmooth}
                />
              )}
              <tab.icon className="relative w-4 h-4" />
              <span className="relative">{tab.label}</span>
              <span
                className={`relative text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-slate-700/50'
                }`}
              >
                {tab.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-slate-800/30 dark:bg-black/60 border border-slate-600/40
            focus-within:border-green-500/50 focus-within:shadow-[0_0_24px_rgba(34,197,94,0.12)]
            transition-all duration-300"
        >
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500 w-full min-w-[200px]"
          />
        </motion.div>
      </motion.div>

      {/* Table */}
      <motion.div
        variants={fadeUp}
        whileHover={{ borderColor: 'rgba(34, 197, 94, 0.35)' }}
        className="rounded-2xl border border-slate-600/40 overflow-hidden
          bg-slate-800/20 dark:bg-black/60
          shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
      >
        <motion.div
          className="px-5 py-4 border-b border-slate-700/40 flex items-center justify-between"
          whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.04)' }}
        >
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <motion.div whileHover={{ rotate: 12 }} transition={springSmooth}>
              <UserPlus className="w-5 h-5 text-green-500" />
            </motion.div>
            {activeTab === 'mikrotik' ? 'Utilisateurs MikroTik' : 'Utilisateurs importés'}
          </h2>
          <motion.span
            key={displayed.length}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-xs text-slate-500 uppercase tracking-wide"
          >
            {displayed.length} affiché{displayed.length > 1 ? 's' : ''}
          </motion.span>
        </motion.div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-700/40 bg-slate-900/30">
                <th className="p-4 font-semibold">{columns[0].label}</th>
                <th className="p-4 font-semibold">{columns[1].label}</th>
                <th className="p-4 font-semibold">{columns[2].label}</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={3} className="p-12 text-center">
                      <motion.div
                        className="inline-flex flex-col items-center gap-3 text-slate-500"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <motion.div
                          className="w-10 h-10 rounded-full border-2 border-green-500/30 border-t-green-500"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Chargement des utilisateurs…
                      </motion.div>
                    </td>
                  </motion.tr>
                ) : displayed.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <td colSpan={3} className="p-12 text-center text-slate-500">
                      {search ? 'Aucun résultat pour cette recherche.' : 'Aucun utilisateur.'}
                    </td>
                  </motion.tr>
                ) : (
                  displayed.map((user, index) => (
                    <UserRow
                      key={`${activeTab}-${user.name}-${index}`}
                      user={user}
                      index={index}
                      source={activeTab === 'mikrotik' ? 'MikroTik' : 'CSV'}
                      columns={columns}
                    />
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Users
