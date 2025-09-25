"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from "react-native"
import axios from "axios"

const ScreeningScreen = () => {
  const [selectedTest, setSelectedTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [responses, setResponses] = useState([])
  const [currentStep, setCurrentStep] = useState("select") // 'select', 'questions', 'result'
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const API_BASE_URL = "http://localhost:5000/api"

  const testTypes = [
    {
      id: "PHQ-9",
      name: "PHQ-9",
      title: "Depression Screening",
      description: "Patient Health Questionnaire for depression symptoms",
      duration: "5-7 minutes",
      color: "#DC2626",
    },
    {
      id: "GAD-7",
      name: "GAD-7",
      title: "Anxiety Screening",
      description: "Generalized Anxiety Disorder assessment",
      duration: "3-5 minutes",
      color: "#F59E0B",
    },
    {
      id: "GHQ-12",
      name: "GHQ-12",
      title: "General Health Screening",
      description: "General Health Questionnaire for overall mental health",
      duration: "5-8 minutes",
      color: "#059669",
    },
  ]

  const responseOptions = [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 },
  ]

  const loadQuestions = async (testType) => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/screening/questions/${testType}`)
      setQuestions(response.data.questions)
      setResponses(new Array(response.data.questions.length).fill(null))
      setCurrentStep("questions")
    } catch (error) {
      Alert.alert("Error", "Failed to load questions")
    } finally {
      setLoading(false)
    }
  }

  const handleTestSelect = (test) => {
    setSelectedTest(test)
    loadQuestions(test.id)
  }

  const handleResponseSelect = (questionIndex, value) => {
    const newResponses = [...responses]
    newResponses[questionIndex] = value
    setResponses(newResponses)
  }

  const submitScreening = async () => {
    const formattedResponses = questions.map((question, index) => ({
      question,
      answer: responses[index],
    }))

    try {
      setLoading(true)
      const response = await axios.post(`${API_BASE_URL}/screening/submit`, {
        testType: selectedTest.id,
        responses: formattedResponses,
      })

      setResult(response.data)
      setCurrentStep("result")
    } catch (error) {
      Alert.alert("Error", "Failed to submit screening")
    } finally {
      setLoading(false)
    }
  }

  const resetScreening = () => {
    setSelectedTest(null)
    setQuestions([])
    setResponses([])
    setCurrentStep("select")
    setResult(null)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "NORMAL":
        return "#059669"
      case "MILD":
        return "#F59E0B"
      case "MODERATE":
        return "#DC2626"
      case "SEVERE":
        return "#7C2D12"
      case "CRISIS":
        return "#991B1B"
      default:
        return "#6B7280"
    }
  }

  if (currentStep === "select") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mental Health Check</Text>
          <Text style={styles.headerSubtitle}>Choose a screening tool to assess your mental health</Text>
        </View>

        <ScrollView style={styles.content}>
          {testTypes.map((test) => (
            <TouchableOpacity key={test.id} style={styles.testCard} onPress={() => handleTestSelect(test)}>
              <View style={[styles.testIcon, { backgroundColor: test.color }]}>
                <Text style={styles.testIconText}>{test.name}</Text>
              </View>
              <View style={styles.testInfo}>
                <Text style={styles.testTitle}>{test.title}</Text>
                <Text style={styles.testDescription}>{test.description}</Text>
                <Text style={styles.testDuration}>Duration: {test.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              These screenings are for informational purposes only and do not replace professional medical advice.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  if (currentStep === "questions") {
    const allAnswered = responses.every((response) => response !== null)

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={resetScreening} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedTest.title}</Text>
          <Text style={styles.headerSubtitle}>Answer based on how you've felt over the past 2 weeks</Text>
        </View>

        <ScrollView style={styles.content}>
          {questions.map((question, questionIndex) => (
            <View key={questionIndex} style={styles.questionCard}>
              <Text style={styles.questionText}>
                {questionIndex + 1}. {question}
              </Text>

              <View style={styles.responseOptions}>
                {responseOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.responseOption,
                      responses[questionIndex] === option.value && styles.selectedResponse,
                    ]}
                    onPress={() => handleResponseSelect(questionIndex, option.value)}
                  >
                    <Text
                      style={[
                        styles.responseText,
                        responses[questionIndex] === option.value && styles.selectedResponseText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.submitButton, !allAnswered && styles.submitButtonDisabled]}
            onPress={submitScreening}
            disabled={!allAnswered || loading}
          >
            <Text style={styles.submitButtonText}>{loading ? "Submitting..." : "Submit Screening"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }

  if (currentStep === "result") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Screening Results</Text>
          <Text style={styles.headerSubtitle}>{selectedTest.title}</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.resultCard}>
            <View style={styles.scoreSection}>
              <Text style={styles.scoreLabel}>Your Score</Text>
              <Text style={styles.scoreValue}>{result.totalScore}</Text>
            </View>

            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(result.severity) }]}>
              <Text style={styles.severityText}>{result.severity}</Text>
            </View>

            <Text style={styles.resultMessage}>{result.message}</Text>

            {(result.severity === "SEVERE" || result.severity === "CRISIS") && (
              <View style={styles.urgentSection}>
                <Text style={styles.urgentTitle}>Immediate Support Available</Text>
                <Text style={styles.urgentText}>
                  Your responses indicate you may benefit from immediate professional support.
                </Text>
                <TouchableOpacity style={styles.urgentButton}>
                  <Text style={styles.urgentButtonText}>Get Help Now</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.recommendationsSection}>
              <Text style={styles.recommendationsTitle}>Recommended Next Steps</Text>
              <Text style={styles.recommendationText}>• Consider booking a session with a counselor</Text>
              <Text style={styles.recommendationText}>• Explore our resources hub for coping strategies</Text>
              <Text style={styles.recommendationText}>• Use our AI chat for ongoing support</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.newScreeningButton} onPress={resetScreening}>
            <Text style={styles.newScreeningButtonText}>Take Another Screening</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }
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
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: "#4F46E5",
    fontWeight: "500",
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
  content: {
    flex: 1,
    padding: 24,
  },
  testCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  testIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  testIconText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  testDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  testDuration: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  disclaimer: {
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  disclaimerText: {
    fontSize: 14,
    color: "#7F1D1D",
    textAlign: "center",
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionText: {
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 16,
    lineHeight: 24,
  },
  responseOptions: {
    gap: 8,
  },
  responseOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  selectedResponse: {
    backgroundColor: "#EEF2FF",
    borderColor: "#4F46E5",
  },
  responseText: {
    fontSize: 14,
    color: "#374151",
  },
  selectedResponseText: {
    color: "#4F46E5",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1F2937",
  },
  severityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  severityText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  resultMessage: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  urgentSection: {
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  urgentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#DC2626",
    marginBottom: 8,
  },
  urgentText: {
    fontSize: 14,
    color: "#7F1D1D",
    marginBottom: 12,
  },
  urgentButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  urgentButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  recommendationsSection: {
    gap: 8,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: "#374151",
  },
  newScreeningButton: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#4F46E5",
  },
  newScreeningButtonText: {
    color: "#4F46E5",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ScreeningScreen
