import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useShop } from "@/context/ShopContext";

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_GAP = 12;
const CARD_W = (SCREEN_W - 18 * 2 - CARD_GAP) / 2;

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function WishlistPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { wishlist, getProductById, toggleWishlist, addToCart } = useShop();

  const items = wishlist.map((id) => getProductById(id)).filter(Boolean);

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollWrap}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.heading, { color: theme.text }]}>Wishlist</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {items.length > 0
            ? `Save now, style later. ${items.length} piece${items.length === 1 ? "" : "s"} in your list.`
            : "Your personal fashion edit."}
        </Text>

        {/* Empty state */}
        {items.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: theme.surfaceAlt, borderColor: theme.border },
            ]}
          >
            <View
              style={[styles.emptyIconWrap, { backgroundColor: theme.surface }]}
            >
              <Ionicons
                name="heart-outline"
                size={32}
                color={theme.textMuted}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Your wishlist is empty
            </Text>
            <Text style={[styles.emptyCopy, { color: theme.textMuted }]}>
              Tap the heart icon on products to start{"\n"}building your fashion
              edit.
            </Text>
            <Pressable
              onPress={() => router.navigate("/(tabs)")}
              style={({ pressed }) => [
                styles.emptyBtn,
                {
                  backgroundColor: theme.text,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Text style={[styles.emptyBtnText, { color: theme.pinkish }]}>
                Browse Collection
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.grid}>
            {items.map((product) => (
              <Pressable
                key={product!.id}
                onPress={() =>
                  router.push({
                    pathname: "/product/[id]",
                    params: { id: product!.id },
                  })
                }
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <View>
                  <Image
                    source={{ uri: product!.image }}
                    style={styles.image}
                  />
                  <Pressable
                    onPress={() => toggleWishlist(product!.id)}
                    style={({ pressed }) => [
                      styles.removeBtn,
                      { transform: [{ scale: pressed ? 0.85 : 1 }] },
                    ]}
                  ></Pressable>
                </View>
                <Text style={[styles.brand, { color: theme.textMuted }]}>
                  {product!.brand}
                </Text>
                <Text
                  style={[styles.name, { color: theme.text }]}
                  numberOfLines={2}
                >
                  {product!.name}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: theme.text }]}>
                    {formatPrice(product!.price)}
                  </Text>
                  <Text style={[styles.crossed, { color: theme.textMuted }]}>
                    {formatPrice(product!.originalPrice)}
                  </Text>
                </View>
                <View className="flex-row gap-10 justify-between">
                  <Pressable
                    onPress={() => addToCart(product!.id)}
                    className="p-4 bg-pink-300 rounded-lg"
                    style={({ pressed }) => [
                      styles.quickAdd,
                      {
                        backgroundColor: theme.primarySoft,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      },
                    ]}
                    android_ripple={{ color: "rgba(255,255,255,0.15)" }}
                  >
                    <Text
                      style={[
                        styles.quickAddText,
                        { color: theme.primarySoft },
                      ]}
                    >
                      Add to Bag
                    </Text>
                    <Ionicons
                      name="bag-add-outline"
                      size={20}
                      color={theme.primarySoft}
                    />
                  </Pressable>
                  <Ionicons name="trash-outline" size={20} color="red" />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollWrap: { padding: 18, paddingBottom: 30 },
  heading: { fontFamily: "Poppins-semi", fontSize: 32 },
  subtitle: {
    fontFamily: "Poppins",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },

  emptyCard: {
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    paddingHorizontal: 26,
    paddingVertical: 36,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontFamily: "Poppins-semi", fontSize: 20, marginTop: 10 },
  emptyCopy: {
    fontFamily: "Poppins",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: 20,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 13,
  },
  emptyBtnText: { fontFamily: "Poppins-semi", fontSize: 16, top: 10 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  card: {
    width: CARD_W,
    borderRadius: 18,
    borderWidth: 1,
    padding: 8,
    overflow: "hidden",
  },
  image: { width: "100%", height: 140, borderRadius: 12, marginBottom: 6 },
  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { fontFamily: "Poppins", fontSize: 11 },
  name: {
    fontFamily: "Poppins-med",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 1,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 5,
  },
  price: { fontFamily: "Poppins-semi", fontSize: 13 },
  crossed: {
    fontFamily: "Poppins",
    fontSize: 11,
    textDecorationLine: "line-through",
  },
  quickAdd: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  quickAddText: { fontFamily: "Poppins-med", fontSize: 12 },
});
