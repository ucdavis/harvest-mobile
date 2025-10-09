import { useAuth } from "@/components/context/AuthContext";
import { usePathname, Redirect } from "expo-router";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn} = useAuth();
  const pathname = usePathname();

  if (!isLoggedIn && !["/login", "/applink", "/not-found"].includes(pathname)) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}