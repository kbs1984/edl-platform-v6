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
  ChevronRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock
} from 'lucide-react'

interface Feature {
  id: string
  name: string
  status: 'completed' | 'in-progress' | 'planned' | 'missing'
  sessions?: string[]
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  components?: string[]
}

interface UserStory {
  id: string
  persona: 'student' | 'guardian' | 'educator'
  title: string
  description: string
  acceptanceCriteria: string[]
  features: Feature[]
  overallStatus: 'ready' | 'partial' | 'blocked' | 'not-started'
  icon: any
}

const userStories: UserStory[] = [
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
    icon: UserPlus,
    overallStatus: 'partial',
    features: [
      {
        id: 'auth-signup',
        name: 'Authentication & Sign-up',
        status: 'completed',
        sessions: ['111', '114', '115'],
        priority: 'P0',
        components: ['auth-gateway', 'supabase-auth']
      },
      {
        id: 'profile-creation',
        name: 'Profile Creation',
        status: 'completed',
        sessions: ['112', '135'],
        priority: 'P0',
        components: ['dashboard/profile', 'student-form']
      },
      {
        id: 'school-search',
        name: 'School Search & Selection',
        status: 'completed',
        sessions: ['112'],
        priority: 'P1',
        components: ['school-search']
      },
      {
        id: 'avatar-customization',
        name: 'Avatar Customization',
        status: 'in-progress',
        sessions: ['137', '147'],
        priority: 'P2',
        components: ['profile-customization']
      },
      {
        id: 'guardian-link',
        name: 'Guardian Linking',
        status: 'completed',
        sessions: ['135'],
        priority: 'P1',
        components: ['link-student-actions']
      }
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
    icon: Heart,
    overallStatus: 'ready',
    features: [
      {
        id: 'friend-requests',
        name: 'Friend Request System',
        status: 'completed',
        sessions: ['116', '117'],
        priority: 'P0',
        components: ['friend-request-dialog', 'friend-actions']
      },
      {
        id: 'friends-list',
        name: 'Friends List & Management',
        status: 'completed',
        sessions: ['116', '117'],
        priority: 'P0',
        components: ['friend-sidebar', 'use-friends']
      },
      {
        id: 'friend-chat',
        name: 'Friend Chat System',
        status: 'completed',
        sessions: ['117', '119'],
        priority: 'P1',
        components: ['chat', 'team-chat-wrapper']
      },
      {
        id: 'friend-activities',
        name: 'Friend Activity Feed',
        status: 'planned',
        priority: 'P2'
      }
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
    icon: Users,
    overallStatus: 'partial',
    features: [
      {
        id: 'team-creation',
        name: 'Team Creation & Management',
        status: 'completed',
        sessions: ['112', '113'],
        priority: 'P1',
        components: ['groups/teams']
      },
      {
        id: 'team-chat',
        name: 'Team Communication',
        status: 'completed',
        sessions: ['119'],
        priority: 'P1',
        components: ['team-chat-wrapper']
      },
      {
        id: 'team-activities',
        name: 'Team Activities',
        status: 'in-progress',
        sessions: ['137'],
        priority: 'P1',
        components: ['activities']
      },
      {
        id: 'team-progress',
        name: 'Team Progress Tracking',
        status: 'planned',
        priority: 'P2'
      }
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
    icon: BookOpen,
    overallStatus: 'partial',
    features: [
      {
        id: 'activity-catalog',
        name: 'Activity Catalog',
        status: 'in-progress',
        sessions: ['137'],
        priority: 'P0',
        components: ['activities']
      },
      {
        id: 'activity-runtime',
        name: 'Activity Runtime Engine',
        status: 'in-progress',
        sessions: ['137', '147'],
        priority: 'P0',
        components: ['state-machine', 'v5-engine']
      },
      {
        id: 'progress-tracking',
        name: 'Progress Tracking',
        status: 'completed',
        sessions: ['142', '143'],
        priority: 'P1',
        components: ['progress']
      },
      {
        id: 'emcoin-system',
        name: 'EMCoin Rewards',
        status: 'completed',
        sessions: ['143'],
        priority: 'P1',
        components: ['emcoin', 'rewards']
      },
      {
        id: 'achievements',
        name: 'Achievement System',
        status: 'planned',
        priority: 'P2'
      }
    ]
  },
  {
    id: 'addiction-psychology',
    persona: 'student',
    title: 'Engagement & Addiction Loop',
    description: 'As a student, I want to feel engaged and motivated to return daily',
    acceptanceCriteria: [
      'Daily login rewards',
      'Addiction bar mechanics',
      'Visitor tracking',
      'Engagement metrics',
      'Psychological hooks'
    ],
    icon: Brain,
    overallStatus: 'ready',
    features: [
      {
        id: 'addiction-bar',
        name: 'Addiction Bar System',
        status: 'completed',
        sessions: ['148', '149'],
        priority: 'P1',
        components: ['addiction']
      },
      {
        id: 'visitor-tracking',
        name: 'Visitor Tracking',
        status: 'completed',
        sessions: ['143'],
        priority: 'P2',
        components: ['use-visitor-tracking', 'visitor-actions']
      },
      {
        id: 'daily-rewards',
        name: 'Daily Login Rewards',
        status: 'planned',
        priority: 'P2'
      },
      {
        id: 'engagement-metrics',
        name: 'Engagement Analytics',
        status: 'completed',
        sessions: ['118'],
        priority: 'P2',
        components: ['telemetry']
      }
    ]
  },
  {
    id: 'guardian-oversight',
    persona: 'guardian',
    title: 'Guardian Oversight',
    description: 'As a guardian, I want to monitor and support my child\'s learning',
    acceptanceCriteria: [
      'Can create guardian account',
      'Can link to students',
      'Can view progress',
      'Can set permissions',
      'Can communicate with educators'
    ],
    icon: Shield,
    overallStatus: 'partial',
    features: [
      {
        id: 'guardian-signup',
        name: 'Guardian Registration',
        status: 'completed',
        sessions: ['135', '143'],
        priority: 'P1',
        components: ['guardian-form', 'guardian-actions']
      },
      {
        id: 'student-linking',
        name: 'Student Linking System',
        status: 'completed',
        sessions: ['135'],
        priority: 'P1',
        components: ['link-student-actions']
      },
      {
        id: 'progress-viewing',
        name: 'Progress Dashboard',
        status: 'in-progress',
        sessions: ['135'],
        priority: 'P1',
        components: ['guardian/dashboard']
      },
      {
        id: 'permissions',
        name: 'Permission Management',
        status: 'missing',
        priority: 'P2'
      },
      {
        id: 'educator-comm',
        name: 'Educator Communication',
        status: 'missing',
        priority: 'P3'
      }
    ]
  }
]

export function UserStoryMapper() {
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null)
  const [filterPersona, setFilterPersona] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'ready':
        return 'text-green-600 bg-green-50'
      case 'in-progress':
      case 'partial':
        return 'text-yellow-600 bg-yellow-50'
      case 'planned':
        return 'text-blue-600 bg-blue-50'
      case 'missing':
      case 'blocked':
      case 'not-started':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'ready':
        return <CheckCircle className="h-4 w-4" />
      case 'in-progress':
      case 'partial':
        return <Clock className="h-4 w-4" />
      case 'planned':
        return <AlertCircle className="h-4 w-4" />
      case 'missing':
      case 'blocked':
      case 'not-started':
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const calculateCompletion = (story: UserStory) => {
    const completed = story.features.filter(f => f.status === 'completed').length
    const total = story.features.length
    return Math.round((completed / total) * 100)
  }

  const filteredStories = userStories.filter(story => {
    if (filterPersona !== 'all' && story.persona !== filterPersona) return false
    if (filterStatus !== 'all' && story.overallStatus !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="ready">Ready</option>
              <option value="partial">Partial</option>
              <option value="blocked">Blocked</option>
              <option value="not-started">Not Started</option>
            </select>
          </div>
        </div>
      </div>

      {/* Story Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStories.map(story => {
          const completion = calculateCompletion(story)
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
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(story.overallStatus)}`}>
                    {story.overallStatus.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{story.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Completion</span>
                    <span>{completion}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>

                {/* Feature Summary */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-green-600">
                      {story.features.filter(f => f.status === 'completed').length}
                    </div>
                    <div className="text-gray-500">Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-yellow-600">
                      {story.features.filter(f => f.status === 'in-progress').length}
                    </div>
                    <div className="text-gray-500">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">
                      {story.features.filter(f => f.status === 'planned').length}
                    </div>
                    <div className="text-gray-500">Planned</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600">
                      {story.features.filter(f => f.status === 'missing').length}
                    </div>
                    <div className="text-gray-500">Missing</div>
                  </div>
                </div>

                {/* Sessions that worked on this */}
                {story.features.some(f => f.sessions) && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      Sessions: {Array.from(new Set(story.features.flatMap(f => f.sessions || []))).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Story Detail Modal */}
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

              {/* Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Features & Implementation</h3>
                <div className="space-y-3">
                  {selectedStory.features.map(feature => (
                    <div key={feature.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(feature.status)}
                          <span className="font-medium text-gray-900">{feature.name}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(feature.status)}`}>
                            {feature.status}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600`}>
                            {feature.priority}
                          </span>
                        </div>
                      </div>
                      {feature.sessions && (
                        <p className="text-xs text-gray-500 mb-1">
                          Sessions: {feature.sessions.join(', ')}
                        </p>
                      )}
                      {feature.components && (
                        <p className="text-xs text-gray-500">
                          Components: {feature.components.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}