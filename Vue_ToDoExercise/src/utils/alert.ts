// src/utils/alert.ts
import Swal, { type SweetAlertIcon } from 'sweetalert2'

export function showAlert(
  icon: SweetAlertIcon,
  title: string,
  text?: string,
  timer = 2000
) {
  return Swal.fire({
    icon,
    title,
    text,
    timer,
    showConfirmButton: false,
    timerProgressBar: true,
    toast: true,
    position: 'top-end',
    background: '#fff',
  })
}

export function alertSuccess(title: string, text?: string) {
  return showAlert('success', title, text)
}

export function alertError(title: string, text?: string) {
  return showAlert('error', title, text)
}

export function alertWarning(title: string, text?: string) {
  return showAlert('warning', title, text)
}

export function alertInfo(title: string, text?: string) {
  return showAlert('info', title, text)
}


export function confirmDialog(
  title: string,
  text?: string,
  icon: SweetAlertIcon = 'warning',
  confirmButtonText = '確定',
  cancelButtonText = '取消'
): Promise<boolean> {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then((result) => result.isConfirmed)
}