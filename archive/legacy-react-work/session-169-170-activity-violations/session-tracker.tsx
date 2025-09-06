'use client'

import { useEffect, useState } from 'react'
import { Clock, CheckCircle, AlertCircle, Activity } from 'lucide-react'

interface SessionTask {
  id: string
  title: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
  priority?: 'P0' | 'P1' | 'P2' | 'P3'
  startedAt?: string
  completedAt?: string
  notes?: string
}

interface SessionData {
  sessionId: string
  startTime: string
  focus: string
  estimatedHours: number
  tasks: SessionTask[]
  accomplishments: string[]
  failures: { what: string; impact: string; lesson?: string }[]
}

export function SessionTracker() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessionData()
    const interval = setInterval(fetchSessionData, 15000) // Refresh every 15 seconds
    return () => clearInterval(interval)
  }, [])

  async function fetchSessionData() {
    try {
      // For now, using mock data. In production, this would fetch from the MCP session endpoint
      const mockSession: SessionData = {
        sessionId: '159',
        startTime: new Date().toISOString(),
        focus: 'Admin Dashboard Enhancements',
        estimatedHours: 2,
        tasks: [
          { 
            id: '1', 
            title: 'Review current admin dashboard state', 
            status: 'completed',
            priority: 'P1',
            completedAt: new Date(Date.now() - 10 * 60000).toISOString()
          },
          { 
            id: '2', 
            title: 'Identify pending admin dashboard features', 
            status: 'completed',
            priority: 'P1',
            completedAt: new Date(Date.now() - 5 * 60000).toISOString()
          },
          { 
            id: '3', 
            title: 'Implement priority admin dashboard improvements', 
            status: 'in-progress',
            priority: 'P0',
            startedAt: new Date(Date.now() - 3 * 60000).toISOString()
          },
          { 
            id: '4', 
            title: 'Add session progress tracking', 
            status: 'pending',
            priority: 'P0'
          },
          { 
            id: '5', 
            title: 'Add MCP status monitoring', 
            status: 'pending',
            priority: 'P1'
          },
          { 
            id: '6', 
            title: 'Add Reality Agent status display', 
            status: 'pending',
            priority: 'P1'
          }
        ],
        accomplishments: [
          'Dashboard server running on port 3005',
          'Identified key features needed for visibility'
        ],
        failures: []
      }
      
      setSessionData(mockSession)
    } catch (error) {
      console.error('Error fetching session data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: SessionTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'P0':
        return 'text-red-600 font-bold'
      case 'P1':
        return 'text-orange-600 font-semibold'
      case 'P2':
        return 'text-yellow-600'
      case 'P3':
        return 'text-gray-600'
      default:
        return 'text-gray-500'
    }
  }

  const calculateProgress = () => {
    if (!sessionData) return 0
    const completed = sessionData.tasks.filter(t => t.status === 'completed').length
    return Math.round((completed / sessionData.tasks.length) * 100)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No active session</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Session {sessionData.sessionId} Progress
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {sessionData.focus}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {calculateProgress()}%
            </div>
            <p className="text-xs text-gray-500">
              {sessionData.tasks.filter(t => t.status === 'completed').length} of {sessionData.tasks.length} tasks
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sessionData.tasks.map(task => (
            <div 
              key={task.id}
              className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded"
            >
              {getStatusIcon(task.status)}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </span>
                  {task.priority && (
                    <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                      [{task.priority}]
                    </span>
                  )}
                </div>
                {task.notes && (
                  <p className="text-xs text-gray-500 mt-1">{task.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Accomplishments */}
        {sessionData.accomplishments.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Accomplishments</h4>
            <ul className="space-y-1">
              {sessionData.accomplishments.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Failures (Truth Over Speed) */}
        {sessionData.failures.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Issues & Learnings</h4>
            <div className="space-y-2">
              {sessionData.failures.map((failure, idx) => (
                <div key={idx} className="bg-red-50 p-2 rounded">
                  <p className="text-sm text-red-800">{failure.what}</p>
                  {failure.impact && (
                    <p className="text-xs text-red-600 mt-1">Impact: {failure.impact}</p>
                  )}
                  {failure.lesson && (
                    <p className="text-xs text-gray-600 mt-1">Lesson: {failure.lesson}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}