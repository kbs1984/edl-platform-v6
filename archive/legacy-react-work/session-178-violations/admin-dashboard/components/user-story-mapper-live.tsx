'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  UserPlus, 
  School,
  Heart,
  MessageSquare,
  Trophy,
  Target,
  BookOpen,
  Brain,
  Gamepad2,
  Shield,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  RefreshCw,
  Database,
  Code
} from 'lucide-react'
import { ProgressMatrixClient, ProgressMatrixEntry } from '@/lib/progress-matrix/client'

interface FeatureMapping {
  featureName: string // Maps to platform_progress_matrix.feature_name
  displayName: string
  description?: string
}

interface UserStory {
  id: string
  persona: 'student' | 'guardian' | 'educator'
  title: string
  description: string
  acceptanceCriteria: string[]
  featureMappings: FeatureMapping[] // Maps to actual database features
  category: string // Maps to feature_category in database
  icon: any
}

// Map user stories to actual database feature names
const userStoriesMapping: UserStory[] = [
  {
    id: 'student-onboarding',
    persona: 'student',
    title: 'Student Onboarding Journey',
    description: 'As a new student, I want to create my profile and connect with my school',
    acceptanceCriteria: [
      'Can sign up with email',
      'Can complete student profile',
      'Can search and select school',
      'Can customize avatar',
      'Can connect with guardian'
    ],
    category: 'onboarding',
    icon: UserPlus,
    featureMappings: [
      { featureName: 'Authentication System', displayName: 'Authentication & Sign-up' },
      { featureName: 'Profile Creation', displayName: 'Profile Creation' },
      { featureName: 'School Search', displayName: 'School Search & Selection' },
      { featureName: 'Avatar Customization', displayName: 'Avatar Customization' },
      { featureName: 'Guardian Linking', displayName: 'Guardian Linking' }
    ]
  },
  {
    id: 'friend-system',
    persona: 'student',
    title: 'Making Friends',
    description: 'As a student, I want to connect with friends and communicate with them',
    acceptanceCriteria: [
      'Can send friend requests',
      'Can accept/decline requests',
      'Can see friends list',
      'Can chat with friends',
      'Can see friend activities'
    ],
    category: 'communication',
    icon: Heart,
    featureMappings: [
      { featureName: 'Friend Request System', displayName: 'Friend Request System' },
      { featureName: 'Friends List', displayName: 'Friends List & Management' },
      { featureName: 'Friend Chat', displayName: 'Friend Chat System' },
      { featureName: 'Friend Activity Feed', displayName: 'Friend Activity Feed' }
    ]
  },
  {
    id: 'team-collaboration',
    persona: 'student',
    title: 'Team Collaboration',
    description: 'As a student, I want to work with my team on activities',
    acceptanceCriteria: [
      'Can join teams',
      'Can communicate with team',
      'Can see team progress',
      'Can participate in team activities'
    ],
    category: 'teams',
    icon: Users,
    featureMappings: [
      { featureName: 'Team Creation', displayName: 'Team Creation & Management' },
      { featureName: 'Team Chat', displayName: 'Team Communication' },
      { featureName: 'Team Activities', displayName: 'Team Activities' },
      { featureName: 'Team Progress Tracking', displayName: 'Team Progress Tracking' }
    ]
  },
  {
    id: 'learning-activities',
    persona: 'student',
    title: 'Learning Through Activities',
    description: 'As a student, I want to complete educational activities and earn rewards',
    acceptanceCriteria: [
      'Can browse activities',
      'Can start activities',
      'Can track progress',
      'Can earn EMCoins',
      'Can unlock achievements'
    ],
    category: 'activities',
    icon: BookOpen,
    featureMappings: [
      { featureName: 'Activity Catalog', displayName: 'Activity Catalog' },
      { featureName: 'Activity Runtime', displayName: 'Activity Runtime Engine' },
      { featureName: 'Progress Tracking', displayName: 'Progress Tracking' },
      { featureName: 'EmCoin System', displayName: 'EMCoin Rewards' },
      { featureName: 'Achievement System', displayName: 'Achievement System' }
    ]
  },
  {
    id: 'engagement-loop',
    persona: 'student',
    title: 'Daily Engagement',
    description: 'As a student, I want to feel motivated to return daily',
    acceptanceCriteria: [
      'See visitor counter',
      'Earn daily bonuses',
      'Track addiction bar',
      'Compete on leaderboards',
      'Unlock themes'
    ],
    category: 'engagement',
    icon: Brain,
    featureMappings: [
      { featureName: 'Visitor Tracking', displayName: 'Visitor Counter System' },
      { featureName: 'Daily Bonus System', displayName: 'Daily Login Rewards' },
      { featureName: 'Addiction Bar', displayName: 'Engagement Mechanics' },
      { featureName: 'Leaderboards', displayName: 'Competition Systems' },
      { featureName: 'Profile Themes', displayName: 'Customization Options' }
    ]
  }
]

