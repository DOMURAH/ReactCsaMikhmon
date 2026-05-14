import React, { useState, useEffect } from 'react'
import { Form } from 'lucide-react'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'
import Dashboard from '../dashboard/Dashboard.jsx'
import Users from '../dashboard/Users.jsx'
import OnlineUser from '../dashboard/OnlineUser.jsx'
import { createContext } from 'react'
import Filtrage from '../Filtrage/Filtrage.jsx'

const pageContext = createContext()

const Home = () => {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'dashboard'
  })

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage)
  }, [currentPage])

  return (
    <pageContext.Provider value={{ currentPage, setCurrentPage }}>
      <div className='min-h-screen dark:bg-black/90 bg-gradient-to-br dark:from-black to-green-500/20 
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
                  {currentPage === "Filtrage" && <Filtrage/>}
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