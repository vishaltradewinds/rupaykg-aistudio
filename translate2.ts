import fs from 'fs';
import { translate } from '@vitalets/google-translate-api';

const languages = [{ code: 'hi', label: 'Hindi' }];

async function run() {
  const appTsx = fs.readFileSync('src/App.tsx', 'utf-8');
  const matches = appTsx.match(/t\(['"]([^'"]+)['"]\)/g);
  const usedKeys = new Set(matches.map(m => m.slice(3, -2)));
  
  const content = fs.readFileSync('src/i18n.ts', 'utf-8');
  
  const enMatch = content.match(/en:\s*{\s*translation:\s*({[\s\S]*?})\s*}/);
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
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${lang.code}`;
        const response = await fetch(url);
        const data = await response.json();
        const translatedText = data.responseData.translatedText;
        const translatedBatch = translatedText.split(/\s*_\|\|\|_\s*/);
        
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
