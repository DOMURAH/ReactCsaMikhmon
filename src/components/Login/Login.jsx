import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate } from 'react-router-dom'
import { createContext } from 'react'
import { useContext } from 'react'
import {AuthContext} from '../Auth/AuthContext.jsx'
import SplitText from '../ReactBits/TextSplit/SplitTexts.jsx'
import ShinyText from '../ReactBits/TextSplit/ShinyText.jsx'
import DarkVeil from '../ReactBits/TextSplit/darkVeil.jsx'
import { motion } from 'framer-motion'

const Login = () => {

    const {setUser} = useContext(AuthContext)
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [dataRes, setDataRes] = useState({})
    const [loading, setLoading] = useState(false)

    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const navigate = useNavigate()

    const envoyerRequetePost = async ()  => {
        setLoading(true)
        const url = "http://127.0.0.1:8000/login"
        const data = {
            email,
            password
        }

        try{
            const responses = await fetch(url,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(data),
                credentials:"include"
            })

            const responseData = await responses.json()
            setDataRes(responseData)
            console.log(responseData)
            console.log(responses.headers.get("set-cookie"))

            if (!responses.ok){
                throw new Error("Erreur lors de la requete")
            }

            if(responseData.acces === 1){
                console.log("Name from server:", responseData.name)
                setUser(responseData.name)
                setTimeout(() =>{
                    navigate("/dashboard")
                },100)
            }
        }
        catch(error){
            setErrorMessage(error.message)
        }

        setEmail("")
        setPassword("")

        setLoading(false)
    }

  return (
    <>
        
        <div className='relative min-h-screen w-full '>
            <div className='absolute inset-0 z-0 pointer-events-none'>
                <DarkVeil
                hueShift={0}
                noiseIntensity={0}
                scanlineIntensity={0}
                speed={0.5}
                scanlineFrequency={0}
                warpAmount={0}/>
                
            </div>
            <div className='relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2'>
                <div className=" border-r border-slate-500/60 min-h-screen p-8 flex flex-col justify-center items-center">
                    <img src='Vector (1).png' className='w-100 mx-auto my-12'/>
                    <h1 className='font-bold text-5xl text-center text-slate-500 flex flex-col items-center'>
                        {/* Texte normal */}
                        <SplitText
                            text="Transformez vos données brutes en informations exploitables"
                            delay={50}
                            className="block italic" 
                            animationFrom={{ opacity: 0, y: 40 }}
                            animationTo={{ opacity: 1, y: 0 }}
                        />
                        </h1>
                    <Link to={'/signup'}>
                        <motion.button
                        initial={{opacity : 0 }}
                        animate={{opacity : 1}}
                        transition={{duration : 6.5 ,ease : "anticipate"}}
                        className='p-5 w-70 mt-10 rounded-2xl font-bold text-slate-800 bg-gradient-to-r from-green-400/80 via-purple-400/90 to-blue-400
                        cursor-pointer transform hover:-translate-y-2 transition-all duration-300'>
                            Explorer
                        </motion.button>
                    </Link>
                </div>
                <motion.div
                initial={{opacity : 0 , y : 400}}
                animate={{opacity : 1 , y : 0}}
                transition={{duration : 2.5}}
                className=" bg-cover bg-center min-h-screen flex items-center justify-center lg:m-0">
                    <div className='p-10 rounded-2xl bg-slate-500/20 backdrop-blur-2xl space-y-5 flex flex-col justify-center items-center'>
                        <img src='Sans_titre__1_-removebg-preview.png' className='w-80'/>

                        <div className='flex items-center justify-around p-2 bg-slate-500/20 rounded-2xl w-full mb-2'> 
                            <label htmlFor="email" className='text-xl text-slate-500/80 font-bold'>Email : </label>
                            <input value={email} type="email" placeholder='Votre email' className='p-2 border-b border-slate-300/20 rounded-xl
                            placeholder:text-slate-300/20 outline-0 text-slate-100/50' onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        {emailError ? <p className='text-red-500 m-0 font-bold'> {emailError} </p> : null}

                        <div className='flex items-center justify-around p-2 bg-slate-500/20 rounded-2xl w-full mb-2'>
                            <label htmlFor="password" className='text-xl text-slate-500/80 font-bold'>Password : </label>
                            <input value={password} type="password" placeholder='Votre mot de passe' className='p-2 border-b border-slate-300/20 rounded-xl
                            placeholder:text-slate-300/20 outline-0 text-slate-100/50' onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        {passwordError ? <p className='text-red-500 m-0 font-bold'> {passwordError} </p> : null}
                        {!dataRes.acces ? <p className='text-red-500 font-bold'> {dataRes.message} </p> : null}
                        <div className='flex justify-center'>
                            <label htmlFor="condition" className='flex gap-3 font-bold text-slate-400'>
                                <input type="checkbox" required className='accent-purple-600'/>
                                <ShinyText
                                text={"J'accepte les condition !"}
                                delay={1}
                                speed={1.6}
                                color='#000000'
                                />
                            </label>
                        </div>
                        <button className='p-5 w-50 h-15 rounded-2xl font-bold text-slate-800 bg-gradient-to-r from-green-400/80 via-purple-400/90 to-blue-400
                    cursor-pointer transform hover:-translate-y-2 transition-all duration-300' onClick={() =>{
                        setEmailError("")
                        setPasswordError("")
                        setDataRes({})

                        let isValid = true

                        if (!email){
                            setEmailError("Saisir un email")
                            isValid = false
                        }

                        if(!password){
                            setPasswordError("Saisir un mot de passe")
                            isValid = false
                        }

                        if(isValid){
                            envoyerRequetePost()
                        }
                    }}>
                        {loading ? (<CircularProgress size={24} sx={{color : "white"}}/>) : ('Se connecter')}
                    </button>
                    <div className='text-slate-300'>
                        Pas de compte ?<Link to={"/signup"} className='underline text-green-400'>    crée ici !</Link>
                    </div>
                    </div>
                </motion.div>
            </div>
            

        </div>
    </>
        
        
  )
}

export default Login