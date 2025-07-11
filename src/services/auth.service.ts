// خدمات المصادقة وتسجيل الدخول (Auth Service)
// جميع الدوال موثقة بالعربي وتدعم العمليات الأساسية
import type { LoginCommand, AuthResultDto } from '../types/auth.types';

/**
 * دوال التعامل مع المصادقة وتسجيل الدخول عبر API
 */
export class AuthService {
  /** تسجيل الدخول والحصول على التوكنات */
  static async login(data: LoginCommand): Promise<AuthResultDto> {
    return fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json());
  }
}
