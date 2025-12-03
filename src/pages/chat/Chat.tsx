import React, { useEffect, useState } from 'react';
import { chatApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const Chat: React.FC = () => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await chatApi.getConversations();
      setConversations(response.data.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await chatApi.getMessages(conversationId);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const selectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      await chatApi.sendMessage({
        conversationId: selectedConversation.id,
        text: newMessage.trim(),
      });
      setNewMessage('');
      loadMessages(selectedConversation.id);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getOtherPartyEmail = (conversation: any) => {
    if (user?.role === 'STUDENT') {
      return conversation.manager?.user?.email || 'Manager';
    }
    return conversation.student?.user?.email || 'Student';
  };

  const getInitial = (conversation: any) => {
    const email = getOtherPartyEmail(conversation);
    return email?.charAt(0).toUpperCase() || 'U';
  };

  const isOwnMessage = (msg: any) => msg.sender?.email === user?.email;

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-sm text-gray-400 font-light">Loading conversations...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-6">
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Messages
          </div>
          <h1 className="text-2xl font-light text-gray-900">
            Chat with Managers
          </h1>
          <p className="text-sm text-gray-500 font-light mt-1">
            View and reply to your conversations with hostel managers.
          </p>
        </header>

        {/* Chat Layout */}
        <div className="border border-gray-100 bg-white h-[480px] md:h-[540px] flex overflow-hidden">
          {/* Conversations List */}
          <aside className="w-64 border-r border-gray-100 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-medium tracking-widest uppercase text-gray-400">
                Conversations
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="h-full flex items-center justify-center px-4 text-xs text-gray-500 font-light">
                  No conversations yet.
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = selectedConversation?.id === conv.id;
                  const latest = conv.messages?.[0];
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => selectConversation(conv)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        isActive ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                        {getInitial(conv)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-light text-gray-900 truncate">
                          {getOtherPartyEmail(conv)}
                        </p>
                        {latest && (
                          <p className="text-[11px] text-gray-500 font-light truncate mt-0.5">
                            {latest.text}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Messages Panel */}
          <section className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center">
                    {getInitial(selectedConversation)}
                  </div>
                  <div>
                    <p className="text-sm font-light text-gray-900">
                      {getOtherPartyEmail(selectedConversation)}
                    </p>
                    <p className="text-[11px] text-gray-500 font-light">
                      Manager conversation
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/40">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-xs text-gray-400 font-light">
                        No messages yet. Say hello to start the conversation.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isOwnMessage(msg)
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 text-xs rounded-lg ${
                            isOwnMessage(msg)
                              ? 'bg-gray-900 text-white'
                              : 'bg-white text-gray-900 border border-gray-100'
                          }`}
                        >
                          <p className="font-light break-words">
                            {msg.text}
                          </p>
                          <p
                            className={`mt-1 text-[10px] ${
                              isOwnMessage(msg)
                                ? 'text-gray-300'
                                : 'text-gray-400'
                            }`}
                          >
                            {new Date(
                              msg.createdAt
                            ).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-gray-100 bg-white">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="flex-1 px-3 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
                      placeholder="Type a message..."
                    />
                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={sending || !newMessage.trim()}
                      className="px-4 py-2.5 bg-gray-900 text-white text-xs font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-400 font-light">
                  Select a conversation from the left to start chatting.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Chat;