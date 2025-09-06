import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-square-signature');

    // Verify webhook signature (in production)
    if (process.env.NODE_ENV === 'production' && WEBHOOK_SIGNATURE_KEY && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SIGNATURE_KEY)
        .update(body)
        .digest('base64');

      if (signature !== expectedSignature) {
        console.error('❌ Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(body);
    console.log('📧 Square webhook received:', event.type);

    switch (event.type) {
      case 'payment.created':
        await handlePaymentCreated(event.data.object.payment);
        break;

      case 'payment.updated':
        await handlePaymentUpdated(event.data.object.payment);
        break;

      case 'invoice.payment_made':
        await handleInvoicePayment(event.data.object);
        break;

      case 'subscription.created':
        await handleSubscriptionCreated(event.data.object.subscription);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data.object.subscription);
        break;

      default:
        console.log('ℹ️ Unhandled webhook event:', event.type);
    }

    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentCreated(payment: any) {
  console.log('💳 Payment created:', payment.id);
  
  // Store payment in database
  const paymentRecord = {
    id: payment.id,
    customerId: payment.buyer_email_address,
    amount: payment.amount_money.amount,
    currency: payment.amount_money.currency,
    status: payment.status,
    createdAt: new Date(payment.created_at),
    metadata: payment.note ? { note: payment.note } : {}
  };

  // Send confirmation email
  if (payment.buyer_email_address) {
    await sendPaymentConfirmation(payment.buyer_email_address, paymentRecord);
  }
}

async function handlePaymentUpdated(payment: any) {
  console.log('🔄 Payment updated:', payment.id, 'Status:', payment.status);
  
  if (payment.status === 'COMPLETED') {
    // Payment successful - activate early bird access
    await activateEarlyBirdAccess(payment);
  } else if (payment.status === 'FAILED') {
    // Payment failed - send notification
    await notifyPaymentFailure(payment);
  }
}

async function handleSubscriptionCreated(subscription: any) {
  console.log('📅 Subscription created:', subscription.id);
  
  // Create subscription record
  await createSubscriptionRecord(subscription);
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log('📅 Subscription updated:', subscription.id);
  
  // Update subscription status
  await updateSubscriptionRecord(subscription);
}

async function handleInvoicePayment(invoice: any) {
  console.log('📄 Invoice payment received:', invoice.id);
}

async function activateEarlyBirdAccess(payment: any) {
  try {
    // Extract customer info from payment metadata
    const customerId = payment.buyer_email_address;
    
    // Store early bird customer in database
    const earlyBirdCustomer = {
      id: payment.id,
      email: customerId,
      plan: extractPlanFromNote(payment.note || ''),
      discountPercent: 50,
      paymentAmount: payment.amount_money.amount / 100, // Convert from cents
      activatedAt: new Date(),
      status: 'active'
    };

    console.log('🎉 Early bird access activated:', earlyBirdCustomer);

    // Send welcome email
    await sendWelcomeEmail(customerId, earlyBirdCustomer);

  } catch (error) {
    console.error('Failed to activate early bird access:', error);
  }
}

async function sendPaymentConfirmation(email: string, payment: any) {
  // Mock implementation - replace with actual email service
  console.log('📧 Sending payment confirmation to:', email);
  
  const emailContent = {
    to: email,
    subject: 'Payment Confirmed - Verba AI Early Access',
    html: `
      <h2>Payment Confirmed! 🎉</h2>
      <p>Thank you for securing your early bird discount for Verba AI.</p>
      <p><strong>Payment ID:</strong> ${payment.id}</p>
      <p><strong>Amount:</strong> $${(payment.amount / 100).toFixed(2)}</p>
      <p><strong>Status:</strong> ${payment.status}</p>
      
      <h3>What's Next?</h3>
      <p>You've locked in your 50% lifetime discount! We'll send you login credentials when Verba AI launches in October 2024.</p>
      
      <p>Questions? Reply to this email or contact support@verba-ai.com</p>
      
      <p>Best regards,<br>The Verba AI Team</p>
    `
  };

  // In production, integrate with SendGrid, AWS SES, etc.
  // await emailService.send(emailContent);
}

async function sendWelcomeEmail(email: string, customer: any) {
  console.log('👋 Sending welcome email to:', email);
  
  // Mock welcome email
  const emailContent = {
    to: email,
    subject: 'Welcome to Verba AI - Early Bird Member! 🚀',
    html: `
      <h1>Welcome to Verba AI!</h1>
      <p>Congratulations on becoming an early bird member of Verba AI.</p>
      
      <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Your Early Bird Benefits:</h3>
        <ul>
          <li>✅ 50% off for life (normally ${customer.paymentAmount * 2}/month)</li>
          <li>✅ Priority access when we launch in October 2024</li>
          <li>✅ Direct feedback line to our development team</li>
          <li>✅ Free setup and training session</li>
        </ul>
      </div>
      
      <h3>What to Expect:</h3>
      <p>Over the next few weeks, we'll be reaching out to early bird customers to:</p>
      <ul>
        <li>Schedule your personalized demo</li>
        <li>Gather your specific feature requirements</li>
        <li>Provide beta access for testing (optional)</li>
      </ul>
      
      <p>Keep an eye on your inbox for updates!</p>
      
      <p>Thank you for believing in our mission to revolutionize clinical documentation.</p>
      
      <p>Best regards,<br>Daniel & The Verba AI Team</p>
    `
  };
}

async function notifyPaymentFailure(payment: any) {
  console.log('❌ Payment failed notification for:', payment.buyer_email_address);
  // Send payment failure notification
}

async function createSubscriptionRecord(subscription: any) {
  console.log('Creating subscription record:', subscription.id);
  // Store subscription in database
}

async function updateSubscriptionRecord(subscription: any) {
  console.log('Updating subscription record:', subscription.id);
  // Update subscription in database
}

function extractPlanFromNote(note: string): string {
  // Extract plan name from payment note
  if (note.includes('Professional')) return 'Professional';
  if (note.includes('Starter')) return 'Starter';
  if (note.includes('Enterprise')) return 'Enterprise';
  return 'Professional'; // Default
}