"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import api from "../config/api"

const Analytics = () => {
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
    return <div className="loading">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center text-gray-500">Failed to load analytics</div>
  }

  const COLORS = ["#4F46E5", "#059669", "#DC2626", "#F59E0B", "#7C3AED"]

  const severityData = analytics.distributions.severity.map((item) => ({
    name: item._id,
    value: item.count,
  }))

  const testTypeData = analytics.distributions.testTypes.map((item) => ({
    name: item._id,
    count: item.count,
  }))

  // Mock trend data for demonstration
  const trendData = [
    { month: "Jan", screenings: 45, bookings: 12 },
    { month: "Feb", screenings: 52, bookings: 18 },
    { month: "Mar", screenings: 48, bookings: 15 },
    { month: "Apr", screenings: 61, bookings: 22 },
    { month: "May", screenings: 55, bookings: 19 },
    { month: "Jun", screenings: 67, bookings: 25 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Detailed insights into platform usage and mental health trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{analytics.overview.totalUsers}</p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900">Screenings</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{analytics.overview.totalScreenings}</p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900">Bookings</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{analytics.overview.totalBookings}</p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900">Crisis Cases</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{analytics.alerts.totalCrisis}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution Pie Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Severity Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Test Type Distribution Bar Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Type Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={testTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="screenings" stroke="#4F46E5" strokeWidth={2} name="Screenings" />
            <Line type="monotone" dataKey="bookings" stroke="#059669" strokeWidth={2} name="Bookings" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Crisis Alert Summary */}
      {analytics.alerts.totalCrisis > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Crisis Alert Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-800">Crisis Chat Sessions</h3>
              <p className="text-2xl font-bold text-red-600 mt-2">{analytics.alerts.crisisChatSessions}</p>
              <p className="text-sm text-red-600 mt-1">Requiring immediate attention</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-orange-800">Severe Screenings</h3>
              <p className="text-2xl font-bold text-orange-600 mt-2">{analytics.alerts.crisisScreenings}</p>
              <p className="text-sm text-orange-600 mt-1">High-risk assessment results</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity (Last 30 Days)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800">New Screenings</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{analytics.recentActivity.screenings}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-purple-800">New Bookings</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">{analytics.recentActivity.bookings}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
