import { Lexend_Deca } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Script from "next/script";

import { Toaster } from "@/components/ui/toaster"
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PresenceProvider } from "@/contexts/online-signal";
import { ChatProvider } from "@/contexts/chat-context";
import { TeamProvider } from "@/contexts/team-context";
import { V5AddictionBridge } from "@/components/addiction/v5-bridge";

export const metadata = {
  title: "Emdash Debate",
};

const lexend_deca = Lexend_Deca({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: { user } } = await (await createServerClient()).auth.getUser();
  if (!user) redirect(`${process.env.PROTOCOL}${process.env.AUTH_URL}`)

  return (
    <html lang="en" className={lexend_deca.className} suppressHydrationWarning>
      <body className="bg-background text-foreground relative">
        {/* V5 Engine Data Layer - Hidden mount point for data only */}
        <div id="v5-addiction-bar" className="hidden" />
        
        {/* Load V5 Engine Scripts */}
        <Script src="/v5-engine/config.js" strategy="beforeInteractive" />
        <Script src="/v5-engine/addiction-bar.js" strategy="afterInteractive" />
        
        <Providers>
          <V5AddictionBridge />
          <div className="absolute top-0 left-0 w-svw h-svh -z-10 bg-radial-[at_50%_110%] from-transparent to-background/10 to-10%">
            <Image className="object-cover -z-20" src={"/background/bg.svg"} alt={"bg"} fill />
          </div>
          <div className="absolute top-0 left-0 w-svw h-svh bg-radial-[at_50%_80%] from-transparent via-transparent to-background via-30% to-80% -z-10" />
          {children}
        </Providers>
        <Analytics mode="auto" debug={false} />
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TeamProvider>
      <ChatProvider>
        <PresenceProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </PresenceProvider>
      </ChatProvider>
    </TeamProvider>
  );
}