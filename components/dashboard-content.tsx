"use client"

import { useState } from "react"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, Users, DollarSign, Clock } from "lucide-react"
import Link from "next/link"
import { useUserCurrency } from "@/hooks/useUserCurrency"
import { formatCurrency } from "@/lib/currency"
import CurrencyDisplay from "@/components/CurrencyDisplay"

interface DashboardData {
  totalRevenue: number
  activeProjects: number
  totalClients: number
  pendingPayments: number
  projects: Array<{
    id: string
    name: string
    client: { name: string }
    completed: boolean
  }>
  payments: Array<{
    id: string
    amount: number
    currency: string
    status: string
    project: { client: { name: string } }
  }>
}

interface DashboardContentProps {
  initialData: DashboardData
}

export function DashboardContent({ initialData }: DashboardContentProps) {
  const [data] = useState<DashboardData>(initialData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { defaultCurrency, isLoading } = useUserCurrency()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const stats = [
    {
      title: "Total Revenue",
      value: isLoading ? "..." : formatCurrency(data.totalRevenue, defaultCurrency),
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Active Projects",
      value: data.activeProjects.toString(),
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Total Clients",
      value: data.totalClients.toString(),
      icon: Users,
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Pending Payments",
      value: data.pendingPayments.toString(),
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400"
    }
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-2">
            Overview of your business
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="mt-4 sm:mt-0"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold">Recent Projects</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/projects">View All</Link>
            </Button>
          </div>
          {data.projects.length > 0 ? (
            <div className="space-y-3">
              {data.projects.map(project => (
                <div key={project.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b last:border-b-0 gap-2 hover:bg-muted/50 rounded px-2 -mx-2 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">{project.name}</p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{project.client.name}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full self-start sm:self-center shrink-0 ${project.completed
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                    {project.completed ? 'Completed' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects yet"
              description="Create your first project to get started"
              actionLabel="Add Project"
              actionHref="/projects/add"
              icon={<TrendingUp className="w-8 h-8 text-muted-foreground" />}
            />
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold">Recent Payments</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/payments">View All</Link>
            </Button>
          </div>
          {data.payments.length > 0 ? (
            <div className="space-y-3">
              {data.payments.map(payment => (
                <div key={payment.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b last:border-b-0 gap-2 hover:bg-muted/50 rounded px-2 -mx-2 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm sm:text-base">
                      <CurrencyDisplay amount={payment.amount} currency={payment.currency} />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{payment.project.client.name}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full self-start sm:self-center shrink-0 ${payment.status === 'PAID'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : payment.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No payments yet"
              description="Create your first invoice to track payments"
              actionLabel="Create Invoice"
              actionHref="/payments/add"
              icon={<DollarSign className="w-8 h-8 text-muted-foreground" />}
            />
          )}
        </div>
      </div>
    </div>
  )
}