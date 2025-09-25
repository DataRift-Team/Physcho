// // <CHANGE> Adding crisis monitoring system
// const cron = require("node-cron")
// const Screening = require("../models/Screening")
// const ChatSession = require("../models/ChatSession")
// const User = require("../models/User")

// class CrisisMonitor {
//   constructor() {
//     this.startMonitoring()
//   }

//   startMonitoring() {
//     // Check for crisis situations every 15 minutes
//     cron.schedule('*/15 * * * *', async () => {
//       await this.checkCrisisSituations()
//     })

//     console.log('Crisis monitoring system started')
//   }

//   async checkCrisisSituations() {
//     try {
//       const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)

//       // Check for recent crisis screenings
//       const crisisScreenings = await Screening.find({
//         severity: { $in: ['SEVERE', 'CRISIS'] },
//         createdAt: { $gte: fifteenMinutesAgo },
//         adminNotified: false
//       }).populate('userId', 'name email')

//       // Check for recent crisis chat sessions
//       const crisisChatSessions = await ChatSession.find({
//         'messages.severity': 'CRISIS',
//         'messages.timestamp': { $gte: fifteenMinutesAgo }
//       }).populate('userId', 'name email')

//       // Process crisis screenings
//       for (const screening of crisisScreenings) {
//         await this.handleCrisisScreening(screening)
//       }

//       // Process crisis chat sessions
//       for (const session of crisisChatSessions) {
//         await this.handleCrisisChatSession(session)
//       }

//     } catch (error) {
//       console.error('Crisis monitoring error:', error)
//     }
//   }

//   async handleCrisisScreening(screening) {
//     console.log(`CRISIS SCREENING ALERT: User ${screening.userId.name} (${screening.userId.email}) - ${screening.testType} Score: ${screening.totalScore}`)
    
//     // Mark as notified
//     screening.adminNotified = true
//     screening.followUpRequired = true
//     await screening.save()

//     // In production, you would:
//     // 1. Send email/SMS alerts to crisis team
//     // 2. Create urgent tasks in admin system
//     // 3. Log to external monitoring system
//     // 4. Potentially auto-schedule emergency appointments
//   }

//   async handleCrisisChatSession(session) {
//     const crisisMessages = session.messages.filter(m => 
//       m.severity === 'CRISIS' && 
//       m.timestamp >= new Date(Date.now() - 15 * 60 * 1000)
//     )

//     if (crisisMessages.length > 0) {
//       console.log(`CRISIS CHAT ALERT: User ${session.userId.name} (${session.userId.email}) - ${crisisMessages.length} crisis messages`)
      
//       // In production, you would:
//       // 1. Alert crisis intervention team immediately
//       // 2. Potentially initiate automated crisis protocols
//       // 3. Send emergency contact notifications
//     }
//   }

//   // Manual crisis check for immediate situations
//   async checkUserCrisisStatus(userId) {
//     const user = await User.findById(userId)
//     if (!user) return null

//     // Check recent screenings
//     const recentScreenings = await Screening.find({
//       userId,
//       createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
//     }).sort({ createdAt: -1 })

//     // Check recent chat sessions
//     const recentChatSessions = await ChatSession.find({
//       userId,
//       createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
//     }).sort({ createdAt: -1 })

//     const crisisIndicators = {
//       hasCrisisScreening: recentScreenings.some(s => s.severity === 'CRISIS'),
//       hasSevereScreening: recentScreenings.some(s => s.severity === 'SEVERE'),
//       hasCrisisChat: recentChatSessions.some(s => 
//         s.messages.some(m => m.severity === 'CRISIS')
//       ),
//       suicideRisk: recentScreenings.some(s => s.suicideRisk),
//       riskLevel: 'LOW'
//     }

//     // Determine overall risk level
//     if (crisisIndicators.hasC\


// <CHANGE> Adding crisis monitoring system
import cron from "node-cron"
import Screening from "../models/Screening.js"
import ChatSession from "../models/ChatSession.js"
import User from "../models/User.js"

class CrisisMonitor {
  constructor() {
    this.startMonitoring()
  }

  startMonitoring() {
    // Check for crisis situations every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      await this.checkCrisisSituations()
    })

    console.log('Crisis monitoring system started')
  }

  async checkCrisisSituations() {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)

      // Check for recent crisis screenings
      const crisisScreenings = await Screening.find({
        severity: { $in: ['SEVERE', 'CRISIS'] },
        createdAt: { $gte: fifteenMinutesAgo },
        adminNotified: false
      }).populate('userId', 'name email')

      // Check for recent crisis chat sessions
      const crisisChatSessions = await ChatSession.find({
        'messages.severity': 'CRISIS',
        'messages.timestamp': { $gte: fifteenMinutesAgo }
      }).populate('userId', 'name email')

      // Process crisis screenings
      for (const screening of crisisScreenings) {
        await this.handleCrisisScreening(screening)
      }

      // Process crisis chat sessions
      for (const session of crisisChatSessions) {
        await this.handleCrisisChatSession(session)
      }

    } catch (error) {
      console.error('Crisis monitoring error:', error)
    }
  }

  async handleCrisisScreening(screening) {
    console.log(`CRISIS SCREENING ALERT: User ${screening.userId.name} (${screening.userId.email}) - ${screening.testType} Score: ${screening.totalScore}`)
    
    // Mark as notified
    screening.adminNotified = true
    screening.followUpRequired = true
    await screening.save()

    // In production, you would:
    // 1. Send email/SMS alerts to crisis team
    // 2. Create urgent tasks in admin system
    // 3. Log to external monitoring system
    // 4. Potentially auto-schedule emergency appointments
  }

  async handleCrisisChatSession(session) {
    const crisisMessages = session.messages.filter(m => 
      m.severity === 'CRISIS' && 
      m.timestamp >= new Date(Date.now() - 15 * 60 * 1000)
    )

    if (crisisMessages.length > 0) {
      console.log(`CRISIS CHAT ALERT: User ${session.userId.name} (${session.userId.email}) - ${crisisMessages.length} crisis messages`)
      
      // In production, you would:
      // 1. Alert crisis intervention team immediately
      // 2. Potentially initiate automated crisis protocols
      // 3. Send emergency contact notifications
    }
  }

  // Manual crisis check for immediate situations
  async checkUserCrisisStatus(userId) {
    const user = await User.findById(userId)
    if (!user) return null

    // Check recent screenings
    const recentScreenings = await Screening.find({
      userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    }).sort({ createdAt: -1 })

    // Check recent chat sessions
    const recentChatSessions = await ChatSession.find({
      userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 })

    const crisisIndicators = {
      hasCrisisScreening: recentScreenings.some(s => s.severity === 'CRISIS'),
      hasSevereScreening: recentScreenings.some(s => s.severity === 'SEVERE'),
      hasCrisisChat: recentChatSessions.some(s => 
        s.messages.some(m => m.severity === 'CRISIS')
      ),
      suicideRisk: recentScreenings.some(s => s.suicideRisk),
      riskLevel: 'LOW'
    }

    // Determine overall risk level
    if (crisisIndicators.hasCrisisScreening || crisisIndicators.hasCrisisChat || crisisIndicators.suicideRisk) {
      crisisIndicators.riskLevel = 'SEVERE'
    } else if (crisisIndicators.hasSevereScreening) {
      crisisIndicators.riskLevel = 'HIGH'
    }

    return crisisIndicators
  }
}

export default new CrisisMonitor()



