export const API_URL = '/api';
export function errorMessage(error: any): string {
  return error?.error?.message || 'Không thể kết nối máy chủ. Vui lòng thử lại.';
}
