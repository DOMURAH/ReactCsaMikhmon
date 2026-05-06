import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const OnlineUser = () => {

  const [active, setActive] = useState([])

  useEffect(() =>{
    let active = localStorage.getItem("active_connections_now") ? JSON.parse(localStorage.getItem("active_connections_now")) : []
    setActive(active)
  },[])

  return (
    <div>
        <h1 className='text-3xl font-bold text-slate-500/80'>Active connections now</h1>
        <div className='mt-6 space-y-4'>
            <table className='border-collapse border border-slate-400 w-full text-center text-slate-300 text-sm rounded-lg overflow-hidden'>
                <thead>
                    <tr className='bg-slate-700/50 p-6 text-2xl font-bold'>
                        <th className='text-center text-slate-400/80 p-2'>name</th>
                        <th className='text-center text-slate-400/80'>profile</th>
                        <th className='text-center text-slate-400/80'>uptime</th>
                        <th className='text-center text-slate-400/80'>session-time-left</th>
                        <th className='text-center text-slate-400/80'>Server</th>
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