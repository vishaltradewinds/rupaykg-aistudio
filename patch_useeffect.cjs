const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    `}, [token, adminRoleFilter, operatingContext, adminSubView]);`,
    `}, [token, adminRoleFilter, operatingContext, adminSubView, dashboardStateFilter, dashboardDistrictFilter]);`
);

fs.writeFileSync('src/App.tsx', code);
console.log("useEffect patched");
