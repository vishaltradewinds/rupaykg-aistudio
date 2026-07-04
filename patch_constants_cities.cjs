const fs = require('fs');
let code = fs.readFileSync('src/constants.ts', 'utf8');

const replacement = `export const INDIAN_STATES: Record<string, Record<string, Record<string, string[]>>> = {
  "Maharashtra": {
    "Mumbai": {
      "Urban": ["Andheri", "Bandra", "Colaba", "Dadar", "Juhu"],
      "Rural": []
    },
    "Pune": {
      "Urban": ["Kothrud", "Hinjewadi", "Shivajinagar"],
      "Rural": ["Bhor", "Velhe", "Purandar", "Haveli"]
    },
    "Nagpur": {
      "Urban": ["Sitabuldi", "Dharampeth"],
      "Rural": ["Kamptee", "Hingna", "Umred"]
    }
  },
  "Karnataka": {
    "Bengaluru Urban": {
      "Urban": ["Koramangala", "Indiranagar", "Whitefield"],
      "Rural": []
    },
    "Bengaluru Rural": {
      "Urban": ["Devanahalli", "Nelamangala"],
      "Rural": ["Dodballapura", "Hoskote"]
    },
    "Mysuru": {
      "Urban": ["Gokulam", "Kuvempunagar"],
      "Rural": ["Hunsur", "Nanjangud", "HD Kote"]
    }
  },
  "Uttar Pradesh": {
    "Lucknow": {
      "Urban": ["Gomti Nagar", "Hazratganj"],
      "Rural": ["Malihabad", "Bakshi Ka Talab"]
    },
    "Kanpur": {
      "Urban": ["Kidwai Nagar", "Civil Lines"],
      "Rural": ["Ghatampur", "Bilhaur"]
    }
  }
};`;

code = code.replace(/export const INDIAN_STATES: Record<string, Record<string, string\[\]>> = \{[\s\S]*?\};/, replacement);

fs.writeFileSync('src/constants.ts', code);
console.log("Constants updated with Urban/Rural areas");
