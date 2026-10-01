export type SupplierType = 'CJ_DROPSHIPPING' | 'ALIEXPRESS';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING_SUPPLIER'
  | 'SUPPLIER_PLACED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'FAILED'
  | 'REFUNDED';

export type SupplierOrderStatus =
  | 'PENDING'
  | 'PLACED'
  | 'PAID_TO_SUPPLIER'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'OUT_OF_STOCK'
  | 'FAILED'
  | 'CANCELLED';

export type ErrorSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ProductVariant {
  id: string;
  sku: string;
  name: string; // e.g. "Large / Slate Grey"
  price: number;
  supplierCost: number;
  shippingEstimate: number;
  stock: number;
  cjVariantId?: string;
  aeVariantId?: string;
}

export interface DogProduct {
  id: string;
  slug: string;
  title: string;
  category:
    | 'Grooming'
    | 'Health & Wellness'
    | 'Smart Gadgets'
    | 'Comfort & Orthopedic'
    | 'Training'
    | 'Travel & Safety'
    | 'Enrichment'
    | 'Apparel'
    | 'Senior Dog Care'
    | 'Anxiety Solutions';
  description: string;
  benefits: string[];
  dogSize: ('Small' | 'Medium' | 'Large' | 'All Sizes')[];
  rating: number;
  reviewsCount: number;
  image: string;
  supplierType: SupplierType;
  supplierProductId: string;
  supplierUrl: string;
  variants: ProductVariant[];
  isSubscriptionEligible?: boolean;
  subscriptionInterval?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CartItem {
  product: DogProduct;
  variant: ProductVariant;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: ShippingAddress;
  items: {
    productId: string;
    productTitle: string;
    variantId: string;
    variantName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    supplierCost: number;
    supplierType: SupplierType;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  stripePaymentIntentId: string;
  supplierOrders: SupplierOrderRecord[];
}

export interface SupplierOrderRecord {
  id: string;
  orderId: string;
  supplier: SupplierType;
  supplierOrderNumber?: string;
  status: SupplierOrderStatus;
  placedAt?: string;
  costTotal: number;
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  errorMessage?: string;
  retryCount: number;
}

export interface ErrorQueueItem {
  id: string;
  orderId: string;
  orderNumber: string;
  supplier: SupplierType;
  sku: string;
  errorCode: string;
  reason: string;
  severity: ErrorSeverity;
  payload: any;
  createdAt: string;
  retryAttempts: number;
  resolved: boolean;
}

export interface WebhookLogEntry {
  id: string;
  timestamp: string;
  source: 'STRIPE' | 'CJ_DROPSHIPPING' | 'ALIEXPRESS' | 'INTERNAL_WORKER';
  event: string;
  orderId?: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
  details: string;
}
