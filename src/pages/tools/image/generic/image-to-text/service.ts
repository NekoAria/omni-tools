import { createWorker } from 'tesseract.js';
import { InitialValuesType } from './types';

export const extractTextFromImage = async (
  file: File,
  options: InitialValuesType
): Promise<string> => {
  try {
    const { language, detectParagraphs } = options;

    // Create a Tesseract worker
    const worker = await createWorker(language);

    // Convert file to URL
    const imageUrl = URL.createObjectURL(file);

    // Recognize text
    const { data } = await worker.recognize(imageUrl);

    // Clean up
    URL.revokeObjectURL(imageUrl);
    await worker.terminate();

    // Process the result based on options
    if (detectParagraphs) {
      // Return text with paragraph structure preserved
      return data.text;
    } else {
      // Return plain text with basic formatting
      return data.text;
    }
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error(
      'Failed to extract text from image. Please try again with a clearer image.'
    );
  }
};

// Helper function to get available languages
export const getAvailableLanguages = (
  translateLabel: (key: string) => string = (key) => key
): { value: string; label: string }[] => {
  return [
    { value: 'eng', label: translateLabel('imageToText.languages.english') },
    { value: 'fra', label: translateLabel('imageToText.languages.french') },
    { value: 'deu', label: translateLabel('imageToText.languages.german') },
    { value: 'spa', label: translateLabel('imageToText.languages.spanish') },
    { value: 'ita', label: translateLabel('imageToText.languages.italian') },
    { value: 'por', label: translateLabel('imageToText.languages.portuguese') },
    { value: 'rus', label: translateLabel('imageToText.languages.russian') },
    { value: 'jpn', label: translateLabel('imageToText.languages.japanese') },
    {
      value: 'chi_sim',
      label: translateLabel('imageToText.languages.chineseSimplified')
    },
    {
      value: 'chi_tra',
      label: translateLabel('imageToText.languages.chineseTraditional')
    },
    { value: 'kor', label: translateLabel('imageToText.languages.korean') },
    { value: 'ara', label: translateLabel('imageToText.languages.arabic') }
  ];
};
