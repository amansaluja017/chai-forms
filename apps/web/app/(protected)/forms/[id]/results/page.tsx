"use client";

import { useParams } from "next/navigation";
import { useGetFormAnalytics, useGetFormChartData } from "~/hooks/api/analytics/analytics.hook";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { IconEye, IconClipboardList, IconTarget, IconClock } from "@tabler/icons-react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { ResponsesTable } from "~/components/responses-table";

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export default function ResultsPage() {
  const params = useParams();
  const formId = params.id as string;

  const { data: analytics, isLoading: isStatsLoading } = useGetFormAnalytics(formId);
  const { data: chartsData, isLoading: isChartsLoading } = useGetFormChartData(formId);

  const isLoading = isStatsLoading || isChartsLoading;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/forms">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <IconArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Form Results</h1>
              <p className="text-muted-foreground mt-1">Analytics and insights for your form.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Views</p>
                      <h3 className="text-3xl font-bold">{analytics?.views || 0}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <IconEye className="size-6" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Total Responses</p>
                      <h3 className="text-3xl font-bold">{analytics?.responses || 0}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
                      <IconClipboardList className="size-6" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Completion Rate</p>
                      <h3 className="text-3xl font-bold">{analytics?.completionRate || 0}%</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <IconTarget className="size-6" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Average Time</p>
                      <h3 className="text-3xl font-bold">{analytics?.averageTime || 0}s</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                      <IconClock className="size-6" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <h2 className="text-2xl font-bold mt-8 mb-4">Response Breakdown</h2>
              
              {chartsData && chartsData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {chartsData.map((chart: any, i: number) => {
                    const totalVotes = chart.data.reduce((sum: number, item: any) => sum + item.value, 0);
                    
                    return (
                      <Card key={chart.fieldId} className="flex flex-col">
                        <CardHeader>
                          <CardTitle>{chart.label}</CardTitle>
                          <CardDescription>Based on {totalVotes} recorded choices</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                          {totalVotes === 0 ? (
                            <p className="text-muted-foreground">No data available for this question yet.</p>
                          ) : chart.type === "radio" || chart.type === "yes_no" || chart.type === "dropdown" ? (
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={chart.data}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={100}
                                  paddingAngle={2}
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                  labelLine={false}
                                >
                                  {chart.data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <RechartsTooltip 
                                  formatter={(value: any) => [value, "Votes"] as any}
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={chart.data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                                <RechartsTooltip 
                                  formatter={(value: any) => [value, "Votes"] as any}
                                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill={COLORS[0]} radius={[4, 4, 0, 0]}>
                                  {chart.data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <p>There are no multi-choice questions (dropdown, radio, checkbox, yes/no) in this form to visualize.</p>
                  </CardContent>
                </Card>
              )}

              {/* Raw Responses Table */}
              <ResponsesTable formId={formId} />
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
