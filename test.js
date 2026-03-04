// Test script for Afrisdk
import dotenv from 'dotenv';
import { AfriPay } from './index';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Afrisdk...\n');

// Test 1: Initialize SDK
try {
  const afriPay = new AfriPay({
    apiKey: process.env.API_KEY || 'test-key',
    environment: 'sandbox'
  });
  console.log('✅ SDK initialized successfully');
} catch (error) {
  console.log('❌ SDK initialization failed:', error.message);
}

// Test 2: Test M-Pesa Kenya
try {
  const mpesaKE = new AfriPay({
    apiKey: process.env.API_KEY || 'test-key',
    provider: 'MpesaKE',
    environment: 'sandbox'
  });
  
  const paymentRequest = {
    amount: 10,
    phone: '254722123456',
    accountNumber: '600100'
  };
  
  console.log('\n✅ M-Pesa Kenya provider created');
  console.log('Payment request:', paymentRequest);
} catch (error) {
  console.log('❌ M-Pesa Kenya failed:', error.message);
}

// Test 3: Test MTN MoMo
try {
  const mtnMoMo = new AfriPay({
    apiKey: process.env.API_KEY || 'test-key',
    provider: 'MTNMoMo',
    environment: 'sandbox'
  });
  
  const paymentRequest = {
    amount: 5,
    phone: '233500000000',
    currency: 'GHS'
  };
  
  console.log('\n✅ MTN MoMo provider created');
  console.log('Payment request:', paymentRequest);
} catch (error) {
  console.log('❌ MTN MoMo failed:', error.message);
}

// Test 4: Test Airtel Money
try {
  const airtelMoney = new AfriPay({
    apiKey: process.env.API_KEY || 'test-key',
    provider: 'AirtelMoney',
    environment: 'sandbox'
  });
  
  const paymentRequest = {
    amount: 15,
    phone: '256700000000',
    currency: 'UGX'
  };
  
  console.log('\n✅ Airtel Money provider created');
  console.log('Payment request:', paymentRequest);
} catch (error) {
  console.log('❌ Airtel Money failed:', error.message);
}

console.log('\n🎉 Afrisdk test completed!');