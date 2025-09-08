// note, lowercase to match route, must be exactly `harvestmobile://applink`
import { useAuth } from "@/components/context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
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
  // Ensure http/https, drop trailing slash, strip hash
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
  const { login } = useAuth(); // use auth context so we can notify it of login
  const [status, setStatus] = useState("Authenticating…");
  const [hasFailed, setHasFailed] = useState(false);
  const didRun = useRef(false); // avoid double-run in StrictMode

  useEffect(() => {
    console.log("local params:", { code, baseUrl });
    console.log("didRun:", didRun.current);

    if (didRun.current) return;
    didRun.current = true;

    console.log("local params:", { code, baseUrl });

    (async () => {
      try {
        if (!code || !baseUrl) {
          setStatus("Missing code or baseUrl.");
          setHasFailed(true);
          didRun.current = false; // Reset on failure to allow retry
          return;
        }

        // Normalize/sanitize
        const normalizedBase = normalizeBaseUrl(String(baseUrl));
        const codeStr = String(code);

        // Hit POST {baseUrl}/api/getapi/{code}
        setStatus("Linking your device…");

        console.log(codeStr, normalizedBase);
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 12000); // 12s timeout

        const res = await fetch(
          `${normalizedBase}/api/getapi/${encodeURIComponent(codeStr)}`,
          {
            method: "GET", // TODO: should be POST soon
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
          }
        ).finally(() => clearTimeout(t));

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            `Link failed (${res.status}). ${text?.slice(0, 200)}`
          );
        }

        const data = (await res.json()) as LinkSuccess;
        const { apiKey, team } = data;

        if (!apiKey || !team) {
          throw new Error("Response missing apiKey or team.");
        }

        // Persist securely under auth-{team}
        await login({
          token: String(apiKey),
          team: String(team),
          apiBaseUrl: normalizedBase,
        });

        setStatus("Linked successfully. Redirecting…");

        router.replace("/"); // nav to home, which is the index tab
      } catch (err: any) {
        setStatus("Authentication failed.");
        setHasFailed(true);
        didRun.current = false; // Reset on failure to allow retry
        Alert.alert("Authentication failed", err?.message ?? "Unknown error");
      }
    })();
  }, [code, baseUrl, login]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <ActivityIndicator />
      <Text style={{ marginTop: 16 }}>{status}</Text>
      {hasFailed && (
        <TouchableOpacity
          style={{
            marginTop: 24,
            paddingVertical: 12,
            paddingHorizontal: 24,
            backgroundColor: "#007AFF",
            borderRadius: 8,
          }}
          onPress={() => router.replace("/")}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