export function UserStoryMapperLive() {
  const [progressData, setProgressData] = useState<ProgressMatrixEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null)
  const [filterPersona, setFilterPersona] = useState<string>('all')
  const [stats, setStats] = useState<any>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isUsingLiveData, setIsUsingLiveData] = useState(false)
  const [progressClient] = useState(() => new ProgressMatrixClient())

  async function loadProgressData() {
    try {
      const [entries, statistics] = await Promise.all([
        progressClient.getAllEntries(),
        progressClient.getStatistics()
      ])
      
      setProgressData(entries)
      setStats(statistics)
      // Check if we got real data (more than the 4 mock entries)
      setIsUsingLiveData(entries.length > 4)
    } catch (error) {
      console.error('Error loading progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProgressData()
    
    // Subscribe to real-time updates
    const unsubscribe = progressClient.subscribeToUpdates((payload) => {
      console.log('Progress matrix updated:', payload)
      loadProgressData()
      setLastUpdate(new Date())
    })

    // Refresh every 30 seconds
    const interval = setInterval(loadProgressData, 30000)

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
      clearInterval(interval)
    }
  }, [progressClient])

  function getFeatureStatus(featureName: string): ProgressMatrixEntry | undefined {
    return progressData.find(entry => 
      entry.feature_name === featureName ||
      entry.feature_name.toLowerCase() === featureName.toLowerCase()
    )
  }

  function calculateStoryCompletion(story: UserStory): number {
    const features = story.featureMappings
    let completed = 0
    
    features.forEach(mapping => {
      const entry = getFeatureStatus(mapping.featureName)
      if (entry && ['implemented', 'validated', 'production'].includes(entry.status)) {
        completed++
      }
    })
    
    return features.length > 0 ? Math.round((completed / features.length) * 100) : 0
  }

  function getStoryStatus(story: UserStory): string {
    const completion = calculateStoryCompletion(story)
    if (completion === 100) return 'ready'
    if (completion >= 50) return 'partial'
    if (completion > 0) return 'in-progress'
    return 'not-started'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'production':
      case 'validated':
      case 'ready':
        return 'text-green-600 bg-green-50'
      case 'implemented':
      case 'partial':
        return 'text-yellow-600 bg-yellow-50'
      case 'in-progress':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-red-600 bg-red-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'production':
      case 'validated':
      case 'implemented':
      case 'ready':
        return <CheckCircle className="h-4 w-4" />
      case 'in_progress':
      case 'partial':
        return <Clock className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  const filteredStories = userStoriesMapping.filter(story => {
    if (filterPersona !== 'all' && story.persona !== filterPersona) return false
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Loading progress matrix data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Live Status Bar */}
      <div className={`rounded-lg p-4 border ${isUsingLiveData ? 'bg-gradient-to-r from-blue-50 to-green-50 border-blue-200' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Database className={`h-5 w-5 ${isUsingLiveData ? 'text-blue-600' : 'text-yellow-600'}`} />
            <span className="text-sm font-medium text-gray-700">
              {isUsingLiveData ? 'Live' : 'Demo'} Progress Matrix: {progressData.length} features tracked
            </span>
            {!isUsingLiveData && (
              <span className="text-xs text-yellow-700 italic">
                (Using sample data - database connection pending)
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            {stats && (
              <>
                <span className="px-2 py-1 bg-green-100 rounded">
                  {stats.byStatus.production} in production
                </span>
                <span className="px-2 py-1 bg-yellow-100 rounded">
                  {stats.byStatus.implemented} implemented
                </span>
                <span className="px-2 py-1 bg-blue-100 rounded">
                  {stats.byStatus.in_progress} in progress
                </span>
              </>
            )}
            <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Persona</label>
            <select 
              value={filterPersona}
              onChange={(e) => setFilterPersona(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Personas</option>
              <option value="student">Student</option>
              <option value="guardian">Guardian</option>
              <option value="educator">Educator</option>
            </select>
          </div>
          <button
            onClick={loadProgressData}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Story Cards with Live Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStories.map(story => {
          const completion = calculateStoryCompletion(story)
          const status = getStoryStatus(story)
          const Icon = story.icon
          
          return (
            <div 
              key={story.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{story.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">{story.persona} Journey</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                    {status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{story.description}</p>

                {/* Live Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Live Progress</span>
                    <span className="font-semibold">{completion}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>

                {/* Feature Status Summary */}
                <div className="space-y-1">
                  {story.featureMappings.slice(0, 3).map(mapping => {
                    const entry = getFeatureStatus(mapping.featureName)
                    return (
                      <div key={mapping.featureName} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 truncate">{mapping.displayName}</span>
                        {entry ? (
                          <span className={`px-2 py-0.5 rounded ${getStatusColor(entry.status)}`}>
                            {entry.status}
                          </span>
                        ) : (
                          <span className="text-gray-400">not tracked</span>
                        )}
                      </div>
                    )
                  })}
                  {story.featureMappings.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{story.featureMappings.length - 3} more features
                    </div>
                  )}
                </div>

                {/* Sessions that worked on this */}
                {(() => {
                  const sessions = new Set<string>()
                  story.featureMappings.forEach(mapping => {
                    const entry = getFeatureStatus(mapping.featureName)
                    if (entry) {
                      entry.implemented_by?.forEach(s => sessions.add(s))
                      entry.modified_by?.forEach(s => sessions.add(s))
                    }
                  })
                  if (sessions.size > 0) {
                    return (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-gray-500">
                          Sessions: {Array.from(sessions).sort().join(', ')}
                        </p>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Story Detail Modal with Live Data */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedStory.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedStory.description}</p>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Acceptance Criteria */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Acceptance Criteria</h3>
                <ul className="space-y-2">
                  {selectedStory.acceptanceCriteria.map((criteria, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Live Feature Implementation Status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Feature Implementation (Live Data)
                </h3>
                <div className="space-y-3">
                  {selectedStory.featureMappings.map(mapping => {
                    const entry = getFeatureStatus(mapping.featureName)
                    
                    return (
                      <div key={mapping.featureName} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {entry ? getStatusIcon(entry.status) : <AlertCircle className="h-4 w-4 text-gray-400" />}
                            <span className="font-medium text-gray-900">{mapping.displayName}</span>
                            {entry && (
                              <>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(entry.status)}`}>
                                  {entry.status}
                                </span>
                                <span className={`px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600`}>
                                  {entry.priority}
                                </span>
                              </>
                            )}
                          </div>
                          {entry?.reality_health && (
                            <span className="text-xs text-gray-500">
                              Health: {entry.reality_health}%
                            </span>
                          )}
                        </div>
                        
                        {entry && (
                          <div className="text-xs text-gray-500 space-y-1 ml-6">
                            {entry.implemented_by && entry.implemented_by.length > 0 && (
                              <p>Implemented by: Sessions {entry.implemented_by.join(', ')}</p>
                            )}
                            {entry.database_tables && entry.database_tables.length > 0 && (
                              <p>Tables: {entry.database_tables.join(', ')}</p>
                            )}
                            {entry.ui_components && entry.ui_components.length > 0 && (
                              <p>Components: {entry.ui_components.join(', ')}</p>
                            )}
                            {entry.known_issues && entry.known_issues.length > 0 && (
                              <p className="text-red-600">Issues: {entry.known_issues.length}</p>
                            )}
                            {entry.notes && (
                              <p className="italic">{entry.notes}</p>
                            )}
                          </div>
                        )}
                        
                        {!entry && (
                          <p className="text-xs text-gray-400 ml-6">
                            Not tracked in progress matrix yet
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}