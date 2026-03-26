import { Inter } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AvatarAI - Nhân bản giọng nói & khuôn mặt bằng AI",
  description: "Tạo video content không giới hạn mà không cần quay thêm 1 giây nào. Hỗ trợ creator Việt Nam.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.className} bg-surface text-slate-300 min-h-screen antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
