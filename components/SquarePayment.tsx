'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface SquarePaymentProps {
  planName: string;
  amount: number;
  originalAmount: number;
  onSuccess?: (payment: any) => void;
  onError?: (error: any) => void;
}

export default function SquarePayment({ 
  planName, 
  amount, 
  originalAmount,
  onSuccess,
  onError 
}: SquarePaymentProps) {
  const [card, setCard] = useState<any>(null);
  const [payments, setPayments] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    practice: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Square) {
      initializeSquare();
    }
  }, []);

  const initializeSquare = async () => {
    if (!(window as any).Square) {
      console.error('Square.js failed to load');
      return;
    }

    try {
      const payments = (window as any).Square.payments(
        process.env.NEXT_PUBLIC_SQUARE_APP_ID,
        process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
      );
      setPayments(payments);

      const card = await payments.card();
      await card.attach('#card-container');
      setCard(card);
    } catch (error) {
      console.error('Failed to initialize Square payments:', error);
      onError?.(error);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!card || !payments) {
      alert('Payment form not initialized');
      return;
    }

    setLoading(true);

    try {
      const result = await card.tokenize();
      
      if (result.status === 'OK') {
        // Send token to your backend
        const response = await fetch('/api/process-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceId: result.token,
            amount: amount * 100, // Convert to cents
            planName,
            customerInfo,
            earlyBird: true,
            originalAmount: originalAmount * 100
          }),
        });

        const data = await response.json();

        if (data.success) {
          onSuccess?.(data);
        } else {
          throw new Error(data.error || 'Payment failed');
        }
      } else {
        throw new Error('Card validation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script 
        src={process.env.NODE_ENV === 'production' 
          ? "https://web.squarecdn.com/v1/square.js"
          : "https://sandbox.web.squarecdn.com/v1/square.js"
        }
        strategy="afterInteractive"
        onLoad={initializeSquare}
      />
      
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 font-semibold">
              Early Bird Special: 50% OFF
            </p>
            <p className="text-sm text-green-700 mt-1">
              {planName} Plan: <span className="line-through">${originalAmount}/mo</span> → ${amount}/mo
            </p>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          {/* Customer Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={customerInfo.firstName}
                onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={customerInfo.lastName}
                onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Practice/Organization Name
            </label>
            <input
              type="text"
              value={customerInfo.practice}
              onChange={(e) => setCustomerInfo({...customerInfo, practice: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Square Card Element */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details *
            </label>
            <div id="card-container" className="min-h-[90px] border border-gray-300 rounded-md p-3"></div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p className="mb-2">
              By completing this purchase, you agree to:
            </p>
            <ul className="space-y-1 ml-4">
              <li>• Verba AI Terms of Service</li>
              <li>• HIPAA Business Associate Agreement (BAA)</li>
              <li>• 50% discount locked in for life</li>
              <li>• Service begins October 2024</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !card}
            className={`w-full py-3 px-4 rounded-full font-semibold transition ${
              loading || !card
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : `Pay $${amount}/month`}
          </button>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <span>🔒</span>
            <span>Secured by Square • PCI Compliant</span>
          </div>
        </form>
      </div>
    </>
  );
}