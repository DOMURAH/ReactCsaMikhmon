import { Link } from 'react-router-dom'
import { SignInButton, SignUpButton } from '@clerk/react'
import { motion } from 'framer-motion'
import DarkVeil from '../ReactBits/TextSplit/darkVeil.jsx'
import SplitText from '../ReactBits/TextSplit/SplitTexts.jsx'

const Welcome = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen w-full overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
        />
      </motion.div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="flex items-center justify-between px-6 py-5 md:px-12">
          <div className="flex items-center gap-3">
            <img src="Vector (1).png" alt="CSVMikhmon" className="h-10 w-auto" />
            <span className="text-lg font-bold tracking-tight text-slate-200">
              CSVMikhmon
            </span>
          </div>
          <div className="flex items-center gap-3">
            <SignInButton mode="redirect" forceRedirectUrl="/sign-in">
              <button
                type="button"
                className="rounded-xl border border-slate-500/50 bg-slate-800/40 px-5 py-2.5 text-sm font-semibold text-slate-200 backdrop-blur transition hover:border-purple-400/60 hover:bg-slate-700/50"
              >
                Se connecter
              </button>
            </SignInButton>
            <SignUpButton mode="redirect" forceRedirectUrl="/sign-up">
              <button
                type="button"
                className="rounded-xl bg-gradient-to-r from-green-400/90 via-purple-500/90 to-blue-400/90 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
              >
                S&apos;inscrire
              </button>
            </SignUpButton>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center md:px-12">
          <img
            src="Vector (1).png"
            alt=""
            className="mb-8 w-48 opacity-90 md:w-64"
          />
          <h1 className="max-w-4xl text-4xl font-bold leading-tight text-slate-300 md:text-6xl">
            <SplitText
              text="Transformez vos données brutes en informations exploitables"
              delay={40}
              className="block italic"
              animationFrom={{ opacity: 0, y: 36 }}
              animationTo={{ opacity: 1, y: 0 }}
            />
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-400 md:text-xl">
            Plateforme d&apos;analyse CSV professionnelle — connectez-vous pour
            accéder à votre tableau de bord.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <SignUpButton mode="redirect" forceRedirectUrl="/sign-up">
              <button
                type="button"
                className="w-64 rounded-2xl bg-gradient-to-r from-green-400/90 via-purple-500/90 to-blue-400/90 p-5 text-lg font-bold text-slate-900 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
              >
                Créer un compte
              </button>
            </SignUpButton>
            <SignInButton mode="redirect" forceRedirectUrl="/sign-in">
              <button
                type="button"
                className="w-64 rounded-2xl border border-slate-500/60 bg-slate-800/50 p-5 text-lg font-bold text-slate-200 backdrop-blur transition hover:-translate-y-1 hover:border-purple-400/70"
              >
                Se connecter
              </button>
            </SignInButton>
          </div>

          <p className="mt-10 text-sm text-slate-500">
            Déjà membre ?{' '}
            <Link to="/sign-in" className="font-semibold text-green-400 underline">
              Connexion
            </Link>
            {' · '}
            Nouveau ?{' '}
            <Link to="/sign-up" className="font-semibold text-green-400 underline">
              Inscription
            </Link>
          </p>
        </main>
      </div>
    </motion.div>
  )
}

export default Welcome
