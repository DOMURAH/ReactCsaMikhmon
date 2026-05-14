import React from 'react'
import {motion} from 'framer-motion'
import { AlignVerticalJustifyStartIcon, SunIcon , FilterIcon , LucideSquareDashedText , Calendar , MoonIcon } from 'lucide-react'
import CountUpModule from 'react-countup'
const CountUp = CountUpModule.default
import { useState } from 'react'
import Select from 'react-select'
import DottedGlowBackgroundDemo from '../dotted-glow-background-demo'
import { HoverBorderGradientDemo } from '../ui/HoverBorderGradientDemo'


const Filtrage = () => {

    const options = [
        { 
            value: 'Date précis', 
            label: 'Date précis',
            icon: Calendar
        },
        { 
            value: 'annees', 
            label: 'Années',
            icon: AlignVerticalJustifyStartIcon
        },
        {
            value : "Mois",
            label : "Mois",
            icon : MoonIcon
        },
        {
            value : "Jour",
            label : "Jour",
            icon : SunIcon
        }
    ];

    let formatOptionLabel = (option) =>{
        const IconComponent = option.icon
        return (
            <div className='flex items-center gap-2'>
                <IconComponent size={18}/>
                <span className='hover:text-green-500'> {option.label} </span>
            </div>
        )
    }

    const customStyles = {
        option: (provided) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            cursor : "pointer",
            backgroundColor : "black",
            borderBottom : "1px solid white"
        }),
        singleValue: (provided) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        }),
    };

    const [selectedFilter, setSelectedFilter] = useState("Date précis")
    const [years, setYears] = useState(String(new Date().getFullYear()))
    const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2,'0'))
    const [day, setDay] = useState(String(new Date().getDate()).padStart(2,'0'))

    const sendDateFiltred = async () =>{
        const currentDate = `${years}-${month}-${day}`
        console.log("Full Date : ",currentDate)
        const urlFile = localStorage.getItem("csv_url")
        const blob = await (await fetch(urlFile)).blob()
        const formData = new FormData()
        formData.append("file",blob,"report.csv")
        formData.append("textData",currentDate)
        fetch("http://127.0.0.1:8000/date_precis",{
            method : "POST",
            body : formData
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
    }

    console.log(years)

    const handleFilterChange = (option) => {
        setSelectedFilter(option.value)
        console.log('Filtre sélectionné:', option.value)
        // Ajoutez votre logique ici
    }

  return (
    <motion.div
    initial={{opacity : 0 , y : 10}}
    animate={{opacity : 1 , y : 0}}
    transition={{duration : 2}}
    className='min-h-screen rounded-xl p-5 border border-slate-500/50 backdrop-filter'
    >
        <div className='relative z-10 gap-5 grid grid-cols-1 lg:grid-cols-[1fr_2fr]'>
            <div className='flex items-center flex-col justify-between dark:text-slate-500/80
                            font-bold text-3xl p-4 dark:bg-slate-800/20 rounded-xl italic'>
                <div className='flex items-center justify-between w-full'>
                    <h2>Total revenus</h2>
                    <AlignVerticalJustifyStartIcon/>
                </div>
                <div className="w-full m-5">
                    <h1 className='text-left text-slate-200'>
                        <CountUp
                        start={0}
                        end={localStorage.getItem("total_all")}
                        suffix=" Ar"
                        />
                    </h1>
                </div>
            </div>
            <div className="relative font-bold text-xl bg-gradient-to-r rounded-xl p-5 grid  w-full">
                {/* Fond du filtrage */}
                <div className='absolute inset-0 rounded-xl overflow-hidden w-full'>
                    <DottedGlowBackgroundDemo/>
                </div>
                
                {/* Contenu par-dessus */}
                <div className='relative z-10 space-y-5'>
                <div className='flex items-center justify-between'>
                    <h1>FILTRAGE PAR</h1>
                    <Select
                    options={options}
                    formatOptionLabel={formatOptionLabel}
                    styles={customStyles}
                    onChange={handleFilterChange}
                    />
                    <FilterIcon color='white'/>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-5 mt-5 w-full'>
                    {/* Si la selection est par Date  Precis*/}
                    {selectedFilter === "Date précis" && <>
                    <input 
                    type="number" 
                    placeholder='2026..' 
                    value={years} 
                    onChange={(e) => setYears(e.target.value)}
                    className='border-2 p-2 outline-none rounded-xl font-bold bg-black text-green-400'/>
                    <input 
                    type="number" 
                    placeholder='05..' 
                    value={month} 
                    onChange={(e) => setMonth(e.target.value)}
                    className='border-2 p-2 outline-none rounded-xl font-bold bg-black text-green-400'/>
                    <input 
                    type="number" 
                    placeholder='13..' 
                    value={day} 
                    onChange={(e) => setDay(e.target.value)}
                    className='border-2 p-2 outline-none rounded-xl font-bold bg-black text-green-400'/>
                    <HoverBorderGradientDemo onClick={() => {
                        sendDateFiltred()
                    }}/>
                    </>}

                    {/* Si la selection est par Anneé */}
                    {selectedFilter === "annees" && 
                    <>
                        <div className='grid grid-cols-[2fr_1fr] gap-5 w-full lg:col-span-4'>
                            <input 
                            type="number" 
                            min={2023}
                            max={2100}
                            placeholder='2026..' 
                            value={years} 
                            onChange={(e) => setYears(e.target.value)}
                            className='border-2 p-2 outline-none rounded-xl font-bold bg-black text-green-400'/>
                                                
                            <HoverBorderGradientDemo/>

                        </div>
                    </> }
                    {/* Si la selection est par Mois */}
                    {selectedFilter === "Mois" && <>
                        <div className='grid grid-cols-[2fr_1fr] gap-5 w-full lg:col-span-4'>
                            <input 
                            type="number" 
                            placeholder='05..' 
                            min={1}
                            max={12}
                            value={month} 
                            onChange={(e) => setMonth(e.target.value)}
                            className='border-2 p-2 outline-none rounded-xl font-bold bg-black text-green-400'/>
                            <HoverBorderGradientDemo/>
                        </div>
                    </>}
                    {selectedFilter === "Jour" && <>
                        <div className='grid grid-cols-[2fr_1fr] gap-5 w-full lg:col-span-4'>
                            <input 
                            type="number" 
                            placeholder='05..' 
                            min={1}
                            max={31}
                            value={day} 
                            onChange={(e) => setDay(e.target.value)}
                            className='border-2 p-2 outline-none rounded-xl font-bold bg-black text-green-400'/>
                            <HoverBorderGradientDemo/>
                        </div>
                    </>}
                </div>
                </div>
            </div>
        </div>
    </motion.div>
  )
}

export default Filtrage