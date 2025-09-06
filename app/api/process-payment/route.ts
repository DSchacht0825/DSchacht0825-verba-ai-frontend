import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment } from 'square';

// Initialize Square client
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: process.env.NODE_ENV === 'production' 
    ? Environment.Production 
    : Environment.Sandbox
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sourceId,
      amount,
      planName,
      customerInfo,
      earlyBird,
      originalAmount
    } = body;

    // Create customer
    const { result: customerResult } = await client.customersApi.createCustomer({
      givenName: customerInfo.firstName,
      familyName: customerInfo.lastName,
      emailAddress: customerInfo.email,
      phoneNumber: customerInfo.phone,
      companyName: customerInfo.practice,
      note: `Early Bird Customer - ${planName} Plan`,
      referenceId: `verba-early-${Date.now()}`
    });

    const customerId = customerResult.customer?.id;

    // Create payment
    const { result: paymentResult } = await client.paymentsApi.createPayment({
      sourceId,
      idempotencyKey: `${Date.now()}-${Math.random()}`,
      amountMoney: {
        amount: BigInt(amount),
        currency: 'USD'
      },
      customerId,
      note: `Verba AI - ${planName} Plan (50% Early Bird Discount)`,
      referenceId: `early-bird-${Date.now()}`,
      metadata: {
        plan: planName,
        earlyBird: 'true',
        discountPercent: '50',
        originalAmount: originalAmount.toString(),
        discountedAmount: amount.toString()
      }
    });

    // Create subscription (for recurring billing)
    if (paymentResult.payment?.id) {
      // Store subscription info in your database
      await storeSubscription({
        customerId: customerId!,
        paymentId: paymentResult.payment.id,
        planName,
        amount: amount / 100,
        originalAmount: originalAmount / 100,
        customerEmail: customerInfo.email,
        earlyBird: true,
        startDate: '2024-10-01'
      });

      // Send confirmation email
      await sendConfirmationEmail(customerInfo.email, {
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        plan: planName,
        amount: amount / 100,
        startDate: 'October 2024'
      });
    }

    return NextResponse.json({
      success: true,
      payment: paymentResult.payment,
      customerId
    });

  } catch (error: any) {
    console.error('Payment processing error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Payment processing failed'
    }, { status: 500 });
  }
}

// Helper function to store subscription (implement with your database)
async function storeSubscription(data: any) {
  // Store in your database
  console.log('Storing subscription:', data);
  // Implementation depends on your database choice
}

// Helper function to send confirmation email
async function sendConfirmationEmail(email: string, data: any) {
  // Send email using your preferred service (SendGrid, AWS SES, etc.)
  console.log('Sending confirmation email to:', email);
  
  // Example with SendGrid (add @sendgrid/mail to dependencies)
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: email,
    from: 'welcome@verba-ai.com',
    subject: 'Welcome to Verba AI - Early Bird Access Confirmed!',
    html: `
      <h2>Welcome to Verba AI, ${data.name}!</h2>
      <p>Thank you for being an early supporter. Your 50% lifetime discount has been secured!</p>
      <p><strong>Plan:</strong> ${data.plan}</p>
      <p><strong>Monthly Rate:</strong> $${data.amount} (50% off!)</p>
      <p><strong>Service Begins:</strong> ${data.startDate}</p>
      <p>We'll send you login credentials closer to our launch date.</p>
      <p>Best regards,<br>The Verba AI Team</p>
    `
  };
  
  await sgMail.send(msg);
  */
}