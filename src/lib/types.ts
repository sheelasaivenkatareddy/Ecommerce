// Shapes returned by the Ecom API. Money is always in paise (₹1 = 100 paise).

export interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  pricePaise: number;
  stock: number;
  inStock: boolean;
  imageUrl: string;
  isFeatured: boolean;
  category: { name: string; slug: string };
  createdAt: string;
}

export interface ProductList {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ProductSort = "newest" | "price_asc" | "price_desc" | "name";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
  createdAt: string;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: number;
  productSlug: string | null;
  name: string;
  imageUrl: string | null;
  unitPricePaise: number;
  quantity: number;
  lineTotalPaise: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: number;
  status: OrderStatus;
  paymentMethod: "cod";
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
  itemCount: number;
  items: OrderItem[];
  shipping: ShippingAddress;
  createdAt: string;
}
