"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons" // ✅ fixed import
import axios from "axios"

const ForumScreen = () => {
  const [posts, setPosts] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [replyContent, setReplyContent] = useState("")
  const [isAnonymousPost, setIsAnonymousPost] = useState(true)
  const [isAnonymousReply, setIsAnonymousReply] = useState(true)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const API_BASE_URL = "https://physcho.onrender.com/api"
    // Platform.OS === "android"
    //   ? "http://10.0.2.2:5000/api"
    //   : "http://localhost:5000/api"

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setRefreshing(true)
      const response = await axios.get(`${API_BASE_URL}/forum/posts`)
      setPosts(response.data)
    } catch (error) {
      console.error("Failed to load posts:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const createPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      await axios.post(`${API_BASE_URL}/forum/posts`, {
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        isAnonymous: isAnonymousPost,
      })

      Alert.alert(
        "Success",
        "Your post has been submitted for review and will appear once approved."
      )
      setShowCreateModal(false)
      resetCreateForm()
      loadPosts()
    } catch (error) {
      Alert.alert("Error", "Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  const addReply = async () => {
    if (!replyContent.trim()) {
      Alert.alert("Error", "Please enter your reply")
      return
    }

    setLoading(true)
    try {
      await axios.post(
        `${API_BASE_URL}/forum/posts/${selectedPost._id}/reply`,
        {
          content: replyContent.trim(),
          isAnonymous: isAnonymousReply,
        }
      )

      Alert.alert("Success", "Your reply has been added")
      setShowReplyModal(false)
      setReplyContent("")
      loadPosts()
    } catch (error) {
      Alert.alert("Error", "Failed to add reply")
    } finally {
      setLoading(false)
    }
  }

  const resetCreateForm = () => {
    setNewPostTitle("")
    setNewPostContent("")
    setIsAnonymousPost(true)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postAuthor}>
          <MaterialIcons name="account-circle" size={24} color="#6B7280" />
          <Text style={styles.authorName}>
            {item.userId && !item.isAnonymous ? item.userId.name : "Anonymous"}
          </Text>
        </View>
        <Text style={styles.postDate}>{formatDate(item.createdAt)}</Text>
      </View>

      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>

      <View style={styles.postFooter}>
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => {
            setSelectedPost(item)
            setShowReplyModal(true)
          }}
        >
          <MaterialIcons name="reply" size={16} color="#4F46E5" />
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>

        {item.replies && item.replies.length > 0 && (
          <Text style={styles.replyCount}>
            {item.replies.length} repl{item.replies.length === 1 ? "y" : "ies"}
          </Text>
        )}
      </View>

      {item.replies && item.replies.length > 0 && (
        <View style={styles.repliesSection}>
          {item.replies.map((reply, index) => (
            <View key={reply._id || index} style={styles.replyCard}>
              <View style={styles.replyHeader}>
                <MaterialIcons name="account-circle" size={20} color="#9CA3AF" />
                <Text style={styles.replyAuthor}>
                  {reply.userId && !reply.isAnonymous
                    ? reply.userId.name
                    : "Anonymous"}
                </Text>
                <Text style={styles.replyDate}>
                  {formatDate(reply.createdAt)}
                </Text>
              </View>
              <Text style={styles.replyContent}>{reply.content}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Peer Forum</Text>
        <Text style={styles.headerSubtitle}>
          Connect with others in a safe, supportive community
        </Text>
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <MaterialIcons name="add" size={20} color="white" />
          <Text style={styles.createButtonText}>Create Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        style={styles.postsList}
        contentContainerStyle={styles.postsContent}
        refreshing={refreshing}
        onRefresh={loadPosts}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="forum" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No posts yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Be the first to start a conversation
            </Text>
          </View>
        }
      />

      {/* Create Post Modal */}
      <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowCreateModal(false)
                resetCreateForm()
              }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TouchableOpacity
              onPress={createPost}
              disabled={loading || !newPostTitle.trim() || !newPostContent.trim()}
            >
              <Text
                style={[
                  styles.modalSaveText,
                  (!newPostTitle.trim() || !newPostContent.trim() || loading) &&
                    styles.modalSaveTextDisabled,
                ]}
              >
                {loading ? "Posting..." : "Post"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Title</Text>
              <TextInput
                style={styles.titleInput}
                value={newPostTitle}
                onChangeText={setNewPostTitle}
                placeholder="What would you like to discuss?"
                maxLength={100}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Content</Text>
              <TextInput
                style={styles.contentInput}
                value={newPostContent}
                onChangeText={setNewPostContent}
                placeholder="Share your thoughts, experiences, or questions..."
                multiline
                numberOfLines={8}
                maxLength={1000}
              />
            </View>

            <View style={styles.anonymousSection}>
              <TouchableOpacity
                style={styles.anonymousToggle}
                onPress={() => setIsAnonymousPost(!isAnonymousPost)}
              >
                <MaterialIcons
                  name={isAnonymousPost ? "check-box" : "check-box-outline-blank"}
                  size={24}
                  color="#4F46E5"
                />
                <Text style={styles.anonymousText}>Post anonymously</Text>
              </TouchableOpacity>
              <Text style={styles.anonymousHint}>
                Your identity will be hidden from other users
              </Text>
            </View>

            <View style={styles.guidelinesSection}>
              <Text style={styles.guidelinesTitle}>Community Guidelines</Text>
              <Text style={styles.guidelinesText}>
                • Be respectful and supportive{"\n"}• No personal attacks or harassment{"\n"}• Keep discussions relevant to mental health{"\n"}• Posts are reviewed before appearing
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Reply Modal */}
      <Modal visible={showReplyModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowReplyModal(false)
                setReplyContent("")
              }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Reply</Text>
            <TouchableOpacity
              onPress={addReply}
              disabled={loading || !replyContent.trim()}
            >
              <Text
                style={[
                  styles.modalSaveText,
                  (!replyContent.trim() || loading) && styles.modalSaveTextDisabled,
                ]}
              >
                {loading ? "Replying..." : "Reply"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedPost && (
              <View style={styles.originalPostSection}>
                <Text style={styles.originalPostLabel}>Replying to:</Text>
                <Text style={styles.originalPostTitle}>{selectedPost.title}</Text>
                <Text style={styles.originalPostContent} numberOfLines={3}>
                  {selectedPost.content}
                </Text>
              </View>
            )}

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Your Reply</Text>
              <TextInput
                style={styles.contentInput}
                value={replyContent}
                onChangeText={setReplyContent}
                placeholder="Share your thoughts or support..."
                multiline
                numberOfLines={6}
                maxLength={500}
              />
            </View>

            <View style={styles.anonymousSection}>
              <TouchableOpacity
                style={styles.anonymousToggle}
                onPress={() => setIsAnonymousReply(!isAnonymousReply)}
              >
                <MaterialIcons
                  name={isAnonymousReply ? "check-box" : "check-box-outline-blank"}
                  size={24}
                  color="#4F46E5"
                />
                <Text style={styles.anonymousText}>Reply anonymously</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  actionBar: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  createButton: {
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  postsList: { flex: 1 },
  postsContent: { paddingHorizontal: 24, paddingBottom: 24 },
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyStateText: { fontSize: 18, color: "#6B7280", marginTop: 16, marginBottom: 8 },
  emptyStateSubtext: { fontSize: 14, color: "#9CA3AF" },
  postCard: {
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
  postHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  postAuthor: { flexDirection: "row", alignItems: "center", gap: 8 },
  authorName: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  postDate: { fontSize: 12, color: "#9CA3AF" },
  postTitle: { fontSize: 18, fontWeight: "bold", color: "#1F2937", marginBottom: 8 },
  postContent: { fontSize: 16, color: "#374151", lineHeight: 24, marginBottom: 16 },
  postFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  replyButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  replyButtonText: { fontSize: 14, color: "#4F46E5", fontWeight: "500" },
  replyCount: { fontSize: 12, color: "#9CA3AF" },
  repliesSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  replyCard: { backgroundColor: "#F9FAFB", borderRadius: 12, padding: 16, marginBottom: 12 },
  replyHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  replyAuthor: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  replyDate: { fontSize: 10, color: "#9CA3AF", marginLeft: "auto" },
  replyContent: { fontSize: 14, color: "#374151", lineHeight: 20 },
  modalContainer: { flex: 1, backgroundColor: "white" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalCancelText: { fontSize: 16, color: "#6B7280" },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1F2937" },
  modalSaveText: { fontSize: 16, color: "#4F46E5", fontWeight: "600" },
  modalSaveTextDisabled: { opacity: 0.5 },
  modalContent: { flex: 1, padding: 24 },
  formSection: { marginBottom: 24 },
  formLabel: { fontSize: 16, fontWeight: "600", color: "#1F2937", marginBottom: 8 },
  titleInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  contentInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
})

export default ForumScreen
