import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

import { Noto_Sans_SC } from "next/font/google";
const font = Noto_Sans_SC({
    weight: "400",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "剑网3计算器",
    description: "基于直接调取游戏内数据的蒙特卡洛模拟计算器",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN" className="dark">
            <body className={font.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
