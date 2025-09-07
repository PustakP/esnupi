# Esnupi

A comprehensive AI-powered voice complaint management system with multiple integrated components for handling customer complaints through voice interactions and web interfaces.

## Project Structure

This project consists of three main components that work together:

### 1. Main Frontend (`/`)
Next.js-based web application for complaint management and dashboard
- **Framework**: Next.js 15.5.2 with React 19
- **Styling**: Tailwind CSS with Radix UI components
- **Database**: Supabase integration
- **Features**: Complaint dashboard, analytics, admin interface

### 2. Backend API (`/backend`)
Node.js/Express server handling API requests and AI processing
- **Runtime**: Node.js with Express 5
- **AI Integration**: Google Gemini AI
- **Database**: PostgreSQL with Supabase
- **Features**: Complaint processing, admin routes, AI-powered responses

### 3. Voice Agent (`/esnupi_voice`)
Standalone voice interaction application for AI-powered customer support
- **Framework**: Vite + TypeScript with Lit components
- **AI**: Google Generative AI integration
- **Features**: Voice-based complaint handling, real-time AI responses

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Supabase account
- Google Gemini API key

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install voice agent dependencies
cd esnupi_voice
npm install
cd ..
```

### 2. Environment Configuration

#### Backend Environment Setup
```bash
cd backend
# Copy the example environment file
cp env-example.txt .env
# Edit .env with your actual values:
# - Database connection string
# - Supabase credentials
# - Google Gemini API key
```

#### Voice Agent Environment Setup
```bash
cd esnupi_voice
# Create .env.local file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
```

### 3. Database Setup
Ensure your PostgreSQL database is running and accessible. The backend will handle table creation and migrations.

## Running the Application

**⚠️ IMPORTANT**: All three components must be running simultaneously for full functionality.

### Start All Services

#### Terminal 1: Main Frontend
```bash
npm run dev
```
Access at: http://localhost:3000

#### Terminal 2: Backend API
```bash
cd backend
npm run dev
```
Runs on: http://localhost:3001 (or configured port)

#### Terminal 3: Voice Agent
```bash
cd esnupi_voice
npm run dev
```
Access at: http://localhost:5173 (Vite default)

### Alternative: Using Concurrently (Recommended for Development)

You can create a simple script to run all services:

```bash
# In root package.json, add:
"dev:all": "concurrently \"npm run dev\" \"npm run dev:backend\" \"npm run dev:voice\""

# Then run:
npm run dev:all
```

## Development

### Main Frontend
- **Port**: 3000
- **Framework**: Next.js with Turbopack
- **Hot Reload**: Automatic on file changes

### Backend
- **Port**: 3001 (configurable)
- **Development**: Uses nodemon for auto-restart
- **API Routes**:
  - `/admin` - Administrative functions
  - `/complaints` - Complaint management

### Voice Agent
- **Port**: 5173
- **Development**: Vite dev server
- **AI Features**: Real-time voice processing with Gemini

## Features

- **Voice-Powered Complaints**: AI-driven voice interaction for customer support
- **Web Dashboard**: Comprehensive complaint management interface
- **Real-time Processing**: Live AI responses and complaint categorization
- **Admin Panel**: Administrative controls and analytics
- **Multi-modal Support**: Both voice and text-based complaint handling

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **AI/ML**: Google Gemini AI, Google Generative AI
- **Database**: Supabase, PostgreSQL
- **UI Components**: Radix UI, Lucide React
- **Voice Agent**: Vite, Lit, TypeScript

## Contributing

1. Ensure all three components are properly tested
2. Follow the existing code structure and patterns
3. Test integration between components
4. Update documentation for any configuration changes

## Troubleshooting

- **Port Conflicts**: Ensure each service runs on its designated port
- **API Key Issues**: Verify Gemini API key is correctly set in all required locations
- **Database Connection**: Check PostgreSQL and Supabase configurations
- **CORS Issues**: Backend is configured with CORS support for cross-origin requests

## License

This project is private and proprietary.
