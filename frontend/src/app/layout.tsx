import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerOS | AI-Powered Career Optimization & Job Application SaaS",
  description: "Accelerate your job search. Analyze resumes, track applications, prepare for technical interviews, and map your skills gap with the next-generation CareerOS.",
  keywords: ["CareerOS", "Resume Analyzer", "Job Tracker", "Mock Interviews", "ATS Checker", "Skill Roadmap"],
  authors: [{ name: "CareerOS Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
