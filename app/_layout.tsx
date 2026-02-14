import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { useFonts } from "expo-font";
import { ThemeProvider } from "@/context/ThemeContext";
import { ShopProvider } from "@/context/ShopContext";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins": require("../assets/fonts/Poppins_reg.ttf"),
    "Poppins-med": require("../assets/fonts/Poppins_mid.ttf"),
    "Poppins-semi": require("../assets/fonts/Poppins_semi.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }


  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <ShopProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/otp" options={{ headerShown: false }} />
              <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
            </Stack>
          </ShopProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
