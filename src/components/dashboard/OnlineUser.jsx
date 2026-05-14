import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'

const OnlineUser = () => {

  const [active, setActive] = useState([])

  useEffect(() =>{
    let active = localStorage.getItem("active_connections_now") ? JSON.parse(localStorage.getItem("active_connections_now")) : []
    setActive(active)
  },[])

  return (
    <div>
        <motion.h1 
        initial={{
            opacity : 0,
            x : -50
        }}
        animate={{
            opacity : 1,
            x : 0
        }}
        transition={{
            duration : 0.5
        }}
        className='text-3xl font-bold text-slate-500/80 bg-linear-to-r from-gray-500/20 to-green-600 shadow-lg
        bg-clip-text text-transparent'>Active connections now</motion.h1>
        <div className='mt-6 space-y-4'>
            <table className='border-collapse border border-slate-400 w-full text-center text-slate-300 text-sm rounded-lg overflow-hidden'>
                <thead>
                    <tr className='bg-slate-700/20 p-6 text-2xl font-bold'>
                        <th className='text-center p-2'>name</th>
                        <th className='text-center'>profile</th>
                        <th className='text-center'>uptime</th>
                        <th className='text-center'>session-time-left</th>
                        <th className='text-center'>Server</th>
                    </tr>
                </thead>
                <tbody>
                    {active.map((user,index) =>{
                        return(
                            <tr key={index} className='bg-slate-800/50 border-t border-slate-400/50 p-4 font-bold text-sm'>
                                <td className='text-center p-2'>{user.user}</td>
                                <td className='text-center'>1H</td>
                                <td className='text-center'>{user.uptime}</td>
                                <td className='text-center'>{user['session-time-left']}</td>
                                <td className='text-center'>{user.server}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default OnlineUser