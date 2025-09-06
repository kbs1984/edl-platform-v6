'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  BookOpen,
  FileText,
  Video,
  Download,
  CheckCircle2,
  Circle,
  PlayCircle,
  ChevronRight,
  ChevronLeft,
  Clock,
  Target,
  AlertCircle,
  Save,
  Send,
  Lightbulb,
  MessageSquare,
  ThumbsUp,
  FileQuestion,
  Award,
  Brain,
  Sparkles,
  Edit3,
  Volume2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface SessionContentProps {
  activityId: string;
  sessionNumber: number;
  userId: string;
  onComplete?: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  className?: string;
}

interface SessionData {
  id: string;
  activity_id: string;
  session_number: number;
  title: string;
  description?: string;
  content_type: 'text' | 'video' | 'quiz' | 'discussion' | 'assignment';
  content: SessionContentItem[];
  objectives?: string[];
  materials?: Material[];
  duration_minutes?: number;
  points?: number;
}

interface SessionContentItem {
  id: string;
  type: 'text' | 'video' | 'image' | 'quiz' | 'discussion' | 'task';
  title?: string;
  content: string;
  media_url?: string;
  questions?: QuizQuestion[];
  required?: boolean;
  completed?: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correct_answer?: string | number;
  explanation?: string;
  points?: number;
}

interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'video' | 'link';
  url: string;
  size?: string;
}

interface UserProgress {
  session_id: string;
  user_id: string;
  completed_items: string[];
  quiz_scores: Record<string, number>;
  notes: string;
  submitted_at?: string;
}

// Mock session content for demo
const generateMockContent = (sessionNumber: number, totalSessions: number): SessionData => {
  const contentTypes = ['text', 'video', 'quiz', 'discussion', 'assignment'] as const;
  const type = contentTypes[sessionNumber % contentTypes.length];
  
  const baseContent: SessionData = {
    id: `session-${sessionNumber}`,
    activity_id: '',
    session_number: sessionNumber,
    title: `Session ${sessionNumber}: ${getSessionTitle(sessionNumber, totalSessions)}`,
    description: getSessionDescription(sessionNumber, totalSessions),
    content_type: type,
    content: [],
    objectives: generateObjectives(sessionNumber),
    materials: generateMaterials(sessionNumber),
    duration_minutes: 30 + (sessionNumber * 5),
    points: 100
  };

  // Generate content based on type
  switch (type) {
    case 'text':
      baseContent.content = generateReadingContent();
      break;
    case 'video':
      baseContent.content = generateVideoContent();
      break;
    case 'quiz':
      baseContent.content = generateQuizContent();
      break;
    case 'discussion':
      baseContent.content = generateDiscussionContent();
      break;
    case 'assignment':
      baseContent.content = generateAssignmentContent();
      break;
  }

  return baseContent;
};

const getSessionTitle = (session: number, total: number): string => {
  if (session === 1) return 'Introduction & Foundation';
  if (session === Math.ceil(total / 2)) return 'Mid-Point Review & Practice';
  if (session === total) return 'Final Project & Assessment';
  return `Core Concepts Part ${session - 1}`;
};

const getSessionDescription = (session: number, total: number): string => {
  if (session === 1) return 'Get started with the fundamentals and set up your learning environment';
  if (session === Math.ceil(total / 2)) return 'Review what you've learned and apply it through hands-on practice';
  if (session === total) return 'Complete your final project and demonstrate your mastery';
  return 'Continue building your knowledge with new concepts and practical applications';
};

const generateObjectives = (session: number): string[] => {
  const objectives = [
    'Understand the core concepts presented',
    'Apply knowledge through practical exercises',
    'Collaborate with team members effectively'
  ];
  
  if (session === 1) {
    objectives.push('Set up your learning environment');
  } else if (session > 3) {
    objectives.push('Build on previous session learnings');
  }
  
  return objectives;
};

const generateMaterials = (session: number): Material[] => {
  return [
    {
      id: `mat-${session}-1`,
      title: `Session ${session} Reading Material`,
      type: 'pdf',
      url: `/materials/session-${session}.pdf`,
      size: '2.4 MB'
    },
    {
      id: `mat-${session}-2`,
      title: 'Supplementary Video',
      type: 'video',
      url: `https://example.com/video-${session}`,
      size: '15:32'
    }
  ];
};

