import {Zap,Users,ShoppingBag,Settings,Package,MessageSquare,LayoutDashboard,FileText,CreditCard,Calendar,BarChart3, User, ChevronDown} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { StatsContext } from '../../StatsContext'
import { AuthContext } from '../Auth/AuthContext'
import { motion } from 'framer-motion'
import CountUpModule from 'react-countup'
const CountUp = CountUpModule.default


const Sidebar = ({collapsed , onToggle , currentPage , onPageChanged }) => {

    const authContext = useContext(AuthContext)
    const user = authContext?.user || "Guest"

    const [expandedItems, setExpandedItems] = useState(new Set(["analytics"]))

    const {stats , setStats} = useContext(StatsContext)

    const toggle = (itemid) =>{
        const newExpanded = new Set(expandedItems)
        
        if(newExpanded.has(itemid)){
            newExpanded.delete(itemid)
        }else{
            newExpanded.add(itemid)
        }

        setExpandedItems(newExpanded)
    }

    const menuItem = [
    {
        id : "dashboard",
        icon : LayoutDashboard,
        label : 'Dashboard',
        active : true,
        badge : 'New'
    },
    {
        id : "analytics",
        icon : BarChart3,
        label : "Analytics",
        submenu : [
            {id : "overview",label : "overview"},
            {id : 'reports',label : "Report"},
            {id : "insight",label : "Insights"}
        ]
    },
    {
        id : "all-users",
        icon : Users,
        label : "Users",
        count : localStorage.getItem("number_of_all_user") ? JSON.parse(localStorage.getItem("number_of_all_user")) : 0,
        submenu : [
            {id : "all-users",label : "All users"},
            {id : "online",label : "Online users"},
            {id : "activity",label : "User Activity"},
        ]
    },
    {
        id : "ecommerce",
        icon : ShoppingBag,
        label : "E-commerce",
        submenu : [
            {id : "product",label : "Products"},
            {id : "orders",label : "Orders"},
            {id : "customers",label : "Customers"},
        ]
    },
    {
        id : "Credit Card",
        icon : CreditCard,
        label : "Salary"
    },
    {
        id : "message",
        icon : MessageSquare,
        label : "Message",
        badge : "12"
    },
    {
        id : "Filtrage",
        icon : Calendar,
        label : "Filtrage"
    },

]


  return (
    <div className={`${collapsed ? 'w-20' : 'w-72'} transition-all ease-in duration-300 ease-in bg-white/80 dark:bg-black/90
    backdrop-blur-xl border-r border-slate-400/50 dark:border-slate-700/50 hidden flex-col
    relative z-10 md:flex`}>
        <div className=' p-6 border-r border-slate-400/50 dark:border-slate-700/50'>
            <motion.div
                initial={{opacity : 0 , x : -50}}
                animate={{opacity : 1 , x : 0}}
                transition={{
                    duration : 0.7
                }}
                className='flex items-center space-x-3 gap-3.5 bg-slate-800/10 dark:bg-gray-950 p-4 rounded-xl'>
                {!collapsed && <>
                <div className='w-10 h-10 bg-gradient-to-r from-green-600 via-green-400 to-black-600 rounded-xl
                flex items-center justify-center shadow-lg'>
                    <Zap className='w-6 h-6 text-white dark:text-black'/>
                </div>
                <div className='flex justify-center items-center flex-col'>
                    <h1 className='text-xl font-bold text-slate-800 dark:text-white'>CSVMikhmon</h1>
                    <p className='text-xs text-slate-600 dark:text-slate-300'>Admin panel</p>
                </div>
                </>}
            </motion.div>
        </div>

        {/**Navigation */}
        <nav className='flex-1 p-4 space-y-2 overflow-y-auto  transition-all duration-300'>
            {menuItem.map((items,index) =>{
                return(
                <motion.div 
                key={index} 
                className=''
                initial={{opacity : 0 , x : -50}}
                animate={{opacity : 1 , x : 0}}

                transition={{
                    duration : 0.4,
                    delay : index * 0.4
                }}

                
                >
                    <button className={`w-full flex items-center justify-between p-3 rounded-xl cursor-pointer border border-green-700/20
                        transition-all duration-300 dark:bg-black/20 bg-slate-700/30 hover:bg-slate-700/60 ${currentPage === items.id || items.active ? 'bg-linear-to-r from-black-500 to-green-600 shadow-lg font-bold' : 'dark:text-slate-200 font-semibold\
                            dark:hover:bg-slate-500/30'}`} onClick={() => {
                                    if (collapsed){
                                        onToggle()
                                    }
                                // if(items.submenu){
                                    toggle(items.id)
                                // }else{
                                    onPageChanged(items.id)
                                // }
                            }}>
                        <div className='flex items-center space-x-3'>
                            <items.icon className='w-5 h-5 dark:text-slate-300 text-slate-500'/>
                            <>
                                {!collapsed && <span className='dark:text-slate-200 text-slate-800/70'> {items.label} </span>}
                                {!collapsed && items.badge ? <span className='px-2 py-1 bg-purple-500 text-black text-xs rounded-full font-bold'> {items.badge} </span> : null }
                                {!collapsed && items.count && (
                                    <motion.span
                                    initial={{
                                        opacity : 0
                                    }}
                                    animate={{opacity : 1}}
                                    transition={{
                                        duration : 0.2,
                                        delay : 2
                                    }}
                                    className='font-bold text-slate-600 bg-slate-900/20 px-2 rounded-full dark:text-slate-400 dark:bg-slate-500/20'>
                                        <CountUp start={0} end={items.count} duration={5} delay={7}/>
                                    </motion.span>
                                )}
                            </>
                        </div>
                        {!collapsed && items.submenu && (
                            <ChevronDown className='w-4 h-4 transition-transform text-slate-400/80 cursor-pointer '/>
                        )}
                    </button>
                    {!collapsed && items.submenu && expandedItems.has(items.id) && <div className='ml-8 mt-2 space-y-1'>
                        {items.submenu.map((subitem,index) => {
                            return <button key={index} className='text-white cursor-pointer bg-slate-800/50 dark:bg-slate-500/20 p-2 rounded-xl flex w-full
                            hover:bg-slate-800/70 transform hover:-translate-x-1 transition-all' onClick={() => onPageChanged(subitem.id)}> {subitem.label} </button>
                        })}
                    </div>}
                </motion.div>
                )
            })}
        </nav>

        <div className='p-4 border-t border-slate-400/50 dark:border-slate-700/50'>
            <div className='flex items-center space-x-3 p-3 rounded-xl bg-slate-200 dark:bg-gray-900/30'>
                {!collapsed && <>
                <img src='cartoon2.jpeg' alt='user' className='w-20 h-20 rounded-full ring-2 ring-blue-500'/>
                <div className='flex-1 min-w-0'>
                    <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-slate-800 dark:text-white'> {user} </p>
                        <p className='text-xs dark:text-slate-200/50 text-slate-600'>Administrator</p>
                    </div>
                </div>
                </>}
            </div>
        </div>
    </div>
  )
}

export default Sidebar
