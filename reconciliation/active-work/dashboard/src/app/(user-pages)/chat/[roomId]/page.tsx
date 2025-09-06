import { ChatContainer } from "@/components/chat/chat-container";
import { ChatProvider } from "@/contexts/chat-context";
import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface ChatPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { roomId } = await params;
  const supabase = await createServerClient();
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Get room details
  const { data: room, error: roomError } = await supabase
    .schema("chat")
    .from("room")
    .select("*, participant!inner(*)")
    .eq("id", roomId)
    .single();

  if (roomError || !room) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Chat Room Not Found</h2>
          <p className="text-red-600 mt-2">
            The chat room you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }

  // Check if user is a participant
  const isParticipant = room.participant.some(
    (p: any) => p.student_id === user.id
  );

  if (!isParticipant) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-yellow-800 font-semibold">Access Denied</h2>
          <p className="text-yellow-600 mt-2">
            You are not a participant in this chat room.
          </p>
        </div>
      </div>
    );
  }

  // For friend chats, get the other participant ID
  let chatTargetId = user.id;
  if (room.type === "FRIEND") {
    const otherParticipant = room.participant.find(
      (p: any) => p.student_id !== user.id
    );
    chatTargetId = otherParticipant?.student_id || user.id;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          {room.type === "FRIEND" ? "Friend Chat" : 
           room.type === "TEAM" ? "Team Chat" : 
           "Chat"}
        </h1>
        {room.title && (
          <p className="text-gray-600">{room.title}</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <ChatProvider>
          <ChatContainer
            teamId={chatTargetId}  // Repurposed for target ID
            currentUserId={user.id}
            type={room.type}
            disabled={false}
          />
        </ChatProvider>
      </div>
    </div>
  );
}