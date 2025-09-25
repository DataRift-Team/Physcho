// class ScreeningService {
//   // Enhanced PHQ-9 scoring with detailed interpretation
//   scorePHQ9(responses) {
//     const totalScore = responses.reduce((sum, response) => sum + response.answer, 0)

//     let severity, interpretation, recommendations

//     if (totalScore <= 4) {
//       severity = "NORMAL"
//       interpretation = "Minimal depression symptoms"
//       recommendations = [
//         "Continue maintaining good mental health habits",
//         "Stay connected with friends and family",
//         "Keep up with regular exercise and healthy sleep",
//       ]
//     } else if (totalScore <= 9) {
//       severity = "MILD"
//       interpretation = "Mild depression symptoms"
//       recommendations = [
//         "Consider speaking with a counselor for support",
//         "Practice stress management techniques",
//         "Monitor your mood and symptoms",
//         "Maintain social connections",
//       ]
//     } else if (totalScore <= 14) {
//       severity = "MODERATE"
//       interpretation = "Moderate depression symptoms"
//       recommendations = [
//         "Strongly recommend booking a session with a mental health professional",
//         "Consider therapy or counseling services",
//         "Reach out to trusted friends or family members",
//         "Practice self-care activities daily",
//       ]
//     } else if (totalScore <= 19) {
//       severity = "SEVERE"
//       interpretation = "Moderately severe depression symptoms"
//       recommendations = [
//         "Seek professional mental health treatment immediately",
//         "Consider both therapy and medication evaluation",
//         "Inform a trusted person about your symptoms",
//         "Create a safety plan with professional help",
//       ]
//     } else {
//       severity = "CRISIS"
//       interpretation = "Severe depression symptoms"
//       recommendations = [
//         "Seek immediate professional help",
//         "Contact crisis support services if needed",
//         "Do not delay in getting professional treatment",
//         "Ensure you have support from trusted individuals",
//       ]
//     }

//     // Check for suicide risk (question 9)
//     const suicideRisk = responses[8]?.answer || 0
//     if (suicideRisk >= 1) {
//       severity = severity === "NORMAL" ? "ELEVATED" : severity
//       if (suicideRisk >= 2) {
//         severity = "CRISIS"
//         recommendations.unshift("URGENT: Contact crisis support immediately - Call 988 or text HOME to 741741")
//       }
//     }

//     return {
//       totalScore,
//       severity,
//       interpretation,
//       recommendations,
//       suicideRisk: suicideRisk > 0,
//     }
//   }

//   // Enhanced GAD-7 scoring
//   scoreGAD7(responses) {
//     const totalScore = responses.reduce((sum, response) => sum + response.answer, 0)

//     let severity, interpretation, recommendations

//     if (totalScore <= 4) {
//       severity = "NORMAL"
//       interpretation = "Minimal anxiety symptoms"
//       recommendations = [
//         "Continue current coping strategies",
//         "Practice relaxation techniques regularly",
//         "Maintain healthy lifestyle habits",
//       ]
//     } else if (totalScore <= 9) {
//       severity = "MILD"
//       interpretation = "Mild anxiety symptoms"
//       recommendations = [
//         "Learn and practice anxiety management techniques",
//         "Consider mindfulness or meditation",
//         "Monitor triggers and symptoms",
//         "Consider counseling if symptoms persist",
//       ]
//     } else if (totalScore <= 14) {
//       severity = "MODERATE"
//       interpretation = "Moderate anxiety symptoms"
//       recommendations = [
//         "Seek professional support for anxiety management",
//         "Consider cognitive behavioral therapy (CBT)",
//         "Practice daily stress reduction techniques",
//         "Limit caffeine and alcohol intake",
//       ]
//     } else {
//       severity = "SEVERE"
//       interpretation = "Severe anxiety symptoms"
//       recommendations = [
//         "Seek immediate professional mental health treatment",
//         "Consider both therapy and medication evaluation",
//         "Develop a comprehensive anxiety management plan",
//         "Build a strong support network",
//       ]
//     }

//     return {
//       totalScore,
//       severity,
//       interpretation,
//       recommendations,
//     }
//   }

//   // Enhanced GHQ-12 scoring
//   scoreGHQ12(responses) {
//     // GHQ-12 uses different scoring - some questions are reverse scored
//     const reverseScored = [0, 2, 3, 6, 7, 11] // Questions that are reverse scored

//     let totalScore = 0
//     responses.forEach((response, index) => {
//       if (reverseScored.includes(index)) {
//         // Reverse score: 0,1,2,3 becomes 3,2,1,0
//         totalScore += 3 - response.answer
//       } else {
//         totalScore += response.answer
//       }
//     })

//     let severity, interpretation, recommendations

