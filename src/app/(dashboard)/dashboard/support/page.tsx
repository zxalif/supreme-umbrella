'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageCircle, Send, ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';
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

/**
 * Support Page Content
 */
function SupportPageContent() {
  const searchParams = useSearchParams();
  const [threadIdParam, setThreadIdParam] = useState<string | null>(null);
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<SupportThread | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadedThreadIdRef = useRef<string | null>(null);
  const isInitialLoadRef = useRef(true);

  // Safely extract thread ID from search params
  useEffect(() => {
    if (searchParams && typeof searchParams.get === 'function') {
      try {
        const threadId = searchParams.get('thread');
        setThreadIdParam(threadId);
      } catch (error) {
        console.debug('Could not read search params:', error);
      }
    }
  }, [searchParams]);

  // Load threads on mount (only once)
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      loadThreads();
    }
  }, []);

  // Load specific thread if thread param is present (only once per threadIdParam change)
  useEffect(() => {
    if (threadIdParam && threads.length > 0 && loadedThreadIdRef.current !== threadIdParam) {
      const thread = threads.find(t => t.id === threadIdParam);
      if (thread && selectedThread?.id !== threadIdParam) {
        loadedThreadIdRef.current = threadIdParam;
        handleSelectThread(thread);
      }
    }
  }, [threadIdParam, threads, selectedThread?.id]);

  // Load messages when thread is selected (only if not already loaded)
  useEffect(() => {
    if (selectedThread && loadedThreadIdRef.current !== selectedThread.id) {
      // Clear old messages immediately when switching threads
      setMessages([]);
      loadedThreadIdRef.current = selectedThread.id;
      loadThreadMessages(selectedThread.id);
    } else if (!selectedThread) {
      // Clear messages when no thread is selected
      setMessages([]);
      loadedThreadIdRef.current = null;
    }
  }, [selectedThread?.id]);

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
    // Prevent duplicate loads for the same thread
    if (loadedThreadIdRef.current === threadId && messages.length > 0) {
      return;
    }
    
    // Verify we're still loading the correct thread (user might have switched)
    if (selectedThread?.id !== threadId) {
      console.debug(`Skipping load for thread ${threadId} - user switched to different thread`);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await getSupportThread(threadId);
      
      // Double-check thread hasn't changed during async operation
      if (selectedThread?.id !== threadId) {
        console.debug(`Thread changed during load, discarding messages for ${threadId}`);
        return;
      }
      
      // Ensure messages are sorted by created_at (should already be sorted from backend)
      const sortedMessages = [...data.messages].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      console.debug(`Loaded ${sortedMessages.length} messages for thread ${threadId}`);
      setMessages(sortedMessages);
      // Only update selectedThread if it's different to prevent re-renders
      if (selectedThread?.id !== data.thread.id) {
        setSelectedThread(data.thread);
      }
      loadedThreadIdRef.current = threadId;
    } catch (err: any) {
      // Only show error if we're still on the same thread
      if (selectedThread?.id === threadId) {
        showToast.error('Failed to load messages', extractErrorMessage(err, 'Failed to load messages'));
      }
      loadedThreadIdRef.current = null; // Reset on error
    } finally {
      // Only update loading state if we're still on the same thread
      if (selectedThread?.id === threadId) {
        setIsLoading(false);
      }
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
    
    // Frontend security: Prevent sending to closed threads
    if (selectedThread.status === 'closed') {
      showToast.error('Thread Closed', 'This thread is closed. Please create a new support request.');
      return;
    }

    const messageContent = messageInput.trim();
    setMessageInput('');
    setIsSending(true);

    try {
      const newMessage = await addMessageToThread(selectedThread.id, {
        content: messageContent,
      });
      
      setMessages(prev => [...prev, newMessage]);
      // Refresh threads to update last_message_at (debounced to prevent spam)
      setTimeout(() => {
        loadThreads();
      }, 500);
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err, 'Failed to send message');
      // Check if it's a 403 (closed thread) error
      if (err?.response?.status === 403 || errorMessage.toLowerCase().includes('closed')) {
        showToast.error('Thread Closed', 'This thread is closed. Please create a new support request.');
        // Reload thread to get updated status
        if (selectedThread) {
          loadThreadMessages(selectedThread.id);
        }
      } else {
        showToast.error('Failed to send message', errorMessage);
      }
      setMessageInput(messageContent); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectThread = (thread: SupportThread) => {
    // Prevent re-selecting the same thread
    if (selectedThread?.id === thread.id) {
      return;
    }
    // Clear old messages immediately when switching threads
    setMessages([]);
    setSelectedThread(thread);
    setShowNewThreadForm(false);
    // Reset loaded ref when manually selecting a different thread
    if (loadedThreadIdRef.current !== thread.id) {
      loadedThreadIdRef.current = null;
    }
  };

  const handleNewThread = () => {
    setShowNewThreadForm(true);
    setSelectedThread(null);
    setMessages([]);
    loadedThreadIdRef.current = null; // Reset loaded thread ref
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <HelpCircle className="w-8 h-8 mr-3 text-blue-500" />
                Support
              </h1>
              <p className="mt-2 text-gray-600">
                Get help with your account, features, or any questions you have
              </p>
            </div>
            <button
              onClick={handleNewThread}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>New Request</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Threads List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Your Requests</h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {isLoading && threads.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Loading threads...</div>
                ) : threads.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No support requests yet</p>
                    <button
                      onClick={handleNewThread}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Create New Request
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {threads.map((thread) => (
                      <button
                        key={thread.id}
                        onClick={() => handleSelectThread(thread)}
                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                          selectedThread?.id === thread.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        } ${thread.status === 'closed' ? 'opacity-75' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{thread.subject}</h3>
                          <div className="flex items-center space-x-2">
                            {thread.status === 'closed' && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                                CLOSED
                              </span>
                            )}
                            {thread.unread_count && thread.unread_count > 0 && (
                              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                {thread.unread_count}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          <span className={`capitalize ${
                            thread.status === 'closed' ? 'text-red-600 font-medium' : ''
                          }`}>
                            {thread.status}
                          </span>
                          {' • '}
                          {new Date(thread.updated_at).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thread View / New Thread Form */}
          <div className="lg:col-span-2">
            {showNewThreadForm ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Support Request</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      placeholder="What can we help you with?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSending}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Describe your issue or question..."
                      rows={10}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      disabled={isSending}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
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
                      {isSending ? 'Creating...' : 'Create Request'}
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedThread ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[600px]">
                {/* Thread Header */}
                <div className={`p-4 border-b border-gray-200 ${
                  selectedThread.status === 'closed' ? 'bg-red-50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-semibold text-gray-900">{selectedThread.subject}</h2>
                    <button
                      onClick={() => {
                        setSelectedThread(null);
                        setMessages([]);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500">
                      Status:
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedThread.status === 'closed'
                        ? 'bg-red-100 text-red-800'
                        : selectedThread.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedThread.status.toUpperCase()}
                    </span>
                  </div>
                  {selectedThread.status === 'closed' && (
                    <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-800">
                      This thread is closed. You cannot send new messages. Please create a new support request if you need further assistance.
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                          className={`max-w-[70%] rounded-lg p-4 ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  {selectedThread.status === 'closed' ? (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        This thread is closed. You cannot send new messages.
                      </p>
                      <button
                        onClick={handleNewThread}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Create a new support request →
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-3">
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
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSending || selectedThread.status === 'closed'}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isSending || !messageInput.trim() || selectedThread.status === 'closed'}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <Send className="w-5 h-5" />
                        <span>Send</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a support request</h3>
                <p className="text-gray-600 mb-6">
                  Choose a request from the list or create a new one to get started
                </p>
                <button
                  onClick={handleNewThread}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create New Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Support Page
 * 
 * Full-page support interface for managing support threads.
 */
export default function SupportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SupportPageContent />
    </Suspense>
  );
}

