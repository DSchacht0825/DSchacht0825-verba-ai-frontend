'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

interface TranscriptSegment {
  id: string;
  startMs: number;
  endMs: number;
  speakerLabel: string;
  text: string;
  confidence: number;
}

interface NoteSection {
  title: string;
  content: string;
  issues: any[];
  evidence: any[];
}

interface LiveNote {
  subjective: NoteSection;
  objective: NoteSection;
  assessment: NoteSection;
  plan: NoteSection;
}

export default function SessionView() {
  const params = useParams();
  const sessionId = params.id as string;
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [liveNote, setLiveNote] = useState<LiveNote>({
    subjective: { title: 'Subjective', content: '', issues: [], evidence: [] },
    objective: { title: 'Objective', content: '', issues: [], evidence: [] },
    assessment: { title: 'Assessment', content: '', issues: [], evidence: [] },
    plan: { title: 'Plan', content: '', issues: [], evidence: [] }
  });
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [riskAlerts, setRiskAlerts] = useState<any[]>([]);
  const [showRiskModal, setShowRiskModal] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket for live transcription
    const ws = new WebSocket(`ws://localhost:8080/audio-stream`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to audio stream');
      ws.send(JSON.stringify({
        type: 'START_SESSION',
        sessionId,
        userId: 'clinician-123', // From auth
        orgId: 'org-456',
        sessionType: 'therapy'
      }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'transcription') {
        const segment = message.segment;
        setTranscript(prev => [...prev, segment]);
        
        // Update live note sections based on content
        updateLiveNote(segment);
      } else if (message.type === 'risk_alert') {
        setRiskAlerts(prev => [...prev, message.alert]);
        setShowRiskModal(true);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'END_SESSION' }));
        ws.close();
      }
    };
  }, [sessionId]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          // Send audio chunk
          wsRef.current.send(event.data);
        }
      };
      
      mediaRecorder.start(1000); // Send chunks every second
      setIsRecording(true);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'PAUSE_SESSION' }));
    }
  };

  const updateLiveNote = (segment: TranscriptSegment) => {
    // Simple content categorization - in production use NLP service
    const content = segment.text.toLowerCase();
    
    if (content.includes('reports') || content.includes('states') || content.includes('feels')) {
      setLiveNote(prev => ({
        ...prev,
        subjective: {
          ...prev.subjective,
          content: prev.subjective.content + `\n• Client ${segment.text}`,
          evidence: [...prev.subjective.evidence, { segmentId: segment.id, timestamp: segment.startMs }]
        }
      }));
    } else if (content.includes('observed') || content.includes('appeared') || content.includes('demonstrated')) {
      setLiveNote(prev => ({
        ...prev,
        objective: {
          ...prev.objective,
          content: prev.objective.content + `\n• Clinician observed: ${segment.text}`,
          evidence: [...prev.objective.evidence, { segmentId: segment.id, timestamp: segment.startMs }]
        }
      }));
    }
  };

  const jumpToAudio = (timestamp: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timestamp / 1000;
      audioRef.current.play();
    }
    setSelectedSegment(transcript.find(s => s.startMs === timestamp)?.id || null);
  };

  const makeObjective = async (sectionKey: keyof LiveNote) => {
    const section = liveNote[sectionKey];
    
    try {
      const response = await fetch('/api/nlp/make-objective', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: section.content })
      });
      
      const result = await response.json();
      
      setLiveNote(prev => ({
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          content: result.objectiveText,
          issues: result.issues || []
        }
      }));
    } catch (error) {
      console.error('Failed to make objective:', error);
    }
  };

  const shortenSection = async (sectionKey: keyof LiveNote) => {
    const section = liveNote[sectionKey];
    
    try {
      const response = await fetch('/api/nlp/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: section.content })
      });
      
      const result = await response.json();
      
      setLiveNote(prev => ({
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          content: result.shortenedText
        }
      }));
    } catch (error) {
      console.error('Failed to shorten:', error);
    }
  };

  const switchTemplate = (newTemplate: 'SOAP' | 'DAP' | 'BIRP') => {
    // Template switching would remap existing content
    console.log('Switching to template:', newTemplate);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Session Recording & Documentation
            </h1>
            <div className="flex items-center gap-4">
              <select className="border border-gray-300 rounded-md px-3 py-2">
                <option>SOAP Template</option>
                <option>DAP Template</option>
                <option>BIRP Template</option>
              </select>
              
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  <span className="w-3 h-3 bg-white rounded-full"></span>
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
                >
                  <span className="w-3 h-3 bg-white rounded-sm"></span>
                  Pause Recording
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Live Transcript */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Live Transcript</h2>
              
              <div className="h-96 overflow-y-auto border border-gray-200 rounded p-4 space-y-3">
                {transcript.map((segment) => (
                  <div
                    key={segment.id}
                    className={`cursor-pointer p-3 rounded transition-colors ${
                      selectedSegment === segment.id 
                        ? 'bg-blue-100 border-blue-300' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => jumpToAudio(segment.startMs)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-500 mt-1 min-w-[50px]">
                        {Math.floor(segment.startMs / 60000)}:{String(Math.floor((segment.startMs % 60000) / 1000)).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <div className={`inline-block px-2 py-1 rounded text-xs mb-2 ${
                          segment.speakerLabel === 'therapist' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {segment.speakerLabel === 'therapist' ? 'Therapist' : 'Client'}
                        </div>
                        <p className="text-sm text-gray-900">{segment.text}</p>
                        {segment.confidence && (
                          <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-blue-600 h-1 rounded-full" 
                                style={{ width: `${segment.confidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isRecording && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-red-700">Recording...</span>
                  </div>
                )}
              </div>
              
              {/* Audio Controls */}
              <div className="mt-4">
                <audio 
                  ref={audioRef}
                  controls 
                  className="w-full"
                  onTimeUpdate={(e) => setAudioCurrentTime(e.currentTarget.currentTime)}
                >
                  <source src={`/api/sessions/${sessionId}/audio`} type="audio/wav" />
                </audio>
              </div>
            </div>
          </div>

          {/* Right Column: Live SOAP Note */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Live SOAP Note</h2>
                <div className="text-sm text-gray-500">
                  Word count: {Object.values(liveNote).reduce((count, section) => 
                    count + section.content.split(/\s+/).length, 0
                  )}
                </div>
              </div>

              {Object.entries(liveNote).map(([key, section]) => (
                <div key={key} className="mb-6 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-900 uppercase text-sm">
                      {section.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => makeObjective(key as keyof LiveNote)}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                      >
                        Make Objective
                      </button>
                      <button
                        onClick={() => shortenSection(key as keyof LiveNote)}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                      >
                        Shorten
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    value={section.content}
                    onChange={(e) => {
                      setLiveNote(prev => ({
                        ...prev,
                        [key]: { ...prev[key as keyof LiveNote], content: e.target.value }
                      }));
                    }}
                    className="w-full h-32 p-3 border border-gray-300 rounded resize-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`${section.title} content will appear here as you speak...`}
                  />
                  
                  {section.issues.length > 0 && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-xs text-yellow-800 font-medium">Issues detected:</p>
                      {section.issues.map((issue: any, index: number) => (
                        <p key={index} className="text-xs text-yellow-700">
                          • {issue.message}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {section.evidence.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      Evidence: {section.evidence.length} transcript references
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                  Generate Full Note
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700">
                  Save Draft
                </button>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button className="text-sm px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Export PDF
                </button>
                <button className="text-sm px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Send to EHR
                </button>
                <button className="text-sm px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  Template Switch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Alert Modal */}
      {showRiskModal && riskAlerts.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <h3 className="text-lg font-semibold text-red-900">
                Risk Assessment Required
              </h3>
            </div>
            
            {riskAlerts.map((alert, index) => (
              <div key={index} className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                <p className="font-medium text-red-900">{alert.type}: {alert.severity}</p>
                <p className="text-sm text-red-800 mt-1">{alert.evidence}</p>
                <p className="text-xs text-red-600 mt-2">
                  Timestamp: {Math.floor(alert.timestamp / 60000)}:{String(Math.floor((alert.timestamp % 60000) / 1000)).padStart(2, '0')}
                </p>
              </div>
            ))}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRiskModal(false)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Review & Address Risk
              </button>
              <button
                onClick={() => {
                  setShowRiskModal(false);
                  setRiskAlerts([]);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}