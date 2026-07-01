import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || "https://tangible-husky-835.eu-west-1.convex.cloud";

export const convex = new ConvexReactClient(CONVEX_URL);

export function ConvexAppProvider({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