//     if (totalScore <= 11) {
//       severity = "NORMAL"
//       interpretation = "Good general mental health"
//       recommendations = [
//         "Continue maintaining current mental health practices",
//         "Stay engaged in activities you enjoy",
//         "Keep up social connections",
//       ]
//     } else if (totalScore <= 15) {
//       severity = "MILD"
//       interpretation = "Mild psychological distress"
//       recommendations = [
//         "Pay attention to stress levels and self-care",
//         "Consider stress management techniques",
//         "Monitor your mental health regularly",
//       ]
//     } else if (totalScore <= 20) {
//       severity = "MODERATE"
//       interpretation = "Moderate psychological distress"
//       recommendations = [
//         "Consider speaking with a mental health professional",
//         "Implement stress reduction strategies",
//         "Seek support from friends, family, or counselors",
//       ]
//     } else {
//       severity = "SEVERE"
//       interpretation = "Significant psychological distress"
//       recommendations = [
//         "Seek professional mental health support",
//         "Consider comprehensive mental health evaluation",
//         "Develop coping strategies with professional guidance",
//       ]
//     }

//     return {
//       totalScore,
//       severity,
//       interpretation,
//       recommendations,
//     }
//   }

//   // Main scoring function
//   scoreScreening(testType, responses) {
//     switch (testType) {
//       case "PHQ-9":
//         return this.scorePHQ9(responses)
//       case "GAD-7":
//         return this.scoreGAD7(responses)
//       case "GHQ-12":
//         return this.scoreGHQ12(responses)
//       default:
//         throw new Error("Invalid test type")
//     }
//   }

//   // Generate personalized insights
//   generateInsights(testType, score, severity, userHistory = []) {
//     const insights = []

//     // Historical comparison
//     if (userHistory.length > 0) {
//       const lastScore = userHistory[userHistory.length - 1].totalScore
//       const scoreDiff = score - lastScore

//       if (scoreDiff > 2) {
//         insights.push({
//           type: "trend",
//           message:
//             "Your symptoms have increased since your last screening. Consider reaching out for additional support.",
//           priority: "high",
//         })
//       } else if (scoreDiff < -2) {
//         insights.push({
//           type: "trend",
//           message: "Great news! Your symptoms have decreased since your last screening. Keep up the positive changes.",
//           priority: "positive",
//         })
//       }
//     }

//     // Severity-specific insights
//     if (severity === "CRISIS") {
//       insights.push({
//         type: "urgent",
//         message: "Your responses indicate you may be in crisis. Please seek immediate help.",
//         priority: "critical",
//       })
//     } else if (severity === "SEVERE") {
//       insights.push({
//         type: "concern",
//         message: "Your symptoms are significant and warrant professional attention.",
//         priority: "high",
//       })
//     }

//     // Test-specific insights
//     if (testType === "PHQ-9" && score >= 10) {
//       insights.push({
//         type: "recommendation",
//         message: "Consider keeping a mood diary to track patterns in your symptoms.",
//         priority: "medium",
//       })
//     }

//     if (testType === "GAD-7" && score >= 8) {
//       insights.push({
//         type: "recommendation",
//         message: "Anxiety management techniques like deep breathing and progressive muscle relaxation may be helpful.",
//         priority: "medium",
//       })
//     }

//     return insights
//   }
// }

// module.exports = new ScreeningService()


class ScreeningService {
  // Enhanced PHQ-9 scoring with detailed interpretation
  scorePHQ9(responses) {
    const totalScore = responses.reduce((sum, response) => sum + response.answer, 0);

    let severity, interpretation, recommendations;

    if (totalScore <= 4) {
      severity = "NORMAL";
      interpretation = "Minimal depression symptoms";
      recommendations = [
        "Continue maintaining good mental health habits",
        "Stay connected with friends and family",
        "Keep up with regular exercise and healthy sleep",
      ];
    } else if (totalScore <= 9) {
      severity = "MILD";
      interpretation = "Mild depression symptoms";
      recommendations = [
        "Consider speaking with a counselor for support",
        "Practice stress management techniques",
        "Monitor your mood and symptoms",
        "Maintain social connections",
      ];
    } else if (totalScore <= 14) {
      severity = "MODERATE";
      interpretation = "Moderate depression symptoms";
      recommendations = [
        "Strongly recommend booking a session with a mental health professional",
        "Consider therapy or counseling services",
        "Reach out to trusted friends or family members",
        "Practice self-care activities daily",
      ];
    } else if (totalScore <= 19) {
      severity = "SEVERE";
      interpretation = "Moderately severe depression symptoms";
      recommendations = [
        "Seek professional mental health treatment immediately",
        "Consider both therapy and medication evaluation",
        "Inform a trusted person about your symptoms",
        "Create a safety plan with professional help",
      ];
    } else {
      severity = "CRISIS";
      interpretation = "Severe depression symptoms";
      recommendations = [
        "Seek immediate professional help",
        "Contact crisis support services if needed",
        "Do not delay in getting professional treatment",
        "Ensure you have support from trusted individuals",
      ];
    }

    const suicideRisk = responses[8]?.answer || 0;
    if (suicideRisk >= 1) {
      severity = severity === "NORMAL" ? "ELEVATED" : severity;
      if (suicideRisk >= 2) {
        severity = "CRISIS";
        recommendations.unshift(
          "URGENT: Contact crisis support immediately - Call 988 or text HOME to 741741"
        );
      }
    }

    return {
      totalScore,
      severity,
      interpretation,
      recommendations,
      suicideRisk: suicideRisk > 0,
    };
  }

