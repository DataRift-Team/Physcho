"use client"

import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Switch,
  Platform,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons" // ✅ FIXED import
import { useAuth } from "../context/AuthContext"

const ProfileScreen = () => {
  const { user, logout } = useAuth()
  const [preferredLanguage, setPreferredLanguage] = useState("en")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [dataSharing, setDataSharing] = useState(false)

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "hi", name: "हिन्दी" },
  ]

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ])
  }

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "Your data export will be prepared and sent to your email address within 24 hours.",
      [{ text: "OK" }]
    )
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("Account Deleted", "Your account has been deleted.")
            logout()
          },
        },
      ]
    )
  }

  const handleLanguageSelect = () => {
    const options = languages.map((l) => l.name)
    Alert.alert(
      "Choose Language",
      null,
      languages.map((lang) => ({
        text: lang.name,
        onPress: () => setPreferredLanguage(lang.code),
      }))
    )
  }

  const profileSections = [
    {
      title: "Account Information",
      items: [
        {
          icon: "person",
          label: "Name",
          value: user?.name || "Guest User",
        },
        {
          icon: "email",
          label: "Email",
          value: user?.email || "guest@temp.com",
        },
        {
          icon: "account-circle",
          label: "Account Type",
          value: user?.isGuest ? "Guest" : "Registered",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: "language",
          label: "Language",
          value: languages.find((l) => l.code === preferredLanguage)?.name || "English",
          action: handleLanguageSelect,
        },
        {
          icon: "notifications",
          label: "Notifications",
          toggle: {
            value: notificationsEnabled,
            onValueChange: setNotificationsEnabled,
          },
        },
      ],
    },
    {
      title: "Privacy & Data",
      items: [
        {
          icon: "security",
          label: "Data Sharing",
          toggle: {
            value: dataSharing,
            onValueChange: setDataSharing,
          },
        },
        {
          icon: "download",
          label: "Export My Data",
          action: handleExportData,
        },
        {
          icon: "delete-forever",
          label: "Delete Account",
          action: handleDeleteAccount,
          danger: true,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: "help",
          label: "Help & FAQ",
          action: () => Alert.alert("Help", "Help section coming soon"),
        },
        {
          icon: "feedback",
          label: "Send Feedback",
          action: () => Alert.alert("Feedback", "Feedback form coming soon"),
        },
        {
          icon: "info",
          label: "About",
          action: () =>
            Alert.alert("About", "Digital Psychological Intervention System v1.0"),
        },
      ],
    },
  ]

  const renderProfileItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.profileItem, item.danger && styles.dangerItem]}
      onPress={item.action}
      disabled={!item.action && !item.toggle}
    >
      <View style={styles.itemLeft}>
        <MaterialIcons
          name={item.icon}
          size={24}
          color={item.danger ? "#DC2626" : "#6B7280"}
        />
        <Text style={[styles.itemLabel, item.danger && styles.dangerText]}>
          {item.label}
        </Text>
      </View>

      <View style={styles.itemRight}>
        {item.toggle ? (
          <Switch
            value={item.toggle.value}
            onValueChange={item.toggle.onValueChange}
            trackColor={{ false: "#D1D5DB", true: "#4F46E5" }}
            thumbColor={item.toggle.value ? "#FFFFFF" : "#F3F4F6"}
          />
        ) : item.value ? (
          <Text style={styles.itemValue}>{item.value}</Text>
        ) : item.action ? (
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        ) : null}
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <MaterialIcons name="account-circle" size={64} color="#4F46E5" />
          </View>
          <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
          <Text style={styles.userEmail}>{user?.email || "guest@temp.com"}</Text>
          {user?.isGuest && (
            <View style={styles.guestBadge}>
              <Text style={styles.guestBadgeText}>Guest Account</Text>
            </View>
          )}
        </View>

        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) =>
                renderProfileItem(item, itemIndex)
              )}
            </View>
          </View>
        ))}

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#DC2626" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Digital Psychological Intervention System
          </Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1F2937" },
  headerSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  content: { flex: 1 },
  userCard: {
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  avatar: { marginBottom: 16 },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  userEmail: { fontSize: 16, color: "#6B7280", marginBottom: 12 },
  guestBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  guestBadgeText: { fontSize: 12, color: "#92400E", fontWeight: "500" },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionContent: { backgroundColor: "white" },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dangerItem: { backgroundColor: "#FEF2F2" },
  itemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  itemLabel: { fontSize: 16, color: "#374151", marginLeft: 16 },
  dangerText: { color: "#DC2626" },
  itemRight: { alignItems: "flex-end" },
  itemValue: { fontSize: 16, color: "#6B7280" },
  logoutSection: { paddingHorizontal: 24, marginBottom: 32 },
  logoutButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    gap: 8,
  },
  logoutButtonText: { fontSize: 16, color: "#DC2626", fontWeight: "600" },
  footer: { alignItems: "center", paddingVertical: 24, paddingHorizontal: 24 },
  footerText: { fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 4 },
  footerVersion: { fontSize: 12, color: "#9CA3AF" },
})

export default ProfileScreen
