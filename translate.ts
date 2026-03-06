import fs from 'fs';
import { translate } from '@vitalets/google-translate-api';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
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
  const appTsx = fs.readFileSync('src/App.tsx', 'utf-8');
  const matches = appTsx.match(/t\(['"]([^'"]+)['"]\)/g);
  const usedKeys = new Set(matches.map(m => m.slice(3, -2)));
  
  const content = fs.readFileSync('src/i18n.ts', 'utf-8');
  
  const enMatch = content.match(/en:\s*{\s*translation:\s*({[\s\S]*?})\s*},\s*hi:/);
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

  // Find missing keys for each language
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
    
    const missingKeys = Array.from(usedKeys).filter(k => !existingKeys[k]);
    
    if (missingKeys.length === 0) {
      console.log(`No missing keys for ${lang.label}.`);
      continue;
    }
    
    console.log(`Translating ${missingKeys.length} missing keys for ${lang.label}...`);
    
    let translatedObj = { ...existingKeys };
    
    const batchSize = 10;
    for (let i = 0; i < missingKeys.length; i += batchSize) {
      const batch = missingKeys.slice(i, i + batchSize);
      const textToTranslate = batch.join(' _|||_ ');
      
      try {
        const res = await translate(textToTranslate, { to: lang.code });
        const translatedBatch = res.text.split(/\s*_\|\|\|_\s*/);
        
        for (let j = 0; j < batch.length; j++) {
          translatedObj[batch[j]] = translatedBatch[j] || batch[j];
        }
      } catch (err) {
        console.error(`Failed to translate batch for ${lang.code}:`, err.message);
        for (let j = 0; j < batch.length; j++) {
          translatedObj[batch[j]] = batch[j];
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
