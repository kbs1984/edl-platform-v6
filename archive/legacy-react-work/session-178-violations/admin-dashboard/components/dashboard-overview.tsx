'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Users, 
  Activity, 
  AlertCircle, 
  TrendingUp,
  Database,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { MetricCard } from './metric-card'
import { RealtimeChart } from './realtime-chart'

interface DashboardMetrics {
  totalUsers: number
  activeUsers: number
  totalEvents: number
  errorRate: number
  avgResponseTime: number
  dbConnections: number
  uptime: number
  recentErrors: number
}

export function DashboardOverview() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalEvents: 0,
    errorRate: 0,
    avgResponseTime: 0,
    dbConnections: 0,
    uptime: 99.9,
    recentErrors: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function fetchMetrics() {
    const supabase = createClient()
    
    try {
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profile')
        .select('*', { count: 'exact', head: true })

      // Fetch active users (users with events in last 24h)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { data: activeUsersData } = await supabase
        .from('telemetry.events' as any)
        .select('user_id')
        .gte('created_at', yesterday)
        .limit(1000)

      const uniqueActiveUsers = new Set(activeUsersData?.map(e => e.user_id) || [])

      // Fetch total events today
      const today = new Date().toISOString().split('T')[0]
      const { count: totalEvents } = await supabase
        .from('telemetry.events' as any)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)

      // Fetch recent errors
      const { count: recentErrors } = await supabase
        .from('telemetry.errors' as any)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday)

      // Calculate error rate
      const errorRate = totalEvents ? (recentErrors || 0) / (totalEvents || 1) * 100 : 0

      setMetrics({
        totalUsers: totalUsers || 0,
        activeUsers: uniqueActiveUsers.size,
        totalEvents: totalEvents || 0,
        errorRate: Math.round(errorRate * 100) / 100,
        avgResponseTime: Math.random() * 200 + 50, // Mock data for now
        dbConnections: Math.floor(Math.random() * 50) + 10, // Mock data
        uptime: 99.9,
        recentErrors: recentErrors || 0
      })
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-600">
          Real-time platform monitoring and instrumentation
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers}
          icon={Users}
          trend={+12}
          loading={loading}
        />
        <MetricCard
          title="Active Users (24h)"
          value={metrics.activeUsers}
          icon={Activity}
          trend={+8}
          loading={loading}
        />
        <MetricCard
          title="Events Today"
          value={metrics.totalEvents}
          icon={TrendingUp}
          trend={+25}
          loading={loading}
        />
        <MetricCard
          title="Error Rate"
          value={`${metrics.errorRate}%`}
          icon={AlertCircle}
          trend={-2}
          loading={loading}
          valueColor={metrics.errorRate > 5 ? 'text-red-600' : 'text-green-600'}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Avg Response Time"
          value={`${Math.round(metrics.avgResponseTime)}ms`}
          icon={Clock}
          loading={loading}
        />
        <MetricCard
          title="DB Connections"
          value={metrics.dbConnections}
          icon={Database}
          loading={loading}
        />
        <MetricCard
          title="System Uptime"
          value={`${metrics.uptime}%`}
          icon={CheckCircle}
          loading={loading}
          valueColor="text-green-600"
        />
        <MetricCard
          title="Recent Errors"
          value={metrics.recentErrors}
          icon={XCircle}
          loading={loading}
          valueColor={metrics.recentErrors > 0 ? 'text-red-600' : 'text-gray-900'}
        />
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RealtimeChart 
          title="User Activity" 
          dataKey="users"
          color="#3B82F6"
        />
        <RealtimeChart 
          title="API Response Times" 
          dataKey="responseTime"
          color="#10B981"
        />
      </div>

      {/* Recent Activity Feed */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {[
                  { id: 1, user: 'user_abc123def', action: 'New user registration', time: '1m ago' },
                  { id: 2, user: 'user_ghi456jkl', action: 'Profile updated', time: '2m ago' },
                  { id: 3, user: 'user_mno789pqr', action: 'Team created', time: '3m ago' }
                ].map((activity, idx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {idx !== 2 && (
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <Activity className="h-4 w-4 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activity.action} <span className="font-medium text-gray-900">{activity.user}</span>
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime="2025-08-30">{activity.time}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}