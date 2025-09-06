import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarProvider as FriendSidebarProvider } from "@/components/ui/friend-sidebar";
import { TeamProvider } from "@/contexts/team-context";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { StudentSidebar } from "@/components/student/sidebar";
import { EmCoinBalanceCompact } from "@/components/emcoin/emcoin-balance-display";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
 
  return (
    <TeamProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <FriendSidebarProvider defaultOpen={false}>
          <StudentSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/">
                        Emdash Debate League
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="px-4">
                <EmCoinBalanceCompact />
              </div>
            </header>
            {children}
          </SidebarInset>
        </FriendSidebarProvider>
      </SidebarProvider>
    </TeamProvider>
  );
}
