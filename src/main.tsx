import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config, parentChain } from "./config.ts";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";

import App from "./App.tsx";
import "./base.css";

const queryClient = new QueryClient();

type ThemeMode = "light" | "dark";

const accentColor = (mode: ThemeMode = "light") => {
  const lightColor = import.meta.env.VITE_BRIDGE_ACCENT_COLOR ?? "#FF0000";
  const darkColor = import.meta.env.VITE_BRIDGE_ACCENT_COLOR_DARK;
  return mode === "light" || !darkColor ? lightColor : darkColor;
};

const accentColorForeground = (mode: ThemeMode = "light") => {
  const lightColor =
    import.meta.env.VITE_BRIDGE_ACCENT_COLOR_FOREGROUND ?? "#FFFFFF";
  const darkColor = import.meta.env.VITE_BRIDGE_ACCENT_COLOR_FOREGROUND_DARK;
  return mode === "light" || !darkColor ? lightColor : darkColor;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          initialChain={parentChain.id}
          theme={{
            lightMode: lightTheme({
              borderRadius: "medium",
              accentColor: accentColor(),
              accentColorForeground: accentColorForeground(),
              overlayBlur: "small",
            }),
            darkMode: darkTheme({
              borderRadius: "medium",
              accentColor: accentColor("dark"),
              accentColorForeground: accentColorForeground("dark"),
              overlayBlur: "small",
            }),
          }}
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
