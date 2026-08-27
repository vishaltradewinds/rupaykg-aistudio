const fs = require('fs');
let code = fs.readFileSync('src/routes/carbon.ts', 'utf8');

// Replace ownerId = req.body in projects creation
code = code.replace(/const \{ name, description, ownerId, wasteSourceRecordId, methodologyId \} = req\.body;/,
`const { name, description, wasteSourceRecordId, methodologyId } = req.body;
    const ownerId = (req as any).user?.uid || (req as any).user?.id;
    if (!ownerId) return res.status(401).json({ error: "Missing authenticated user" });`);

// For GET /projects/:id and other state-changing routes, we need tenant isolation.
// I'll add a tenant check for /projects/:id
code = code.replace(/const data = await db\.select\(\)\.from\(carbon_projects\)\.where\(eq\(carbon_projects\.id, req\.params\.id\)\);/g,
`const data = await db.select().from(carbon_projects).where(eq(carbon_projects.id, req.params.id));
    if (data.length && data[0].ownerId && data[0].ownerId !== (req as any).user?.uid && !["super_admin", "regulator", "auditor"].includes((req as any).user?.role)) {
      return res.status(403).json({ error: "Cross-tenant access denied" });
    }`);

// Same for GET /projects
code = code.replace(/carbonRouter\.get\('\/projects', async \(req, res\) => \{[\s\S]*?const data = await db\.select\(\)\.from\(carbon_projects\);/,
`carbonRouter.get('/projects', async (req, res) => {
  try {
    const userRole = (req as any).user?.role;
    const uid = (req as any).user?.uid;
    let data;
    if (["super_admin", "regulator", "auditor"].includes(userRole)) {
       data = await db.select().from(carbon_projects);
    } else {
       data = await db.select().from(carbon_projects).where(eq(carbon_projects.ownerId, uid));
    }`);

// Same for other state-changing like /projects/:id/intake
code = code.replace(/carbonRouter\.post\('\/projects\/:id\/intake', async \(req, res\) => \{[\s\S]*?try \{/g,
`carbonRouter.post('/projects/:id/intake', async (req, res) => {
  try {
    const project = await db.select().from(carbon_projects).where(eq(carbon_projects.id, req.params.id));
    if (!project.length) return res.status(404).json({ error: "Not found" });
    if (project[0].ownerId && project[0].ownerId !== (req as any).user?.uid && !["super_admin"].includes((req as any).user?.role)) {
      return res.status(403).json({ error: "Cross-tenant mutation denied" });
    }`);

// /projects/:id/eligibility
code = code.replace(/carbonRouter\.get\('\/projects\/:id\/eligibility', async \(req, res\) => \{[\s\S]*?try \{/g,
`carbonRouter.get('/projects/:id/eligibility', async (req, res) => {
  try {
    const project = await db.select().from(carbon_projects).where(eq(carbon_projects.id, req.params.id));
    if (!project.length) return res.status(404).json({ error: "Not found" });
    if (project[0].ownerId && project[0].ownerId !== (req as any).user?.uid && !["super_admin", "auditor", "regulator"].includes((req as any).user?.role)) {
      return res.status(403).json({ error: "Cross-tenant access denied" });
    }`);
    
// /projects/:id/ccts-submissions
code = code.replace(/carbonRouter\.post\('\/projects\/:id\/ccts-submissions', async \(req, res\) => \{[\s\S]*?try \{/g,
`carbonRouter.post('/projects/:id/ccts-submissions', async (req, res) => {
  try {
    const project = await db.select().from(carbon_projects).where(eq(carbon_projects.id, req.params.id));
    if (!project.length) return res.status(404).json({ error: "Not found" });
    if (project[0].ownerId && project[0].ownerId !== (req as any).user?.uid && !["super_admin"].includes((req as any).user?.role)) {
      return res.status(403).json({ error: "Cross-tenant mutation denied" });
    }`);
    
// /projects/:id/ccts-submissions/:sub_id/status
code = code.replace(/carbonRouter\.post\('\/projects\/:id\/ccts-submissions\/:sub_id\/status', async \(req, res\) => \{[\s\S]*?try \{/g,
`carbonRouter.post('/projects/:id/ccts-submissions/:sub_id/status', async (req, res) => {
  try {
    if (!["super_admin", "regulator"].includes((req as any).user?.role)) {
      return res.status(403).json({ error: "Status mutation requires regulator or super_admin" });
    }`);

// /projects/:id/acva-appointment
code = code.replace(/carbonRouter\.post\('\/projects\/:id\/acva-appointment', async \(req, res\) => \{[\s\S]*?try \{/g,
`carbonRouter.post('/projects/:id/acva-appointment', async (req, res) => {
  try {
    const project = await db.select().from(carbon_projects).where(eq(carbon_projects.id, req.params.id));
    if (!project.length) return res.status(404).json({ error: "Not found" });
    if (project[0].ownerId && project[0].ownerId !== (req as any).user?.uid && !["super_admin"].includes((req as any).user?.role)) {
      return res.status(403).json({ error: "Cross-tenant mutation denied" });
    }`);

// /projects/:id/acva-case/action
code = code.replace(/carbonRouter\.post\('\/projects\/:id\/acva-case\/action', async \(req, res\) => \{[\s\S]*?try \{/g,
`carbonRouter.post('/projects/:id/acva-case/action', async (req, res) => {
  try {
    if (!["super_admin", "auditor"].includes((req as any).user?.role)) {
      return res.status(403).json({ error: "Only auditor can perform this action" });
    }`);

fs.writeFileSync('src/routes/carbon.ts', code);
console.log("Carbon tenant isolation patched");
