import { useAuth } from "@/components/context/AuthContext";
import { Redirect, useSegments } from "expo-router";
import React from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const segments = useSegments() as string[];

  // Wait for auth to be determined
  if (isLoading || segments.length === 0) {
    return null; // should be fast (just reading from local secure storage) so no need for spinner
  }

  // Auth is determined, now check permissions
  const isPublicRoute = ["login", "applink", "+not-found"].includes(
    segments[0]
  );

  if (!isLoggedIn && !isPublicRoute) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}
