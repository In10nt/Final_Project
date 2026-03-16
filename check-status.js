const axios = require('axios');

async function checkServices() {
  console.log('🔍 Checking Virtual Try-On Platform Status...\n');

  const services = [
    {
      name: 'Backend API',
      url: 'http://localhost:8082/api/health',
      fallback: 'http://localhost:8082/actuator/health'
    },
    {
      name: 'Admin Dashboard',
      url: 'http://localhost:3002',
      type: 'web'
    },
    {
      name: 'Customer Store',
      url: 'http://localhost:3001',
      type: 'web'
    }
  ];

  for (const service of services) {
    try {
      console.log(`Checking ${service.name}...`);
      
      let response;
      try {
        response = await axios.get(service.url, { timeout: 5000 });
      } catch (error) {
        if (service.fallback) {
          console.log(`  Trying fallback URL...`);
          response = await axios.get(service.fallback, { timeout: 5000 });
        } else {
          throw error;
        }
      }
      
      if (response.status === 200) {
        console.log(`  ✅ ${service.name} is running (${service.url})`);
      } else {
        console.log(`  ⚠️  ${service.name} responded with status ${response.status}`);
      }
    } catch (error) {
      console.log(`  ❌ ${service.name} is not accessible (${service.url})`);
      console.log(`     Error: ${error.message}`);
    }
    console.log('');
  }

  // Check database connection through backend
  try {
    console.log('Checking Database Connection...');
    const response = await axios.get('http://localhost:8082/api/products', { timeout: 5000 });
    console.log(`  ✅ Database connection is working`);
    console.log(`  📊 Found ${response.data.length || 0} products in database`);
  } catch (error) {
    console.log(`  ❌ Database connection failed`);
    console.log(`     Error: ${error.message}`);
  }

  console.log('\n🎯 Quick Access Links:');
  console.log('   Admin Dashboard: http://localhost:3002');
  console.log('   Customer Store:  http://localhost:3001');
  console.log('   Backend API:     http://localhost:8082');
  console.log('\n📝 Login Credentials:');
  console.log('   Email: user@example.com');
  console.log('   Password: password (any password works)');
}

// Run if called directly
if (require.main === module) {
  checkServices().catch(console.error);
}

module.exports = { checkServices };