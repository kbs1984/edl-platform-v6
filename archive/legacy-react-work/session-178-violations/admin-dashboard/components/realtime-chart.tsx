'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartDataPoint {
  time: string
  value: number
}

interface RealtimeChartProps {
  title: string
  dataKey: string
  color: string
}

export function RealtimeChart({ title, dataKey, color }: RealtimeChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Initialize with predictable mock data
    const baseValue = dataKey === 'users' ? 50 : 100
    const initialData = Array.from({ length: 10 }, (_, i) => ({
      time: `${12 + Math.floor(i/2)}:${(i % 2) * 30 === 0 ? '00' : '30'}`,
      value: Math.round(baseValue + (i * 5) + Math.sin(i) * 10)
    }))
    setData(initialData)

    // Simulate real-time updates only on client
    const interval = setInterval(() => {
      setData(prevData => {
        const lastValue = prevData[prevData.length - 1]?.value || baseValue
        const newData = [...prevData.slice(1)]
        const now = new Date()
        newData.push({
          time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
          value: Math.round(lastValue + (Math.random() - 0.5) * 20)
        })
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [dataKey])

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      {!mounted ? (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Loading chart...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}