'use client'

import { useEffect, useState } from 'react'
import { 
  Server, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Activity,
  Database,
  GitBranch,
  Search,
  Brain,
  Layers
} from 'lucide-react'

interface ServiceStatus {
  name: string
  status: 'online' | 'offline' | 'degraded' | 'checking'
  latency?: number
  lastCheck?: string
  details?: string
  icon?: any
}

interface MCPServer {
  name: string
  status: 'connected' | 'disconnected' | 'error'
  operations?: number
  lastActivity?: string
}

interface RealityAgent {
  name: string
  status: 'active' | 'idle' | 'error'
  lastRun?: string
  nextRun?: string
  discoveries?: number
}

export function PlatformStatus() {
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [mcpServers, setMCPServers] = useState<MCPServer[]>([])
  const [realityAgents, setRealityAgents] = useState<RealityAgent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkPlatformStatus()
    const interval = setInterval(checkPlatformStatus, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function checkPlatformStatus() {
    try {
      // Mock data for now - would connect to actual monitoring endpoints
      const mockServices: ServiceStatus[] = [
        {
          name: 'Auth Gateway',
          status: 'online',
          latency: 45,
          lastCheck: new Date().toISOString(),
          details: 'Port 3000',
          icon: Server
        },
        {
          name: 'EDL Dashboard',
          status: 'online',
          latency: 52,
          lastCheck: new Date().toISOString(),
          details: 'Port 3001',
          icon: Layers
        },
        {
          name: 'Admin Dashboard',
          status: 'online',
          latency: 12,
          lastCheck: new Date().toISOString(),
          details: 'Port 3003',
          icon: Activity
        },
        {
          name: 'Supabase',
          status: 'online',
          latency: 89,
          lastCheck: new Date().toISOString(),
          details: 'bbrheacetxlnqbibjwsz',
          icon: Database
        }
      ]

      const mockMCPServers: MCPServer[] = [
        {
          name: 'edl-v6-session',
          status: 'connected',
          operations: 156,
          lastActivity: '2 min ago'
        },
        {
          name: 'supabase-dev',
          status: 'connected',
          operations: 1243,
          lastActivity: '1 min ago'
        },
        {
          name: 'github-server',
          status: 'connected',
          operations: 89,
          lastActivity: '5 min ago'
        },
        {
          name: 'brave-search',
          status: 'connected',
          operations: 34,
          lastActivity: '10 min ago'
        },
        {
          name: 'sequential-thinking',
          status: 'connected',
          operations: 67,
          lastActivity: '3 min ago'
        },
        {
          name: 'reality-server',
          status: 'connected',
          operations: 12,
          lastActivity: '15 min ago'
        }
      ]

      const mockAgents: RealityAgent[] = [
        {
          name: 'Supabase Agent',
          status: 'active',
          lastRun: '5 min ago',
          nextRun: 'in 25 min',
          discoveries: 47
        },
        {
          name: 'Filesystem Agent',
          status: 'idle',
          lastRun: '1 hour ago',
          nextRun: 'on demand',
          discoveries: 312
        },
        {
          name: 'Task Agent',
          status: 'active',
          lastRun: 'now',
          discoveries: 89
        }
      ]

      setServices(mockServices)
      setMCPServers(mockMCPServers)
      setRealityAgents(mockAgents)
    } catch (error) {
      console.error('Error checking platform status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'active':
        return 'text-green-500'
      case 'offline':
      case 'disconnected':
      case 'error':
        return 'text-red-500'
      case 'degraded':
        return 'text-yellow-500'
      case 'idle':
        return 'text-gray-400'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'offline':
      case 'disconnected':
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'idle':
        return <Activity className="h-4 w-4 text-gray-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Core Services */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Core Services</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(service => (
              <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  {service.icon && <service.icon className="h-5 w-5 text-gray-400" />}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{service.name}</span>
                      {getStatusIcon(service.status)}
                    </div>
                    {service.details && (
                      <p className="text-xs text-gray-500">{service.details}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {service.latency && (
                    <p className="text-sm text-gray-600">{service.latency}ms</p>
                  )}
                  <p className={`text-xs font-medium ${getStatusColor(service.status)}`}>
                    {service.status.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MCP Servers */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">MCP Servers</h3>
          <p className="text-sm text-gray-500 mt-1">Model Context Protocol integrations</p>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-3">
            {mcpServers.map(server => (
              <div key={server.name} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(server.status)}
                  <div>
                    <span className="font-medium text-gray-900">{server.name}</span>
                    {server.lastActivity && (
                      <p className="text-xs text-gray-500">Last: {server.lastActivity}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {server.operations !== undefined && (
                    <p className="text-sm font-medium text-gray-900">{server.operations} ops</p>
                  )}
                  <p className={`text-xs ${getStatusColor(server.status)}`}>
                    {server.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reality Agents */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Reality Agents</h3>
          <p className="text-sm text-gray-500 mt-1">Autonomous monitoring and discovery</p>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-3">
            {realityAgents.map(agent => (
              <div key={agent.name} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-gray-900">{agent.name}</span>
                    {getStatusIcon(agent.status)}
                  </div>
                  <span className={`text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {agent.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {agent.lastRun && (
                    <div>
                      <span className="text-gray-500">Last run:</span>
                      <p className="font-medium">{agent.lastRun}</p>
                    </div>
                  )}
                  {agent.nextRun && (
                    <div>
                      <span className="text-gray-500">Next run:</span>
                      <p className="font-medium">{agent.nextRun}</p>
                    </div>
                  )}
                  {agent.discoveries !== undefined && (
                    <div>
                      <span className="text-gray-500">Discoveries:</span>
                      <p className="font-medium">{agent.discoveries}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}