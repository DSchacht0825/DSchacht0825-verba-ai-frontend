'use client';

import React, { useState, useEffect } from 'react';

// Meeting interface removed - using plain objects

export default function MeetingIntegration() {
  const [meetings, setMeetings] = useState([]);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [activeBots, setActiveBots] = useState([]);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    url: '',
    platform: 'zoom',
    password: ''
  });

  // Check for active meeting bots
  useEffect(() => {
    const checkActiveBots = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/active-meetings');
        const data = await response.json();
        setActiveBots(data.map((m) => m.id));
      } catch (error) {
        console.error('Error fetching active bots:', error);
      }
    };

    checkActiveBots();
    const interval = setInterval(checkActiveBots, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const connectCalendar = (provider) => {
    // OAuth flow for calendar connection
    window.location.href = `/api/auth/${provider}?redirect=/dashboard`;
  };

  const joinMeeting = async (meeting) => {
    try {
      const response = await fetch('http://localhost:5001/api/join-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: meeting.platform,
          meetingUrl: meeting.url,
          password: 'password' in meeting ? meeting.password : undefined,
          botName: 'Verba AI Assistant'
        })
      });

      const result = await response.json();
      if (result.success) {
        setActiveBots([...activeBots, result.meetingId]);
        alert('Verba AI has joined your meeting!');
      } else {
        alert(`Failed to join meeting: ${result.error}`);
      }
    } catch (error) {
      console.error('Error joining meeting:', error);
      alert('Failed to join meeting');
    }
  };

  const leaveMeeting = async (meetingId) => {
    try {
      await fetch('http://localhost:5001/api/leave-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId })
      });

      setActiveBots(activeBots.filter(id => id !== meetingId));
    } catch (error) {
      console.error('Error leaving meeting:', error);
    }
  };

  const detectPlatform = (url) => {
    if (url.includes('zoom.us')) return 'zoom';
    if (url.includes('meet.google.com')) return 'meet';
    if (url.includes('teams.microsoft.com')) return 'teams';
    return 'zoom'; // default
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 rounded-2xl shadow-2xl p-8 border border-white/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-400/5 to-blue-400/5 rounded-full blur-2xl"></div>
        <div className="relative z-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Meeting Integration
        </h2>
        <p className="text-gray-600 mb-8">
          Verba AI automatically joins your meetings to transcribe and generate notes
        </p>

        {/* Calendar Connection */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Connect Your Calendar
          </h3>
          {!calendarConnected ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => connectCalendar('google')}
                className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>Google Calendar</span>
              </button>
              <button
                onClick={() => connectCalendar('outlook')}
                className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition"
              >
                <img src="https://outlook.live.com/favicon.ico" alt="Outlook" className="w-5 h-5" />
                <span>Outlook Calendar</span>
              </button>
              <button
                onClick={() => connectCalendar('apple')}
                className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition"
              >
                🍎
                <span>Apple Calendar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-medium">Calendar Connected</span>
              </div>
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Quick Join */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Join Meeting
            </h3>
            <button
              onClick={() => setShowAddMeeting(!showAddMeeting)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Meeting
            </button>
          </div>

          {showAddMeeting && (
            <div className="p-4 border border-gray-200 rounded-lg mb-4">
              <input
                type="text"
                placeholder="Paste meeting link (Zoom, Google Meet, or Teams)"
                value={newMeeting.url}
                onChange={(e) => {
                  const url = e.target.value;
                  setNewMeeting({
                    ...newMeeting,
                    url,
                    platform: detectPlatform(url)
                  });
                }}
                className="w-full p-3 border border-gray-300 rounded-lg mb-3"
              />
              {newMeeting.platform === 'zoom' && (
                <input
                  type="text"
                  placeholder="Meeting password (if required)"
                  value={newMeeting.password}
                  onChange={(e) => setNewMeeting({...newMeeting, password: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                />
              )}
              <button
                onClick={() => {
                  joinMeeting(newMeeting);
                  setShowAddMeeting(false);
                  setNewMeeting({ url: '', platform: 'zoom', password: '' });
                }}
                disabled={!newMeeting.url}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Join Meeting Now
              </button>
            </div>
          )}
        </div>

        {/* Upcoming Meetings */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Meetings
          </h3>
          <div className="space-y-3">
            {meetings.length > 0 ? (
              meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {meeting.platform === 'zoom' && '🎥'}
                      {meeting.platform === 'meet' && '📹'}
                      {meeting.platform === 'teams' && '👥'}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(meeting.startTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={meeting.autoJoin}
                        onChange={() => {
                          // Toggle auto-join
                          setMeetings(meetings.map(m => 
                            m.id === meeting.id 
                              ? {...m, autoJoin: !m.autoJoin}
                              : m
                          ));
                        }}
                        className="rounded"
                      />
                      Auto-join
                    </label>
                    {activeBots.includes(meeting.id) ? (
                      <button
                        onClick={() => leaveMeeting(meeting.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                      >
                        Leave
                      </button>
                    ) : (
                      <button
                        onClick={() => joinMeeting(meeting)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                      >
                        Join Now
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">No upcoming meetings</p>
                <p className="text-sm">Connect your calendar or add a meeting manually</p>
              </div>
            )}
          </div>
        </div>

        {/* Active Bots */}
        {activeBots.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Active Meeting Bots ({activeBots.length})
            </h3>
            <p className="text-green-700 text-sm">
              Verba AI is currently transcribing these meetings
            </p>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">1️⃣</div>
              <h4 className="font-medium mb-1">Connect Calendar</h4>
              <p className="text-sm text-gray-600">
                Link your Google, Outlook, or Apple calendar
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">2️⃣</div>
              <h4 className="font-medium mb-1">Auto-Join Meetings</h4>
              <p className="text-sm text-gray-600">
                Verba AI joins automatically or with one click
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">3️⃣</div>
              <h4 className="font-medium mb-1">Get Notes</h4>
              <p className="text-sm text-gray-600">
                Receive transcription and clinical notes after
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}