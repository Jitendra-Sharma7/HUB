import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { randomBytes } from "crypto";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ id: string; name: string | null; email: string; role: string } | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return null;
  const valid = await verifyPassword(password, user.password);
  if (!valid) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ id: string; name: string | null; email: string; role: string } | null> {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return null;
  const hashed = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
    },
  });
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  // Store in a simple session table or use JWT
  return token;
}

export function getUserFromCookie(cookieHeader: string | null) {
  // Simple cookie-based auth
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").reduce((acc, c) => {
    const [k, v] = c.trim().split("=");
    if (k && v) acc[k] = decodeURIComponent(v);
    return acc;
  }, {} as Record<string, string>);
  return cookies;
}