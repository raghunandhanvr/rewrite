interface RequestPayload {
  text: string;
  style: string;
}

async function generateKey(secret: string): Promise<CryptoKey> {
  if (!secret) {
    throw new Error("Configuration error. Please contact support.");
  }
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signData(key: CryptoKey, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

export async function createRequestSignature(payload: RequestPayload, timestamp: number): Promise<string> {
  const secretKey = process.env.TOP_SECRET;
  if (!secretKey) {
    throw new Error("Configuration error. Please contact support.");
  }
  const data = `${JSON.stringify(payload)}${timestamp}`;
  const key = await generateKey(secretKey);
  return await signData(key, data);
}

export async function verifyRequestSignature(payload: RequestPayload, timestamp: number, signature: string): Promise<boolean> {
  const secretKey = process.env.TOP_SECRET;
  if (!secretKey) {
    throw new Error("Configuration error. Please contact support.");
  }

  const currentTimestamp = Date.now();
  if (Math.abs(currentTimestamp - timestamp) > 10 * 1000) {
    return false;
  }

  const data = `${JSON.stringify(payload)}${timestamp}`;
  const key = await generateKey(secretKey);
  const expectedSignature = await signData(key, data);

  return signature === expectedSignature;
}