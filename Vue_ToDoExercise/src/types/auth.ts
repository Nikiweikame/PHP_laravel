// scr/types/auth.ts
export interface LoginData {
  account: string
  password: string
}

export interface SecurityQuestion {
  id: string
  security_question: string
}

export interface SecurityQA {
  security_question_id: string
  security_answer: string
}

export interface ForgetPasswordData extends LoginData, SecurityQA {}

export interface RegisterData extends ForgetPasswordData {
  nickname: string
  weight: number
}

export interface ChangeSecurityQuestion extends SecurityQA {
  password: string
}

export interface ChangePassword {
  password: string
  newPassword: string
}

export interface profileInformation {
  nickname: string
  account: string
  weight: number
}

export interface UpdateData {
  nickname?: string
  weight?: number
  security_question_id?: string
  security_answer?: string
  password?: string
}

export interface changePasswordData {
  old_password: string
  new_password: string
}
