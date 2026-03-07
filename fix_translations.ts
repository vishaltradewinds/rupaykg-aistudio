import fs from 'fs';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const languages = [
  { code: 'ks', label: 'Kashmiri' },
  { code: 'mni', label: 'Manipuri' },
  { code: 'brx', label: 'Bodo' }
];

const enData = JSON.parse(fs.readFileSync('en.json', 'utf-8'));
const keys = Object.keys(enData);
const batchSize = 25;

async function translateBatch(batch: string[], targetLang: string) {
  const prompt = `Translate the following JSON values from English to ${targetLang}. Keep the keys exactly as they are. Return ONLY the JSON object.
  
  JSON:
  ${JSON.stringify(Object.fromEntries(batch.map(k => [k, enData[k]])), null, 2)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error(`Failed to translate batch to ${targetLang}:`, error);
    // Fallback to English values if translation fails
    return Object.fromEntries(batch.map(k => [k, enData[k]]));
  }
}

async function translateLanguage(lang: { code: string, label: string }) {
  console.log(`Translating ${lang.label} (${lang.code})...`);
  const translatedData: Record<string, string> = {};
  
  for (let i = 0; i < keys.length; i += batchSize) {
    const batch = keys.slice(i, i + batchSize);
    console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(keys.length / batchSize)}`);
    const translatedBatch = await translateBatch(batch, lang.label);
    Object.assign(translatedData, translatedBatch);
  }
  
  return translatedData;
}

async function main() {
  const allTranslations: Record<string, any> = {};
  
  for (const lang of languages) {
    allTranslations[lang.code] = await translateLanguage(lang);
  }

  // Update i18n.ts
  let i18nContent = fs.readFileSync('src/i18n.ts', 'utf-8');
  
  for (const langCode in allTranslations) {
    const startMarker = `${langCode}: { translation: {`;
    const startIdx = i18nContent.indexOf(startMarker);
    if (startIdx === -1) continue;
    
    const endIdx = i18nContent.indexOf('} },', startIdx);
    if (endIdx === -1) continue;
    
    const newBlockContent = Object.entries(allTranslations[langCode])
      .map(([k, v]) => `  "${k}": "${(v as string).replace(/"/g, '\\"')}"`)
      .join(',\n');
    
    i18nContent = i18nContent.substring(0, startIdx + startMarker.length) + '\n' + newBlockContent + '\n  ' + i18nContent.substring(endIdx);
  }
  
  fs.writeFileSync('src/i18n.ts', i18nContent);
  console.log('Successfully updated src/i18n.ts');
}

main();
