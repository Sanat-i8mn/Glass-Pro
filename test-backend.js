// Quick Backend Test Script
// Run: node test-backend.js

const http = require('http');

console.log('🔍 Testing backend connection...\n');

// Test 1: Check if backend is running
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Backend is running!');
      console.log('Response:', data);
      console.log('\n📊 Now testing /api/invoices endpoint...\n');
      
      // Test 2: Check invoices endpoint
      const invoiceOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/invoices?limit=5',
        method: 'GET'
      };
      
      const invoiceReq = http.request(invoiceOptions, (invoiceRes) => {
        let invoiceData = '';
        
        invoiceRes.on('data', (chunk) => {
          invoiceData += chunk;
        });
        
        invoiceRes.on('end', () => {
          if (invoiceRes.statusCode === 200) {
            const result = JSON.parse(invoiceData);
            console.log('✅ Invoices endpoint working!');
            console.log(`📝 Total invoices in database: ${result.total || 0}`);
            console.log(`📄 Invoices fetched: ${result.invoices?.length || 0}`);
            
            if (result.total === 0) {
              console.log('\n⚠️  WARNING: No invoices found in database!');
              console.log('💡 Solution: Create an invoice from the home page first.');
            } else {
              console.log('\n✅ Everything looks good!');
              console.log('Sample invoice:', JSON.stringify(result.invoices[0], null, 2));
            }
          } else {
            console.log('❌ Invoices endpoint error!');
            console.log('Status:', invoiceRes.statusCode);
            console.log('Response:', invoiceData);
          }
        });
      });
      
      invoiceReq.on('error', (error) => {
        console.log('❌ Error connecting to invoices endpoint:', error.message);
      });
      
      invoiceReq.end();
    } else {
      console.log('⚠️  Backend responded but with error status:', res.statusCode);
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Backend is NOT running!');
  console.log('Error:', error.message);
  console.log('\n💡 Solution:');
  console.log('1. Open terminal');
  console.log('2. cd backend');
  console.log('3. npm run dev');
  console.log('4. Wait for "Server running on port 5000" message');
  console.log('5. Run this test again: node test-backend.js');
});

req.end();
