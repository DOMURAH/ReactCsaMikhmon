import React, { useEffect , useState } from 'react'
import { useContext } from 'react'
import { StatsContext } from '../../StatsContext'

const Users = () => {

    const [allUser, setAllUser] = useState([])
    const [userUpload, setUserUpload] = useState([])

    useEffect(() =>{
            fetch("http://127.0.0.1:8000/mikrotik",{
                credentials : "include"
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setAllUser(data.all_user)
                    localStorage.setItem("all_user", JSON.stringify(data.all_user))
                    setUserUpload(localStorage.getItem("user_by_upload") ? JSON.parse(localStorage.getItem("user_by_upload")) : [])
                })
                .catch(err => console.log(err))
    },[])

    console.log(userUpload)
  return (
    <div>
        <h1 className='text-3xl font-bold text-slate-500/80'>All users</h1>
        <div className='mt-6 space-y-4'>
            <table className='border-collapse border border-slate-400 w-full text-center text-slate-300 text-sm
            rounded-lg overflow-hidden'>
                <thead>
                    <tr className='bg-slate-700/50 p-6'>
                        <th className='text-left text-slate-400/80 p-2'>name</th>
                        <th className='text-left text-slate-400/80'>password</th>
                        <th className='text-left text-slate-400/80'>Profile</th>
                    </tr>
                </thead>
                <tbody>
                    {allUser.map((user,index) =>{
                        return(
                            <tr key={index} className='bg-slate-800/50 border-t border-slate-400/50 p-4'>
                                <td className='text-left p-2'>{user.name}</td>
                                <td className='text-left'>{user.password}</td>
                                <td className='text-left'>{user.profile}</td>
                            </tr>
                        )
                    })}
                    {userUpload.map((user,index) =>{
                        return (
                            <tr key={index} className='bg-slate-800/50 border-t border-slate-400/50 p-4'>
                                <td className='text-left p-2'>{user.name}</td>
                                <td className='text-left'>{user.password}</td>
                                <td className='text-left'>{user['limit-uptime']}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Users