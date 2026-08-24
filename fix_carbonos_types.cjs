const fs = require('fs');

let code = fs.readFileSync('src/services/carbonOsService.ts', 'utf8');

// Replace the invalid safeDbCall queries with empty arrays cast to any[]
code = code.replace(/await safeDbCall\(\(\) => db\.select\(\)\.from\(\[\] \/\* calculation_inputs placeholder \*\/\)\.where\(eq\(\[\] \/\* calculation_inputs placeholder \*\/\.calculationRunId, calculationId\)\), \[\]\)/g, '([] as any[])');
code = code.replace(/await safeDbCall\(\(\) => db\.select\(\)\.from\(\[\] \/\* mrv_processes placeholder \*\/\)\s*\.where\(eq\(\[\] \/\* mrv_processes placeholder \*\/\.monitoringPeriodId, monitoringPeriodId\)\), \[\]\)/g, '([] as any[])');

fs.writeFileSync('src/services/carbonOsService.ts', code);
