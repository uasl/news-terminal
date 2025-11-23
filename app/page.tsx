"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';

function timeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const elapsed = now.getTime() - past.getTime();
  const min = 60 * 1000;
  const hour = min * 60;
  const day = hour * 24;

  if (elapsed < min) return 'just now';
  else if (elapsed < hour) return Math.round(elapsed / min) + 'm ago';
  else if (elapsed < day) return Math.round(elapsed / hour) + 'h ago';
  else return Math.round(elapsed / day) + 'd ago';
}

function cleanStreamContent(content: string) {
  return content.replace(/```html/g, "").replace(/```/g, "").trim();
}

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
  { code: 'es', label: 'ES' },
  { code: 'ru', label: 'RU' },
  { code: 'zh', label: 'CN' },
  { code: 'ar', label: 'AR' },
];

export default function Home() {
  const [allNews, setAllNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [category, setCategory] = useState('all');
  const [region, setRegion] = useState('all');
  const [language, setLanguage] = useState('tr'); 
  
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [disabledSources, setDisabledSources] = useState<string[]>([]);
  const [showSourceModal, setShowSourceModal] = useState(false);

  const [readingArticle, setReadingArticle] = useState<any | null>(null);
  const [streamContent, setStreamContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/feeds?category=${category}&region=${region}&t=${Date.now()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
         const uniqueNews = data.filter((item: any, index: number, self: any[]) =>
           index === self.findIndex((t) => t.title === item.title)
         );
         setAllNews(uniqueNews);
         const sources = Array.from(new Set(uniqueNews.map((n:any) => n.source))) as string[];
         setAvailableSources(sources);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [category, region]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const displayedNews = useMemo(() => {
    return allNews.filter(item => !disabledSources.includes(item.source));
  }, [allNews, disabledSources]);

  const toggleSource = (sourceName: string) => {
    setDisabledSources(prev => 
      prev.includes(sourceName) ? prev.filter(s => s !== sourceName) : [...prev, sourceName]
    );
  };

  const selectAllSources = () => setDisabledSources([]);
  const deselectAllSources = () => setDisabledSources(availableSources);

  const startStreaming = async (item: any) => {
    if (readingArticle?.link === item.link) return;
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const newController = new AbortController();
    abortControllerRef.current = newController;
    
    setReadingArticle(item);
    setStreamContent(""); 
    setIsStreaming(true);

    try {
      const response = await fetch(`/api/read?url=${encodeURIComponent(item.link)}&lang=${language}`, {
        signal: newController.signal 
      });
      if (!response.body) { setIsStreaming(false); return; }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let firstChunkReceived = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setStreamContent((prev) => prev + chunk);
        if (!firstChunkReceived) { setIsStreaming(false); firstChunkReceived = true; }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setStreamContent("<p>Analysis failed.</p>");
      setIsStreaming(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
        case 'politics': return 'bg-red-50 text-red-700 border-red-100';
        case 'markets': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'economics': return 'bg-blue-50 text-blue-700 border-blue-100';
        default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <main className="flex h-screen bg-white overflow-hidden font-sans text-gray-900">
      
      {/* SOL LİSTE */}
      <aside className="flex-1 min-w-0 flex flex-col border-r border-gray-200 bg-white z-10 relative md:w-[55%] lg:w-[60%]">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white/95 backdrop-blur z-20">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black tracking-tight uppercase">The Feed.</h1>
            <div className="flex items-center gap-2">
              <div className="relative group">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all cursor-pointer">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase text-gray-600">
                    {LANGUAGES.find(l => l.code === language)?.label}
                  </span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                  {LANGUAGES.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
                </select>
              </div>

              <button onClick={() => setShowSourceModal(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                <span className="text-[10px] font-bold uppercase text-gray-600">Sources</span>
              </button>
              <button onClick={fetchNews} disabled={loading} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin text-blue-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Filter:</span>
            {['all', 'us', 'uk', 'eu', 'asia'].map((r) => (
              <button key={r} onClick={() => setRegion(r)} className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-colors uppercase tracking-wider ${region === r ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>{r}</button>
            ))}
          </div>
        </div>

        {/* LİSTE */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
             <div className="p-10 text-center text-gray-300 animate-pulse font-mono text-xs">SYNCING FEED...</div>
          ) : displayedNews.length === 0 ? (
             <div className="p-10 text-center text-gray-400 text-sm">No news found.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {displayedNews.map((item, idx) => {
                const isActive = readingArticle?.link === item.link;
                return (
                  <article 
                    key={idx} 
                    onClick={() => startStreaming(item)} 
                    className={`px-6 py-5 cursor-pointer transition-all hover:bg-gray-50`} // Görsel kaldırıldı, flex gap kaldırıldı
                  >
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getCategoryColor(item.category)}`}>{item.category}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 truncate">{item.source}</span>
                        <span className="text-[10px] text-gray-300">•</span>
                        <span className="text-[10px] text-gray-300 font-medium shrink-0">{timeAgo(item.pubDate)}</span>
                      </div>
                      <h2 className={`text-lg font-bold leading-tight mb-2 ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>{item.title}</h2>
                      <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{item.snippet}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* SAĞ ANALİZ */}
      <section className="hidden md:flex w-[45%] lg:w-[40%] bg-[#f8fafc] h-full flex-col border-l border-gray-200">
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          {!readingArticle && !isStreaming && !streamContent && (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
              <p className="text-xs font-bold uppercase tracking-widest">Select Article to Analyze</p>
            </div>
          )}
          
          {isStreaming && !streamContent && (
             <div className="h-full flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 text-blue-600 animate-pulse">
                   <span className="text-xs font-bold uppercase tracking-widest">Generating Report...</span>
                </div>
             </div>
          )}

          {(streamContent || (readingArticle && !isStreaming)) && streamContent && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-10 min-h-[50vh] relative animate-in fade-in duration-500">
              <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-8">
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">AI Analysis ({language.toUpperCase()})</span>
                 <a href={readingArticle?.link} target="_blank" className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-wider transition-colors">View Source ↗</a>
              </div>
              <div 
                className="prose prose-lg max-w-none text-gray-700 prose-h1:text-3xl prose-h1:font-black prose-h1:tracking-tight prose-h1:text-gray-900 prose-h1:leading-tight prose-h1:mb-6 prose-h3:text-sm prose-h3:uppercase prose-h3:tracking-widest prose-h3:text-blue-700 prose-h3:mt-8 prose-h3:font-bold prose-p:leading-8 prose-p:mb-4 prose-strong:font-extrabold prose-strong:text-gray-900 prose-strong:bg-yellow-50/50 prose-li:marker:text-blue-500 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cleanStreamContent(streamContent)) }} 
              />
            </div>
          )}
        </div>
      </section>

      {/* KAYNAK MODALI */}
      {showSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold uppercase tracking-tight">Manage Sources</h2>
              <div className="flex gap-2">
                <button onClick={selectAllSources} className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase">Select All</button>
                <span className="text-gray-300">|</span>
                <button onClick={deselectAllSources} className="text-xs font-bold text-red-600 hover:text-red-800 uppercase">Deselect All</button>
              </div>
              <button onClick={() => setShowSourceModal(false)} className="text-gray-400 hover:text-black ml-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {availableSources.map(source => (
                  <label key={source} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100">
                    <input type="checkbox" checked={!disabledSources.includes(source)} onChange={() => toggleSource(source)} className="w-5 h-5 text-black rounded focus:ring-0 bg-gray-200 border-transparent checked:bg-black" />
                    <span className={`text-sm font-medium ${disabledSources.includes(source) ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{source}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-b-xl text-right"><button onClick={() => setShowSourceModal(false)} className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-800">Done</button></div>
          </div>
        </div>
      )}
    </main>
  );
}