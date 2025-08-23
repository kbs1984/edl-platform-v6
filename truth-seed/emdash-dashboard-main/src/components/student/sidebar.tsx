"use client"

import * as React from "react"
import {
  Bot,
  Calendar,
  Frame,
  LifeBuoy,
  LucideIcon,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/navbar/nav-main"
import { NavUser } from "@/components/navbar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavSecondary } from "@/components/navbar/nav-secondary"
import { StudentFriendSidebar } from "@/components/student/friend-sidebar"
import { useEffect } from "react"
import { getProfile } from "@/utils/get-user-info"

export type NavType = {
  category: string
  items: {
    title: string
    url: string
    icon?: LucideIcon
    items?: {
      title: string
      url: string
    }[]
  }[]
}

const data = {
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

const navMain: NavType = {
  category: "Platform",
  items: [
    {
      title: "Dashboard",
      url: "/",
      icon: SquareTerminal,
    },
    {
      title: "My Debates",
      url: "#",
      icon: Bot,
      items: [
        { title: "Search Discussions", url: "/discussions/search"},
        { title: "Ongoing Discussions", url: "/discussions/ongoing" },
        { title: "Past Discussions", url: "/discussions/past" },
        { title: "Discussion Materials", url: "/discussions/materials" },
      ],
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Teams & Guilds",
      url: "#",
      icon: Frame,
      items: [
        { title: "Team Dashboard", url: "/groups/teams" },
        { title: "Guild Dashboard", url: "/groups/guilds" },
      ],
    },
    {
      title: "My Score",
      url: "/statistics",
      icon: PieChart,
    },
  ],
};

export function StudentSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "",
    email: "",
    avatar: "",
  });
  
  useEffect(() => {
    const getUser = async () => {
      const profile = await getProfile();
      
      setUser({
        name: profile.name!,
        email: profile.email!,
        avatar: profile.image_path!,
      });
    };
    getUser();
  }, []);

  return (
    <>
      <Sidebar variant="floating" collapsible="icon" {...props}>
        <SidebarContent>
          <NavMain list={navMain} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <StudentFriendSidebar />
    </>
  )
}
