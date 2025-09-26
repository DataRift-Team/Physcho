"use client"

import { useState, useEffect } from "react"
import { Users, Calendar, MessageSquare, AlertTriangle, Activity } from "lucide-react"
import api from "../config/api"

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
  const response = await api.get("/admin/analytics")
      setAnalytics(response.data)
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  if (!analytics) {
    return <div className="text-center text-gray-500">Failed to load analytics</div>
  }

  const stats = [
    {
      name: "Total Users",
      value: analytics.overview.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Total Screenings",
      value: analytics.overview.totalScreenings,
      icon: Activity,
      color: "bg-green-500",
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "Bookings",
      value: analytics.overview.totalBookings,
      icon: Calendar,
      color: "bg-purple-500",
      change: "+15%",
      changeType: "positive",
    },
    {
      name: "Pending Posts",
      value: analytics.overview.pendingPosts,
      icon: MessageSquare,
      color: "bg-yellow-500",
      change: "-5%",
      changeType: "negative",
    },
  ]

  const alerts = [
    {
      type: "crisis",
      count: analytics.alerts.crisisChatSessions,
      message: "Crisis chat sessions requiring immediate attention",
      color: "bg-red-100 text-red-800 border-red-200",
    },
    {
      type: "severe",
      count: analytics.alerts.crisisScreenings,
      message: "Severe screening results needing follow-up",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your mental health platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p
                      className={`ml-2 text-sm font-medium ${
                        stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Alerts Section */}
      {analytics.alerts.totalCrisis > 0 && (
        <div className="card">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Crisis Alerts</h2>
          </div>
          <div className="space-y-3">
            {alerts.map(
              (alert, index) =>
                alert.count > 0 && (
                  <div key={index} className={`p-4 rounded-lg border ${alert.color}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {alert.count} {alert.message}
                        </p>
                      </div>
                      <button className="btn btn-primary btn-sm">Review</button>
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Severity Distribution</h2>
          <div className="space-y-3">
            {analytics.distributions.severity.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">{item._id}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(item.count / analytics.overview.totalScreenings) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Type Distribution</h2>
          <div className="space-y-3">
            {analytics.distributions.testTypes.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{item._id}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(item.count / analytics.overview.totalScreenings) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity (Last 30 Days)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">New Screenings</p>
              <p className="text-lg font-semibold text-gray-900">{analytics.recentActivity.screenings}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">New Bookings</p>
              <p className="text-lg font-semibold text-gray-900">{analytics.recentActivity.bookings}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
