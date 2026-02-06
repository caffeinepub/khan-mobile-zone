import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export type Time = bigint;
export interface OrderItem {
    totalPkr: Price;
    quantity: bigint;
    pricePkr: Price;
    product: Product;
}
export interface Order {
    id: OrderId;
    status: OrderStatus;
    deliveryAddress: DeliveryAddress;
    paymentMethod: PaymentMethod;
    user: Principal;
    totalAmountPkr: Price;
    timestamp: Time;
    items: Array<OrderItem>;
}
export type Price = bigint;
export type BrandId = bigint;
export interface Cart {
    items: Array<CartItem>;
}
export type ProductId = bigint;
export interface DeliveryAddress {
    street: string;
    country: string;
    city: string;
    name: string;
    phone: string;
    postal: string;
}
export interface CartItem {
    productId: ProductId;
    quantity: bigint;
}
export interface Product {
    id: ProductId;
    name: string;
    stock: bigint;
    imageUrl: string;
    addedOn: Time;
    brandId: BrandId;
    category: string;
    pricePkr: Price;
}
export type OrderId = bigint;
export enum ClaimAdminResult {
    alreadyExists = "alreadyExists",
    anonymousCaller = "anonymousCaller",
    success = "success"
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered"
}
export enum PaymentMethod {
    cashOnDelivery = "cashOnDelivery",
    onlineCard = "onlineCard"
}
export enum TransferAdminResult {
    authenticationError = "authenticationError",
    anonymousCaller = "anonymousCaller",
    success = "success"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<ProductId>;
    addToCart(productId: ProductId, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkout(deliveryAddress: DeliveryAddress, paymentMethod: PaymentMethod): Promise<OrderId>;
    claimAdminRole(): Promise<ClaimAdminResult>;
    clearCart(): Promise<void>;
    deleteProduct(id: ProductId): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Cart>;
    getOrder(orderId: OrderId): Promise<Order>;
    getProduct(id: ProductId): Promise<Product | null>;
    getUserOrders(): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transferAdminRole(): Promise<TransferAdminResult>;
    updateOrderStatus(orderId: OrderId, status: OrderStatus): Promise<void>;
    updateProduct(id: ProductId, product: Product): Promise<void>;
}
