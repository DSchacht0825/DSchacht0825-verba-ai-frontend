'use client';

import { useState, useRef } from 'react';
import { format } from 'date-fns';

interface ConsentForm {
  sessionRecording: boolean;
  dataProcessing: boolean;
  aiAssistance: boolean;
  dataRetention: boolean;
  psychotherapyNotes: boolean;
  substanceAbuseInfo: boolean; // 42 CFR Part 2
  minorConsent: boolean;
  telehealthConsent: boolean;
  signature: string;
  clientName: string;
  date: Date;
  witnessSignature?: string;
  witnessName?: string;
}

interface ConsentCaptureProps {
  onConsentComplete: (consent: ConsentForm & { consentId: string }) => void;
  clientInfo?: {
    name: string;
    isMinor: boolean;
    hasSubstanceUseHistory: boolean;
    isTelehealth: boolean;
  };
}

export default function ConsentCapture({ onConsentComplete, clientInfo }: ConsentCaptureProps) {
  const [consent, setConsent] = useState<ConsentForm>({
    sessionRecording: false,
    dataProcessing: false,
    aiAssistance: false,
    dataRetention: false,
    psychotherapyNotes: false,
    substanceAbuseInfo: false,
    minorConsent: false,
    telehealthConsent: false,
    signature: '',
    clientName: clientInfo?.name || '',
    date: new Date(),
    witnessSignature: '',
    witnessName: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSignaturePadActive, setIsSignaturePadActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const consentTexts = {
    sessionRecording: {
      title: "Session Recording Consent",
      text: "I consent to the audio recording of this therapy session. I understand that this recording will be used to generate clinical documentation and improve the quality of my care. The recording will be stored securely and encrypted.",
      required: true
    },
    dataProcessing: {
      title: "Data Processing Consent", 
      text: "I consent to the processing of my personal health information (PHI) by Verba AI's HIPAA-compliant systems. This includes transcription, analysis, and clinical note generation using artificial intelligence technology.",
      required: true
    },
    aiAssistance: {
      title: "AI-Assisted Documentation",
      text: "I understand that artificial intelligence will be used to help create my clinical notes. A licensed clinician will review all AI-generated content before it becomes part of my medical record. No treatment decisions will be made solely by AI.",
      required: true
    },
    dataRetention: {
      title: "Data Retention & Deletion",
      text: `I understand that my session recordings and data will be retained for ${clientInfo?.hasSubstanceUseHistory ? '7 years as required by law' : 'the period specified by my treatment provider'}, after which they will be securely deleted. I have the right to request deletion of my data subject to legal requirements.`,
      required: true
    },
    psychotherapyNotes: {
      title: "Psychotherapy Notes (Optional)",
      text: "I consent to the creation of psychotherapy notes, which receive special protection under HIPAA. These notes are kept separate from my regular medical record and require my specific authorization for disclosure.",
      required: false
    },
    substanceAbuseInfo: {
      title: "Substance Abuse Information (42 CFR Part 2)",
      text: "I understand that information about substance abuse treatment is protected by special federal confidentiality rules (42 CFR Part 2). This information cannot be disclosed without my written consent, except in specific circumstances defined by law.",
      required: clientInfo?.hasSubstanceUseHistory || false,
      show: clientInfo?.hasSubstanceUseHistory
    },
    minorConsent: {
      title: "Minor Consent",
      text: "As the parent/legal guardian of the minor client, I have the legal authority to provide consent for treatment and recording. I understand the minor's rights regarding confidentiality as defined by state law.",
      required: clientInfo?.isMinor || false,
      show: clientInfo?.isMinor
    },
    telehealthConsent: {
      title: "Telehealth Consent",
      text: "I understand the benefits and risks of telehealth services, including potential technical failures and privacy risks. I consent to receive therapy services via secure video conferencing technology.",
      required: clientInfo?.isTelehealth || false,
      show: clientInfo?.isTelehealth
    }
  };

  const steps = Object.entries(consentTexts)
    .filter(([_, config]) => (config as any).show !== false)
    .map(([key]) => key);

  const currentConsentKey = steps[currentStep - 1] as keyof ConsentForm;
  const currentConsentConfig = consentTexts[currentConsentKey as keyof typeof consentTexts];

  const handleConsentChange = (key: keyof ConsentForm, value: boolean) => {
    setConsent(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Move to signature
      setIsSignaturePadActive(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    const config = consentTexts[currentConsentKey as keyof typeof consentTexts];
    if (config.required) {
      return consent[currentConsentKey];
    }
    return true;
  };

  // Signature pad functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setConsent(prev => ({ 
      ...prev, 
      signature: canvas.toDataURL() 
    }));
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setConsent(prev => ({ ...prev, signature: '' }));
  };

  const completeConsent = async () => {
    if (!consent.signature) {
      alert('Please provide your signature');
      return;
    }

    try {
      // Generate consent ID and store consent
      const consentId = `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store consent in secure vault
      const response = await fetch('/api/consent/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...consent,
          consentId,
          timestamp: new Date().toISOString(),
          ipAddress: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => d.ip),
          userAgent: navigator.userAgent
        })
      });

      if (response.ok) {
        onConsentComplete({ ...consent, consentId });
      } else {
        throw new Error('Failed to store consent');
      }
    } catch (error) {
      console.error('Consent storage failed:', error);
      alert('Failed to store consent. Please try again.');
    }
  };

  if (isSignaturePadActive) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Digital Signature Required
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name
            </label>
            <input
              type="text"
              value={consent.clientName}
              onChange={(e) => setConsent(prev => ({ ...prev, clientName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please type your full legal name"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature *
            </label>
            <div className="border-2 border-gray-300 rounded-lg">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">Sign above using your mouse or touchscreen</p>
              <button
                type="button"
                onClick={clearSignature}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear Signature
              </button>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Date: {format(consent.date, 'MMMM do, yyyy')}
            </p>
          </div>

          {/* Consent Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Consent Summary</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(consent).map(([key, value]) => {
                if (typeof value === 'boolean' && value && consentTexts[key as keyof typeof consentTexts]) {
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{consentTexts[key as keyof typeof consentTexts].title}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsSignaturePadActive(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Consent
            </button>
            <button
              onClick={completeConsent}
              disabled={!consent.signature || !consent.clientName}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Complete Consent
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of {steps.length}</span>
            <span>Consent Form</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Consent Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {currentConsentConfig?.title}
            {currentConsentConfig?.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-gray-800 leading-relaxed">
              {currentConsentConfig?.text}
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent[currentConsentKey] as boolean}
                onChange={(e) => handleConsentChange(currentConsentKey, e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-900">
                I understand and consent to the above
                {currentConsentConfig?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </span>
            </label>
            
            {!currentConsentConfig?.required && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!(consent[currentConsentKey] as boolean)}
                  onChange={(e) => handleConsentChange(currentConsentKey, !e.target.checked)}
                  className="mt-1 w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                />
                <span className="text-gray-700">
                  I do not consent to the above (optional)
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length ? 'Sign Document' : 'Next'}
          </button>
        </div>

        {/* Legal Notice */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            This consent form complies with HIPAA, 42 CFR Part 2 (where applicable), and state regulations. 
            Your information is protected and will only be used as described above. You may withdraw 
            consent at any time by contacting your provider, though this may affect your ability to 
            receive services.
          </p>
        </div>
      </div>
    </div>
  );
}