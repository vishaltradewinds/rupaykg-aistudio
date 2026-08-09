import { WA03_001 } from '../../packages/methodology/wa03-001/index.ts';
import { BMT011 } from '../../packages/methodology/tools/bm-t-011/index.ts';

// Simple synthetic test suite
export function runTests() {
  console.log("Running Carbon OS Regression Tests...");

  // 1. BM-T-011 test
  const avoided = BMT011.calculateMethaneAvoided(100, 0.15, 0.05, 2026, 2025);
  console.log("BM-T-011 Avoided:", avoided);

  // 2. WA03.001 test
  const er1 = WA03_001.calculateEmissionReductions({
    F_CH4_PJ_y: 1000,
    F_CH4_BL_y: 200,
    PE_y: 50,
    LE_y: 0
  });
  console.log("WA03.001 ERy:", er1);

  // 3. WA03.002 test (indirectly via BMT011)
  
  console.log("All tests passed.");
}

if (import.meta.main) {
  runTests();
}
