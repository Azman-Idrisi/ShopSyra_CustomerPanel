import { useRouter } from "expo-router";
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard, TouchableWithoutFeedback, Animated, Alert } from "react-native";
import { useState, useEffect, useRef } from "react";
import { api } from "../api/client";
const { height, width } = Dimensions.get("window");


export default function Index() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneError, setShowPhoneError] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const isValidPhoneNumber = /^\d{10}$/.test(phoneNumber);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      "keyboardWillShow",
      (e) => {
        Animated.timing(translateY, {
          toValue: -e.endCoordinates.height + 80,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    // For Android (uses keyboardDidShow/Hide)
    const keyboardDidShow = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        Animated.timing(translateY, {
          toValue: -e.endCoordinates.height + 80,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardDidHide = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);


  const handleSendOtp = async () => {
    try {
      setIsSendingOtp(true);
      const response = await api.post("/otp/send-otp", {
        mobile: `+91${phoneNumber}`,
      });
      return response.data;
    }
    catch (error: any) {
      console.error("Error sending OTP:", error);
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to send OTP. Please try again.";
      Alert.alert("OTP Error", message);
      throw error;
    } finally {
      setIsSendingOtp(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-[#1800ad]">
        {/* Static content - won't move */}
        <View className="items-center justify-center" style={{ height: height * 0.55 }}>
          <Image
            source={require("../assets/images/firstImage.png")}
            style={{ width: width * 1.85, height: height * 0.55 }}
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 px-8 pb-12">
          <View>
            <Text className="text-4xl text-white text-center mb-4 font-poppins-med">
              Welcome to ShopSyra
            </Text>
          </View>

          {/* Only this section moves with keyboard */}
          <Animated.View
            className="flex-col gap-3 mt-auto"
            style={{ transform: [{ translateY }] }}
          >
            <View style={styles.container}>
              <Text style={styles.countryCode}>+91</Text>
              <View style={styles.divider} />
              <TextInput
                value={phoneNumber}
                onChangeText={(value) => {
                  const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
                  setPhoneNumber(digitsOnly);
                  if (showPhoneError && /^\d{10}$/.test(digitsOnly)) {
                    setShowPhoneError(false);
                  }
                }}
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={10}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setPhoneNumber("")}>
                <Text style={styles.clearText}>✕</Text>
              </TouchableOpacity>
            </View>

            {showPhoneError && (
              <Text className="text-red-200 font-poppins">
                Enter a 10-digit mobile number
              </Text>
            )}

            <TouchableOpacity
              className={`py-3 mb-6 rounded-2xl ${
                isValidPhoneNumber ? "bg-white" : "bg-gray-200"
              }`}
              disabled={!isValidPhoneNumber || isSendingOtp}
              onPress={async () => {
                if (!isValidPhoneNumber) {
                  setShowPhoneError(true);
                  return;
                }
                try {
                  const data = await handleSendOtp();
                  if (data?.success) {
                    router.push({ pathname: "/(auth)/otp", params: { phone: phoneNumber } });
                  }
                } catch {
                  // Error is already shown via Alert in handleSendOtp
                }
              }}
              activeOpacity={0.8}
            >
              <Text
                className={`text-center text-lg font-semibold ${
                  isValidPhoneNumber ? "text-[#1800ad]" : "text-gray-500"
                }`}
              >
                {isSendingOtp ? "Sending OTP..." : "Get Started"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 14,
    height: 54,
    justifyContent: "center",
    paddingVertical: 0,
  },

  countryCode: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: "#9CA3AF",
    paddingVertical: 0,
  },

  divider: {
    width: 1,
    height: 22,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 10,
  },

  input: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Poppins",
    color: "#9CA3AF",
    paddingVertical: 0,
  },

  clearText: {
    color: "#9CA3AF",
    fontSize: 20,
    fontFamily: "Poppins",
  },
});
