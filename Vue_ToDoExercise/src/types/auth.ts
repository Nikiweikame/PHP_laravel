// scr/types/auth.ts
export interface LoginData {
  user_id: string
  password: string
}

export interface SecurityQuestion {
  security_question_id: string
  security_answer: string
}

export interface ForgetPasswordData extends LoginData, SecurityQuestion {}

export interface RegisterData extends ForgetPasswordData {
  nickname: string
  weight: number
}

export interface ChangeSecurityQuestion extends SecurityQuestion {
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
