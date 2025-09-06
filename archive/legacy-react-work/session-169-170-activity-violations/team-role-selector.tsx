'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  User,
  Crown,
  Shield,
  Zap,
  Target,
  Star,
  AlertCircle,
  CheckCircle2,
  Info,
  Shuffle,
  UserPlus,
  ChevronRight,
  Sparkles,
  Trophy,
  Heart,
  Brain,
  Lightbulb,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface TeamRoleSelectorProps {
  activityId: string;
  sessionId: number;
  userId: string;
  maxTeamSize?: number;
  allowRoleChange?: boolean;
  onTeamAssigned?: (teamId: string, role: string) => void;
  className?: string;
}

interface Team {
  id: string;
  name: string;
  color: string;
  members: TeamMember[];
  maxSize: number;
}

interface TeamMember {
  id: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  role: string;
  joined_at: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  required: boolean;
  maxPerTeam: number;
}

// Predefined roles for activities
const ACTIVITY_ROLES: Role[] = [
  {
    id: 'leader',
    name: 'Team Leader',
    description: 'Coordinates team activities and makes final decisions',
    icon: Crown,
    color: 'text-yellow-600 bg-yellow-100',
    required: true,
    maxPerTeam: 1
  },
  {
    id: 'researcher',
    name: 'Researcher',
    description: 'Gathers information and provides insights',
    icon: Brain,
    color: 'text-blue-600 bg-blue-100',
    required: false,
    maxPerTeam: 2
  },
  {
    id: 'creator',
    name: 'Creative',
    description: 'Brings creative solutions and ideas',
    icon: Palette,
    color: 'text-purple-600 bg-purple-100',
    required: false,
    maxPerTeam: 2
  },
  {
    id: 'presenter',
    name: 'Presenter',
    description: 'Communicates team findings and results',
    icon: Sparkles,
    color: 'text-green-600 bg-green-100',
    required: false,
    maxPerTeam: 1
  },
  {
    id: 'supporter',
    name: 'Supporter',
    description: 'Helps and encourages team members',
    icon: Heart,
    color: 'text-red-600 bg-red-100',
    required: false,
    maxPerTeam: 2
  }
];

const TEAM_COLORS = [
  { name: 'Red', value: '#ef4444', bg: 'bg-red-500' },
  { name: 'Blue', value: '#3b82f6', bg: 'bg-blue-500' },
  { name: 'Green', value: '#10b981', bg: 'bg-green-500' },
  { name: 'Yellow', value: '#eab308', bg: 'bg-yellow-500' },
  { name: 'Purple', value: '#a855f7', bg: 'bg-purple-500' },
  { name: 'Orange', value: '#f97316', bg: 'bg-orange-500' }
];

