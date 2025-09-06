import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number
  loading?: boolean
  valueColor?: string
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  loading = false,
  valueColor = '#ededed'
}: MetricCardProps) {
  return (
    <div className="overflow-hidden shadow-lg rounded-lg border" style={{
      backgroundColor: 'var(--dark-tertiary)',
      borderColor: 'var(--dark-border)'
    }}>
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon 
              className="h-6 w-6" 
              style={{ color: 'var(--accent-blue)' }}
              aria-hidden="true" 
            />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-400 truncate" style={{
                fontFamily: 'var(--font-ui)'
              }}>
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div 
                  className={`text-2xl font-semibold ${loading ? 'animate-pulse h-8 w-20 rounded' : ''}`}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: loading ? 'transparent' : valueColor,
                    backgroundColor: loading ? 'var(--dark-border)' : 'transparent'
                  }}
                >
                  {!loading && value}
                </div>
                {trend !== undefined && !loading && (
                  <div 
                    className="ml-2 flex items-baseline text-sm font-semibold"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      color: trend > 0 ? 'var(--accent-green)' : 'var(--accent-red)'
                    }}
                  >
                    {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}