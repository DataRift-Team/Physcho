import { useState, useRef, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Alert } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import axios from "axios"

const AIChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "ai",
      message: "Hello! I'm here to listen and support you. How are you feeling today?",
      timestamp: new Date(),
      severity: "NORMAL",
    },
  ])
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(false)
  const flatListRef = useRef(null)

  const API_BASE_URL = "https://physcho.onrender.com/api"

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd?.({ animated: true })
    }
  }, [messages])

  const sendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      message: inputText.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setLoading(true)

    try {
      const response = await axios.post(`${API_BASE_URL}/ai/chat`, {
        message: inputText.trim(),
      })

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        message: response.data.response,
        timestamp: new Date(),
        severity: response.data.severity,
      }

      setMessages((prev) => [...prev, aiMessage])

      if (response.data.severity === "CRISIS") {
        Alert.alert(
          "Crisis Support",
          "I'm concerned about your wellbeing. Would you like me to connect you with immediate crisis support resources?",
          [
            { text: "Not now", style: "cancel" },
            { text: "Yes, please", onPress: () => showCrisisResources() },
          ],
        )
      }
    } catch (error) {
      console.error("Chat error:", error)
      Alert.alert("Error", "Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const showCrisisResources = () => {
    Alert.alert(
      "Crisis Resources",
      "Emergency: 911\nNational Suicide Prevention Lifeline: 988\nCrisis Text Line: Text HOME to 741741",
      [{ text: "OK" }],
    )
  }

  const renderMessage = ({ item }) => {
    const isUser = item.sender === "user"

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>{item.message}</Text>
          {item.severity === "CRISIS" && (
            <View style={styles.severityBadge}>
              <MaterialIcons name="warning" size={16} color="#DC2626" />
              <Text style={styles.severityText}>Crisis Alert</Text>
            </View>
          )}
          {item.severity === "ELEVATED" && (
            <View style={styles.severityBadge}>
              <MaterialIcons name="info" size={16} color="#F59E0B" />
              <Text style={styles.severityText}>Elevated Concern</Text>
            </View>
          )}
        </View>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Support Chat</Text>
        <Text style={styles.headerSubtitle}>Confidential and supportive</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd?.({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your feelings..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || loading}
        >
          <MaterialIcons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>AI is typing...</Text>
        </View>
      )}
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
  messagesList: { flex: 1 },
  messagesContent: { padding: 16 },
  messageContainer: { maxWidth: "80%", marginBottom: 16 },
  userMessage: { alignSelf: "flex-end", alignItems: "flex-end" },
  aiMessage: { alignSelf: "flex-start", alignItems: "flex-start" },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  userBubble: { backgroundColor: "#4F46E5" },
  aiBubble: { backgroundColor: "white", borderWidth: 1, borderColor: "#E5E7EB" },
  messageText: { fontSize: 16, lineHeight: 22 },
  userText: { color: "white" },
  aiText: { color: "#1F2937" },
  timestamp: { fontSize: 12, color: "#9CA3AF" },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  severityText: { fontSize: 12, color: "#DC2626", fontWeight: "500" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#4F46E5",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  sendButtonDisabled: { opacity: 0.5 },
  loadingContainer: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "white" },
  loadingText: { fontSize: 14, color: "#6B7280", fontStyle: "italic" },
})

export default AIChatScreen
