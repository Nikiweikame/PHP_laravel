// src/utils/password.ts

export type PasswordStrength = 'weak' | 'medium' | 'strong'

export function checkPasswordStrength(pw: string): PasswordStrength {
  const hasLower = /[a-z]/.test(pw)
  const hasUpper = /[A-Z]/.test(pw)
  const hasNumber = /[0-9]/.test(pw)

  const typesCount = [hasLower, hasUpper, hasNumber].filter(Boolean).length

  if (pw.length === 0) return 'weak'
  if (typesCount === 1) return 'weak'
  if (typesCount === 2) return 'medium'
  return 'strong'
}
