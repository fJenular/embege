const SECRET_KEY = process.env.SESSION_SECRET || "default_super_secret_session_key_for_catering_app_2026";

// Convert a string to an ArrayBuffer
function textToBuffer(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

// Import a raw key for HMAC signing and verification
async function getSigningKey(): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    textToBuffer(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface SessionPayload {
  id: string;
  email: string;
  role: string;
  exp: number;
}

/**
 * Creates a cryptographically signed token containing the payload.
 * Format is payloadBase64.signatureHex
 */
export async function signSession(payload: Omit<SessionPayload, "exp"> & { durationDays?: number }): Promise<string> {
  const duration = payload.durationDays || 1;
  const exp = Date.now() + duration * 24 * 60 * 60 * 1000;
  
  const fullPayload: SessionPayload = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
    exp
  };

  const dataStr = JSON.stringify(fullPayload);
  const key = await getSigningKey();
  
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    textToBuffer(dataStr)
  );

  // Convert signature buffer to hex string
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, "0")).join("");
  
  // Base64 encode the payload safely
  const payloadBase64 = typeof btoa !== "undefined"
    ? btoa(encodeURIComponent(dataStr))
    : Buffer.from(encodeURIComponent(dataStr)).toString("base64");

  return `${payloadBase64}.${signatureHex}`;
}

/**
 * Verifies the signature of the token and checks if it's expired.
 * Returns the decoded payload if valid, otherwise null.
 */
export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadBase64, signatureHex] = parts;
    const dataStr = typeof atob !== "undefined"
      ? decodeURIComponent(atob(payloadBase64))
      : decodeURIComponent(Buffer.from(payloadBase64, "base64").toString("utf-8"));

    const key = await getSigningKey();
    
    // Parse hex signature to Uint8Array
    const sigBytes = new Uint8Array(
      signatureHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      textToBuffer(dataStr)
    );

    if (!isValid) return null;

    const payload = JSON.parse(dataStr) as SessionPayload;

    // Check expiration
    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error("Session verification failed:", err);
    return null;
  }
}
