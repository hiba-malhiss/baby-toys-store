# Store Front – Simple Flows

## Authentication

- Login returns an access token in the response body and sets a refresh token in an HTTP‑only cookie.
- Refresh reads the refresh cookie and returns a new access token; a new refresh cookie is set.
- Logout clears the refresh cookie.

## Product Listing

- Read filters from the URL (category, price range, discounts, attributes, search, sort, page).
- Attributes are sent as a single JSON string mapping: typeId -> [valueIds].
- Fetch products with those filters and show a paginated list.

## Product Details

- Open by product ID and show images, localized name/description, price, and variant stock.
- Load related products with infinite scroll.

## Wishlist

- Toggle items in wishlist and reflect changes instantly.
- Persist for authenticated users; guests see UI state only.

## Cart (Guest & User)

- Add variant with quantity; validate stock on add/update.
- If logged in, send Authorization header.
- If guest, send a cart token header so the backend can resolve the guest cart.

## Checkout

- Fill shipping information and select town.
- Optionally apply a coupon.
- Place order:
  - Logged‑in: order links to the user.
  - Guest: order stores guestId; confirmation email sent if provided.

## Orders

- List user orders with pagination and filter by month.
- Allow cancel when status is Pending.
- Support buy‑again for available items.

## Reviews

- Add/edit review only after Delivered and within the allowed window.
- One review per order item; editable while allowed.

## Localization

- Requests include the preferred language.
- Product names/descriptions are localized in the UI.