export function TeamRoleSelector({
  activityId,
  sessionId,
  userId,
  maxTeamSize = 5,
  allowRoleChange = true,
  onTeamAssigned,
  className
}: TeamRoleSelectorProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'select' | 'create'>('select');
  
  const supabase = createClient();

  useEffect(() => {
    loadTeamData();
  }, [activityId, sessionId, userId]);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load existing teams for this activity/session
      const { data: teamData, error: teamError } = await supabase
        .from('activity_teams')
        .select(`
          *,
          members:activity_team_members(*)
        `)
        .eq('activity_id', activityId)
        .eq('session_id', sessionId);

      if (teamError) throw teamError;

      // Mock team data for demo if no teams exist
      const existingTeams = teamData || [];
      if (existingTeams.length === 0) {
        // Generate demo teams
        const demoTeams = generateDemoTeams();
        setTeams(demoTeams);
      } else {
        setTeams(existingTeams.map(team => ({
          ...team,
          maxSize: maxTeamSize
        })));
      }

      // Check if user is already in a team
      const userTeam = existingTeams.find(team => 
        team.members?.some((m: TeamMember) => m.user_id === userId)
      );

      if (userTeam) {
        setCurrentTeam(userTeam as any);
        const userMember = userTeam.members?.find((m: TeamMember) => m.user_id === userId);
        setCurrentRole(userMember?.role || null);
      }

    } catch (err) {
      console.error('Error loading team data:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const generateDemoTeams = (): Team[] => {
    // Generate some demo teams with mock members
    return TEAM_COLORS.slice(0, 3).map((color, index) => ({
      id: `team-${index + 1}`,
      name: `Team ${color.name}`,
      color: color.value,
      maxSize: maxTeamSize,
      members: generateMockMembers(index)
    }));
  };

  const generateMockMembers = (teamIndex: number): TeamMember[] => {
    const memberCount = Math.floor(Math.random() * 3) + 1;
    const members: TeamMember[] = [];
    const usedRoles = new Set<string>();

    for (let i = 0; i < memberCount; i++) {
      let role = ACTIVITY_ROLES[Math.floor(Math.random() * ACTIVITY_ROLES.length)].id;
      
      // Ensure no duplicate leader role
      if (role === 'leader' && usedRoles.has('leader')) {
        role = 'researcher';
      }
      usedRoles.add(role);

      members.push({
        id: `member-${teamIndex}-${i}`,
        user_id: `user-${teamIndex}-${i}`,
        username: `Student${teamIndex}${i}`,
        role,
        joined_at: new Date().toISOString()
      });
    }

    return members;
  };

  const joinTeam = async () => {
    if (!selectedTeam || !selectedRole) {
      toast({
        title: 'Selection Required',
        description: 'Please select both a team and a role',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      // Check if role is available
      const team = teams.find(t => t.id === selectedTeam);
      if (!team) throw new Error('Team not found');

      const role = ACTIVITY_ROLES.find(r => r.id === selectedRole);
      if (!role) throw new Error('Role not found');

      // Check team capacity
      if (team.members.length >= team.maxSize) {
        toast({
          title: 'Team Full',
          description: 'This team has reached maximum capacity',
          variant: 'destructive',
        });
        return;
      }

      // Check role availability
      const roleCount = team.members.filter(m => m.role === selectedRole).length;
      if (roleCount >= role.maxPerTeam) {
        toast({
          title: 'Role Unavailable',
          description: `This team already has the maximum number of ${role.name}s`,
          variant: 'destructive',
        });
        return;
      }

      // Add user to team (mock for demo)
      const newMember: TeamMember = {
        id: `member-${userId}`,
        user_id: userId,
        username: 'You',
        role: selectedRole,
        joined_at: new Date().toISOString()
      };

      // Update local state
      const updatedTeams = teams.map(t => {
        if (t.id === selectedTeam) {
          return {
            ...t,
            members: [...t.members, newMember]
          };
        }
        return t;
      });

      setTeams(updatedTeams);
      setCurrentTeam(updatedTeams.find(t => t.id === selectedTeam)!);
      setCurrentRole(selectedRole);

      // Trigger callback
      if (onTeamAssigned) {
        onTeamAssigned(selectedTeam, selectedRole);
      }

      toast({
        title: 'Team Joined!',
        description: `You've joined ${team.name} as ${role.name}`,
      });

    } catch (err) {
      console.error('Error joining team:', err);
      toast({
        title: 'Error',
        description: 'Failed to join team',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const createNewTeam = async () => {
    if (!selectedRole) {
      toast({
        title: 'Role Required',
        description: 'Please select a role for your new team',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      // Create new team with user as first member
      const colorIndex = teams.length % TEAM_COLORS.length;
      const teamColor = TEAM_COLORS[colorIndex];
      
      const newTeam: Team = {
        id: `team-${teams.length + 1}`,
        name: `Team ${teamColor.name}`,
        color: teamColor.value,
        maxSize: maxTeamSize,
        members: [{
          id: `member-${userId}`,
          user_id: userId,
          username: 'You',
          role: selectedRole,
          joined_at: new Date().toISOString()
        }]
      };

      // Update state
      setTeams([...teams, newTeam]);
      setCurrentTeam(newTeam);
      setCurrentRole(selectedRole);
      setMode('select');

      if (onTeamAssigned) {
        onTeamAssigned(newTeam.id, selectedRole);
      }

      toast({
        title: 'Team Created!',
        description: `You've created ${newTeam.name}`,
      });

    } catch (err) {
      console.error('Error creating team:', err);
      toast({
        title: 'Error',
        description: 'Failed to create team',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const leaveTeam = async () => {
    if (!currentTeam) return;

    try {
      setSaving(true);

      // Remove user from team
      const updatedTeams = teams.map(t => {
        if (t.id === currentTeam.id) {
          return {
            ...t,
            members: t.members.filter(m => m.user_id !== userId)
          };
        }
        return t;
      });

      setTeams(updatedTeams);
      setCurrentTeam(null);
      setCurrentRole(null);
      setSelectedTeam('');
      setSelectedRole('');

      toast({
        title: 'Left Team',
        description: 'You have left the team',
      });

    } catch (err) {
      console.error('Error leaving team:', err);
      toast({
        title: 'Error',
        description: 'Failed to leave team',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getRoleIcon = (roleId: string) => {
    const role = ACTIVITY_ROLES.find(r => r.id === roleId);
    if (!role) return User;
    return role.icon;
  };

  const getRoleColor = (roleId: string) => {
    const role = ACTIVITY_ROLES.find(r => r.id === roleId);
    return role?.color || 'text-gray-600 bg-gray-100';
  };

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || 'Failed to load team data'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Already in team
  if (currentTeam && currentRole) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Team Assignment
          </CardTitle>
          <CardDescription>
            You're part of {currentTeam.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Team Info */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="h-10 w-10 rounded-full"
                  style={{ backgroundColor: currentTeam.color }}
                />
                <div>
                  <h3 className="font-semibold">{currentTeam.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentTeam.members.length} of {currentTeam.maxSize} members
                  </p>
                </div>
              </div>
              {allowRoleChange && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={leaveTeam}
                  disabled={saving}
                >
                  Leave Team
                </Button>
              )}
            </div>

            {/* Your Role */}
            <div className="flex items-center gap-2 p-2 bg-accent rounded">
              {(() => {
                const role = ACTIVITY_ROLES.find(r => r.id === currentRole);
                const Icon = role?.icon || User;
                return (
                  <>
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      getRoleColor(currentRole)
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Your Role: {role?.name}</p>
                      <p className="text-xs text-muted-foreground">{role?.description}</p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Team Members */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Team Members:</p>
              <div className="space-y-1">
                {currentTeam.members.map(member => {
                  const role = ACTIVITY_ROLES.find(r => r.id === member.role);
                  const Icon = role?.icon || User;
                  
                  return (
                    <div 
                      key={member.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-accent/50"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback>
                          {member.username?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm flex-1">
                        {member.username || 'Anonymous'}
                        {member.user_id === userId && ' (You)'}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs gap-1", getRoleColor(member.role))}
                      >
                        <Icon className="h-3 w-3" />
                        {role?.name}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Team selection mode
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Join a Team
        </CardTitle>
        <CardDescription>
          Select a team and role for this activity session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button 
            variant={mode === 'select' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('select')}
          >
            Join Existing Team
          </Button>
          <Button 
            variant={mode === 'create' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('create')}
          >
            Create New Team
          </Button>
        </div>

        {mode === 'select' ? (
          <>
            {/* Available Teams */}
            <div className="space-y-2">
              <Label>Select a Team</Label>
              <RadioGroup value={selectedTeam} onValueChange={setSelectedTeam}>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-2">
                    {teams.map(team => {
                      const isFull = team.members.length >= team.maxSize;
                      
                      return (
                        <Label
                          key={team.id}
                          htmlFor={team.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer",
                            "hover:bg-accent/50 transition-colors",
                            selectedTeam === team.id && "border-primary bg-accent",
                            isFull && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <RadioGroupItem 
                            value={team.id} 
                            id={team.id}
                            disabled={isFull}
                          />
                          <div 
                            className="h-8 w-8 rounded-full"
                            style={{ backgroundColor: team.color }}
                          />
                          <div className="flex-1">
                            <p className="font-medium">
                              {team.name}
                              {isFull && ' (Full)'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {team.members.length}/{team.maxSize} members
                            </p>
                          </div>
                          {team.members.length > 0 && (
                            <div className="flex -space-x-2">
                              {team.members.slice(0, 3).map(member => (
                                <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                                  <AvatarImage src={member.avatar_url} />
                                  <AvatarFallback>
                                    {member.username?.[0]?.toUpperCase() || '?'}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {team.members.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                                  +{team.members.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </Label>
                      );
                    })}
                  </div>
                </ScrollArea>
              </RadioGroup>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Select Your Role</Label>
              <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                <div className="grid grid-cols-1 gap-2">
                  {ACTIVITY_ROLES.map(role => {
                    const Icon = role.icon;
                    const isAvailable = !selectedTeam || 
                      (teams.find(t => t.id === selectedTeam)?.members.filter(
                        m => m.role === role.id
                      ).length || 0) < role.maxPerTeam;
                    
                    return (
                      <Label
                        key={role.id}
                        htmlFor={role.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer",
                          "hover:bg-accent/50 transition-colors",
                          selectedRole === role.id && "border-primary bg-accent",
                          !isAvailable && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <RadioGroupItem 
                          value={role.id} 
                          id={role.id}
                          disabled={!isAvailable}
                        />
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          role.color
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {role.name}
                            {role.required && ' *'}
                            {!isAvailable && ' (Taken)'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {role.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Max {role.maxPerTeam}
                        </Badge>
                      </Label>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            {/* Join Button */}
            <Button 
              onClick={joinTeam}
              disabled={!selectedTeam || !selectedRole || saving}
              className="w-full"
            >
              {saving ? 'Joining...' : 'Join Team'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </>
        ) : (
          <>
            {/* Create New Team */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Create a new team and become its first member. Others can join your team later.
              </AlertDescription>
            </Alert>

            {/* Role Selection for New Team */}
            <div className="space-y-2">
              <Label>Select Your Role in the New Team</Label>
              <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                <div className="grid grid-cols-1 gap-2">
                  {ACTIVITY_ROLES.map(role => {
                    const Icon = role.icon;
                    
                    return (
                      <Label
                        key={role.id}
                        htmlFor={`create-${role.id}`}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer",
                          "hover:bg-accent/50 transition-colors",
                          selectedRole === role.id && "border-primary bg-accent"
                        )}
                      >
                        <RadioGroupItem 
                          value={role.id} 
                          id={`create-${role.id}`}
                        />
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          role.color
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {role.name}
                            {role.id === 'leader' && ' (Recommended)'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {role.description}
                          </p>
                        </div>
                      </Label>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            {/* Create Button */}
            <Button 
              onClick={createNewTeam}
              disabled={!selectedRole || saving}
              className="w-full"
            >
              {saving ? 'Creating...' : 'Create Team'}
              <UserPlus className="h-4 w-4 ml-1" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}