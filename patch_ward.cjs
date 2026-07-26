const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/const \[wardAnalytics, setWardAnalytics\] = useState<any\[\]>\(\[\]\);\n?/g, '');

const apiCallPattern = /const wardRes = await fetch\(`\/api\/municipal\/ward-analytics\?context=\$\{operatingContext\}`.*?\n\s*if \(wardRes\.ok\) \{\n\s*const wardData = await wardRes\.json\(\);\n\s*setWardAnalytics\(wardData\.ward_data\);\n\s*\}/g;
code = code.replace(apiCallPattern, '');

fs.writeFileSync('src/App.tsx', code);
console.log('Removed wardAnalytics state and API call.');
