// const axios = require("axios")

// class GeminiService {
//   constructor() {
//     this.apiKey = process.env.GEMINI_API_KEY
//     this.baseURL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
//   }

//   async generateResponse(message, context = {}) {
//     if (!this.apiKey) {
//       // Fallback to mock responses if no API key
//       return this.getMockResponse(message)
//     }

//     try {
//       const prompt = this.buildPrompt(message, context)

//       const response = await axios.post(`${this.baseURL}?key=${this.apiKey}`, {
//         contents: [
//           {
//             parts: [
//               {
//                 text: prompt,
//               },
//             ],
//           },
//         ],
//         generationConfig: {
//           temperature: 0.7,
//           topK: 40,
//           topP: 0.95,
//           maxOutputTokens: 1024,
//         },
//         safetySettings: [
//           {
//             category: "HARM_CATEGORY_HARASSMENT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE",
//           },
//           {
//             category: "HARM_CATEGORY_HATE_SPEECH",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE",
//           },
//           {
//             category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE",
//           },
//           {
//             category: "HARM_CATEGORY_DANGEROUS_CONTENT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE",
//           },
//         ],
//       })

//       const aiResponse = response.data.candidates[0].content.parts[0].text
//       const severity = this.analyzeSeverity(message, aiResponse)

//       return {
//         response: aiResponse,
//         severity: severity,
//       }
//     } catch (error) {
//       console.error("Gemini API error:", error)
//       return this.getMockResponse(message)
//     }
//   }

//   buildPrompt(message, context) {
//     return `You are a compassionate AI mental health support assistant. Your role is to:
// 1. Listen empathetically to users' concerns
// 2. Provide supportive, non-judgmental responses
// 3. Offer practical coping strategies when appropriate
// 4. Recognize crisis situations and recommend professional help
// 5. Never provide medical diagnoses or replace professional therapy

// Context: This is a digital psychological intervention system for students.

// User message: "${message}"

// Please respond with empathy and support. If the user expresses thoughts of self-harm or suicide, prioritize their safety and strongly encourage immediate professional help.

// Response:`
//   }

//   analyzeSeverity(userMessage, aiResponse) {
//     const lowerMessage = userMessage.toLowerCase()

//     // Crisis indicators
//     const crisisKeywords = [
//       "suicide",
//       "kill myself",
//       "end it all",
//       "want to die",
//       "better off dead",
//       "no point living",
//       "end my life",
//       "hurt myself",
//       "self harm",
//     ]

//     // Elevated concern indicators
//     const elevatedKeywords = [
//       "depressed",
//       "depression",
//       "anxious",
//       "anxiety",
//       "panic",
//       "overwhelmed",
//       "hopeless",
//       "worthless",
//       "can't cope",
//       "breaking down",
//       "falling apart",
//     ]

//     // Check for crisis indicators
//     if (crisisKeywords.some((keyword) => lowerMessage.includes(keyword))) {
//       return "CRISIS"
//     }

//     // Check for elevated concern
//     if (elevatedKeywords.some((keyword) => lowerMessage.includes(keyword))) {
//       return "ELEVATED"
//     }

//     // Check AI response for concern indicators
//     const aiLower = aiResponse.toLowerCase()
//     if (aiLower.includes("crisis") || aiLower.includes("emergency") || aiLower.includes("immediate help")) {
//       return "CRISIS"
//     }

//     if (aiLower.includes("professional help") || aiLower.includes("counselor") || aiLower.includes("therapist")) {
//       return "ELEVATED"
//     }

//     return "NORMAL"
//   }

//   getMockResponse(message) {
//     const lowerMessage = message.toLowerCase()

//     let response =
//       "I hear you, and I want you to know that your feelings are valid. Can you tell me more about what's been on your mind lately?"
//     let severity = "NORMAL"

