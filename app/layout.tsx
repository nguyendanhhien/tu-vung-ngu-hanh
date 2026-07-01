import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Từ Vựng Ngũ Hành",
  description: "Học từ vựng tiếng Trung theo phương pháp Ngũ Hành",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        {/* Thanh Điều Hướng (Navbar) */}
        <nav className="bg-slate-800 text-white py-4 shadow-md w-full">
          <div className="max-w-4xl mx-auto flex justify-center gap-8">
            <Link href="/" className="text-lg font-semibold hover:text-yellow-400 transition-colors">
              🧧 Học Từ Vựng
            </Link>
            <Link href="/upload" className="text-lg font-semibold hover:text-yellow-400 transition-colors">
              ⚙️ Đẩy Dữ Liệu
            </Link>
          </div>
        </nav>

        {/* Nội dung các trang sẽ hiển thị ở đây */}
        <main className="flex-1 bg-black">
          {children}
        </main>
      </body>
    </html>
  );
}