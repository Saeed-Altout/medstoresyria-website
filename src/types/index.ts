// ─── Shared envelope ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta: PaginationMeta | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserRole = "customer";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: UserRole;
  locale: string;
  is_active: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// ─── Catalog ────────────────────────────────────────────────────────────────

export interface ProductListItem {
  id: string;
  slug: string;
  condition: "new" | "used";
  price_usd: string;
  stock_qty: number;
  is_featured: boolean;
  name: string;
  primaryImageUrl: string | null;
  brand: { id: string; slug: string; name: string } | null;
  category: { id: string; slug: string; name: string } | null;
}

export interface ProductImage {
  id: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductAttribute {
  key: string;
  label: string;
  type: string;
  value: string;
}

export interface ProductDetail extends ProductListItem {
  stock_min: number;
  is_active: boolean;
  in_stock: boolean;
  description: string | null;
  condition_report: string | null;
  images: ProductImage[];
  attributes: ProductAttribute[];
  brand: {
    id: string;
    slug: string;
    name: string;
    logoUrl: string | null;
  } | null;
  category: {
    id: string;
    slug: string;
    name: string;
    parent_id: string | null;
  } | null;
  rating_average?: number;
  rating_count?: number;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  author_name: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
  breakdown: Record<"1" | "2" | "3" | "4" | "5", number>;
}

export interface CreateReviewDto {
  productId: string;
  rating: number;
  title?: string;
  body: string;
  author_name: string;
  author_email: string;
}

export interface Category {
  id: string;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  name: string;
  description: string | null;
  translations: { locale: string; name: string; description: string | null }[];
  children: Category[];
}

export interface Brand {
  id: string;
  slug: string;
  logoUrl: string | null;
  website: string | null;
  name: string;
  description: string | null;
  translations: { locale: string; name: string; description: string | null }[];
}

export interface AttributeDefinition {
  id: string;
  key: string;
  type: string;
  is_required: boolean;
  sort_order: number;
  label: string;
}

export interface ProductFilters {
  categoryId?: string;
  brandId?: string;
  condition?: "new" | "used";
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sortBy?: "price" | "createdAt";
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

// ─── Commerce: cart, delivery, orders ──────────────────────────────────────

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price_usd: string;
  image: string | null;
  stock_qty: number;
  quantity: number;
}

export interface Governorate {
  id: string;
  name: string;
  name_local: string | null;
  delivery_fee_usd: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "rejected";

export interface OrderItem {
  id: string;
  product_name_snapshot: string;
  product_price_snapshot: string;
  quantity: number;
  total_usd: string;
}

export interface StatusLog {
  id: string;
  status: string;
  note: string | null;
  created_at: string;
  user: { first_name: string; last_name: string } | null;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_detail: string;
  notes: string | null;
  locale: string;
  status: OrderStatus;
  subtotal_usd: string;
  delivery_fee_usd: string;
  total_usd: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  governorate: { id: string; name: string; name_local: string | null };
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  } | null;
  items: OrderItem[];
  status_logs: StatusLog[];
  invoice: {
    id: string;
    invoice_number: string;
    pdf_url: string;
  } | null;
}

export interface CreateOrderDto {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  governorate_id: string;
  address_detail: string;
  notes?: string;
  locale?: string;
  items: { product_id: string; quantity: number }[];
}

export interface CreateOrderResponse {
  orderId: string;
  orderNumber: string;
  total: string;
}

// ─── Maintenance ──────────────────────────────────────────────────────────────

export type MaintenanceStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface MaintenanceRequest {
  id: string;
  request_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  device_type: string;
  description: string;
  images: string[];
  locale: string;
  status: MaintenanceStatus;
  visit_type: "home" | "office";
  scheduled_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  technician: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  status_logs: StatusLog[];
}

export interface CreateMaintenanceDto {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  device_type: string;
  description: string;
  images?: string[];
  visit_type: "home" | "office";
  locale?: string;
}

export interface CreateMaintenanceResponse {
  requestId: string;
  requestNumber: string;
}

// ─── Notifications & settings ──────────────────────────────────────────────

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
}