//     if (
//       lowerMessage.includes("suicide") ||
//       lowerMessage.includes("kill myself") ||
//       lowerMessage.includes("end it all")
//     ) {
//       response =
//         "I'm very concerned about what you're sharing with me. Your life has value, and there are people who want to help you through this difficult time. Please reach out to a crisis counselor immediately - you can call 988 (Suicide & Crisis Lifeline) or text HOME to 741741. Would you like me to help you connect with immediate support?"
//       severity = "CRISIS"
//     } else if (
//       lowerMessage.includes("depressed") ||
//       lowerMessage.includes("anxious") ||
//       lowerMessage.includes("panic")
//     ) {
//       response =
//         "It sounds like you're going through a really tough time right now. These feelings of depression and anxiety can be overwhelming, but please know that you're not alone in this. Have you been able to talk to anyone about how you're feeling? Sometimes speaking with a counselor can provide valuable support and coping strategies."
//       severity = "ELEVATED"
//     } else if (lowerMessage.includes("stressed") || lowerMessage.includes("overwhelmed")) {
//       response =
//         "Feeling stressed and overwhelmed is something many people experience, especially students. It's important to acknowledge these feelings rather than dismiss them. Let's think about some ways to help you manage this stress. Are there any specific situations or thoughts that seem to trigger these feelings?"
//       severity = "ELEVATED"
//     } else if (lowerMessage.includes("lonely") || lowerMessage.includes("isolated")) {
//       response =
//         "Loneliness can be really painful, and I'm glad you're reaching out. Feeling isolated doesn't mean you're alone - there are people who care about you and want to support you. Have you considered joining any groups or activities where you might connect with others who share similar interests?"
//       severity = "ELEVATED"
//     } else if (lowerMessage.includes("sleep") || lowerMessage.includes("tired")) {
//       response =
//         "Sleep issues can really affect how we feel and cope with daily challenges. Poor sleep often goes hand-in-hand with stress and anxiety. Have you noticed any patterns with your sleep? Sometimes establishing a consistent bedtime routine can help improve sleep quality."
//       severity = "NORMAL"
//     } else if (lowerMessage.includes("exam") || lowerMessage.includes("study") || lowerMessage.includes("grades")) {
//       response =
//         "Academic pressure can be really intense, and it's understandable that you're feeling stressed about your studies. Remember that your worth isn't defined by your grades. Let's think about some strategies that might help you manage academic stress while taking care of your mental health."
//       severity = "NORMAL"
//     }

//     return { response, severity }
//   }
// }

// module.exports = new GeminiService()


import axios from "axios";

const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end it all",
  "want to die",
  "better off dead",
  "no point living",
  "end my life",
  "hurt myself",
  "self harm",
];

const ELEVATED_KEYWORDS = [
  "depressed",
  "depression",
  "anxious",
  "anxiety",
  "panic",
  "overwhelmed",
  "hopeless",
  "worthless",
  "can't cope",
  "breaking down",
  "falling apart",
];

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  }

  async generateResponse(message, context = {}) {
    if (!this.apiKey) {
      return this.getMockResponse(message);
    }

    try {
      const prompt = this.buildPrompt(message, context);

      const response = await axios.post(`${this.baseURL}?key=${this.apiKey}`, {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      });

      const aiResponse =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm here to listen. Can you tell me more?";
      const severity = this.analyzeSeverity(message, aiResponse);

      return { response: aiResponse, severity };
    } catch (error) {
      console.error("Gemini API error:", error);
      return this.getMockResponse(message);
    }
  }

  buildPrompt(message, context) {
    return `You are a compassionate AI mental health support assistant. Your role is to:
1. Listen empathetically to users' concerns
2. Provide supportive, non-judgmental responses
3. Offer practical coping strategies when appropriate
4. Recognize crisis situations and recommend professional help
5. Never provide medical diagnoses or replace professional therapy

Context: This is a digital psychological intervention system for students.

User message: "${message}"

Please respond with empathy and support. If the user expresses thoughts of self-harm or suicide, prioritize their safety and strongly encourage immediate professional help.

Response:`;
  }

  analyzeSeverity(userMessage, aiResponse) {
    const lowerMessage = userMessage.toLowerCase();

    if (CRISIS_KEYWORDS.some((keyword) => lowerMessage.includes(keyword))) return "CRISIS";
    if (ELEVATED_KEYWORDS.some((keyword) => lowerMessage.includes(keyword))) return "ELEVATED";

    const aiLower = aiResponse.toLowerCase();
    if (aiLower.includes("crisis") || aiLower.includes("emergency") || aiLower.includes("immediate help")) return "CRISIS";
    if (aiLower.includes("professional help") || aiLower.includes("counselor") || aiLower.includes("therapist")) return "ELEVATED";

    return "NORMAL";
  }

  getMockResponse(message) {
    const lowerMessage = message.toLowerCase();

    let response =
      "I hear you, and I want you to know that your feelings are valid. Can you tell me more about what's been on your mind lately?";
    let severity = "NORMAL";

    if (CRISIS_KEYWORDS.some((k) => lowerMessage.includes(k))) {
      response =
        "I'm very concerned about what you're sharing with me. Your life has value, and there are people who want to help you through this difficult time. Please reach out to a crisis counselor immediately - you can call 988 (Suicide & Crisis Lifeline) or text HOME to 741741. Would you like me to help you connect with immediate support?";
      severity = "CRISIS";
    } else if (ELEVATED_KEYWORDS.some((k) => lowerMessage.includes(k))) {
      response =
        "It sounds like you're going through a really tough time right now. These feelings of depression and anxiety can be overwhelming, but please know that you're not alone in this. Have you been able to talk to anyone about how you're feeling? Sometimes speaking with a counselor can provide valuable support and coping strategies.";
      severity = "ELEVATED";
    }

    return { response, severity };
  }
}

export default new GeminiService();
