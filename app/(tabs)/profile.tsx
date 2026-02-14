import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

const profileSections = [
  { icon: "receipt-outline", label: "Orders & Returns", value: "4 active" },
  { icon: "location-outline", label: "Saved Addresses", value: "2 locations" },
  { icon: "card-outline", label: "Payments", value: "UPI, Cards" },
  {
    icon: "notifications-outline",
    label: "Alerts & Promotions",
    value: "Enabled",
  },
] as const;

export default function ProfilePage() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const { cart, wishlist } = useShop();
  const { logout } = useAuth();

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollWrap}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { backgroundColor: theme.surface }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>ID</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: theme.text }]}>Idris Khan</Text>
            <Text style={[styles.email, { color: theme.textMuted }]}>
              idris@shopsyra.com
            </Text>
          </View>
          <Pressable style={[styles.editButton, { borderColor: theme.border }]}>
            <Ionicons name="create-outline" size={16} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.stat, { backgroundColor: theme.surfaceAlt }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {wishlist.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>
              Wishlist
            </Text>
          </View>
          <View style={[styles.stat, { backgroundColor: theme.surfaceAlt }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>
              In Bag
            </Text>
          </View>
          <View style={[styles.stat, { backgroundColor: theme.surfaceAlt }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>VIP</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>
              Tier
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.menuWrap,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          {profileSections.map((item, idx) => (
            <View
              key={item.label}
              style={[
                styles.menuRow,
                idx !== profileSections.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.border,
                },
              ]}
            >
              <View style={styles.menuLabelWrap}>
                <Ionicons name={item.icon} size={18} color={theme.text} />
                <Text style={[styles.menuLabel, { color: theme.text }]}>
                  {item.label}
                </Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={[styles.menuValue, { color: theme.textMuted }]}>
                  {item.value}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.textMuted}
                />
              </View>
            </View>
          ))}
        </View>

        <Pressable
          onPress={async () => {
            await logout();
            router.replace("/");
          }}
          style={({ pressed }) => [
            styles.logoutButton,
            {
              borderColor: "#F04966",
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollWrap: { padding: 18, paddingBottom: 120, gap: 14 },
  hero: {
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5855FF",
  },
  avatarText: { color: "#fff", fontFamily: "Poppins-semi", fontSize: 18 },
  name: { fontFamily: "Poppins-semi", fontSize: 20 },
  email: { fontFamily: "Poppins", fontSize: 12 },
  editButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  statsRow: { flexDirection: "row", gap: 10 },
  stat: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  statValue: { fontFamily: "Poppins-semi", fontSize: 18 },
  statLabel: { fontFamily: "Poppins", fontSize: 11, marginTop: 2 },
  glassPanel: { borderRadius: 20, borderWidth: 1, padding: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  toggleTitle: { fontFamily: "Poppins-semi", fontSize: 15 },
  toggleCopy: {
    fontFamily: "Poppins",
    fontSize: 12,
    marginTop: 3,
    maxWidth: 240,
  },
  menuWrap: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  menuLabelWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  menuLabel: { fontFamily: "Poppins-med", fontSize: 13 },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  menuValue: { fontFamily: "Poppins", fontSize: 12 },
  logoutButton: {
    borderWidth: 1.4,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 4,
  },
  logoutText: { color: "#F04966", fontFamily: "Poppins-semi", fontSize: 14 },
});
