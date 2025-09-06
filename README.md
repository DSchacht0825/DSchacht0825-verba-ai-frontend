# Verba AI Frontend - Clinical Documentation Platform

The frontend web application for Verba AI's HIPAA-compliant clinical documentation platform.

## 🚀 Features

- **Professional Landing Page**: Marketing website with pricing and features
- **Clinical Dashboard**: Three-tab interface for Meeting Bot, Manual Recording, and Past Notes
- **Real-time Audio Recording**: Live transcription with AI note generation
- **Meeting Bot Integration**: Fathom-like interface for joining Zoom, Teams, Google Meet
- **Blue-Purple Gradient Design**: Modern, professional UI with glass morphism effects
- **Square Payment Integration**: Ready for production payments
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom gradients
- **TypeScript**: Full type safety (converted to JSX for compatibility)
- **Audio**: WebRTC for real-time recording
- **WebSocket**: Real-time communication with backend services
- **Payment**: Square integration with sandbox credentials

## 🏗️ Project Structure

```
├── app/
│   ├── page.jsx              # Landing page with pricing
│   ├── dashboard/
│   │   └── page.jsx          # Main dashboard interface
│   └── layout.jsx            # App layout and metadata
├── components/
│   ├── AudioRecorder.jsx     # Real-time recording component
│   └── MeetingIntegration.jsx # Meeting bot interface
├── public/                   # Static assets
├── tailwind.config.js        # Tailwind configuration
└── next.config.js           # Next.js configuration
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open Browser**
```
http://localhost:3000
```

## 🌐 Environment Configuration

The frontend connects to these backend services:
- **Audio Service**: `http://localhost:4000` (for transcription)
- **Meeting Bot Service**: `http://localhost:5001` (for meeting automation)

For production, update these URLs in:
- `components/AudioRecorder.jsx`
- `components/MeetingIntegration.jsx`

## 📱 Pages & Components

### Landing Page (`app/page.jsx`)
- Hero section with demo video
- Features showcase with gradient cards
- Pricing tiers ($20/$40/Custom with 50% early bird discount)
- HIPAA compliance information
- Square payment integration

### Dashboard (`app/dashboard/page.jsx`)
- **Meeting Bot Tab**: Calendar integration and automatic meeting joining
- **Manual Recording Tab**: Real-time audio recording with live transcription
- **Past Notes Tab**: History of generated clinical notes

### Components
- **AudioRecorder**: Handles microphone access, real-time recording, and displays live transcription
- **MeetingIntegration**: Manages meeting bot connections and calendar integration

## 🎨 Design System

### Color Scheme
- **Primary**: Blue to cyan gradients
- **Secondary**: Purple to indigo gradients  
- **Accent**: Green for success states
- **Background**: Gradient from blue-100 via purple-50 to indigo-100

### Key Features
- Glass morphism effects with backdrop blur
- Floating gradient orbs for depth
- Smooth hover animations and transitions
- Professional clinical documentation theme

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Manual Deployment
```bash
npm run build
npm run export  # For static hosting
```

### Environment Variables for Production
Update API endpoints in components to point to your production backend URLs.

## 🔌 API Integration

The frontend integrates with two backend services:

### Audio Service (Port 4000)
- WebSocket connection for real-time transcription
- REST endpoints for note generation
- Handles SOAP, DAP, BIRP, GIRP note templates

### Meeting Bot Service (Port 5001)  
- `/api/join-meeting` - Join Zoom/Teams/Meet automatically
- `/api/leave-meeting` - Leave active meeting
- `/api/active-meetings` - List active meeting bots

## 💰 Payment Integration

Square payment integration is configured with sandbox credentials:
- Application ID: `sandbox-sq0idb-JLnqIgbZOqBnmDjVHI7g-w`
- For production, replace with live Square credentials

## 📋 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Security Features

- HIPAA-compliant design patterns
- Secure WebSocket connections
- No sensitive data storage in localStorage
- Proper session management

## 📞 Support

- GitHub Issues: Use this repository for bug reports
- Email: support@verba-ai.com

---

**Ready for production deployment with full AI clinical documentation capabilities!**