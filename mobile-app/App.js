"use client"

import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MaterialIcons } from "@expo/vector-icons" // ✅ fixed import

// Import screens
import WelcomeScreen from "./src/screens/WelcomeScreen"
import LoginScreen from "./src/screens/LoginScreen"
import SignUpScreen from "./src/screens/SignUpScreen"
import HomeScreen from "./src/screens/HomeScreen"
import AIChatScreen from "./src/screens/AIChatScreen"
import ScreeningScreen from "./src/screens/ScreeningScreen"
import BookingsScreen from "./src/screens/BookingsScreen"
import ResourcesScreen from "./src/screens/ResourcesScreen"
import ForumScreen from "./src/screens/ForumScreen"
import ProfileScreen from "./src/screens/ProfileScreen"

// Import context
import { AuthProvider, useAuth } from "./src/context/AuthContext"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") iconName = "home"
          else if (route.name === "AI Chat") iconName = "chat"
          else if (route.name === "Screening") iconName = "assessment"
          else if (route.name === "Bookings") iconName = "event"
          else if (route.name === "Resources") iconName = "library-books"
          else if (route.name === "Forum") iconName = "forum"
          else if (route.name === "Profile") iconName = "person"

          return <MaterialIcons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AI Chat" component={AIChatScreen} />
      <Tab.Screen name="Screening" component={ScreeningScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      <Tab.Screen name="Forum" component={ForumScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

const AppNavigator = () => {
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <NavigationContainer>
      {/* You can enable authentication logic here if needed */}
    
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
      
      {/* <TabNavigator /> */}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  )
}
