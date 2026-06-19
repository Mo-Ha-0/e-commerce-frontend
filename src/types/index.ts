// ── Enums ──
export enum UserRole {
    SuperAdmin = 'superadmin',
    Admin = 'admin',
    Customer = 'customer',
}

export enum OrderStatus {
    Pending = 'pending',
    Processing = 'processing',
    Completed = 'completed',
    Failed = 'failed',
}

export enum PaymentStatus {
    Pending = 'pending',
    Paid = 'paid',
    Failed = 'failed',
}

export enum DiscountType {
    Percentage = 'PERCENTAGE',
    Fixed = 'FIXED',
}

export enum WalletTransactionType {
    Credit = 'credit',
    Debit = 'debit',
}

// ── Auth ──
export interface JwtUser {
  id: string
  email: string
  role: UserRole
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
}

// ── User ──
export interface User {
    id: string;
    email: string;
    role: UserRole;
    balance: string;
    createdAt: string;
}

// ── Product ──
export interface Product {
  id: string
  name: string
  description: string
  price: string
  stock: number
  createdAt: string
  updatedAt: string
  version: number
  originalPrice?: number
  discount?: { id: string; name: string; type: DiscountType; value: number } | null
}

export interface CreateProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
}

export interface UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
}

// ── Cart ──
export interface CartItem {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    updatedAt: string;
    product: Product;
}

export interface AddCartItemDto {
    productId: string;
    quantity: number;
}

export interface UpdateCartItemDto {
    quantity: number;
}

// ── Order ──
export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    priceAtTime: string;
    product?: Product;
}

export interface Order {
    id: string;
    userId: string;
    totalAmount: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paidAt: string | null;
    createdAt: string;
    items: OrderItem[];
}

// ── Wallet ──
export interface WalletTransaction {
    id: string;
    userId: string;
    type: WalletTransactionType;
    reason: string;
    amount: string;
    balanceBefore: string;
    balanceAfter: string;
    referenceId: string | null;
    note: string | null;
    createdAt: string;
}

export interface DepositDto {
    amount: number;
    note?: string;
}

// ── Discount ──
export interface Discount {
    id: string;
    name: string;
    type: DiscountType;
    value: string;
    productId: string | null;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDiscountDto {
    name: string;
    type: DiscountType;
    value: number;
    productId?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}

export interface UpdateDiscountDto {
    name?: string;
    type?: DiscountType;
    value?: number;
    productId?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}

// ── Inventory ──
export interface InventoryLog {
    id: string;
    productId: string;
    adminId: string;
    previousStock: number;
    newStock: number;
    change: number;
    reason: string;
    createdAt: string;
}

export interface UpdateStockDto {
    stock: number;
    reason?: string;
}

export interface RestockDto {
    quantity: number;
    reason?: string;
}

// ── Cart Response (backend returns { items, subTotal, total }) ──
export interface CartResponse {
    items: CartItem[];
    subTotal: number;
    total: number;
    globalDiscount?: unknown;
}

// ── Wallet Response ──
export interface WalletResponse {
    userId: string;
    balance: string;
}

// ── Pagination ──
// Backend returns { items, total, page, limit }
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}
