import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useShop } from "@/context/ShopContext";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { products, getProductById, addToCart, wishlist, toggleWishlist } =
    useShop();
  const product = getProductById(id);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

  const related = useMemo(() => {
    if (!product) {
      return [];
    }
    return products
      .filter((item) => item.id !== product.id)
      .sort(
        (a, b) =>
          Number(b.category === product.category) -
          Number(a.category === product.category),
      )
      .slice(0, 3);
  }, [product, products]);

  if (!product) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.emptyWrap}>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            Product not found.
          </Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backText, { color: theme.text }]}>
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollWrap}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.iconBtn, { backgroundColor: theme.surface }]}
          >
            <Ionicons name="arrow-back" size={18} color={theme.text} />
          </Pressable>
          <Pressable
            onPress={() => toggleWishlist(product.id)}
            style={[styles.iconBtn, { backgroundColor: theme.surface }]}
          >
            <Ionicons
              name={isWishlisted ? "heart" : "heart-outline"}
              size={18}
              color={isWishlisted ? "#F04966" : theme.text}
            />
          </Pressable>
        </View>

        <View
          style={[
            styles.imageWrap,
            { borderColor: theme.border, backgroundColor: theme.surface },
          ]}
        >
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>

        <View style={styles.infoWrap}>
          <Text style={[styles.brand, { color: theme.textMuted }]}>
            {product.brand}
          </Text>
          <Text style={[styles.name, { color: theme.text }]}>
            {product.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.text }]}>
              {formatPrice(product.price)}
            </Text>
            <Text style={[styles.originalPrice, { color: theme.textMuted }]}>
              {formatPrice(product.originalPrice)}
            </Text>
            <Text style={styles.offTag}>
              {Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100,
              )}
              % OFF
            </Text>
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFB300" />
            <Text style={[styles.rating, { color: theme.text }]}>
              {product.rating} ({product.reviews} reviews)
            </Text>
          </View>
          <Text style={[styles.description, { color: theme.textMuted }]}>
            {product.description}
          </Text>
        </View>

        <View style={styles.selector}>
          <Text style={[styles.selectorTitle, { color: theme.text }]}>
            Select Size
          </Text>
          <View style={styles.sizeRow}>
            {product.sizes.map((s) => {
              const selected = size === s;
              return (
                <View
                  key={s}
                  style={{
                    borderWidth: 2,
                    borderColor: selected ? theme.pinkish : "#888",
                    backgroundColor: selected ? theme.surfaceAlt : theme.surface,
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <Pressable
                    onPress={() => setSize(s)}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 14,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-semi",
                        fontSize: 16,
                        color: selected ? theme.pinkish : theme.text,
                      }}
                    >
                      {s}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.relatedWrap}>
          <Text style={[styles.selectorTitle, { color: theme.text }]}>
            You May Also Like
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedRow}
          >
            {related.map((item) => (
              <Pressable
                key={item!.id}
                onPress={() =>
                  router.push({
                    pathname: "/product/[id]",
                    params: { id: item!.id },
                  })
                }
                style={[styles.relatedCard, { backgroundColor: theme.surface }]}
              >
                <Image
                  source={{ uri: item!.image }}
                  style={styles.relatedImage}
                />
                <Text
                  style={[styles.relatedName, { color: theme.text }]}
                  numberOfLines={2}
                >
                  {item!.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.surface, borderTopColor: theme.border, paddingBottom: 18 + insets.bottom },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            {
              backgroundColor: theme.text,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
          onPress={() => addToCart(product.id)}
          android_ripple={{ color: "rgba(255,255,255,0.15)" }}
        >
          <Text style={[styles.primaryBtnText, { color: theme.pinkish }]}>
            Add to Bag
            {size || color
              ? ` • ${size ?? ""}${size && color ? " / " : ""}${color ? "Selected" : ""}`
              : ""}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollWrap: { paddingHorizontal: 18, paddingBottom: 110 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrap: { borderRadius: 28, overflow: "hidden", borderWidth: 1 },
  image: { width: "100%", height: 470 },
  infoWrap: { marginTop: 16 },
  brand: { fontFamily: "Poppins", fontSize: 12 },
  name: {
    fontFamily: "Poppins-semi",
    fontSize: 31,
    lineHeight: 38,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
  price: { fontFamily: "Poppins-semi", fontSize: 22 },
  originalPrice: {
    fontFamily: "Poppins",
    fontSize: 14,
    textDecorationLine: "line-through",
  },
  offTag: {
    backgroundColor: "rgba(240,73,102,0.14)",
    color: "#F04966",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontFamily: "Poppins-med",
    fontSize: 11,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  rating: { fontFamily: "Poppins-med", fontSize: 13 },
  description: {
    fontFamily: "Poppins",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
  },
  selector: { marginTop: 16 },
  selectorTitle: { fontFamily: "Poppins-semi", fontSize: 17, marginBottom: 10 },
  sizeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  sizeChip: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sizeText: { fontFamily: "Poppins-med", fontSize: 14 },
  colorRow: { flexDirection: "row", gap: 10 },
  colorChip: { width: 30, height: 30, borderRadius: 15, borderWidth: 2 },
  relatedWrap: { marginTop: 20 },
  relatedRow: { gap: 12, paddingRight: 18 },
  relatedCard: { width: 146, borderRadius: 14, padding: 8 },
  relatedImage: { width: "100%", height: 126, borderRadius: 10 },
  relatedName: {
    fontFamily: "Poppins-med",
    fontSize: 12,
    marginTop: 7,
    lineHeight: 17,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
  },
  primaryBtn: { borderRadius: 15, paddingVertical: 14, alignItems: "center" },
  primaryBtnText: { fontFamily: "Poppins-semi", fontSize: 15 },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: { fontFamily: "Poppins-semi", fontSize: 18 },
  backButton: { paddingHorizontal: 14, paddingVertical: 10 },
  backText: { fontFamily: "Poppins-med", fontSize: 14 },
});
