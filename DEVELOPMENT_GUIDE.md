# Development Guide 🚀

## Quick Start

### Prerequisites
- Node.js 18+
- Modern browser with Web Bluetooth support (Chrome, Edge, Opera)
- Flutter SDK (for teacher app development)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/devSayanDeb/ble-attendance-pro.git
   cd ble-attendance-pro
   ```

2. **Student Web App Setup**
   ```bash
   cd student-web
   npm install
   npm start
   ```
   Opens at: http://localhost:3000

3. **Backend API Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```
   API runs at: http://localhost:5000

## Development Workflow

### Phase 1: Student Web Application (Current Focus)

**Completed ✅**
- React app structure with Material-UI
- Web Bluetooth API integration
- Device fingerprinting system
- 90-second countdown timer
- Basic attendance form
- PWA configuration

**Next Steps 📝**
1. Test Web Bluetooth functionality
2. Implement error handling
3. Add loading states
4. Create responsive design
5. Add offline support

### Phase 2: Backend Development

**Completed ✅**
- Express.js server setup
- Security services foundation
- OTP generation and validation
- Route structure
- Socket.io for real-time updates

**Next Steps 📝**
1. Google Sheets integration
2. n8n workflow setup
3. Security checks implementation
4. Rate limiting
5. Authentication system

### Phase 3: Teacher Flutter App

**Coming Next 🔜**
- Flutter project setup
- BLE beacon broadcasting
- Session management UI
- Real-time monitoring
- Cross-platform compatibility

## Testing Strategy

### Web Bluetooth Testing
1. **Browser Compatibility**
   - Chrome 56+ ✅
   - Edge 79+ ✅
   - Opera 43+ ✅
   - Firefox ❌ (not supported)
   - Safari ❌ (not supported)

2. **Device Testing**
   - Android devices with Chrome
   - Windows with Chrome/Edge
   - macOS with Chrome (limited)

3. **Range Testing**
   - Test beacon detection at 10-30 feet
   - Verify connection drops outside range
   - Test in different environments

### Security Testing
1. **Anti-Proxy Measures**
   - Device fingerprint uniqueness
   - IP address validation
   - Time pattern analysis
   - Browser spoofing detection

2. **Performance Testing**
   - Concurrent user handling
   - Database query optimization
   - Memory usage monitoring

## Architecture Decisions

### Why Web Bluetooth?
- No app installation required for students
- Cross-platform compatibility
- Direct device communication
- Secure proximity verification

### Why Flutter for Teacher App?
- Cross-platform development (iOS + Android)
- Native BLE broadcasting capabilities
- Fast development cycle
- Good performance

### Why Google Sheets (MVP)?
- Quick setup and deployment
- No database management overhead
- Easy data visualization
- Scalable to PostgreSQL later

## API Documentation

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
```

### Attendance Endpoints
```
POST /api/attendance/submit
GET  /api/attendance/history/:rollNumber
GET  /api/attendance/session/:sessionId
```

### Session Management
```
POST /api/sessions/create
GET  /api/sessions/active
PUT  /api/sessions/:id/close
```

### Security Monitoring
```
GET  /api/security/incidents
POST /api/security/report
```

## Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://...
GOOGLE_SHEETS_API_KEY=...
GOOGLE_SHEETS_ID=...

# Security
JWT_SECRET=your-super-secret-key
ENCRYPTION_KEY=...

# n8n Integration
N8N_WEBHOOK_URL=...
N8N_API_KEY=...
```

## Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Security headers configured
- [ ] Error monitoring setup

### Production Considerations
- Use PostgreSQL instead of Google Sheets
- Implement Redis for OTP storage
- Add comprehensive logging
- Set up monitoring and alerts
- Configure auto-scaling

## Troubleshooting

### Common Issues

1. **Web Bluetooth not working**
   - Ensure HTTPS (required for Web Bluetooth)
   - Check browser compatibility
   - Verify Bluetooth is enabled on device

2. **Beacon not found**
   - Check device proximity (10-30 feet)
   - Verify teacher app is broadcasting
   - Ensure same service UUID

3. **OTP expired**
   - 90-second time limit enforced
   - Refresh beacon connection
   - Check system time synchronization

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Frontend debug
localStorage.setItem('debug', 'true')
```

---

**Happy Coding! 🎉**