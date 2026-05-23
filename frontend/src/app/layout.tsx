import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Salary-Sense | AI-Powered Developer Salary Intelligence",
  description: "Dynamic Model Pool Driven Developer Salary Prediction & Career Intelligence Platform",
  keywords: "salary prediction, developer salary, AI, machine learning, career intelligence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-navy min-h-screen font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
