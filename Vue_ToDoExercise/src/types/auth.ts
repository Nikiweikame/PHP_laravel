export interface RegisterData {
  user_id: string
  password: string
  nickname: string
  weight: number
  security_question_id: string
  security_answer: string
}

export interface SecurityQuestion {
  id: number
  security_question: string
}