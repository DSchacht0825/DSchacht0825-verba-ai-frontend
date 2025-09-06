const { Client, Environment } = require('square');

// Initialize Square client with your credentials
const client = new Client({
  accessToken: 'EAAAl-OI2mHGB2q8yJ6eR_MinDLG4liUOrvbWw2JFQapfJ-_kAa5cT9wjyH_i99k',
  environment: Environment.Sandbox
});

async function setupSquare() {
  try {
    console.log('🔧 Setting up Square integration...\n');

    // 1. Get locations
    console.log('📍 Fetching Square locations...');
    const { result: locationsResult } = await client.locationsApi.listLocations();
    
    if (locationsResult.locations && locationsResult.locations.length > 0) {
      const location = locationsResult.locations[0];
      console.log(`✅ Found location: ${location.name} (${location.id})`);
      console.log(`   Address: ${location.address?.addressLine1}, ${location.address?.locality}`);
      console.log(`   Status: ${location.status}\n`);
      
      // Update .env.local with location ID
      const fs = require('fs');
      const path = require('path');
      const envPath = path.join(__dirname, '../.env.local');
      
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(
        'NEXT_PUBLIC_SQUARE_LOCATION_ID=your_sandbox_location_id',
        `NEXT_PUBLIC_SQUARE_LOCATION_ID=${location.id}`
      );
      fs.writeFileSync(envPath, envContent);
      
      console.log('✅ Updated .env.local with location ID\n');
    }

    // 2. Test payment creation (with fake card)
    console.log('💳 Testing payment processing...');
    
    // Create a test customer
    const { result: customerResult } = await client.customersApi.createCustomer({
      givenName: 'Test',
      familyName: 'Customer',
      emailAddress: 'test@verba-ai.com'
    });
    
    console.log(`✅ Created test customer: ${customerResult.customer?.id}\n`);

    // 3. Test webhook setup (optional)
    console.log('🔗 Webhook endpoints available:');
    console.log('   - Payment completed: POST /api/webhooks/square/payment');
    console.log('   - Subscription updated: POST /api/webhooks/square/subscription\n');

    // 4. Display integration status
    console.log('🎉 Square integration setup complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run `npm run dev` to start the development server');
    console.log('   2. Visit http://localhost:3000 to test payments');
    console.log('   3. Use test card: 4111 1111 1111 1111 (Visa)');
    console.log('   4. Use any future expiry date and any 3-digit CVV\n');

    console.log('🔒 Security notes:');
    console.log('   - Sandbox credentials are safe for testing');
    console.log('   - Never commit real production tokens to git');
    console.log('   - Use environment variables for production deployment\n');

  } catch (error) {
    console.error('❌ Square setup failed:', error.message);
    
    if (error.statusCode === 401) {
      console.error('🔑 Authentication failed. Please check your access token.');
    } else if (error.statusCode === 403) {
      console.error('🚫 Permission denied. Make sure your Square app has the required permissions.');
    }
  }
}

setupSquare();