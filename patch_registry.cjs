const fs = require('fs');
let code = fs.readFileSync('src/services/registryGatewayAdapter.ts', 'utf-8');

const emptySeed = `
  private static seedInitialSubmissions(): RegistryProjectSubmission[] {
    const initial: RegistryProjectSubmission[] = [];
    localStorage.setItem(this.SUBMISSIONS_KEY, JSON.stringify(initial));
    return initial;
  }
`;

code = code.replace(/private static seedInitialSubmissions[\s\S]*?return initial;\n  \}/, emptySeed.trim());
fs.writeFileSync('src/services/registryGatewayAdapter.ts', code);
