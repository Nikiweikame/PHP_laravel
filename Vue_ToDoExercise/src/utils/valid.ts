import type { UpdateData ,profileInformation,ChangeSecurityQuestion} from "@/types/auth"

export function validProfileData(modifyUser: profileInformation): UpdateData{
  const updateData: UpdateData = {}
  // --- 基本資料驗證 ---
  if (modifyUser.nickname && modifyUser.nickname.trim() !== '') {
    updateData.nickname = modifyUser.nickname.trim()
  }
  if (modifyUser.weight && modifyUser.weight > 0) {
    updateData.weight = modifyUser.weight
  }
  return updateData
}

export function validSecurityQuestionData(changeSecurityQuestionForm: ChangeSecurityQuestion): UpdateData{
  const updateData: UpdateData = {}
      if (
        changeSecurityQuestionForm.security_question_id &&
        changeSecurityQuestionForm.security_answer
      ) {
        updateData.security_question_id = changeSecurityQuestionForm.security_question_id
        updateData.security_answer = changeSecurityQuestionForm.security_answer.trim()
        updateData.password = changeSecurityQuestionForm.password
      }
  return updateData
}
