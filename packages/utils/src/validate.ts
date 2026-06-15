/**
 * 手机号验证
 */
export function isPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 邮箱验证
 */
export function isEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * URL 验证
 */
export function isUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证码验证（4-6位数字）
 */
export function isCaptcha(code: string): boolean {
  return /^\d{4,6}$/.test(code);
}

/**
 * 密码强度验证（至少6位，包含字母和数字）
 */
export function isStrongPassword(pwd: string): boolean {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/.test(pwd);
}
