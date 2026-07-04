const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `const filterByJurisdiction = (reqUser: any, targetArray: any[], type: "users" | "records" | "farmers" | "carbon" = "records", extraFilters?: { state?: string, district?: string, local_area?: string }) => {
    let filtered = targetArray;
    
    // First apply base role restrictions
    if (reqUser.role === "state_admin" && reqUser.state) {
      if (type === "users") {
        filtered = filtered.filter(u => u.state === reqUser.state);
      } else if (type === "records") {
        filtered = filtered.filter(r => {
          const u = users.find(user => user.id === r.citizen_id);
          return u && u.state === reqUser.state;
        });
      } else if (type === "farmers") {
        filtered = filtered.filter(f => {
          const u = users.find(user => user.id === f.created_by);
          return u && u.state === reqUser.state;
        });
      } else if (type === "carbon") {
        filtered = filtered.filter(c => {
          const citizen_id = c.stakeholder_chain ? c.stakeholder_chain[0] : null;
          const u = users.find(user => user.id === citizen_id);
          return u && u.state === reqUser.state;
        });
      }
    } else if (reqUser.role === "municipal_admin" && reqUser.district) {
      if (type === "users") {
        filtered = filtered.filter(u => u.district === reqUser.district);
      } else if (type === "records") {
        filtered = filtered.filter(r => {
          const u = users.find(user => user.id === r.citizen_id);
          return u && u.district === reqUser.district;
        });
      } else if (type === "farmers") {
        filtered = filtered.filter(f => {
          const u = users.find(user => user.id === f.created_by);
          return u && u.district === reqUser.district;
        });
      } else if (type === "carbon") {
        filtered = filtered.filter(c => {
          const citizen_id = c.stakeholder_chain ? c.stakeholder_chain[0] : null;
          const u = users.find(user => user.id === citizen_id);
          return u && u.district === reqUser.district;
        });
      }
    }

    // Apply dashboard extra filters
    if (extraFilters) {
      if (extraFilters.state) {
        filtered = filtered.filter(item => {
          let u;
          if (type === "users") u = item;
          else if (type === "records") u = users.find(user => user.id === item.citizen_id);
          else if (type === "farmers") u = users.find(user => user.id === item.created_by);
          else if (type === "carbon") u = users.find(user => user.id === (item.stakeholder_chain ? item.stakeholder_chain[0] : null));
          return u && u.state === extraFilters.state;
        });
      }
      if (extraFilters.district) {
        filtered = filtered.filter(item => {
          let u;
          if (type === "users") u = item;
          else if (type === "records") u = users.find(user => user.id === item.citizen_id);
          else if (type === "farmers") u = users.find(user => user.id === item.created_by);
          else if (type === "carbon") u = users.find(user => user.id === (item.stakeholder_chain ? item.stakeholder_chain[0] : null));
          return u && u.district === extraFilters.district;
        });
      }
      if (extraFilters.local_area) {
        filtered = filtered.filter(item => {
          let u;
          if (type === "users") u = item;
          else if (type === "records") u = users.find(user => user.id === item.citizen_id);
          else if (type === "farmers") u = users.find(user => user.id === item.created_by);
          else if (type === "carbon") u = users.find(user => user.id === (item.stakeholder_chain ? item.stakeholder_chain[0] : null));
          return u && u.local_area === extraFilters.local_area; // assuming local_area property exists
        });
      }
    }

    return filtered;
  };`;

const targetRegex = /const filterByJurisdiction = \(reqUser: any, targetArray: any\[\], type: "users" \| "records" \| "farmers" \| "carbon" = "records"\) => \{[\s\S]*?return filtered;\n  \};/;

if (targetRegex.test(code)) {
    code = code.replace(targetRegex, replacement);
    fs.writeFileSync('server.ts', code);
    console.log("Success");
} else {
    console.log("Could not find target to replace.");
}