const generateReadingContent = (): SessionContentItem[] => [
  {
    id: 'content-1',
    type: 'text',
    title: 'Introduction',
    content: 'Welcome to this session! Today we'll explore important concepts that build on your previous learning...',
    required: true
  },
  {
    id: 'content-2',
    type: 'text',
    title: 'Key Concepts',
    content: 'The main ideas we'll cover include: critical thinking, problem-solving strategies, and collaborative techniques...',
    required: true
  },
  {
    id: 'content-3',
    type: 'task',
    title: 'Reflection Exercise',
    content: 'Take a moment to reflect on what you've learned and write down three key takeaways.',
    required: false
  }
];

const generateVideoContent = (): SessionContentItem[] => [
  {
    id: 'video-1',
    type: 'video',
    title: 'Session Video Lecture',
    content: 'Watch this comprehensive video covering today's topics',
    media_url: 'https://example.com/video.mp4',
    required: true
  },
  {
    id: 'video-2',
    type: 'discussion',
    title: 'Video Discussion',
    content: 'Share your thoughts on the video content with your team',
    required: false
  }
];

const generateQuizContent = (): SessionContentItem[] => [
  {
    id: 'quiz-1',
    type: 'quiz',
    title: 'Knowledge Check',
    content: 'Test your understanding of the material',
    questions: [
      {
        id: 'q1',
        question: 'What is the primary goal of critical thinking?',
        type: 'multiple-choice',
        options: [
          'To memorize facts',
          'To analyze and evaluate information objectively',
          'To win arguments',
          'To follow instructions'
        ],
        correct_answer: 1,
        explanation: 'Critical thinking involves analyzing and evaluating information objectively to form reasoned judgments.',
        points: 10
      },
      {
        id: 'q2',
        question: 'Collaboration improves learning outcomes.',
        type: 'true-false',
        correct_answer: 'true',
        explanation: 'Research shows that collaborative learning enhances understanding and retention.',
        points: 5
      },
      {
        id: 'q3',
        question: 'Describe one benefit of peer learning.',
        type: 'short-answer',
        explanation: 'Peer learning allows students to explain concepts to each other, reinforcing their own understanding.',
        points: 15
      }
    ],
    required: true
  }
];

const generateDiscussionContent = (): SessionContentItem[] => [
  {
    id: 'discussion-1',
    type: 'discussion',
    title: 'Team Discussion',
    content: 'Discuss the following prompt with your team: How can we apply today's concepts in real-world situations?',
    required: true
  },
  {
    id: 'discussion-2',
    type: 'task',
    title: 'Discussion Summary',
    content: 'Summarize your team's key discussion points',
    required: true
  }
];

const generateAssignmentContent = (): SessionContentItem[] => [
  {
    id: 'assignment-1',
    type: 'task',
    title: 'Practical Assignment',
    content: 'Complete the following project: Create a presentation demonstrating your understanding of the session topics.',
    required: true
  },
  {
    id: 'assignment-2',
    type: 'text',
    title: 'Assignment Guidelines',
    content: 'Your presentation should include: Introduction, Main concepts (3-5), Real-world applications, Conclusion.',
    required: false
  }
];

