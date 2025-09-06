'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Users, 
  MessageSquare, 
  MoreVertical,
  Loader2,
  Circle,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Reply
} from 'lucide-react';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  room_id: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    name: string;
    username: string;
    image_path?: string;
  };
  status?: 'sending' | 'sent' | 'failed';
  isEditing?: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  username: string;
  image_path?: string;
  is_online?: boolean;
  is_typing?: boolean;
}

interface TeamChatInterfaceProps {
  teamId: string;
  teamName?: string;
  currentUserId: string;
}

export function TeamChatInterface({ teamId, teamName, currentUserId }: TeamChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const supabase = createClient();

  useEffect(() => {
    initializeChat();
    
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [teamId]);

  const initializeChat = async () => {
    setLoading(true);
    try {
      // Get or create chat room for team
      let { data: room, error: roomError } = await supabase
        .from('room')
        .select('*')
        .eq('team_id', teamId)
        .eq('type', 'TEAM')
        .maybeSingle();

      if (roomError) throw roomError;

      if (!room) {
        // Create room if it doesn't exist
        const { data: newRoom, error: createError } = await supabase
          .from('room')
          .insert({
            type: 'TEAM',
            team_id: teamId,
            title: teamName || 'Team Chat'
          })
          .select()
          .single();

        if (createError) throw createError;
        room = newRoom;
      }

      setRoomId(room.id);

      // Load existing messages
      const { data: messageData, error: messageError } = await supabase
        .from('message')
        .select(`
          *,
          sender:sender_id(
            profile:profiles!inner(name, username, image_path)
          )
        `)
        .eq('room_id', room.id)
        .order('created_at', { ascending: true });

      if (messageError) throw messageError;

      const processedMessages = messageData?.map(msg => ({
        ...msg,
        sender: msg.sender?.profile,
        status: 'sent' as const
      })) || [];

      setMessages(processedMessages);

      // Load team members
      const { data: members, error: membersError } = await supabase
        .from('team_member')
        .select(`
          student:student_id(
            name,
            username,
            image_path
          )
        `)
        .eq('team_id', teamId)
        .eq('status', 'ACCEPTED');

      if (membersError) throw membersError;

      const processedMembers = members?.map(m => ({
        id: m.student.id,
        name: m.student.name,
        username: m.student.username,
        image_path: m.student.image_path,
        is_online: false
      })) || [];

      setTeamMembers(processedMembers);

      // Set up real-time subscription
      setupRealtimeSubscription(room.id);

    } catch (error: any) {
      console.error('Failed to initialize chat:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load chat',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = (roomId: string) => {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'chat',
          table: 'message',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          // Fetch sender info for new message
          const { data: senderData } = await supabase
            .from('profile')
            .select('name, username, image_path')
            .eq('id', payload.new.sender_id)
            .single();

          const newMsg: Message = {
            ...payload.new as Message,
            sender: senderData,
            status: 'sent'
          };

          setMessages(prev => [...prev, newMsg]);
          scrollToBottom();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'chat',
          table: 'message',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          setMessages(prev => prev.map(msg => 
            msg.id === payload.new.id 
              ? { ...msg, ...payload.new as Message }
              : msg
          ));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'chat',
          table: 'message',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        updateOnlineStatus(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        handleTypingIndicator(payload.user_id, payload.is_typing);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: currentUserId });
        }
      });

    channelRef.current = channel;
  };

  const updateOnlineStatus = (presenceState: any) => {
    const onlineUsers = new Set<string>();
    Object.values(presenceState).forEach((presence: any) => {
      if (Array.isArray(presence)) {
        presence.forEach(p => onlineUsers.add(p.user_id));
      }
    });

    setTeamMembers(prev => prev.map(member => ({
      ...member,
      is_online: onlineUsers.has(member.id)
    })));
  };

  const handleTypingIndicator = (userId: string, isTyping: boolean) => {
    if (userId === currentUserId) return;

    setTypingUsers(prev => {
      const newSet = new Set(prev);
      if (isTyping) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  };

  const sendTypingIndicator = (isTyping: boolean) => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: currentUserId, is_typing: isTyping }
      });
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    // Send typing indicator
    if (value && !typingTimeoutRef.current) {
      sendTypingIndicator(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !roomId || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);
    sendTypingIndicator(false);

    // Optimistically add message
    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      content: messageContent,
      sender_id: currentUserId,
      room_id: roomId,
      is_system: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, tempMessage]);
    scrollToBottom();

    try {
      const { data, error } = await supabase
        .from('message')
        .insert({
          room_id: roomId,
          sender_id: currentUserId,
          content: messageContent,
          is_system: false
        })
        .select()
        .single();

      if (error) throw error;

      // Remove temp message (real one will come through subscription)
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    } catch (error: any) {
      // Mark message as failed
      setMessages(prev => prev.map(msg => 
        msg.id === tempId 
          ? { ...msg, status: 'failed' as const }
          : msg
      ));

      toast({
        variant: 'destructive',
        title: 'Failed to send message',
        description: error.message
      });
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('message')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', currentUserId); // Only allow deleting own messages

      if (error) throw error;

      toast({
        title: 'Message deleted',
        description: 'Your message has been removed'
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete message',
        description: error.message
      });
    }
  };

  const editMessage = async (messageId: string) => {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('message')
        .update({
          content: editContent.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('sender_id', currentUserId);

      if (error) throw error;

      setEditingMessageId(null);
      setEditContent('');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to edit message',
        description: error.message
      });
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const formatMessageDate = (date: string) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) {
      return `Today at ${format(messageDate, 'h:mm a')}`;
    } else if (isYesterday(messageDate)) {
      return `Yesterday at ${format(messageDate, 'h:mm a')}`;
    } else {
      return format(messageDate, 'MMM d, h:mm a');
    }
  };

  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending':
        return <Loader2 className="h-3 w-3 animate-spin text-gray-400" />;
      case 'sent':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const typingUsersList = Array.from(typingUsers)
    .map(id => teamMembers.find(m => m.id === id)?.name)
    .filter(Boolean);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex h-[600px] gap-4">
      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {teamName || 'Team Chat'}
            </CardTitle>
            <Badge variant="secondary">
              <Users className="h-3 w-3 mr-1" />
              {teamMembers.filter(m => m.is_online).length}/{teamMembers.length} online
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => {
                const showDate = index === 0 || 
                  new Date(messages[index - 1].created_at).toDateString() !== 
                  new Date(message.created_at).toDateString();

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="text-center my-4">
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {format(new Date(message.created_at), 'MMMM d, yyyy')}
                        </span>
                      </div>
                    )}

                    <div className={cn(
                      "flex gap-3",
                      message.sender_id === currentUserId && "flex-row-reverse"
                    )}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.sender?.image_path} />
                        <AvatarFallback>
                          {message.sender?.name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>

                      <div className={cn(
                        "flex-1 max-w-[70%]",
                        message.sender_id === currentUserId && "flex flex-col items-end"
                      )}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {message.sender?.name || 'Unknown'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatMessageDate(message.created_at)}
                          </span>
                          {message.status && getMessageStatusIcon(message.status)}
                        </div>

                        {editingMessageId === message.id ? (
                          <div className="flex gap-2">
                            <Input
                              name="edit"
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') editMessage(message.id);
                                if (e.key === 'Escape') {
                                  setEditingMessageId(null);
                                  setEditContent('');
                                }
                              }}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              onClick={() => editMessage(message.id)}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div className={cn(
                            "relative group",
                            message.is_system 
                              ? "italic text-gray-500" 
                              : message.sender_id === currentUserId
                                ? "bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-2"
                                : "bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-2"
                          )}>
                            {message.content}
                            {message.updated_at !== message.created_at && (
                              <span className="text-xs opacity-60 ml-2">(edited)</span>
                            )}

                            {/* Message Actions */}
                            {message.sender_id === currentUserId && !message.is_system && (
                              <div className="absolute -top-8 right-0 hidden group-hover:flex gap-1 bg-white dark:bg-gray-900 border rounded-lg p-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setEditingMessageId(message.id);
                                    setEditContent(message.content);
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-red-500"
                                  onClick={() => deleteMessage(message.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {typingUsersList.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex gap-1">
                    <Circle className="h-2 w-2 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <Circle className="h-2 w-2 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <Circle className="h-2 w-2 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  {typingUsersList.length === 1
                    ? `${typingUsersList[0]} is typing...`
                    : `${typingUsersList.slice(0, -1).join(', ')} and ${typingUsersList.slice(-1)} are typing...`}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                name="message"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={sending}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sending}
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Sidebar */}
      <Card className="w-64">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Team Members</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <ScrollArea className="h-[520px]">
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.image_path} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    {member.is_online && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-gray-500">
                      {member.is_typing ? 'Typing...' : member.is_online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}