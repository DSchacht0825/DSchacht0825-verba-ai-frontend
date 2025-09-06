'use client';

import React from 'react';
import Link from 'next/link';
import MeetingIntegration from '../../components/MeetingIntegration';
import AudioRecorder from '../../components/AudioRecorder';

export default function Dashboard() {
  const [activeTab, setActiveTab] = React.useState('meetings');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Verba AI
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome back!</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                U
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent">
            Clinical Documentation Dashboard
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl">
            Manage your meetings, recordings, and clinical notes with AI-powered automation
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('meetings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'meetings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Meeting Bot
            </button>
            <button
              onClick={() => setActiveTab('recorder')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'recorder'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Manual Recording
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'notes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Past Notes
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'meetings' && (
          <div>
            <div className="mb-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 border border-purple-200/50 rounded-xl shadow-lg p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/15 to-blue-400/15 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-full blur-xl"></div>
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                🤖 Automatic Meeting Transcription
              </h2>
              <p className="text-blue-700 mb-4">
                Just like Fathom, Verba AI can automatically join your Zoom, Google Meet, and Microsoft Teams calls to transcribe and generate clinical notes.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-white/50 hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl mb-2">🎥</div>
                  <h3 className="font-medium mb-1">Zoom</h3>
                  <p className="text-sm text-gray-600">Automatic bot joining</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-white/50 hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl mb-2">📹</div>
                  <h3 className="font-medium mb-1">Google Meet</h3>
                  <p className="text-sm text-gray-600">Calendar integration</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md border border-white/50 hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl mb-2">👥</div>
                  <h3 className="font-medium mb-1">Teams</h3>
                  <p className="text-sm text-gray-600">One-click joining</p>
                </div>
              </div>
            </div>
            
            <MeetingIntegration />
          </div>
        )}

        {activeTab === 'recorder' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                In-Person Session Recording
              </h2>
              <p className="text-gray-600">
                For in-person therapy sessions, use the manual recorder below
              </p>
            </div>
            <AudioRecorder />
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50/30 rounded-xl shadow-2xl p-8 border border-white/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Past Clinical Notes
            </h2>
            
            <div className="space-y-4">
              {/* Sample past notes */}
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">Client Session - John D.</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      SOAP Note • 45 minutes • Zoom Meeting
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">Today, 2:00 PM</span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">Client Session - Sarah M.</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      DAP Note • 50 minutes • In-Person
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">Yesterday, 10:00 AM</span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">Group Therapy Session</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      BIRP Note • 90 minutes • Google Meet
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">Monday, 3:00 PM</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                All notes are encrypted and HIPAA-compliant
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white via-blue-50/80 to-cyan-50/80 backdrop-blur-md border-t border-white/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="group">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300">247</div>
              <div className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">Sessions Recorded</div>
            </div>
            <div className="group">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent group-hover:from-green-500 group-hover:to-emerald-600 transition-all duration-300">198</div>
              <div className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">Hours Saved</div>
            </div>
            <div className="group">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-indigo-600 transition-all duration-300">100%</div>
              <div className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">HIPAA Compliant</div>
            </div>
            <div className="group">
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-700 bg-clip-text text-transparent group-hover:from-cyan-500 group-hover:to-teal-600 transition-all duration-300">4.9</div>
              <div className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}