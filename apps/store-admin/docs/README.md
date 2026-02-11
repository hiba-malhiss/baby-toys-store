# Store Admin – Simple Flows

## Authentication

- Admins sign in using the same access/refresh token flow as customers.
- Access token is returned in the response body. Refresh token is set as an HTTP‑only cookie.
- Refresh rotates the refresh token and returns a new access token.
- Logout clears the refresh cookie.

## Dashboard

- View KPIs, order status counts, daily revenue.
- Metrics are calculated from orders at the time of delivery.
- If an order is later cancelled/returned, delivery side‑effects are reverted.

## Catalog (Variant‑First)

- Create and edit products.
- Attach global options (e.g., Color, Size) to a product.
- Manage variants and their prices, stock, and images.
- Detach options/values from a product when needed.

## Images

- Upload or remove main product image.
- Manage gallery images.

## Orders

- List and filter orders.
- Update status with valid transitions (per `OrderStatusRules`).
- First move to Delivered sets the delivered time; aggregates are applied.
- Cancel/Return reverts side‑effects if they were applied.
- Edit items (quantity/remove) only in editable statuses; pricing is recalculated.
- Apply/Remove coupon; coupon usage is adjusted.

## Coupons

- Create and manage coupons with limits and validity windows.
- Applying a coupon to an order updates totals and tracks usage.

## Shipping

- Manage towns and zones, with active/inactive states and shipping fees.

## Users & Addresses

- View users and manage their saved addresses when needed.

## Finance & Expenses

- Add/remove expenses that affect net profit.
- Revenue/profit aggregates are applied on Delivered and reverted on Cancel/Return.

## Content & Settings

- Edit store settings (e.g., free shipping threshold, locale options).
- Manage home page content.
