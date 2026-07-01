"use client";

import { useState } from "react";
import Papa from "papaparse";
import { supabase } from "../../lib/supabase";

export default function UploadPage() {
  const [status, setStatus] = useState<string>("Chưa có tệp nào được chọn.");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatus("⏳ Đang đọc tệp CSV...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: async (results) => {
        setStatus("🚀 Đang đẩy dữ liệu lên Vũ trụ...");
        
        const dataToUpload = results.data.filter(
          (row: any) => row.word_main && row.word_main.trim() !== ""
        );

        if (dataToUpload.length === 0) {
           setStatus("❌ Lỗi: Không tìm thấy dữ liệu hợp lệ trong tệp CSV.");
           setIsLoading(false);
           return;
        }

        const { error } = await supabase
          .from("ngu_hanh_vocab")
          .upsert(dataToUpload, { 
            onConflict: "word_main", 
            ignoreDuplicates: true 
          });

        if (error) {
          console.error("Chi tiết lỗi Supabase:", JSON.stringify(error, null, 2));
          setStatus(`❌ Lỗi khi tải lên. Vui lòng nhấn F12 (Console) để xem chi tiết.`);
        } else {
          setStatus(`✅ Thành công! Đã nạp thêm ${dataToUpload.length} linh khí.`);
        }
        setIsLoading(false);
      },
      error: (error) => {
        setStatus(`❌ Lỗi đọc tệp: ${error.message}`);
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-indigo-950 via-black to-slate-950 flex flex-col items-center justify-center p-4 font-sans text-white">
      
      {/* Khung thẻ kính mờ (Glassmorphism) */}
      <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(79,70,229,0.15)] flex flex-col items-center">
        
        {/* Tiêu đề */}
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-500 tracking-wider uppercase text-center">
          Trạm Nạp Linh Khí
        </h1>
        <p className="text-slate-400 text-sm mb-8 text-center">
          Tải lên tệp CSV chứa bảng từ vựng Ngũ Hành của bạn. Hệ thống sẽ tự động loại bỏ các từ đã tồn tại.
        </p>

        {/* Khu vực Upload được tùy biến lại */}
        <label className={`w-full flex flex-col items-center px-4 py-10 bg-slate-800/40 text-slate-300 rounded-xl border-2 border-dashed ${isLoading ? 'border-slate-600 opacity-50 cursor-not-allowed' : 'border-indigo-500/50 hover:border-indigo-400 hover:bg-slate-800/60 cursor-pointer'} transition-all mb-6`}>
          
          {/* Icon Upload (SVG) */}
          <svg className="w-12 h-12 mb-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          
          <span className="text-base font-medium mb-1">
            {isLoading ? 'Đang xử lý...' : 'Nhấn để chọn tệp CSV'}
          </span>
          <span className="text-xs text-slate-500">Chỉ hỗ trợ định dạng .csv</span>
          
          {/* Nút input thật bị ẩn đi */}
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            disabled={isLoading}
            className="hidden"
          />
        </label>

        {/* Trạng thái hiển thị */}
        <div className={`text-center text-sm md:text-base font-medium px-4 py-3 rounded-lg bg-slate-950/50 w-full border border-slate-800 ${errorColor(status)}`}>
          {status}
        </div>

      </div>
    </div>
  );
}

// Hàm phụ trợ đổi màu chữ và thêm biểu tượng cho sinh động
function errorColor(status: string) {
  if (status.includes("❌")) return "text-red-400";
  if (status.includes("✅")) return "text-green-400";
  if (status.includes("⏳") || status.includes("🚀")) return "text-yellow-400 animate-pulse";
  return "text-slate-400";
}