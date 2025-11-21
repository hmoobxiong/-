import React, { useState } from 'react';
import { DocumentData } from '../types';
import { queryDocuments } from '../services/geminiService';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';

interface AiSearchProps {
  documents: DocumentData[];
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AiSearch: React.FC<AiSearchProps> = ({ documents }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'ສະບາຍດີ! ຂ້ອຍແມ່ນ AI ຜູ້ຊ່ວຍຄົ້ນຫາເອກະສານ. ທ່ານຕ້ອງການຮູ້ຂໍ້ມູນຫຍັງກ່ຽວກັບເອກະສານທີ່ມີໃນລະບົບ?' }
  ]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const answer = await queryDocuments(userMsg, documents);
      setMessages(prev => [...prev, { role: 'ai', content: answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'ຂໍອະໄພ ເກີດຂໍ້ຜິດພາດ.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg">SalaDoc AI Assistant</h2>
          <p className="text-blue-100 text-xs">ຖາມ-ຕອບ ກ່ຽວກັບເອກະສານຂອງທ່ານ</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                <span>{msg.role === 'user' ? 'ທ່ານ (You)' : 'AI'}</span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-slate-500 text-sm">ກຳລັງຄົ້ນຫາຂໍ້ມູນ...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ພິມຄຳຖາມຂອງທ່ານທີ່ນີ້..."
            className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !query.trim()}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiSearch;