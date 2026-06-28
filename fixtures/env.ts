export const ENV = process.env.ENV || 'uat';
export const isUAT  = ENV === 'uat';
export const isProd = ENV === 'prod';
export const otpBypass = process.env.OTP_BYPASS === 'true';
export const hasCaptcha = process.env.CAPTCHA === 'true';
// 用法: test.skip(otpBypass, 'OTP 被 bypass，此測需真 OTP 環境');
