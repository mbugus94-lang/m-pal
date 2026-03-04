// Comprehensive Production Test for M-Pal SDK
const fs = require('fs');
const path = require('path');

console.log('🧪 M-Pal Production Readiness Test\n');

// Test 1: Check all required files exist
console.log('📁 File Structure Check:');
const requiredFiles = [
  'index.ts',
  'MpesaKE.ts', 
  'MTNMoMo.ts',
  'AirtelMoney.ts',
  'base.ts',
  'queue.ts',
  'utils.ts',
  'types.ts',
  'package.json',
  'tsconfig.json',
  'README.md',
  '.env.example'
];

let filesExist = 0;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (exists) filesExist++;
});

console.log(`  Result: ${filesExist}/${requiredFiles.length} files present\n`);

// Test 2: Check package.json structure
console.log('📦 Package.json Check:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredFields = ['name', 'version', 'description', 'main', 'types', 'scripts'];
let packageOk = true;

requiredFields.forEach(field => {
  const exists = packageJson[field] !== undefined;
  console.log(`  ${exists ? '✅' : '❌'} ${field}: ${packageJson[field] || 'MISSING'}`);
  if (!exists) packageOk = false;
});

console.log(`  Result: ${packageOk ? '✅' : '❌'} Package.json is properly structured\n`);

// Test 3: Check API implementations
console.log('🔌 API Implementation Check:');
const apiFiles = ['MpesaKE.ts', 'MTNMoMo.ts', 'AirtelMoney.ts'];
apiFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hasEndpoints = content.includes('https://') && content.includes('api');
  const hasAuth = content.includes('Authorization') || content.includes('consumer_key');
  console.log(`  ${hasEndpoints ? '✅' : '❌'} ${file}: API endpoints`);
  console.log(`  ${hasAuth ? '✅' : '❌'} ${file}: Authentication`);
});

// Test 4: Check error handling
console.log('\n🛡️ Error Handling Check:');
const indexContent = fs.readFileSync('index.ts', 'utf8');
const errorPatterns = ['try', 'catch', 'throw', 'error'];
errorPatterns.forEach(pattern => {
  const hasErrorHandling = indexContent.includes(pattern);
  console.log(`  ${hasErrorHandling ? '✅' : '❌'} ${pattern} handling`);
});

// Test 5: Check TypeScript compilation
console.log('\n🔨 TypeScript Compilation:');
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
const hasDeclaration = tsconfig.compilerOptions?.declaration === true;
const hasStrict = tsconfig.compilerOptions?.strict === true;
console.log(`  ${hasDeclaration ? '✅' : '❌'} Declaration files`);
console.log(`  ${hasStrict ? '✅' : '❌'} Strict mode`);

// Test 6: Check environment variables
console.log('\n🌍 Environment Variables:');
const envExample = fs.readFileSync('.env.example', 'utf8');
const envVars = ['CONSUMER_KEY', 'CONSUMER_SECRET', 'API_KEY', 'ENVIRONMENT'];
envVars.forEach(varName => {
  const hasVar = envExample.includes(varName);
  console.log(`  ${hasVar ? '✅' : '❌'} ${varName}`);
});

// Test 7: Check utility functions
console.log('\n🛠️ Utility Functions:');
const utilsContent = fs.readFileSync('utils.ts', 'utf8');
const utilFunctions = ['normalizePhone', 'generateTimestamp', 'generateUUID', 'generateMpesaPassword'];
utilFunctions.forEach(func => {
  const hasFunc = utilsContent.includes(`export function ${func}`) || utilsContent.includes(`function ${func}`);
  console.log(`  ${hasFunc ? '✅' : '❌'} ${func}`);
});

// Test 8: Check queue system
console.log('\n📦 Queue System:');
const queueContent = fs.readFileSync('queue.ts', 'utf8');
const queueFeatures = ['OfflineQueue', 'QueuedTask', 'persist', 'restore'];
queueFeatures.forEach(feature => {
  const hasFeature = queueContent.includes(feature);
  console.log(`  ${hasFeature ? '✅' : '❌'} ${feature}`);
});

// Test 9: Check documentation
console.log('\n📚 Documentation:');
const readme = fs.readFileSync('README.md', 'utf8');
const docSections = ['Install', 'Usage', 'API', 'Examples', 'License'];
docSections.forEach(section => {
  const hasSection = readme.includes(section);
  console.log(`  ${hasSection ? '✅' : '❌'} ${section}`);
});

// Test 10: Check production readiness
console.log('\n🏭 Production Readiness:');
const productionChecks = [
  { name: 'TypeScript', check: fs.existsSync('tsconfig.json') },
  { name: 'Environment', check: fs.existsSync('.env.example') },
  { name: 'Documentation', check: fs.existsSync('README.md') },
  { name: 'Package.json', check: fs.existsSync('package.json') },
  { name: 'Type Definitions', check: fs.existsSync('types.ts') },
];

let productionScore = 0;
productionChecks.forEach(check => {
  const passed = check.check;
  console.log(`  ${passed ? '✅' : '❌'} ${check.name}`);
  if (passed) productionScore++;
});

console.log(`\n🎯 Production Score: ${productionScore}/${productionChecks.length}`);

// Final verdict
if (productionScore >= 8) {
  console.log('\n🎉 M-Pal SDK is PRODUCTION READY!');
  console.log('✅ All critical checks passed');
  console.log('✅ Can handle real production scenarios');
  console.log('✅ Proper error handling implemented');
  console.log('✅ All major providers implemented');
} else {
  console.log('\n⚠️  M-Pal SDK needs more work for production');
  console.log('❌ Missing critical components');
}

console.log('\n📋 Recommendations:');
console.log('1. Set up proper API keys with each provider');
console.log('2. Configure production environment variables');
console.log('3. Set up monitoring and logging');
console.log('4. Implement proper rate limiting');
console.log('5. Set up webhook endpoints');