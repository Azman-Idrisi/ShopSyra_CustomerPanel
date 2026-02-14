import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useShop } from "@/context/ShopContext";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartPage() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const { cart, getProductById, removeFromCart, updateQuantity, cartSubtotal } = useShop();
  const shipping = cartSubtotal > 7000 ? 0 : 299;
  const total = cartSubtotal + shipping;

  return (
    <SafeAreaView edges={["top"]} style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollWrap} showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: theme.text }]}>Your Bag</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {cart.length} item{cart.length === 1 ? "" : "s"} curated for checkout
        </Text>

        {/* Empty state */}
        {cart.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
            <View style={[styles.emptyIconWrap, { backgroundColor: theme.surface }]}>
              <Ionicons name="bag-handle-outline" size={32} color={theme.textMuted} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Your bag is empty</Text>
            <Text style={[styles.emptyCopy, { color: theme.textMuted }]}>
              Looks like you haven't added anything yet.{"\n"}Explore our collection and find something you love.
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
              <Text style={[styles.emptyBtnText, { color: theme.pinkish }]}>Start Shopping</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Cart items */}
        {cart.map((line) => {
          const product = getProductById(line.productId);
          if (!product) {
            return null;
          }
          return (
            <Pressable
              key={line.productId}
              onPress={() => router.push({ pathname: "/product/[id]", params: { id: product.id } })}
              style={({ pressed }) => [
                styles.itemCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  transform: [{ scale: pressed ? 0.99 : 1 }],
                },
              ]}
            >
              <Image source={{ uri: product.image }} style={styles.itemImage} />
              <View style={styles.itemBody}>
                <Text style={[styles.itemBrand, { color: theme.textMuted }]}>{product.brand}</Text>
                <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={[styles.itemPrice, { color: theme.text }]}>{formatPrice(product.price)}</Text>
                <View style={styles.actionsRow}>
                  <View style={[styles.qtyWrap, { backgroundColor: theme.surfaceAlt }]}>
                    <Pressable
                      onPress={() => updateQuantity(product.id, line.quantity - 1)}
                      android_ripple={{ color: "rgba(0,0,0,0.08)", borderless: true }}
                      style={styles.qtyBtn}
                    >
                      <Ionicons name="remove" size={16} color={theme.text} />
                    </Pressable>
                    <Text style={[styles.qtyText, { color: theme.text }]}>{line.quantity}</Text>
                    <Pressable
                      onPress={() => updateQuantity(product.id, line.quantity + 1)}
                      android_ripple={{ color: "rgba(0,0,0,0.08)", borderless: true }}
                      style={styles.qtyBtn}
                    >
                      <Ionicons name="add" size={16} color={theme.text} />
                    </Pressable>
                  </View>
                  <Pressable onPress={() => removeFromCart(product.id)} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={18} color="#F04966" />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          );
        })}

        {/* Order summary - only show when cart has items */}
        {cart.length > 0 ? (
          <View style={[styles.summary, { backgroundColor: theme.surfaceAlt }]}>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>Order Summary</Text>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.textMuted }]}>Subtotal</Text>
              <Text style={[styles.value, { color: theme.text }]}>{formatPrice(cartSubtotal)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.textMuted }]}>Shipping</Text>
              <Text style={[styles.value, { color: shipping === 0 ? "#2ECC71" : theme.text }]}>
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </Text>
            </View>
            {shipping > 0 ? (
              <Text style={[styles.shippingHint, { color: theme.textMuted }]}>
                Free shipping on orders above {formatPrice(7000)}
              </Text>
            ) : null}
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: theme.text }]}>{formatPrice(total)}</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.checkoutButton,
                {
                  backgroundColor: theme.text,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              android_ripple={{ color: "rgba(255,255,255,0.12)" }}
            >
              <Text style={[styles.checkoutText, { color: theme.pinkish }]}>Proceed to Checkout</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollWrap: { padding: 18, paddingBottom: 30 },
  heading: { fontFamily: "Poppins-semi", fontSize: 32 },
  subtitle: { fontFamily: "Poppins", fontSize: 13, marginTop: 4, marginBottom: 16 },

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
  emptyBtnText: { fontFamily: "Poppins-semi", fontSize: 16 , top : 10 },

  itemCard: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    gap: 12,
  },
  itemImage: { width: 98, height: 116, borderRadius: 14 },
  itemBody: { flex: 1, justifyContent: "space-between", paddingVertical: 2 },
  itemBrand: { fontFamily: "Poppins", fontSize: 11 },
  itemName: { fontFamily: "Poppins-med", fontSize: 14, lineHeight: 19 },
  itemPrice: { fontFamily: "Poppins-semi", fontSize: 15 },
  actionsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  qtyWrap: { flexDirection: "row", alignItems: "center", borderRadius: 999, paddingHorizontal: 4 },
  qtyBtn: { width: 30, height: 30, alignItems: "center", justifyContent: "center", borderRadius: 15 },
  qtyText: { fontFamily: "Poppins-med", fontSize: 13, minWidth: 24, textAlign: "center" },
  deleteBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 16 },

  summary: { borderRadius: 22, padding: 18, marginTop: 4 },
  summaryTitle: { fontFamily: "Poppins-semi", fontSize: 19, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  label: { fontFamily: "Poppins", fontSize: 13 },
  value: { fontFamily: "Poppins-med", fontSize: 13 },
  shippingHint: { fontFamily: "Poppins", fontSize: 11, marginBottom: 4, marginTop: -4 },
  divider: { height: 1, backgroundColor: "rgba(139, 148, 168, 0.3)", marginVertical: 8 },
  totalLabel: { fontFamily: "Poppins-semi", fontSize: 15 },
  totalValue: { fontFamily: "Poppins-semi", fontSize: 17 },
  checkoutButton: { marginTop: 14, borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  checkoutText: { fontFamily: "Poppins-semi", fontSize: 15 },
});
