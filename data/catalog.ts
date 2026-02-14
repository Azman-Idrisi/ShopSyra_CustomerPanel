export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  isNew?: boolean;
  description: string;
  sizes: string[];
  colors: string[];
};

export const products: Product[] = [
  {
    id: "p-01",
    name: "Structured Oversized Blazer",
    brand: "SYRA Atelier",
    price: 8999,
    originalPrice: 11999,
    rating: 4.8,
    reviews: 214,
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=900&q=80",
    category: "Women",
    isNew: true,
    description:
      "Tailored oversized blazer with sharp lapels and a relaxed silhouette for elevated day-to-night styling.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#1D1B27", "#D8C7B8", "#EFEFF2"],
  },
  {
    id: "p-02",
    name: "Minimal Linen Shirt",
    brand: "SYRA Studio",
    price: 3499,
    originalPrice: 4999,
    rating: 4.6,
    reviews: 141,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    category: "Men",
    description:
      "Soft linen shirt with clean lines and premium finishing, crafted for breathable all-season wear.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#F2EFEA", "#A8B0BC", "#263146"],
  },
  {
    id: "p-03",
    name: "Leather Crossbody Bag",
    brand: "SYRA Leather",
    price: 5599,
    originalPrice: 6999,
    rating: 4.9,
    reviews: 302,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    category: "Accessories",
    isNew: true,
    description:
      "Compact leather crossbody with magnetic closure and metallic accents designed for modern essentials.",
    sizes: ["One Size"],
    colors: ["#221F2A", "#7B5D47", "#D9D7D0"],
  },
  {
    id: "p-04",
    name: "Wide-Leg Tailored Trousers",
    brand: "SYRA Atelier",
    price: 4299,
    originalPrice: 5999,
    rating: 4.7,
    reviews: 178,
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    category: "Women",
    description:
      "Fluid wide-leg trousers with high-waist contouring and hidden fastening for polished everyday styling.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#2D3448", "#D9DCE6", "#C4B39D"],
  },
  {
    id: "p-05",
    name: "Monochrome Sneakers",
    brand: "SYRA Motion",
    price: 6299,
    originalPrice: 7999,
    rating: 4.5,
    reviews: 96,
    image:
      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=900&q=80",
    category: "Men",
    description:
      "Cushioned low-top sneakers with minimal detailing and a streamlined profile for daily movement.",
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["#101316", "#F3F4F7"],
  },
  {
    id: "p-06",
    name: "Signature Silk Scarf",
    brand: "SYRA Maison",
    price: 2399,
    originalPrice: 3199,
    rating: 4.8,
    reviews: 67,
    image:
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
    category: "Accessories",
    description:
      "Printed silk scarf with tonal gradients and hand-rolled edges, designed to elevate every outfit.",
    sizes: ["One Size"],
    colors: ["#312B42", "#B9836E", "#EFE8DE"],
  },
];
