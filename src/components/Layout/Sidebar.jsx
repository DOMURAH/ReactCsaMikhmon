import {
  Zap,
  Users,
  ShoppingBag,
  MessageSquare,
  LayoutDashboard,
  CreditCard,
  Calendar,
  BarChart3,
  ChevronDown,
  LayoutGrid,
  FileText,
  Lightbulb,
  Wifi,
  Upload,
  Activity,
  Package,
  ShoppingCart,
  UserCircle,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { StatsContext } from '../../StatsContext'
import { AuthContext } from '../Auth/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { UserButton } from '@clerk/react'
import CountUpModule from 'react-countup'

const CountUp = CountUpModule.default

const menuItem = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    badge: 'New',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Analytics',
    submenu: [
      { id: 'overview', label: "Vue d'ensemble", icon: LayoutGrid },
      { id: 'reports', label: 'Rapports', icon: FileText },
      { id: 'insight', label: 'Insights', icon: Lightbulb },
    ],
  },
  {
    id: 'users-group',
    icon: Users,
    label: 'Users',
    countKey: 'number_of_all_user',
    submenu: [
      { id: 'all-users', label: 'All users', icon: Users },
      { id: 'online', label: 'Online users', icon: Wifi },
      { id: 'activity', label: 'User Activity', icon: Activity },
    ],
  },
  {
    id: 'ecommerce',
    icon: ShoppingBag,
    label: 'E-commerce',
    submenu: [
      { id: 'product', label: 'Products', icon: Package },
      { id: 'orders', label: 'Orders', icon: ShoppingCart },
      { id: 'customers', label: 'Customers', icon: UserCircle },
    ],
  },
  {
    id: 'salary',
    icon: CreditCard,
    label: 'Salary',
  },
  {
    id: 'message',
    icon: MessageSquare,
    label: 'Message',
    badge: '12',
  },
  {
    id: 'Filtrage',
    icon: Calendar,
    label: 'Filtrage',
  },
]

function isItemActive(item, currentPage) {
  if (currentPage === item.id) return true
  return item.submenu?.some((s) => s.id === currentPage) ?? false
}

function isSubActive(subId, currentPage) {
  return currentPage === subId
}

