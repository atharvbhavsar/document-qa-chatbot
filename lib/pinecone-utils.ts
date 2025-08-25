import { getPineconeIndex } from './config';
import { DocumentChunk } from './document-processor';

export interface PineconeVector {
  id: string;
  values: number[];
  metadata: {
    text: string;
    filename: string;
    chunkIndex: number;
    totalChunks: number;
    pageNumber?: number;
    startPosition?: number;
    endPosition?: number;
  };
}

// Store document chunks in Pinecone
export async function storeDocumentChunks(
  chunks: DocumentChunk[],
  embeddings: number[][]
): Promise<void> {
  try {
    const index = getPineconeIndex();
    
    // Check if we have at least one embedding
    if (embeddings.length === 0 || chunks.length === 0) {
      console.error('No chunks or embeddings to store');
      return;
    }
    
    // Log the dimension size for debugging
    console.log(`Embedding dimension: ${embeddings[0].length}`);
    
    const vectors: PineconeVector[] = chunks.map((chunk, i) => ({
      id: chunk.id,
      values: embeddings[i],
      metadata: {
        text: chunk.text,
        filename: chunk.metadata.filename,
        chunkIndex: chunk.metadata.chunkIndex,
        totalChunks: chunk.metadata.totalChunks,
        ...(chunk.metadata.pageNumber !== undefined && { pageNumber: chunk.metadata.pageNumber }),
        ...(chunk.metadata.startPosition !== undefined && { startPosition: chunk.metadata.startPosition }),
        ...(chunk.metadata.endPosition !== undefined && { endPosition: chunk.metadata.endPosition }),
      },
    }));

    console.log('Attempting to store vectors in Pinecone...');
    
    // Upsert vectors in batches of 100
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      try {
        await index.upsert(batch);
        console.log(`Batch ${Math.floor(i/batchSize) + 1} uploaded successfully`);
      } catch (error) {
        console.error(`Error uploading batch ${Math.floor(i/batchSize) + 1}:`, error instanceof Error ? error.message : String(error));
        throw error;
      }
    }
    
    console.log(`Successfully stored ${vectors.length} document chunks in Pinecone`);
  } catch (error) {
    console.error('Error storing document chunks in Pinecone:', error);
    throw new Error('Failed to store document chunks');
  }
}

// Search for relevant document chunks
export async function searchDocuments(
  queryEmbedding: number[],
  topK: number = 5
): Promise<Array<{ text: string; filename: string; score: number; pageNumber?: number; startPosition?: number; endPosition?: number }>> {
  try {
    const index = getPineconeIndex();
    
    const searchResponse = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });

    return searchResponse.matches?.map(match => ({
      text: match.metadata?.text as string,
      filename: match.metadata?.filename as string,
      score: match.score || 0,
      pageNumber: match.metadata?.pageNumber as number | undefined,
      startPosition: match.metadata?.startPosition as number | undefined,
      endPosition: match.metadata?.endPosition as number | undefined,
    })) || [];
  } catch (error) {
    console.error('Error searching documents in Pinecone:', error);
    throw new Error('Failed to search documents');
  }
}

// Get list of all unique documents from Pinecone
export async function getDocumentList(): Promise<Array<{ filename: string; totalChunks: number }>> {
  try {
    const index = getPineconeIndex();
    
    // Query for all vectors with a zero vector to get metadata
    // Use 768 dimensions for Ollama embeddings instead of 1536 for Google embeddings
    const dummyVector = new Array(768).fill(0); // Fixed: Use 768 for Ollama compatibility
    
    const searchResponse = await index.query({
      vector: dummyVector,
      topK: 10000, // Large number to get all documents
      includeMetadata: true,
    });

    // Group by filename and get unique documents
    const documentMap = new Map<string, { filename: string; totalChunks: number }>();
    
    searchResponse.matches?.forEach(match => {
      const filename = match.metadata?.filename as string;
      const totalChunks = match.metadata?.totalChunks as number;
      
      if (filename && !documentMap.has(filename)) {
        documentMap.set(filename, { filename, totalChunks: totalChunks || 0 });
      }
    });

    return Array.from(documentMap.values());
  } catch (error) {
    console.error('Error getting document list from Pinecone:', error);
    throw new Error('Failed to get document list');
  }
}
