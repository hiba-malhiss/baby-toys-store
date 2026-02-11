# Store Front – Flows (Simple)

## Product Discovery

- Open the shop page.
- Read filters from the URL (category, price range, discounts, attributes, search text, sort).
- When the user changes a filter, update the URL and fetch the list again.
- Attributes are sent in one query key as a JSON string mapping: typeId -> [valueIds].
- The list is paginated and supports sorting (featured/newest/best/rating/etc.).

## Product Details

- Open a product page by ID.
- Show gallery, localized name/description, price, stock per variant.
- Track a public view for analytics.
- Show related products with infinite scroll.

## Wishlist

- Toggle add/remove from wishlist.
- Persist for logged-in users.
- For guests, show in UI but require login to sync to the account if needed.

## Cart (Guest and Logged-in)

- Add item with selected variant and quantity.
- For logged-in users, send Authorization header with each request.
- For guests, send a cart token header so the server can resolve the guest cart.
- Show cart drawer after add-to-cart and keep counts updated.
- Validate stock during add/update.

## Checkout

- Fill shipping info and select the town.
- Apply coupon (optional).
- Compute totals (subtotal, discount, shipping, total).
- Place order as:
  - Logged-in user → order links to the user.
  - Guest → order stores guestId; confirmation email is sent if provided.

## Orders

- List the current user’s orders (paginated).
- Filter by month (YYYY-MM).
- Cancel when status is Pending.
- Buy again by re-adding items to cart if available.

## Reviews

- Add/edit review only after Delivered and within the allowed window.
- One review per order item; edit allowed while within the window.

## Authentication (UI perspective)

- Login returns an access token in the response body and sets a refresh token in an HTTP-only cookie.
- UI adds the access token to the Authorization header for authenticated calls.
- Refresh request reads the refresh cookie automatically and returns a new access token; a new refresh cookie is set.
- Logout clears the refresh cookie.

## Localization

- Requests include the preferred language.
- Text and labels are translated on the client; product names/descriptions are localized.

## Guest Cart Token (UI perspective)

- On first visit as guest, request a cart token once and store it.
- Send the cart token header with cart/checkout calls so the backend can find or create the guest cart.
- When a refreshed cart token is returned by the server, replace the stored token to keep the session alive.
