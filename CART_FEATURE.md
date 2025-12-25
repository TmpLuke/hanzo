# Shopping Cart Feature

## Overview
A fully functional shopping cart system has been implemented that allows users to add multiple products to their cart and checkout all at once.

## Features

### 1. Cart Context (`src/contexts/CartContext.tsx`)
- Global cart state management using React Context
- Persistent cart storage using localStorage
- Functions:
  - `addToCart()` - Add items to cart
  - `removeFromCart()` - Remove items from cart
  - `updateQuantity()` - Update item quantities
  - `clearCart()` - Clear all items
  - `getTotalItems()` - Get total item count
  - `getTotalPrice()` - Get total cart price

### 2. Cart Sheet (`src/components/cart/CartSheet.tsx`)
- Slide-out cart panel accessible from header
- Shows cart badge with item count
- View all cart items with thumbnails
- Adjust quantities with +/- buttons
- Remove individual items
- See total price
- Quick checkout button

### 3. Cart Checkout Page (`src/pages/CartCheckout.tsx`)
- Full checkout page for cart items
- Order summary with all products
- Customer details form (email, name)
- Adjust quantities before checkout
- Total price calculation
- Integrates with MoneyMotion payment

### 4. Product Pages Integration
- **Product Detail Page**: 
  - "Add to Cart" button alongside "Buy Now"
  - Adds selected variant to cart
  
- **Product Card**: 
  - Quick "Add to Cart" icon button
  - Adds cheapest variant by default

### 5. Checkout Integration (`src/lib/checkout.ts`)
- `createCartCheckout()` function for multi-item orders
- Creates single order with all items as line items
- Generates MoneyMotion checkout session
- Handles success/failure redirects

## User Flow

1. **Browse Products** → Click "Add to Cart" on any product
2. **View Cart** → Click cart icon in header to see items
3. **Adjust Cart** → Change quantities or remove items
4. **Checkout** → Click "Proceed to Checkout"
5. **Enter Details** → Provide email and optional name
6. **Complete Purchase** → Redirected to MoneyMotion payment
7. **Success** → Cart is cleared, order confirmed

## Technical Details

### Cart Storage
- Stored in localStorage as JSON
- Persists across page refreshes
- Cleared on successful checkout

### Cart Item Structure
```typescript
interface CartItem {
  productId: string;
  productName: string;
  variantId: string;
  variantLabel: string;
  price: number;
  image: string;
  quantity: number;
}
```

### Routes Added
- `/cart/checkout` - Full cart checkout page

### Components Added
- `CartContext` - Global state management
- `CartSheet` - Slide-out cart panel
- `CartCheckout` - Checkout page

## Usage

### Add to Cart
```tsx
import { useCart } from '@/contexts/CartContext';

const { addToCart } = useCart();

addToCart({
  productId: product.id,
  productName: product.name,
  variantId: variant.id,
  variantLabel: variant.label,
  price: variant.price,
  image: product.image,
});
```

### Access Cart
```tsx
const { items, getTotalItems, getTotalPrice } = useCart();
```

## Testing

1. Add multiple products to cart
2. Verify cart badge updates
3. Open cart sheet and verify items
4. Adjust quantities
5. Remove items
6. Proceed to checkout
7. Complete payment flow
8. Verify cart clears on success

## Future Enhancements

- Coupon code support
- Save cart for later
- Cart expiration
- Quantity limits per product
- Stock validation
- Cart sharing via URL
