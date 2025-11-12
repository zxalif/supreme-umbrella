'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import { 
  getSupportThreads, 
  getSupportThread, 
  createSupportThread, 
  addMessageToThread,
  type SupportThread,
  type SupportMessage 
} from '@/lib/api/support';
import { extractErrorMessage } from '@/lib/api/client';
import { showToast } from '@/components/ui/Toast';

interface QuickSupportProps {
  className?: string;
}

/**
 * QuickSupport Component
 * 
 * Floating support widget with thread-based support functionality
 * - Opens as a chat-like interface
 * - Shows existing threads or creates new ones
 * - Connects to API for thread management
 */
export function QuickSupport({ className = '' }: QuickSupportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<SupportThread | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load threads when component opens
  useEffect(() => {
    if (isOpen && threads.length === 0) {
      loadThreads();
    }
  }, [isOpen]);

  // Load messages when thread is selected
  useEffect(() => {
    if (selectedThread) {
      loadThreadMessages(selectedThread.id);
    }
  }, [selectedThread]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadThreads = async () => {
    setIsLoading(true);
    try {
      const data = await getSupportThreads();
      setThreads(data);
    } catch (err: any) {
      showToast.error('Failed to load support threads', extractErrorMessage(err, 'Failed to load support threads'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadThreadMessages = async (threadId: string) => {
    setIsLoading(true);
    try {
      const data = await getSupportThread(threadId);
      setMessages(data.messages);
      setSelectedThread(data.thread);
    } catch (err: any) {
      showToast.error('Failed to load messages', extractErrorMessage(err, 'Failed to load messages'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateThread = async () => {
    if (!subjectInput.trim() || !messageInput.trim()) {
      showToast.error('Validation Error', 'Please provide both subject and message');
      return;
    }

    setIsSending(true);
    try {
      const newThread = await createSupportThread({
        subject: subjectInput.trim(),
        message: messageInput.trim(),
      });
      
      // Reload threads and select the new one
      await loadThreads();
      setSelectedThread(newThread);
      setShowNewThreadForm(false);
      setSubjectInput('');
      setMessageInput('');
      showToast.success('Support request created', 'Your support request has been created successfully');
    } catch (err: any) {
      showToast.error('Failed to create support thread', extractErrorMessage(err, 'Failed to create support thread'));
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedThread) return;

    const messageContent = messageInput.trim();
    setMessageInput('');
    setIsSending(true);

    try {
      const newMessage = await addMessageToThread(selectedThread.id, {
        content: messageContent,
      });
      
      setMessages([...messages, newMessage]);
      
      // Update thread in list
      setThreads(threads.map(t => 
        t.id === selectedThread.id 
          ? { ...t, last_message_at: newMessage.created_at, unread_count: 0 }
          : t
      ));
    } catch (err: any) {
      showToast.error('Failed to send message', extractErrorMessage(err, 'Failed to send message'));
      setMessageInput(messageContent); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectThread = (thread: SupportThread) => {
    setSelectedThread(thread);
    setShowNewThreadForm(false);
  };

  const handleNewThread = () => {
    setShowNewThreadForm(true);
    setSelectedThread(null);
    setMessages([]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedThread(null);
    setMessages([]);
    setShowNewThreadForm(false);
    setSubjectInput('');
    setMessageInput('');
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-50 ${className}`}
          aria-label="Open support"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Support Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <h3 className="font-semibold">Support</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Close support"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {showNewThreadForm ? (
              /* New Thread Form */
              <div className="flex-1 flex flex-col p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    placeholder="What can we help you with?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSending}
                  />
                </div>
                <div className="flex-1 flex flex-col mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Describe your issue or question..."
                    rows={8}
                    className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    disabled={isSending}
                  />
                </div>
                <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setShowNewThreadForm(false);
                        setSubjectInput('');
                        setMessageInput('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={isSending}
                    >
                      Cancel
                    </button>
                  <button
                    onClick={handleCreateThread}
                    disabled={isSending || !subjectInput.trim() || !messageInput.trim()}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? 'Creating...' : 'Create Thread'}
                  </button>
                </div>
              </div>
            ) : selectedThread ? (
              /* Thread View */
              <div className="flex-1 flex flex-col">
                {/* Thread Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{selectedThread.subject}</h4>
                    <button
                      onClick={() => {
                        setSelectedThread(null);
                        setMessages([]);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {selectedThread.status === 'open' ? 'Open' : selectedThread.status}
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoading && messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No messages yet</div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSending}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isSending || !messageInput.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Threads List */
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Your Support Threads</h4>
                  <button
                    onClick={handleNewThread}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                  >
                    <span>New</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="text-center text-gray-500 py-8">Loading threads...</div>
                  ) : threads.length === 0 ? (
                    <div className="p-8 text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No support threads yet</p>
                      <button
                        onClick={handleNewThread}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Create New Thread
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      {threads.map((thread) => (
                        <button
                          key={thread.id}
                          onClick={() => handleSelectThread(thread)}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors mb-2"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h5 className="font-medium text-gray-900 text-sm">{thread.subject}</h5>
                            {thread.unread_count && thread.unread_count > 0 && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                {thread.unread_count}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {thread.status} • {new Date(thread.updated_at).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

