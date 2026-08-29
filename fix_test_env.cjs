const fs = require('fs');

function addEnv(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('process.env.HEDERA_TOPIC_ID = "0.0.123456";')) {
        content = content.replace(/import \{ db \} from "\.\.\/src\/db\/db";\n/g, 'import { db } from "../src/db/db";\nprocess.env.HEDERA_TOPIC_ID = "0.0.123456";\n');
        content = content.replace(/import \{ db \} from "\.\.\/src\/db\/index\.ts";\n/g, 'import { db } from "../src/db/index.ts";\nprocess.env.HEDERA_TOPIC_ID = "0.0.123456";\n');
        fs.writeFileSync(file, content);
    }
}

addEnv('tests/two_process_survival_test.ts');
addEnv('tests/two_process_reader.ts');
addEnv('tests/pilot_persistence_test.ts');
addEnv('tests/urban_rural_test.ts');
addEnv('tests/fail_closed_test.ts');

