'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Users, Clock, Coins, CheckCircle, X, AlertTriangle } from 'lucide-react';

interface PendingRequest {
  id: string;
  player_id: string;
  player_name: string;
  player_email: string;
  linked_at: string;
  player_emcoin_balance: number;
}

interface SupervisorStats {
  current_players: number;
  max_players: number;
  pending_requests: number;
  supervisor_emcoin_balance: number;
}

interface SupervisorApprovalPageProps {
  supervisorId: string;
  onApproval?: (playerId: string, approved: boolean) => void;
}

export function SupervisorApprovalPage({ supervisorId, onApproval }: SupervisorApprovalPageProps) {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [supervisorStats, setSupervisorStats] = useState<SupervisorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [supervisorId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPendingRequests(),
        fetchSupervisorStats()
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    const { data, error } = await supabase
      .from('linked_players')
      .select(`
        id,
        player_id,
        linked_at,
        profiles!linked_players_player_id_fkey (
          name,
          email
        ),
        emcoin_wallets!inner (
          balance
        )
      `)
      .eq('supervisor_id', supervisorId)
      .eq('status', 'pending')
      .order('linked_at', { ascending: true });

    if (error) throw error;

    const requests: PendingRequest[] = data.map((request: any) => ({
      id: request.id,
      player_id: request.player_id,
      player_name: request.profiles?.name || 'Unknown Player',
      player_email: request.profiles?.email || '',
      linked_at: request.linked_at,
      player_emcoin_balance: request.emcoin_wallets?.balance || 0
    }));

    setPendingRequests(requests);
  };

  const fetchSupervisorStats = async () => {
    // Get current active players count
    const { data: activeData, error: activeError } = await supabase
      .from('linked_players')
      .select('id')
      .eq('supervisor_id', supervisorId)
      .eq('status', 'active');

    if (activeError) throw activeError;

    // Get pending requests count
    const { data: pendingData, error: pendingError } = await supabase
      .from('linked_players')
      .select('id')
      .eq('supervisor_id', supervisorId)
      .eq('status', 'pending');

    if (pendingError) throw pendingError;

    // Get supervisor's EmCoin balance
    const { data: walletData, error: walletError } = await supabase
      .from('emcoin_wallets')
      .select('balance')
      .eq('user_id', supervisorId)
      .single();

    if (walletError && walletError.code !== 'PGRST116') throw walletError;

    setSupervisorStats({
      current_players: activeData.length,
      max_players: 6, // Sacred 6-player limit from v5
      pending_requests: pendingData.length,
      supervisor_emcoin_balance: walletData?.balance || 0
    });
  };

  const approvePlayer = async (playerId: string, requestId: string) => {
    try {
      setProcessing(playerId);
      setError(null);

      // First check if we're at the 6-player limit
      if (supervisorStats && supervisorStats.current_players >= supervisorStats.max_players) {
        throw new Error('Cannot approve: You already have the maximum 6 linked players. This ensures quality supervision.');
      }

      // Test the database trigger that Session 148 created
      const { data, error: approvalError } = await supabase
        .from('linked_players')
        .update({ 
          status: 'active',
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('supervisor_id', supervisorId);

      if (approvalError) {
        // Check if it's the 6-player limit trigger
        if (approvalError.message.includes('maximum 6 linked players')) {
          throw new Error('Supervisor already has maximum 6 linked players. This ensures quality supervision.');
        }
        throw approvalError;
      }

      // Transition the player to active state
      await supabase.rpc('transition_user_state', {
        p_user_id: playerId,
        p_new_state: 'active',
        p_reason: 'Approved by supervisor'
      });

      // Award welcome bonus (50 EmCoins with potential variable bonus)
      const { data: bonusResult, error: bonusError } = await supabase.rpc('award_emcoins', {
        p_user_id: playerId,
        p_amount: 50,
        p_type: 'bonus',
        p_description: 'Welcome bonus for supervisor approval'
      });

      if (bonusError) {
        console.warn('Welcome bonus failed:', bonusError.message);
      } else {
        console.log('🎉 Welcome bonus awarded:', bonusResult);
      }

      // Refresh data
      await fetchData();
      onApproval?.(playerId, true);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const rejectPlayer = async (playerId: string, requestId: string) => {
    try {
      setProcessing(playerId);
      setError(null);

      // Remove the request
      const { error: rejectError } = await supabase
        .from('linked_players')
        .update({ 
          status: 'removed',
          removed_at: new Date().toISOString(),
          removal_reason: 'Rejected by supervisor'
        })
        .eq('id', requestId)
        .eq('supervisor_id', supervisorId);

      if (rejectError) throw rejectError;

      // Keep player in grey state
      await supabase.rpc('transition_user_state', {
        p_user_id: playerId,
        p_new_state: 'grey',
        p_reason: 'Supervisor request rejected'
      });

      // Refresh data
      await fetchData();
      onApproval?.(playerId, false);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isAtCapacity = supervisorStats && supervisorStats.current_players >= supervisorStats.max_players;
  const progressPercentage = supervisorStats ? (supervisorStats.current_players / supervisorStats.max_players) * 100 : 0;

  return (
    <div className="space-y-6 w-full max-w-4xl">
      {/* Supervisor Stats Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Supervisor Dashboard
          </CardTitle>
          <CardDescription>
            Manage your linked players and review approval requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {supervisorStats && (
            <>
              {/* Player Capacity Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Linked Players: {supervisorStats.current_players}/{supervisorStats.max_players}
                  </span>
                  <Badge variant={isAtCapacity ? 'destructive' : 'default'}>
                    {isAtCapacity ? 'AT CAPACITY' : `${supervisorStats.max_players - supervisorStats.current_players} SLOTS AVAILABLE`}
                  </Badge>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  ℹ️ You can supervise up to 6 players for optimal oversight and support
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Active Players</div>
                    <div className="font-semibold">{supervisorStats.current_players}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Pending Requests</div>
                    <div className="font-semibold">{supervisorStats.pending_requests}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Coins className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Your EmCoins</div>
                    <div className="font-semibold">{supervisorStats.supervisor_emcoin_balance}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Capacity Warning */}
      {isAtCapacity && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have reached the maximum of 6 linked players. To approve new requests, 
            you must first remove an existing player. This ensures quality supervision.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approval Requests</CardTitle>
          <CardDescription>
            {pendingRequests.length === 0 
              ? 'No pending requests at this time'
              : `${pendingRequests.length} player${pendingRequests.length === 1 ? '' : 's'} waiting for approval`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>All caught up! No pending approval requests.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{request.player_name}</h4>
                          <Badge variant="outline">{request.player_email}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Requested: {new Date(request.linked_at).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1">
                            <Coins className="h-3 w-3" />
                            {request.player_emcoin_balance} EmCoins
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rejectPlayer(request.player_id, request.id)}
                          disabled={processing === request.player_id}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={() => approvePlayer(request.player_id, request.id)}
                          disabled={processing === request.player_id || isAtCapacity}
                        >
                          {processing === request.player_id ? (
                            'Processing...'
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve {isAtCapacity ? '(FULL)' : ''}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {isAtCapacity && (
                      <p className="text-xs text-destructive mt-2">
                        Cannot approve: At 6-player capacity limit
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info - Database Function Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xs"><strong>6-Player Limit Test:</strong> Try approving when at capacity</p>
              <p className="text-xs"><strong>Variable Reward Test:</strong> Check console for welcome bonus amounts</p>
              <p className="text-xs"><strong>State Transition Test:</strong> Verify grey → pending → active flow</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {JSON.stringify(supervisorStats, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}