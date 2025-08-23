"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Plus, Crown, X, Search, Loader2, Users } from "lucide-react" // Added Users icon
import { getFriendListAction } from "@/lib/actions/student-actions";
import { checkTeamNameAvailability, createTeamAction } from '@/lib/actions/team-actions';
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getProfile } from "@/utils/get-user-info"
import { InviteMemberDialog } from "@/components/team/invite-member-dialog"
import { Friend } from "@/types"
import { toast } from "@/hooks/use-toast"

type TeamMember = {
  id: string;
  username: string;
  image_path: string;
}

type TeamFormData = {
  teamName: string;
  description: string;
  invitedMembers: Friend[];
};

export default function Page() {
  const router = useRouter()

  const [formData, setFormData] = useState<TeamFormData>({
    teamName: "",
    description: "",
    invitedMembers: [], // Stores users selected for invitation
  });
  const [logo, setLogo] = useState<File | null>(null); // Renamed state for logo
  const [teamNameStatus, setTeamNameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [teamNameDebounceTimeout, setTeamNameDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [creator, setCreator] = useState<TeamMember | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      const profile = await getProfile();
      if (profile && profile.username && profile.image_path) {
        const creator: TeamMember = {
          id: profile.id,
          username: profile.username,
          image_path: profile.image_path,
        };
        setCreator(creator);
      } else {
        toast({
          variant: "destructive",
          title: "Error fetching user info",
          description: "Could not load your details.",
        });
      }
    };

    fetchInitialData();
  }, [toast]); // Added toast to dependency array

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "teamName") {
      // 유효한 형식이면 debounce 후 availability 체크
      setTeamNameStatus("checking")

      if (teamNameDebounceTimeout) {
        clearTimeout(teamNameDebounceTimeout)
      }

      const timeout = setTimeout(async () => {
        const isAvailable = await checkTeamNameAvailability(value)
        setTeamNameStatus(isAvailable ? "available" : "taken")
      }, 500)
      setTeamNameDebounceTimeout(timeout)
    }
  }

  const handleInviteMembers = (member: Friend) => {
    // Max 3 total (1 creator + 2 invited)
    if ((formData.invitedMembers.length) < 2 && 
        !formData.invitedMembers.find(m => m.id === member.id)) {
      setFormData(prev => ({
        ...prev,
        invitedMembers: [...prev.invitedMembers, member]
      }));
      toast({ title: "User Invited", description: `${member.username} has been invited to the team.` });
    }
  };

  const removeInvitedMember = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      invitedMembers: prev.invitedMembers.filter(m => m.id !== memberId)
    }));
  };
  // --- End Member Invitation Logic ---

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 허용된 파일 타입: jpg, jpeg, png
      const allowedTypes = ['image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        alert('JPG, JPEG, PNG 파일만 업로드 가능합니다.')
        return
      }
      // 파일 크기가 100kb (100000 bytes) 이하인지 확인
      if (file.size > 100000) {
        alert('이미지 크기는 100kb 이하이어야 합니다.')
        return
      }

      // 미리보기용 FileReader 사용
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
      // 실제 파일 객체를 상태에 저장
      setLogo(file) // Update logo state
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.teamName ||
      !formData.description || // Assuming description is a required field
      !logo
    ) { return alert("Team name, description, and logo are required.");
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append("teamName", formData.teamName);
    data.append("description", formData.description); // Read from state
    data.append("logo", logo); // Use logo state

    // Pass invited members (IDs only) as JSON. Creator is handled by the action.
    const invitedMemberIds = formData.invitedMembers.map(m => ({ id: m.friend_id })); 
    data.append("members", JSON.stringify(invitedMemberIds));

    const result = await createTeamAction(data);

    if (result.success) {
      toast({ title: "Success", description: "Team created successfully!" });
      // Redirect to the new team page or teams list
      router.push(`/groups/teams/${result.teamId || ''}`); // Assuming action returns teamId
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }

    setIsSubmitting(false);
  }

  // Fetch user info on mount and set as first member
  useEffect(() => {
    const fetchUser = async () => {
      // Use the correct action to FETCH info
      const profile = await getProfile();
      // Adjust the checks based on the actual return type of GetUserInfoAction
      if (profile && profile.username && profile.image_path) { 
        const currentUserProfile: TeamMember = {
          id: profile.id,
          username: profile.username,
          image_path: profile.image_path,
        };
        
        setFormData((prev) => ({
          ...prev,
          members: [currentUserProfile],
        }));
      } else {
        toast({
          variant: "destructive",
          title: "Error Loading User",
          description: "Could not load user information. Please refresh."
        });
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="pt-24 pb-12">
      <Card className="flex flex-col min-w-64 max-w-2xl mx-auto center w-[90%] py-10 bg-card/60 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Create New Team</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
            <label htmlFor="logo-upload" className="flex flex-col items-center justify-center cursor-pointer">
              <div className="w-40 h-40 bg-foreground/5 rounded-lg flex flex-col items-center justify-center mb-4 overflow-hidden text-xs text-foreground/50">
                {imagePreview ? (
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <input
                id="logo-upload"
                name="logo" // Updated name attribute
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isSubmitting}
              />
              <div className="cursor-pointer text-sm text-foreground/70 flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <Upload size={16} /> Upload photo or logo
                </div>
                <div className="text-xs mt-2">File supported jpg, jpeg, png</div>
              </div>
            </label>

            <div className="space-y-6">
              <div className="relative">
                <Input
                  id="teamName"
                  name="teamName"
                  placeholder="Team Name*"
                  value={formData.teamName}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  onChange={handleInputChange}
                  required
                  className={`${
                    teamNameStatus === "taken"
                      ? "border-red-500"
                      : teamNameStatus === "available"
                      ? "border-green-500"
                      : ""
                  }`}
                />
                {teamNameStatus && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                    {teamNameStatus === "checking" && <span className="text-[#636366]">Checking...</span>}
                    {teamNameStatus === "available" && <span className="text-green-500">Available</span>}
                    {teamNameStatus === "taken" && <span className="text-red-500">Already taken</span>}
                  </div>
                )}
              </div>
              <Textarea 
                name={"description"} 
                placeholder="Team Description"
                value={formData.description} 
                onChange={(e) => setFormData((props) => ({...props, description: e.target.value}))} 
                height={161}
              />
            </div>
          </div>

          <div className="mt-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                Add members to your team
                <InviteMemberDialog
                  isOpen={isInviteDialogOpen}
                  onOpenChange={setIsInviteDialogOpen}
                  onInviteMember={handleInviteMembers}
                  alreadyInvitedMemberIds={formData.invitedMembers.map(m => m.id)}
                  maxInvites={2}
                  creatorId={creator?.id}
                  />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 pl-2.5 border-foreground/20 border bg-muted/20 rounded-md">
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={creator?.image_path || undefined} alt={creator?.username} />
                      <AvatarFallback>{creator?.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="w-full flex justify-between items-center">
                      <span className="font-medium">{creator?.username}</span>
                      <span className="text-xs text-yellow-400 mr-2">Leader <Crown className="inline w-3 h-3" /></span>
                    </div>
                  </div>
                </div>
                  {/* Display Invited Members */}
                  {formData.invitedMembers.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-2 pl-2.5 bg-muted/20 border-foreground/20 border rounded-md">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={member.image_path || undefined} alt={member.username} />
                          <AvatarFallback>{member.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{member.username}</span>
                          <span className="text-xs text-blue-400 ml-2">(Invited)</span>
                        </div>
                      </div>
                      <Button type="button" size="icon" variant="ghost" onClick={() => removeInvitedMember(member.id)} className="text-red-500 hover:text-red-600 size-8">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {/* add skeleton if no members invited. if 0 invited, show 2 skeletons, if 1 invited, show 1 skeleton */}
                  {formData.invitedMembers.length < 2 && (
                    <div className="h-12 border-foreground/20 border rounded-md" />
                  )}
                  {formData.invitedMembers.length < 1 && (
                    <div className="h-12 border-foreground/20 border rounded-md" />
                  )}
                </div>
                {/* --- End Invite Member Dialog --- */}
              </div>
            </div>

           <div className="flex justify-between mt-12">
             <Button type="button" variant="ghost" className="text-white" onClick={() => router.push("/groups/teams")}>
               ← Back
            </Button>
            <Button
              type="submit"
              disabled={
                !teamNameStatus ||
                teamNameStatus === "taken" ||
                teamNameStatus === "checking" ||
                isSubmitting
              }
            >
              {isSubmitting ? "Submitting..." : "Create Team"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
