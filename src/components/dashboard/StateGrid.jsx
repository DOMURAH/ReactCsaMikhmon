import { AccessibilityIcon, ActivityIcon, ArrowRight, CircleDashed, Server, Signature, User2Icon } from 'lucide-react'
import React, { useState } from 'react'
import SignUp from '../Signup/Signup'
import { useEffect } from 'react'
import { useContext } from 'react'
import { StatsContext } from '../../StatsContext'
import { pageContext } from '../Layout/Home'
import { createContext } from 'react'
// import CountUp from 'react-countup';
// console.log(CountUp)
import CountUpModule from 'react-countup'
const CountUp = CountUpModule.default
import { motion , useMotionValue , useSpring } from 'framer-motion'
import { div } from 'framer-motion/client'
import TextType from '../ReactBits/TextSplit/TextType'

const iconVariants = {
  initial: {
    x: 0
  },

  hover: {
    x: 180,
    scale: 1.1
  }
}

const titleVariants = {
  initial: {
    x: 8,
    scale: 1
  },

  hover: {
    x: 11,
    y: -38,
    scale: 1
  }
}

const valueVariants = {
  initial: {
    y: 0
  },

  hover: {
    x : 15,
    y: -30,
    scale: 1.1
  }
}


const StateCard = ({ stat, index, pageContexts }) => {

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const smoothX = useSpring(x, {
    stiffness: 150,
    damping: 15
  })

  const smoothY = useSpring(y, {
    stiffness: 150,
    damping: 15
  })

  const handleMouseMove = (e) => {

    const rect = e.currentTarget.getBoundingClientRect()

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const moveX = (e.clientX - centerX) / 8
    const moveY = (e.clientY - centerY) / 8

    x.set(moveX)
    y.set(moveY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div

      initial={{ opacity: 0, scale: 0.9, y: 50 }}

      animate={{ opacity: 1, scale: 1, y: 0 }}

      transition={{
        duration: 0.4,
        delay: index * 0.1
      }}

      whileHover="hover"

      style={{
        x: smoothX,
        y: smoothY
      }}

      viewport={{once : true}}

      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}

      className='bg-slate-800/20 overflow-hidden dark:bg-black/80 dark:hover:bg-black/20 p-4 rounded-xl shadow-md
      hover:bg-slate-800/40 transition-colors duration-300
      hover:cursor-pointer hover:shadow-lg h-50 relative'
    >

      {/* ICON */}
      <motion.div
        variants={iconVariants}
        transition={{ type: "tween" }}
        className={`w-10 h-10 ${stat.bgColor} ${stat.color}
        rounded-full flex items-center justify-center
        absolute top-3 left-3`}
      >
        {React.createElement(stat.icon, {
          className: 'w-5 h-5 text-white'
        })}
      </motion.div>

      {/* TITLE */}
      <motion.h3
        variants={titleVariants}
        transition={{ type: "tween" }}
        className='text-xl font-medium dark:text-slate-400
        text-slate-800 absolute top-14'
      >
        {stat.title}
      </motion.h3>

      {/* VALUE */}
      <motion.p
        variants={valueVariants}
        transition={{ type: "tween" }}
        className={`text-3xl font-bold ${stat.textColor}
        absolute top-24`}
      >
        <CountUp
          start={0}
          end={stat.value}
          suffix={stat.price && " Ar"}
          duration={3}
        />
      </motion.p>

	<p className={`text-sm absolute top-35 ${
        stat.change.startsWith('+')
          ? 'text-green-500'
          : 'text-red-500'
      }`}>
        {stat.change}
      </p>

      <div className='w-full bg-slate-700/30 rounded-full h-2 mt-2 absolute bottom-3'>
        <div
          className={`h-2 rounded-full ${stat.color}`}
          style={{ width: `${stat.progress}%` }}
        />
      </div>


    </motion.div>
  )
}

const calculatePourcentNow = (total_now) =>{
  return (total_now * 100) / 6000
}


const StateGrid = () => {

  const {stats , setStats} = useContext(StatsContext)

  const pageContexts = useContext(pageContext)

  const rowContext = createContext()

  const [total, setTotal] = useState(0)

  const [state, setstate] = useState(null)

  const [numberUser, setNumberUser] = useState(0)

  const [uploadGet, setUploadGet] = useState(null)

  const [supabaseData, setSupabaseData] = useState(null)

  const [pourcentNow, setPourcentNow] = useState(0)

  const [saleMessage, setSaleMessage] = useState("")


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

      console.log(blob.size)

      const formData = new FormData()
      formData.append("file",blob,"report.csv")

      const res = await fetch("http://127.0.0.1:8000/process",{
        method : "POST",
        body : formData,
      })

      const data = await res.json()
      setSupabaseData(data)

      let pourcent = calculatePourcentNow(data.total_now)
      setPourcentNow(pourcent)

      /* Message de Vente */

      if (data.total_now <= 1000){
        setSaleMessage("😞 Aujourd’hui les ventes sont encore très faibles…L’objectif de 6000Ar semble loin pour le moment.")
      }
      else if (data.total_now < 3000){
        setSaleMessage("⚠️ Les ventes avancent doucement aujourd’hui. On est encore en dessous de l’objectif de 6000Ar, mais rien n’est perdu 👀")
      }
      else if (data.total_now < 5000){
        setSaleMessage("🙂 Les ventes sont plutôt stables aujourd’hui.On avance progressivement vers l’objectif de 6000Ar 📈")
      }
      else if (data.total_now < 6000){
        setSaleMessage("🚀 Excellent travail !L’objectif de 6000Ar est presque atteint 🔥Encore un petit effort et on y arrive 💯")
      }
      else if (data.total_now === 6000){
        setSaleMessage("🎉 Félicitations !L’objectif journalier de 6000Ar a été atteint avec succès 👏Très bon travail aujourd’hui 🔥")
      }
      else{
        setSaleMessage("🏆 Incroyable !L’objectif de 6000Ar a été dépassé 🚀🔥Les ventes explosent aujourd’hui, continuons cette énergie 💯💯")
      }

      localStorage.setItem("number_of_all_user",data.number_of_rows)
      localStorage.setItem("total_all",data.total_all)
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
    value : supabaseData?.total_all || 0,
    change : "+5.2%",
    icon : CircleDashed,
    color : "bg-green-500",
    bgColor : "bg-green-100",
    progress : 70,
    textColor : "text-green-500",
    price : true
  },
  {
    title : "All users",
    value : supabaseData?.number_of_rows || 0,
    change : "+3.8%",
    icon : User2Icon,
    color : "bg-blue-800",
    bgColor : "bg-blue-600",
    progress : 50,
    textColor : "text-blue-700"
  },
  {
    title : "Active now",
    value : state?.active_connections || 0,
    change : "+8.1%",
    icon : ActivityIcon,
    color : "bg-purple-800",
    bgColor : "bg-purple-400",
    progress : 80,
    textColor : "text-purple-800"

  },
  {
    title : "Total now",
    value : supabaseData?.total_now || 0,
    change : "-0.1%",
    icon : Server,
    color : "bg-gray-500",
    bgColor : "bg-gray-100",
    progress : pourcentNow,
    textColor : "text-gray-500",
    price : true
  }
]



  return (
    <div>
      <motion.div className='w-full p-3 mb-3'>
        <h1 className='text-white italic font-bold'>
          <TextType
          text= {saleMessage} 
          typingSpeed={22}
          />
        </h1>
      </motion.div>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4 '>
        {
        Stats.map((stat, index) => (
          <StateCard stat={stat} index={index}/>
        ))}
      </div>
    </div>
  )
} 

export default StateGrid