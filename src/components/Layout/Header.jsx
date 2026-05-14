import { Bell, Filter, Menu, Plus, Search, Settings, Sun } from 'lucide-react'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Header = ({sidebarCollapsed,onToggleSidebar}) => {
  return (
    <div className='bg-white/50 dark:bg-black/80 backdrop-blur-xl
    border-b border-slate-200/90 dark:border-slate-200/15 px-6 py-10 overflow-hidden'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
                <motion.button
                initial={{opacity : 0 , y : -50}}
                animate={{opacity : 1 , y : 0}}
                transition={{
                    duration : 0.8,
                    ease : "easeIn"
                }}
                
                className='cursor-pointer p-2 rounded-lg hover:dark:bg-slate-500/20 hover:bg-slate-200 transition-all duration-300' onClick={onToggleSidebar}>
                    <Menu className='text-slate-500 dark:text-slate-500'/>
                </motion.button>
                <div className='hidden lg:block'>
                    <motion.h1
                    initial={{opacity : 0 , y : -50}}
                    animate={{opacity : 1 , y : 0}}
                    transition={{
                    duration : 0.3,
                    ease : "easeInOut"
                    }}
                    className='text-2xl font-bold text-slate-800 dark:text-slate-400'>Dashboard</motion.h1>
                    <motion.p
                    initial={{opacity : 0 , y : 50}}
                    animate={{opacity : 1 , y : 0}}
                    transition={{
                    duration : 0.5,
                    ease : "easeInOut"
                    }}
                    className='text-[14px] text-slate-500'>Bienvenue de nouveau Domurah😃,<br/>Voici ce qui se passe aujourd'hui✨</motion.p>
                </div>
            </div>
            <motion.div 
            initial={{opacity : 0 , y : -50}}
                    animate={{opacity : 1 , y : 0}}
                    transition={{
                    duration : 0.7,
                    ease : "easeInOut"
                    }}
            className='flex-1 max-w-xs mx-8 overflow-hidden'>
                <div className='flex gap-5 justify-between w-full items-center p-3 dark:bg-slate-500/20 rounded-3xl bg-slate-500/20'>
                    <motion.button
                    initial={{opacity : 0 , y : 50}}
                    animate={{opacity : 1 , y : 0}}
                    transition={{
                    duration : 0.7,
                    ease : "easeInOut",
                    delay : 1   
                    }}
                    >
                        <Search className='w-5 h-5 text-slate-400'/>
                    </motion.button>
                    <motion.input
                    initial={{opacity : 0 }}
                    animate={{opacity : 1}}
                    transition={{
                    duration : 0.2,
                    ease : "easeInOut",
                    }}
                    type='text' placeholder='Search Anithing' className='dark:text-slate-300 text-slate-500 outline-none placeholder:text-slate-400 pr-4 w-full'/>
                    <motion.button 
                    initial={{opacity : 0 , y : 50}}
                    animate={{opacity : 1 , y : 0}}
                    transition={{
                    duration : 0.7,
                    ease : "easeInOut",
                    delay : 1   
                    }}
                    className='cursor-pointer p-2 rounded-lg hover:dark:bg-slate-500/20 hover:bg-slate-200 transition-all duration-300'>
                        <Filter className='w-5 h-5 text-slate-400'/>
                    </motion.button>
                </div>
            </motion.div>
            <div className='flex items-center space-x-3'>
                <Link to='/upload'>
                    <motion.button
                    initial={{opacity : 0 , y : 50}}
                    animate={{opacity : 1 , y : 0}}
                    transition={{duration : 2 , ease : "linear"}}
                    className='hidden lg:flex items-center space-x-2 px-4 p-2 bg-gradient-to-r from-black-500 to-purple-500
                    text-white rounded-xl hover:shadow-lg transition-all cursor-pointer'>
                        <Plus className='w-4 h-4'/>
                        <span className='text-sm font-bold'>New</span>
                    </motion.button>
                </Link>
                <motion.button 
                initial={{opacity : 0 , y : 50}}
                    animate={{opacity : 1 , y : 0}}
                    transition={{duration : 2.5 , ease : "linear"}}
                className='p-2 rounded-xl text-slate-600 hover:bg-slate-600/20 cursor-pointer transition-all duration-300 ease-in-out'>
                    <Sun className='w-5 h-5'/>
                </motion.button>
                <motion.button
                initial={{opacity : 0 , y : 50}}
                    animate={{opacity : 1 , y : 0}}
                    transition={{duration : 3 , ease : "linear", delay : 1}}
                className='p-2 relative cursor-pointer rounded-xl dark:hover:bg-slate-300/10 hover:bg-slate-500/20 transition-all'>
                    <Bell className='w-5 h-5 text-slate-500'/>
                    <span className='absolute top-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full'>3</span>
                </motion.button>
                <motion.button
                initial={{opacity : 0 , y : 50}}
                    animate={{opacity : 1 , y : 0}}
                    transition={{duration : 2.5 , ease : "linear" , delay : 2}}
                className='p-2 relative cursor-pointer rounded-xl dark:hover:bg-slate-300/10 hover:bg-slate-500/20 transition-all'>
                    <Settings className='w-5 h-5 text-slate-500'/>
                </motion.button>
            </div>
        </div>
    </div>
  )
}

export default Header