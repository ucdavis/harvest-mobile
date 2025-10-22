import { useAuth } from "@/components/context/AuthContext";
import { isLinkCodeCompleted, markLinkCodeCompleted } from "@/lib/auth";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type LinkSuccess = {
  apiKey: string;
  team: string;
};

function normalizeBaseUrl(input: string) {
  const u = new URL(input);
  if (!/^https?:$/.test(u.protocol)) {
    throw new Error("baseUrl must be http(s)");
  }
  u.hash = "";
  const noTrailing = (u.origin + u.pathname).replace(/\/$/, "");
  return noTrailing;
}

export default function AppLinkScreen() {
  const { code, baseUrl } = useLocalSearchParams<{
    code?: string;
    baseUrl?: string;
  }>();
  const { login } = useAuth();
  const [status, setStatus] = useState("Authenticating…");
  const [hasFailed, setHasFailed] = useState(false);
  const didRun = useRef(false);

  useEffect(() => {
    WebBrowser.dismissBrowser();

    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let unmounted = false;

    if (didRun.current) return;
    didRun.current = true;

    (async () => {
      try {
        if (!code || !baseUrl) {
          setStatus("Missing code or baseUrl.");
          setHasFailed(true);
          didRun.current = false;
          return;
        }

        const codeStr = String(code);
        const alreadyCompleted = await isLinkCodeCompleted(codeStr);

        if (alreadyCompleted) {
          setStatus("Already authenticated. Redirecting…");
          router.replace("/");
          return;
        }

        const normalizedBase = normalizeBaseUrl(String(baseUrl));
        setStatus("Linking your device…");

        timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(
          `${normalizedBase}/api/getapi/${encodeURIComponent(codeStr)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
          }
        ).finally(() => {
          if (timeoutId) clearTimeout(timeoutId);
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Link failed (${res.status}). ${text?.slice(0, 200)}`);
        }

        const data = (await res.json()) as LinkSuccess;
        const { apiKey, team } = data;

        if (!apiKey || !team) {
          throw new Error("Response missing apiKey or team.");
        }

        await login({
          token: String(apiKey),
          team: String(team),
          apiBaseUrl: normalizedBase,
        });

        await markLinkCodeCompleted(codeStr);

        setStatus("Linked successfully. Redirecting…");
        router.replace("/");
      } catch (err: any) {
        if (unmounted) return;
        setStatus("Authentication failed.");
        setHasFailed(true);
        didRun.current = false;
        Alert.alert("Authentication failed", err?.message ?? "Unknown error");
      }
    })();

    return () => {
      unmounted = true;
      controller.abort();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [code, baseUrl, login]);

  return (
    <View className="flex-1 items-center justify-center p-6">
      <ActivityIndicator />
      <Text className="mt-4 text-base text-primaryfont/80">{status}</Text>

      {hasFailed && (
        <TouchableOpacity
          className="mt-6 py-3 px-6 bg-harvest rounded-lg"
          onPress={() => router.replace("/")}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
