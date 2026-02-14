import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { useFonts } from "expo-font";
import { ThemeProvider } from "@/context/ThemeContext";
import { ShopProvider } from "@/context/ShopContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { useEffect, useRef, useCallback } from "react";

const { width } = Dimensions.get("window");

function SplashScreen() {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacity1 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity2 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Text fade in after logo
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 500,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // Subtle pulse on logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Loading dots animation
    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );

    animateDot(dotOpacity1, 0).start();
    animateDot(dotOpacity2, 150).start();
    animateDot(dotOpacity3, 300).start();
  }, []);

  return (
    <View style={splash.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0F17" />

      {/* Subtle glow behind logo */}
      <Animated.View style={[splash.glow, { opacity: pulseAnim }]} />

      {/* Logo */}
      <Animated.Image
        source={require("../assets/images/splash-icon.png")}
        style={[
          splash.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
        resizeMode="contain"
      />

      {/* Brand name */}
      <Animated.Text style={[splash.brandName, { opacity: textOpacity }]}>
        ShopSyra
      </Animated.Text>

      {/* Loading dots */}
      <Animated.View style={[splash.dotsContainer, { opacity: textOpacity }]}>
        <Animated.View style={[splash.dot, { opacity: dotOpacity1 }]} />
        <Animated.View style={[splash.dot, { opacity: dotOpacity2 }]} />
        <Animated.View style={[splash.dot, { opacity: dotOpacity3 }]} />
      </Animated.View>
    </View>
  );
}

const splash = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0F17",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#ca3bd1",
    shadowColor: "#ca3bd1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 60,
    elevation: 20,
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: 20,
  },
  brandName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F4F5FA",
    letterSpacing: 1.5,
    marginBottom: 40,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ca3bd1",
  },
});

function NavigationHandler({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();
  const rawSegments = useSegments();
  const segments = rawSegments as string[];
  const hasNavigated = useRef(false);

  const handleNavigation = useCallback(() => {
    if (isAuthLoading) return;

    const inTabsGroup = segments[0] === "(tabs)";
    const inProductPage = segments.includes("product");

    if (isAuthenticated && !inTabsGroup && !inProductPage) {
      router.replace("/(tabs)");
      hasNavigated.current = true;
    } else if (!isAuthenticated && (inTabsGroup || inProductPage)) {
      router.replace("/");
      hasNavigated.current = true;
    }
  }, [isAuthLoading, isAuthenticated, segments, router]);

  useEffect(() => {
    handleNavigation();
  }, [handleNavigation]);

  if (isAuthLoading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins_reg.ttf"),
    "Poppins-med": require("../assets/fonts/Poppins_mid.ttf"),
    "Poppins-semi": require("../assets/fonts/Poppins_semi.ttf"),
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#0D0F17" }} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <ShopProvider>
            <NavigationHandler>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(auth)/otp"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="product/[id]"
                  options={{ headerShown: false }}
                />
              </Stack>
            </NavigationHandler>
          </ShopProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
