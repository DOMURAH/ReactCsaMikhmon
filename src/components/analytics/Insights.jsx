import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveRadar } from '@nivo/radar'
import { ResponsiveLine } from '@nivo/line'
import { Lightbulb, Sparkles } from 'lucide-react'
import AnalyticsLayout, { ChartCard, fadeUp } from './AnalyticsLayout'
import { nivoTheme, chartColors } from '../../lib/nivoTheme'
import {
  fetchProcessStats,
  buildRadarData,
  getInsightCards,
  getStoredUsers,
  getActiveConnections,
  buildWeeklySalesData,
} from '../../lib/analyticsData'
import { getHistoryEntries } from '../../lib/salary'

const Insights = () => {
  const [radar, setRadar] = useState([])
  const [insights, setInsights] = useState([])
  const [projection, setProjection] = useState([])

  useEffect(() => {
    const load = async () => {
      const process = await fetchProcessStats()
      const users = getStoredUsers()
      const active = getActiveConnections()
      const history = getHistoryEntries()

      setRadar(buildRadarData(process, users, active))
      setInsights(getInsightCards(process, history))

      const weekly = buildWeeklySalesData()
      const avg = weekly.reduce((a, d) => a + d.ventes, 0) / (weekly.length || 1)
      setProjection([
        {
          id: 'Réel',
          color: chartColors[0],
          data: weekly.map((d) => ({ x: d.day, y: d.ventes })),
        },
        {
          id: 'Projection',
          color: chartColors[3],
          data: weekly.map((d, i) => ({
            x: d.day,
            y: Math.round(avg * (1 + i * 0.05)),
          })),
        },
      ])
    }
    load()
    const id = setInterval(load, 6000)
    return () => clearInterval(id)
  }, [])

  const typeStyles = {
    success: 'border-green-500/40 bg-green-950/30 text-green-400',
    warning: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
    info: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
    tip: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
  }

  return (
    <>
    <AnalyticsLayout
      icon={Lightbulb}
      title="Insights"
      subtitle="Recommandations et scores de performance"
      badge="IA analytique"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {insights.map((card, i) => (
          <div
            key={card.title}    
            className={`p-5 rounded-xl border ${typeStyles[card.type] || typeStyles.info}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-bold text-white">{card.title}</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
          </div>
        ))}
        </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        <ChartCard title="Score global" subtitle="Radar multi-métriques">
          <ResponsiveRadar
            data={radar}
            keys={['value']}
            indexBy="metric"
            theme={nivoTheme}
            colors={['#22c55e']}
            margin={{ top: 32, right: 48, bottom: 32, left: 48 }}
            borderColor={{ from: 'color' }}
            gridLabelOffset={12}
            dotSize={8}
            dotBorderWidth={2}
            dotBorderColor="#0f172a"
            fillOpacity={0.25}
            blendMode="multiply"
          />
        </ChartCard>

        <ChartCard title="Projection ventes" subtitle="Tendance vs moyenne">
          <ResponsiveLine
            data={projection}
            theme={nivoTheme}
            colors={chartColors}
            margin={{ top: 20, right: 24, bottom: 50, left: 56 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto' }}
            curve="monotoneX"
            axisBottom={{ tickRotation: -25 }}
            pointSize={6}
            useMesh
            enableSlices="x"
            legends={[{ anchor: 'top-right', direction: 'row', translateY: -12, itemWidth: 80 }]}
          />
        </ChartCard>
      </div>
    </AnalyticsLayout>
    </>
    )
  }
export default Insights