const Sidebar = ({ collapsed, onToggle, currentPage, onPageChanged }) => {
  const authContext = useContext(AuthContext)
  const user = authContext?.user || 'Guest'
  const { stats } = useContext(StatsContext)

  const [expandedItems, setExpandedItems] = useState(() => {
    const initial = new Set(['analytics', 'users-group'])
    menuItem.forEach((item) => {
      if (item.submenu?.some((s) => s.id === (localStorage.getItem('currentPage') || 'dashboard'))) {
        initial.add(item.id)
      }
    })
    return initial
  })

  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    const raw = localStorage.getItem('number_of_all_user')
    if (raw) setUserCount(JSON.parse(raw))
  }, [currentPage, stats])

  useEffect(() => {
    menuItem.forEach((item) => {
      if (item.submenu?.some((s) => s.id === currentPage)) {
        setExpandedItems((prev) => new Set([...prev, item.id]))
      }
    })
  }, [currentPage])

  const toggle = (itemId) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })
  }

  const handleParentClick = (item) => {
    if (collapsed) onToggle()
    if (item.submenu) {
      toggle(item.id)
      const first = item.submenu[0]
      if (first && !item.submenu.some((s) => s.id === currentPage)) {
        onPageChanged(first.id)
      }
    } else {
      onPageChanged(item.id)
    }
  }

  return (
    <div
      className={`${collapsed ? 'w-20' : 'w-72'} transition-all ease-in duration-300
        bg-white/80 dark:bg-black/90 backdrop-blur-xl border-r border-slate-400/50
        dark:border-slate-700/50 hidden flex-col relative z-20 md:flex`}
    >
      <motion.div className="p-6 border-r border-slate-400/50 dark:border-slate-700/50">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center space-x-3 gap-3.5 bg-slate-800/10 dark:bg-gray-950 p-4 rounded-xl"
        >
          {!collapsed && (
            <>
              <div          
                className="w-10 h-10 bg-gradient-to-r from-green-600 via-green-400 to-emerald-700 rounded-xl
                  flex items-center justify-center shadow-lg"
              >
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">CSVMikhmon</h1>
                <p className="text-xs text-slate-600 dark:text-slate-300">Admin panel</p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItem.map((item, index) => {
          const active = isItemActive(item, currentPage)
          const expanded = expandedItems.has(item.id)
          const count =
            item.countKey && localStorage.getItem(item.countKey)
              ? JSON.parse(localStorage.getItem(item.countKey))
              : userCount

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleParentClick(item)}
                className={`w-full flex items-center justify-between p-3 rounded-xl cursor-pointer border
                  transition-all duration-300 ${
                    active
                      ? 'border-green-500/50 bg-gradient-to-r from-green-900/40 to-emerald-800/20 shadow-lg shadow-green-900/20'
                      : 'border-green-700/20 dark:bg-black/20 bg-slate-700/30 hover:bg-slate-700/60 dark:hover:bg-slate-800/40'
                  }`}
              >
                <motion.div className="flex items-center space-x-3 min-w-0">
                  <item.icon
                    className={`w-5 h-5 shrink-0 ${active ? 'text-green-400' : 'text-slate-500 dark:text-slate-300'}`}
                  />
                  {!collapsed && (
                    <>
                      <span
                        className={`truncate ${active ? 'text-white font-bold' : 'text-slate-800/70 dark:text-slate-200 font-semibold'}`}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-purple-500 text-black text-[10px] rounded-full font-bold shrink-0">
                          {item.badge}
                        </span>
                      )}
                      {item.countKey && (
                        <span className="font-bold text-xs text-slate-500 bg-slate-900/20 px-2 rounded-full dark:text-slate-400 dark:bg-slate-500/20 shrink-0">
                          <CountUp start={0} end={count || 0} duration={2} />
                        </span>
                      )}
                    </>
                  )}
                </motion.div>
                {!collapsed && item.submenu && (
                  <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  </motion.div>
                )}
              </motion.button>

              <AnimatePresence>
                {!collapsed && item.submenu && expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden ml-3 mt-1.5 pl-3 border-l border-green-500/20 space-y-1"
                  >
                    {item.submenu.map((sub, subIndex) => {
                      const subActive = isSubActive(sub.id, currentPage)
                      return (
                        <motion.button
                          key={sub.id}
                          type="button"
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIndex * 0.05 }}
                          whileHover={{ x: 6, scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            onPageChanged(sub.id)
                          }}
                          className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left text-sm
                            transition-all duration-200 ${
                              subActive
                                ? 'bg-gradient-to-r from-green-600/90 to-emerald-600/80 text-white font-bold shadow-md shadow-green-900/30'
                                : 'text-slate-300 bg-slate-800/40 dark:bg-slate-800/30 hover:bg-slate-700/50 hover:text-white'
                            }`}
                        >
                          <sub.icon className={`w-4 h-4 shrink-0 ${subActive ? 'text-white' : 'text-green-500/80'}`} />
                          <span className="truncate">{sub.label}</span>
                          {subActive && (
                            <motion.span
                              layoutId="submenuActive"
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                            />
                          )}
                        </motion.button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-400/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-200 dark:bg-gray-900/30">
          {!collapsed && (
            <>
              <UserButton
                afterSignOutUrl="/"
                userProfileMode="modal"
                appearance={{
                  elements: {
                    avatarBox: 'w-14 h-14 rounded-full ring-2 ring-green-500',
                    userButtonPopoverCard: 'bg-slate-900 border border-slate-600 shadow-xl',
                    userButtonPopoverActionButtonText: '!text-white',
                  },
                }}
              />
              <motion.div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{user}</p>
                <p className="text-xs dark:text-slate-200/50 text-slate-600">Administrator</p>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
