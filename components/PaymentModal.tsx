'use client';

import { useState } from 'react';
import SquarePayment from './SquarePayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
  originalAmount: number;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  planName, 
  amount, 
  originalAmount 
}: PaymentModalProps) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSuccess = (payment: any) => {
    setPaymentSuccess(true);
  };

  const handleError = (error: any) => {
    console.error('Payment error:', error);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!paymentSuccess ? (
          <SquarePayment
            planName={planName}
            amount={amount}
            originalAmount={originalAmount}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        ) : (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Verba AI!
            </h3>
            <p className="text-xl text-gray-600 mb-6">
              Your early bird discount has been secured.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">
                <strong>{planName} Plan</strong> - ${amount}/month (50% off for life!)
              </p>
              <p className="text-sm text-green-700 mt-2">
                You'll receive an email with your account details before our October launch.
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}