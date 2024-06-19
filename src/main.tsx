import "@rainbow-me/rainbowkit/styles.css";

import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import App from "./App.tsx";
import "./base.css";
import { config, parentChain } from "./config.ts";

const queryClient = new QueryClient();

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
              accentColor: "var(--color-accent)",
              accentColorForeground: "var(--color-accent-fg)",
              overlayBlur: "small",
            }),
            darkMode: darkTheme({
              borderRadius: "medium",
              accentColor: "var(--color-accent-dark)",
              accentColorForeground: "var(--color-accent-fg-dark)",
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
