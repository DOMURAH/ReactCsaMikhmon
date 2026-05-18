import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'
import Dashboard from '../dashboard/Dashboard.jsx'
import Users from '../dashboard/Users.jsx'
import OnlineUser from '../dashboard/OnlineUser.jsx'
import UserActivity from '../dashboard/UserActivity.jsx'
import { createContext } from 'react'
import Filtrage from '../Filtrage/Filtrage.jsx'
import Salary from '../dashboard/Salary.jsx'
import Overview from '../analytics/Overview.jsx'
import Reports from '../analytics/Reports.jsx'
import Insights from '../analytics/Insights.jsx'
import Products from '../ecommerce/Products.jsx'
import Orders from '../ecommerce/Orders.jsx'
import Customers from '../ecommerce/Customers.jsx'
import Messages from '../messages/Messages.jsx'
import NeonSmokeCursor from '../effects/NeonSmokeCursor.jsx'

const pageContext = createContext()

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  overview: "Vue d'ensemble",
  reports: 'Rapports',
  insight: 'Insights',
  'all-users': 'All users',
  online: 'Online users',
  activity: 'User Activity',
  product: 'Products',
  orders: 'Orders',
  customers: 'Customers',
  salary: 'Salary',
  message: 'Messages',
  Filtrage: 'Filtrage',
}

const Home = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'dashboard'
  })

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage)
  }, [currentPage])

  return (
    <pageContext.Provider value={{ currentPage, setCurrentPage, pageTitle: PAGE_TITLES[currentPage] || 'Dashboard' }}>
      <motion.div className="relative min-h-screen dark:bg-black/90 bg-gradient-to-br dark:from-black to-green-500/20 transition-all duration-500 overflow-hidden">
        <NeonSmokeCursor />
        <motion.div className="relative z-10 flex h-screen overflow-hidden">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            currentPage={currentPage}
            onPageChanged={setCurrentPage}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <main className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {currentPage === 'dashboard' && <Dashboard />}
                {currentPage === 'overview' && <Overview />}
                {currentPage === 'reports' && <Reports />}
                {currentPage === 'insight' && <Insights />}
                {currentPage === 'all-users' && <Users />}
                {currentPage === 'online' && <OnlineUser />}
                {currentPage === 'activity' && <UserActivity />}
                {currentPage === 'product' && <Products />}
                {currentPage === 'orders' && <Orders />}
                {currentPage === 'customers' && <Customers />}
                {currentPage === 'salary' && <Salary />}
                {currentPage === 'message' && <Messages />}
                {currentPage === 'Filtrage' && <Filtrage />}
              </div>
            </main>
          </div>
        </motion.div>
      </motion.div>
    </pageContext.Provider>
  )
}

export default Home
export { pageContext }
