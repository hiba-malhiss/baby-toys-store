# Store Admin – README

## Admin Features

### Dashboard
- KPIs overview
- Daily revenue graph
- Order status counts
- Unique customers

### Products & Catalog
- Products: CRUD, activate/deactivate
- Price management and stock management
- Product images management
- Categories: CRUD
- Brands: CRUD
- Colors: CRUD
- Materials: CRUD

#### Pricing Management
- Edit product price and cost price
- Manage discounts via coupons (see Pricing & Promotions)
- Pricing auto-applies in orders based on current order items, coupon, and store free-shipping rules

### Orders
- List/filter/search orders
- View order details
- Update status: Processing/Shipped/Delivered/Cancelled/Returned
- Cancel/Return orders
- Edit items: update quantity/remove item
- Apply/Remove coupon on order

#### Order Editing Permissions
- Allowed only while order is in an admin-editable status per `OrderStatusRules` (non-terminal, pre-locked stages)
- Edit item quantity (recomputes pricing)
- Remove item (recomputes pricing; may cancel order if last item)
- Apply or remove coupon (adjusts coupon usage and re-prices)
- Update status (enforces valid transitions and sets deliveredAt on first Delivered)
- Pricing recalculates after each edit (subtotal, discount, shipping, total); free shipping applies by threshold

Backend references:
- Order domain/service: `toy-store-backend/src/main/java/com/pwn/toy/store/backend/order/service/OrderDomainService.java`
- Order status rules: `toy-store-backend/src/main/java/com/pwn/toy/store/backend/order/helpers/OrderStatusRules.java`
- Pricing helper: `toy-store-backend/src/main/java/com/pwn/toy/store/backend/order/helpers/OrderPricingHelper.java`
- Coupon utils: `toy-store-backend/src/main/java/com/pwn/toy/store/backend/order/helpers/CouponUtils.java`
- Inventory helper: `toy-store-backend/src/main/java/com/pwn/toy/store/backend/order/helpers/InventoryOptimisticHelper.java`

### Pricing & Promotions
- Coupons: CRUD
- Usage limits and usage tracking
- Validate coupons on orders

### Shipping
- Shipping options: CRUD
- Cost management
- Activate/Deactivate shipping options

### Users & Addresses
- Admin users: list/manage
- Addresses: manage user addresses (autofill support)

### Finance & Analytics
- Expenses management
- Monthly revenue aggregation (apply/rollback on Delivered)

### Content & Settings
- Home page content management
- Store settings (free shipping threshold, configuration)

### Communication
- Contact messages: receive and manage
- Search endpoints: product discovery support

### Security
- JWT auth (access + refresh), refresh rotation
- Bcrypt password hashing
- Rate limiting on auth endpoints
- HTTP-only cookies for refresh tokens
- CSRF protection
- Input validation

### Documentation Links
- Order flow details: `toy-store-backend/docs/ORDER_FLOW.md`
- Finance & profitability: `toy-store-backend/docs/FINANCE.md`
