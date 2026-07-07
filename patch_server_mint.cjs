const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/mintBlock/g, 'appendBlock');
code = code.replace(/total_ccc_minted/g, 'total_ccc_verified');
code = code.replace(/System mints and earns the CCCs/g, 'System registers and tracks verified MRV payloads');
code = code.replace(/CCC_MINTING/g, 'MRV_VERIFICATION');
code = code.replace(/total_ccc_units_minted/g, 'total_ccc_units_verified');
code = code.replace(/Automated dREC tracking and minting methodology\. Measures solar\/wind MWh output to mint Renewable Energy Certificates\./g, 'Automated dREC tracking and verification methodology. Measures solar/wind MWh output to verify Renewable Energy Certificates.');
code = code.replace(/carbonMintedKg/g, 'carbonVerifiedKg');
code = code.replace(/GUARDIAN_MRV_MINT/g, 'GUARDIAN_MRV_VERIFICATION');
code = code.replace(/Verified & Minted/g, 'Verified & Registered');
code = code.replace(/tokensMinted/g, 'tokensVerified');
code = code.replace(/Minted \$\{carbonMintedKg\.toFixed\(2\)\} carbon-offset equivalent tokens on Hedera network\./g, 'Registered ${carbonVerifiedKg.toFixed(2)} kg CO2e verified mitigation on Hedera network.');
code = code.replace(/total_minted/g, 'total_verified');

fs.writeFileSync('server.ts', code);
console.log('Server mint references patched');
