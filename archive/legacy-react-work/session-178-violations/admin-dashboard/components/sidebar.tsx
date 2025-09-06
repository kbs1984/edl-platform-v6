'use client'

import { 
  Home, 
  Users, 
  Activity, 
  BarChart3, 
  AlertCircle, 
  Settings,
  Database,
  Monitor,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'User Stories', href: '/stories', icon: BookOpen },
  { name: 'Progress Matrix', href: '/progress', icon: BarChart3 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Telemetry', href: '/telemetry', icon: Activity },
  { name: 'API Monitor', href: '/api-monitor', icon: Monitor },
  { name: 'Errors', href: '/errors', icon: AlertCircle },
  { name: 'Performance', href: '/performance', icon: BarChart3 },
  { name: 'Database', href: '/database', icon: Database },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col" style={{ backgroundColor: 'var(--dark-primary)' }}>
      <div className="flex h-16 items-center px-6 border-b border-gray-700">
        <h1 className="text-xl font-semibold" style={{ 
          fontFamily: 'var(--font-heading)', 
          color: '#ededed' 
        }}>
          EDL Admin
        </h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
              style={{
                fontFamily: 'var(--font-ui)',
                backgroundColor: isActive ? 'var(--dark-tertiary)' : 'transparent',
                color: isActive ? '#ededed' : '#a1a1a1'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--dark-secondary)'
                  e.currentTarget.style.color = '#ededed'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#a1a1a1'
                }
              }}
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                style={{
                  color: isActive ? 'var(--accent-blue)' : '#6b7280'
                }}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}