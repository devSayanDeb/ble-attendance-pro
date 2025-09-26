import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BluetoothScanner from './components/BluetoothScanner';
import AttendanceForm from './components/AttendanceForm';
import DeviceFingerprint from './utils/DeviceFingerprint';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [beaconData, setBeaconData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Generate device fingerprint on app load
    const fingerprint = DeviceFingerprint.generate();
    setDeviceInfo(fingerprint);
  }, []);

  const handleBeaconFound = (beacon) => {
    setBeaconData(beacon);
    setIsScanning(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              BLE Attendance System
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
              Smart Attendance with Physical Presence Verification
            </Typography>
            
            {!beaconData ? (
              <BluetoothScanner 
                onBeaconFound={handleBeaconFound}
                isScanning={isScanning}
                setIsScanning={setIsScanning}
              />
            ) : (
              <AttendanceForm 
                beaconData={beaconData}
                deviceInfo={deviceInfo}
                onReset={() => setBeaconData(null)}
              />
            )}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;