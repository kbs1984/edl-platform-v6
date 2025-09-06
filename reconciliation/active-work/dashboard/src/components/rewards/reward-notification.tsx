"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Coins, Gift, Trophy, Star, Users, Calendar } from "lucide-react";
import { useRewardSystem, useDailyLoginReward } from "@/hooks/use-reward-system";
import { formatDistanceToNow } from "date-fns";

/**
 * Component for displaying and claiming rewards
 * Implements all defensive programming patterns from workflow appendix
 */
export function RewardNotification() {
  const {
    availableRewards,
    rewardHistory,
    loading,
    claiming,
    error,
    claimReward,
    refreshRewards,
  } = useRewardSystem();

  // Auto-check for daily login bonus
  useDailyLoginReward();

  // Refresh rewards periodically (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshRewards();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshRewards]);

  // Loading state with skeleton
  if (loading && !availableRewards?.length && !rewardHistory?.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Error state with retry
  if (error && !availableRewards?.length) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load rewards: {error}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshRewards}
            disabled={loading}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Available Rewards */}
      {availableRewards?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-yellow-500" />
              Available Rewards
            </CardTitle>
            <CardDescription>
              Claim your rewards before they expire!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableRewards.map((reward) => (
              <div
                key={`${reward.type}-${reward.key}`}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
              >
                <div className="flex items-center gap-3">
                  {getRewardIcon(reward.type)}
                  <div>
                    <p className="font-medium">{reward.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {reward.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-yellow-100">
                    +{reward.amount} <Coins className="h-3 w-3 ml-1" />
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => claimReward(reward.type, reward.key)}
                    disabled={claiming}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500"
                  >
                    {claiming ? "Claiming..." : "Claim"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Reward History */}
      {rewardHistory?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              Recent Rewards
            </CardTitle>
            <CardDescription>
              Your claimed rewards history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rewardHistory.slice(0, 5).map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {getRewardIcon(claim.reward_type as any)}
                    <div>
                      <p className="text-sm font-medium">
                        {formatRewardType(claim.reward_type)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {claim.claimed_at ? formatDistanceToNow(new Date(claim.claimed_at), { addSuffix: true }) : "Unknown time"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    +{claim.amount} <Coins className="h-3 w-3 ml-1" />
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!loading && availableRewards?.length === 0 && rewardHistory?.length === 0 && (
        <Card className="text-center py-8">
          <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No rewards available yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Complete activities to earn rewards!
          </p>
        </Card>
      )}
    </div>
  );
}

// Helper function to get icon for reward type
function getRewardIcon(type: string) {
  switch (type) {
    case "daily_login":
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case "achievement":
      return <Trophy className="h-4 w-4 text-purple-500" />;
    case "activity":
      return <Star className="h-4 w-4 text-green-500" />;
    case "profile_milestone":
      return <Star className="h-4 w-4 text-yellow-500" />;
    case "friend_referral":
      return <Users className="h-4 w-4 text-pink-500" />;
    default:
      return <Gift className="h-4 w-4 text-gray-500" />;
  }
}

// Helper function to format reward type
function formatRewardType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}