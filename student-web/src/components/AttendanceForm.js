import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  LinearProgress,
  Chip,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import axios from 'axios';

const AttendanceForm = ({ beaconData, deviceInfo, onReset }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds timer
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  useEffect(() => {
    // Auto-fill OTP from beacon
    if (beaconData?.otp) {
      setOtp(beaconData.otp);
    }

    // Start 90-second countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setMessage('Time expired! Please scan the beacon again.');
          setMessageType('error');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [beaconData]);

  const submitAttendance = async () => {
    if (!rollNumber.trim()) {
      setMessage('Please enter your roll number');
      setMessageType('error');
      return;
    }

    if (timeLeft <= 0) {
      setMessage('Time expired! Please scan the beacon again.');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const attendanceData = {
        rollNumber: rollNumber.trim(),
        otp: otp,
        deviceInfo: deviceInfo,
        beaconData: beaconData,
        timestamp: Date.now(),
        timeRemaining: timeLeft
      };

      // TODO: Replace with actual API endpoint
      const response = await axios.post('/api/attendance/submit', attendanceData);
      
      if (response.data.success) {
        setMessage('Attendance marked successfully!');
        setMessageType('success');
        setTimeout(() => onReset(), 3000);
      } else {
        throw new Error(response.data.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Attendance submission error:', error);
      setMessage(error.response?.data?.message || 'Failed to submit attendance');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom align="center">
        Mark Your Attendance
      </Typography>
      
      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip 
            icon={<CheckCircleIcon />} 
            label={`Connected: ${beaconData?.deviceName}`} 
            color="success" 
            variant="outlined"
          />
          <Chip 
            icon={<TimerIcon />} 
            label={formatTime(timeLeft)} 
            color={timeLeft > 30 ? 'primary' : 'warning'}
          />
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={(timeLeft / 90) * 100} 
          color={timeLeft > 30 ? 'primary' : 'warning'}
        />
      </Paper>

      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Roll Number"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
        margin="normal"
        disabled={isSubmitting || timeLeft <= 0}
        autoFocus
      />

      <TextField
        fullWidth
        label="OTP (Auto-filled)"
        value={otp}
        margin="normal"
        disabled
        helperText="OTP received from teacher's beacon"
      />

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={submitAttendance}
          disabled={isSubmitting || timeLeft <= 0 || !rollNumber.trim()}
          sx={{ flex: 1 }}
        >
          {isSubmitting ? 'Submitting...' : 'Mark Attendance'}
        </Button>
        
        <Button
          variant="outlined"
          size="large"
          onClick={onReset}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AttendanceForm;