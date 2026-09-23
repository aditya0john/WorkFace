import * as FileSystem from 'expo-file-system/legacy';

// Replace with your computer's local IP address if testing on a physical phone via Wi-Fi 
// (e.g., 'http://192.168.1.15:5000/get-embedding')
// Use 'http://10.0.2.2:5000/get-embedding' if using an Android Emulator
const FLASK_API_URL = 'http://192.168.1.2:5000/get-embedding';

export const getFaceEmbeddingFromBackend = async (imageUri: string): Promise<number[]> => {
  try {
    // 1. Convert local image URI to Base64 string
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 2. Send to Python Flask API
    const response = await fetch(FLASK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate embedding.');
    }

    return data.embedding; // Returns the number[] vector array
  } catch (error: any) {
    throw new Error(`Face Service Error: ${error.message}`);
  }
};

// Cosine Similarity Math (Runs completely offline in JS on your app)
export const calculateCosineSimilarity = (vecA: number[], vecB: number[]): number => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};