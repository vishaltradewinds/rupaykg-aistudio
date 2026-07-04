const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `      if (extraFilters.local_area) {
        filtered = filtered.filter(item => {
          let u;
          if (type === "users") u = item;
          else if (type === "records") u = users.find(user => user.id === item.citizen_id);
          else if (type === "farmers") u = users.find(user => user.id === item.created_by);
          else if (type === "carbon") u = users.find(user => user.id === (item.stakeholder_chain ? item.stakeholder_chain[0] : null));
          
          const itemVillage = item.village;
          const userCity = u ? u.city : null;
          const userVillage = u ? u.village : null;
          
          return itemVillage === extraFilters.local_area || userCity === extraFilters.local_area || userVillage === extraFilters.local_area;
        });
      }`;

code = code.replace(/if \(extraFilters\.local_area\) \{[\s\S]*?\}\n      \}/, replacement);

fs.writeFileSync('server.ts', code);
console.log("Local area filter logic patched");
