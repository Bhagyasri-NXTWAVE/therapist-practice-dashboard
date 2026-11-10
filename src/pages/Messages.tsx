import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Search,
  ExternalLink,
  Shield,
  Clock,
  CheckCheck,
  Smile,
  Paperclip,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const Messages: React.FC = () => {
  const {
    conversations = [], // Added default empty array fallback
    patients,
    therapist,
    sendMessage,
    markConversationAsRead,
  } = usePractice();

  const navigate = useNavigate();

  const [activeConvId, setActiveConvId] = useState<string>(
    conversations[0]?.id || 'conv-1'
  );
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  useEffect(() => {
    if (activeConvId) {
      markConversationAsRead(activeConvId);
    }
  }, [activeConvId, markConversationAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    sendMessage(activeConvId, inputText.trim());
    setInputText('');
  };

  // Added safety fallback for the filter method
  const filteredConversations = (conversations || []).filter((c:any) =>
    c.patientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#182C23] dark:text-[#E8F0EC] tracking-tight">
          Secure Practice Messages
        </h1>
        <p className="text-sm text-[#61766D] dark:text-[#8D9F95] mt-1">
          Direct communication with your active patients. Fictional patient messaging demo.
        </p>
      </div>

      {/* Main Messaging Interface Shell */}
      <Card
        padding="none"
        className="h-[680px] flex overflow-hidden border border-[#DCE6DF] dark:border-[#23332B]"
      >
        {/* Left Side: Conversation Threads List (w-80 or w-full on mobile) */}
        <div className="w-full sm:w-80 lg:w-96 flex flex-col border-r border-[#E6EEE9] dark:border-[#22312A] bg-white dark:bg-[#18221E] shrink-0">
          {/* Search bar */}
          <div className="p-3.5 border-b border-[#E6EEE9] dark:border-[#22312A]">
            <div className="relative">
              <Search className="w-4 h-4 text-[#7A8F83] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F4F8F5] dark:bg-[#141D19] border border-[#DEE7E1] dark:border-[#23332B] rounded-lg text-[#182C23] dark:text-[#E2ECE7] focus:outline-none focus:border-[#2D5A4A]"
              />
            </div>
          </div>

          {/* List of Contacts */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#EBF1ED] dark:divide-[#1F2C26]">
            {/* Added optional chaining (?.) before map to prevent undefined crashes */}
            {filteredConversations?.map((conv: any) => {
              const isActive = conv.id === activeConvId;
              const hasUnread = conv.unreadCount > 0;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#EEF5F1] dark:bg-[#1D2B24]'
                      : 'hover:bg-[#F9FAF8] dark:hover:bg-[#161F1B]'
                  }`}
                >
                  <Avatar
                    src={conv.patientAvatar}
                    name={conv.patientName}
                    size="md"
                    statusIndicator={conv.isOnline ? 'online' : 'offline'}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          hasUnread
                            ? 'text-[#182C23] dark:text-white font-bold'
                            : 'text-[#283C32] dark:text-[#D5E3DC]'
                        }`}
                      >
                        {conv.patientName}
                      </h4>
                      <span className="text-[10px] text-[#71847A] dark:text-[#7A8E84] shrink-0">
                        {conv.lastMessageTimestamp}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate ${
                        hasUnread
                          ? 'text-[#1E3A2F] dark:text-emerald-300 font-semibold'
                          : 'text-[#61746B] dark:text-[#889B92]'
                      }`}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                  {hasUnread && (
                    <span className="w-5 h-5 rounded-full bg-[#2D5A4A] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Privacy Footnote */}
          <div className="p-3 bg-[#FAFBF9] dark:bg-[#141C19] border-t border-[#E6EEE9] dark:border-[#22312A] text-[11px] text-[#71847A] dark:text-[#677B70] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#2D5A4A] dark:text-[#74A997]" />
            <span>Simulated end-to-end client messaging</span>
          </div>
        </div>

        {/* Right Side: Active Chat Window */}
        {activeConversation ? (
          <div className="hidden sm:flex flex-1 flex-col bg-[#FAFBF9] dark:bg-[#141C19]">
            {/* Top Chat Header */}
            <div className="p-3.5 sm:px-6 bg-white dark:bg-[#18221E] border-b border-[#E6EEE9] dark:border-[#22312A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  src={activeConversation.patientAvatar}
                  name={activeConversation.patientName}
                  size="sm"
                  statusIndicator={activeConversation.isOnline ? 'online' : 'offline'}
                />
                <div>
                  <h3 className="text-sm font-bold text-[#182C23] dark:text-[#E2EDE7]">
                    {activeConversation.patientName}
                  </h3>
                  <p className="text-[11px] text-[#697C72] dark:text-[#83978D]">
                    {activeConversation.isOnline ? 'Online now' : 'Active 2h ago'} · Regular Patient
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/patients/${activeConversation.patientId}`)}
                icon={<ExternalLink className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                View Profile
              </Button>
            </div>

            {/* Messages Thread Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Date divider */}
              <div className="flex items-center justify-center my-2">
                <span className="px-3 py-1 text-[10px] font-semibold text-[#667A70] dark:text-[#7F9388] bg-[#EAF0EC] dark:bg-[#1D2B24] rounded-full uppercase tracking-wider">
                  Today · Practice Chat
                </span>
              </div>

              {/* Added optional chaining (?.) before map to prevent undefined crashes */}
              {activeConversation.messages?.map((msg) => {
                const isMe = msg.sender === 'therapist';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] sm:max-w-md rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-[#1E3A2F] text-white rounded-br-xs shadow-2xs dark:bg-[#2D5A4A]'
                          : 'bg-white dark:bg-[#1C2822] text-[#182C23] dark:text-[#E2EDE7] rounded-bl-xs border border-[#DEE7E1] dark:border-[#273830] shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#71847A] dark:text-[#788C82] px-1">
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Composer Box */}
            <div className="p-3.5 sm:p-4 bg-white dark:bg-[#18221E] border-t border-[#E6EEE9] dark:border-[#22312A]">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${activeConversation.patientName}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs sm:text-sm bg-[#F5F8F6] dark:bg-[#151D1A] border border-[#DEE7E1] dark:border-[#24352D] rounded-xl text-[#182C23] dark:text-[#E2EDE7] placeholder-[#798D82] dark:placeholder-[#607469] focus:outline-none focus:border-[#2D5A4A]"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputText.trim()}
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-xs text-[#71847A]">
            Select a conversation to start messaging.
          </div>
        )}
      </Card>
    </div>
  );
};