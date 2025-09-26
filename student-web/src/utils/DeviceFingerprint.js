class DeviceFingerprint {
  static generate() {
    const fingerprint = {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      screenResolution: `${screen.width}x${screen.height}`,
      screenColorDepth: screen.colorDepth,
      screenPixelDepth: screen.pixelDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      webglVendor: this.getWebGLVendor(),
      webglRenderer: this.getWebGLRenderer(),
      canvas: this.getCanvasFingerprint(),
      audioContext: this.getAudioFingerprint(),
      deviceMemory: navigator.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      connection: this.getConnectionInfo(),
      permissions: this.getPermissionsInfo(),
      plugins: this.getPluginsInfo(),
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      sessionId: this.generateSessionId()
    };

    return {
      ...fingerprint,
      hash: this.hashFingerprint(fingerprint)
    };
  }

  static getWebGLVendor() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'unknown';
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';
    } catch (e) {
      return 'unknown';
    }
  }

  static getWebGLRenderer() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'unknown';
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
    } catch (e) {
      return 'unknown';
    }
  }

  static getCanvasFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('BLE Attendance Canvas Test', 2, 2);
      return canvas.toDataURL().substring(0, 50);
    } catch (e) {
      return 'unknown';
    }
  }

  static getAudioFingerprint() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gain = audioContext.createGain();
      
      oscillator.connect(analyser);
      analyser.connect(gain);
      gain.connect(audioContext.destination);
      
      oscillator.frequency.value = 1000;
      gain.gain.value = 0;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      
      return Array.from(dataArray).slice(0, 20).join(',');
    } catch (e) {
      return 'unknown';
    }
  }

  static getConnectionInfo() {
    try {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (!connection) return 'unknown';
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      };
    } catch (e) {
      return 'unknown';
    }
  }

  static getPermissionsInfo() {
    // This is a placeholder - in production, you'd check specific permissions
    return {
      bluetooth: 'unknown',
      location: 'unknown',
      notifications: 'unknown'
    };
  }

  static getPluginsInfo() {
    try {
      return Array.from(navigator.plugins).map(plugin => plugin.name).join(',');
    } catch (e) {
      return 'unknown';
    }
  }

  static generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  static hashFingerprint(fingerprint) {
    // Simple hash function - in production, use crypto-js or similar
    const str = JSON.stringify(fingerprint);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }
}

export default DeviceFingerprint;