const fs = require('fs');

function replaceFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // GroundRealityHub.tsx
    content = content.replace(/hederaHash: `0\.0\.4819201@\$\{Math\.floor\(100000 \+ Math\.random\(\) \* 900000\)\}`/g, "hederaHash: 'NOT_AVAILABLE'");
    content = content.replace(/receiptId: `UPI-RK-\$\{Math\.floor\(100000 \+ Math\.random\(\) \* 900000\)\}`/g, "receiptId: 'NOT_AVAILABLE'");
    
    // SwmCompliancePlatform.tsx
    content = content.replace(/integrityHash: `0x\$\{Array\.from\(\{ length: 16 \}, \(\) => Math\.floor\(Math\.random\(\) \* 16\)\.toString\(16\)\)\.join\(''\)\}`/g, "integrityHash: 'NOT_AVAILABLE'");
    content = content.replace(/slipNo: `WB-SLIP-\$\{Math\.floor\(100000 \+ Math\.random\(\) \* 900000\)\}`/g, "slipNo: 'NOT_AVAILABLE'");

    // StakeholderReportsCenter.tsx
    content = content.replace(/value: `0\.0\.\$\{Math\.floor\(1000000 \+ Math\.random\(\) \* 9000000\)\}`/g, "value: import.meta.env.VITE_HEDERA_TOPIC_ID || 'NOT_CONFIGURED'");
    content = content.replace(/value: `#\$\{Math\.floor\(10000 \+ Math\.random\(\) \* 90000\)\}`/g, "value: 'NOT_AVAILABLE'");
    content = content.replace(/value: `0x\$\{Array\.from\(\{ length: 32 \}, \(\) => Math\.floor\(Math\.random\(\) \* 16\)\.toString\(16\)\)\.join\(''\)\}`/g, "value: 'NOT_AVAILABLE'");
    content = content.replace(/value: `UPI-\$\{Math\.floor\(100000000000 \+ Math\.random\(\) \* 900000000000\)\}`/g, "value: 'NOT_AVAILABLE'");
    content = content.replace(/hederaGuardianHcsHash: `0x\$\{Array\.from\(\{ length: 32 \}, \(\) => Math\.floor\(Math\.random\(\) \* 16\)\.toString\(16\)\)\.join\(''\)\}`/g, "hederaGuardianHcsHash: 'NOT_AVAILABLE'");

    fs.writeFileSync(file, content);
}

replaceFile('src/components/GroundRealityHub.tsx');
replaceFile('src/components/SwmCompliancePlatform.tsx');
replaceFile('src/components/StakeholderReportsCenter.tsx');

