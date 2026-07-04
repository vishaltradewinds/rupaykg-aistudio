const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    `const [operatingContext, setOperatingContext] = useState<'urban' | 'rural'>('urban');`,
    `const [operatingContext, setOperatingContext] = useState<'urban' | 'rural'>('urban');\n  const [dashboardStateFilter, setDashboardStateFilter] = useState<string>('');\n  const [dashboardDistrictFilter, setDashboardDistrictFilter] = useState<string>('');`
);

fs.writeFileSync('src/App.tsx', code);
console.log("States patched");
