/**
 * Quick script to test WebSite Schema locally
 * 
 * Usage: node scripts/test-schema.js
 * 
 * Make sure your dev server is running on http://localhost:9100
 */

const https = require('https');
const http = require('http');

const url = process.argv[2] || 'http://localhost:9100';
const protocol = url.startsWith('https') ? https : http;

console.log(`Testing WebSite Schema on: ${url}\n`);

protocol.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    // Look for JSON-LD script tags
    const schemaMatches = data.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gs);
    
    if (!schemaMatches || schemaMatches.length === 0) {
      console.log('❌ No JSON-LD schema found in page source');
      return;
    }

    console.log(`✅ Found ${schemaMatches.length} JSON-LD schema(s)\n`);

    schemaMatches.forEach((match, index) => {
      // Extract JSON content
      const jsonMatch = match.match(/<script[^>]*>(.*?)<\/script>/s);
      if (jsonMatch) {
        try {
          const jsonContent = jsonMatch[1].trim();
          const schema = JSON.parse(jsonContent);
          
          console.log(`Schema ${index + 1}:`);
          console.log(`  Type: ${schema['@type']}`);
          
          if (schema['@type'] === 'WebSite') {
            console.log(`  ✅ WebSite Schema found!`);
            console.log(`  Name: ${schema.name}`);
            console.log(`  URL: ${schema.url}`);
            
            if (schema.potentialAction) {
              console.log(`  ✅ SearchAction found!`);
              console.log(`  Target: ${schema.potentialAction.target?.urlTemplate || 'N/A'}`);
              console.log(`  Query Input: ${schema.potentialAction['query-input'] || 'N/A'}`);
            } else {
              console.log(`  ⚠️  No SearchAction found`);
            }
          }
          
          console.log('');
        } catch (e) {
          console.log(`  ❌ Error parsing JSON: ${e.message}`);
        }
      }
    });
  });
}).on('error', (err) => {
  console.error(`❌ Error fetching page: ${err.message}`);
  console.log('\nMake sure your dev server is running: npm run dev');
});

