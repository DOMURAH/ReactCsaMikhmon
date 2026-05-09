import { AccessibilityIcon, ActivityIcon, ArrowRight, LucideCircleDashed, Server, Signature, User2Icon } from 'lucide-react'
import React, { useState } from 'react'
import SignUp from '../Signup/Signup'
import { useEffect } from 'react'
import { useContext } from 'react'
import { StatsContext } from '../../StatsContext'
import { pageContext } from '../Layout/Home'
import { createContext } from 'react'


const StateGrid = () => {

  const {stats , setStats} = useContext(StatsContext)

  const pageContexts = useContext(pageContext)

  const rowContext = createContext()

  const [total, setTotal] = useState(0)

  const [state, setstate] = useState(null)

  const [numberUser, setNumberUser] = useState(0)

  const [uploadGet, setUploadGet] = useState(null)

  const [supabaseData, setSupabaseData] = useState(null)


  useEffect(() =>{
    const fetchstate = () =>{
      fetch("http://127.0.0.1:8000/mikrotik",{
        credentials : "include"
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setstate(data)

          console.log(data.active_connect_now)
          localStorage.setItem("active_connections_now", JSON.stringify(data.active_connect_now))
          
          const number_of_rows = localStorage.getItem("number_of_rows ") ? JSON.parse(localStorage.getItem("number_of_rows")) : 0
          setNumberUser(number_of_rows)
          let user_number = number_of_rows

          const total_all = localStorage.getItem("total_amount") ? JSON.parse(localStorage.getItem("total_amount")) : 0
          setTotal(total_all)

          const allUser = data.all_user || []
          const allNames = localStorage.getItem("stats") ? JSON.parse(localStorage.getItem("stats")).all_name || [] : []
          console.log(allNames)

          for (let user of allUser){
            if(!allNames.includes(user.name) && user.profile === "1H"){
              setNumberUser(prev => prev + 1)
              user_number++
              localStorage.setItem("number_of_rows2", JSON.stringify(user_number))
              setTotal(prev => prev + 500)
            }
          }
          localStorage.setItem("number_of_rows", JSON.stringify(number_of_rows))

          console.log(allUser)
          console.log(stats)

          setStats(stats)
        })
        .catch(err => console.log(err))
    }

    const fileUrl = localStorage.getItem("csv_url")



    const uploadFile = async () =>{

      const responses = await fetch(fileUrl)
      const blob = await responses.blob()

      const formData = new FormData()
      formData.append("file",blob,"report.csv")

      const res = await fetch("http://127.0.0.1:8000/process",{
        method : "POST",
        body : formData,
      })

      const data = await res.json()
      setSupabaseData(data)
      console.log(data)
    }
    fetchstate()
    uploadFile()

    const uploadInterval = setInterval(uploadFile,2000)

    const interval = setInterval(fetchstate, 5000)

    return () => {
      clearInterval(interval)
      clearInterval(uploadInterval)
    }
  },[])

  
  const Stats = [
  {
    title : "Total revenus",
    value : `${total || 0} Ar`,
    change : "+5.2%",
    icon : LucideCircleDashed,
    color : "bg-green-500",
    bgColor : "bg-green-100",
    progress : 70,
    textColor : "text-green-500"
  },
  {
    title : "All users",
    value : `${supabaseData?.number_of_rows}`,
    change : "+3.8%",
    icon : User2Icon,
    color : "bg-blue-500",
    bgColor : "bg-blue-100",
    progress : 50,
    textColor : "text-blue-500"
  },
  {
    title : "Active now",
    value : `${state?.active_connections || 0}`,
    change : "+8.1%",
    icon : ActivityIcon,
    color : "bg-purple-500",
    bgColor : "bg-purple-100",
    progress : 80,
    textColor : "text-purple-500"
  },
  {
    title : "Total now",
    value : `${supabaseData?.total_now || 0} Ar`,
    change : "-0.1%",
    icon : Server,
    color : "bg-yellow-500",
    bgColor : "bg-yellow-100",
    progress : 99,
    textColor : "text-yellow-500"
  }
]


  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4 hover:cursor-pointer hover:shadow-lg transition-shadow duration-300'>
        {Stats.map((stat,index) => (
            <div key={index} className='bg-slate-800/50 dark:bg-slate-500/20 p-4 rounded-xl shadow-md hover:bg-slate-800/70 transition-colors duration-300
            transition-transform duration-300 hover:scale-105' onClick={() => pageContexts.setCurrentPage(stat.title === "All users" ? "all-users" : stat.title === "Active now" ? "online" : "")}>
                <div className={`w-10 h-10 ${stat.bgColor} ${stat.color} rounded-full flex items-center justify-center mb-4`}>
                    <stat.icon className='w-5 h-5 text-white'/>
                </div>
                <h3 className='text-xl font-medium text-slate-400'>{stat.title}</h3>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</p>
                <div className='w-full bg-slate-700/30 rounded-full h-2 mt-2'>
                    <div className={`h-2 rounded-full ${stat.color}`} style={{width : `${stat.progress}%`}}></div>  
                </div>
            </div>
        ))}
    </div>
  )
} 

export default StateGrid