"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import FriendsList from "@/components/social/FriendsList";
import FriendRequests from "@/components/social/FriendRequests";
import SocialActivityFeed from "@/components/social/SocialActivityFeed";
import GuardianLink from "@/components/social/GuardianLink";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Activity, 
  Shield,
  Sparkles
} from "lucide-react";

export default function SocialPage() {
  // Mock user ID for demonstration
  const mockUserId = "user-123";
  const mockUserName = "Current Student";

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Social Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect with friends, track activities, and manage your network
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Session 170
        </Badge>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Friends & Requests */}
        <div className="lg:col-span-1 space-y-6">
          {/* Friends List */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Friends</h2>
            </div>
            <FriendsList 
              onMessageClick={(friendId) => {
                console.log("Opening chat with friend:", friendId);
              }}
            />
          </div>

          {/* Friend Requests */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Friend Requests</h2>
            </div>
            <FriendRequests 
              onRequestUpdate={() => {
                console.log("Friend requests updated");
              }}
            />
          </div>
        </div>

        {/* Middle Column - Activity Feed */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Activity Feed</h2>
          </div>
          <SocialActivityFeed 
            userId={mockUserId}
            showFilters={true}
            limit={20}
          />
        </div>

        {/* Right Column - Guardian & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Guardian Link */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Guardian Connection</h2>
            </div>
            <GuardianLink 
              studentId={mockUserId}
              studentName={mockUserName}
              onLinkUpdate={(guardian) => {
                console.log("Guardian updated:", guardian);
              }}
            />
          </div>

          {/* Social Stats */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Social Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Friends</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Requests</span>
                <Badge variant="destructive">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Activities Shared</span>
                <Badge variant="secondary">45</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Social Score</span>
                <Badge variant="default">850</Badge>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm">
                🎯 Find new friends
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm">
                💬 Start group chat
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm">
                📅 Create event
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm">
                🏆 View leaderboard
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile-optimized Tabs View */}
      <div className="lg:hidden">
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="friends">
              <Users className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="requests">
              <UserPlus className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="guardian">
              <Shield className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="mt-4">
            <FriendsList />
          </TabsContent>

          <TabsContent value="requests" className="mt-4">
            <FriendRequests />
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <SocialActivityFeed userId={mockUserId} />
          </TabsContent>

          <TabsContent value="guardian" className="mt-4">
            <GuardianLink 
              studentId={mockUserId}
              studentName={mockUserName}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}