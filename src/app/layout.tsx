import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatAssistantProvider } from "@/components/ChatAssistantProvider";
import LayoutContent from "@/components/LayoutContent";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wabi Care - Special Education Platform",
  description: "Digital platform for special education data collection and IEP management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${roboto.variable} font-material antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <ChatAssistantProvider>
              <LayoutContent>
                {children}
              </LayoutContent>
            </ChatAssistantProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
