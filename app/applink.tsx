// note, lowercase to match route, must be exactly `harvestmobile://applink`
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

type LinkSuccess = {
  token: string;
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

async function saveAuth(
  team: string,
  payload: { token: string; team: string; baseUrl: string }
) {
  // TODO
}

export default function AppLinkScreen() {
  const { code, baseUrl } = useLocalSearchParams<{
    code?: string;
    baseUrl?: string;
  }>();
  const [status, setStatus] = useState("Authenticating…");
  const didRun = useRef(false); // avoid double-run in StrictMode

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    (async () => {
      try {
        if (!code || !baseUrl) {
          setStatus("Missing code or baseUrl.");
          return;
        }

        // Normalize/sanitize
        const normalizedBase = normalizeBaseUrl(String(baseUrl));
        const codeStr = String(code);

        // Hit POST {baseUrl}/link/{code}
        setStatus("Linking your device…");
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 12000); // 12s timeout

        const res = await fetch(
          `${normalizedBase}/link/${encodeURIComponent(codeStr)}`,
          {
            method: "POST",
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
        const { token, team } = data;

        if (!token || !team) {
          throw new Error("Response missing token or team.");
        }

        // Persist securely under auth-{team}
        await saveAuth(String(team), {
          token: String(token),
          team: String(team),
          baseUrl: normalizedBase,
        });

        setStatus("Linked successfully. Redirecting…");

        // Navigate wherever makes sense in your app:
        // e.g., tabs home, dashboard, etc.
        router.replace("/"); // change to "/(tabs)/home" or similar
      } catch (err: any) {
        setStatus("Authentication failed.");
        Alert.alert("Authentication failed", err?.message ?? "Unknown error");
      }
    })();
  }, [code, baseUrl]);

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
    </View>
  );
}
