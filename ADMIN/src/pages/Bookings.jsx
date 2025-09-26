"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, User, Filter } from "lucide-react"
import api from "../config/api"

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
  const response = await api.get("/bookings/all")
      setBookings(response.data)
    } catch (error) {
      console.error("Failed to load bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
  await api.patch(`/bookings/${bookingId}/status`, { status: newStatus })
      setBookings(bookings.map((booking) => (booking._id === bookingId ? { ...booking, status: newStatus } : booking)))
    } catch (error) {
      console.error("Failed to update booking status:", error)
    }
  }

  const filteredBookings = bookings.filter((booking) => filterStatus === "all" || booking.status === filterStatus)

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "badge-success"
      case "pending":
        return "badge-warning"
      case "completed":
        return "badge-info"
      case "cancelled":
        return "badge-danger"
      default:
        return "badge-info"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return <div className="loading">Loading bookings...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-600">Manage counselor appointments and sessions</p>
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex items-center gap-4">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Counselor</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{booking.userId?.name || "Unknown User"}</p>
                        <p className="text-xs text-gray-500">{booking.userId?.email || "No email"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-gray-900">{booking.counselorName}</td>
                  <td>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(booking.date)}
                      <Clock size={14} className="ml-2 mr-1" />
                      {booking.time}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(booking.status)}`}>{booking.status}</span>
                  </td>
                  <td className="text-sm text-gray-500 max-w-xs truncate">{booking.notes || "No notes"}</td>
                  <td>
                    <div className="flex space-x-2">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking._id, "confirmed")}
                            className="btn btn-success btn-sm"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking._id, "cancelled")}
                            className="btn btn-danger btn-sm"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => updateBookingStatus(booking._id, "completed")}
                          className="btn btn-primary btn-sm"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900">Total</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{bookings.length}</p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {bookings.filter((b) => b.status === "pending").length}
          </p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900">Confirmed</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {bookings.filter((b) => b.status === "confirmed").length}
          </p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {bookings.filter((b) => b.status === "completed").length}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Bookings
