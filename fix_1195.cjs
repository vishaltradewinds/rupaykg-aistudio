const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
const lines = code.split('\n');

for(let i=1185; i<=1198; i++) {
   console.log(i + ": " + lines[i]);
}

