'use client';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { Suspense } from 'react';
import Chat from '../../../src/components/enterprise/Chat';
import Skeleton from '@/components/ui/Skeleton';
import { UserPlus } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    type: 'image' | 'document' | 'link';
    url: string;
    name?: string;
  }[];
}

interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
}

interface ChatAttachment {
  type: 'image' | 'document' | 'link';
  url: string;
  name?: string;
}

import { TypedSupabaseClient } from '../../../src/types';

async function fetchChatData(supabase: TypedSupabaseClient, currentUserId: string): Promise<{
  participants: ChatParticipant[];
  messages: ChatMessage[];
}> {
  // Fetch participants (other users or team members)
  const { data: participantsData, error: participantsError } = await supabase
    .from('users')
    .select('id, name, avatar_url, status')
    .neq('id', currentUserId)
    .limit(10);

  if (participantsError) throw participantsError;

  // Fetch messages for all conversations (in production, paginate or filter by active chat)
  const { data: messagesData, error: messagesError } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users!sender_id (id, name, avatar_url),
      receiver:users!receiver_id (id, name, avatar_url)
    `)
    .order('timestamp', { ascending: true });

  if (messagesError) throw messagesError;

  if (!participantsData || participantsData.length === 0) {
    throw new Error('No chat participants found');
  }

  // Map participants
  const participants = participantsData.map((user) => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar_url ? supabase.storage.from('avatars').getPublicUrl(user.avatar_url).data.publicUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`,
    status: user.status || 'offline',
    lastSeen: new Date(),
  }));

  // Map messages
  const messages = messagesData?.map((msg) => ({
    id: msg.id,
    content: msg.content,
    sender: {
      id: msg.sender.id,
      name: msg.sender.name,
      avatar: msg.sender.avatar_url ? supabase.storage.from('avatars').getPublicUrl(msg.sender.avatar_url).data.publicUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.name)}&background=0D8ABC&color=fff`,
    },
    timestamp: new Date(msg.timestamp),
    status: 'sent' as const,
  })) || [];

  return { participants, messages };
}

const ChatContent = () => {
  const user = useUser();
  const supabase = createClientComponentClient();
  const [selectedParticipant, setSelectedParticipant] = useState<ChatParticipant | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { data: chatData, isLoading, error } = useQuery({
    queryKey: ['enterprise-chat', user?.id],
    queryFn: () => fetchChatData(supabase, user?.id || ''),
    enabled: !!user,
  });

  useEffect(() => {
    if (!user || !selectedParticipant) return;

    // Subscribe to realtime messages for the conversation
    const channel = supabase.channel(`chat:${[user.id, selectedParticipant.id].sort().join(':')}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${user.id} OR receiver_id=eq.${user.id}`,
      }, (payload) => {
        // Handle realtime message
        setMessages((prev) => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedParticipant, user, supabase]);

  const handleSendMessage = async (content: string, attachments?: ChatAttachment[]) => {
    if (!user || !selectedParticipant) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: selectedParticipant.id,
        content,
        timestamp: new Date().toISOString(),
        attachments,
      });

    if (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading chat: {error.message}</p>
      </div>
    );
  }

  const currentUser = {
    id: user?.id || '',
    name: user?.email?.split('@')[0] || 'You',
    avatar: '',
    status: 'online' as const,
  };

  if (isLoading) {
    return <ChatLoading />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Chat</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time communication with your team</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <UserPlus className="w-4 h-4 mr-2" />
            New Chat
          </button>
        </div>
      </div>

      <Suspense fallback={<ChatLoading />}>
        <Chat
          participants={chatData?.participants || []}
          messages={messages.length > 0 ? messages : chatData?.messages || []}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
          onParticipantSelect={setSelectedParticipant}
          title="Team Communication"
        />
      </Suspense>
    </div>
  );
};

const ChatLoading = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-96">
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <Skeleton className="h-10 w-48" />
    </div>
  </div>
);

export default function ChatPage() {
  const user = useUser();

  if (!user) {
    return <div className="text-center py-8">Please log in to access chat.</div>;
  }

  return (
    <Suspense fallback={<div className="text-center py-8">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
