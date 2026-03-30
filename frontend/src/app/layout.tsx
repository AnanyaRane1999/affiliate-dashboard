import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import I18nProvider from "@/lib/i18n-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Affiliate Growth Platform — Germany",
  description: "Automated affiliate growth dashboard for the German market",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-gray-950 text-gray-100 antialiased`}>
        <QueryProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  );
}