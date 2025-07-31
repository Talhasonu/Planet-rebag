[No content]
# Planet Rebag

Welcome to the **Planet Rebag** project! This document provides a comprehensive overview of the codebase, including all Markdown documentation and a detailed explanation of the project structure and its key files and folders.

---

#codebase

Explore the full structure of Planet Rebag! Here are the main folders and files that power the app:

## Folders

- **app/**: Main application source code, including screens, layouts, navigation, and tabs.
- **assets/**: Static assets (fonts, images, SVGs) for UI and branding.
- **components/**: Reusable React components for UI and logic, including AddItems, DealScreen, HomeScreen, and UI subcomponents.
- **constants/**: Centralized color palette and style constants.
- **contexts/**: React context providers for global state management (e.g., authentication).
- **hooks/**: Custom React hooks for color scheme, theme, and web support.
- **scripts/**: Utility scripts for project maintenance (e.g., reset-project.js).
- **utils/**: Utility functions and helpers (e.g., Firebase config, toast notifications).

## Key Files

- **global.css**: Tailwind CSS base styles for the app.
- **tailwind.config.js**: Tailwind CSS configuration (custom colors, paths).
- **babel.config.js**: Babel configuration for Expo and React Native.
- **metro.config.js**: Metro bundler configuration, including SVG support.
- **tsconfig.json**: TypeScript configuration and path aliases.
- **package.json**: Project dependencies, scripts, and metadata.
- **package-lock.json**: Dependency lock file for reproducible installs.
- **declarations.d.ts**: TypeScript module declarations for importing asset files (SVG, PNG, JPG, JPEG).
- **nativewind-env.d.ts**: NativeWind type declarations (auto-generated for styling).
- **expo-env.d.ts**: Expo environment type declarations.
- **google-services.json**: Firebase configuration for Android integration.

---

## 📁 Project Structure & File Explanations

This project is organized for clarity, scalability, and maintainability. Below is a professional overview of each folder and key file, describing its purpose and how it fits into the overall application.

### Folders

- **app/**: Main application source code, including all screens, layouts, and navigation logic.
  - **_layout.tsx**: Root layout for the app, sets up navigation and global wrappers.
  - **+not-found.tsx**: Custom 404 page for handling unknown routes.
  - **index.tsx**: Entry point for the app's main screen.
  - **(tabs)/**: Contains tab navigation logic and related screens.
  - **screen/**: Houses all screen components.
    - **(auth)/**: Authentication-related screens (login, signup, OTP verification, password reset, email verification, etc.).
    - **home/**: Home screen(s) and related components.

- **assets/**: Static assets used throughout the app.
  - **fonts/**: Custom font files (e.g., SpaceMono-Regular.ttf).
  - **images/**: App images and SVGs (icons, logos, splash screens, etc.).

- **components/**: Reusable React components for UI and logic.
  - **ui/**: UI-specific components such as icons and tab bar backgrounds.
  - **Collapsible.tsx**: Collapsible/expandable UI component.
  - **ExternalLink.tsx**: Component for rendering external links.
  - **HapticTab.tsx**: Tab component with haptic feedback.
  - **HelloWave.tsx**: Animated greeting component.
  - **OTPInput.tsx**: Input component for OTP codes.
  - **ParallaxScrollView.tsx**: Parallax scrolling view component.
  - **ProtectedRoute.tsx**: Route guard for protected screens.
  - **ThemedText.tsx**: Text component with theme support.
  - **ThemedView.tsx**: View component with theme support.

- **config/**: Configuration files for third-party services and app-wide settings.
  - **firebase.ts**: Firebase configuration and initialization.
  - **toastConfig.tsx**: Toast notification configuration.

- **constants/**: Centralized constants for colors, styles, and other values.
  - **Colors.ts**: Color palette and theme constants.

- **contexts/**: React context providers for global state management.
  - **AuthContext.tsx**: Authentication context and provider.

- **hooks/**: Custom React hooks for reusable logic.
  - **useColorScheme.ts**: Hook for detecting color scheme (light/dark mode).
  - **useColorScheme.web.ts**: Web-specific color scheme hook.
  - **useThemeColor.ts**: Hook for accessing theme colors.

- **scripts/**: Utility scripts for project maintenance.
  - **reset-project.js**: Script to reset the project to a starter state.

- **services/**: Service classes for business logic and API integration.
  - **EmailService.ts**: Handles email sending logic (e.g., via EmailJS or SendGrid).
  - **FirebaseAuthService.ts**: Handles Firebase authentication logic.

- **utils/**: Utility functions and helpers.
  - **toast.ts**: Toast notification utility.

### Key Files (Project Root)

- **global.css**: Tailwind CSS base styles for the app.
- **tailwind.config.js**: Tailwind CSS configuration (custom colors, paths, etc.).
- **babel.config.js**: Babel configuration for Expo and React Native.
- **metro.config.js**: Metro bundler configuration, including SVG support.
- **tsconfig.json**: TypeScript configuration and path aliases.
- **package.json**: Project dependencies, scripts, and metadata.
- **package-lock.json**: Dependency lock file for reproducible installs.
- **declarations.d.ts**: TypeScript module declarations for importing asset files (SVG, PNG, JPG, JPEG).
- **nativewind-env.d.ts**: NativeWind type declarations (auto-generated for styling).
- **expo-env.d.ts**: Expo environment type declarations.
- **README.md**: This documentation file.

---

## 📦 Key Files Explained

- **`app/`**: Contains all app screens, layouts, and navigation logic.
- **`components/`**: Reusable UI and logic components (e.g., buttons, inputs, icons).
- **`config/`**: App configuration files (Firebase, Toast notifications).
- **`constants/`**: Centralized color and style constants.
- **`contexts/`**: React context providers for global state (e.g., authentication).
- **`hooks/`**: Custom React hooks for color scheme, theme, etc.
- **`services/`**: Service classes for EmailJS and Firebase authentication logic.
- **`utils/`**: Utility functions (e.g., toast notifications).
- **`assets/`**: Images, fonts, and other static resources.
- **`global.css`**: Tailwind CSS base styles.
- **`tailwind.config.js`**: Tailwind CSS configuration for custom colors and paths.
- **`babel.config.js`**: Babel configuration for Expo and React Native.
- **`metro.config.js`**: Metro bundler config, including SVG support.
- **`tsconfig.json`**: TypeScript configuration and path aliases.
- **`package.json`**: Project dependencies, scripts, and metadata.
- **`declarations.d.ts`**: TypeScript declarations for importing SVG, PNG, JPG, JPEG files.
- **`nativewind-env.d.ts`**: NativeWind type declarations (auto-generated).
- **`expo-env.d.ts`**: Expo environment type declarations.

---

## 📝 How to Use This Codebase

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm start
   ```
3. **Read the Markdown guides** for setup, troubleshooting, and implementation details.
4. **Explore the `app/` and `components/` folders** to understand the main app logic and UI.

---


## 📚 Additional Resources

All setup, troubleshooting, and implementation documentation is now included in this `README.md` file. For any further information, please refer to the relevant sections above.

---

**Happy coding!**
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
