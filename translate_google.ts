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

async function translateText(text: string, targetLang: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data[0].map((item: any) => item[0]).join('');
  } catch (e) {
    console.error(`Failed to translate "${text}" to ${targetLang}:`, e);
    return text; // fallback to English
  }
}

async function translateLanguage(lang: { code: string, label: string }) {
  console.log(`Translating ${lang.label} (${lang.code})...`);
  const result: Record<string, string> = {};
  
  // To avoid rate limits, we'll translate in small batches with delays
  const batchSize = 10;
  for (let i = 0; i < keys.length; i += batchSize) {
    const batchKeys = keys.slice(i, i + batchSize);
    console.log(`  Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(keys.length / batchSize)}`);
    
    const promises = batchKeys.map(async (key) => {
      const text = enData[key];
      // Only translate if it's not a short code or number
      if (text.length < 2 || !/[a-zA-Z]/.test(text)) {
        result[key] = text;
        return;
      }
      result[key] = await translateText(text, lang.code);
    });
    
    await Promise.all(promises);
    await new Promise(r => setTimeout(r, 1000)); // 1s delay between batches
  }
  
  fs.writeFileSync(`translations/${lang.code}.json`, JSON.stringify(result, null, 2));
  console.log(`Finished ${lang.label}`);
}

async function main() {
  if (!fs.existsSync('translations')) {
    fs.mkdirSync('translations');
  }
  
  for (const lang of languages) {
    if (fs.existsSync(`translations/${lang.code}.json`)) {
      console.log(`Skipping ${lang.label}, already exists.`);
      continue;
    }
    await translateLanguage(lang);
  }
}

main().catch(console.error);
