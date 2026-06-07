import { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

const PHONE = '2349034720201';
const MESSAGE = 'Hi Bethel Church! I have a question.';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappLink = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[calc(100vw-2rem)] sm:w-80 border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in-up">
          <div className="bg-green-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaWhatsapp className="text-white text-2xl" />
              <div>
                <p className="text-white font-semibold text-sm">WhatsApp Chat</p>
                <p className="text-green-200 text-xs">Typically replies within 1 hour</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Send us a message on WhatsApp and our team will get back to you.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors"
            >
              <FaWhatsapp className="text-lg" />
              Open WhatsApp
            </a>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
              Available Mon–Sat 8AM–6PM
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label={isOpen ? 'Close chat' : 'Chat with us on WhatsApp'}
      >
        {isOpen ? <FaTimes className="w-6 h-6" /> : <FaWhatsapp className="w-7 h-7" />}
      </button>
    </div>
  );
};

export default LiveChat;
