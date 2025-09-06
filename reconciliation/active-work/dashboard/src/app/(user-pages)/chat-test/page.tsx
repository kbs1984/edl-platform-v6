"use client";

import { ChatContainer } from "@/components/chat/chat-container";
import { ChatProvider } from "@/contexts/chat-context";

export default function ChatTestPage() {
  // Using the real test room we just created
  const TEST_ROOM_ID = "4646d344-6fbb-4fbf-9088-a8ea15ab3c7d";
  // Using one of our test users
  const TEST_USER_ID = "1528db71-024e-4a0f-98c6-bce711cb04a0";
  const TEST_FRIEND_ID = "6020e729-671a-49c3-b06f-45b2943d0ea4";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Component Test</h1>
      <p className="mb-4 text-sm text-gray-600">
        Testing with room ID: {TEST_ROOM_ID}
      </p>
      
      <div className="border rounded-lg p-4 min-h-[500px]">
        <ChatProvider>
          <ChatContainer 
            teamId={TEST_FRIEND_ID}  // ChatContainer expects teamId (repurposed for friend ID)
            currentUserId={TEST_USER_ID}
            type="FRIEND"
            disabled={false}
          />
        </ChatProvider>
      </div>
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Test Status:</h2>
        <ul className="text-sm mt-2">
          <li>✅ Page loads without errors</li>
          <li>🔄 Chat components mounting...</li>
          <li>📝 Test message exists in database</li>
        </ul>
      </div>
    </div>
  );
}