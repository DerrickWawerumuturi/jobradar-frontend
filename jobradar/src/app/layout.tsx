import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import {AnalysisProvider} from "@/lib/analysis-store";


const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    display: "swap"
})

const jetBrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    display: "swap"
})

export const metadata: Metadata = {
  title: "Jobradar",
  description: "Job-hunt intelligence agent",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-space text-foreground">
          <AnalysisProvider>
              <main>
                  {children}
              </main>
          </AnalysisProvider>
          <Toaster theme="dark" />
      </body>

    </html>
  );
}
