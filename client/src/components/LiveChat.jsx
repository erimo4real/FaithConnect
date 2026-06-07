import { useState } from 'react';

const PHONE = '2349034720201';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setSent(true);
    setMessage('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 animate-slide-in-right">
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[calc(100vw-2rem)] sm:w-80 border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in-up">
          <div className="bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/churchlogo.png" alt="" className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-white font-semibold text-sm">Bethel Church</p>
                <p className="text-blue-200 text-xs">Typically replies within 1 hour</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              Send us a message and we'll reply on WhatsApp.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 min-w-0 px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none dark:bg-gray-700 dark:text-gray-200"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="shrink-0 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
              >
                Send
              </button>
            </div>
            {sent && (
              <p className="text-xs text-green-600 mt-2 text-center">Opening WhatsApp...</p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
              Available Mon–Sat 8AM–6PM
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => { setIsOpen(!isOpen); setSent(false); }}
        className="w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label={isOpen ? 'Close chat' : 'Chat with Bethel Church'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default LiveChat;
