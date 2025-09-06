"use client"

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmCoinBalanceDisplay } from "@/components/emcoin/emcoin-balance-display";
import { VisitorTracker, VisitorCountBadge } from "@/components/profile/visitor-tracker";
import { Progress } from "@/components/ui/progress";
import { getLevelFromExp } from "@/lib/utils";
import { 
  Trophy, 
  Users, 
  School, 
  MapPin, 
  Calendar,
  Mail,
  UserPlus,
  UserCheck,
  Clock,
  Star,
  Shield,
  Target,
  Award,
  Zap
} from "lucide-react";
import { sendFriendRequest } from "@/lib/actions/friend-actions";
import { toast } from "@/hooks/use-toast";

interface ProfileDisplayProps {
  profile: any;
  isOwnProfile: boolean;
  additionalData: any;
}

export function ProfileDisplay({ profile, isOwnProfile, additionalData }: ProfileDisplayProps) {
  const [sendingRequest, setSendingRequest] = useState(false);
  const { achievements = [], teams = [], friendship } = additionalData;
  
  // Calculate level from exp for students
  const studentData = profile.student;
  const { level, exp } = studentData 
    ? getLevelFromExp(studentData.exp)
    : { level: 1, exp: 0 };

  const handleFriendRequest = async () => {
    setSendingRequest(true);
    try {
      const result = await sendFriendRequest(profile.id);
      if (result.success) {
        toast({
          title: "Friend Request Sent",
          description: `Request sent to ${profile.name}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to send request",
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    }
    setSendingRequest(false);
  };

  const getFriendButton = () => {
    if (isOwnProfile) return null;
    
    if (friendship?.status === 'ACCEPTED') {
      return (
        <Button variant="secondary" disabled>
          <UserCheck className="h-4 w-4 mr-1" />
          Friends
        </Button>
      );
    }
    
    if (friendship?.status === 'PENDING') {
      return (
        <Button variant="secondary" disabled>
          <Clock className="h-4 w-4 mr-1" />
          Pending
        </Button>
      );
    }
    
    return (
      <Button 
        onClick={handleFriendRequest}
        disabled={sendingRequest}
      >
        <UserPlus className="h-4 w-4 mr-1" />
        Add Friend
      </Button>
    );
  };

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="relative">
              {profile.image_path ? (
                <Image
                  src={profile.image_path}
                  alt={profile.name}
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-[150px] h-[150px] rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                  {profile.name?.slice(0, 2).toUpperCase()}
                </div>
              )}
              {studentData && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Lv. {level}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-gray-600">@{profile.username}</p>
              </div>

              {/* User role badge and stats */}
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant={
                  profile.user_role === 'STUDENT' ? 'default' :
                  profile.user_role === 'JUDGE' ? 'secondary' : 
                  'outline'
                }>
                  {profile.user_role}
                </Badge>
                
                {studentData?.division && (
                  <Badge variant="outline">
                    <Shield className="h-3 w-3 mr-1" />
                    {studentData.division}
                  </Badge>
                )}

                {studentData?.school && (
                  <Badge variant="outline">
                    <School className="h-3 w-3 mr-1" />
                    {studentData.school.name}
                  </Badge>
                )}

                {!isOwnProfile && <VisitorCountBadge userId={profile.id} />}
              </div>

              {/* Student Level Progress */}
              {studentData && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level {level}</span>
                    <span>{exp} / {getLevelFromExp(studentData.exp).nextLevelExp} XP</span>
                  </div>
                  <Progress 
                    value={(exp / getLevelFromExp(studentData.exp).nextLevelExp) * 100} 
                    className="h-2"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {getFriendButton()}
                {profile.email && isOwnProfile && (
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-1" />
                    {profile.email}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* EmCoin Balance (only for own profile) */}
          {isOwnProfile && <EmCoinBalanceDisplay />}

          {/* Visitor Tracker */}
          <VisitorTracker profileId={isOwnProfile ? undefined : profile.id} />

          {/* Quick Stats */}
          {studentData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ranking</span>
                  <span className="font-semibold">#{studentData.ranking || 'Unranked'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Challenges</span>
                  <span className="font-semibold">
                    {studentData.challenge_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                {studentData.graduation_year && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Graduation</span>
                    <span className="font-semibold">{studentData.graduation_year}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">
                <Trophy className="h-4 w-4 mr-1" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="teams">
                <Users className="h-4 w-4 mr-1" />
                Teams
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Zap className="h-4 w-4 mr-1" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  {achievements.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {achievements.map((ua: any) => (
                        <div
                          key={ua.id}
                          className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <Award className={`h-12 w-12 mb-2 ${
                            ua.achievement.rarity === 'legendary' ? 'text-yellow-500' :
                            ua.achievement.rarity === 'epic' ? 'text-purple-500' :
                            ua.achievement.rarity === 'rare' ? 'text-blue-500' :
                            'text-gray-500'
                          }`} />
                          <p className="text-sm font-semibold text-center">
                            {ua.achievement.name}
                          </p>
                          {ua.emcoin_awarded > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              +{ua.emcoin_awarded} 🪙
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(ua.earned_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No achievements earned yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Teams & Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  {teams.length > 0 ? (
                    <div className="space-y-3">
                      {teams.map((tm: any) => (
                        <div
                          key={tm.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">{tm.team.name}</p>
                            <p className="text-sm text-gray-600">
                              {tm.team.description}
                            </p>
                          </div>
                          {tm.is_leader && (
                            <Badge variant="secondary">
                              <Star className="h-3 w-3 mr-1" />
                              Leader
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      Not part of any teams yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-8">
                    No recent activity to display
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}