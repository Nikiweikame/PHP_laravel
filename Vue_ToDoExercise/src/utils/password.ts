// src/utils/password.ts

export type PasswordStrength = 'weak' | 'medium' | 'strong'
/**
 * 密碼強度檢測函式
 * 規則：
 *  - 只含一種型態（小寫、大寫、數字） → 弱 (weak)
 *  - 含兩種型態 → 中 (medium)
 *  - 同時有 大寫 + 小寫 + 數字 → 強 (strong)
 */
export function checkPasswordStrength(pw: string): PasswordStrength {
      // 檢查是否包含小寫字母
      const hasLower = /[a-z]/.test(pw)
      // 檢查是否包含大寫字母
      const hasUpper = /[A-Z]/.test(pw)
      // 檢查是否包含數字
      const hasNumber = /[0-9]/.test(pw)

      // 計算符合條件的種類數（true 的個數）
      const typesCount = [hasLower, hasUpper, hasNumber].filter(Boolean).length

  if (pw.length === 0) return 'weak'
  if (typesCount === 1) return 'weak'
  if (typesCount === 2) return 'medium'
  return 'strong'
}
