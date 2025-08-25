import { GoogleGenerativeAI } from '@google/generative-ai';
import { Pinecone } from '@pinecone-database/pinecone';

// Feature flag for using Ollama instead of Google API
export const USE_OLLAMA = process.env.USE_OLLAMA === 'true';

// Google Gemini Configuration (used as fallback if Ollama is not available)
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!USE_OLLAMA && (!GOOGLE_API_KEY || GOOGLE_API_KEY === '')) {
  console.error('Google API key is missing! Please check your .env.local file.');
}

export const genAI = !USE_OLLAMA ? new GoogleGenerativeAI(GOOGLE_API_KEY!) : null;

// Pinecone Configuration
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

if (!PINECONE_API_KEY || PINECONE_API_KEY === '') {
  console.error('Pinecone API key is missing! Please check your .env.local file.');
}

export const pinecone = PINECONE_API_KEY ? new Pinecone({
  apiKey: PINECONE_API_KEY,
}) : null;

export const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'document-qa-index';

// Get Pinecone index
export const getPineconeIndex = () => {
  if (!pinecone) {
    throw new Error('Pinecone client not initialized. Please check your PINECONE_API_KEY.');
  }
  
  try {
    console.log(`Connecting to Pinecone index: ${PINECONE_INDEX_NAME}`);
    return pinecone.index(PINECONE_INDEX_NAME);
  } catch (error) {
    console.error(`Error connecting to Pinecone index: ${error}`);
    throw new Error(`Failed to connect to Pinecone index: ${PINECONE_INDEX_NAME}`);
  }
};

// Embedding model configuration
export const EMBEDDING_MODEL = 'text-embedding-004';
export const CHAT_MODEL = 'gemini-1.5-flash';

// Ollama model configuration
export const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
export const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text:latest';
// Force use of llama3:latest to avoid any environment variable conflicts
export const OLLAMA_CHAT_MODEL = 'llama3:latest';

// Document processing configuration
export const CHUNK_SIZE = 1000;
export const CHUNK_OVERLAP = 200;
