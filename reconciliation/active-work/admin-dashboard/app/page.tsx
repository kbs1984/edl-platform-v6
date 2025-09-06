import { DashboardOverview } from '@/components/dashboard-overview'
import { Sidebar } from '@/components/sidebar'
import { SessionTracker } from '@/components/session-tracker'
import { PlatformStatus } from '@/components/platform-status'

export default function AdminDashboard() {
  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--dark-primary)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--dark-secondary)' }}>
        <div className="p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold" style={{ 
              fontFamily: 'var(--font-heading)', 
              color: '#ededed' 
            }}>
              Platform Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-300" style={{ fontFamily: 'var(--font-body)' }}>
              Real-time monitoring and platform development progress
            </p>
          </header>
          
          {/* Session Progress Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Development Session</h2>
            <SessionTracker />
          </div>

          {/* Platform Status Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Platform Status</h2>
            <PlatformStatus />
          </div>

          {/* Original Dashboard Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Metrics Overview</h2>
            <DashboardOverview />
          </div>
        </div>
      </main>
    </div>
  )
}