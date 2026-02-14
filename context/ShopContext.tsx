import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Product, products as mockProducts } from "@/data/catalog";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";

type CartItem = {
  productId: string;
  quantity: number;
};

/** Serializes async calls so they run one at a time, preventing Mongoose version conflicts */
function createQueue() {
  let pending: Promise<void> = Promise.resolve();
  return (fn: () => Promise<void>) => {
    pending = pending.then(fn, fn);
    return pending;
  };
}

type ShopContextType = {
  products: Product[];
  isLoadingProducts: boolean;
  productsError: string | null;
  wishlist: string[];
  cart: CartItem[];
  toggleWishlist: (productId: string) => void;
  addToCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  getProductById: (productId: string) => Product | undefined;
  cartSubtotal: number;
};

type BackendProduct = {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  imgUrls?: string[];
  rating?: number;
  numReviews?: number;
  variants?: Array<{ size?: string; color?: string }>;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const cartQueue = useRef(createQueue()).current;
  const wishlistQueue = useRef(createQueue()).current;

  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const mapBackendProduct = (item: BackendProduct): Product => {
    const sizes = item.variants?.map((variant) => variant.size).filter(Boolean) as string[] | undefined;
    const colors = item.variants?.map((variant) => variant.color).filter(Boolean) as string[] | undefined;

    return {
      id: item._id,
      name: item.name,
      brand: "ShopSyra",
      price: Number(item.price ?? 0),
      originalPrice: Math.round(Number(item.price ?? 0) * 1.25),
      rating: Number(item.rating ?? 0),
      reviews: Number(item.numReviews ?? 0),
      image: item.imgUrls?.[0] || "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      category: item.category || "Fashion",
      description: item.description || "Premium fashion piece from ShopSyra.",
      sizes: sizes?.length ? Array.from(new Set(sizes)) : ["S", "M", "L"],
      colors: colors?.length ? Array.from(new Set(colors)) : ["#1D1B27", "#EFEFF2"],
    };
  };

  /* ─── Fetch products (public, no auth needed) ─── */
  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      setIsLoadingProducts(true);
      try {
        const response = await api.get("/product/getProducts");
        const backendProducts = (response.data?.products ?? []) as BackendProduct[];
        if (!active) return;

        if (backendProducts.length > 0) {
          const mapped = backendProducts.map(mapBackendProduct);
          setProducts(mapped);
          setProductsError(null);
        } else {
          setProducts(mockProducts);
          setProductsError("No products found in backend. Showing fallback catalog.");
        }
      } catch (error: unknown) {
        if (!active) return;
        console.error("Failed to fetch products:", error);
        setProducts(mockProducts);
        setProductsError("Could not load backend products. Showing fallback catalog.");
      } finally {
        if (active) setIsLoadingProducts(false);
      }
    }

    fetchProducts();
    return () => { active = false; };
  }, []);

  /* ─── Fetch wishlist & cart from backend when authenticated ─── */
  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      // Not logged in — reset to empty local state
      setWishlist([]);
      setCart([]);
      return;
    }

    let active = true;

    async function fetchWishlist() {
      try {
        const res = await api.get("/wishlist/");
        if (!active) return;
        const backendWishlist = res.data?.wishlist ?? [];
        // Backend returns populated product objects; extract IDs
        const ids: string[] = backendWishlist.map((item: { _id?: string; id?: string }) => item._id ?? item.id ?? item);
        setWishlist(ids.filter(Boolean));
      } catch (error: any) {
        // 404 means no wishlist exists yet — treat as empty
        if (error?.response?.status === 404) {
          if (active) setWishlist([]);
        } else {
          console.error("Failed to fetch wishlist:", error);
        }
      }
    }

    async function fetchCart() {
      try {
        const res = await api.get("/cart/");
        if (!active) return;
        const backendCart = res.data?.cart ?? [];
        const mapped: CartItem[] = backendCart.map(
          (item: { product: { _id?: string; id?: string } | string; quantity: number }) => ({
            productId: typeof item.product === "string" ? item.product : (item.product._id ?? item.product.id),
            quantity: item.quantity,
          }),
        );
        setCart(mapped);
      } catch (error: any) {
        // 404 means no cart exists yet — treat as empty
        if (error?.response?.status === 404) {
          if (active) setCart([]);
        } else {
          console.error("Failed to fetch cart:", error);
        }
      }
    }

    fetchWishlist();
    fetchCart();

    return () => { active = false; };
  }, [isAuthenticated, isAuthLoading]);

  const getProductById = useCallback(
    (productId: string) => products.find((item) => item.id === productId),
    [products],
  );

  /* ─── Wishlist: toggle with backend sync ─── */
  const toggleWishlist = useCallback(
    (productId: string) => {
      // Optimistic local update
      setWishlist((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
      );

      if (!isAuthenticated) return;

      wishlistQueue(async () => {
        try {
          await api.post("/wishlist/toggle", { productId });
        } catch (error: any) {
          console.error("Failed to toggle wishlist:", error?.response?.status, error?.response?.data);
          setWishlist((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
          );
        }
      });
    },
    [isAuthenticated],
  );

  /* ─── Cart: add with backend sync ─── */
  const addToCart = useCallback(
    (productId: string) => {
      // Optimistic local update
      setCart((prev) => {
        const found = prev.find((item) => item.productId === productId);
        if (found) {
          return prev.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }
        return [...prev, { productId, quantity: 1 }];
      });

      if (!isAuthenticated) return;

      cartQueue(async () => {
        try {
          await api.post("/cart/add", { productId, quantity: 1 });
        } catch (error: any) {
          console.error("Failed to add to cart:", error?.response?.status, error?.response?.data);
          setCart((prev) => {
            const found = prev.find((item) => item.productId === productId);
            if (found && found.quantity > 1) {
              return prev.map((item) =>
                item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item,
              );
            }
            return prev.filter((item) => item.productId !== productId);
          });
        }
      });
    },
    [isAuthenticated],
  );

  /* ─── Cart: update quantity with backend sync ─── */
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      // Save previous state for revert
      const prevCart = cart;

      // Optimistic local update
      setCart((prev) =>
        prev
          .map((item) => (item.productId === productId ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0),
      );

      if (!isAuthenticated) return;

      cartQueue(async () => {
        try {
          if (quantity <= 0) {
            await api.delete("/cart/remove", { data: { productId } });
          } else {
            await api.put("/cart/update", { productId, quantity });
          }
        } catch (error: any) {
          console.error("Failed to update cart:", error?.response?.status, error?.response?.data);
          setCart(prevCart);
        }
      });
    },
    [isAuthenticated, cart],
  );

  /* ─── Cart: remove with backend sync ─── */
  const removeFromCart = useCallback(
    (productId: string) => {
      const prevCart = cart;

      // Optimistic local update
      setCart((prev) => prev.filter((item) => item.productId !== productId));

      if (!isAuthenticated) return;

      cartQueue(async () => {
        try {
          await api.delete("/cart/remove", { data: { productId } });
        } catch (error: any) {
          console.error("Failed to remove from cart:", error?.response?.status, error?.response?.data);
          setCart(prevCart);
        }
      });
    },
    [isAuthenticated, cart],
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = getProductById(item.productId);
        return product ? sum + product.price * item.quantity : sum;
      }, 0),
    [cart, getProductById],
  );

  const value = useMemo(
    () => ({
      products,
      isLoadingProducts,
      productsError,
      wishlist,
      cart,
      toggleWishlist,
      addToCart,
      updateQuantity,
      removeFromCart,
      getProductById,
      cartSubtotal,
    }),
    [products, isLoadingProducts, productsError, wishlist, cart, cartSubtotal, getProductById, toggleWishlist, addToCart, updateQuantity, removeFromCart],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
