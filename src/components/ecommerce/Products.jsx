import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveBar } from '@nivo/bar'
import { Package, Tag } from 'lucide-react'
import AnalyticsLayout, { ChartCard, fadeUp } from '../analytics/AnalyticsLayout'
import { nivoTheme, chartColors } from '../../lib/nivoTheme'
import { buildProfileBarData, fetchProcessStats } from '../../lib/analyticsData'
import { formatAr } from '../../lib/salary'

const PRODUCTS = [
  { id: 1, name: 'Forfait 45min', price: 500, stock: '∞', status: 'Actif' },
  { id: 2, name: 'Forfait 1h30m', price: 1000, stock: '∞', status: 'Actif' },
  { id: 3, name: 'Forfait 1Mois', price: 25000, stock: '∞', status: 'Actif' },
]

const Products = () => {
  const [profiles, setProfiles] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const load = async () => {
      const p = await fetchProcessStats()
      setTotal(p?.total_all || 0)
      // Si buildProfileBarData est synchrone, pas besoin d'await
      const profileData = buildProfileBarData()
      setProfiles(profileData)
    }
    load()
  }, [])

  return (
    <AnalyticsLayout
        icon={Package}
        title="Produits"
        subtitle="Forfaits et offres hotspot"
        badge={formatAr(total)}
      >
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-5 rounded-xl border border-slate-600/40 bg-slate-800/30
                hover:border-green-500/50 hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <Tag className="w-5 h-5 text-green-500 group-hover:rotate-12 transition-transform" />
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">{p.status}</span>
              </div>
              <h3 className="font-bold text-white text-lg">{p.name}</h3>
              <p className="text-2xl font-black text-green-400 mt-2">{formatAr(p.price)}</p>
              <p className="text-xs text-slate-500 mt-1">Stock: {p.stock}</p>
            </motion.div>
          ))}
        </motion.div>

        <ChartCard title="Répartition par profil" subtitle="Basé sur les utilisateurs MikroTik">
          <ResponsiveBar
            data={profiles.length ? profiles : [{ profile: '1H', utilisateurs: 0 }]}
            keys={['utilisateurs']}
            indexBy="profile"
            theme={nivoTheme}
            colors={chartColors}
            margin={{ top: 16, right: 20, bottom: 48, left: 56 }}
            padding={0.4}
            labelTextColor="#0f172a"
          />
        </ChartCard>
    </AnalyticsLayout>
  )
}

export default Products