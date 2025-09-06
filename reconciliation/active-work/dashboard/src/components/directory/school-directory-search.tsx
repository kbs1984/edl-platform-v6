'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  School, 
  Users, 
  User, 
  MapPin, 
  GraduationCap,
  Trophy,
  Shield,
  UserPlus,
  MessageSquare,
  Loader2,
  Filter,
  ChevronRight,
  Building2,
  Mail,
  Calendar,
  Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import debounce from 'lodash/debounce';

interface SchoolData {
  id: string;
  name: string;
  created_at: string;
  student_count?: number;
  team_count?: number;
  guild_count?: number;
  location?: string;
  established?: string;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  image_path?: string;
  user_role?: string;
  active: boolean;
  email?: string;
  student?: {
    school_id: string;
    school?: SchoolData;
    division?: string;
    level: number;
    exp: number;
    call_sign?: string;
  };
  judge?: {
    job_title?: string;
    biography?: string;
  };
  guardian?: {
    students?: any[];
  };
}

interface DirectorySearchProps {
  currentUserId: string;
}

export function SchoolDirectorySearch({ currentUserId }: DirectorySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'schools' | 'students' | 'judges'>('all');
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<SchoolData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [friendRequests, setFriendRequests] = useState<Set<string>>(new Set());
  
  const supabase = createClient();

  // Load initial data
  useEffect(() => {
    loadSchools();
    loadUsers();
    loadFriendRequests();
  }, []);

  // Filter results when search or tab changes
  useEffect(() => {
    performSearch();
  }, [searchQuery, activeTab, selectedDivision, schools, users]);

  const loadSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('school')
        .select(`
          *,
          students:student(count)
        `)
        .order('name');

      if (error) throw error;

      // Enhance school data with counts
      const enhancedSchools = (data || []).map(school => ({
        ...school,
        student_count: school.students?.[0]?.count || 0,
        team_count: Math.floor(Math.random() * 10) + 1, // Mock data
        guild_count: Math.floor(Math.random() * 5) + 1, // Mock data
        location: ['Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju'][Math.floor(Math.random() * 5)],
        established: `20${Math.floor(Math.random() * 24)}`
      }));

      setSchools(enhancedSchools);
    } catch (error) {
      console.error('Error loading schools:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select(`
          *,
          student:student(
            school_id,
            division,
            level,
            exp,
            call_sign,
            school:school(
              id,
              name
            )
          ),
          judge:judge(
            job_title,
            biography
          ),
          guardian:guardian(
            id
          )
        `)
        .neq('id', currentUserId)
        .eq('active', true)
        .limit(100);

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadFriendRequests = async () => {
    try {
      // Get existing friend requests sent by current user
      const { data, error } = await supabase
        .from('friendship')
        .select('friend_id')
        .eq('user_id', currentUserId)
        .in('status', ['PENDING', 'ACCEPTED']);

      if (error) throw error;

      const requestedIds = new Set((data || []).map(f => f.friend_id));
      setFriendRequests(requestedIds);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    }
  };

  const performSearch = useCallback(
    debounce(() => {
      const query = searchQuery.toLowerCase().trim();

      // Filter schools
      let filteredSchoolResults = [...schools];
      if (query) {
        filteredSchoolResults = schools.filter(school =>
          school.name.toLowerCase().includes(query) ||
          school.location?.toLowerCase().includes(query)
        );
      }

      // Filter users
      let filteredUserResults = [...users];
      
      // Apply role filter based on tab
      if (activeTab === 'students') {
        filteredUserResults = filteredUserResults.filter(u => u.user_role === 'STUDENT');
      } else if (activeTab === 'judges') {
        filteredUserResults = filteredUserResults.filter(u => u.user_role === 'JUDGE');
      }

      // Apply division filter for students
      if (selectedDivision !== 'all' && activeTab === 'students') {
        filteredUserResults = filteredUserResults.filter(u => 
          u.student?.division === selectedDivision
        );
      }

      // Apply search query
      if (query) {
        filteredUserResults = filteredUserResults.filter(user =>
          user.name?.toLowerCase().includes(query) ||
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.student?.call_sign?.toLowerCase().includes(query) ||
          user.student?.school?.name?.toLowerCase().includes(query) ||
          user.judge?.job_title?.toLowerCase().includes(query)
        );
      }

      setFilteredSchools(filteredSchoolResults);
      setFilteredUsers(filteredUserResults);
    }, 300),
    [searchQuery, activeTab, selectedDivision, schools, users]
  );

  const sendFriendRequest = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friendship')
        .insert({
          user_id: currentUserId,
          friend_id: friendId,
          status: 'PENDING'
        });

      if (error) throw error;

      setFriendRequests(prev => new Set([...prev, friendId]));
      
      toast({
        title: 'Friend request sent',
        description: 'Your friend request has been sent successfully.',
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: 'Error',
        description: 'Failed to send friend request',
        variant: 'destructive',
      });
    }
  };

  const startDirectMessage = (userId: string) => {
    window.location.href = `/messages?user=${userId}`;
  };

  const renderSchoolCard = (school: SchoolData) => (
    <Card key={school.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <School className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{school.name}</CardTitle>
              {school.location && (
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {school.location}
                </div>
              )}
            </div>
          </div>
          {school.established && (
            <Badge variant="secondary">Est. {school.established}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{school.student_count || 0}</p>
            <p className="text-xs text-muted-foreground">Students</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{school.team_count || 0}</p>
            <p className="text-xs text-muted-foreground">Teams</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{school.guild_count || 0}</p>
            <p className="text-xs text-muted-foreground">Guilds</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Since {school.created_at.split('T')[0]}
            </Badge>
          </div>
          <Link href={`/schools/${school.id}`}>
            <Button size="sm" variant="ghost">
              View Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  const renderUserCard = (user: UserProfile) => {
    const isStudent = user.user_role === 'STUDENT';
    const isJudge = user.user_role === 'JUDGE';
    const isGuardian = user.user_role === 'GUARDIAN';
    const hasFriendRequest = friendRequests.has(user.id);

    return (
      <Card key={user.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.image_path} />
                <AvatarFallback>
                  {user.name?.charAt(0) || user.username?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {user.name || user.username}
                  {isStudent && user.student?.level && user.student.level >= 10 && (
                    <Star className="h-4 w-4 text-yellow-500" />
                  )}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                  {isStudent && (
                    <Badge variant="secondary" className="text-xs">
                      Student
                    </Badge>
                  )}
                  {isJudge && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                      Judge
                    </Badge>
                  )}
                  {isGuardian && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                      Guardian
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Student Info */}
          {isStudent && user.student && (
            <div className="space-y-2">
              {user.student.school && (
                <div className="flex items-center gap-2 text-sm">
                  <School className="h-4 w-4 text-muted-foreground" />
                  <span>{user.student.school.name}</span>
                </div>
              )}
              {user.student.division && (
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{user.student.division}</span>
                </div>
              )}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span>Level {user.student.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span>{user.student.exp} XP</span>
                </div>
              </div>
              {user.student.call_sign && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {user.student.call_sign}
                </Badge>
              )}
            </div>
          )}

          {/* Judge Info */}
          {isJudge && user.judge && (
            <div className="space-y-2">
              {user.judge.job_title && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{user.judge.job_title}</span>
                </div>
              )}
              {user.judge.biography && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {user.judge.biography}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {isStudent && !hasFriendRequest && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => sendFriendRequest(user.id)}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Add Friend
              </Button>
            )}
            {hasFriendRequest && (
              <Button
                size="sm"
                variant="secondary"
                className="flex-1"
                disabled
              >
                Request Sent
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => startDirectMessage(user.id)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
            <Link href={`/profile/${user.username}`}>
              <Button size="sm" variant="ghost">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  const getDivisionBadgeColor = (division: string) => {
    const colors = {
      VILLIGER: 'bg-green-100 text-green-700',
      LOWER: 'bg-blue-100 text-blue-700',
      UPPER: 'bg-purple-100 text-purple-700',
      SENIOR: 'bg-red-100 text-red-700',
      OPEN: 'bg-gray-100 text-gray-700'
    };
    return colors[division as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle>School & User Directory</CardTitle>
          <CardDescription>
            Search and discover schools, students, judges, and guardians in the EDL community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, username, school, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="gap-2">
                <Users className="h-4 w-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="schools" className="gap-2">
                <School className="h-4 w-4" />
                Schools
              </TabsTrigger>
              <TabsTrigger value="students" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Students
              </TabsTrigger>
              <TabsTrigger value="judges" className="gap-2">
                <Shield className="h-4 w-4" />
                Judges
              </TabsTrigger>
            </TabsList>

            {/* Division Filter for Students */}
            {activeTab === 'students' && (
              <div className="flex gap-2 mt-4">
                <Badge
                  variant={selectedDivision === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedDivision('all')}
                >
                  All Divisions
                </Badge>
                {['VILLIGER', 'LOWER', 'UPPER', 'SENIOR', 'OPEN'].map(division => (
                  <Badge
                    key={division}
                    variant={selectedDivision === division ? 'default' : 'outline'}
                    className={cn(
                      "cursor-pointer",
                      selectedDivision === division && getDivisionBadgeColor(division)
                    )}
                    onClick={() => setSelectedDivision(division)}
                  >
                    {division}
                  </Badge>
                ))}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-6">
        {/* Schools Section */}
        {(activeTab === 'all' || activeTab === 'schools') && filteredSchools.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <School className="h-5 w-5" />
                Schools
              </h2>
              <Badge variant="secondary">{filteredSchools.length} found</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSchools.slice(0, activeTab === 'all' ? 6 : undefined).map(renderSchoolCard)}
            </div>
            {activeTab === 'all' && filteredSchools.length > 6 && (
              <div className="text-center">
                <Button variant="outline" onClick={() => setActiveTab('schools')}>
                  View All Schools ({filteredSchools.length})
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Users Section */}
        {(activeTab !== 'schools') && filteredUsers.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {activeTab === 'students' && (
                  <>
                    <GraduationCap className="h-5 w-5" />
                    Students
                  </>
                )}
                {activeTab === 'judges' && (
                  <>
                    <Shield className="h-5 w-5" />
                    Judges
                  </>
                )}
                {activeTab === 'all' && (
                  <>
                    <Users className="h-5 w-5" />
                    Users
                  </>
                )}
              </h2>
              <Badge variant="secondary">{filteredUsers.length} found</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.slice(0, activeTab === 'all' ? 9 : undefined).map(renderUserCard)}
            </div>
            {activeTab === 'all' && filteredUsers.length > 9 && (
              <div className="text-center">
                <Button variant="outline" onClick={() => setActiveTab('students')}>
                  View All Users ({filteredUsers.length})
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {filteredSchools.length === 0 && filteredUsers.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-2">
                <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="font-semibold">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}