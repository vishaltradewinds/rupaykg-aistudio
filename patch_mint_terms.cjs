const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/Value Minted/g, 'Verified Mitigation');
code = code.replace(/Mint Value/g, 'Generate Evidence');
code = code.replace(/Total Minted CCC Units/g, 'Verified MRV Volume');
code = code.replace(/CCC Minter Agency Credit: MINTED BY RupayKg CARBON TRUST METRIC ENGINE/g, 'MRV Auditor Credit: VERIFIED BY RupayKg MRV ENGINE');
code = code.replace(/Automated dMRV Mintings/g, 'Automated dMRV Verifications');
code = code.replace(/Confirm Intake & Mint Value/g, 'Confirm Intake & Register Evidence');
code = code.replace(/Validate dMRV & Mint Hedera Assets/g, 'Validate dMRV & Register on HCS');
code = code.replace(/Phase 3: Automated dMRV Submission & Token Minting/g, 'Phase 3: Automated dMRV Submission & Audit Trail');
code = code.replace(/Quantity Issued/g, 'Quantity Verified');
code = code.replace(/CCC issuance authority remains regulator-controlled. RupayKg does not independently mint CCCs./g, 'Issuance authority remains regulator-controlled. RupayKg generates registry-ready MRV data but does not independently issue CCCs.');
code = code.replace(/CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs./g, 'Issuance authority shall remain under regulator control. RupayKg serves as the digital evidence layer.');
code = code.replace(/Verifiable Hedera Consensus Service \(HCS\) record of all CCC Certificate \(CCC\) minting events/g, 'Verifiable Hedera Consensus Service (HCS) record of all MRV verification events');

fs.writeFileSync('src/App.tsx', code);
console.log('Mint terms patched in App.tsx');
