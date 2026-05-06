import { createContext , useEffect, useState } from "react";

export const StatsContext = createContext()

export const StatsProvider = ({children}) =>{
    const [stats, setStats] = useState(null)

    useEffect(() =>{
        const saved = localStorage.getItem("stats")
        if(saved){
            setStats(JSON.parse(saved))
        }
    },[])

    return (
        <StatsContext.Provider value={{stats , setStats}}>
            {children}
        </StatsContext.Provider>
    )
}   