# Baby Toys Store – React Template

A modern, modular, and fully customizable React + TypeScript template for a baby toy store. Designed for rapid prototyping, easy customization, and best practices in code organization, styling, and scalability.

---

> **Note:**
> This template currently includes only the Home Page. All data is mock data and intended for prototyping and demonstration purposes. Additional pages and features can be added as needed.

## Features

- ⚛️ **React 19** with TypeScript
- ⚡ **Vite** for fast development and builds
- 🎨 **SCSS Modules** with [SUIT CSS](https://suitcss.github.io/) naming convention
- 🧩 **Component-based architecture** (atomic design)
- 🗂️ **Centralized mock data** for easy prototyping
- 🧹 **Consistent folder and file naming**
- 🛠️ **ESLint & Prettier** for code quality
- 🌍 **StoreConfigurationContext** for global currency and shipping settings

---

## Getting Started

### Prerequisites

- Node.js 18.x
- npm

### Installation

```sh
npm install
```

### Development

```sh
npm run start
```

### Build

```sh
npm run build
```

---

## Project Structure & Organization

This template is organized for clarity, scalability, and maintainability.

```
src/
  assets/           # Images, icons, fonts
  components/       # Reusable UI components (Button, Card, etc.)
    common/         # Atomic/common components
  context/          # React contexts (StoreConfigurationContext for currency/shipping)
  mock-data/        # All mock data for prototyping
  pages/            # Page-level and section components
    HomePage/       # Home page and its sections
  styles/           # Global/shared SCSS (colors, spacing, reset)
  types/            # TypeScript types and interfaces
```

### Folder & File Naming

- **Folders:** Use kebab-case (e.g., mock-data, home-page, top-picks-section).
- **Files:** Use kebab-case for SCSS and types, PascalCase for React components.
- **SCSS Modules:** `[component-name].module.scss` for component-scoped styles.
- **Global SCSS:** `[purpose].scss` for shared styles (e.g., colors.scss, spacing.scss).

### SUIT CSS Naming Convention

- All CSS classes follow the [SUIT CSS](https://suitcss.github.io/) convention for clarity and scalability.
- Example: `.button`, `.button--primary`, `.banner-Wrapper-center`
- Class names are exported as camelCase in JS/TS via Vite’s `localsConvention: 'camelCaseOnly'` setting.
-  ComponentName
-  ComponentName--modifier
-  ComponentName-descendant
-  ComponentName.is-state
---

## Customization

- **Mock Data:** All mock data is in `src/mock-data/`. Replace or extend as needed.
- **Theming:** Update `src/styles/colors.scss` for your brand colors.
- **Components:** Add or modify components in `src/components/common/` or section components in `src/pages/HomePage/`.
- **Currency/Shipping:** Use the `StoreConfigurationContext` to access global currency and shipping settings throughout the app.

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Credits
- [Design - Figma](https://www.figma.com/community/file/1380032564098282114)

## Sync valid in stock : 
Shop Page	✅ Yes	Display accurate stock per product Details Page	✅ Yes	Show correct quantity options
Cart Page	✅ Yes	Validate and adjust quantities if needed
Checkout Page	✅ Yes	Re-validate before payment
Place Order (API)	✅ Yes	Final server-side validation