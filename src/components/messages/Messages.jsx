import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Inbox, Star } from 'lucide-react'
import AnalyticsLayout, { fadeUp } from '../analytics/AnalyticsLayout'

const MOCK = [
  { id: 1, from: 'Système CSV', subject: 'Import terminé', preview: 'Le fichier report.csv a été traité.', unread: true, time: '10:32' },
  { id: 2, from: 'MikroTik', subject: 'Nouvelle connexion', preview: 'Utilisateur client_42 connecté.', unread: true, time: '09:15' },
  { id: 3, from: 'Alerte ventes', subject: 'Objectif 6000 Ar', preview: 'Seuil journalier presque atteint.', unread: false, time: 'Hier' },
]

const Messages = () => {
  const [selected, setSelected] = useState(MOCK[0])
  const [messages] = useState(MOCK)
  const [reply, setReply] = useState('')

  const handleSend = () => {
    // Fonction pour gérer l’envoi d’un message
    console.log('Réponse envoyée:', reply)
    setReply('')
  }

  return (
    <AnalyticsLayout
      icon={MessageSquare}
      title="Messages"
      subtitle="Notifications et alertes système"
      badge={`${messages.filter((m) => m.unread).length} non lus`}
    >
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4 min-h-[480px]"
      >
        {/* Liste des messages */}
        <motion.div className="rounded-2xl border border-slate-600/40 bg-slate-800/20 dark:bg-black/60 overflow-hidden">
          <div className="p-4 border-b border-slate-700/40 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-green-500" />
            <span className="font-bold text-white">Boîte de réception</span>
          </div>
          <div className="divide-y divide-slate-800/50 max-h-[420px] overflow-y-auto">
            {messages.map((m) => (
              <motion.button
                key={m.id}
                onClick={() => setSelected(m)}
                whileHover={{ x: 4, backgroundColor: 'rgba(34,197,94,0.06)' }}
                className={`w-full text-left p-4 transition-colors ${
                  selected?.id === m.id ? 'bg-green-950/30 border-l-2 border-green-500' : ''
                }`}
              >
                <motion.div className="flex justify-between items-start gap-2">
                  <p className={`font-semibold text-sm ${m.unread ? 'text-white' : 'text-slate-400'}`}>
                    {m.from}
                    {m.unread && (
                      <span className="ml-2 w-2 h-2 inline-block rounded-full bg-green-400" />
                    )}
                  </p>
                  <span className="text-[10px] text-slate-500">{m.time}</span>
                </motion.div>
                <p className="text-sm text-slate-300 mt-1 truncate">{m.subject}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{m.preview}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Détails du message sélectionné */}
        <motion.div className="rounded-2xl border border-slate-600/40 bg-slate-800/20 dark:bg-black/60 flex flex-col">
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col flex-1 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selected.subject}</h3>
                    <p className="text-sm text-slate-500">De: {selected.from}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="p-2 rounded-lg hover:bg-slate-700/50"
                    aria-label="Favoriser le message"
                  >
                    <Star className="w-5 h-5 text-amber-400" />
                  </motion.button>
                </div>
                <p className="text-slate-300 flex-1 leading-relaxed">{selected.preview}</p>

                {/* Zone de réponse */}
                <div className="mt-6 flex gap-2">
                  <input
                    placeholder="Répondre…"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-slate-600/40 text-sm text-slate-200 outline-none focus:border-green-500/50"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white"
                    onClick={handleSend}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnalyticsLayout>
  )
}

export default Messages