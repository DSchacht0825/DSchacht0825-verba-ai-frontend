'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// Transcription interface removed - using plain objects

// ClinicalNote interface removed - using plain objects

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptions, setTranscriptions] = useState([]);
  const [clinicalNote, setClinicalNote] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [noteType, setNoteType] = useState('SOAP');
  const [isConnected, setIsConnected] = useState(false);

  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);
  const chunksRef = useRef([]);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:4000');
    
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to audio service');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from audio service');
    });

    socketRef.current.on('transcription', (transcription: Transcription) => {
      setTranscriptions(prev => [...prev, transcription]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      const newSessionId = `session_${Date.now()}`;
      setSessionId(newSessionId);
      setTranscriptions([]);
      setClinicalNote(null);

      // Join socket session
      if (socketRef.current) {
        socketRef.current.emit('join_session', newSessionId);
      }

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        
        // Send audio for transcription
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('sessionId', newSessionId);

        try {
          const response = await fetch('http://localhost:4000/api/transcribe/stream', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Transcription failed');
          }

        } catch (error) {
          console.error('Error sending audio:', error);
        }
      };

      mediaRecorderRef.current.start(5000); // Send chunks every 5 seconds
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, [isRecording]);

  const generateClinicalNote = useCallback(async () => {
    if (!sessionId || transcriptions.length === 0) {
      alert('No transcription available to generate notes from');
      return;
    }

    setIsGeneratingNote(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/generate/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          noteType,
          clientInfo: {
            name: 'Client',
            sessionType: 'Individual Therapy',
            dob: 'Not provided'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Note generation failed');
      }

      const data = await response.json();
      setClinicalNote(data.note);

    } catch (error) {
      console.error('Error generating note:', error);
      alert('Failed to generate clinical note');
    } finally {
      setIsGeneratingNote(false);
    }
  }, [sessionId, transcriptions, noteType]);

  const formatTranscript = (transcriptions: Transcription[]) => {
    return transcriptions
      .map(t => `[${new Date(t.timestamp).toLocaleTimeString()}] ${t.transcript}`)
      .join('\n');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Verba AI Clinical Session Recorder
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className={`flex items-center ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {sessionId && (
            <span>Session: {sessionId}</span>
          )}
        </div>
      </div>

      {/* Recording Controls */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!isConnected}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400'
              }`}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            
            {isRecording && (
              <div className="flex items-center text-red-600">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                Recording...
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="noteType" className="text-sm font-medium text-gray-700">
              Note Type:
            </label>
            <select
              id="noteType"
              value={noteType}
              onChange={(e) => setNoteType(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="SOAP">SOAP Notes</option>
              <option value="DAP">DAP Notes</option>
              <option value="BIRP">BIRP Notes</option>
              <option value="GIRP">GIRP Notes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Transcription */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Live Transcription ({transcriptions.length} segments)
        </h3>
        <div className="bg-gray-50 border rounded-lg p-4 h-64 overflow-y-auto">
          {transcriptions.length > 0 ? (
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {formatTranscript(transcriptions)}
            </pre>
          ) : (
            <p className="text-gray-500 text-sm italic">
              Start recording to see live transcription...
            </p>
          )}
        </div>
      </div>

      {/* Generate Notes */}
      {transcriptions.length > 0 && (
        <div className="mb-8">
          <button
            onClick={generateClinicalNote}
            disabled={isGeneratingNote}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:bg-gray-400"
          >
            {isGeneratingNote ? 'Generating Notes...' : `Generate ${noteType} Notes`}
          </button>
        </div>
      )}

      {/* Clinical Notes */}
      {clinicalNote && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Generated {clinicalNote.noteType} Notes
          </h3>
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="mb-4 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>Generated: {new Date(clinicalNote.generatedAt).toLocaleString()}</span>
                <span>Duration: {clinicalNote.sessionDuration}</span>
                <span>Words: {clinicalNote.wordCount}</span>
              </div>
            </div>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                {clinicalNote.content}
              </pre>
            </div>
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => navigator.clipboard.writeText(clinicalNote.content)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HIPAA Notice */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="text-blue-600 mr-3">
            🔒
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">HIPAA Compliance Notice</h4>
            <p className="text-xs text-blue-700">
              All audio recordings and transcriptions are processed securely and deleted after session completion. 
              Clinical notes are encrypted and stored according to HIPAA requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;