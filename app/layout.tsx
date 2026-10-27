import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
export const metadata: Metadata = { title: "PaperPulse — Crypto paper trading", description: "Practice crypto trading with virtual cash." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><Providers>{children}</Providers></body></html>; }
