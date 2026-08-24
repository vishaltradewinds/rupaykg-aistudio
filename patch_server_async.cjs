const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

// Replace records.push(record) in an async way?
// If a route is app.post(..., (req, res) => { ... records.push() })
// we need it to be async (req, res) => { ... await RecordService.addRecord() }

// It's safer to just provide an exact replacement file or use TS compilation/AST transforms.
// Given the time/resource limit, let's write a simple AST-based script using regex that converts the surrounding function to async.

code = code.replace(/app\.(post|get|put|delete)\("([^"]+)",\s*(\[.*?\])?\s*,?\s*\(req, res\) =>/g, 'app.$1("$2", $3, async (req, res) =>');
code = code.replace(/app\.(post|get|put|delete)\("([^"]+)",\s*\(req, res\) =>/g, 'app.$1("$2", async (req, res) =>');

// Also update `auth` middleware usage
code = code.replace(/app\.(post|get|put|delete)\("([^"]+)",\s*auth\((.*?)\),\s*\(req:\s*AuthRequest,\s*res:\s*Response\) =>/g, 'app.$1("$2", auth($3), async (req: AuthRequest, res: Response) =>');
code = code.replace(/app\.(post|get|put|delete)\("([^"]+)",\s*auth\((.*?)\),\s*\(req:\s*any,\s*res:\s*any\) =>/g, 'app.$1("$2", auth($3), async (req: any, res: any) =>');
code = code.replace(/app\.(post|get|put|delete)\("([^"]+)",\s*auth\((.*?)\),\s*\(req,\s*res\) =>/g, 'app.$1("$2", auth($3), async (req, res) =>');

fs.writeFileSync('server.ts', code);
console.log("Made routes async");
