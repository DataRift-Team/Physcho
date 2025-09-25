"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import axios from "axios"

const BookingsScreen = () => {
  const [counselors, setCounselors] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedCounselor, setSelectedCounselor] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("book") // 'book' or 'my-bookings'

  const API_BASE_URL = "http://localhost:5000/api"

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ]

  useEffect(() => {
    loadCounselors()
    loadMyBookings()
  }, [])

  const loadCounselors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/counselors`)
      setCounselors(response.data)
    } catch (error) {
      console.error("Failed to load counselors:", error)
    }
  }

  const loadMyBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/my-bookings`)
      setMyBookings(response.data)
    } catch (error) {
      console.error("Failed to load bookings:", error)
    }
  }

  const handleBookAppointment = (counselor) => {
    setSelectedCounselor(counselor)
    setShowBookingModal(true)
  }

  const submitBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Error", "Please select date and time")
      return
    }

    setLoading(true)
    try {
      await axios.post(`${API_BASE_URL}/bookings/book`, {
        counselorName: selectedCounselor.name,
        date: selectedDate,
        time: selectedTime,
        notes: notes,
      })

      Alert.alert("Success", "Appointment booked successfully!")
      setShowBookingModal(false)
      resetBookingForm()
      loadMyBookings()
    } catch (error) {
      Alert.alert("Error", "Failed to book appointment")
    } finally {
      setLoading(false)
    }
  }

  const resetBookingForm = () => {
    setSelectedCounselor(null)
    setSelectedDate("")
    setSelectedTime("")
    setNotes("")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#059669"
      case "pending":
        return "#F59E0B"
      case "completed":
        return "#6B7280"
      case "cancelled":
        return "#DC2626"
      default:
        return "#6B7280"
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

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Counselor Bookings</Text>
        <Text style={styles.headerSubtitle}>Schedule confidential sessions with professional counselors</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "book" && styles.activeTab]}
          onPress={() => setActiveTab("book")}
        >
          <Text style={[styles.tabText, activeTab === "book" && styles.activeTabText]}>Book Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "my-bookings" && styles.activeTab]}
          onPress={() => setActiveTab("my-bookings")}
        >
          <Text style={[styles.tabText, activeTab === "my-bookings" && styles.activeTabText]}>My Bookings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "book" ? (
          <View>
            <Text style={styles.sectionTitle}>Available Counselors</Text>
            {counselors.map((counselor) => (
              <View key={counselor.id} style={styles.counselorCard}>
                <View style={styles.counselorInfo}>
                  <Text style={styles.counselorName}>{counselor.name}</Text>
                  <Text style={styles.counselorSpecialization}>{counselor.specialization}</Text>
                  <View style={styles.availabilityBadge}>
                    <Icon name="check-circle" size={16} color="#059669" />
                    <Text style={styles.availabilityText}>Available</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.bookButton} onPress={() => handleBookAppointment(counselor)}>
                  <Text style={styles.bookButtonText}>Book</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Your Appointments</Text>
            {myBookings.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="event-note" size={48} color="#9CA3AF" />
                <Text style={styles.emptyStateText}>No appointments booked yet</Text>
                <TouchableOpacity style={styles.emptyStateButton} onPress={() => setActiveTab("book")}>
                  <Text style={styles.emptyStateButtonText}>Book Your First Session</Text>
                </TouchableOpacity>
              </View>
            ) : (
              myBookings.map((booking) => (
                <View key={booking._id} style={styles.bookingCard}>
                  <View style={styles.bookingHeader}>
                    <Text style={styles.bookingCounselor}>{booking.counselorName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                      <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
                    </View>
                  </View>
                  <View style={styles.bookingDetails}>
                    <View style={styles.bookingDetail}>
                      <Icon name="event" size={16} color="#6B7280" />
                      <Text style={styles.bookingDetailText}>{formatDate(booking.date)}</Text>
                    </View>
                    <View style={styles.bookingDetail}>
                      <Icon name="access-time" size={16} color="#6B7280" />
                      <Text style={styles.bookingDetailText}>{booking.time}</Text>
                    </View>
                  </View>
                  {booking.notes && <Text style={styles.bookingNotes}>Notes: {booking.notes}</Text>}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      <Modal visible={showBookingModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowBookingModal(false)
                resetBookingForm()
              }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Book Session</Text>
            <TouchableOpacity onPress={submitBooking} disabled={loading || !selectedDate || !selectedTime}>
              <Text
                style={[
                  styles.modalSaveText,
                  (!selectedDate || !selectedTime || loading) && styles.modalSaveTextDisabled,
                ]}
              >
                {loading ? "Booking..." : "Book"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedCounselor && (
              <View style={styles.selectedCounselorCard}>
                <Text style={styles.selectedCounselorName}>{selectedCounselor.name}</Text>
                <Text style={styles.selectedCounselorSpec}>{selectedCounselor.specialization}</Text>
              </View>
            )}

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Select Date</Text>
              <TextInput
                style={styles.dateInput}
                value={selectedDate}
                onChangeText={setSelectedDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.formHint}>Minimum date: {getTomorrowDate()}</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Select Time</Text>
              <View style={styles.timeSlots}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[styles.timeSlot, selectedTime === time && styles.selectedTimeSlot]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[styles.timeSlotText, selectedTime === time && styles.selectedTimeSlotText]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any specific concerns or topics you'd like to discuss..."
                multiline
                numberOfLines={4}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.confidentialityNotice}>
              <Icon name="lock" size={20} color="#059669" />
              <Text style={styles.confidentialityText}>All sessions are completely confidential and secure</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#4F46E5",
  },
  tabText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#4F46E5",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  counselorCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  counselorInfo: {
    flex: 1,
  },
  counselorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  counselorSpecialization: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  availabilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  availabilityText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
  },
  bookButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bookingCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bookingCounselor: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  bookingDetails: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 8,
  },
  bookingDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bookingDetailText: {
    fontSize: 14,
    color: "#6B7280",
  },
  bookingNotes: {
    fontSize: 14,
    color: "#374151",
    fontStyle: "italic",
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalCancelText: {
    fontSize: 16,
    color: "#6B7280",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  modalSaveText: {
    fontSize: 16,
    color: "#4F46E5",
    fontWeight: "600",
  },
  modalSaveTextDisabled: {
    opacity: 0.5,
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  selectedCounselorCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  selectedCounselorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  selectedCounselorSpec: {
    fontSize: 14,
    color: "#6B7280",
  },
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  formHint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  timeSlots: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  selectedTimeSlot: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  timeSlotText: {
    fontSize: 14,
    color: "#374151",
  },
  selectedTimeSlotText: {
    color: "white",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
    textAlignVertical: "top",
  },
  confidentialityNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  confidentialityText: {
    flex: 1,
    fontSize: 14,
    color: "#065F46",
  },
})

export default BookingsScreen
