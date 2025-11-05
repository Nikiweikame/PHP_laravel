// API 相關設定
export const API_URL = 'http://127.0.0.1:8000/api'
// 運動紀錄相關
export const RECORDS_ENDPOINT = `${API_URL}/exerciseRecords`

export const ITEMS_ENDPOINT = `${API_URL}/exerciseTypes`
// 登入、註冊、個人資料等
export const LOGIN_ENDPOINT = `${API_URL}/login`
export const LOGOUT_ENDPOINT = `${API_URL}/logout`
export const REGISTER_ENDPOINT = `${API_URL}/register`
export const PROFILE_ENDPOINT = `${API_URL}/profile`
export const SECURITY_QUESTION_ENDPOINT = `${API_URL}/securityQuestion`
export const RENEWPASSWORD_ENDPOINT = `${API_URL}/password/renew`
export const UPDATEPASSWORD_ENDPOINT = `${API_URL}/password/update`
export const RESTETPASSWORD_ENDPOINT = `${API_URL}/reset-password`
