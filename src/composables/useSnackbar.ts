import { useNotifications } from '@vuetify/v0'

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info'

export interface SnackbarOptions {
  subject: string
  severity?: SnackbarSeverity
  timeout?: number
}

interface ReturnTypeSnackBar {
  show: ({ subject, severity, timeout }: SnackbarOptions) => void
  success: (subject: string, timeout?: number) => void
  error: (subject: string, timeout?: number) => void
  warning: (subject: string, timeout?: number) => void
  info: (subject: string, timeout?: number) => void
}

export function useSnackbar(): ReturnTypeSnackBar {
  const notifications = useNotifications()

  function show({ subject, severity = 'info', timeout }: SnackbarOptions): void {
    notifications.send({
      subject,
      severity,
      timeout: timeout ?? 3300,
    })
  }

  function success(subject: string, timeout?: number): void {
    show({ subject, severity: 'success', timeout })
  }

  function error(subject: string, timeout?: number): void {
    show({ subject, severity: 'error', timeout })
  }

  function warning(subject: string, timeout?: number): void {
    show({ subject, severity: 'warning', timeout })
  }

  function info(subject: string, timeout?: number): void {
    show({ subject, severity: 'info', timeout })
  }

  return { show, success, error, warning, info }
}
