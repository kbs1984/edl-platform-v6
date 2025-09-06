"use client";

import { useState } from "react";
import { useProfileCustomization } from "@/hooks/use-profile-customization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, MessageSquare, Eye, EyeOff, Sparkles, Lock, Coins } from "lucide-react";
import { EmCoinDisplay } from "@/components/emcoin/emcoin-display";

interface ProfileCustomizationProps {
  userId: string;
  isOwnProfile?: boolean;
}

const EMOJI_OPTIONS = ["😊", "🔥", "💪", "🎯", "🌟", "🚀", "💡", "🎨", "🎮", "📚", "🏆", "💎"];

export function ProfileCustomization({ userId, isOwnProfile = false }: ProfileCustomizationProps) {
  const {
    customization,
    themes,
    emcoinBalance,
    loading,
    updateStatus,
    purchaseTheme,
    toggleVisibility,
    updateCustomCSS,
  } = useProfileCustomization(userId);

  const [statusMessage, setStatusMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [customCSS, setCustomCSS] = useState("");
  const [isEditingCSS, setIsEditingCSS] = useState(false);

  if (!isOwnProfile) {
    // View-only mode for other users' profiles
    if (!customization) return null;
    
    return (
      <div className="space-y-4">
        {/* Status Display */}
        {(customization.status_message || customization.status_emoji) && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {customization.status_emoji && (
                  <span className="text-3xl">{customization.status_emoji}</span>
                )}
                <p className="text-lg">{customization.status_message}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Apply custom styles if public */}
        {customization.is_public && customization.custom_css && (
          <style dangerouslySetInnerHTML={{ __html: customization.custom_css }} />
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* EmCoin Balance */}
      <EmCoinDisplay userId={userId} showDetails />

      {/* Customization Tabs */}
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">
            <MessageSquare className="h-4 w-4 mr-2" />
            Status
          </TabsTrigger>
          <TabsTrigger value="theme">
            <Palette className="h-4 w-4 mr-2" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="style">
            <Sparkles className="h-4 w-4 mr-2" />
            Style
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Eye className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Status Tab */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
              <CardDescription>
                Set a status message that appears on your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Status */}
              {customization && (customization.status_message || customization.status_emoji) && (
                <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
                  {customization.status_emoji && (
                    <span className="text-2xl">{customization.status_emoji}</span>
                  )}
                  <p>{customization.status_message || "No status message"}</p>
                </div>
              )}

              {/* Emoji Selector */}
              <div className="space-y-2">
                <Label>Select Emoji</Label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <Button
                      key={emoji}
                      variant={selectedEmoji === emoji ? "default" : "outline"}
                      size="sm"
                      className="text-xl p-2"
                      onClick={() => setSelectedEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Message */}
              <div className="space-y-2">
                <Label htmlFor="status">Status Message</Label>
                <Textarea
                  id="status"
                  name="status"
                  placeholder="What's on your mind?"
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {statusMessage.length}/200 characters
                </p>
              </div>

              <Button
                onClick={() => {
                  updateStatus(statusMessage, selectedEmoji || undefined);
                  setStatusMessage("");
                  setSelectedEmoji(null);
                }}
                disabled={!statusMessage && !selectedEmoji}
              >
                Update Status
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Profile Themes</CardTitle>
              <CardDescription>
                Purchase and apply themes using EmCoins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {themes.map((theme) => {
                  const isOwned = customization?.theme_id === theme.id;
                  const canAfford = emcoinBalance >= theme.emcoin_cost;

                  return (
                    <Card key={theme.id} className={isOwned ? "border-primary" : ""}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{theme.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <Coins className="h-3 w-3" />
                              {theme.emcoin_cost} EmCoins
                            </CardDescription>
                          </div>
                          {isOwned && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                              Current
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Color Preview */}
                        <div className="flex gap-2 mb-3">
                          <div
                            className="h-8 w-8 rounded"
                            style={{ backgroundColor: theme.primary_color }}
                            title="Primary"
                          />
                          <div
                            className="h-8 w-8 rounded"
                            style={{ backgroundColor: theme.secondary_color }}
                            title="Secondary"
                          />
                          <div
                            className="h-8 w-8 rounded"
                            style={{ backgroundColor: theme.accent_color }}
                            title="Accent"
                          />
                        </div>

                        {!isOwned && (
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => purchaseTheme(theme.id)}
                            disabled={!canAfford}
                          >
                            {canAfford ? (
                              <>Purchase</>
                            ) : (
                              <>
                                <Lock className="h-3 w-3 mr-1" />
                                Need {theme.emcoin_cost - emcoinBalance} more
                              </>
                            )}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Style Tab */}
        <TabsContent value="style">
          <Card>
            <CardHeader>
              <CardTitle>Custom Styles</CardTitle>
              <CardDescription>
                Advanced: Add custom CSS to personalize your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog open={isEditingCSS} onOpenChange={setIsEditingCSS}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Edit Custom CSS
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Custom CSS Editor</DialogTitle>
                    <DialogDescription>
                      Add custom styles to make your profile unique. Use with caution!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      name="customCSS"
                      placeholder=".my-profile { background: linear-gradient(...); }"
                      value={customCSS}
                      onChange={(e) => setCustomCSS(e.target.value)}
                      className="font-mono text-sm h-64"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsEditingCSS(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          updateCustomCSS(customCSS);
                          setIsEditingCSS(false);
                        }}
                      >
                        Apply Styles
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {customization?.custom_css && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Current Custom CSS</p>
                  <pre className="text-xs overflow-x-auto">
                    {customization.custom_css.substring(0, 200)}
                    {customization.custom_css.length > 200 && "..."}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your profile customizations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-profile">Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to see your customizations
                  </p>
                </div>
                <Switch
                  id="public-profile"
                  checked={customization?.is_public || false}
                  onCheckedChange={toggleVisibility}
                />
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {customization?.is_public ? (
                    <>
                      <Eye className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Profile is Public</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Profile is Private</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {customization?.is_public
                    ? "Your themes, status, and customizations are visible to everyone"
                    : "Only you can see your profile customizations"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Apply custom styles */}
      {customization?.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: customization.custom_css }} />
      )}
    </div>
  );
}