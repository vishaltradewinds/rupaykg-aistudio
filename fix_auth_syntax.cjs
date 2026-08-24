const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The regex might have produced auth(,) or auth() incorrectly if $3 was matched weirdly.
code = code.replace(/auth\(,\)/g, 'auth()');
code = code.replace(/auth\(\s*\)/g, 'auth()');
code = code.replace(/auth\(undefined\)/g, 'auth()');
code = code.replace(/auth\(,\s*/g, 'auth(');
code = code.replace(/auth\(\)\)/g, 'auth()'); // Just in case it got duplicated

fs.writeFileSync('server.ts', code);
console.log("Fixed auth syntax");
