import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const languages = [
  { code: 'bn', label: 'Bengali' },
  { code: 'te', label: 'Telugu' },
  { code: 'mr', label: 'Marathi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'ur', label: 'Urdu' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'kn', label: 'Kannada' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'or', label: 'Odia' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'as', label: 'Assamese' },
  { code: 'mai', label: 'Maithili' },
  { code: 'sat', label: 'Santali' },
  { code: 'ks', label: 'Kashmiri' },
  { code: 'ne', label: 'Nepali' },
  { code: 'kok', label: 'Konkani' },
  { code: 'sd', label: 'Sindhi' },
  { code: 'doi', label: 'Dogri' },
  { code: 'mni', label: 'Manipuri' },
  { code: 'brx', label: 'Bodo' },
  { code: 'sa', label: 'Sanskrit' }
];

const enData = JSON.parse(fs.readFileSync('en.json', 'utf-8'));
const keys = Object.keys(enData);

async function translateBatch(batch: Record<string, string>, langName: string): Promise<Record<string, string>> {
  const prompt = `Translate the values of the following JSON object into ${langName}. Keep the keys exactly the same. Return ONLY valid JSON.
  
${JSON.stringify(batch, null, 2)}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.1,
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error(`Failed to parse response for ${langName}:`, response.text);
    throw e;
  }
}

async function translateLanguage(lang: { code: string, label: string }) {
  console.log(`Translating ${lang.label} (${lang.code})...`);
  const result: Record<string, string> = {};
  const batchSize = 100; // Increase batch size to speed up
  
  for (let i = 0; i < keys.length; i += batchSize) {
    const batchKeys = keys.slice(i, i + batchSize);
    const batch: Record<string, string> = {};
    for (const key of batchKeys) {
      batch[key] = enData[key];
    }
    
    let retries = 3;
    while (retries > 0) {
      try {
        console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(keys.length / batchSize)}`);
        const translatedBatch = await translateBatch(batch, lang.label);
        for (const key of batchKeys) {
          result[key] = translatedBatch[key] || batch[key]; // fallback to English if missing
        }
        break;
      } catch (e) {
        retries--;
        console.error(`  Error in batch, retries left: ${retries}`);
        if (retries === 0) throw e;
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }
  
  fs.writeFileSync(`translations/${lang.code}.json`, JSON.stringify(result, null, 2));
  console.log(`Finished ${lang.label}`);
}

async function main() {
  if (!fs.existsSync('translations')) {
    fs.mkdirSync('translations');
  }
  
  // To avoid hitting rate limits, process sequentially
  for (const lang of languages) {
    if (fs.existsSync(`translations/${lang.code}.json`)) {
      console.log(`Skipping ${lang.label}, already exists.`);
      continue;
    }
    await translateLanguage(lang);
  }
}

main().catch(console.error);
