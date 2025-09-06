'use client';

import { useState } from 'react';
import PaymentModal from '../../components/PaymentModal';

export default function TestPayment() {
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    planName: 'Professional',
    amount: 99,
    originalAmount: 199
  });

  const testCards = [
    { number: '4111 1111 1111 1111', brand: 'Visa', result: 'Success' },
    { number: '5555 5555 5555 4444', brand: 'Mastercard', result: 'Success' },
    { number: '4000 0000 0000 0002', brand: 'Visa', result: 'Declined' },
    { number: '4000 0000 0000 0119', brand: 'Visa', result: 'Processing Failure' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Square Payment Testing
          </h1>
          <p className="text-gray-600">
            Test the Square payment integration with sandbox credentials
          </p>
        </div>

        {/* Environment Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Environment Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Environment:</span>
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                {process.env.NODE_ENV === 'production' ? 'Production' : 'Development (Sandbox)'}
              </span>
            </div>
            <div>
              <span className="font-medium">Square App ID:</span>
              <span className="ml-2 text-sm font-mono text-gray-600">
                {process.env.NEXT_PUBLIC_SQUARE_APP_ID?.substring(0, 20)}...
              </span>
            </div>
          </div>
        </div>

        {/* Test Cards */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Cards (Sandbox Only)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Card Number</th>
                  <th className="text-left py-2">Brand</th>
                  <th className="text-left py-2">Expected Result</th>
                  <th className="text-left py-2">Expiry</th>
                  <th className="text-left py-2">CVV</th>
                </tr>
              </thead>
              <tbody>
                {testCards.map((card, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-mono">{card.number}</td>
                    <td className="py-2">{card.brand}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        card.result === 'Success' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {card.result}
                      </span>
                    </td>
                    <td className="py-2">Any future date</td>
                    <td className="py-2">Any 3 digits</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Test Payment Button */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Early Bird Payment</h2>
          <p className="text-gray-600 mb-6">
            Click the button below to test the complete payment flow with a 50% early bird discount.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="mb-4">
              <span className="text-2xl font-bold text-green-600">$99</span>
              <span className="text-lg text-gray-400 line-through ml-2">$199</span>
              <span className="text-sm text-green-600 ml-2">50% OFF</span>
            </div>
            <p className="text-gray-600 mb-4">Professional Plan - Early Bird Special</p>
            
            <button
              onClick={() => setPaymentModal({
                isOpen: true,
                planName: 'Professional',
                amount: 99,
                originalAmount: 199
              })}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Test Payment Flow
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Testing Notes:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use any test card number from the table above</li>
              <li>• Use any future expiry date (e.g., 12/25)</li>
              <li>• Use any 3-digit CVV (e.g., 123)</li>
              <li>• Fill in test customer information</li>
              <li>• Successful payments will show confirmation screen</li>
            </ul>
          </div>
        </div>

        {/* Webhook Information */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Webhook Endpoints</h2>
          <p className="text-gray-600 mb-4">
            Configure these webhook URLs in your Square Developer Dashboard:
          </p>
          <div className="bg-gray-50 p-4 rounded font-mono text-sm">
            <div>Production: https://verba-ai.com/api/webhooks/square</div>
            <div>Development: http://localhost:3000/api/webhooks/square</div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Webhook Events:</h3>
            <ul className="text-sm text-gray-600">
              <li>• payment.created</li>
              <li>• payment.updated</li>
              <li>• subscription.created</li>
              <li>• subscription.updated</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        planName={paymentModal.planName}
        amount={paymentModal.amount}
        originalAmount={paymentModal.originalAmount}
      />
    </div>
  );
}