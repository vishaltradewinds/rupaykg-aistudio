const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `  app.get("/api/offset-projects/methodologies", auth(), (req, res) => {
    res.json(methodologyLibrary);
  });`;

const replacement = `  app.get("/api/offset-projects/methodologies", auth(), (req, res) => {
    res.json(methodologyLibrary);
  });

  app.post("/api/offset-projects/methodologies/import", auth(), (req, res) => {
    const { name, sector, description, rules, standards_body, version } = req.body;
    
    if (!name || !sector || !description) {
      return res.status(400).json({ error: "Missing required methodology fields" });
    }

    const newMethodology = {
      id: \`CERC-AM-\${String(Math.floor(Math.random() * 9000) + 1000)}\`,
      name,
      sector,
      description,
      standards_body: standards_body || "Custom / Imported",
      version: version || "1.0",
      rules: rules || []
    };

    methodologyLibrary.push(newMethodology);
    res.json({ message: "Methodology successfully compiled and synced to registry node.", methodology: newMethodology });
  });`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('server.ts', code);
  console.log('Server API patched');
} else {
  console.log('Server target not found');
}
