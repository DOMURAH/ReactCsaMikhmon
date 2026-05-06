import React, { useState } from 'react'
import { Form } from 'lucide-react'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'
import Dashboard from '../dashboard/Dashboard.jsx'
import Users from '../dashboard/Users.jsx'
import OnlineUser from '../dashboard/OnlineUser.jsx'
import { createContext } from 'react'

const pageContext = createContext()

const Home = () => {


  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')

  return (
    <pageContext.Provider value={{ currentPage, setCurrentPage }}>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50
        to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        transition-all duration-500'>
          <div className='flex h-screen overflow-hidden'>
            <Sidebar 
            collapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            currentPage={currentPage}
            onPageChanged={setCurrentPage}
            />
            <div className='flex-1 flex flex-col overflow-hidden'>
              <Header sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}/>
              <main className='flex-1 overflow-y-auto'>
                <div className='p-6 space-y-6'>
                  {currentPage === "dashboard" && <Dashboard/>}
                  {currentPage === "all-users" && <Users/>}
                  {currentPage === "online" && <OnlineUser/>}
                </div>
              </main>
            </div>
          </div>
        </div>
    </pageContext.Provider>

      
  )
}

export default Home
export {pageContext}