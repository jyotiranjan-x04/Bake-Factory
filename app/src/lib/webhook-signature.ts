import { createHmac, timingSafeEqual } from "node:crypto";

function parseSignature(signatureHeader: string, prefix?: string) {
  if (!prefix) {
    return signatureHeader.trim();
  }

  const expectedPrefix = `${prefix}=`;
  if (!signatureHeader.startsWith(expectedPrefix)) {
    return null;
  }

  return signatureHeader.slice(expectedPrefix.length).trim();
}

export function verifyHmacSha256Signature(input: {
  payload: string;
  signatureHeader: string | null;
  secret: string | undefined;
  headerPrefix?: string;
}) {
  const { payload, signatureHeader, secret, headerPrefix } = input;

  if (!signatureHeader || !secret) {
    return false;
  }

  const signature = parseSignature(signatureHeader, headerPrefix);
  if (!signature) {
    return false;
  }

  const expected = createHmac("sha256", secret).update(payload).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}
