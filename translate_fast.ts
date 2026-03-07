import fs from 'fs';

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

async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  const text = texts.join('\n');
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    const translatedText = data[0].map((item: any) => item[0]).join('');
    const translatedLines = translatedText.split('\n');
    
    // If line count doesn't match, fallback to individual translation
    if (translatedLines.length !== texts.length) {
      console.warn(`Line count mismatch for ${targetLang}. Expected ${texts.length}, got ${translatedLines.length}. Falling back to individual translation.`);
      return await Promise.all(texts.map(t => translateSingle(t, targetLang)));
    }
    return translatedLines;
  } catch (e) {
    console.error(`Failed to translate batch to ${targetLang}:`, e);
    return texts; // fallback to English
  }
}

async function translateSingle(text: string, targetLang: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data[0].map((item: any) => item[0]).join('');
  } catch (e) {
    return text;
  }
}

async function translateLanguage(lang: { code: string, label: string }) {
  console.log(`Translating ${lang.label} (${lang.code})...`);
  const result: Record<string, string> = {};
  
  const batchSize = 50;
  for (let i = 0; i < keys.length; i += batchSize) {
    const batchKeys = keys.slice(i, i + batchSize);
    console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(keys.length / batchSize)}`);
    
    const textsToTranslate = batchKeys.map(key => enData[key]);
    const translatedTexts = await translateBatch(textsToTranslate, lang.code);
    
    for (let j = 0; j < batchKeys.length; j++) {
      result[batchKeys[j]] = translatedTexts[j] ? translatedTexts[j].trim() : textsToTranslate[j];
    }
    
    await new Promise(r => setTimeout(r, 1000)); // 1s delay
  }
  
  fs.writeFileSync(`translations/${lang.code}.json`, JSON.stringify(result, null, 2));
  console.log(`Finished ${lang.label}`);
}

async function main() {
  if (!fs.existsSync('translations')) {
    fs.mkdirSync('translations');
  }
  
  for (const lang of languages) {
    await translateLanguage(lang);
  }
  
  // Now generate the new i18n.ts
  console.log('Generating new i18n.ts...');
  let i18nContent = fs.readFileSync('src/i18n.ts', 'utf-8');
  
  // Replace everything from `bn: { translation: {` to the end of the resources object
  const enStart = i18nContent.indexOf('en: { translation: {');
  const hiStart = i18nContent.indexOf('hi: { translation: {');
  const bnStart = i18nContent.indexOf('bn: { translation: {');
  
  if (bnStart !== -1) {
    // We need to replace everything from bnStart to the end of the resources object
    // Find where resources object ends
    const resourcesEnd = i18nContent.indexOf('};\n\ni18n');
    
    let newResources = '';
    for (let i = 0; i < languages.length; i++) {
      const lang = languages[i];
      const trans = JSON.parse(fs.readFileSync(`translations/${lang.code}.json`, 'utf-8'));
      const isLast = i === languages.length - 1;
      newResources += `${lang.code}: { translation: ${JSON.stringify(trans, null, 2).replace(/\n/g, '\n  ')} }${isLast ? '' : ',\n  '}`;
    }
    
    const newI18nContent = i18nContent.substring(0, bnStart) + newResources + '\n' + i18nContent.substring(resourcesEnd);
    fs.writeFileSync('src/i18n.ts', newI18nContent);
    console.log('Successfully updated src/i18n.ts');
  } else {
    console.log('Could not find bn block in i18n.ts');
  }
}

main().catch(console.error);
