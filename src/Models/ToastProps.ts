export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export interface ToastState {
    message: string;
    type: 'success' | 'error' | 'info';
}