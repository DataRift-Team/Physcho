"use client"

import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialIcons } from "@expo/vector-icons"   // ✅ FIXED import
import { useAuth } from "../context/AuthContext"

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth()
  const [selectedMood, setSelectedMood] = useState(null)

  const moodOptions = [
    { emoji: "😊", label: "Great", value: 5 },
    { emoji: "🙂", label: "Good", value: 4 },
    { emoji: "😐", label: "Okay", value: 3 },
    { emoji: "😔", label: "Low", value: 2 },
    { emoji: "😢", label: "Sad", value: 1 },
  ]

  const quickActions = [
    {
      title: "AI Support Chat",
      subtitle: "Talk to our AI counselor",
      icon: "chat",
      color: "#4F46E5",
      screen: "AI Chat",
    },
    {
      title: "Mental Health Check",
      subtitle: "Take a screening test",
      icon: "assessment",
      color: "#059669",
      screen: "Screening",
    },
    {
      title: "Book Counselor",
      subtitle: "Schedule an appointment",
      icon: "event",
      color: "#DC2626",
      screen: "Bookings",
    },
    {
      title: "Resources Hub",
      subtitle: "Access helpful content",
      icon: "library-books",
      color: "#7C2D12",
      screen: "Resources",
    },
  ]

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    // Save mood to backend here if needed
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient colors={["#4F46E5", "#7C3AED"]} style={styles.header}>
          <Text style={styles.greeting}>Welcome back, {user?.name || "Guest"}!</Text>
          <Text style={styles.subtitle}>Your wellness space awaits</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* Mood Section */}
          <View style={styles.moodSection}>
            <Text style={styles.sectionTitle}>Daily Mood Check-in</Text>
            <Text style={styles.sectionSubtitle}>How are you feeling today?</Text>

            <View style={styles.moodOptions}>
              {moodOptions.map((mood) => (
                <TouchableOpacity
                  key={mood.value}
                  style={[
                    styles.moodOption,
                    selectedMood?.value === mood.value && styles.selectedMood,
                  ]}
                  onPress={() => handleMoodSelect(mood)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Tip Section */}
          <View style={styles.quickTipSection}>
            <Text style={styles.sectionTitle}>Quick Tip</Text>
            <View style={styles.tipCard}>
              <MaterialIcons name="lightbulb-outline" size={24} color="#F59E0B" />
              <Text style={styles.tipText}>
                Take 5 deep breaths when you feel overwhelmed. Breathe in for 4 counts, hold for 4, exhale for 6.
              </Text>
            </View>
          </View>

          {/* Quick Actions Section */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionCard}
                  onPress={() => navigation.navigate(action.screen)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                    <MaterialIcons name={action.icon} size={24} color="white" />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  content: {
    padding: 24,
    gap: 32,
  },
  moodSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  moodOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodOption: {
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    minWidth: 60,
  },
  selectedMood: {
    backgroundColor: "#EEF2FF",
    borderWidth: 2,
    borderColor: "#4F46E5",
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  quickTipSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#FFFBEB",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#92400E",
    lineHeight: 20,
  },
  actionsSection: {
    gap: 16,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  actionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    width: "47%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
})

export default HomeScreen
