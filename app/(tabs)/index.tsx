import { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/data/catalog";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ─── Full-screen product card ─── */
function ProductSlide({
  item,
  cardHeight,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
}: {
  item: Product;
  cardHeight: number;
  isWishlisted: boolean;
  onAddToCart: (id: string) => void;
  onToggleWishlist: (id: string) => void;
  onViewDetails: (id: string) => void;
}) {
  const { theme } = useTheme();
  const discount = Math.round(
    ((item.originalPrice - item.price) / item.originalPrice) * 100,
  );

  return (
    <View style={[styles.slide, { height: cardHeight }]}>
      {/* Background image */}
      <Image source={{ uri: item.image }} style={styles.bgImage} />

      {/* Dark overlay gradient from bottom */}
      <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.85)"]}
          locations={[0.3, 0.55, 1]}
          style={styles.bottomGradient}
        />

      {/* "NEW" badge */}
      {item.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>NEW</Text>
        </View>
      )}

      {/* Right-side action buttons */}
      <View style={styles.sideActions}>
        <Pressable
          onPress={() => onToggleWishlist(item.id)}
          style={({ pressed }) => [
            styles.actionBtn,
            { transform: [{ scale: pressed ? 0.88 : 1 }] },
          ]}
        >
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={29}
            color={isWishlisted ? "#F04966" : "#fff"}
          />
        </Pressable>

        <Pressable
          onPress={() => onAddToCart(item.id)}
          style={({ pressed }) => [
            styles.actionBtn,
            { transform: [{ scale: pressed ? 0.88 : 1 }] },
          ]}
        >
        <Ionicons name="bag-add-outline" size={28} color="#fff" />
        </Pressable>

        <Pressable
          onPress={() => onViewDetails(item.id)}
          style={({ pressed }) => [
            styles.actionBtn,
            { transform: [{ scale: pressed ? 0.88 : 1 }] },
          ]}
        >
          <Ionicons name="expand-outline" size={25} color="#fff" />
        </Pressable>
      </View>

      {/* Bottom product info */}
      <View style={styles.bottomInfo}>
        {/* Brand */}
        <Text style={styles.brand}>{item.brand}</Text>

        {/* Name */}
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>

        {/* Price row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          <Text style={styles.originalPrice}>
            {formatPrice(item.originalPrice)}
          </Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        </View>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#FFB300" />
          <Text style={styles.ratingText}>
            {item.rating} ({item.reviews})
          </Text>
          <View style={styles.dot} />
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
    </View>
  );
}

/* ─── Home Screen ─── */
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const {
    products,
    isLoadingProducts,
    productsError,
    wishlist,
    addToCart,
    toggleWishlist,
  } = useShop();

  const scrollY = useRef(new Animated.Value(0)).current;

  // Account for tab bar height (~64) + bottom inset
  const TAB_BAR_H = 64 + insets.bottom;
  const CARD_H = SCREEN_H - TAB_BAR_H;

  const handleViewDetails = useCallback(
    (id: string) => {
      router.push({ pathname: "/product/[id]", params: { id } });
    },
    [router],
  );

  /* Loading state */
  if (isLoadingProducts) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.text} />
        <Text
          style={[
            styles.loadingText,
            { color: theme.textMuted, fontFamily: "Poppins" },
          ]}
        >
          Curating your feed...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: "#000" }]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Error banner */}
      {productsError && (
        <View style={[styles.errorBanner, { top: insets.top }]}>
          <Text style={styles.errorText}>{productsError}</Text>
        </View>
      )}

      {/* Top header overlay */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.logoText}>SHOPSYRA</Text>
        <Pressable
          onPress={() => router.push("/(tabs)/cart")}
          style={({ pressed }) => [
            styles.headerBtn,
            { transform: [{ scale: pressed ? 0.9 : 1 }] },
          ]}
        >
        </Pressable>
      </View>

      {/* Vertical product feed */}
      <Animated.FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductSlide
            item={item}
            cardHeight={CARD_H}
            isWishlisted={wishlist.includes(item.id)}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            onViewDetails={handleViewDetails}
          />
        )}
        pagingEnabled
        snapToInterval={CARD_H}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        getItemLayout={(_, index) => ({
          length: CARD_H,
          offset: CARD_H * index,
          index,
        })}
        contentContainerStyle={{ paddingBottom: 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    letterSpacing: 0.3,
  },

  /* Error */
  errorBanner: {
    position: "absolute",
    left: 18,
    right: 18,
    zIndex: 20,
    backgroundColor: "rgba(255,243,205,0.95)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 12,
    color: "#856404",
    textAlign: "center",
    fontFamily: "Poppins-med",
  },

  /* Top header */
  topHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  logoText: {
    fontFamily: "Poppins-semi",
    fontSize: 18,
    color: "#fff",
    letterSpacing: 3,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Slide */
  slide: {
    width: SCREEN_W,
    overflow: "hidden",
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_W,
    height: "100%",
    resizeMode: "cover",
  },
  bottomGradient: {
    ...StyleSheet.absoluteFillObject,
  },
 

  /* NEW badge */
  newBadge: {
    position: "absolute",
    top: 100,
    left: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  newBadgeText: {
    fontFamily: "Poppins-semi",
    fontSize: 10,
    color: "#000",
    letterSpacing: 2,
  },

  /* Side actions (TikTok-style) */
  sideActions: {
    position: "absolute",
    right: 16,
    bottom: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 22,
  },
  actionBtn: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  actionLabel: {
    fontFamily: "Poppins-med",
    fontSize: 10,
    color: "#fff",
    letterSpacing: 0.2,
  },

  /* Bottom info */
  bottomInfo: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 70,
  },
  brand: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  name: {
    fontFamily: "Poppins-semi",
    fontSize: 26,
    color: "#fff",
    lineHeight: 32,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  price: {
    fontFamily: "Poppins-semi",
    fontSize: 22,
    color: "#fff",
  },
  originalPrice: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: "rgba(240,73,102,0.85)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  discountText: {
    fontFamily: "Poppins-semi",
    fontSize: 10,
    color: "#fff",
    letterSpacing: 0.5,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 16,
  },
  ratingText: {
    fontFamily: "Poppins-med",
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  categoryText: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },

  /* View Details button */
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  detailsBtnText: {
    fontFamily: "Poppins-semi",
    fontSize: 13,
    color: "#000",
    letterSpacing: 0.3,
  },
});
