const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const SecurityService = require('../services/SecurityService');
const GoogleSheetsService = require('../services/GoogleSheetsService');
const OTPService = require('../services/OTPService');

// Submit attendance
router.post('/submit', async (req, res) => {
  try {
    const { rollNumber, otp, deviceInfo, beaconData, timestamp } = req.body;
    
    // Validate required fields
    if (!rollNumber || !otp || !deviceInfo || !beaconData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Verify OTP
    const otpValid = await OTPService.verifyOTP(otp, beaconData.deviceId);
    if (!otpValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Run security checks
    const securityResult = await SecurityService.runSecurityChecks({
      rollNumber,
      deviceInfo,
      beaconData,
      timestamp,
      ipAddress: req.ip
    });

    if (!securityResult.passed) {
      // Log security incident
      await GoogleSheetsService.logSecurityIncident({
        rollNumber,
        reason: securityResult.reason,
        deviceInfo,
        timestamp,
        ipAddress: req.ip
      });
      
      return res.status(403).json({
        success: false,
        message: `Security check failed: ${securityResult.reason}`
      });
    }

    // Check for duplicates
    const isDuplicate = await GoogleSheetsService.checkDuplicate(
      rollNumber, 
      beaconData.sessionId
    );
    
    if (isDuplicate) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this session'
      });
    }

    // Save attendance record
    const attendanceRecord = {
      id: uuidv4(),
      rollNumber,
      sessionId: beaconData.sessionId,
      deviceId: beaconData.deviceId,
      timestamp,
      ipAddress: req.ip,
      deviceFingerprint: deviceInfo.hash,
      status: 'present'
    };

    await GoogleSheetsService.saveAttendance(attendanceRecord);
    
    // Mark OTP as used
    await OTPService.markOTPUsed(otp);

    res.json({
      success: true,
      message: 'Attendance marked successfully',
      data: {
        id: attendanceRecord.id,
        timestamp: attendanceRecord.timestamp
      }
    });

  } catch (error) {
    console.error('Attendance submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit attendance'
    });
  }
});

// Get attendance history for a student
router.get('/history/:rollNumber', async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const history = await GoogleSheetsService.getAttendanceHistory(rollNumber);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get attendance history'
    });
  }
});

module.exports = router;