import { useState } from 'react';

export default function ChatPanel({ isMock }) {
  const [input, setInput] = useState('');

  if (isMock) {
    return (
      <div className="opacity-50">
        <p className="text-[10px] text-slate-500 mb-2">
          Chat disabled in demo mode — requires live backend
        </p>
        <div className="flex gap-1.5 pointer-events-none">
          <input
            type="text"
            disabled
            placeholder="Ask about the data..."
            className="flex-1 bg-[#0a0e1a] border border-[#1e2a4a] rounded px-2.5 py-1.5 text-[11px] text-slate-300 placeholder-slate-600"
          />
          <button
            disabled
            className="px-3 py-1.5 bg-[#1a2340] text-[10px] text-slate-400 rounded"
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[10px] text-slate-500 mb-2">
        Chat with Claude Agent for Deeper Analysis
      </p>
      <div className="flex gap-1.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the data..."
          className="flex-1 bg-[#0a0e1a] border border-[#1e2a4a] rounded px-2.5 py-1.5 text-[11px] text-slate-300 placeholder-slate-600 outline-none focus:border-purple-500/50 transition-colors"
        />
        <button className="px-3 py-1.5 bg-[#1a2340] hover:bg-purple-600/30 text-[10px] text-slate-400 hover:text-purple-300 rounded transition-colors">
          Send
        </button>
      </div>
    </div>
  );
}
