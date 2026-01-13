// Simple auth utilities for admin dashboard
// In production, use proper authentication with database

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123", // In production, use hashed passwords
}

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export function generateToken(): string {
  return `admin_${Date.now()}_${Math.random().toString(36).substring(2)}`
}
