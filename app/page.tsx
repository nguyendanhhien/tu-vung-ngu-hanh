"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Vocab {
  id: number;
  word_main: string; pinyin_main: string; meaning_main: string;
  kim_word: string; kim_pinyin: string; kim_meaning: string;
  moc_word: string; moc_pinyin: string; moc_meaning: string;
  thuy_word: string; thuy_pinyin: string; thuy_meaning: string;
  hoa_word: string; hoa_pinyin: string; hoa_meaning: string;
  tho_word: string; tho_pinyin: string; tho_meaning: string;
}

export default function Home() {
  const [vocabs, setVocabs] = useState<Vocab[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [isListOpen, setIsListOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. TẢI DỮ LIỆU VÀ ĐỌC TRÍ NHỚ (LOCAL STORAGE)
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("ngu_hanh_vocab").select("*");
      if (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } else if (data && data.length > 0) {
        const sortedData = data.sort((a, b) => b.id - a.id);
        setVocabs(sortedData);

        // Đọc vị trí học cuối cùng từ localStorage
        const savedIndex = localStorage.getItem("nguHanhLastIndex");
        if (savedIndex !== null) {
          const parsedIndex = parseInt(savedIndex, 10);
          // Kiểm tra xem vị trí lưu có hợp lệ không (tránh lỗi nếu data bị xóa bớt)
          if (parsedIndex >= 0 && parsedIndex < sortedData.length) {
            setCurrentIndex(parsedIndex);
          }
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // 2. GHI NHỚ VỊ TRÍ MỖI KHI BẠN CHUYỂN TỪ VỰNG
  useEffect(() => {
    if (vocabs.length > 0) {
      localStorage.setItem("nguHanhLastIndex", currentIndex.toString());
    }
  }, [currentIndex, vocabs.length]);

  if (loading) return <div className="h-[100dvh] flex items-center justify-center bg-black text-white text-xl">Đang kết nối với Vũ trụ...</div>;
  if (vocabs.length === 0) return <div className="h-[100dvh] flex items-center justify-center bg-black text-white text-xl text-center px-4">Chưa có linh khí nào.<br/>Hãy vào /upload để nạp nhé!</div>;

  const currentVocab = vocabs[currentIndex];

  const nextVocab = () => {
    setCurrentIndex((prev) => (prev + 1) % vocabs.length);
  };

  const prevVocab = () => {
    setCurrentIndex((prev) => (prev - 1 + vocabs.length) % vocabs.length);
  };

  const filteredVocabs = vocabs.filter((v) => 
    v.word_main.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.pinyin_main.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.meaning_main.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-br from-indigo-950 via-black to-slate-950 flex flex-col items-center justify-evenly py-2 font-sans relative overflow-hidden">
      
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] z-10 tracking-widest uppercase text-center mt-2 px-2">
        Ngũ Hành Trận Pháp
      </h1>
      
      <div className="relative w-[300px] h-[320px] sm:w-[340px] sm:h-[360px] md:w-[460px] md:h-[460px] flex items-center justify-center z-10">
        <div className="absolute w-[85%] h-[85%] md:w-[95%] md:h-[95%] border-2 border-dashed border-slate-500/40 rounded-full animate-[spin_30s_linear_infinite]"></div>
        <div className="absolute w-[65%] h-[65%] md:w-[75%] md:h-[75%] border border-slate-400/20 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>

        <div className="absolute z-20">
          <Flashcard word={currentVocab.word_main} pinyin={currentVocab.pinyin_main} meaning={currentVocab.meaning_main} isMain={true} colorTheme="border-yellow-400 text-yellow-300 shadow-[0_0_40px_rgba(250,204,21,0.8)] bg-black/80" />
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 hover:scale-110 transition-transform duration-300">
          <Flashcard word={currentVocab.hoa_word} pinyin={currentVocab.hoa_pinyin} meaning={currentVocab.hoa_meaning} colorTheme="border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.7)] bg-red-950/60" />
        </div>

        <div className="absolute top-[25%] right-[2%] md:right-[-2%] translate-x-[5%] md:translate-x-1/4 z-10 hover:scale-110 transition-transform duration-300">
          <Flashcard word={currentVocab.tho_word} pinyin={currentVocab.tho_pinyin} meaning={currentVocab.tho_meaning} colorTheme="border-orange-500 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.7)] bg-orange-950/60" />
        </div>

        <div className="absolute bottom-[5%] md:bottom-[8%] right-[6%] md:right-[6%] translate-x-[5%] md:translate-x-1/4 z-10 hover:scale-110 transition-transform duration-300">
          <Flashcard word={currentVocab.kim_word} pinyin={currentVocab.kim_pinyin} meaning={currentVocab.kim_meaning} colorTheme="border-gray-300 text-gray-200 shadow-[0_0_20px_rgba(209,213,219,0.7)] bg-slate-800/60" />
        </div>

        <div className="absolute bottom-[5%] md:bottom-[8%] left-[6%] md:left-[6%] -translate-x-[5%] md:-translate-x-1/4 z-10 hover:scale-110 transition-transform duration-300">
          <Flashcard word={currentVocab.thuy_word} pinyin={currentVocab.thuy_pinyin} meaning={currentVocab.thuy_meaning} colorTheme="border-blue-400 text-blue-300 shadow-[0_0_20px_rgba(96,165,250,0.7)] bg-blue-950/60" />
        </div>

        <div className="absolute top-[25%] left-[2%] md:left-[-2%] -translate-x-[5%] md:-translate-x-1/4 z-10 hover:scale-110 transition-transform duration-300">
          <Flashcard word={currentVocab.moc_word} pinyin={currentVocab.moc_pinyin} meaning={currentVocab.moc_meaning} colorTheme="border-green-400 text-green-300 shadow-[0_0_20px_rgba(74,222,128,0.7)] bg-green-950/60" />
        </div>
      </div>

      <div className="flex flex-col items-center z-20 mb-2 w-full px-4 max-w-md">
        <span className="text-slate-400 text-xs sm:text-sm font-medium mb-3 tracking-wider">
          Chu kỳ: {currentIndex + 1} / {vocabs.length}
        </span>
        
        <div className="flex flex-col w-full gap-3">
          
          <div className="flex justify-between gap-3 w-full">
            <button 
              onClick={prevVocab}
              className="flex-1 px-2 py-2 sm:py-3 text-sm sm:text-base bg-slate-800/80 text-white rounded-full font-bold shadow-lg border border-slate-600 hover:bg-slate-700 active:scale-95 transition-all"
            >
              ⬅️ Quay Lại
            </button>

            <button 
              onClick={nextVocab}
              className="flex-1 px-2 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold shadow-[0_0_20px_rgba(124,58,237,0.5)] border border-purple-400 hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.8)] active:scale-95 transition-all"
            >
              Tiếp Theo ➔
            </button>
          </div>

          <button 
            onClick={() => setIsListOpen(true)}
            className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base bg-slate-900/80 text-yellow-400 rounded-full font-bold shadow-lg border border-yellow-600/50 hover:bg-slate-800 active:scale-95 transition-all"
          >
            🔍 Mở Kho Linh Khí (Danh Sách)
          </button>
        </div>
      </div>

      {isListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md h-[80vh] flex flex-col bg-slate-900 border border-indigo-500/50 rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.3)] overflow-hidden">
            
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <h2 className="text-lg font-bold text-yellow-400">Kho Linh Khí ({vocabs.length})</h2>
              <button onClick={() => setIsListOpen(false)} className="text-gray-400 hover:text-white text-xl p-2 active:scale-90">
                ✕
              </button>
            </div>

            <div className="p-4 border-b border-slate-800">
              <input 
                type="text" 
                placeholder="Tìm kiếm chữ Hán, pinyin, nghĩa..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredVocabs.length > 0 ? (
                filteredVocabs.map((v) => {
                  const originalIndex = vocabs.findIndex(ov => ov.id === v.id);
                  const isSelected = currentIndex === originalIndex;

                  return (
                    <div 
                      key={v.id} 
                      onClick={() => {
                        setCurrentIndex(originalIndex);
                        setIsListOpen(false);
                      }} 
                      className={`p-3 rounded-xl cursor-pointer transition-colors border ${isSelected ? 'bg-indigo-900/40 border-indigo-500' : 'bg-slate-800/40 border-transparent hover:bg-slate-700'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xl font-bold font-kaiti text-white">{v.word_main}</span>
                        <span className="text-sm font-medium text-red-400">{v.pinyin_main}</span>
                      </div>
                      <div className="text-sm text-gray-300 line-clamp-1">{v.meaning_main}</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-slate-500 mt-10">Không tìm thấy từ vựng nào...</div>
              )}
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}

// Component Flashcard Tâm linh
function Flashcard({ word, pinyin, meaning, colorTheme, isMain = false }: { word: string, pinyin: string, meaning: string, colorTheme: string, isMain?: boolean }) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [word]);
  
  const handleCardAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "zh-CN";
    window.speechSynthesis.speak(utterance);
  };

  const wordLength = word.length;
  let dynamicTextSize = "";
  
  if (isMain) {
    if (wordLength <= 2) dynamicTextSize = "text-4xl sm:text-5xl md:text-6xl";
    else if (wordLength === 3) dynamicTextSize = "text-3xl sm:text-4xl md:text-5xl";
    else dynamicTextSize = "text-2xl sm:text-3xl md:text-4xl"; 
  } else {
    if (wordLength <= 2) dynamicTextSize = "text-2xl sm:text-3xl md:text-4xl";
    else if (wordLength === 3) dynamicTextSize = "text-lg sm:text-xl md:text-2xl";
    else dynamicTextSize = "text-base sm:text-lg md:text-xl"; 
  }

  return (
    <div 
      className={`group perspective-1000 cursor-pointer ${isMain ? 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48' : 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32'}`}
      onClick={handleCardAction}
    >
      <div className={`relative w-full h-full duration-700 transform-style-3d md:group-hover:rotate-y-180 ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        <div className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center border-2 rounded-full backdrop-blur-sm transition-transform active:scale-95 overflow-hidden px-1 sm:px-2 ${colorTheme}`}>
          {isMain && (
            <div className="absolute text-[6rem] sm:text-[7rem] md:text-[9rem] opacity-20 text-yellow-500 animate-[spin_10s_linear_infinite]">☯</div>
          )}
          <span className={`relative z-10 text-white font-kaiti drop-shadow-lg text-center leading-tight tracking-wide ${dynamicTextSize}`}>
            {word}
          </span>
          <span className="relative z-10 text-[8px] sm:text-[9px] md:text-[10px] text-white/50 mt-1 opacity-0 md:group-hover:opacity-100 transition-opacity font-sans">
            Chạm / Lật
          </span>
        </div>

        <div className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center border-2 rounded-full backdrop-blur-sm p-2 text-center active:scale-95 ${colorTheme}`}>
          <span className={`${isMain ? 'text-lg sm:text-xl md:text-2xl' : 'text-sm sm:text-base md:text-lg'} text-white font-bold mb-1 drop-shadow-md`}>
            {pinyin}
          </span>
          <span className={`${isMain ? 'text-[11px] sm:text-xs md:text-sm' : 'text-[9px] sm:text-[10px] md:text-[11px]'} font-medium text-white/90 line-clamp-3 leading-tight`}>
            {meaning}
          </span>
        </div>

      </div>
    </div>
  );
}