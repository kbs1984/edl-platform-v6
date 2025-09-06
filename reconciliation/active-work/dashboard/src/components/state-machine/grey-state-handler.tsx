'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Users, Lock, CheckCircle } from 'lucide-react';

interface UserState {
  user_id: string;
  state: 'grey' | 'pending' | 'active' | 'suspended' | 'inactive';
  can_join_activities: boolean;
  can_earn_emcoins: boolean;
  can_access_teams: boolean;
  can_send_messages: boolean;
  can_create_content: boolean;
  state_reason?: string;
  state_changed_at: string;
}

interface GreyStateHandlerProps {
  userId: string;
  onStateChange?: (newState: UserState) => void;
}

export function GreyStateHandler({ userId, onStateChange }: GreyStateHandlerProps) {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchUserState();
  }, [userId]);

  const fetchUserState = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_states')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      
      setUserState(data);
      onStateChange?.(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const requestSupervisor = async () => {
    try {
      setRequesting(true);
      setError(null);

      // Test the transition_user_state function Session 148 created
      const { data, error } = await supabase.rpc('transition_user_state', {
        p_user_id: userId,
        p_new_state: 'pending',
        p_reason: 'User requested supervisor approval'
      });

      if (error) throw error;

      // Refresh state after transition
      await fetchUserState();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userState) {
    return (
      <Card className="w-full max-w-md border-destructive">
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            {error || 'Failed to load user state'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStateDisplay = (state: string) => {
    switch (state) {
      case 'grey':
        return { icon: Lock, color: 'text-muted-foreground', bg: 'bg-muted' };
      case 'pending':
        return { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50' };
      case 'active':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' };
      case 'suspended':
        return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' };
      case 'inactive':
        return { icon: Users, color: 'text-muted-foreground', bg: 'bg-muted' };
      default:
        return { icon: Lock, color: 'text-muted-foreground', bg: 'bg-muted' };
    }
  };

  const stateDisplay = getStateDisplay(userState.state);
  const StateIcon = stateDisplay.icon;

  const getPermissionsList = () => {
    const permissions = [
      { key: 'can_join_activities', label: 'Join Activities', enabled: userState.can_join_activities },
      { key: 'can_earn_emcoins', label: 'Earn EmCoins', enabled: userState.can_earn_emcoins },
      { key: 'can_access_teams', label: 'Access Teams', enabled: userState.can_access_teams },
      { key: 'can_send_messages', label: 'Send Messages', enabled: userState.can_send_messages },
      { key: 'can_create_content', label: 'Create Content', enabled: userState.can_create_content }
    ];

    return permissions;
  };

  const getStateMessage = () => {
    switch (userState.state) {
      case 'grey':
        return {
          title: 'Account Verification Required',
          description: 'You need supervisor approval to access full platform features. This ensures quality participation and safety.',
          action: 'Request Supervisor'
        };
      case 'pending':
        return {
          title: 'Approval Pending',
          description: 'Your supervisor request is being reviewed. You can earn EmCoins but cannot join activities yet.',
          action: null
        };
      case 'active':
        return {
          title: 'Account Active',
          description: 'You have full access to all platform features. Welcome to the community!',
          action: null
        };
      case 'suspended':
        return {
          title: 'Account Suspended',
          description: 'Your account has been temporarily restricted. Contact support for assistance.',
          action: null
        };
      case 'inactive':
        return {
          title: 'Account Inactive',
          description: 'Your account has been inactive for 90+ days. Reactivate to regain access.',
          action: 'Reactivate Account'
        };
      default:
        return {
          title: 'Unknown State',
          description: 'There was an issue determining your account status.',
          action: null
        };
    }
  };

  const stateMessage = getStateMessage();
  const permissions = getPermissionsList();

  return (
    <div className="space-y-4">
      <Card className={`w-full max-w-lg ${stateDisplay.bg} border-2`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StateIcon className={`h-5 w-5 ${stateDisplay.color}`} />
            {stateMessage.title}
            <Badge variant={userState.state === 'active' ? 'default' : 'secondary'}>
              {userState.state.toUpperCase()}
            </Badge>
          </CardTitle>
          <CardDescription className="text-sm">
            {stateMessage.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Dynamic Permissions Display */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Current Permissions:</h4>
            <div className="grid grid-cols-1 gap-1">
              {permissions.map(permission => (
                <div key={permission.key} className="flex items-center justify-between text-sm">
                  <span className={permission.enabled ? '' : 'text-muted-foreground'}>
                    {permission.label}
                  </span>
                  <Badge variant={permission.enabled ? 'default' : 'outline'} className="text-xs">
                    {permission.enabled ? '✓' : '✗'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* State Reason */}
          {userState.state_reason && (
            <div className="text-xs text-muted-foreground">
              <strong>Reason:</strong> {userState.state_reason}
            </div>
          )}

          {/* Action Button */}
          {stateMessage.action && userState.state === 'grey' && (
            <Button 
              onClick={requestSupervisor}
              disabled={requesting}
              className="w-full"
              variant="default"
            >
              {requesting ? 'Requesting...' : stateMessage.action}
            </Button>
          )}

          {error && (
            <div className="text-destructive text-sm bg-destructive/10 p-2 rounded">
              Error: {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="w-full max-w-lg border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-2 rounded overflow-auto">
              {JSON.stringify(userState, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}