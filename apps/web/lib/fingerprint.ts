import fpPromise from "@fingerprintjs/fingerprintjs";

export async function getDeviceFingerprint(): Promise<string> {
  if (typeof window === "undefined") {
    return "server-side";
  }

  const cached = sessionStorage.getItem("device_fingerprint");
  if (cached) {
    return cached;
  }

  try {
    const fp = await fpPromise.load();
    const result = await fp.get();
    const visitorId = result.visitorId;
    sessionStorage.setItem("device_fingerprint", visitorId);
    return visitorId;
  } catch (error) {
    console.error("Failed to generate fingerprint:", error);
    return "unknown-device";
  }
}
