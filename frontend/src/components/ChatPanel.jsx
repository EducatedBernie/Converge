import { useState } from 'react';

export default function ChatPanel({ isMock }) {
  const [input, setInput] = useState('');

  if (isMock) {
    return (
      <div className="opacity-50">
        <p className="text-[10px] text-gray-400 mb-2">
          Chat disabled in demo mode — requires live backend
        </p>
        <div className="flex gap-1.5 pointer-events-none">
          <input
            type="text"
            disabled
            placeholder="Ask about the data..."
            className="flex-1 bg-white border border-gray-200 rounded px-2.5 py-1.5 text-[11px] text-gray-800 placeholder-gray-400"
          />
          <button
            disabled
            className="px-3 py-1.5 bg-gray-100 text-[10px] text-gray-500 rounded"
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[10px] text-gray-400 mb-2">
        Chat with Claude Agent for Deeper Analysis
      </p>
      <div className="flex gap-1.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the data..."
          className="flex-1 bg-white border border-gray-200 rounded px-2.5 py-1.5 text-[11px] text-gray-800 placeholder-gray-400 outline-none focus:border-gray-400 transition-colors"
        />
        <button className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-[10px] text-white rounded transition-colors">
          Send
        </button>
      </div>
    </div>
  );
}
