"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  User, 
  Search, 
  UserPlus, 
  Circle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useFriends, FriendWithStatus } from "@/hooks/use-friends";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface FriendsListProps {
  className?: string;
  onMessageClick?: (friendId: string) => void;
  compact?: boolean;
}

export default function FriendsList({ 
  className, 
  onMessageClick,
  compact = false 
}: FriendsListProps) {
  // State management with defensive programming
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  
  // Use existing friends hook
  const { friends, friendRequests } = useFriends();
  const router = useRouter();

  // Filter friends based on search with defensive null checks
  const filteredFriends = friends?.filter(friend => {
    if (!searchQuery) return true;
    const name = friend?.friend?.full_name || friend?.friend?.user_name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  // Handle initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Retry logic for errors
  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    setRetryCount(prev => prev + 1);
    
    // Simulate retry - in production, this would refetch
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Handle friend profile navigation
  const handleViewProfile = useCallback((friendId: string) => {
    if (!friendId) {
      toast({
        title: "Error",
        description: "Invalid friend ID",
        variant: "destructive",
      });
      return;
    }
    router.push(`/profile/${friendId}`);
  }, [router]);

  // Handle message click with fallback
  const handleMessage = useCallback((friendId: string, friendName: string) => {
    if (onMessageClick) {
      onMessageClick(friendId);
    } else {
      // Fallback to navigation if no custom handler
      router.push(`/chat/${friendId}`);
    }
    
    toast({
      title: "Opening chat",
      description: `Starting conversation with ${friendName}`,
    });
  }, [onMessageClick, router]);

  // Get initials for avatar fallback
  const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Get status color and text
  const getStatusDisplay = (status: "online" | "onDebate" | null) => {
    switch(status) {
      case "online":
        return { color: "text-green-500", text: "Online", dotColor: "bg-green-500" };
      case "onDebate":
        return { color: "text-orange-500", text: "In Debate", dotColor: "bg-orange-500" };
      default:
        return { color: "text-gray-400", text: "Offline", dotColor: "bg-gray-400" };
    }
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <h3 className="font-semibold text-lg">Unable to load friends</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message || "An unexpected error occurred"}
            </p>
          </div>
          <Button 
            onClick={handleRetry} 
            variant="outline"
            disabled={retryCount > 3}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryCount > 3 ? "Max retries reached" : "Try Again"}
          </Button>
        </div>
      </Card>
    );
  }

  // Empty state
  if (!friends || friends.length === 0) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <UserPlus className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="font-semibold text-lg">No friends yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Start connecting with other users to build your network!
            </p>
          </div>
          {friendRequests?.length > 0 && (
            <Badge variant="secondary">
              {friendRequests.length} pending request{friendRequests.length !== 1 ? 's' : ''}
            </Badge>
          )}
          <Button onClick={() => router.push("/directory")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Find Friends
          </Button>
        </div>
      </Card>
    );
  }

  // Main friends list display
  return (
    <Card className={cn("flex flex-col", className)}>
      {!compact && (
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Friends</h2>
            <Badge variant="outline">{filteredFriends.length}</Badge>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {friendRequests?.length > 0 && (
            <Button 
              variant="outline" 
              className="w-full mt-3"
              onClick={() => router.push("/friends/requests")}
            >
              <Badge variant="destructive" className="mr-2">
                {friendRequests.length}
              </Badge>
              View Friend Requests
            </Button>
          )}
        </div>
      )}

      <ScrollArea className={compact ? "h-[300px]" : "h-[400px]"}>
        <div className="p-4 space-y-2">
          {filteredFriends.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No friends match your search
            </div>
          ) : (
            filteredFriends.map((friend) => {
              const statusDisplay = getStatusDisplay(friend.status);
              const friendData = friend?.friend;
              
              // Defensive checks for friend data
              if (!friendData) return null;
              
              return (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
                  onClick={() => handleViewProfile(friendData.id)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={friendData.profile_picture || undefined} 
                        alt={friendData.full_name || friendData.user_name}
                      />
                      <AvatarFallback>
                        {getInitials(friendData.full_name || friendData.user_name)}
                      </AvatarFallback>
                    </Avatar>
                    <Circle 
                      className={cn(
                        "absolute bottom-0 right-0 h-3 w-3",
                        statusDisplay.dotColor
                      )}
                      fill="currentColor"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {friendData.full_name || friendData.user_name || "Unknown"}
                      </p>
                      {friend.status && (
                        <Badge variant="secondary" className="text-xs">
                          {statusDisplay.text}
                        </Badge>
                      )}
                    </div>
                    {friendData.school && (
                      <p className="text-xs text-muted-foreground truncate">
                        {friendData.school}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMessage(
                          friendData.id, 
                          friendData.full_name || friendData.user_name || "Friend"
                        );
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProfile(friendData.id);
                      }}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}