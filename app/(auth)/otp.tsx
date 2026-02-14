import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { api } from "../../api/client";
import { useAuth } from "@/context/AuthContext";

const { height, width } = Dimensions.get("window");

const OtpScreen = () => {
  const router = useRouter();
  const { setSession } = useAuth();
  const params = useLocalSearchParams();
  const phoneNumber = params.phone as string;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace - go to previous input
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (canResend) {
      setTimer(30);
      setCanResend(false);
      setOtp(["", "", "", ""]);
      // Add your resend OTP logic here
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter the 4-digit code.");
      return;
    }
    if (!phoneNumber) {
      Alert.alert("Missing number", "Phone number is not available.");
      return;
    }
    try {
      setIsVerifying(true);
      const response = await api.post("/otp/verify-otp", {
        mobile: `+91${phoneNumber}`,
        otp: otpValue,
      });

      if (response?.data?.success) {
        const token =
          response?.data?.token ??
          response?.data?.accessToken ??
          response?.data?.jwt ??
          response?.data?.authToken;
        if (!token) {
          Alert.alert(
            "Session Error",
            "Token missing in response. Please try again.",
          );
          return;
        }
        await setSession(token);
        router.replace("/(tabs)");
        console.log("Token set:", token);
        return;
      }

      Alert.alert(
        "OTP Failed",
        response?.data?.message ?? "Verification failed.",
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Unable to verify OTP. Please try again.";
      Alert.alert("OTP Error", message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <TouchableWithoutFeedback>
      <View className="flex-1 bg-[#1800ad]">
        {/* Image Section */}
        <View className="items-center justify-center">
          <Image
            source={require("../../assets/images/firstImage.png")}
            style={{ width: width * 1.85, height: height * 0.55 }}
            resizeMode="contain"
          />
        </View>

        {/* Content Section */}
        <View className="flex-1 px-8">
          <View className="items-center mb-6">
            <Text className="text-white text-lg font-poppins text-center">
              We've sent a verification code to
            </Text>
            <Text className="text-white text-xl font-poppins-semi text-center mt-1">
              +91 {phoneNumber}
            </Text>
          </View>

          {/* OTP Input Section */}
          <View>
            {/* OTP Boxes */}
            <View style={styles.otpContainer}>
              {[0, 1, 2, 3].map((index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref!;
                  }}
                  style={[
                    styles.otpBox,
                    otp[index] ? styles.otpBoxFilled : null,
                  ]}
                  value={otp[index]}
                  onChangeText={(value) =>
                    handleOtpChange(value.replace(/[^0-9]/g, ""), index)
                  }
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Resend Timer */}
            <TouchableOpacity
              onPress={handleResend}
              disabled={!canResend}
              className="items-center mt-6"
            >
              <Text
                style={[
                  styles.resendText,
                  canResend ? styles.resendActive : null,
                ]}
              >
                {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
              </Text>
            </TouchableOpacity>

            {/* Verify Button */}
            <TouchableOpacity
              className="bg-white py-4 mt-8 rounded-2xl shadow-lg"
              onPress={handleVerify}
              disabled={isVerifying}
              activeOpacity={0.8}
            >
              <Text className="text-[#1800ad] font-poppins text-center text-lg font-semibold">
                {isVerifying ? "Verifying..." : "Verify"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 24,
    fontFamily: "Poppins-semi",
    color: "#FFFFFF",
    padding: 0,
  },
  otpBoxFilled: {
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  resendText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 20,
  },
  resendActive: {
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
});
