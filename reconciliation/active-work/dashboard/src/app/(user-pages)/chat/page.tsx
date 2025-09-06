import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Users, Shield } from "lucide-react";

export default async function ChatListPage() {
  const supabase = await createServerClient();
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Get all chat rooms where user is a participant
  const { data: rooms, error } = await supabase
    .schema("chat")
    .from("room")
    .select(`
      *,
      participant!inner(
        student_id,
        joined_at
      ),
      message(
        content,
        created_at,
        sender_id
      )
    `)
    .eq("participant.student_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching chat rooms:", error);
  }

  // Get participant names for friend chats
  const friendRooms = rooms?.filter(r => r.type === "FRIEND") || [];
  const friendParticipantIds = new Set<string>();
  
  friendRooms.forEach(room => {
    room.participant.forEach((p: any) => {
      if (p.student_id !== user.id) {
        friendParticipantIds.add(p.student_id);
      }
    });
  });

  let participantNames: Record<string, string> = {};
  if (friendParticipantIds.size > 0) {
    const { data: profiles } = await supabase
      .from("profile")
      .select("id, name, email")
      .in("id", Array.from(friendParticipantIds));
    
    profiles?.forEach(p => {
      participantNames[p.id] = p.name || p.email || "Unknown User";
    });
  }

  const getRoomDisplayName = (room: any) => {
    if (room.title) return room.title;
    
    if (room.type === "FRIEND") {
      const otherParticipant = room.participant.find(
        (p: any) => p.student_id !== user.id
      );
      if (otherParticipant) {
        return participantNames[otherParticipant.student_id] || "Friend Chat";
      }
    }
    
    return `${room.type} Chat`;
  };

  const getLastMessage = (room: any) => {
    if (!room.message || room.message.length === 0) {
      return "No messages yet";
    }
    const lastMessage = room.message[room.message.length - 1];
    return lastMessage.content;
  };

  const getRoomIcon = (type: string) => {
    switch (type) {
      case "FRIEND":
        return <MessageCircle className="h-5 w-5" />;
      case "TEAM":
        return <Users className="h-5 w-5" />;
      case "GUILD":
        return <Shield className="h-5 w-5" />;
      default:
        return <MessageCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Chats</h1>
        <p className="text-gray-600 mt-2">Your active conversations</p>
      </div>

      {!rooms || rooms.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Active Chats</h2>
          <p className="text-gray-500">
            Start a conversation by connecting with friends or joining a team!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {rooms.map((room) => (
            <Link
              key={room.id}
              href={`/chat/${room.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getRoomIcon(room.type)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {getRoomDisplayName(room)}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {room.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {getLastMessage(room)}
                  </p>
                  {room.message && room.message.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(room.message[room.message.length - 1].created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold text-blue-900 mb-2">Quick Tips</h2>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Friend chats are created when you accept a friend request</li>
          <li>• Team chats are available when you join a team</li>
          <li>• Click on any chat to open the conversation</li>
        </ul>
      </div>
    </div>
  );
}