export function SessionContent({
  activityId,
  sessionNumber,
  userId,
  onComplete,
  onNavigate,
  className
}: SessionContentProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [currentTab, setCurrentTab] = useState<'content' | 'materials' | 'notes'>('content');
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    loadSessionContent();
  }, [activityId, sessionNumber, userId]);

  const loadSessionContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // For demo, generate mock content
      // In production, this would fetch from database
      const mockSession = generateMockContent(sessionNumber, 5);
      mockSession.activity_id = activityId;
      setSessionData(mockSession);

      // Load user progress if exists
      const cachedProgress = localStorage.getItem(
        `session-progress-${activityId}-${sessionNumber}-${userId}`
      );
      
      if (cachedProgress) {
        const parsed = JSON.parse(cachedProgress);
        setUserProgress(parsed);
        setCompletedItems(new Set(parsed.completed_items));
        setQuizAnswers(parsed.quiz_scores || {});
        setNotes(parsed.notes || '');
      }

    } catch (err) {
      console.error('Error loading session content:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (autoSave = false) => {
    if (!sessionData) return;

    try {
      setSaving(true);

      const progressData: UserProgress = {
        session_id: sessionData.id,
        user_id: userId,
        completed_items: Array.from(completedItems),
        quiz_scores: quizAnswers,
        notes,
        submitted_at: autoSave ? undefined : new Date().toISOString()
      };

      // Save to localStorage for demo
      localStorage.setItem(
        `session-progress-${activityId}-${sessionNumber}-${userId}`,
        JSON.stringify(progressData)
      );

      setUserProgress(progressData);

      if (!autoSave) {
        toast({
          title: 'Progress Saved',
          description: 'Your session progress has been saved successfully',
        });
      }

    } catch (err) {
      console.error('Error saving progress:', err);
      if (!autoSave) {
        toast({
          title: 'Error',
          description: 'Failed to save progress',
          variant: 'destructive',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && sessionData) {
        saveProgress(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [completedItems, quizAnswers, notes, loading, sessionData]);

  const toggleItemCompletion = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const handleQuizAnswer = (questionId: string, answer: any) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateProgress = (): number => {
    if (!sessionData) return 0;
    const requiredItems = sessionData.content.filter(item => item.required);
    if (requiredItems.length === 0) return 100;
    
    const completedRequired = requiredItems.filter(item => 
      completedItems.has(item.id)
    ).length;
    
    return Math.round((completedRequired / requiredItems.length) * 100);
  };

  const handleComplete = async () => {
    await saveProgress();
    
    const progress = calculateProgress();
    if (progress < 100) {
      toast({
        title: 'Incomplete Session',
        description: 'Please complete all required items before marking the session as complete',
        variant: 'destructive',
      });
      return;
    }

    if (onComplete) {
      onComplete();
    }

    toast({
      title: '🎉 Session Complete!',
      description: 'Great job! You can now move to the next session.',
    });
  };

  const renderContentItem = (item: SessionContentItem) => {
    const isCompleted = completedItems.has(item.id);
    
    switch (item.type) {
      case 'text':
        return (
          <Card key={item.id} className={cn(isCompleted && "opacity-75")}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {item.title}
                {item.required && (
                  <Badge variant="outline" className="text-xs">Required</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                {item.content}
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={item.id}
                  checked={isCompleted}
                  onCheckedChange={() => toggleItemCompletion(item.id)}
                />
                <Label htmlFor={item.id} className="text-sm cursor-pointer">
                  Mark as read
                </Label>
              </div>
            </CardContent>
          </Card>
        );

      case 'video':
        return (
          <Card key={item.id} className={cn(isCompleted && "opacity-75")}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="h-5 w-5" />
                {item.title}
                {item.required && (
                  <Badge variant="outline" className="text-xs">Required</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <PlayCircle className="h-16 w-16 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">{item.content}</p>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={item.id}
                  checked={isCompleted}
                  onCheckedChange={() => toggleItemCompletion(item.id)}
                />
                <Label htmlFor={item.id} className="text-sm cursor-pointer">
                  Mark as watched
                </Label>
              </div>
            </CardContent>
          </Card>
        );

      case 'quiz':
        return (
          <Card key={item.id} className={cn(isCompleted && "opacity-75")}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileQuestion className="h-5 w-5" />
                {item.title}
                {item.required && (
                  <Badge variant="outline" className="text-xs">Required</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {item.questions?.map((question, idx) => (
                <div key={question.id} className="space-y-3 p-4 bg-accent/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-1">Q{idx + 1}</Badge>
                    <div className="flex-1 space-y-3">
                      <p className="font-medium">{question.question}</p>
                      
                      {question.type === 'multiple-choice' && (
                        <RadioGroup
                          value={quizAnswers[question.id]?.toString()}
                          onValueChange={(value) => handleQuizAnswer(question.id, parseInt(value))}
                        >
                          {question.options?.map((option, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <RadioGroupItem value={optIdx.toString()} id={`${question.id}-${optIdx}`} />
                              <Label htmlFor={`${question.id}-${optIdx}`} className="cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                      
                      {question.type === 'true-false' && (
                        <RadioGroup
                          value={quizAnswers[question.id]}
                          onValueChange={(value) => handleQuizAnswer(question.id, value)}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="true" id={`${question.id}-true`} />
                            <Label htmlFor={`${question.id}-true`} className="cursor-pointer">True</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="false" id={`${question.id}-false`} />
                            <Label htmlFor={`${question.id}-false`} className="cursor-pointer">False</Label>
                          </div>
                        </RadioGroup>
                      )}
                      
                      {question.type === 'short-answer' && (
                        <Textarea
                          placeholder="Type your answer here..."
                          value={quizAnswers[question.id] || ''}
                          onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                          className="min-h-[80px]"
                        />
                      )}
                      
                      {question.points && (
                        <p className="text-xs text-muted-foreground">
                          {question.points} points
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex items-center gap-2 pt-4">
                <Checkbox
                  id={item.id}
                  checked={isCompleted}
                  onCheckedChange={() => toggleItemCompletion(item.id)}
                />
                <Label htmlFor={item.id} className="text-sm cursor-pointer">
                  Mark quiz as complete
                </Label>
              </div>
            </CardContent>
          </Card>
        );

      case 'discussion':
      case 'task':
        return (
          <Card key={item.id} className={cn(isCompleted && "opacity-75")}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {item.type === 'discussion' ? (
                  <MessageSquare className="h-5 w-5" />
                ) : (
                  <Target className="h-5 w-5" />
                )}
                {item.title}
                {item.required && (
                  <Badge variant="outline" className="text-xs">Required</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{item.content}</p>
              <Textarea
                placeholder="Add your response or notes here..."
                className="min-h-[100px]"
                defaultValue=""
              />
              <div className="flex items-center gap-2">
                <Checkbox
                  id={item.id}
                  checked={isCompleted}
                  onCheckedChange={() => toggleItemCompletion(item.id)}
                />
                <Label htmlFor={item.id} className="text-sm cursor-pointer">
                  Mark as complete
                </Label>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </CardContent>
        </Card>
      </div>
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
              {error.message || 'Failed to load session content'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!sessionData) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No content available for this session
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const progress = calculateProgress();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{sessionData.title}</CardTitle>
              {sessionData.description && (
                <CardDescription className="mt-2">
                  {sessionData.description}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-2">
              {sessionData.duration_minutes && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {sessionData.duration_minutes} min
                </Badge>
              )}
              {sessionData.points && (
                <Badge variant="outline" className="gap-1">
                  <Award className="h-3 w-3" />
                  {sessionData.points} pts
                </Badge>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Session Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Learning Objectives */}
      {sessionData.objectives && sessionData.objectives.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sessionData.objectives.map((objective, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Content Tabs */}
      <Tabs value={currentTab} onValueChange={(v: any) => setCurrentTab(v)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">
            Content
            {sessionData.content.filter(c => c.required && !completedItems.has(c.id)).length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 px-1">
                {sessionData.content.filter(c => c.required && !completedItems.has(c.id)).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="notes">My Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {sessionData.content.map(renderContentItem)}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <div className="space-y-3">
            {sessionData.materials && sessionData.materials.length > 0 ? (
              sessionData.materials.map(material => (
                <Card key={material.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {material.type === 'pdf' && <FileText className="h-5 w-5 text-red-500" />}
                        {material.type === 'video' && <Video className="h-5 w-5 text-blue-500" />}
                        {material.type === 'doc' && <FileText className="h-5 w-5 text-blue-500" />}
                        {material.type === 'link' && <BookOpen className="h-5 w-5 text-green-500" />}
                        <div>
                          <p className="font-medium">{material.title}</p>
                          {material.size && (
                            <p className="text-xs text-muted-foreground">{material.size}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No additional materials for this session
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Personal Notes
              </CardTitle>
              <CardDescription>
                These notes are private and will be saved automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Take notes here... You can write about key concepts, questions, or anything else you want to remember."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[400px]"
              />
              <Button
                onClick={() => saveProgress()}
                disabled={saving}
                className="mt-4"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Notes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => onNavigate?.('prev')}
              disabled={sessionNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous Session
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => saveProgress()}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Progress
              </Button>
              
              {progress === 100 ? (
                <Button onClick={handleComplete}>
                  Complete Session
                  <CheckCircle2 className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={() => onNavigate?.('next')}
                  disabled={!onNavigate}
                >
                  Next Session
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}