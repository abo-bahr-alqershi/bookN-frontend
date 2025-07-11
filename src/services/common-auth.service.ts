import axios from 'axios';
import type {
  LoginCommand,
  AuthResultDto,
  RefreshTokenCommand,
  ForgotPasswordCommand,
  ResetPasswordCommand,
  ResendEmailVerificationLinkCommand,
  ResendPasswordResetLinkCommand,
  VerifyEmailCommand,
  ChangePasswordCommand,
} from '../types/auth.types';
import type { ResultDto } from '../types/amenity.types';

// المسار الأساسي لتعاملات المصادقة
const API_BASE = '/api/common/auth';

export const CommonAuthService = {
  // تسجيل الدخول
  login: (data: LoginCommand) =>
    axios.post<ResultDto<AuthResultDto>>(`${API_BASE}/login`, data).then(res => res.data),

  // تحديث رمز المصادقة
  refreshToken: (data: RefreshTokenCommand) =>
    axios.post<ResultDto<AuthResultDto>>(`${API_BASE}/refresh-token`, data).then(res => res.data),

  // طلب إعادة تعيين كلمة المرور
  forgotPassword: (data: ForgotPasswordCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/forgot-password`, data).then(res => res.data),

  // إعادة تعيين كلمة المرور
  resetPassword: (data: ResetPasswordCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/reset-password`, data).then(res => res.data),

  // إعادة إرسال رابط التحقق من البريد الإلكتروني
  resendEmailVerification: (data: ResendEmailVerificationLinkCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/resend-email-verification`, data).then(res => res.data),

  // إعادة إرسال رابط استعادة كلمة المرور
  resendPasswordReset: (data: ResendPasswordResetLinkCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/resend-password-reset`, data).then(res => res.data),

  // التحقق من صحة عنوان البريد الإلكتروني
  verifyEmail: (data: VerifyEmailCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/verify-email`, data).then(res => res.data),

  // تغيير كلمة المرور
  changePassword: (data: ChangePasswordCommand) =>
    axios.post<ResultDto<boolean>>(`${API_BASE}/change-password`, data).then(res => res.data),
};