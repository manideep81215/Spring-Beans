# https://spring-beans.vercel.app/   
please doo vist  our website 
# 🍕 FoodRush - Food Ordering Platform

A modern, full-stack food ordering application built with **React** and **Spring Boot**, enabling seamless restaurant discovery, menu browsing, shopping cart management, and real-time order tracking.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Problem Statement & Solution](#-problem-statement--solution)
3. [Technology Stack](#-technology-stack)
4. [Architecture & Business Logic](#-architecture--business-logic)
5. [Features Implemented](#-features-implemented)
6. [Security Implementation](#-security-implementation)
7. [Email Notifications](#-email-notifications)
8. [Admin Panel & Restaurant Management](#-admin-panel--restaurant-management)
9. [Edge Cases & Error Handling](#-edge-cases--error-handling)
10. [Database Schema](#-database-schema)
11. [API Documentation](#-api-documentation)
12. [Project Structure](#-project-structure)
13. [Getting Started](#-getting-started)
14. [Contributing](#-contributing)

---

## 🎯 Project Overview

**FoodRush** is a comprehensive food delivery platform that bridges the gap between customers and restaurants. It provides an intuitive interface for customers to discover restaurants, browse menus, manage shopping carts, place orders, and track deliveries in real-time. Additionally, it includes a robust admin panel for restaurant and menu management.

### Key Highlights:
- **User Roles**: CUSTOMER , ADMIN
- **Real-time Order Tracking**: Live status updates from placement to delivery
- **Role-Based Access**: Different features for customers  and administrators
- **Scalable Architecture**: Microservice-ready design with stateless API
- **Image Management**: Binary storage for restaurant and menu item images
- **Email Notifications**: Automated transactional emails for user actions
- **Responsive UI**: Mobile-first design with Tailwind CSS

---

## 🤔 Problem Statement & Solution

### Problems Solved:

| Problem | Impact | FoodRush Solution |
|---------|--------|------------------|
| Fragmented restaurant discovery | Users waste time searching multiple platforms | Unified marketplace with search & filters |
| Manual order status tracking | Anxiety about delivery status | Real-time live tracking with 5-stage progress |
| Difficult inventory management | Restaurants struggle with item availability | Admin panel for quick item status updates |
| Unverified user accounts | Security risks & spam | Email verification & JWT-based auth |
| Cart abandonment | Lost sales due to complex checkout | Optimized multi-step cart with saved items |
| No order history | Customers can't reorder favorites | Complete order history with timestamps |
| Communication gaps | Users don't know about order updates | Email notifications at key order stages |
| Unauthorized access | Data breaches & unauthorized operations | Role-based access control + JWT validation |
| Large media storage costs | Database bloat | Optimized image compression & BLOB storage |
| Payment inflexibility | Users forced into single payment method | 4 payment options: Card, UPI, NetBanking, COD |

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2.0 | UI library |
| **React Router DOM** | 6.22.0 | Client-side routing & navigation |
| **Vite** | 5.1.4 | Build tool & dev server (fast HMR) |
| **Axios** | 1.6.7 | HTTP client with request/response interceptors |
| **Tailwind CSS** | 3.4.1 | Utility-first styling framework |
| **PostCSS** | 8.4.35 | CSS transformation pipeline |
| **Autoprefixer** | 10.4.18 | Browser compatibility for CSS |
| **React Hot Toast** | 2.4.1 | Toast notifications |
| **Lucide React** | 0.356.0 | Icon library (100+ icons) |
| **Framer Motion** | 11.0.8 | Smooth animations & transitions |
| **TypeScript** | 18.2.56 (optional) | Type checking support |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Spring Boot** | 4.0.6 | Application framework |
| **Java** | 21 | Runtime language |
| **Spring Data JPA** | 4.0.6 | ORM & database abstraction |
| **Spring Security** | 4.0.6 | Authentication & authorization |
| **JWT (jjwt)** | 0.12.6 | Token generation & validation |
| **Hibernate** | Latest (via Spring) | Entity mapping & persistence |
| **MySQL** | 8.0+ | Relational database |
| **MySQL Connector/J** | Latest | JDBC driver |
| **Spring Mail** | 4.0.6 | Email sending capability |
| **Lombok** | Latest | Boilerplate reduction (getters, setters, constructors) |
| **Maven** | 3.8.0+ | Build & dependency management |

### Development & Deployment

| Tool | Version | Purpose |
|------|---------|---------|
| **Git** | Latest | Version control |
| **Docker** | Optional | Containerization |
| **Postman** | Latest | API testing |
| **MySQL Workbench** | 8.0+ | Database management |

---

## 🏗️ Architecture & Business Logic

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│              (React + Vite Frontend)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS (Axios)
                     │ JWT Bearer Token
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  SPRING BOOT API (8080)                      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ JwtAuthenticationFilter → SecurityConfig                │ │
│  │ Validates Bearer tokens & sets authentication context   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                     │                                         │
│  ┌─────────────────┼─────────────────────────────────────┐  │
│  │                 │                                       │  │
│  ▼ Controllers    ▼ Services          ▼ Repositories     │  │
│ ┌────────────┐  ┌──────────┐        ┌──────────────┐   │  │
│ │Auth        │  │Auth      │        │User          │   │  │
│ │Restaurant  │  │Restaurant│◄──────┤Restaurant    │   │  │
│ │MenuItem    │  │MenuItem  │        │MenuItem      │   │  │
│ │Cart        │  │Cart      │        │Cart          │   │  │
│ │Order       │  │Order     │        │CartItem      │   │  │
│ │Admin       │  │User      │        │Order         │   │  │
│ │User        │  │Email     │        │OrderItem     │   │  │
│ └────────────┘  └──────────┘        └──────────────┘   │  │
│                                                          │  │
│  ┌──────────────────────────────────────────────────┐   │  │
│  │ GlobalExceptionHandler                           │   │  │
│  │ Centralized error handling with detailed responses│   │  │
│  └──────────────────────────────────────────────────┘   │  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ JPA/Hibernate
                       ↓
        ┌──────────────────────────────┐
        │     MySQL Database            │
        │  (hclhackathon)               │
        │                               │
        │ - users                       │
        │ - restaurants                 │
        │ - menu_items                  │
        │ - carts                       │
        │ - cart_items                  │
        │ - orders                      │
        │ - order_items                 │
        └──────────────────────────────┘
                       │
                       ↓
        ┌──────────────────────────────┐
        │    Email Service             │
        │   (Gmail SMTP)               │
        │                              │
        │ → Registration confirmation  │
        │ → Order placement alert      │
        │ → Order cancellation notice  │
        └──────────────────────────────┘
```

### Core Business Logic Flow

#### 1. **User Registration Flow**
```
User Input (FirstName, LastName, Email, Phone, Password, Role)
         ↓
Validation (Email uniqueness, Phone uniqueness, Password strength)
         ↓
Password Hashing (BCrypt with salt)
         ↓
Create User Entity (role defaults to CUSTOMER if not provided)
         ↓
Save to Database (user_id auto-generated)
         ↓
Generate JWT Token (includes user_id, email, name, role)
         ↓
Send Registration Email (async, non-blocking)
         ↓
Return AuthResponseDTO (token, user data)
         ↓
Frontend: Store token in localStorage & user in Context
```

#### 2. **Authentication & Authorization**
```
Frontend Request with Authorization Header (Bearer <JWT>)
         ↓
JwtAuthenticationFilter intercepts request
         ↓
Extract token from "Bearer " prefix
         ↓
Validate signature using secret key
         ↓
Check expiration (current time < token exp time)
         ↓
Check if token is invalidated (in-memory set)
         ↓
Parse claims (extract user_id, role, email)
         ↓
Create UsernamePasswordAuthenticationToken
         ↓
Set in SecurityContextHolder
         ↓
Allow request to proceed to controller
         ↓
[If invalid/expired] → 401 Unauthorized response
```

#### 3. **Shopping Cart Management**
```
User adds item to cart:
  - Get user from JWT token
  - Get or create cart for user
  - Find menu item by ID
  - Check if item already in cart:
    ✓ If YES: increment quantity
    ✗ If NO: create new CartItem
  - Save CartItem with price snapshot
  - Recalculate total (sum of quantity × price)
  - Return updated CartResponseDTO

Cart removal:
  - Validate ownership (item belongs to user's cart)
  - Remove from cart_items table
  - Recalculate total
  - Return updated cart
```

#### 4. **Order Placement Flow**
```
User clicks "Place Order":
  - Validate delivery address (not empty)
  - Get user from JWT
  - Get user's cart
  - Validate cart not empty
  - Create Order entity:
    • user_id = current user
    • status = "PLACED"
    • total_amount = cart.totalAmount
    • address = user input
    • placedAt = now()
  - For each CartItem:
    • Create OrderItem (snapshot of item + price)
    • Link to Order
  - Save Order (cascades to OrderItems)
  - Clear cart (delete all CartItems)
  - Send order confirmation email
  - Return OrderResponseDTO
  - Frontend redirects to /order/{orderId}
```

#### 5. **Order Status Tracking**
```
Restaurant/Admin updates order status:
  POST /api/admin/orders/{id}/status { status: "CONFIRMED" }
         ↓
Validate status in allowed set
         ↓
Get Order by ID
         ↓
Update order.status
         ↓
Update order.updatedAt = now()
         ↓
Save to database
         ↓
Return updated OrderResponseDTO
         ↓
Frontend fetches every 30 seconds (polling)
         ↓
OrderStatusTracker component updates progress bar
```

#### 6. **Search & Filtering**
```
User searches "pizza" in Home:
  - Frontend sends: GET /api/restaurants/search?q=pizza
  - Backend RestaurantRepository.searchByRestaurantCuisineOrMenuItem()
  - Custom JPQL query:
    SELECT DISTINCT r FROM Restaurant r
    LEFT JOIN r.menuItems m
    WHERE LOWER(r.name) LIKE '%pizza%'
       OR LOWER(r.cuisine) LIKE '%pizza%'
       OR LOWER(m.name) LIKE '%pizza%'
  - Returns all restaurants matching criteria
  - Frontend displays filtered results
```

---

## ✨ Features Implemented

### 🔐 User Authentication & Authorization

#### Registration
- **Feature**: Self-service user registration with role selection
- **Implementation**:
  - Form validation (email regex, 10-digit phone, 8+ char password)
  - Duplicate email/phone detection
  - Password hashing with BCrypt
  - JWT token generation and return
  - Email confirmation sent
- **Roles**: CUSTOMER (default), RESTAURANT, ADMIN
- **Edge Cases Handled**:
  - Existing email → "Email is already registered"
  - Existing phone → "Phone is already registered"
  - Invalid password format → Validation message

#### Login
- **Feature**: Email & password authentication
- **Implementation**:
  - Find user by email
  - Compare provided password with hashed password (BCrypt)
  - Generate JWT with user claims
  - Token stored in localStorage
- **Edge Cases**:
  - Non-existent email → "Invalid email or password"
  - Wrong password → Generic "Invalid email or password" (security best practice)

#### Logout
- **Feature**: Token invalidation
- **Implementation**:
  - Add current token to in-memory invalidated set
  - Frontend clears localStorage
  - Subsequent requests with this token fail
- **Edge Cases**:
  - Already invalidated token → Returns 401

#### JWT Token
- **Structure**: `header.payload.signature`
- **Claims**: user_id (subject), email, phone, name, role, issuedAt, expiration
- **Secret**: 32+ character key (configurable in application.properties)
- **Expiration**: 1 hour (3600000ms)
- **Algorithm**: HS256 (HMAC SHA-256)

---

### 🏢 Restaurant Management

#### Restaurant Discovery
- **Feature**: Browse all restaurants with filters
- **Implementation**:
  - GET /api/restaurants returns all restaurants
  - Include menu items count in response
  - Optional image (BLOB) served as Base64
- **Filters**:
  - By cuisine (Pizza, Burger, Indian, Chinese, Italian, Biryani, All)
  - Search by restaurant name or cuisine
  - Real-time search as user types
- **UI**:
  - Cards show: name, cuisine, rating, delivery time, address, 3 menu preview items
  - Open/Closed status badge
  - Restaurant image or default emoji

#### Restaurant Creation (Admin/Restaurant Role Only)
- **Feature**: Add new restaurants to platform
- **Implementation**:
  - POST /api/admin/restaurants
  - Validate: name, cuisine, address, rating (0-5)
  - Auto-set open = true
  - Save to database
  - Return created restaurant
- **UI**: Form on Home page (only visible to ADMIN/RESTAURANT)
- **Edge Cases**:
  - Empty name → Validation error
  - Rating < 0 or > 5 → Rejected
  - Non-authenticated user → 401 Unauthorized

#### Restaurant Image Upload
- **Feature**: Upload & store restaurant images
- **Implementation**:
  - PUT /api/restaurants/{id}/image (multipart/form-data)
  - Validate file is image (MIME type check)
  - Max file size: 5MB
  - Store as BLOB in `image_data` column
  - Store MIME type in `image_content_type`
  - Return updated restaurant with embedded image
- **Storage**: Binary LONGBLOB in MySQL
- **Retrieval**: GET /api/restaurants/{id}/image (returns binary with correct content-type)
- **Frontend**: Display as inline Base64 or from image endpoint
- **Edge Cases**:
  - Non-image file → "Only image files are allowed"
  - File > 5MB → 413 Payload Too Large
  - No file provided → "Image file is required"

---

### 🍔 Menu Management

#### Menu Item Browsing
- **Feature**: View items for specific restaurant
- **Implementation**:
  - GET /api/restaurants/{restaurantId}/menu
  - Returns array of MenuItemResponseDTO
  - Include item image, price, category, availability
- **UI**: 
  - Category tabs for filtering (e.g., "Appetizers", "Mains", "Desserts")
  - Search within menu items
  - Veg/Non-veg indicator with colored dot
  - Price in Rupees (₹)
  - Item image with hover scale effect

#### Menu Item Creation (Admin/Restaurant Only)
- **Feature**: Add items to restaurant menu
- **Implementation**:
  - POST /api/admin/menu-items
  - Required: restaurantId, name, category, price, available
  - Optional: imageData, imageContentType
  - Save with FK to restaurant
  - Auto-generate item ID
- **UI**: Form on RestaurantMenu page
- **Edge Cases**:
  - Non-existent restaurantId → "Restaurant not found" (404)
  - Price < 0 → Validation error
  - Missing name → "Menu item name is required"

#### Menu Item Image Upload
- **Feature**: Upload item images
- **Implementation**:
  - PUT /api/admin/menu-items/{id}/image
  - Validate image MIME type
  - Max 5MB file size
  - Store as BLOB
- **UI**: "Image" button on each menu card (admin view)
- **Edge Cases**:
  - Same as restaurant image

---

### 🛒 Shopping Cart

#### Cart Initialization
- **Feature**: Auto-create cart per user on first access
- **Implementation**:
  - GET /api/cart
  - Query by user_id (from JWT)
  - If not exists → Create new Cart with totalAmount = 0
  - Return CartResponseDTO with items array
- **Persistence**: Separate cart_id from order history

#### Add to Cart
- **Feature**: Add menu items with quantity
- **Implementation**:
  - POST /api/cart/add { menuItemId, quantity, price }
  - Get or create user's cart
  - Check if item already in cart:
    - ✓ Increment quantity
    - ✗ Create new CartItem
  - Set price from menu item (snapshot)
  - Recalculate cart total
  - Return updated cart
- **UI**: 
  - "+ 1" button becomes quantity picker
  - Instant cart count badge update
  - Toast: "Added to cart! 🛒"
- **Edge Cases**:
  - Item not found → 404 "Menu item not found"
  - User not authenticated → 401
  - Adding same item twice → Quantity increments (no duplicate rows)

#### Update Quantity
- **Feature**: Change item quantity in cart
- **Implementation**:
  - PUT /api/cart/update/{cartItemId} { quantity }
  - Find cart item by ID
  - Validate ownership (item in user's cart)
  - If quantity = 0 → Remove item (cascade delete)
  - If quantity > 0 → Update quantity
  - Recalculate total
- **UI**: 
  - ±/Number input on cart items
  - Minus button removes if quantity = 1
  - Instant total recalculation
- **Edge Cases**:
  - quantity < 0 → "Quantity must be at least 1"
  - Non-existent cartItem → 404

#### Remove from Cart
- **Feature**: Delete specific item
- **Implementation**:
  - DELETE /api/cart/remove/{cartItemId}
  - Find item, validate ownership
  - Delete from cart_items
  - Recalculate total
  - Return updated cart
- **UI**: Trash icon on each item
- **Toast**: "Item removed"

#### Clear Cart
- **Feature**: Empty entire cart
- **Implementation**:
  - DELETE /api/cart/clear
  - Remove all cart items
  - Reset totalAmount = 0
  - Keep cart entity (for future reuse)
- **UI**: "Clear All" button on cart page
- **Edge Cases**:
  - Already empty → Still succeeds (idempotent)

---

### 📦 Order Management

#### Place Order
- **Feature**: Convert cart to order
- **Implementation**:
  - POST /api/orders/place { address }
  - Get user from JWT
  - Validate address not empty
  - Get user's cart
  - Validate cart not empty
  - Create Order with status = "PLACED"
  - Copy each CartItem → OrderItem (snapshot prices)
  - Delete all CartItems
  - Save Order (cascades OrderItems)
  - Send email notification
  - Return OrderResponseDTO
- **Payment**: Form allows selection but doesn't charge (demo mode)
- **UI**:
  - Step 1: Enter delivery address
  - Step 2: Select payment method
  - Final button: "Pay & Place Order - Rs {total}"
- **Edge Cases**:
  - Empty address → "Please enter a delivery address"
  - Empty cart → "Cannot place order from an empty cart"
  - User not authenticated → 401

#### View Order History
- **Feature**: List all orders (user or admin view)
- **Implementation**:
  - GET /api/orders/history
  - If user = CUSTOMER → Return user's orders only
  - If user = ADMIN/RESTAURANT → Return all orders
  - Sort by placedAt DESC (newest first)
  - Return array of OrderResponseDTO
- **UI**:
  - Card per order with:
    • Order #ID
    • Restaurant name
    • Status badge with animation (pulsing for active)
    • Item count & total amount
    • Placed timestamp
    • "Live" indicator for active orders
  - Click to view details
- **Filtering**: "Current Orders" for admins, "My Orders" for customers

#### View Order Details
- **Feature**: Full order information & tracking
- **Implementation**:
  - GET /api/orders/{id}
  - Validate user owns order OR is admin
  - Return OrderResponseDTO with:
    • Order ID
    • User info
    • Status
    • Total amount
    • Address
    • Timestamps (placed, updated)
    • Array of OrderItems with item names, quantities, prices
- **UI**:
  - Header with status gradient (green if DELIVERED, orange if PREPARING, etc.)
  - OrderStatusTracker component (5-step progress)
  - Delivery address in MapPin card
  - Item list with subtotals
  - Timestamps
  - "Cancel Order" button (if CUSTOMER and status = PLACED/CONFIRMED)

#### Get Order Status
- **Feature**: Quick status check
- **Implementation**:
  - GET /api/orders/{id}/status
  - Return { status: "CONFIRMED" }
  - Lightweight endpoint for polling
- **Frontend**: Polls every 30 seconds if order not DELIVERED/CANCELLED

#### Cancel Order
- **Feature**: Customer can cancel orders
- **Implementation**:
  - PUT /api/orders/cancel/{id}
  - Validate user owns order
  - Validate status not DELIVERED or already CANCELLED
  - Update status = "CANCELLED"
  - Send cancellation email
  - Return updated order
- **UI**: 
  - Red "Cancel Order" button (visible if PLACED or CONFIRMED)
  - Confirmation modal before canceling
  - Message: "Order will be marked as cancelled and restaurant will stop processing"
- **Edge Cases**:
  - Already cancelled → "Order is already cancelled"
  - Already delivered → "Delivered order cannot be cancelled"
  - Not order owner → 404 "Order not found"

#### Update Order Status (Admin/Restaurant Only)
- **Feature**: Restaurant updates order progress
- **Implementation**:
  - PUT /api/admin/orders/{id}/status { status: "CONFIRMED" }
  - Validate status in allowed set: PLACED, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
  - Get order
  - Update status
  - Update updatedAt timestamp
  - Save
  - Return updated order
- **UI**: Dropdown + "Update" button on OrderTracking page (admin only)
- **Status Flow**: PLACED → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED
- **Edge Cases**:
  - Invalid status → "Invalid order status"
  - Non-existent order → 404

---

### 🔔 Email Notifications

#### Architecture
- **Service**: `EmailNotificationService` (async, non-blocking)
- **Provider**: Gmail SMTP (or any SMTP)
- **Configuration**:
  ```properties
  spring.mail.host=smtp.gmail.com
  spring.mail.port=587
  spring.mail.username=your-email@gmail.com
  spring.mail.password=your-app-password
  spring.mail.properties.mail.smtp.auth=true
  spring.mail.properties.mail.smtp.starttls.enable=true
  ```
- **Error Handling**: Failures logged (non-blocking, doesn't fail request)

#### Registration Confirmation
- **Trigger**: User completes registration
- **To**: User's email address
- **Subject**: "Welcome to FoodRush"
- **Body**:
  ```
  Hi {FirstName} {LastName},
  
  Your FoodRush account has been created successfully.
  You can now browse restaurants, add items to your cart, and track your orders.
  
  Thanks,
  FoodRush
  ```
- **Implementation**: Called in `AuthService.register()`

#### Order Confirmation
- **Trigger**: User places order successfully
- **To**: User's email
- **Subject**: "FoodRush order confirmation #{orderId}"
- **Body** (includes):
  ```
  Hi {UserName},
  
  Your order #{orderId} has been placed successfully.
  
  Delivery address:
  {address}
  
  Items:
  - Item1 x2 - Rs {subtotal1}
  - Item2 x1 - Rs {subtotal2}
  
  Total: Rs {totalAmount}
  
  Thanks,
  FoodRush
  ```
- **Implementation**: Called in `OrderService.placeOrderFromCart()`
- **Items Loop**: Formats each OrderItem as "name × quantity - Rs amount"

#### Order Cancellation Notice
- **Trigger**: User cancels order
- **To**: User's email
- **Subject**: "FoodRush order cancelled #{orderId}"
- **Body**:
  ```
  Hi {UserName},
  
  Your order #{orderId} has been cancelled.
  
  If this was a mistake, you can place a new order anytime.
  
  Thanks,
  FoodRush
  ```
- **Implementation**: Called in `OrderService.cancelOrder()`

#### Error Handling
- **Try-Catch**: Wrapped in try-catch to prevent service failure
- **Logging**: Errors logged with user email & reason
- **Non-Blocking**: Request continues even if email fails
- **Fallback**: If SMTP connection fails, gracefully logs and continues

---

### 👨‍💼 Admin Panel

#### Features (ADMIN/RESTAURANT Role Only)

1. **Add Restaurant**
   - Form on Home page
   - Fields: name, cuisine, address, rating (0-5), open status
   - Creates restaurant immediately
   - Toast confirmation: "Restaurant added"

2. **Upload Restaurant Image**
   - Button on restaurant cards (admin view)
   - Multipart file upload
   - Validates image type & size
   - Updates restaurant's BLOB

3. **Add Menu Items**
   - Form on RestaurantMenu page
   - Fields: name, category, price, available toggle
   - Creates item under selected restaurant
   - Updates category tabs dynamically

4. **Upload Menu Item Image**
   - Button on each menu item (admin view)
   - Same validation as restaurant image

5. **View All Orders**
   - GET /api/orders/history (admin endpoint)
   - Returns ALL orders (not just user's)
   - Sorted by placedAt DESC
   - OrderHistory page shows "Current Orders"

6. **Update Order Status**
   - Dropdown selector on OrderTracking page (admin only)
   - Select new status → Click "Update"
   - Immediate database update
   - Response returns updated order
   - Toast: "Order status updated"

#### Role-Based Access Control
- **AuthContext**: Stores user role from JWT
- **Components**: Check `user?.role` before rendering admin features
- **Backend**: `@RequestMapping("/api/admin/**")` requires `hasAnyAuthority("ADMIN", "RESTAURANT")`
- **Failed Access**: 403 Forbidden

---

### 🔒 Security Implementation

#### 1. **JWT Authentication**
- **Token Generation** (`JwtService.generateToken()`):
  ```java
  Jwts.builder()
    .subject(String.valueOf(user.getId()))           // user ID
    .claim("email", user.getEmail())
    .claim("phone", user.getPhone())
    .claim("name", user.getFirstName() + " " + user.getLastName())
    .claim("role", user.getRole())
    .issuedAt(now)
    .expiration(expiry)
    .signWith(secretKey)                              // HS256
    .compact();
  ```

- **Token Validation** (`JwtAuthenticationFilter`):
  ```
  1. Extract token from "Bearer " prefix
  2. Validate signature using secret key
  3. Check expiration time
  4. Check if token is invalidated (logout)
  5. Parse claims
  6. Create authentication with role as authority
  7. Set in SecurityContextHolder
  ```

- **Token Invalidation** (Logout):
  - Add token string to `Set<String> invalidatedTokens` (in-memory)
  - Future requests with this token fail validation
  - Note: In-memory set clears on server restart (for demo)
  - Production: Use Redis or database for persistence

#### 2. **Password Security**
- **Hashing**: BCrypt with salt
  ```java
  passwordEncoder.encode(password)  // generates hash with random salt
  ```
- **Verification**: Constant-time comparison
  ```java
  passwordEncoder.matches(providedPassword, storedHash)
  ```
- **Validation**:
  - Minimum 8 characters
  - Required during registration
  - Cannot be empty

#### 3. **Role-Based Access Control (RBAC)**
- **Roles**: CUSTOMER, RESTAURANT, ADMIN
- **Authority Mapping**: Role → Spring Security Authority
- **Endpoint Protection**:
  ```java
  .requestMatchers("/api/admin/**")
    .hasAnyAuthority("ADMIN", "RESTAURANT")
  ```
- **Enforcement**:
  - Backend: Returns 403 Forbidden if unauthorized
  - Frontend: Hides UI elements for unauthorized roles
  - Token parsing: Role extracted from JWT claims

#### 4. **Input Validation**
- **Annotations**:
  ```java
  @NotBlank(message = "Email is required")
  @Email(message = "Email must be valid")
  @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
  @Size(min = 8, message = "Password min 8 chars")
  ```
- **Global Handler**: `MethodArgumentNotValidException` caught in `GlobalExceptionHandler`
- **Response**: Detailed field-level error messages
- **Frontend**: Client-side validation + server-side protection

#### 5. **CSRF Protection**
- **Disabled**: Not applicable for stateless REST APIs
- **Security Trade-off**: Acceptable for JWT-based systems
- **Config**: `csrf(csrf -> csrf.disable())`

#### 6. **Data Ownership Validation**
- **Cart**: Verified user owns cart before operations
- **Orders**: Customer can only view/cancel own orders; admins see all
- **Implementation**:
  ```java
  // In OrderService.getOwnedOrder()
  if (!order.getUser().getId().equals(user.getId())) {
    throw new ResourceNotFoundException("Order not found");
  }
  ```

#### 7. **API Rate Limiting**
- **Not Implemented**: Can be added with `spring-cloud-gateway` or middleware
- **Alternative**: Implement RequestCountingFilter

#### 8. **HTTPS/SSL**
- **Not Enforced**: Development environment uses HTTP
- **Production**: Must enable HTTPS
- **Config**: `server.ssl.enabled=true`, `server.ssl.key-store=...`

#### 9. **CORS Configuration**
- **Currently**: Disabled (`cors.disable()`)
- **Production**: Configure explicitly:
  ```java
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList("https://yourdomain.com"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    config.setAllowCredentials(true);
    return new UrlBasedCorsConfigurationSource();
  }
  ```

#### 10. **Exception Handling**
- **Global Handler**: `GlobalExceptionHandler` catches all exceptions
- **No Stack Traces**: Errors don't expose internal structure
- **Consistent Response**:
  ```json
  {
    "timestamp": "2024-01-15T10:30:00",
    "status": 400,
    "error": "Bad request",
    "message": "Email is already registered",
    "fields": { "email": "Email already in use" }
  }
  ```

---

### ⚠️ Edge Cases & Error Handling

#### Authentication Edge Cases

| Scenario | Current Behavior | Handling |
|----------|------------------|----------|
| Expired JWT token | 401 Unauthorized | Frontend redirects to login |
| Missing Authorization header | Request proceeds (if public endpoint) | 401 for protected routes |
| Invalid token signature | 401 Unauthorized | Return error response |
| Invalidated token (logout) | 401 Unauthorized | Checked against in-memory set |
| Malformed token | 401 Unauthorized | JwtException caught |
| Token tampered with | 401 Unauthorized | Signature validation fails |

#### Registration Edge Cases

| Scenario | Handling |
|----------|----------|
| Duplicate email | 400 BadRequestException: "Email is already registered" |
| Duplicate phone | 400 BadRequestException: "Phone is already registered" |
| Invalid email format | 400 Validation error: "Email must be valid" |
| Phone not 10 digits | 400 Validation error: "Phone must contain exactly 10 digits" |
| Password < 8 chars | 400 Validation error: "Password must be between 8 and 255 characters" |
| Passwords don't match | Frontend validation only (not submitted if mismatched) |
| Role not provided | Defaults to "CUSTOMER" |
| Invalid role value | 400 Validation error: "Role must be CUSTOMER, RESTAURANT, or ADMIN" |

#### Cart Operations Edge Cases

| Scenario | Handling |
|----------|----------|
| Add non-existent item | 404 ResourceNotFoundException: "Menu item not found" |
| Duplicate item addition | Quantity increments (no duplicate CartItem created) |
| Update to quantity = 0 | Item automatically removed from cart |
| Update quantity < 0 | 400 BadRequestException: "Quantity must be at least 1" |
| Remove item not in cart | 404 ResourceNotFoundException: "Cart item not found" |
| Clear empty cart | 204 No Content (idempotent) |
| Cart user doesn't match JWT user | 404 ResourceNotFoundException: "Cart not found" |
| Unauthenticated cart access | 401 Unauthorized |

#### Order Placement Edge Cases

| Scenario | Handling |
|----------|----------|
| Empty address | 400 BadRequestException: "Please enter a delivery address" |
| Empty cart | 400 BadRequestException: "Cannot place order from an empty cart" |
| Non-existent user | 404 ResourceNotFoundException: "User not found" |
| Concurrent cart modifications | Last modification wins (no locking implemented) |
| Item removed from menu after adding to cart | Order places with available items (orphaned items silently skipped) |
| Total becomes negative (shouldn't happen) | Caught by BigDecimal validation |

#### Order Status Edge Cases

| Scenario | Handling |
|----------|----------|
| Invalid status value | 400 BadRequestException: "Invalid order status" |
| Admin updates completed order | Still allows (can change back from DELIVERED) |
| Cancel already cancelled order | 400 BadRequestException: "Order is already cancelled" |
| Cancel delivered order | 400 BadRequestException: "Delivered order cannot be cancelled" |
| Customer cancels order placed by someone else | 404 ResourceNotFoundException: "Order not found" |
| Concurrent status updates | Last update wins (no optimistic locking) |

#### File Upload Edge Cases

| Scenario | Handling |
|----------|----------|
| Non-image MIME type | 400 BadRequestException: "Only image files are allowed" |
| File > 5MB | 413 Payload Too Large |
| Empty file uploaded | 400 BadRequestException: "Image file is required" |
| No file in multipart request | 400 BadRequestException: "Image file is required" |
| Corrupted image data | Accepted (stored as-is, may fail on retrieval) |
| Restaurant doesn't exist | 404 ResourceNotFoundException: "Restaurant not found" |
| Menu item doesn't exist | 404 ResourceNotFoundException: "Menu item not found" |

#### Email Notification Edge Cases

| Scenario | Handling |
|----------|----------|
| SMTP connection fails | Logged as warning; request continues (non-blocking) |
| User email null/blank | Email sending skipped silently |
| Gmail password invalid | Connection fails; logged |
| Large order item list | Formatted as multi-line text; no character limit |
| Special characters in item names | Included as-is in email body |

#### Database Edge Cases

| Scenario | Handling |
|----------|----------|
| Constraint violation (unique email) | DataIntegrityViolationException → 409 Conflict |
| Foreign key violation | DataIntegrityViolationException → 409 Conflict |
| NULL in non-nullable column | Validation prevents (DTO validation) |
| Transaction rollback | Exception thrown; response sent |

#### Concurrency Edge Cases

| Scenario | Current Implementation |
|----------|----------------------|
| Multiple users updating same cart | Last write wins (no locking) |
| Admin & customer canceling order simultaneously | Whichever request finishes first wins |
| Image upload during item fetch | Image may be partial (no file locks) |

**Recommended Improvements for Production**:
- Optimistic locking with version field
- Pessimistic locking for critical operations
- Redis caching for tokens/cart
- Database transaction timeout configuration

---

### 🗄️ Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(10) NOT NULL UNIQUE,
  role VARCHAR(30) DEFAULT 'CUSTOMER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_phone (phone)
);
```

#### Restaurants Table
```sql
CREATE TABLE restaurants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  cuisine VARCHAR(60) NOT NULL,
  address VARCHAR(255) NOT NULL,
  rating DECIMAL(3,1),
  open BOOLEAN NOT NULL,
  image_data LONGBLOB,
  image_content_type VARCHAR(100),
  INDEX idx_name (name),
  INDEX idx_cuisine (cuisine)
);
```

#### Menu Items Table
```sql
CREATE TABLE menu_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(60) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_data LONGBLOB,
  image_content_type VARCHAR(100),
  available BOOLEAN NOT NULL,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  INDEX idx_restaurant (restaurant_id),
  INDEX idx_category (category)
);
```

#### Carts Table
```sql
CREATE TABLE carts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user (user_id)
);
```

#### Cart Items Table
```sql
CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cart_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (cart_id) REFERENCES carts(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
  UNIQUE KEY unique_cart_item (cart_id, menu_item_id)
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'PLACED',
  total_amount DECIMAL(10,2) NOT NULL,
  address VARCHAR(255) NOT NULL,
  placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_placed (placed_at)
);
```

#### Order Items Table
```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
  INDEX idx_order (order_id)
);
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "9876543210",
  "role": "CUSTOMER"
}

Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "CUSTOMER",
    "createdAt": "2024-01-15T10:30:00"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200): Same as register
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}

Response (204): No Content
```

### Restaurant Endpoints

#### Get All Restaurants
```http
GET /api/restaurants
Authorization: Bearer {token}

Response (200):
[
  {
    "id": 1,
    "name": "Pizza Palace",
    "cuisine": "Italian",
    "address": "123 Main St",
    "rating": 4.5,
    "open": true,
    "imageData": null,
    "imageContentType": null,
    "menuItems": [...]
  }
]
```

#### Search Restaurants
```http
GET /api/restaurants/search?q=pizza
Authorization: Bearer {token}

Response (200): Array of matching restaurants
```

#### Get Restaurant by ID
```http
GET /api/restaurants/{id}
Authorization: Bearer {token}

Response (200): Single restaurant object with menu items
```

#### Create Restaurant (Admin Only)
```http
POST /api/admin/restaurants
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Burger Barn",
  "cuisine": "American",
  "address": "456 Oak Ave",
  "rating": 4.0,
  "open": true
}

Response (200): Created restaurant
```

#### Upload Restaurant Image
```http
PUT /api/restaurants/{id}/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  image: <binary file>

Response (200): Updated restaurant with image data
```

### Order Endpoints

#### Place Order
```http
POST /api/orders/place
Authorization: Bearer {token}
Content-Type: application/json

{
  "address": "123 Customer St, City, State 12345"
}

Response (201):
{
  "id": 1,
  "userId": 1,
  "userName": "John Doe",
  "status": "PLACED",
  "totalAmount": 599.00,
  "address": "123 Customer St, City, State 12345",
  "placedAt": "2024-01-15T11:00:00",
  "updatedAt": "2024-01-15T11:00:00",
  "orderItems": [...]
}
```

#### Get Order History
```http
GET /api/orders/history
Authorization: Bearer {token}

Response (200): Array of orders (user's orders or all if admin)
```

#### Get Order Details
```http
GET /api/orders/{id}
Authorization: Bearer {token}

Response (200): Single order object
```

#### Get Order Status
```http
GET /api/orders/{id}/status
Authorization: Bearer {token}

Response (200):
{
  "status": "CONFIRMED"
}
```

#### Cancel Order
```http
PUT /api/orders/cancel/{id}
Authorization: Bearer {token}

Response (200): Updated order with status = CANCELLED
```

#### Update Order Status (Admin Only)
```http
PUT /api/admin/orders/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "PREPARING"
}

Response (200): Updated order
```

### Cart Endpoints

#### Get Cart
```http
GET /api/cart
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "userId": 1,
  "userName": "John Doe",
  "totalAmount": 299.50,
  "updatedAt": "2024-01-15T10:45:00",
  "cartItems": [
    {
      "id": 1,
      "cartId": 1,
      "menuItemId": 5,
      "menuItemName": "Margherita Pizza",
      "quantity": 2,
      "price": 149.75
    }
  ]
}
```

#### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "menuItemId": 5,
  "quantity": 1,
  "price": 0
}

Response (200): Updated cart
```

#### Update Cart Item Quantity
```http
PUT /api/cart/update/{itemId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}

Response (200): Updated cart
```

#### Remove from Cart
```http
DELETE /api/cart/remove/{itemId}
Authorization: Bearer {token}

Response (200): Updated cart
```

#### Clear Cart
```http
DELETE /api/cart/clear
Authorization: Bearer {token}

Response (204): No Content
```

---

## 🗂️ Project Structure

```
food-ordering-app/
├── index.html                          # Entry HTML
├── package.json                        # Dependencies
├── vite.config.js                      # Build config
├── tailwind.config.js                  # Tailwind theme
├── postcss.config.js                   # PostCSS pipeline
└── src/
    ├── main.jsx                        # React entry point
    ├── App.jsx                         # Main router component
    ├── index.css                       # Global styles
    ├── context/
    │   ├── AuthContext.jsx             # Auth state management
    │   └── CartContext.jsx             # Cart state management
    ├── services/
    │   └── api.js                      # Axios configuration & API calls
    ├── components/
    │   ├── Navbar.jsx                  # Navigation bar
    │   ├── ProtectedRoute.jsx          # Route guard component
    │   ├── RestaurantCard.jsx          # Restaurant display card
    │   ├── MenuItemCard.jsx            # Menu item display card
    │   └── OrderStatusTracker.jsx      # Order progress visualizer
    └── pages/
        ├── Login.jsx                   # Login page
        ├── Register.jsx                # Registration page
        ├── Home.jsx                    # Restaurant listing & discovery
        ├── RestaurantMenu.jsx          # Menu items for restaurant
        ├── Cart.jsx                    # Shopping cart & checkout
        ├── OrderTracking.jsx           # Order status tracking
        ├── OrderHistory.jsx            # User's order history
        ├── About.jsx                   # About page
        └── Help.jsx                    # FAQ & support page

hcl-b/
├── pom.xml                             # Maven dependencies
├── mvnw / mvnw.cmd                     # Maven wrapper
├── HELP.md                             # Build instructions
└── src/
    ├── main/
    │   ├── java/com/hackathon/hcl/
    │   │   ├── HclApplication.java     # Spring Boot entry point
    │   │   ├── config/
    │   │   │   ├── SecurityConfig.java # Spring Security config
    │   │   │   └── JwtAuthenticationFilter.java  # JWT validation
    │   │   ├── service/
    │   │   │   ├── JwtService.java     # Token operations
    │   │   │   ├── AuthService.java    # Login/register logic
    │   │   │   ├── UserService.java    # User management
    │   │   │   ├── RestaurantService.java
    │   │   │   ├── MenuItemService.java
    │   │   │   ├── CartService.java
    │   │   │   ├── OrderService.java
    │   │   │   └── EmailNotificationService.java
    │   │   ├── controller/
    │   │   │   ├── AuthController.java
    │   │   │   ├── UserController.java
    │   │   │   ├── RestaurantController.java
    │   │   │   ├── MenuItemController.java
    │   │   │   ├── CartController.java
    │   │   │   ├── OrderController.java
    │   │   │   └── AdminController.java
    │   │   ├── model/
    │   │   │   ├── User.java
    │   │   │   ├── Restaurant.java
    │   │   │   ├── MenuItem.java
    │   │   │   ├── Cart.java
    │   │   │   ├── CartItem.java
    │   │   │   ├── Order.java
    │   │   │   └── OrderItem.java
    │   │   ├── repository/
    │   │   │   ├── UserRepository.java
    │   │   │   ├── RestaurantRepository.java
    │   │   │   ├── MenuItemRepository.java
    │   │   │   ├── CartRepository.java
    │   │   │   ├── CartItemRepository.java
    │   │   │   ├── OrderRepository.java
    │   │   │   └── OrderItemRepository.java
    │   │   ├── DTO/
    │   │   │   ├── AuthResponseDTO.java
    │   │   │   ├── UserRequestDTO.java / UserResponseDTO.java
    │   │   │   ├── RestaurantRequestDTO.java / RestaurantResponseDTO.java
    │   │   │   ├── MenuItemRequestDTO.java / MenuItemResponseDTO.java
    │   │   │   ├── CartItemRequestDTO.java / CartItemResponseDTO.java
    │   │   │   ├── CartResponseDTO.java / CartRequestDTO.java
    │   │   │   ├── OrderResponseDTO.java / PlaceOrderRequestDTO.java
    │   │   │   ├── OrderItemResponseDTO.java / OrderItemRequestDTO.java
    │   │   │   ├── OrderStatusUpdateRequestDTO.java
    │   │   │   └── QuantityUpdateRequestDTO.java
    │   │   └── exception/
    │   │       ├── BadRequestException.java
    │   │       ├── ResourceNotFoundException.java
    │   │       └── GlobalExceptionHandler.java
    │   └── resources/
    │       └── application.properties  # Configuration
    └── test/
        └── java/com/hackathon/hcl/
            └── HclApplicationTests.java
```

---

## 🚀 Getting Started

### Prerequisites
- **Frontend**: Node.js 16+ and npm
- **Backend**: Java 21 JDK, Maven 3.8.0+
- **Database**: MySQL 8.0+
- **IDE**: VS Code (Frontend), IntelliJ IDEA / Eclipse (Backend)

### Frontend Setup

```bash
# Navigate to project
cd food-ordering-app

# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Setup

```bash
# Navigate to project
cd hcl-b

# Set up database
# 1. Open MySQL
# 2. Create database: CREATE DATABASE hclhackathon;

# Build with Maven
mvn clean install

# Run Spring Boot (http://localhost:8080)
mvn spring-boot:run

# Or run directly
java -jar target/hcl-0.0.1-SNAPSHOT.jar
```

### Environment Configuration

**Frontend (src/services/api.js)**:
```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
// Default: http://localhost:5173/api → proxied to http://localhost:8080/api
```

**Backend (application.properties)**:
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/hclhackathon
spring.datasource.username=root
spring.datasource.password=Root@123

# JWT
app.jwt.secret=change-this-secret-key-for-production-min-32-chars
app.jwt.expiration-ms=3600000

# Email (Gmail example)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

---

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/new-feature`)
3. **Commit** changes (`git commit -m "Add new feature"`)
4. **Push** to branch (`git push origin feature/new-feature`)
5. **Open** a Pull Request

### Code Standards
- **Frontend**: ES6+, React Hooks, functional components
- **Backend**: Java 21 features, Spring annotations, DTO pattern
- **Commits**: Descriptive messages, atomic commits
- **Testing**: Unit tests for services, integration tests for controllers

### Reporting Issues
- Use GitHub Issues
- Include: OS, browser/JDK version, steps to reproduce, expected vs actual behavior

---

## 📝 License

This project is open source and available under the MIT License.

---

## 📧 Contact & Support

- **Email**: support@foodrush.local
- **GitHub Issues**: [Submit an issue](https://github.com/your-repo/issues)
- **Documentation**: [Wiki](#) (coming soon)

---

## 🙏 Acknowledgments

- **React Team** for React library
- **Spring Team** for Spring Boot framework
- **Tailwind Labs** for Tailwind CSS
- **JWT.io** for JWT authentication standards
- All contributors who've helped improve this project

---

## 🎓 Learning Resources

### Frontend Topics Covered
- React Hooks (useState, useContext, useEffect, useCallback)
- React Router (nested routes, protected routes, navigation)
- Axios interceptors (request/response transformation)
- Context API (state management without Redux)
- Tailwind CSS (utility-first styling)
- Form validation (client-side & server-side)
- Error handling & user feedback (Toast notifications)
- Responsive design (mobile-first)
- Image optimization (Base64 encoding)
- Animations (Framer Motion)

### Backend Topics Covered
- Spring Boot auto-configuration
- Spring Security (JWT, role-based access)
- Spring Data JPA (CRUD, custom queries)
- JPA entity relationships (1:N, N:1, 1:1)
- Transaction management (@Transactional)
- Exception handling (GlobalExceptionHandler)
- DTO pattern (separation of concerns)
- Email integration (SMTP)
- File uploads (multipart/form-data)
- RESTful API design
- Request validation (Bean Validation)
- Pagination & sorting
- Database design (schema, indexes, constraints)
- Concurrency handling (optimistic/pessimistic locking concepts)

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2024 | Initial release - Full stack food ordering platform |

---

## 📌 Future Enhancements

### Phase 2
- [ ] Real payment gateway integration (Stripe, Razorpay)
- [ ] Delivery partner management
- [ ] Real-time geolocation tracking
- [ ] Push notifications
- [ ] Mobile app (React Native / Flutter)
- [ ] Analytics dashboard

### Phase 3
- [ ] AI-based recommendation engine
- [ ] Subscription plans
- [ ] Loyalty rewards program
- [ ] Multi-restaurant checkout
- [ ] Inventory management system
- [ ] Inventory management system

### Phase 4
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] GraphQL API
- [ ] Machine learning order predictions
- [ ] Advanced fraud detection

---

**Happy Coding! 🚀**
