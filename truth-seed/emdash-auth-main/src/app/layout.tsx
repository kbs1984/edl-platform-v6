import { Header } from "@/components/header";
import { Lexend_Deca } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Image from "next/image";
import "./globals.css";

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const defaultUrl = process.env.AUTH_RUL
  ? `https://${process.env.AUTH_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Emdash Debate",
};

const lexend_deca = Lexend_Deca({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lexend_deca.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="absolute top-0 left-0 w-svw h-svh -z-10 bg-radial-[at_50%_110%] from-transparent to-background/10 to-10%">
            <Image className="object-cover -z-20" src={"/background/bg.svg"} alt={"bg"} fill />
          </div>
          <div className="absolute top-0 left-0 w-svw h-svh bg-radial-[at_50%_80%] from-transparent to-background/70 -z-10" />
          {children}
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 fixed z-40">
            <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
              <Header />
            </div>
          </nav>
          <div className="pt-28">
            {children}
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
