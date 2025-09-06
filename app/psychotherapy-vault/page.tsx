'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface PsychotherapyNote {
  id: string;
  sessionId: string;
  clientId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isLocked: boolean;
  tags: string[];
  clinicianId: string;
  accessLog: AccessLogEntry[];
}

interface AccessLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: 'view' | 'create' | 'edit' | 'export';
  timestamp: Date;
  ipAddress: string;
}

export default function PsychotherapyVault() {
  const [notes, setNotes] = useState<PsychotherapyNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<PsychotherapyNote | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [authorizationModal, setAuthorizationModal] = useState(false);

  const [newNote, setNewNote] = useState({
    content: '',
    tags: [] as string[],
    tagInput: ''
  });

  useEffect(() => {
    loadPsychotherapyNotes();
  }, []);

  const loadPsychotherapyNotes = async () => {
    try {
      const response = await fetch('/api/psychotherapy-notes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error('Failed to load psychotherapy notes:', error);
    }
  };

  const createNote = async () => {
    try {
      const response = await fetch('/api/psychotherapy-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          content: newNote.content,
          tags: newNote.tags,
          sessionId: 'current-session-id' // Would come from context
        })
      });

      if (response.ok) {
        await loadPsychotherapyNotes();
        setIsCreating(false);
        setNewNote({ content: '', tags: [], tagInput: '' });
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const updateNote = async (noteId: string, content: string) => {
    try {
      const response = await fetch(`/api/psychotherapy-notes/${noteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ content })
      });

      if (response.ok) {
        await loadPsychotherapyNotes();
      }
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const requestAccess = async (noteId: string, requestReason: string) => {
    try {
      const response = await fetch(`/api/psychotherapy-notes/${noteId}/request-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ reason: requestReason })
      });

      if (response.ok) {
        alert('Access request submitted for review');
      }
    } catch (error) {
      console.error('Failed to request access:', error);
    }
  };

  const addTag = () => {
    if (newNote.tagInput.trim()) {
      setNewNote(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ''
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const PsychotherapyNoteWarning = () => (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-amber-800">
            Psychotherapy Notes - Special Protection Notice
          </h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>
              Psychotherapy notes receive heightened privacy protection under HIPAA. 
              These notes are separate from your medical record and require specific 
              written authorization for disclosure. Access is strictly controlled and audited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Psychotherapy Notes Vault</h1>
              <p className="text-gray-600 mt-1">HIPAA Protected - Restricted Access</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAccessModal(true)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Access History
              </button>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                New Psychotherapy Note
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <PsychotherapyNoteWarning />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar: Notes List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedNote?.id === note.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-500">
                        {format(new Date(note.createdAt), 'MMM dd, yyyy')}
                      </span>
                      {note.isLocked && (
                        <div className="flex items-center text-red-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-900 line-clamp-2">
                      {note.content.substring(0, 100)}...
                    </p>
                    {note.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {note.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {note.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{note.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {filteredNotes.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <p>No psychotherapy notes found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content: Note Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {isCreating ? (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      New Psychotherapy Note
                    </h2>
                    <button
                      onClick={() => setIsCreating(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note Content *
                      </label>
                      <textarea
                        value={newNote.content}
                        onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                        rows={12}
                        className="w-full p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Private psychotherapy notes - process observations, therapeutic insights, personal reflections..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newNote.tagInput}
                          onChange={(e) => setNewNote(prev => ({ ...prev, tagInput: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add tag..."
                        />
                        <button
                          onClick={addTag}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newNote.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={createNote}
                        disabled={!newNote.content.trim()}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                      >
                        Save Psychotherapy Note
                      </button>
                      <button
                        onClick={() => setIsCreating(false)}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedNote ? (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Psychotherapy Note
                      </h2>
                      <p className="text-sm text-gray-500">
                        Created {format(new Date(selectedNote.createdAt), 'MMMM dd, yyyy at h:mm a')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedNote.isLocked && (
                        <span className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Locked
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <textarea
                        value={selectedNote.content}
                        onChange={(e) => updateNote(selectedNote.id, e.target.value)}
                        disabled={selectedNote.isLocked}
                        rows={12}
                        className={`w-full p-4 border border-gray-300 rounded-md ${
                          selectedNote.isLocked 
                            ? 'bg-gray-50 cursor-not-allowed' 
                            : 'focus:ring-blue-500 focus:border-blue-500'
                        }`}
                      />
                    </div>

                    {selectedNote.tags.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedNote.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Access Log</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        {selectedNote.accessLog.slice(0, 3).map((entry) => (
                          <div key={entry.id} className="flex justify-between">
                            <span>{entry.action} by {entry.userName}</span>
                            <span>{format(new Date(entry.timestamp), 'MMM dd, h:mm a')}</span>
                          </div>
                        ))}
                        {selectedNote.accessLog.length > 3 && (
                          <button
                            onClick={() => setShowAccessModal(true)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View all {selectedNote.accessLog.length} entries
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg mb-2">No note selected</p>
                  <p>Select a psychotherapy note from the list or create a new one</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}