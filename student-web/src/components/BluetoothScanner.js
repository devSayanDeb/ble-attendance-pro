import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import BluetoothSearchingIcon from '@mui/icons-material/BluetoothSearching';

const BluetoothScanner = ({ onBeaconFound, isScanning, setIsScanning }) => {
  const [error, setError] = useState('');
  const [bluetoothSupported, setBluetoothSupported] = useState(true);

  const scanForBeacons = async () => {
    try {
      setError('');
      setIsScanning(true);
      
      // Check if Web Bluetooth is supported
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth is not supported in this browser');
      }

      // Request device with teacher beacon service
      const device = await navigator.bluetooth.requestDevice({
        filters: [{
          services: ['12345678-1234-1234-1234-123456789abc'] // Custom service UUID
        }],
        optionalServices: ['battery_service']
      });

      console.log('Found device:', device.name);
      
      // Connect to device
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('12345678-1234-1234-1234-123456789abc');
      const characteristic = await service.getCharacteristic('87654321-4321-4321-4321-cba987654321');
      
      // Read OTP from characteristic
      const value = await characteristic.readValue();
      const otp = new TextDecoder().decode(value);
      
      onBeaconFound({
        deviceName: device.name,
        otp: otp,
        timestamp: Date.now(),
        deviceId: device.id
      });
      
    } catch (err) {
      console.error('Bluetooth scan error:', err);
      setError(err.message || 'Failed to scan for beacons');
      if (err.message.includes('not supported')) {
        setBluetoothSupported(false);
      }
    } finally {
      setIsScanning(false);
    }
  };

  if (!bluetoothSupported) {
    return (
      <Box textAlign="center">
        <Alert severity="error" sx={{ mb: 2 }}>
          Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera.
        </Alert>
      </Box>
    );
  }

  return (
    <Box textAlign="center">
      <Typography variant="h6" gutterBottom>
        Scan for Teacher's Beacon
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Make sure you're within 30 feet of your teacher's device and Bluetooth is enabled.
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Chip 
          icon={<BluetoothIcon />} 
          label="Range: 10-30 feet" 
          variant="outlined" 
          color="primary"
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        size="large"
        onClick={scanForBeacons}
        disabled={isScanning}
        startIcon={isScanning ? <CircularProgress size={20} /> : <BluetoothSearchingIcon />}
        sx={{ minWidth: 200 }}
      >
        {isScanning ? 'Scanning...' : 'Scan for Beacon'}
      </Button>
      
      {isScanning && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Looking for classroom beacon...
        </Typography>
      )}
    </Box>
  );
};

export default BluetoothScanner;