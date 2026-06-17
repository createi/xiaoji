export function formatPrice(price: number): string {
  return (price / 100).toFixed(2);
}

export function formatPriceYuan(price: number): string {
  return price.toFixed(2);
}

export function truncate(str: string, len: number): string {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function navigateTo(url: string) {
  uni.navigateTo({ url });
}

export function redirectTo(url: string) {
  uni.redirectTo({ url });
}

export function switchTab(url: string) {
  uni.switchTab({ url });
}

export function checkLogin(): boolean {
  const token = uni.getStorageSync('token');
  if (!token) {
    uni.navigateTo({ url: '/pages/users/login/index' });
    return false;
  }
  return true;
}
