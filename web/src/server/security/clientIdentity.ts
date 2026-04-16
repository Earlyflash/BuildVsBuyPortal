import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

function readClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

export function getClientIdentity(request: NextRequest): string {
  const ip = readClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const rawIdentity = `${ip}:${userAgent}`;

  return createHash("sha256").update(rawIdentity).digest("hex").slice(0, 32);
}
