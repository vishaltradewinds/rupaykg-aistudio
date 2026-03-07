import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

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

async function run() {
  const content = fs.readFileSync('src/i18n.ts', 'utf-8');
  
  const enMatch = content.match(/en:\s*{\s*translation:\s*({[\s\S]*?})\s*},?\s*hi:/);
  if (!enMatch) {
    console.error("Could not find 'en' translation object");
    return;
  }
  
  let enKeys = {};
  const lines = enMatch[1].split('\n');
  for (const line of lines) {
    const match = line.match(/"([^"]+)":\s*"([^"]+)"/);
    if (match) {
      enKeys[match[1]] = match[2];
    }
  }

  const keysToTranslate = Object.keys(enKeys);
  console.log(`Found ${keysToTranslate.length} keys to translate.`);

  let newContent = content;

  for (const lang of languages) {
    console.log(`Processing ${lang.label} (${lang.code})...`);
    
    const langRegex = new RegExp(`${lang.code}:\\s*{\\s*translation:\\s*({[\\s\\S]*?})\\s*}\\s*},?`);
    const langMatch = newContent.match(langRegex);
    
    let existingKeys = {};
    if (langMatch) {
      const langLines = langMatch[1].split('\n');
      for (const line of langLines) {
        const match = line.match(/"([^"]+)":\s*"([^"]+)"/);
        if (match) {
          existingKeys[match[1]] = match[2];
        }
      }
    }
    
    const missingKeys = keysToTranslate.filter(k => !existingKeys[k] || existingKeys[k] === k);
    
    if (missingKeys.length === 0) {
      console.log(`No missing keys for ${lang.label}.`);
      continue;
    }
    
    console.log(`Translating ${missingKeys.length} missing keys for ${lang.label}...`);
    
    let translatedObj = { ...existingKeys };
    
    const batchSize = 50;
    for (let i = 0; i < missingKeys.length; i += batchSize) {
      const batch = missingKeys.slice(i, i + batchSize);
      
      try {
        const prompt = `Translate the following JSON object values from English to ${lang.label}. Keep the keys exactly the same. Only return the translated JSON object, nothing else. Do not use markdown blocks.\n\n${JSON.stringify(Object.fromEntries(batch.map(k => [k, k])), null, 2)}`;
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });
        
        let translatedBatch = {};
        try {
          translatedBatch = JSON.parse(response.text.trim());
        } catch (e) {
          console.error(`Failed to parse JSON for ${lang.code}:`, e);
          // Fallback to original keys
          for (const k of batch) {
            translatedBatch[k] = k;
          }
        }
        
        for (const k of batch) {
          translatedObj[k] = translatedBatch[k] || k;
        }
      } catch (err) {
        console.error(`Failed to translate batch for ${lang.code}:`, err.message);
        for (const k of batch) {
          translatedObj[k] = k;
        }
      }
      
      await new Promise(r => setTimeout(r, 1000));
    }
    
    const translatedJson = JSON.stringify(translatedObj, null, 2);
    
    if (langMatch) {
      newContent = newContent.replace(langRegex, `${lang.code}: { translation: ${translatedJson} },`);
    } else {
      newContent = newContent.replace(/};\s*i18n/, `  ${lang.code}: { translation: ${translatedJson} },\n};\n\ni18n`);
    }
    
    fs.writeFileSync('src/i18n.ts', newContent);
    console.log(`Saved ${lang.label}`);
  }
  
  console.log("Done!");
}

run();
