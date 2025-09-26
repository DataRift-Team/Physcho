"use client"

import { useState, useEffect } from "react"
import { MessageSquare, User, Clock, Check, X, Eye } from "lucide-react"
import api from "../config/api"

const Forum = () => {
  const [pendingPosts, setPendingPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadPendingPosts()
  }, [])

  const loadPendingPosts = async () => {
    try {
  const response = await api.get("/forum/pending")
      setPendingPosts(response.data)
    } catch (error) {
      console.error("Failed to load pending posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const updatePostStatus = async (postId, status) => {
    try {
  await api.patch(`/forum/posts/${postId}/status`, { status })
      setPendingPosts(pendingPosts.filter((post) => post._id !== postId))
      setShowModal(false)
      setSelectedPost(null)
    } catch (error) {
      console.error("Failed to update post status:", error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const viewPost = (post) => {
    setSelectedPost(post)
    setShowModal(true)
  }

  if (loading) {
    return <div className="loading">Loading forum posts...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Forum Moderation</h1>
        <p className="text-gray-600">Review and moderate community posts</p>
      </div>

      {/* Pending Posts */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Pending Posts ({pendingPosts.length})</h2>
        </div>

        {pendingPosts.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No posts pending review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPosts.map((post) => (
              <div key={post._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <User size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {post.isAnonymous ? "Anonymous" : post.userId?.name || "Unknown User"}
                      </span>
                      <Clock size={14} className="text-gray-400 ml-4 mr-1" />
                      <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>

                    <div className="flex items-center space-x-3">
                      <button onClick={() => viewPost(post)} className="btn btn-secondary btn-sm">
                        <Eye size={14} className="mr-1" />
                        View Full
                      </button>
                      <button onClick={() => updatePostStatus(post._id, "approved")} className="btn btn-success btn-sm">
                        <Check size={14} className="mr-1" />
                        Approve
                      </button>
                      <button onClick={() => updatePostStatus(post._id, "rejected")} className="btn btn-danger btn-sm">
                        <X size={14} className="mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Review Post</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <User size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    {selectedPost.isAnonymous ? "Anonymous" : selectedPost.userId?.name || "Unknown User"}
                  </span>
                  <span className="text-sm text-gray-500 ml-4">{formatDate(selectedPost.createdAt)}</span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedPost.title}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedPost.content}</p>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button onClick={() => updatePostStatus(selectedPost._id, "rejected")} className="btn btn-danger">
                    <X size={16} className="mr-2" />
                    Reject
                  </button>
                  <button onClick={() => updatePostStatus(selectedPost._id, "approved")} className="btn btn-success">
                    <Check size={16} className="mr-2" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Forum
