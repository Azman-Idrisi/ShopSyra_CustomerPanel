# ShopSyra

A modern, dark-themed mobile e-commerce application built with React Native and Expo. ShopSyra delivers a TikTok-style product discovery experience with OTP-based authentication, real-time cart and wishlist management, and seamless backend integration.

---

## Table of Contents

- [Preview](#preview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Screens](#screens)
- [Architecture](#architecture)
- [API Integration](#api-integration)
- [Theming](#theming)
- [Configuration](#configuration)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

| Category | Details |
|---|---|
| **Authentication** | OTP-based phone login, session persistence with AsyncStorage, auto-login on restart |
| **Product Discovery** | TikTok-style vertical full-screen feed with gradient overlays, ratings, and quick actions |
| **Shopping Cart** | Add/remove items, quantity controls, real-time subtotal, free shipping above ₹7,000 |
| **Wishlist** | Save products, grid view, quick add-to-cart |
| **Product Details** | Full product info, size selector, related products carousel |
| **Profile** | Account info, order history, payment methods, settings |
| **Offline Support** | Falls back to local mock catalog when the API is unreachable |
| **Optimistic Updates** | Instant UI feedback with background backend sync and automatic rollback on failure |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) ~54.0 / React Native 0.81 |
| Language | TypeScript 5.9 |
| Routing | [Expo Router](https://docs.expo.dev/router/introduction/) 6.0 (file-based) |
| Navigation | React Navigation 7 (Bottom Tabs) |
| Styling | [NativeWind](https://www.nativewind.dev/) 4.2 (Tailwind CSS for RN) |
| State | React Context + AsyncStorage |
| Networking | Axios 1.13 |
| Animations | React Native Reanimated 3.17 |
| Images | expo-image 3.0 |
| Icons | @expo/vector-icons (Ionicons) |

---

## Project Structure

```
userpanel/
├── app/                        # Screens (Expo Router file-based routing)
│   ├── _layout.tsx             # Root layout — providers & font loading
│   ├── index.tsx               # Auth entry — phone number input
│   ├── (auth)/
│   │   └── otp.tsx             # OTP verification
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab bar configuration & badges
│   │   ├── index.tsx           # Home — vertical product feed
│   │   ├── cart.tsx            # Shopping cart
│   │   ├── wishlist.tsx        # Saved products grid
│   │   └── profile.tsx         # User profile & settings
│   └── product/
│       └── [id].tsx            # Product details (dynamic route)
│
├── context/                    # React Context providers
│   ├── AuthContext.tsx          # Auth token, session, logout
│   ├── ShopContext.tsx          # Products, cart, wishlist, sync
│   └── ThemeContext.tsx         # Dark theme colors
│
├── api/
│   └── client.ts               # Axios instance & interceptors
│
├── data/
│   └── catalog.ts              # Mock product catalog (offline fallback)
│
├── assets/
│   ├── fonts/                  # Poppins (Regular, Medium, SemiBold)
│   └── images/                 # App icon, splash, auth background
│
├── global.css                  # Tailwind CSS entry point
├── tailwind.config.js          # NativeWind / Tailwind configuration
├── app.json                    # Expo app configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your device, **or** an Android/iOS emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ShopSyra.git
cd ShopSyra/userpanel

# Install dependencies
npm install

# Start the development server
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS) to launch on your device.

### Running on Emulators

```bash
# Android
npx expo start --android

# iOS (macOS only)
npx expo start --ios
```

---

## Scripts

| Command | Description |
|---|---|
| `npx expo start` | Start the Expo development server |
| `npx expo start --android` | Launch on Android emulator |
| `npx expo start --ios` | Launch on iOS simulator |
| `npm run lint` | Run ESLint |
| `npm run reset-project` | Reset the project to a clean state |

---

## Screens

### Authentication

| Screen | Description |
|---|---|
| **Phone Entry** | Enter phone number with +91 country code. Validates 10-digit input and sends OTP. |
| **OTP Verification** | 4-digit code input with auto-focus navigation and 30-second resend timer. |

### Main App (Tabs)

| Tab | Icon | Description |
|---|---|---|
| **Home** | `home-outline` | Full-screen vertical product feed with gradient cards, ratings, discount badges, and quick action buttons. |
| **Cart** | `bag-handle-outline` | Cart items with quantity controls, order summary, and free shipping threshold indicator. Badge shows item count. |
| **Wishlist** | `heart-outline` | Two-column grid of saved products with quick add-to-bag action. Badge shows wishlist count. |
| **Profile** | `person-outline` | User info, stats (wishlist, bag, VIP tier), and settings menu. |

### Product Details

Dynamic route (`/product/[id]`) with full product image, brand and pricing info, size selector chips, related products carousel, and a fixed add-to-bag bottom bar.

---

## Architecture

### State Management

The app uses three React Context providers, wrapped at the root layout level:

```
AuthProvider
  └── ShopProvider
        └── ThemeProvider
              └── App Screens
```

| Provider | Responsibilities |
|---|---|
| **AuthContext** | Token storage, session validation, login/logout, API header injection |
| **ShopContext** | Product catalog, cart CRUD, wishlist toggle, backend sync with queue system |
| **ThemeContext** | Dark theme color palette |

### Navigation Flow

```
Root Stack
├── / ...................... Phone entry (unauthenticated)
├── /(auth)/otp ........... OTP verification
├── /(tabs) ............... Main app (authenticated)
│   ├── index ............. Home feed
│   ├── cart .............. Shopping cart
│   ├── wishlist .......... Saved items
│   └── profile ........... User profile
└── /product/[id] ......... Product details
```

**Navigation guards** redirect unauthenticated users to `/` and authenticated users to `/(tabs)`.

### Sync Strategy

Cart and wishlist operations use **optimistic updates** — the UI updates immediately while a background API call syncs the change. A **queue system** serializes requests to prevent concurrent Mongoose version conflicts on the backend. If a sync fails, the state is automatically rolled back.

---

## API Integration

**Base URL:** `https://shop-syra-backend.vercel.app/api`

| Endpoint | Method | Purpose |
|---|---|---|
| `/otp/send-otp` | POST | Send OTP to phone number |
| `/otp/verify-otp` | POST | Verify OTP and receive auth token |
| `/customer/me` | GET | Validate session token |
| `/product/getProducts` | GET | Fetch product catalog |
| `/wishlist/` | GET | Retrieve user wishlist |
| `/wishlist/toggle` | POST | Add or remove a wishlist item |
| `/cart/` | GET | Retrieve user cart |
| `/cart/add` | POST | Add item to cart |
| `/cart/update` | PUT | Update item quantity |
| `/cart/remove` | DELETE | Remove item from cart |

The Axios client is configured with a 10-second timeout and automatically attaches the `Authorization` header when a token is present.

---

## Theming

ShopSyra uses a **dark-only** theme with the following palette:

| Token | Value | Usage |
|---|---|---|
| `background` | `#0D0F17` | App background |
| `surface` | `#161A26` | Cards, containers |
| `surfaceAlt` | `#1E2433` | Elevated surfaces |
| `text` | `#F4F5FA` | Primary text |
| `textMuted` | `#A4A8B7` | Secondary text |
| `border` | `#2A3040` | Dividers, borders |
| `pinkish` | `#ca3bd1` | Accent / CTA |
| `primarySoft` | `#202538` | Subtle highlights |

**Typography** is handled with the Poppins font family in three weights: Regular, Medium, and SemiBold.

---

## Configuration

| File | Purpose |
|---|---|
| `app.json` | Expo config — app name (`ShopSyra`), package (`com.shopsyra.app`), new architecture enabled, typed routes |
| `tsconfig.json` | Strict mode, `@/*` path alias, NativeWind type includes |
| `tailwind.config.js` | Content paths, custom font families, NativeWind preset |
| `babel.config.js` | Expo preset with NativeWind JSX import source |
| `metro.config.js` | NativeWind CSS integration |

---

## Roadmap

- [ ] Light mode / theme switching
- [ ] Product search and filtering
- [ ] Checkout flow and payment integration
- [ ] Order tracking and history
- [ ] Address management
- [ ] Push notifications
- [ ] Product reviews and ratings

---

## License

This project is proprietary. All rights reserved.
