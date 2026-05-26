"use client"

import * as React from "react"
import { IconDashboard, IconInnerShadowTop, IconListDetails, IconSettings } from "@tabler/icons-react"

import { NavMain } from "~/components/nav-main"
import { NavUser } from "~/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { useSelector } from "react-redux"
import { RootState } from "~/app/slice/config"

const data = {
  navMain: [
    {
      title: "Forms",
      url: "/forms",
      icon: IconListDetails,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.user.user)

  return (
    <Sidebar 
      collapsible="offcanvas" 
      className="border-r border-border/40 dark:bg-black/60 bg-white/60 backdrop-blur-2xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] transition-all duration-300"
      {...props}
    >
      <SidebarHeader className="pt-6 pb-2 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-14 data-[slot=sidebar-menu-button]:p-2 hover:bg-white/50 dark:hover:bg-white/5 rounded-2xl transition-all duration-300 group overflow-hidden relative border border-transparent hover:border-border/50"
            >
              <a href="/">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-2 rounded-xl shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                  <IconInnerShadowTop className="size-6" />
                </div>
                <div className="flex flex-col ml-3 justify-center">
                  <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    Chai Forms
                  </span>
                  {user?.role === "admin" && (
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-primary">Admin Portal</span>
                  )}
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <div className="px-6 py-2">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </div>

      <SidebarContent className="px-3 py-2 space-y-1">
        <NavMain 
          items={user?.role === "admin" 
            ? [{ title: "Dashboard", url: "/admin/dashboard", icon: IconDashboard }, ...data.navMain] 
            : data.navMain} 
        />
      </SidebarContent>
      
      <div className="px-6 py-2 mt-auto">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </div>

      <SidebarFooter className="p-4 pb-6">
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
