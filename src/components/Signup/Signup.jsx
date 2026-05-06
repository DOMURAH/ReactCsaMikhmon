import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'

const SignUp = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [dataRes, setDataRes] = useState({})

    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const [loading, setLoading] = useState(false)

    const envoyerRequetePost = async ()  => {

        setLoading(true)

        const url = "http://127.0.0.1:8000/register"

        const data = {
            name : name,
            email : email,
            password : password
        }

        try{
            const responses = await fetch(url,{
                method : "POST",
                headers : {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(data)
            })

            if (!responses.ok){
                throw new Error("Erreur lors de la requete")
            }

            const responseData = await responses.json()
            setDataRes(responseData)
            console.log(responseData)
        }
        catch(error){
            setErrorMessage(error.message)
        }

        finally{
            setLoading(false)
        }

        setName("")
        setEmail("")
        setPassword("")
        
    }

  return (
    <div className='min-h-screen bg-gradient-to-r from-slate-800 to-slate-700/80 grid grid-cols-1 lg:grid-cols-2'>
        <div className="bg-[url('fond-degrade-radial.png')] border-r border-slate-500/60 min-h-screen p-8 flex flex-col justify-center items-center">
            <img src='Vector (1).png' className='w-100 mx-auto my-12'/>
            <h1 className='font-bold text-5xl text-center text-slate-500'>Transformez vos données brutes en <span className='bg-gradient-to-r
            from-green-400/80 via-purple-800/90 to-blue-400 bg-clip-text text-transparent'>informations exploitables</span></h1>
           <Link to={'/'}>
                           <button className='p-5 w-70 mt-10 rounded-2xl font-bold text-slate-800 bg-gradient-to-r from-green-400/80 via-purple-400/90 to-blue-400
                           cursor-pointer transform hover:-translate-y-2 transition-all duration-300'>
                               Se connecter
                           </button>
                       </Link>
        </div>
        <div className="bg-[url('fond-login-radial2.png')] bg-cover bg-center min-h-screen flex items-center justify-center lg:m-0">
            <div className='p-10 rounded-2xl bg-slate-500/20 backdrop-blur-2xl space-y-5 flex flex-col justify-center items-center'>
                <img src='Vector (2).png' className='w-80'/>
                <div className='flex items-center justify-around p-2 bg-slate-500/20 rounded-2xl w-full mb-2'>
                    <label htmlFor="name" className='text-xl text-slate-500/80 font-bold'>Nom : </label>
                    <input value={name} type="text" placeholder='Votre nom' className='p-2 border-b border-slate-300/20 rounded-xl
                    placeholder:text-slate-300/20 outline-0 text-slate-100/50' onChange={(e) =>{
                        setName(e.target.value)
                    }}/>
                </div>
                {nameError ? <p className='text-red-500 m-0 font-bold'> {nameError} </p> : null}
                <div className='flex items-center justify-around p-2 bg-slate-500/20 rounded-2xl w-full mb-2'>
                    <label htmlFor="name" className='text-xl text-slate-500/80 font-bold'>Email : </label>
                    <input value={email} type="email" placeholder='Votre email' className='p-2 border-b border-slate-300/20 rounded-xl
                    placeholder:text-slate-300/20 outline-0 text-slate-100/50' onChange={(e) =>{
                        setEmail(e.target.value)
                    }}/>
                </div>
                {emailError ? <p className='text-red-500 m-0 font-bold'> {emailError} </p> : null}
                <div className='flex items-center justify-around p-2 bg-slate-500/20 rounded-2xl w-full mb-2'>
                    <label htmlFor="password" className='text-xl text-slate-500/80 font-bold'>Password : </label>
                    <input value={password} type="password" placeholder='Votre mot de passe' className='p-2 border-b border-slate-300/20 rounded-xl
                    placeholder:text-slate-300/20 outline-0 text-slate-100/50' onChange={(e) =>{
                        setPassword(e.target.value)
                    }}/>
                </div>
                {passwordError ? <p className='text-red-500 m-0 font-bold'> {passwordError} </p> : null}
                <div className='flex justify-center'>
                    <label htmlFor="condition" className='flex gap-3 font-bold text-slate-400'>
                        <input type="checkbox" required className='accent-purple-600'/>
                        J'accepte les condition !
                    </label>
                </div>
                <button className='p-5 w-50 h-15 rounded-2xl font-bold text-slate-800 bg-gradient-to-r from-green-400/80 via-purple-400/90 to-blue-400
            cursor-pointer transform hover:-translate-y-2 transition-all duration-300' onClick={() =>{
                setNameError("")
                setEmailError("")
                setPasswordError("")

                let isValid = true

                if(!name){
                    setNameError("Saisir un nom")
                    isValid = false
                }else if(name.length < 3){
                    setNameError("Minimim 3 caractères")
                    isValid = false
                }

                if(!email){
                    setEmailError("Saisir un email")
                    isValid = false
                }

                if(!password){
                    setPasswordError("Saisir un mot de passe")
                    isValid = false
                }else if(password.length < 6){
                    setPasswordError("Mot de passe trop court")
                    isValid = false
                }

                if (isValid){
                    envoyerRequetePost()
                }

            }}>
                {loading ?( <CircularProgress size={24} sx={{color : "white"}}/>) : (
                    "S'inscrire"
                )}
            </button>
            <div className='text-slate-300'>
                Déja un compte ?<Link to={"/"} className='underline text-green-400'>    Se connecter !</Link>
            </div>
            </div>
        </div>
    </div>
  )
}

export default SignUp