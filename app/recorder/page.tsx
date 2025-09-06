'use client';

import React from 'react';
import Link from 'next/link';
import AudioRecorder from '../../components/AudioRecorder';

export default function RecorderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Verba AI
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Back to Home
              </Link>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Live Demo
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Clinical Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Record your therapy sessions and generate professional clinical notes automatically. 
            HIPAA-compliant with real-time transcription and AI-powered note generation.
          </p>
        </div>

        {/* Features Banner */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                🎤
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Real-time Recording</h3>
              <p className="text-sm text-gray-600">Live audio capture with noise reduction</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                📝
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Live Transcription</h3>
              <p className="text-sm text-gray-600">Instant speech-to-text with speaker ID</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                🤖
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">AI Note Generation</h3>
              <p className="text-sm text-gray-600">SOAP, DAP, BIRP, GIRP formats</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                🔒
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">HIPAA Secure</h3>
              <p className="text-sm text-gray-600">Encrypted and compliant processing</p>
            </div>
          </div>
        </div>

        {/* Audio Recorder Component */}
        <AudioRecorder />

        {/* Instructions */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white p-8">
          <h2 className="text-2xl font-bold mb-4">How to Use Verba AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold mb-2">1</div>
              <h3 className="text-lg font-semibold mb-2">Start Recording</h3>
              <p className="text-blue-100">
                Click "Start Recording" to begin capturing your therapy session. 
                Ensure your microphone permissions are enabled.
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">2</div>
              <h3 className="text-lg font-semibold mb-2">Monitor Transcription</h3>
              <p className="text-blue-100">
                Watch as your conversation is transcribed in real-time with 
                speaker identification and timestamps.
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">3</div>
              <h3 className="text-lg font-semibold mb-2">Generate Notes</h3>
              <p className="text-blue-100">
                After recording, select your preferred note format (SOAP, DAP, etc.) 
                and generate professional clinical documentation.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="text-yellow-600 mr-3 text-xl">
              ⚠️
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Demo Environment</h4>
              <p className="text-yellow-700 text-sm">
                This is a demonstration of Verba AI capabilities. To use this system in production, 
                you'll need to configure API keys for Deepgram (transcription) and OpenAI (note generation). 
                All data in this demo is processed securely but should not contain real patient information.
              </p>
              <div className="mt-3">
                <Link 
                  href="/" 
                  className="text-yellow-800 hover:text-yellow-900 font-medium text-sm underline"
                >
                  Learn more about production setup →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}