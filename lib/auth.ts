import "server-only";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export type UserRole =
  | "CUTTING_SUPERVISOR"
  | "CUTTING_VERIFIER"
  | "SEWING_SUPERVISOR";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
};

export async function createToken(user: AuthUser) {
  return new SignJWT({
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get("apparel-flow-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (
      !payload.sub ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.fullName !== "string"
    ) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role as UserRole,
      fullName: payload.fullName,
    };
  } catch {
    return null;
  }
}