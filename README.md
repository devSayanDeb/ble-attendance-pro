# BLE Attendance Pro 🎯

> Production-ready Smart Attendance System using BLE Beacon Technology with Anti-Proxy Security

## 🚀 Project Overview

A sophisticated attendance management system that uses Bluetooth Low Energy (BLE) beacons to ensure physical presence while preventing proxy attendance through multiple security layers.

### Architecture Components

```
📱 Teacher Native App (Flutter)     📊 Backend Services (Node.js + n8n)
├── BLE Beacon Broadcasting        ├── Session Management
├── Session Management             ├── OTP Generation & Validation
└── Real-time Monitoring          ├── Security Checks
                                   ├── Google Sheets Integration
🌐 Student Web App (React PWA)     └── Real-time Analytics
├── Web Bluetooth API
├── Device Fingerprinting         📄 Database Layer
├── Anti-Proxy Detection          ├── Google Sheets (MVP)
└── Attendance Submission          └── PostgreSQL (Production)
```

## 🔧 Technology Stack

### Frontend
- **Teacher App**: Flutter (iOS/Android)
- **Student App**: React.js + PWA + Web Bluetooth API
- **UI Framework**: Material-UI / Tailwind CSS

### Backend
- **API Server**: Node.js + Express
- **Workflow Automation**: n8n
- **Authentication**: JWT + Firebase Auth
- **Real-time Communication**: Socket.io

### Database & Storage
- **Primary**: Google Sheets (MVP)
- **Production**: PostgreSQL + Redis
- **File Storage**: Cloudinary

## 🏗 Project Structure

```
ble-attendance-pro/
├── teacher-app/              # Flutter beacon app
│   ├── lib/
│   ├── android/
│   ├── ios/
│   └── pubspec.yaml
├── student-web/              # React PWA
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/                  # Node.js API
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   └── server.js
├── n8n-workflows/           # Automation workflows
├── docs/                    # Documentation
└── shared/                  # Shared utilities
```

## 🚀 Quick Start Guide

### Development Workflow
1. **Phase 1**: Student Web App (React + Web Bluetooth)
2. **Phase 2**: Teacher Native App (Flutter + BLE Broadcasting) 
3. **Phase 3**: Backend Services (Node.js + n8n)
4. **Phase 4**: Security & Production Deployment

### Next Steps
1. Clone this repository
2. Set up development environment
3. Start with student web application
4. Integrate Web Bluetooth API
5. Build security features

---

**Built with ❤️ by the BLE Attendance Pro Team**