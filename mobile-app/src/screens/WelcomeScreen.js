
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const { width } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
  const { guestLogin } = useAuth();

  const handleGuestLogin = async () => {
    const result = await guestLogin();
    if (!result.success) {
      alert(result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#4F46E5", "#7C3AED"]} style={styles.gradient}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Digital Psychological Intervention System
            </Text>
            <Text style={styles.subtitle}>
              Your mental health companion for support, screening, and wellness
            </Text>
          </View>

          {/* Illustration */}
          <View style={styles.illustration}>
            <Image source={logo} style={styles.image} resizeMode="contain" />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.primaryButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={styles.secondaryButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
  },
  illustration: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#4F46E5",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  secondaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  guestButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    alignItems: "center",
  },
  guestButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default WelcomeScreen;
