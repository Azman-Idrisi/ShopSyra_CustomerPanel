import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useShop } from "@/context/ShopContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

export default function TabsLayout() {
  const { theme } = useTheme();
  const { cart, wishlist } = useShop();
  const { isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderBadge = (count: number) => {
    if (!count) {
      return null;
    }
    return (
      <View
        style={{
          position: "absolute",
          top: -6,
          right: -10,
          backgroundColor: "#F04966",
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 4,
        }}
      >
        <Text
          style={{ color: "#fff", fontSize: 10, fontFamily: "Poppins-med" }}
        >
          {count > 9 ? "9+" : count}
        </Text>
      </View>
    );
  };

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.text,
          tabBarInactiveTintColor: theme.textMuted,
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopWidth: 0,
            elevation: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: theme.mode === "dark" ? 0.1 : 0.04,
            shadowRadius: 20,
            height: 64 + insets.bottom,
            paddingTop: 8,
            paddingBottom: insets.bottom,
          },
          tabBarLabelStyle: {
            fontFamily: "Poppins-med",
            fontSize: 11,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarIcon: ({ color, size }) => (
              <View>
                <Ionicons name="bag-handle-outline" size={size} color={color} />
                {renderBadge(cartCount)}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            title: "Wishlist",
            tabBarIcon: ({ color, size }) => (
              <View>
                <Ionicons name="heart-outline" size={size} color={color} />
                {renderBadge(wishlist.length)}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
  );
}
