require('dotenv').config({ path: '.env.local' });

console.log('Environment variables check:');
console.log('USE_OLLAMA:', process.env.USE_OLLAMA);
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'SET' : 'NOT SET');
console.log('PINECONE_API_KEY:', process.env.PINECONE_API_KEY ? 'SET' : 'NOT SET');
console.log('OLLAMA_HOST:', process.env.OLLAMA_HOST);
console.log('Current working directory:', process.cwd());
console.log('Node environment:', process.env.NODE_ENV);
