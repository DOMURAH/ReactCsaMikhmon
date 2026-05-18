import { Link } from 'react-router-dom'
import { SignIn } from '@clerk/react'
import { motion } from 'framer-motion'
import SplitText from '../ReactBits/TextSplit/SplitTexts.jsx'
import DarkVeil from '../ReactBits/TextSplit/darkVeil.jsx'

const Login = () => {
  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
        />
      </div>

      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="border-r border-slate-500/60 min-h-screen p-8 flex flex-col justify-center items-center">
          <img src="Vector (1).png" className="w-100 mx-auto my-12" alt="" />
          <h1 className="font-bold text-5xl text-center text-slate-500 flex flex-col items-center">
            <SplitText
              text="Transformez vos données brutes en informations exploitables"
              delay={50}
              className="block italic"
              animationFrom={{ opacity: 0, y: 40 }}
              animationTo={{ opacity: 1, y: 0 }}
            />
          </h1>
          <Link to="/sign-up">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 6.5, ease: 'anticipate' }}
              type="button"
              className="p-5 w-70 mt-10 rounded-2xl font-bold text-slate-800 bg-gradient-to-r from-green-400/80 via-purple-400/90 to-blue-400
              cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
            >
              Explorer
            </motion.button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 400 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.5 }}
          className="bg-cover bg-center min-h-screen flex items-center justify-center lg:m-0 p-6"
        >
          <div className="p-8 md:p-10 rounded-2xl bg-slate-500/20 backdrop-blur-2xl w-full max-w-md flex flex-col items-center">

            <SignIn
              signUpUrl="/sign-up"
              signInForceRedirectUrl="/dashboard"
              forceRedirectUrl="/dashboard"
            />
            <p className="mt-6 text-slate-300 text-center">
              Pas de compte ?{' '}
              <Link to="/sign-up" className="underline text-green-400">
                Créez ici !
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
