const fs = require('fs');

function fixPayload(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    content = content.replace(/action: "MRV_VERIFIED",\n    data: \{ weight_kg: 500, ccc_amount_kg: 750 \},\n    actor: `user_\$\{testId\}`,/g, 'eventType: "MRV_VERIFIED", recordId: `rec_${testId}`');
    content = content.replace(/action: "SURVIVAL_BLOCK",\n    data: \{ weight_kg: 720, ccc_amount_kg: 1080 \},\n    actor: "SYSTEM",/g, 'eventType: "SURVIVAL_BLOCK", recordId: recordId');

    fs.writeFileSync(file, content);
}

fixPayload('tests/pilot_persistence_test.ts');
fixPayload('tests/two_process_survival_test.ts');

