import React, { useState, useEffect, useRef } from 'react';
import { Send, ThumbsUp, Loader2, Lock, MessageSquare, Share2, AlertCircle, User, Bot, Check } from 'lucide-react';

// --- API Helper ---
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("hp_token");
  const finalOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token ? { "x-api-key": token } : {})
    },
  };
  
  console.log(`[LinkedIn API] Fetching: ${endpoint}`, finalOptions);
  
  try {
    const response = await fetch(endpoint, finalOptions);
    console.log(`[LinkedIn API] Response from ${endpoint}: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[LinkedIn API] Error on ${endpoint}:`, errorText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (response.status === 204) return null;
    
    const data = await response.json();
    console.log(`[LinkedIn API] Data from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`[LinkedIn API] Network error on ${endpoint}:`, error);
    throw error;
  }
};

// --- Types ---
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  draft?: string; // The generated post content if any
  isPosting?: boolean;
  posted?: boolean;
  postResponse?: string;
  error?: string;
}

export default function LinkedInPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [authError, setAuthError] = useState("");

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("hp_token");
    const envPass = import.meta.env.VITE_HEALTH_PASS;
    
    // Auto-login if token matches env
    if (token && envPass && token === envPass.trim()) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const envPass = import.meta.env.VITE_HEALTH_PASS;
    
    // If env is not set (dev mode), or matches input
    if (!envPass || inputKey === envPass.trim()) {
      localStorage.setItem("hp_token", inputKey);
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid access key");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Call post endpoint
      const data = await fetchWithAuth('/mcp/call/linkedin/post', {
        method: 'POST',
        body: JSON.stringify({ content: userMsg.content })
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: JSON.stringify(data, null, 2)
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error processing your request.",
        error: err.message
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (messageId: string, draftContent: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isPosting: true, error: undefined } : m));

    try {
      const result = await fetchWithAuth('/mcp/call/linkedin/post', {
        method: 'POST',
        body: JSON.stringify({ content: draftContent })
      });

      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isPosting: false, posted: true, postResponse: JSON.stringify(result, null, 2) } : m));
    } catch (err: any) {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isPosting: false, error: "Failed to post: " + err.message } : m));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-50 rounded-full">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">LinkedIn Manager</h2>
          <p className="text-center text-gray-500 mb-6">Enter your access key to continue</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Access Key"
              autoFocus
            />
            {authError && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {authError}
              </div>
            )}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg"><Share2 className="w-6 h-6 text-white" /></div>
          <div><h1 className="text-xl font-bold text-gray-900">LinkedIn Assistant</h1><p className="text-xs text-gray-500">Powered by MCP & OpenAI</p></div>
        </div>
        <button onClick={() => { localStorage.removeItem("hp_token"); setIsAuthenticated(false); }} className="text-sm text-gray-500 hover:text-gray-700">Sign Out</button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 overflow-y-auto space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Start a new post</h3>
            <p className="text-gray-500 mt-2">Describe your post idea, and I'll generate a draft.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-900' : 'bg-blue-600'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>
            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-5 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-gray-900 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
              {msg.draft && (
                <div className="mt-3 w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center"><span className="text-xs font-semibold text-gray-500 uppercase">Draft Preview</span>{msg.posted && <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full"><Check className="w-3 h-3" /> Posted</span>}</div>
                  <div className="p-4"><p className="text-gray-800 whitespace-pre-wrap text-sm font-medium">{msg.draft}</p></div>
                  {msg.postResponse && <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs font-mono text-gray-600 whitespace-pre-wrap">{msg.postResponse}</div>}
                  {!msg.posted && <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">{msg.error && <span className="text-xs text-red-600 flex items-center mr-auto">{msg.error}</span>}<button onClick={() => handleApprove(msg.id, msg.draft!)} disabled={msg.isPosting} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">{msg.isPosting ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</> : <><ThumbsUp className="w-4 h-4" /> Approve & Post</>}</button></div>}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0"><div className="max-w-4xl mx-auto relative"><form onSubmit={handleSend}><input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe your post idea..." disabled={loading} className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-60" /><button type="submit" disabled={!input.trim() || loading} className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}</button></form></div></div>
    </div>
  );
}