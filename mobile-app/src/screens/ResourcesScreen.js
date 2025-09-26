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
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons" // ✅ FIXED import
import axios from "axios"

const ResourcesScreen = () => {
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = "https://physcho.onrender.com/api"

  const resourceTypes = [
    { id: "all", name: "All Types", icon: "apps" },
    { id: "audio", name: "Audio", icon: "headphones" },
    { id: "video", name: "Videos", icon: "play-circle-filled" },
    { id: "pdf", name: "Guides", icon: "picture-as-pdf" },
    { id: "article", name: "Articles", icon: "article" },
  ]

  useEffect(() => {
    loadResources()
    loadCategories()
  }, [])

  useEffect(() => {
    filterResources()
  }, [resources, selectedCategory, selectedType])

  const loadResources = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resources`)
      setResources(response.data)
    } catch (error) {
      console.error("Failed to load resources:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resources/categories`)
      setCategories(["all", ...response.data])
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }

  const filterResources = () => {
    let filtered = resources

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (resource) => resource.category === selectedCategory
      )
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((resource) => resource.type === selectedType)
    }

    setFilteredResources(filtered)
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case "audio":
        return "headphones"
      case "video":
        return "play-circle-filled"
      case "pdf":
        return "picture-as-pdf"
      case "article":
        return "article"
      default:
        return "description"
    }
  }

  const getResourceColor = (type) => {
    switch (type) {
      case "audio":
        return "#7C3AED"
      case "video":
        return "#DC2626"
      case "pdf":
        return "#059669"
      case "article":
        return "#F59E0B"
      default:
        return "#6B7280"
    }
  }

  const getCategoryDisplayName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  const renderResourceItem = ({ item }) => (
    <TouchableOpacity style={styles.resourceCard}>
      <View
        style={[
          styles.resourceIcon,
          { backgroundColor: getResourceColor(item.type) },
        ]}
      >
        <MaterialIcons name={getResourceIcon(item.type)} size={24} color="white" />
      </View>

      <View style={styles.resourceContent}>
        <Text style={styles.resourceTitle}>{item.title}</Text>
        <Text style={styles.resourceDescription}>{item.description}</Text>

        <View style={styles.resourceMeta}>
          <View style={styles.resourceCategory}>
            <Text style={styles.resourceCategoryText}>
              {getCategoryDisplayName(item.category)}
            </Text>
          </View>

          {item.duration && (
            <View style={styles.resourceDuration}>
              <MaterialIcons name="access-time" size={14} color="#6B7280" />
              <Text style={styles.resourceDurationText}>{item.duration}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.openButton}>
        <Text style={styles.openButtonText}>OPEN</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading resources...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resources Hub</Text>
        <Text style={styles.headerSubtitle}>
          Access helpful content for your mental wellness journey
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        {/* 🔹 Type Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Type</Text>
            <View style={styles.filterOptions}>
              {resourceTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.filterChip,
                    selectedType === type.id && styles.selectedFilterChip,
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <MaterialIcons
                    name={type.icon}
                    size={16}
                    color={selectedType === type.id ? "white" : "#6B7280"}
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedType === type.id && styles.selectedFilterChipText,
                    ]}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* 🔹 Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          <View style={styles.categoryOptions}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.selectedCategoryChip,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category &&
                      styles.selectedCategoryChipText,
                  ]}
                >
                  {getCategoryDisplayName(category)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 🔹 Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredResources.length} resource
          {filteredResources.length !== 1 ? "s" : ""} found
        </Text>
      </View>

      <FlatList
        data={filteredResources}
        renderItem={renderResourceItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.resourcesList}
        contentContainerStyle={styles.resourcesContent}
        showsVerticalScrollIndicator={false}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  filtersContainer: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterScroll: {
    paddingHorizontal: 24,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
  },
  selectedFilterChip: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  filterChipText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  selectedFilterChipText: {
    color: "white",
  },
 categoryScroll: {
  paddingLeft: 24,
  paddingRight: 60, // extra space so last chip isn’t cut off
},
categoryOptions: {
  flexDirection: "row",
  gap: 7,
  paddingRight: 50, // optional, adds breathing room
},

  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  selectedCategoryChip: {
    backgroundColor: "#EEF2FF",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  selectedCategoryChipText: {
    color: "#4F46E5",
  },
  resultsHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  resourcesList: {
    flex: 1,
  },
  resourcesContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  resourceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  resourceMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  resourceCategory: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resourceCategoryText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  resourceDuration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  resourceDurationText: {
    fontSize: 12,
    color: "#6B7280",
  },
  openButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  openButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
})

export default ResourcesScreen
