
import React, { useState, useEffect, useRef } from 'react';
import { TabType, ChatMessage } from './types';
import { UNIVERSITY_NAME, LIBRARY_TITLE, NEWS_DATA, LIBRARY_SECTIONS, getIcon } from './constants';
import { getLibrarianResponse } from './geminiService';

// --- Sub-components ---

const Header: React.FC = () => (
  <header className="bg-emerald-900/95 backdrop-blur-md text-white p-4 shadow-lg sticky top-0 z-50">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-white p-1 rounded-full overflow-hidden w-10 h-10 flex items-center justify-center">
          <img src="https://www.univ-emir-constantine.edu.dz/biblio/images/logoo.png" alt="Logo" className="h-full object-contain" />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight font-amiri">{UNIVERSITY_NAME}</h1>
          <p className="text-[10px] opacity-80">نظام المكتبات الرقمي</p>
        </div>
      </div>
      <button className="p-2 hover:bg-emerald-800 rounded-full transition-colors">
        {getIcon('Bell', 20)}
      </button>
    </div>
  </header>
);

const HomeTab: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'ar-DZ';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchText(transcript);
        setIsListening(false);
        setErrorMessage(null);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('يرجى السماح بالوصول إلى الميكروفون من إعدادات المتصفح.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('لم يتم اكتشاف صوت، حاول مرة أخرى.');
        } else {
          setErrorMessage('حدث خطأ في التعرف على الصوت.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoiceSearch = () => {
    setErrorMessage(null);
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error('Failed to start recognition', e);
          setIsListening(false);
        }
      } else {
        setErrorMessage('خاصية البحث الصوتي غير مدعومة في متصفحك.');
      }
    }
  };

  return (
    <div className="p-4 space-y-6 animate-fadeIn pb-24">
      <section className="bg-emerald-50/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100/50 shadow-sm">
        <h2 className="text-xl font-bold text-emerald-900 mb-2">مرحباً بك في فضائك المعرفي</h2>
        <p className="text-gray-700 text-sm mb-4 font-medium">ابحث في أكثر من 500,000 كتاب ومخطوط وأطروحة علمية.</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ابحث عن كتاب، مؤلف، أو موضوع..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-emerald-200/50 bg-white/90 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
            <button 
              onClick={toggleVoiceSearch}
              title="البحث الصوتي"
              className={`absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse shadow-inner' : 'text-emerald-600 hover:bg-emerald-100'}`}
            >
              {getIcon(isListening ? 'MicOff' : 'Mic', 18)}
            </button>
          </div>
          <button className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors shadow-md active:scale-95">
            {getIcon('Search', 18)}
          </button>
        </div>
        {isListening && (
          <p className="text-[10px] text-emerald-700 mt-2 font-bold animate-pulse text-center">جاري الاستماع... تكلم الآن</p>
        )}
        {errorMessage && (
          <p className="text-[10px] text-red-600 mt-2 font-bold text-center bg-red-50 p-1 rounded border border-red-100 animate-fadeIn">
            {errorMessage}
          </p>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            {getIcon('LayoutGrid', 18, 'text-emerald-700')}
            أقسام المكتبة
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {LIBRARY_SECTIONS.map((section, idx) => (
            <a 
              key={idx}
              href={section.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 glass-card rounded-xl shadow-sm active:scale-95 transition-transform"
            >
              <div className="bg-emerald-700/10 p-3 rounded-lg text-emerald-700">
                {getIcon(section.icon)}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{section.title}</h4>
                <p className="text-xs text-gray-600 font-medium">{section.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            {getIcon('Info', 18, 'text-emerald-700')}
            آخر الإعلانات
          </h3>
          <button className="text-xs text-emerald-700 font-bold bg-emerald-50/50 px-2 py-1 rounded">عرض الكل</button>
        </div>
        <div className="space-y-4">
          {NEWS_DATA.map(item => (
            <div key={item.id} className="glass-card rounded-xl overflow-hidden shadow-sm border border-gray-100/50">
              <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <span className="text-[10px] text-emerald-700 bg-emerald-100/50 px-2 py-1 rounded-full font-bold">{item.date}</span>
                <h4 className="font-bold mt-2 text-sm text-gray-800">{item.title}</h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2 font-medium">{item.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const SearchTab: React.FC = () => {
  const categories = ["العلوم الإسلامية", "اللغة العربية", "الاقتصاد الإسلامي", "أصول الدين", "الشريعة"];
  return (
    <div className="p-4 space-y-6 pb-24 animate-fadeIn">
      <h2 className="text-xl font-bold text-emerald-900">البحث المتقدم</h2>
      <div className="space-y-4">
        <div className="p-4 glass-card rounded-xl shadow-sm border border-gray-100">
          <label className="block text-xs font-bold text-gray-500 mb-2">نوع المورد</label>
          <select className="w-full p-2 rounded-lg border border-gray-200 bg-white/50 text-sm outline-none">
            <option>الكل</option>
            <option>كتب مطبوعة</option>
            <option>أطروحات دكتوراه</option>
            <option>مجلات علمية</option>
            <option>مخطوطات</option>
          </select>
        </div>
        <div className="p-4 glass-card rounded-xl shadow-sm border border-gray-100">
          <label className="block text-xs font-bold text-gray-500 mb-2">المجال المعرفي</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} className="px-3 py-1 rounded-full border border-emerald-100 bg-emerald-100/30 text-emerald-800 text-xs font-bold active:bg-emerald-700 active:text-white transition-colors">
                {cat}
              </button>
            ))}
          </div>
        </div>
        <button className="w-full bg-emerald-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 active:scale-95 transition-transform">
          {getIcon('Search', 20)}
          ابدأ البحث الشامل
        </button>
      </div>
    </div>
  );
};

const AIChatTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'مرحباً بك! أنا المساعد الذكي لمكتبة جامعة الأمير عبد القادر. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await getLibrarianResponse(userMsg);
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] pb-20 animate-fadeIn">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
              m.role === 'user' 
              ? 'bg-emerald-700 text-white rounded-br-none' 
              : 'glass-card text-gray-800 rounded-bl-none border border-gray-100'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-card p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="اسألني عن أي كتاب أو خدمة..." 
          className="flex-1 px-4 py-2 rounded-full border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-emerald-700 text-white p-3 rounded-full hover:bg-emerald-800 active:scale-95 transition-all shadow-md"
        >
          {getIcon('MessageSquare', 18)}
        </button>
      </div>
    </div>
  );
};

const NewsTab: React.FC = () => (
  <div className="p-4 space-y-4 pb-24 animate-fadeIn">
    <h2 className="text-xl font-bold text-emerald-900 mb-4">أخبار وفعاليات الجامعة</h2>
    {NEWS_DATA.map(item => (
      <div key={item.id} className="glass-card rounded-xl p-4 shadow-sm flex gap-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm leading-tight">{item.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{item.date}</p>
          <button className="text-xs text-emerald-700 font-bold mt-2">اقرأ المزيد...</button>
        </div>
      </div>
    ))}
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.HOME);

  const renderContent = () => {
    switch(activeTab) {
      case TabType.HOME: return <HomeTab />;
      case TabType.SEARCH: return <SearchTab />;
      case TabType.NEWS: return <NewsTab />;
      case TabType.AI: return <AIChatTab />;
      default: return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative shadow-2xl">
      <Header />
      
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200/50 px-6 py-3 flex justify-between items-center z-50 max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab(TabType.HOME)}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === TabType.HOME ? 'text-emerald-700' : 'text-gray-500'}`}
        >
          {getIcon('Book', 20)}
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>
        <button 
          onClick={() => setActiveTab(TabType.SEARCH)}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === TabType.SEARCH ? 'text-emerald-700' : 'text-gray-500'}`}
        >
          {getIcon('Search', 20)}
          <span className="text-[10px] font-bold">البحث</span>
        </button>
        <button 
          onClick={() => setActiveTab(TabType.AI)}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === TabType.AI ? 'text-emerald-700' : 'text-gray-500'}`}
        >
          <div className={`p-3 -mt-10 rounded-full shadow-lg transition-all transform hover:scale-110 ${activeTab === TabType.AI ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-700 border-2 border-emerald-700'}`}>
            {getIcon('MessageSquare', 24)}
          </div>
          <span className="text-[10px] font-bold">المساعد الآلي</span>
        </button>
        <button 
          onClick={() => setActiveTab(TabType.NEWS)}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === TabType.NEWS ? 'text-emerald-700' : 'text-gray-500'}`}
        >
          {getIcon('Bell', 20)}
          <span className="text-[10px] font-bold">الأخبار</span>
        </button>
        <button 
          className={`flex flex-col items-center gap-1 transition-colors text-gray-500`}
        >
          {getIcon('Info', 20)}
          <span className="text-[10px] font-bold">المزيد</span>
        </button>
      </nav>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