  // Enhanced GAD-7 scoring
  scoreGAD7(responses) {
    const totalScore = responses.reduce((sum, response) => sum + response.answer, 0);

    let severity, interpretation, recommendations;

    if (totalScore <= 4) {
      severity = "NORMAL";
      interpretation = "Minimal anxiety symptoms";
      recommendations = [
        "Continue current coping strategies",
        "Practice relaxation techniques regularly",
        "Maintain healthy lifestyle habits",
      ];
    } else if (totalScore <= 9) {
      severity = "MILD";
      interpretation = "Mild anxiety symptoms";
      recommendations = [
        "Learn and practice anxiety management techniques",
        "Consider mindfulness or meditation",
        "Monitor triggers and symptoms",
        "Consider counseling if symptoms persist",
      ];
    } else if (totalScore <= 14) {
      severity = "MODERATE";
      interpretation = "Moderate anxiety symptoms";
      recommendations = [
        "Seek professional support for anxiety management",
        "Consider cognitive behavioral therapy (CBT)",
        "Practice daily stress reduction techniques",
        "Limit caffeine and alcohol intake",
      ];
    } else {
      severity = "SEVERE";
      interpretation = "Severe anxiety symptoms";
      recommendations = [
        "Seek immediate professional mental health treatment",
        "Consider both therapy and medication evaluation",
        "Develop a comprehensive anxiety management plan",
        "Build a strong support network",
      ];
    }

    return { totalScore, severity, interpretation, recommendations };
  }

  // Enhanced GHQ-12 scoring
  scoreGHQ12(responses) {
    const reverseScored = [0, 2, 3, 6, 7, 11];
    let totalScore = 0;

    responses.forEach((response, index) => {
      totalScore += reverseScored.includes(index) ? 3 - response.answer : response.answer;
    });

    let severity, interpretation, recommendations;

    if (totalScore <= 11) {
      severity = "NORMAL";
      interpretation = "Good general mental health";
      recommendations = [
        "Continue maintaining current mental health practices",
        "Stay engaged in activities you enjoy",
        "Keep up social connections",
      ];
    } else if (totalScore <= 15) {
      severity = "MILD";
      interpretation = "Mild psychological distress";
      recommendations = [
        "Pay attention to stress levels and self-care",
        "Consider stress management techniques",
        "Monitor your mental health regularly",
      ];
    } else if (totalScore <= 20) {
      severity = "MODERATE";
      interpretation = "Moderate psychological distress";
      recommendations = [
        "Consider speaking with a mental health professional",
        "Implement stress reduction strategies",
        "Seek support from friends, family, or counselors",
      ];
    } else {
      severity = "SEVERE";
      interpretation = "Significant psychological distress";
      recommendations = [
        "Seek professional mental health support",
        "Consider comprehensive mental health evaluation",
        "Develop coping strategies with professional guidance",
      ];
    }

    return { totalScore, severity, interpretation, recommendations };
  }

  // Main scoring function
  scoreScreening(testType, responses) {
    switch (testType) {
      case "PHQ-9":
        return this.scorePHQ9(responses);
      case "GAD-7":
        return this.scoreGAD7(responses);
      case "GHQ-12":
        return this.scoreGHQ12(responses);
      default:
        throw new Error("Invalid test type");
    }
  }

  // Generate personalized insights
  generateInsights(testType, score, severity, userHistory = []) {
    const insights = [];

    if (userHistory.length > 0) {
      const lastScore = userHistory[userHistory.length - 1].totalScore;
      const scoreDiff = score - lastScore;

      if (scoreDiff > 2) {
        insights.push({
          type: "trend",
          message:
            "Your symptoms have increased since your last screening. Consider reaching out for additional support.",
          priority: "high",
        });
      } else if (scoreDiff < -2) {
        insights.push({
          type: "trend",
          message:
            "Great news! Your symptoms have decreased since your last screening. Keep up the positive changes.",
          priority: "positive",
        });
      }
    }

    if (severity === "CRISIS") {
      insights.push({
        type: "urgent",
        message: "Your responses indicate you may be in crisis. Please seek immediate help.",
        priority: "critical",
      });
    } else if (severity === "SEVERE") {
      insights.push({
        type: "concern",
        message: "Your symptoms are significant and warrant professional attention.",
        priority: "high",
      });
    }

    if (testType === "PHQ-9" && score >= 10) {
      insights.push({
        type: "recommendation",
        message: "Consider keeping a mood diary to track patterns in your symptoms.",
        priority: "medium",
      });
    }

    if (testType === "GAD-7" && score >= 8) {
      insights.push({
        type: "recommendation",
        message:
          "Anxiety management techniques like deep breathing and progressive muscle relaxation may be helpful.",
        priority: "medium",
      });
    }

    return insights;
  }
}

export default new ScreeningService();
