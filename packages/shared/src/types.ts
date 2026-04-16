export type ProductType = "OTC" | "POM";

export interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  ghanaPostGps: string;
  lat?: number;
  lng?: number;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: string;
  type: ProductType;
  imageUrl: string | null;
  stock: number | null;
  branchId: string | null;
  createdAt: Date;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "pharmacist_approved"
  | "dispatched"
  | "delivered";

export interface Order {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string | null;
  ghanaPostGps: string;
  addressLine1: string;
  area: string;
  region: string;
  consentDataProcessing: boolean;
  status: OrderStatus;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtOrder: number;
}

export interface CreateOrderPayload {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  ghanaPostGps: string;
  addressLine1: string;
  area: string;
  region: string;
  consentDataProcessing: boolean;
  items: { productId: string; quantity: number }[];
}
