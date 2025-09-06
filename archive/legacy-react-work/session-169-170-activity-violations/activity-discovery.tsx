'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Trophy, 
  Star, 
  TrendingUp,
  Users,
  Calendar,
  Target,
  Sparkles,
  ChevronRight,
  Play,
  CheckCircle,
  PauseCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  title: string;
  description: string;
  total_sessions: number;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours?: number;
  tags?: string[];
  featured?: boolean;
  popularity?: number;
  emcoin_reward?: number;
  badge_reward?: string;
  created_at: string;
  created_by?: string;
}

interface ActivityInstance {
  id: string;
  activity_id: string;
  user_id: string;
  current_session: number;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  started_at: string;
  completed_at?: string;
}

interface ActivityDiscoveryProps {
  userId: string;
}

const categories = [
  { value: 'all', label: 'All Activities', icon: BookOpen },
  { value: 'academic', label: 'Academic', icon: Trophy },
  { value: 'creative', label: 'Creative', icon: Sparkles },
  { value: 'skills', label: 'Skills', icon: Target },
  { value: 'social', label: 'Social', icon: Users },
  { value: 'featured', label: 'Featured', icon: Star },
];

const difficultyColors = {
  beginner: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
  intermediate: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300',
};

export function ActivityDiscovery({ userId }: ActivityDiscoveryProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [instances, setInstances] = useState<Map<string, ActivityInstance>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'easiest'>('newest');
  
  const supabase = createClient();

  useEffect(() => {
    loadActivities();
    loadUserInstances();
  }, [userId]);

  useEffect(() => {
    filterAndSortActivities();
  }, [activities, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activity')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enhance activities with mock data for demo
      const enhancedActivities = (data || []).map((activity, index) => ({
        ...activity,
        category: ['academic', 'creative', 'skills', 'social'][index % 4],
        difficulty: ['beginner', 'intermediate', 'advanced'][index % 3] as any,
        estimated_hours: Math.ceil(activity.total_sessions * 1.5),
        tags: generateTags(activity.title),
        featured: index < 3,
        popularity: Math.floor(Math.random() * 100) + 20,
        emcoin_reward: Math.floor(Math.random() * 50) + 10,
        badge_reward: index % 3 === 0 ? 'Achievement Hunter' : undefined,
      }));

      setActivities(enhancedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load activities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserInstances = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_instance')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const instanceMap = new Map<string, ActivityInstance>();
      (data || []).forEach(instance => {
        instanceMap.set(instance.activity_id, instance);
      });
      
      setInstances(instanceMap);
    } catch (error) {
      console.error('Error loading instances:', error);
    }
  };

  const filterAndSortActivities = () => {
    let filtered = [...activities];

    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'featured') {
        filtered = filtered.filter(a => a.featured);
      } else {
        filtered = filtered.filter(a => a.category === selectedCategory);
      }
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(a => a.difficulty === selectedDifficulty);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query) ||
        a.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'easiest':
        filtered.sort((a, b) => {
          const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
          return (difficultyOrder[a.difficulty || 'beginner'] || 0) - 
                 (difficultyOrder[b.difficulty || 'beginner'] || 0);
        });
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    setFilteredActivities(filtered);
  };

  const generateTags = (title: string): string[] => {
    // Generate relevant tags based on title
    const tags = [];
    if (title.toLowerCase().includes('debate')) tags.push('debate');
    if (title.toLowerCase().includes('writing')) tags.push('writing');
    if (title.toLowerCase().includes('research')) tags.push('research');
    if (title.toLowerCase().includes('critical')) tags.push('critical-thinking');
    if (title.toLowerCase().includes('team')) tags.push('teamwork');
    return tags;
  };

  const startActivity = async (activityId: string) => {
    try {
      const { data, error } = await supabase
        .from('activity_instance')
        .insert({
          activity_id: activityId,
          user_id: userId,
          current_session: 1,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const newInstances = new Map(instances);
      newInstances.set(activityId, data);
      setInstances(newInstances);

      toast({
        title: 'Success',
        description: 'Activity started successfully!',
      });

      // Navigate to first session
      window.location.href = `/activities/${activityId}/session/1`;
    } catch (error) {
      console.error('Error starting activity:', error);
      toast({
        title: 'Error',
        description: 'Failed to start activity',
        variant: 'destructive',
      });
    }
  };

  const getActivityStatus = (activityId: string) => {
    const instance = instances.get(activityId);
    if (!instance) return null;
    return instance.status;
  };

  const getProgressPercentage = (activityId: string, totalSessions: number) => {
    const instance = instances.get(activityId);
    if (!instance) return 0;
    return Math.round((instance.current_session / totalSessions) * 100);
  };

  const renderActivityCard = (activity: Activity) => {
    const status = getActivityStatus(activity.id);
    const progress = getProgressPercentage(activity.id, activity.total_sessions);
    const instance = instances.get(activity.id);
    
    return (
      <Card 
        key={activity.id} 
        className={cn(
          "hover:shadow-lg transition-all duration-200 cursor-pointer",
          activity.featured && "border-primary"
        )}
      >
        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                {activity.title}
                {activity.featured && (
                  <Badge variant="default" className="gap-1">
                    <Star className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
                {status === 'completed' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {status === 'active' && (
                  <Play className="h-5 w-5 text-blue-500" />
                )}
                {status === 'paused' && (
                  <PauseCircle className="h-5 w-5 text-yellow-500" />
                )}
              </CardTitle>
              <CardDescription className="mt-2">
                {activity.description}
              </CardDescription>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {activity.difficulty && (
              <Badge 
                variant="secondary" 
                className={cn("text-xs", difficultyColors[activity.difficulty])}
              >
                {activity.difficulty}
              </Badge>
            )}
            {activity.category && activity.category !== 'all' && (
              <Badge variant="outline" className="text-xs">
                {activity.category}
              </Badge>
            )}
            {activity.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Activity Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{activity.total_sessions} sessions</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span>{activity.estimated_hours}h total</span>
            </div>
            {activity.popularity && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{activity.popularity} enrolled</span>
              </div>
            )}
            {activity.emcoin_reward && (
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>{activity.emcoin_reward} EmCoins</span>
              </div>
            )}
          </div>
          
          {/* Progress Bar (if started) */}
          {instance && status === 'active' && (
            <div className="mt-4 space-y-2">
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Session {instance.current_session} of {activity.total_sessions}</span>
                <span>{progress}% complete</span>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between items-center">
          {activity.badge_reward && (
            <Badge variant="outline" className="gap-1">
              <Trophy className="h-3 w-3" />
              {activity.badge_reward}
            </Badge>
          )}
          <div className="ml-auto">
            {!instance ? (
              <Button 
                size="sm" 
                onClick={() => startActivity(activity.id)}
              >
                Start Activity
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : status === 'active' ? (
              <Link href={`/activities/${activity.id}/session/${instance.current_session}`}>
                <Button size="sm" variant="outline">
                  Continue Session {instance.current_session}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            ) : status === 'completed' ? (
              <Link href={`/activities/${activity.id}/review`}>
                <Button size="sm" variant="secondary">
                  Review
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            ) : status === 'paused' ? (
              <Link href={`/activities/${activity.id}/session/${instance.current_session}`}>
                <Button size="sm" variant="outline">
                  Resume
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            ) : null}
          </div>
        </CardFooter>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-24 ml-auto" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Discover Activities</CardTitle>
          <CardDescription>
            Find and enroll in activities that match your interests and skill level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities by name, topic, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <cat.icon className="h-4 w-4" />
                      {cat.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="easiest">Easiest First</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              {filteredActivities.length} activities found
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Featured Activities (if any) */}
      {filteredActivities.some(a => a.featured) && selectedCategory === 'all' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-semibold">Featured Activities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivities
              .filter(a => a.featured)
              .slice(0, 3)
              .map(renderActivityCard)}
          </div>
        </div>
      )}
      
      {/* All Activities */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {selectedCategory === 'all' ? 'All Activities' : 
           selectedCategory === 'featured' ? 'Featured Activities' :
           `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Activities`}
        </h2>
        
        {filteredActivities.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No activities found matching your criteria
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivities
              .filter(a => !a.featured || selectedCategory !== 'all')
              .map(renderActivityCard)}
          </div>
        )}
      </div>
    </div>
  );
}