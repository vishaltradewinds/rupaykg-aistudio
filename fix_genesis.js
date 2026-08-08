const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = "{view === 'genesis' && (";
const startIdx = content.indexOf(startStr);
if (startIdx === -1) {
  console.log("Start not found");
  process.exit(1);
}

const endStr = "            </motion.div>\n          )}";
// Wait, is it `          )}` after `</motion.div>`? Let's check what comes after.
