import { useAuth } from "@/components/context/AuthContext";
import { Redirect, useSegments } from "expo-router";
import React from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const segments = useSegments() as string[];

  if (isLoggedIn === null || segments.length === 0) {
    return null; 
  }

  if (!isLoggedIn && !["login", "applink", "+not-found"].includes(segments[0])) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}