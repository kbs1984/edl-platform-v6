"use client";

import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  X, 
  UserPlus, 
  Clock,
  AlertCircle,
  Send,
  Users
} from "lucide-react";
import { useFriends } from "@/hooks/use-friends";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Friendship } from "@/types";
import { 
  acceptFriendRequestAction, 
  rejectFriendRequestAction 
} from "@/lib/actions/student-actions";

interface FriendRequestsProps {
  className?: string;
  compact?: boolean;
  onRequestUpdate?: () => void;
}

export default function FriendRequests({ 
  className, 
  compact = false,
  onRequestUpdate 
}: FriendRequestsProps) {
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  
  const { friendRequests } = useFriends();
  
  // Separate received and sent requests with defensive checks
  const receivedRequests = friendRequests?.filter(
    req => req?.status === "PENDING" && req?.friend_id === req?.current_user_id
  ) || [];
  
  const sentRequests = friendRequests?.filter(
    req => req?.status === "PENDING" && req?.user_id === req?.current_user_id
  ) || [];

  // Handle initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle accept request with error handling
  const handleAccept = useCallback(async (requestId: string, userName: string) => {
    if (!requestId) {
      toast({
        title: "Error",
        description: "Invalid request ID",
        variant: "destructive",
      });
      return;
    }

    setProcessingIds(prev => new Set(prev).add(requestId));
    
    try {
      const result = await acceptFriendRequestAction(requestId);
      
      if (result?.status === "error") {
        throw new Error(result.message || "Failed to accept request");
      }
      
      toast({
        title: "Friend request accepted",
        description: `You are now friends with ${userName}`,
      });
      
      onRequestUpdate?.();
    } catch (error) {
      toast({
        title: "Error accepting request",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  }, [onRequestUpdate]);

  // Handle reject request with confirmation
  const handleReject = useCallback(async (requestId: string, userName: string) => {
    if (!requestId) {
      toast({
        title: "Error",
        description: "Invalid request ID",
        variant: "destructive",
      });
      return;
    }

    // Optional: Add confirmation dialog here
    const confirmed = confirm(`Are you sure you want to reject the friend request from ${userName}?`);
    if (!confirmed) return;

    setProcessingIds(prev => new Set(prev).add(requestId));
    
    try {
      const result = await rejectFriendRequestAction(requestId);
      
      if (result?.status === "error") {
        throw new Error(result.message || "Failed to reject request");
      }
      
      toast({
        title: "Friend request declined",
        description: `Request from ${userName} has been declined`,
      });
      
      onRequestUpdate?.();
    } catch (error) {
      toast({
        title: "Error rejecting request",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  }, [onRequestUpdate]);

  // Get initials for avatar
  const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Format date with defensive checks
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Unknown date";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      
      return date.toLocaleDateString();
    } catch {
      return "Unknown date";
    }
  };

  // Render request item
  const renderRequestItem = (request: Friendship, type: "received" | "sent") => {
    const isProcessing = processingIds.has(request.id);
    const userData = type === "received" ? request.user : request.friend;
    
    // Defensive check for user data
    if (!userData) return null;
    
    return (
      <div
        key={request.id}
        className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
      >
        <Avatar className="h-12 w-12">
          <AvatarImage 
            src={userData.profile_picture || undefined} 
            alt={userData.full_name || userData.user_name}
          />
          <AvatarFallback>
            {getInitials(userData.full_name || userData.user_name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">
              {userData.full_name || userData.user_name || "Unknown User"}
            </p>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(request.created_at)}
            </Badge>
          </div>
          {userData.school && (
            <p className="text-sm text-muted-foreground truncate">
              {userData.school}
            </p>
          )}
          {request.message && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              "{request.message}"
            </p>
          )}
        </div>

        {type === "received" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => handleAccept(request.id, userData.full_name || userData.user_name || "User")}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              <span className="ml-1 hidden sm:inline">Accept</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReject(request.id, userData.full_name || userData.user_name || "User")}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full" />
              ) : (
                <X className="h-4 w-4" />
              )}
              <span className="ml-1 hidden sm:inline">Decline</span>
            </Button>
          </div>
        )}

        {type === "sent" && (
          <Badge variant="secondary">
            <Send className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Compact view for sidebar
  if (compact) {
    const totalRequests = receivedRequests.length + sentRequests.length;
    
    if (totalRequests === 0) {
      return null;
    }
    
    return (
      <Card className={cn("p-3", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Friend Requests</span>
          </div>
          <Badge variant="destructive">
            {receivedRequests.length}
          </Badge>
        </div>
      </Card>
    );
  }

  // Full view with tabs
  return (
    <Card className={cn("flex flex-col", className)}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Friend Requests
          </h2>
          <div className="flex gap-2">
            {receivedRequests.length > 0 && (
              <Badge variant="destructive">{receivedRequests.length} new</Badge>
            )}
            {sentRequests.length > 0 && (
              <Badge variant="secondary">{sentRequests.length} sent</Badge>
            )}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "received" | "sent")} className="flex-1">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="received" className="flex-1">
            Received
            {receivedRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {receivedRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex-1">
            Sent
            {sentRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {sentRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-0">
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-3">
              {receivedRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending friend requests</p>
                </div>
              ) : (
                receivedRequests.map(request => renderRequestItem(request, "received"))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sent" className="mt-0">
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-3">
              {sentRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Send className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No sent friend requests</p>
                </div>
              ) : (
                sentRequests.map(request => renderRequestItem(request, "sent"))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}