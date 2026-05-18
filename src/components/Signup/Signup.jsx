import { Link } from 'react-router-dom'
import { SignUp } from '@clerk/react'
import { motion } from 'framer-motion'

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-800 to-slate-700/80 grid grid-cols-1 lg:grid-cols-2">
      <div className="bg-[url('fond-degrade-radial.png')] border-r border-slate-500/60 min-h-screen p-8 flex flex-col justify-center items-center">
        <img src="Vector (1).png" className="w-100 mx-auto my-12" alt="" />
        <h1 className="font-bold text-5xl text-center text-slate-500">
          Transformez vos données brutes en{' '}
          <span className="bg-gradient-to-r from-green-400/80 via-purple-800/90 to-blue-400 bg-clip-text text-transparent">
            informations exploitables
          </span>
        </h1>
        <Link to="/sign-in">
          <button
            type="button"
            className="p-5 w-70 mt-10 rounded-2xl font-bold text-slate-800 bg-gradient-to-r from-green-400/80 via-purple-400/90 to-blue-400
            cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
          >
            Se connecter
          </button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-[url('fond-login-radial2.png')] bg-cover bg-center min-h-screen flex items-center justify-center lg:m-0 p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-8 md:p-10 rounded-2xl bg-slate-500/20 backdrop-blur-2xl w-full max-w-md flex flex-col items-center"
        >
          {/* <img
            src="Vector (2).png"
            className="w-64 md:w-80 mb-6"
            alt="Inscription"
          /> */}
          <SignUp
            signUpUrl="/sing-up"
            signUpForceRedirectUrl="/dashboard"
            forceRedirectUrl="/dashboard"
          />
          <p className="mt-6 text-slate-300 text-center">
            Déjà un compte ?{' '}
            <Link to="/sign-in" className="underline text-green-400">
              Se connecter !
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SignupPage
