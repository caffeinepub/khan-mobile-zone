import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ***** User Profile *****

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ***** Data Models *****

  public type ProductId = Nat;
  public type BrandId = Nat;
  public type OrderId = Nat;
  public type Price = Int;

  public type Product = {
    id : ProductId;
    name : Text;
    brandId : BrandId;
    category : Text;
    pricePkr : Price;
    stock : Nat;
    imageUrl : Text;
    addedOn : Time.Time;
  };

  public type CartItem = {
    productId : ProductId;
    quantity : Nat;
  };

  public type OrderItem = {
    product : Product;
    quantity : Nat;
    pricePkr : Price;
    totalPkr : Price;
  };

  public type DeliveryAddress = {
    name : Text;
    street : Text;
    city : Text;
    postal : Text;
    country : Text;
    phone : Text;
  };

  public type PaymentMethod = {
    #cashOnDelivery;
    #onlineCard;
  };

  public type Order = {
    id : OrderId;
    user : Principal;
    items : [OrderItem];
    deliveryAddress : DeliveryAddress;
    paymentMethod : PaymentMethod;
    totalAmountPkr : Price;
    status : OrderStatus;
    timestamp : Time.Time;
  };

  public type OrderStatus = {
    #pending;
    #shipped;
    #delivered;
    #cancelled;
  };

  // ***** State *****

  public type Cart = {
    items : [CartItem];
  };

  let products = Map.empty<ProductId, Product>();
  let nextProductId = Map.singleton<ProductId, ProductId>(0, 1);

  let carts = Map.empty<Principal, Cart>();
  let orders = Map.empty<OrderId, Order>();
  let nextOrderId = Map.singleton<OrderId, OrderId>(0, 1);

  // Track if an admin has been initialized
  var adminInitialized = false;

  // ***** Product Management *****

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProduct(id : ProductId) : async ?Product {
    products.get(id);
  };

  public shared ({ caller }) func addProduct(product : Product) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let newId = switch (nextProductId.get(0)) {
      case (?id) { id };
      case (null) { 1 };
    };

    let newProduct : Product = {
      product with
      id = newId;
      addedOn = Time.now();
    };

    products.add(newId, newProduct);
    let updatedId = newId + 1;
    nextProductId.add(0, updatedId);
    newId;
  };

  public shared ({ caller }) func updateProduct(id : ProductId, product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    let existingProduct = switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };

    let updatedProduct : Product = {
      product with
      id = id;
      addedOn = existingProduct.addedOn;
    };

    products.add(id, updatedProduct);
  };

  public shared ({ caller }) func deleteProduct(id : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) { products.remove(id) };
    };
  };

  // ***** Cart Management *****

  public shared ({ caller }) func addToCart(productId : ProductId, quantity : Nat) : async () {
    let currentCart = switch (carts.get(caller)) {
      case (?cart) { cart };
      case (null) { { items = [] } };
    };

    let updatedItems = currentCart.items.concat([{ productId; quantity }]);
    carts.add(caller, { items = updatedItems });
  };

  public query ({ caller }) func getCart() : async Cart {
    switch (carts.get(caller)) {
      case (?cart) { cart };
      case (null) { { items = [] } };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    carts.remove(caller);
  };

  // ***** Checkout & Order Processing *****

  public shared ({ caller }) func checkout(
    deliveryAddress : DeliveryAddress,
    paymentMethod : PaymentMethod
  ) : async OrderId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can place orders");
    };

    let cart = switch (carts.get(caller)) {
      case (?c) { c };
      case (null) {
        Runtime.trap("Cart is empty");
      };
    };

    if (cart.items.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    let orderItemsList = List.empty<OrderItem>();
    for (cartItem in cart.items.values()) {
      let product = switch (products.get(cartItem.productId)) {
        case (?p) { p };
        case (null) { Runtime.trap("Product not found") };
      };

      orderItemsList.add({
        product;
        quantity = cartItem.quantity;
        pricePkr = product.pricePkr;
        totalPkr = product.pricePkr * Int.fromNat(cartItem.quantity);
      });
    };

    let orderItems = orderItemsList.toArray();

    let totalAmount = orderItems.foldLeft(
      0,
      func(acc, item) {
        acc + (item.pricePkr * Int.fromNat(item.quantity)).toNat();
      },
    );

    let newOrderId = switch (nextOrderId.get(0)) {
      case (?id) { id };
      case (null) { 1 };
    };

    let newOrder : Order = {
      id = newOrderId;
      user = caller;
      items = orderItems;
      deliveryAddress;
      paymentMethod;
      totalAmountPkr = totalAmount;
      status = #pending;
      timestamp = Time.now();
    };

    orders.add(newOrderId, newOrder);
    let updatedOrderId = newOrderId + 1;
    nextOrderId.add(0, updatedOrderId);
    carts.remove(caller); // Clear cart after order is placed
    newOrderId;
  };

  public query ({ caller }) func getOrder(orderId : OrderId) : async Order {
    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) { o };
    };

    if (not AccessControl.isAdmin(accessControlState, caller) and order.user != caller) {
      Runtime.trap("Unauthorized: You cannot access this order");
    };
    order;
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };

    orders.values().toArray().filter(
      func(order) {
        order.user == caller;
      }
    );
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };

    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : OrderId, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) { o };
    };

    let updatedOrder : Order = {
      order with
      status;
    };

    orders.add(orderId, updatedOrder);
  };

  // ***** Admin Claim API *****

  public type ClaimAdminResult = {
    #success;
    #alreadyExists;
    #anonymousCaller;
  };

  public type TransferAdminResult = {
    #success;
    #anonymousCaller;
    #authenticationError;
  };

  public shared ({ caller }) func claimAdminRole() : async ClaimAdminResult {
    if (caller.isAnonymous()) {
      return #anonymousCaller;
    };

    // Check if an admin already exists
    if (adminInitialized) {
      return #alreadyExists;
    };

    // No admin exists, initialize caller as admin
    AccessControl.initialize(accessControlState, caller, "", "");
    adminInitialized := true;
    #success;
  };

  public shared ({ caller }) func transferAdminRole() : async TransferAdminResult {
    if (caller.isAnonymous()) {
      return #anonymousCaller;
    };

    // Only existing admins can transfer admin role
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #authenticationError;
    };

    // Transfer admin role to caller (re-initialize with caller as sole admin)
    AccessControl.initialize(accessControlState, caller, "", "");
    adminInitialized := true;
    #success;
  };
};
