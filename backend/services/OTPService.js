const crypto = require('crypto');

class OTPService {
  static otpStore = new Map(); // In production, use Redis
  
  static generateOTP(sessionId, deviceId) {
    const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
    const expiryTime = Date.now() + (90 * 1000); // 90 seconds
    
    const otpData = {
      otp,
      sessionId,
      deviceId,
      expiryTime,
      used: false,
      createdAt: Date.now()
    };
    
    this.otpStore.set(otp, otpData);
    
    // Auto-cleanup expired OTPs
    setTimeout(() => {
      this.otpStore.delete(otp);
    }, 120 * 1000); // Clean up after 2 minutes
    
    return otp;
  }
  
  static async verifyOTP(otp, deviceId) {
    const otpData = this.otpStore.get(otp);
    
    if (!otpData) {
      return false; // OTP not found
    }
    
    if (otpData.used) {
      return false; // OTP already used
    }
    
    if (Date.now() > otpData.expiryTime) {
      this.otpStore.delete(otp);
      return false; // OTP expired
    }
    
    if (otpData.deviceId !== deviceId) {
      return false; // OTP not for this device
    }
    
    return true;
  }
  
  static async markOTPUsed(otp) {
    const otpData = this.otpStore.get(otp);
    if (otpData) {
      otpData.used = true;
      this.otpStore.set(otp, otpData);
    }
  }
  
  static getActiveOTPs() {
    const activeOTPs = [];
    const now = Date.now();
    
    for (const [otp, data] of this.otpStore.entries()) {
      if (!data.used && now < data.expiryTime) {
        activeOTPs.push({
          otp,
          sessionId: data.sessionId,
          timeLeft: Math.max(0, data.expiryTime - now)
        });
      }
    }
    
    return activeOTPs;
  }
}

module.exports = OTPService;