"use client";

import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Shield, 
  UserCheck, 
  Mail, 
  Phone, 
  Link2, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Send,
  Copy,
  QrCode,
  Info,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Guardian {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: "parent" | "guardian" | "teacher" | "other";
  avatar?: string;
  verified: boolean;
  permissions: {
    viewGrades: boolean;
    viewActivity: boolean;
    viewFriends: boolean;
    manageFunds: boolean;
    receiveNotifications: boolean;
  };
  linkedAt?: Date;
}

interface GuardianLinkProps {
  className?: string;
  studentId: string;
  studentName?: string;
  currentGuardian?: Guardian | null;
  onLinkUpdate?: (guardian: Guardian | null) => void;
}

export default function GuardianLink({
  className,
  studentId,
  studentName = "Student",
  currentGuardian,
  onLinkUpdate
}: GuardianLinkProps) {
  const [loading, setLoading] = useState(false);
  const [guardian, setGuardian] = useState<Guardian | null>(currentGuardian || null);
  const [linkCode, setLinkCode] = useState<string>("");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  
  // Form state for linking new guardian
  const [linkForm, setLinkForm] = useState({
    email: "",
    relationship: "parent" as Guardian["relationship"],
    message: ""
  });

  // Generate unique link code
  const generateLinkCode = useCallback(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setLinkCode(code);
    return code;
  }, []);

  // Handle copy link code
  const handleCopyCode = useCallback(() => {
    if (linkCode) {
      navigator.clipboard.writeText(linkCode);
      toast({
        title: "Code copied",
        description: `Link code ${linkCode} copied to clipboard`,
      });
    }
  }, [linkCode]);

  // Handle send invitation
  const handleSendInvitation = useCallback(async () => {
    if (!linkForm.email) {
      toast({
        title: "Email required",
        description: "Please enter guardian's email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const code = generateLinkCode();
      setVerificationPending(true);
      
      toast({
        title: "Invitation sent",
        description: `Link code ${code} has been sent to ${linkForm.email}`,
      });
      
      setShowLinkDialog(false);
      
      // Simulate guardian accepting after delay
      setTimeout(() => {
        const newGuardian: Guardian = {
          id: Date.now().toString(),
          name: "Guardian Name",
          email: linkForm.email,
          relationship: linkForm.relationship,
          verified: false,
          permissions: {
            viewGrades: true,
            viewActivity: true,
            viewFriends: false,
            manageFunds: false,
            receiveNotifications: true
          },
          linkedAt: new Date()
        };
        
        setGuardian(newGuardian);
        setVerificationPending(false);
        onLinkUpdate?.(newGuardian);
      }, 5000);
      
    } catch (error) {
      toast({
        title: "Error sending invitation",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [linkForm, generateLinkCode, onLinkUpdate]);

  // Handle remove guardian
  const handleRemoveGuardian = useCallback(async () => {
    const confirmed = confirm("Are you sure you want to remove your guardian link? They will no longer have access to your information.");
    if (!confirmed) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGuardian(null);
      onLinkUpdate?.(null);
      
      toast({
        title: "Guardian removed",
        description: "Guardian link has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error removing guardian",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [onLinkUpdate]);

  // Handle permission toggle
  const handlePermissionToggle = useCallback((permission: keyof Guardian["permissions"]) => {
    if (!guardian) return;

    const updatedGuardian = {
      ...guardian,
      permissions: {
        ...guardian.permissions,
        [permission]: !guardian.permissions[permission]
      }
    };

    setGuardian(updatedGuardian);
    onLinkUpdate?.(updatedGuardian);
    
    toast({
      title: "Permissions updated",
      description: `${permission} has been ${updatedGuardian.permissions[permission] ? "enabled" : "disabled"}`,
    });
  }, [guardian, onLinkUpdate]);

  // Get relationship display text
  const getRelationshipText = (relationship: Guardian["relationship"]) => {
    switch(relationship) {
      case "parent": return "Parent";
      case "guardian": return "Guardian";
      case "teacher": return "Teacher";
      case "other": return "Other";
      default: return "Unknown";
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // No guardian state
  if (!guardian && !verificationPending) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Connect a Guardian</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Link a parent, guardian, or teacher to allow them to monitor your progress
            </p>
          </div>

          <Alert className="text-left">
            <Info className="h-4 w-4" />
            <AlertTitle>Why connect a guardian?</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Share your achievements and progress</li>
                <li>Get support with activities and goals</li>
                <li>Enable parental controls if required</li>
                <li>Allow grade and activity monitoring</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <DialogTrigger asChild>
              <Button>
                <Link2 className="h-4 w-4 mr-2" />
                Link Guardian
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Link a Guardian</DialogTitle>
                <DialogDescription>
                  Send an invitation to your parent, guardian, or teacher
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="email" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Email Invite</TabsTrigger>
                  <TabsTrigger value="code">Share Code</TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4">
                  <div>
                    <Label htmlFor="email">Guardian's Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="guardian@example.com"
                      value={linkForm.email}
                      onChange={(e) => setLinkForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="relationship">Relationship</Label>
                    <select
                      id="relationship"
                      className="w-full p-2 border rounded-md"
                      value={linkForm.relationship}
                      onChange={(e) => setLinkForm(prev => ({ 
                        ...prev, 
                        relationship: e.target.value as Guardian["relationship"]
                      }))}
                    >
                      <option value="parent">Parent</option>
                      <option value="guardian">Guardian</option>
                      <option value="teacher">Teacher</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Input
                      id="message"
                      placeholder="Hi, please accept my guardian link..."
                      value={linkForm.message}
                      onChange={(e) => setLinkForm(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>

                  <Button 
                    onClick={handleSendInvitation} 
                    className="w-full"
                    disabled={loading || !linkForm.email}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </TabsContent>

                <TabsContent value="code" className="space-y-4">
                  <div className="text-center space-y-4">
                    <div className="p-8 border-2 border-dashed rounded-lg">
                      <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">
                        QR Code would appear here
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        value={linkCode || "Generate code first"}
                        readOnly
                        className="font-mono text-center text-lg"
                      />
                      <Button
                        variant="outline"
                        onClick={linkCode ? handleCopyCode : generateLinkCode}
                      >
                        {linkCode ? (
                          <Copy className="h-4 w-4" />
                        ) : (
                          "Generate"
                        )}
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Share this code with your guardian. It expires in 24 hours.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    );
  }

  // Pending verification state
  if (verificationPending) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20">
            <Mail className="h-8 w-8 text-orange-600 animate-pulse" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">Invitation Sent</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Waiting for guardian to accept the invitation
            </p>
          </div>

          <Badge variant="secondary" className="font-mono">
            Code: {linkCode}
          </Badge>

          <Button variant="outline" onClick={() => setVerificationPending(false)}>
            Cancel Invitation
          </Button>
        </div>
      </Card>
    );
  }

  // Guardian linked state
  return (
    <Card className={cn("", className)}>
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={guardian?.avatar} />
              <AvatarFallback>
                {getInitials(guardian?.name || "Guardian")}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{guardian?.name}</h3>
                {guardian?.verified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {getRelationshipText(guardian?.relationship || "other")}
                </Badge>
                <span>{guardian?.email}</span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPermissions(!showPermissions)}
          >
            {showPermissions ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {showPermissions && guardian && (
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Guardian Permissions</h4>
            <div className="space-y-2">
              {Object.entries(guardian.permissions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                  <Label htmlFor={key} className="text-sm cursor-pointer flex items-center gap-2">
                    {key === "viewGrades" && <CheckCircle className="h-4 w-4" />}
                    {key === "viewActivity" && <Eye className="h-4 w-4" />}
                    {key === "viewFriends" && <Users className="h-4 w-4" />}
                    {key === "manageFunds" && <Shield className="h-4 w-4" />}
                    {key === "receiveNotifications" && <Mail className="h-4 w-4" />}
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Label>
                  <Button
                    variant={value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePermissionToggle(key as keyof Guardian["permissions"])}
                  >
                    {value ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              onClick={handleRemoveGuardian}
              disabled={loading}
              className="w-full"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Remove Guardian Link
            </Button>
          </div>
        </div>
      )}

      {!showPermissions && guardian?.linkedAt && (
        <div className="px-6 py-3 bg-muted/50 text-center text-sm text-muted-foreground">
          Linked {new Date(guardian.linkedAt).toLocaleDateString()}
        </div>
      )}
    </Card>
  );
}