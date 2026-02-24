export interface WasteType {
  type: string;
  category: string;
  value: number;
  carbon: number;
}

export const WASTE_CATEGORIES = [
  "Agricultural",
  "Municipal",
  "Industrial",
  "Forestry",
  "Livestock",
  "Aquatic",
  "Construction",
  "Plastics",
  "Metals",
  "E-Waste",
  "Textiles",
  "Hazardous"
];

export const WASTE_TYPES: WasteType[] = [
  // Agricultural
  { type: "Crop Residue (Stubble/Straw)", category: "Agricultural", value: 8, carbon: 0.6 },
  { type: "Rice Husk & Bran", category: "Agricultural", value: 10, carbon: 0.7 },
  { type: "Wheat Bran", category: "Agricultural", value: 9, carbon: 0.65 },
  { type: "Sugarcane Bagasse", category: "Agricultural", value: 12, carbon: 0.8 },
  { type: "Pressmud", category: "Agricultural", value: 7, carbon: 0.5 },
  { type: "Cotton Stalks", category: "Agricultural", value: 6, carbon: 0.45 },
  { type: "Maize Cobs & Stalks", category: "Agricultural", value: 7, carbon: 0.55 },
  { type: "Coconut Shells & Coir", category: "Agricultural", value: 15, carbon: 1.0 },
  { type: "Groundnut Shells", category: "Agricultural", value: 11, carbon: 0.75 },
  { type: "Fruit & Vegetable Pomace", category: "Agricultural", value: 9, carbon: 0.6 },
  { type: "Spent Grain (Brewery)", category: "Agricultural", value: 12, carbon: 0.8 },
  { type: "Coffee Grounds/Husks", category: "Agricultural", value: 14, carbon: 0.9 },
  { type: "Tea Waste", category: "Agricultural", value: 10, carbon: 0.7 },
  
  // Municipal
  { type: "Municipal Organic Waste", category: "Municipal", value: 5, carbon: 0.4 },
  { type: "Food & Kitchen Waste", category: "Municipal", value: 6, carbon: 0.45 },
  { type: "Garden & Leaf Litter", category: "Municipal", value: 4, carbon: 0.35 },
  { type: "Paper & Cardboard Waste", category: "Municipal", value: 11, carbon: 0.7 },
  { type: "Used Cooking Oil", category: "Municipal", value: 25, carbon: 1.8 },
  { type: "Textile Waste (Natural)", category: "Municipal", value: 12, carbon: 0.85 },
  { type: "Glass Bottles & Jars", category: "Municipal", value: 15, carbon: 0.4 },
  
  // Industrial
  { type: "Industrial Sludge (Organic)", category: "Industrial", value: 8, carbon: 0.55 },
  { type: "Leather Scraps", category: "Industrial", value: 15, carbon: 1.1 },
  { type: "Rubber Waste", category: "Industrial", value: 18, carbon: 1.3 },
  { type: "Distillery Spent Wash", category: "Industrial", value: 13, carbon: 0.9 },
  { type: "Fly Ash", category: "Industrial", value: 5, carbon: 0.2 },
  { type: "Slag", category: "Industrial", value: 6, carbon: 0.25 },
  
  // Forestry
  { type: "Forestry Wood Chips", category: "Forestry", value: 14, carbon: 0.9 },
  { type: "Sawdust & Bark", category: "Forestry", value: 10, carbon: 0.7 },
  { type: "Bamboo Waste", category: "Forestry", value: 13, carbon: 0.85 },
  { type: "Pine Needles", category: "Forestry", value: 7, carbon: 0.5 },
  { type: "Invasive Species (Lantana)", category: "Forestry", value: 14, carbon: 0.95 },
  
  // Livestock
  { type: "Livestock Manure", category: "Livestock", value: 18, carbon: 1.2 },
  { type: "Poultry Litter", category: "Livestock", value: 20, carbon: 1.4 },
  { type: "Bone Meal", category: "Livestock", value: 22, carbon: 1.5 },
  { type: "Feather Waste", category: "Livestock", value: 16, carbon: 1.1 },
  
  // Aquatic
  { type: "Aquatic Algae/Seaweed", category: "Aquatic", value: 16, carbon: 1.1 },
  { type: "Invasive Species (Water Hyacinth)", category: "Aquatic", value: 14, carbon: 0.95 },
  { type: "Fish Processing Waste", category: "Aquatic", value: 19, carbon: 1.35 },
  
  // Construction
  { type: "Construction Wood Waste", category: "Construction", value: 10, carbon: 0.7 },
  { type: "Concrete Rubble (Recycled)", category: "Construction", value: 4, carbon: 0.15 },
  { type: "Brick & Tile Waste", category: "Construction", value: 3, carbon: 0.1 },
  { type: "Gypsum Board Scraps", category: "Construction", value: 8, carbon: 0.3 },

  // Plastics
  { type: "PET Bottles (Clear)", category: "Plastics", value: 35, carbon: 2.1 },
  { type: "HDPE Containers", category: "Plastics", value: 30, carbon: 1.9 },
  { type: "LDPE Film/Wrap", category: "Plastics", value: 25, carbon: 1.7 },
  { type: "PP Rigid Plastic", category: "Plastics", value: 28, carbon: 1.8 },
  { type: "PVC Scraps", category: "Plastics", value: 15, carbon: 1.2 },
  { type: "Multi-Layered Plastic (MLP)", category: "Plastics", value: 12, carbon: 0.9 },
  
  // Metals
  { type: "Aluminum Cans", category: "Metals", value: 110, carbon: 9.0 },
  { type: "Copper Wire Scraps", category: "Metals", value: 450, carbon: 12.0 },
  { type: "Steel/Iron Scrap", category: "Metals", value: 25, carbon: 1.5 },
  { type: "Brass/Bronze Fittings", category: "Metals", value: 320, carbon: 8.5 },
  
  // E-Waste
  { type: "Printed Circuit Boards (PCBs)", category: "E-Waste", value: 800, carbon: 25.0 },
  { type: "Computer/Laptop Scraps", category: "E-Waste", value: 150, carbon: 15.0 },
  { type: "Mobile Phone Waste", category: "E-Waste", value: 250, carbon: 18.0 },
  { type: "Lithium-Ion Batteries", category: "E-Waste", value: 400, carbon: 30.0 },
  { type: "Cables & Connectors", category: "E-Waste", value: 120, carbon: 5.0 },
  
  // Textiles
  { type: "Cotton Textile Scraps", category: "Textiles", value: 18, carbon: 1.2 },
  { type: "Polyester/Synthetic Fabric", category: "Textiles", value: 14, carbon: 2.5 },
  { type: "Wool Waste", category: "Textiles", value: 22, carbon: 0.8 },
  { type: "Used Footwear", category: "Textiles", value: 10, carbon: 1.5 },
  
  // Hazardous
  { type: "Lead-Acid Batteries", category: "Hazardous", value: 60, carbon: 4.0 },
  { type: "Used Engine Oil", category: "Hazardous", value: 40, carbon: 3.5 },
  { type: "Paint & Solvent Waste", category: "Hazardous", value: 20, carbon: 2.0 },
  { type: "E-Waste Batteries (Ni-Cd/Ni-MH)", category: "Hazardous", value: 35, carbon: 5.5 }
];
