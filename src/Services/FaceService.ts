import * as ImageManipulator from 'expo-image-manipulator';
import { loadTensorflowModel } from 'react-native-fast-tflite';

let faceModel: any = null;

export const initFaceModel = async () => {
  if (!faceModel) {
    // Pass [] as the second argument for delegates
    faceModel = await loadTensorflowModel(
      require('../assets/mobilefacenet.tflite'),
      []
    );
  }
};

// Resizes the user-cropped image directly to MobileFaceNet's 112x112 spec
export const processFaceImage = async (imageUri: string): Promise<string> => {
  const manipulated = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 112, height: 112 } }],
    { format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipulated.uri;
};

// Generates the embedding vector via TFLite
export const getFaceEmbedding = async (croppedFaceUri: string): Promise<number[]> => {
  await initFaceModel();
  
  // TODO: Once your image-to-tensor raw byte conversion is plugged in, 
  // run: const output = await faceModel.run([inputTensor]);
  
  // Temporary mock vector matching standard embedding size (e.g. 128-dim)
  return Array.from({ length: 128 }, () => Math.random());
};

// Cosine Similarity Matcher
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