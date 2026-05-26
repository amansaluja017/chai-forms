"use client"

import { AppSidebar } from "~/components/app-sidebar"
import { SiteHeader } from "~/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar"

import Link from "next/link"
import { Button } from "~/components/ui/button"
import { IconForms, IconLoader } from "@tabler/icons-react"
import { useSelector } from "react-redux"
import { RootState } from "~/app/slice/config"
import { trpc } from "~/trpc/client"

import { AdminSectionCards } from "~/components/admin/section-cards"
import { AdminChartArea } from "~/components/admin/chart-area"
import { AdminDataTable } from "~/components/admin/data-table"

export default function Page() {
  const user = useSelector((state: RootState) => state.user.user)
  const isAdmin = user?.role === "admin"

  // Only fetch admin stats if user is an admin
  const { data: adminStats, isLoading: isStatsLoading } = trpc.admin.getDashboardStats.useQuery(undefined, {
    enabled: isAdmin,
  })

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              
              <div className="px-4 lg:px-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {isAdmin ? "Admin Overview" : "Overview"}
                  </h1>
                  <p className="text-muted-foreground">
                    {isAdmin ? "Platform-wide analytics and form management." : "Manage your forms and view analytics."}
                  </p>
                </div>
                {!isAdmin && (
                  <Link href="/dashboard/forms">
                    <Button className="gap-2">
                      <IconForms className="size-4" />
                      Manage Forms
                    </Button>
                  </Link>
                )}
              </div>

              {isAdmin && (
                <>
                  {isStatsLoading || !adminStats ? (
                    <div className="flex h-64 items-center justify-center text-muted-foreground">
                      <IconLoader className="h-6 w-6 animate-spin mr-2" /> Loading admin dashboard...
                    </div>
                  ) : (
                    <>
                      <AdminSectionCards stats={adminStats} />
                      <div className="px-4 lg:px-6">
                        <AdminChartArea data={adminStats.chartData} />
                      </div>
                      <AdminDataTable />
                    </>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
