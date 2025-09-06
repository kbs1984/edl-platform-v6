'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface ProgressItem {
  id: string;
  feature_name: string;
  canvas_id: string;
  priority: string;
  status: string;
  feature_category: string;
  reality_health: number | null;
  implemented_by: string[] | null;
  known_issues: any[] | null;
  ninety_five_syndrome: boolean;
  validation_notes: string | null;
  database_tables: any;
  ui_components: any;
}

interface Stats {
  P0: { total: number; completed: number; inProgress: number; implemented: number };
  P1: { total: number; completed: number; inProgress: number; implemented: number };
  P2: { total: number; completed: number; inProgress: number; implemented: number };
}

export default function ProgressDashboard() {
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [stats, setStats] = useState<Stats>({
    P0: { total: 0, completed: 0, inProgress: 0, implemented: 0 },
    P1: { total: 0, completed: 0, inProgress: 0, implemented: 0 },
    P2: { total: 0, completed: 0, inProgress: 0, implemented: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const supabase = createClient();

  useEffect(() => {
    fetchProgress();
    
    // Real-time subscription
    const channel = supabase
      .channel('progress_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'platform_progress_matrix' },
        () => {
          console.log('Progress updated!');
          fetchProgress();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProgress = async () => {
    const { data, error } = await supabase
      .from('platform_progress_matrix')
      .select('*')
      .order('priority')
      .order('feature_name');
    
    if (data) {
      setProgress(data);
      calculateStats(data);
    }
    setLoading(false);
  };

  const calculateStats = (data: ProgressItem[]) => {
    const newStats: Stats = {
      P0: { total: 0, completed: 0, inProgress: 0, implemented: 0 },
      P1: { total: 0, completed: 0, inProgress: 0, implemented: 0 },
      P2: { total: 0, completed: 0, inProgress: 0, implemented: 0 },
    };
    
    data.forEach(item => {
      const pri = item.priority as keyof Stats;
      newStats[pri].total++;
      if (item.status === 'validated') newStats[pri].completed++;
      if (item.status === 'in_progress') newStats[pri].inProgress++;
      if (item.status === 'implemented') newStats[pri].implemented++;
    });
    
    setStats(newStats);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'validated': return 'text-green-600 bg-green-50';
      case 'implemented': return 'text-blue-600 bg-blue-50';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getHealthColor = (health: number | null) => {
    if (!health) return 'text-gray-400';
    if (health >= 95) return 'text-green-600';
    if (health >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredProgress = filter === 'all' 
    ? progress 
    : progress.filter(item => 
        filter === 'completed' ? item.status === 'validated' :
        filter === 'in_progress' ? item.status === 'in_progress' :
        filter === 'has_issues' ? item.known_issues && item.known_issues.length > 0 :
        filter === 'not_started' ? item.status === 'not_started' :
        item.feature_category === filter
      );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading progress data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Living Progress Matrix</h1>
        <p className="text-gray-600">Real-time platform development status - Session 142</p>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Object.entries(stats).map(([priority, data]) => {
          const completionRate = data.total > 0 ? ((data.completed / data.total) * 100) : 0;
          const implementationRate = data.total > 0 ? (((data.completed + data.implemented) / data.total) * 100) : 0;
          
          return (
            <div key={priority} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{priority} Priority</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold
                  ${priority === 'P0' ? 'bg-red-100 text-red-800' : 
                    priority === 'P1' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {priority}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Validated</span>
                    <span className="font-semibold">{data.completed}/{data.total}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{completionRate.toFixed(1)}% Complete</div>
                </div>
                
                {data.implemented > 0 && (
                  <div className="text-sm text-blue-600">
                    {data.implemented} implemented (needs validation)
                  </div>
                )}
                
                {data.inProgress > 0 && (
                  <div className="text-sm text-yellow-600">
                    {data.inProgress} in progress
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All ({progress.length})
        </button>
        <button
          onClick={() => setFilter('not_started')}
          className={`px-4 py-2 rounded ${filter === 'not_started' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Not Started ({progress.filter(p => p.status === 'not_started').length})
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`px-4 py-2 rounded ${filter === 'in_progress' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          In Progress ({progress.filter(p => p.status === 'in_progress').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Validated ({progress.filter(p => p.status === 'validated').length})
        </button>
        <button
          onClick={() => setFilter('has_issues')}
          className={`px-4 py-2 rounded ${filter === 'has_issues' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Has Issues ({progress.filter(p => p.known_issues && p.known_issues.length > 0).length})
        </button>
      </div>

      {/* Feature Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canvas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProgress.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{item.feature_name}</div>
                    <div className="text-xs text-gray-500">{item.feature_category}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.canvas_id || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold
                      ${item.priority === 'P0' ? 'bg-red-100 text-red-800' : 
                        item.priority === 'P1' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.reality_health ? (
                      <div>
                        <span className={`font-semibold ${getHealthColor(item.reality_health)}`}>
                          {item.reality_health}%
                        </span>
                        {item.ninety_five_syndrome && (
                          <span className="ml-1 text-xs text-yellow-600" title="95% Syndrome">⚠️</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {item.implemented_by?.join(', ') || '-'}
                  </td>
                  <td className="px-4 py-3">
                    {item.known_issues && item.known_issues.length > 0 ? (
                      <div>
                        {item.known_issues.map((issue: any, idx: number) => (
                          <div key={idx} className="text-xs">
                            <span className={`inline-block px-1 py-0.5 rounded mr-1
                              ${issue.severity === 'blocking' ? 'bg-red-100 text-red-700' : 
                                issue.severity === 'major' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'}`}>
                              {issue.severity}
                            </span>
                            <span className="text-gray-600">{issue.type}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {(item.database_tables && item.database_tables.length > 0) && (
                      <div className="text-gray-600">
                        Tables: {item.database_tables.length}
                      </div>
                    )}
                    {(item.ui_components && item.ui_components.length > 0) && (
                      <div className="text-gray-600">
                        Components: {item.ui_components.length}
                      </div>
                    )}
                    {item.validation_notes && (
                      <div className="text-gray-500 truncate max-w-xs" title={item.validation_notes}>
                        {item.validation_notes}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Priority Indicator */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">🎯 Next Priority Feature</h3>
        {(() => {
          const nextFeature = progress.find(p => p.status === 'not_started' && p.priority === 'P0') ||
                            progress.find(p => p.status === 'not_started' && p.priority === 'P1') ||
                            progress.find(p => p.status === 'not_started' && p.priority === 'P2');
          
          if (nextFeature) {
            return (
              <div className="text-blue-800">
                <span className="font-medium">{nextFeature.feature_name}</span>
                <span className="ml-2 text-sm">({nextFeature.priority}, Canvas: {nextFeature.canvas_id})</span>
              </div>
            );
          } else {
            return <div className="text-blue-600">All features completed or in progress!</div>;
          }
        })()}
      </div>
    </div>
  );
}