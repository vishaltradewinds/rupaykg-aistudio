import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { translation: {
  "Dashboard": "Dashboard",
  "Upload Waste": "Upload Waste",
  "Task Board": "Task Board",
  "History": "History",
  "MRV Dashboard": "MRV Dashboard",
  "National KPI": "National KPI",
  "CCC Market": "CCC Market",
  "Genesis": "Genesis",
  "Settings": "Settings",
  "Logout": "Logout",
  "System Overview": "System Overview",
  "Welcome back": "Welcome back",
  "Language": "Language",
  "English": "English",
  "Hindi": "Hindi",
  "CCC Offset": "CCC Offset",
  "Total Earnings": "Total Earnings",
  "Community Rank": "Community Rank",
  "Total Collected": "Total Collected",
  "Farmers Registered": "Farmers Registered",
  "Logistics Margin": "Logistics Margin",
  "Fleet Efficiency": "Fleet Efficiency",
  "Total Processed": "Total Processed",
  "CCC Value": "CCC Value",
  "CCC issuance authority remains regulator-controlled. RupayKg does not independently mint CCCs. All CCCs must be event-traceable, registry-compatible, and align with national CCC governance frameworks.": "CCC issuance authority remains regulator-controlled. RupayKg does not independently mint CCCs. All CCCs must be event-traceable, registry-compatible, and align with national CCC governance frameworks.",
  "Generate CCCs": "Generate CCCs",
  "Verify processed waste records to issue CCCs.": "Verify processed waste records to issue CCCs.",
  "Verified CCCs and processed materials pushed to the Open Network for Digital Commerce (ONDC).": "Verified CCCs and processed materials pushed to the Open Network for Digital Commerce (ONDC).",
  "CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs.": "CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs.",
  "No CCCs available": "No CCCs available",
  "Check back later for newly verified CCC Certificates.": "Check back later for newly verified CCC Certificates.",
  "CCCs": "CCCs",
  "CCC Value (Offset Market)": "CCC Value (Offset Market)",
  "CCC Offset Market": "CCC Offset Market",
  "Purchase CCC": "Purchase CCC",
  "GRID-INDIA CCC Ledger": "GRID-INDIA CCC Ledger",
  "Value Generated": "Value Generated",
  "Processing Yield": "Processing Yield",
  "Total Investment": "Total Investment",
  "ESG Score": "ESG Score",
  "Platform Statistics": "Platform Statistics",
  "Seed Demo Data": "Seed Demo Data",
  "Reset Demo Data": "Reset Demo Data",
  "Total Users": "Total Users",
  "Total Weight": "Total Weight",
  "CCCs Generated": "CCCs Generated",
  "Total Value": "Total Value",
  "Waste Distribution": "Waste Distribution",
  "Recent Activity": "Recent Activity",
  "Performance Analytics": "Performance Analytics",
  "Register New Farmer": "Register New Farmer",
  "New Collection Record": "New Collection Record",
  "New Processing Record": "New Processing Record",
  "New Intake Record": "New Intake Record",
  "Full Name": "Full Name",
  "Mobile Number": "Mobile Number",
  "Land Area (Acres)": "Land Area (Acres)",
  "Crop Type": "Crop Type",
  "Farm Location": "Farm Location",
  "Latitude": "Latitude",
  "Longitude": "Longitude",
  "Get Current Location": "Get Current Location",
  "Registering...": "Registering...",
  "Register Farmer": "Register Farmer",
  "Transaction Ledger": "Transaction Ledger",
  "All": "All",
  "Pending Pickup": "Pending Pickup",
  "In Transit": "In Transit",
  "Processed": "Processed",
  "Operations Management": "Operations Management",
  "Foundational Doctrine": "Foundational Doctrine",
  "Account Settings": "Account Settings",
  "Weight (kg)": "Weight (kg)",
  "Waste Type": "Waste Type",
  "Location Confirmation (Google Maps)": "Location Confirmation (Google Maps)",
  "Estimated Value Breakdown": "Estimated Value Breakdown",
  "Base Value (Recycler)": "Base Value (Recycler)",
  "Total Sovereign Value": "Total Sovereign Value",
  "Verification Image": "Verification Image",
  "Processing...": "Processing...",
  "Confirm Intake & Mint Value": "Confirm Intake & Mint Value",
  "Intake": "Intake",
  "Features": "Features",
  "How it Works": "How it Works",
  "Ecosystem Roles": "Ecosystem Roles",
  "Launch OS": "Launch OS",
  "Sovereign-Grade Circular Economy Engine": "Sovereign-Grade Circular Economy Engine",
  "Convert Every Kilogram of Waste into": "Convert Every Kilogram of Waste into",
  "Global Circular Value": "Global Circular Value",
  "RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.": "RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.",
  "Access the OS": "Access the OS",
  "Read Whitepaper": "Read Whitepaper",
  "Multi-Rail Value Engine": "Multi-Rail Value Engine",
  "Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.": "Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.",
  "AI-Verified Intake": "AI-Verified Intake",
  "Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.": "Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.",
  "Rural Wealth Creation": "Rural Wealth Creation",
  "Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.": "Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.",
  "Live Network Impact": "Live Network Impact",
  "Real-time waste throughput across the RupayKg OS": "Real-time waste throughput across the RupayKg OS",
  "Live Stream": "Live Stream",
  "Active Nodes": "Active Nodes",
  "Value Minted": "Value Minted",
  "Network Topology": "Network Topology",
  "Distributed biomass collection nodes": "Distributed biomass collection nodes",
  "nodes": "nodes",
  "A seamless pipeline from waste generation to value realization.": "A seamless pipeline from waste generation to value realization.",
  "Generate": "Generate",
  "Citizens collect agricultural, municipal, or industrial waste.": "Citizens collect agricultural, municipal, or industrial waste.",
  "Aggregate": "Aggregate",
  "Aggregators verify, weigh, and transport waste to facilities.": "Aggregators verify, weigh, and transport waste to facilities.",
  "Process": "Process",
  "Recyclers convert waste into usable materials or energy.": "Recyclers convert waste into usable materials or energy.",
  "Mint Value": "Mint Value",
  "Smart contracts distribute funds across all 5 value rails.": "Smart contracts distribute funds across all 5 value rails.",
  "Choose your part in the circular economy.": "Choose your part in the circular economy.",
  "Citizen": "Citizen",
  "Waste Generator": "Waste Generator",
  "Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.": "Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.",
  "Upload waste records": "Upload waste records",
  "Instant wallet funding": "Instant wallet funding",
  "Track environmental impact": "Track environmental impact",
  "Aggregator": "Aggregator",
  "Collection & Transport": "Collection & Transport",
  "Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.": "Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.",
  "Log collection batches": "Log collection batches",
  "Earn logistics margins": "Earn logistics margins",
  "Route optimization data": "Route optimization data",
  "Recycler": "Recycler",
  "Processor": "Processor",
  "Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.": "Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.",
  "Log processing yields": "Log processing yields",
  "Access CSR/EPR funds": "Access CSR/EPR funds",
  "Circular Economy Operating System": "Circular Economy Operating System",
  "Context:": "Context:",
  "Login": "Login",
  "Register": "Register",
  "Account Type": "Account Type",
  "Organization Name": "Organization Name",
  "District": "District",
  "State": "State",
  "Phone Number": "Phone Number",
  "Password": "Password",
  "Access OS": "Access OS",
  "Create Account": "Create Account",
  "Quick Demo Access": "Quick Demo Access",
  "Back to Home": "Back to Home",
  "System Audit Logs": "System Audit Logs",
  "Global Impact Map": "Global Impact Map",
  "Submission Heatmap": "Submission Heatmap",
  "Total Offset": "Total Offset",
  "Farmers Supported": "Farmers Supported",
  "Waste Diverted": "Waste Diverted",
  "Portfolio Composition": "Portfolio Composition",
  "Impact Distribution": "Impact Distribution",
  "MRV Verification Dashboard": "MRV Verification Dashboard",
  "Pending": "Pending",
  "No pending MRV records": "No pending MRV records",
  "All processed waste has been verified.": "All processed waste has been verified.",
  "CCC Reduction": "CCC Reduction",
  "Credit Value": "Credit Value",
  "Acreage": "Acreage",
  "AI Risk Score": "AI Risk Score",
  "Location Verification": "Location Verification",
  "Verify & Issue CCCs": "Verify & Issue Credits",
  "Reject": "Reject",
  "Purchase verified CCCs to offset your footprint.": "Purchase verified CCCs to offset your footprint.",
  "Available CCCs": "Available Credits",
  "Price per Tonne": "Price per Tonne",
  "Your Offset Balance": "Your Offset Balance",
  "Purchase CCCs": "Purchase CCCs",
  "Amount to Purchase (Tonnes)": "Amount to Purchase (Tonnes)",
  "Total Cost": "Total Cost",
  "Confirm Purchase": "Confirm Purchase",
  "Cancel": "Cancel",
  "Recent Transactions": "Recent Transactions",
  "Project": "Project",
  "Amount": "Amount",
  "Price": "Price",
  "Date": "Date",
  "Status": "Status",
  "Network Active": "Network Active",
  "National Dashboard": "National Dashboard",
  "Municipal Corporation": "Municipal Corporation",
  "Ward": "Ward",
  "MSW": "MSW",
  "Ward Analytics": "Ward Analytics",
  "Ward-Level Analytics": "Ward-Level Analytics",
  "Citizen (MSW Generator)": "Citizen (MSW Generator)",
  "Gram Panchayat": "Gram Panchayat",
  "Village": "Village",
  "Biomass": "Biomass",
  "Village Analytics": "Village Analytics",
  "Village-Level Analytics": "Village-Level Analytics",
  "Farmer / FPO (Biomass Generator)": "Farmer / FPO (Biomass Generator)",
  "All Roles": "All Roles",
  "Citizens": "Citizens",
  "Farmers / FPOs": "Farmers / FPOs",
  "Aggregators": "Aggregators",
  "Processors": "Processors",
  "CSR Partners": "CSR Partners",
  "EPR Partners": "EPR Partners",
  "CCC Buyers": "CCC Buyers",
  "Diverted": "Diverted",
  "Fraud Alerts & Flagged Events": "Fraud Alerts & Flagged Events",
  "CCC Pool Status": "CCC Pool Status",
  "User Management": "User Management",
  "Audit Logs": "Audit Logs",
  "Total Waste Events": "Total Waste Events",
  "Processed Events": "Processed Events",
  "Wallet Disbursed": "Wallet Disbursed",
  "Growth & Impact Trends": "Growth & Impact Trends",
  "Environmental Impact": "Environmental Impact",
  "Methane Avoided": "Methane Avoided",
  "Water Saved": "Water Saved",
  "Trees Equivalent": "Trees Equivalent",
  "Trees": "Trees",
  "Economic Efficiency": "Economic Efficiency",
  "Avg Price / kg": "Avg Price / kg",
  "Govt Cost Savings": "Govt Cost Savings",
  "* Government savings calculated based on avoided landfill management and environmental remediation costs.": "* Government savings calculated based on avoided landfill management and environmental remediation costs.",
  "Operational Health": "Operational Health",
  "Processing Efficiency": "Processing Efficiency",
  "MRV Rejection Rate": "MRV Rejection Rate",
  "Waste Composition": "Waste Composition",
  "No flagged events detected.": "No flagged events detected.",
  "Geospatial Fraud Distribution": "Geospatial Fraud Distribution",
  "Total Minted CCC Units": "Total Minted CCC Units",
  "User": "User",
  "Role": "Role",
  "Location": "Location",
  "Wallet": "Wallet",
  "Actions": "Actions",
  "Regulator": "Regulator",
  "Municipal Admin": "Municipal Admin",
  "State Admin": "State Admin",
  "Super Admin": "Super Admin",
  "CSR Partner": "CSR Partner",
  "EPR Partner": "EPR Partner",
  "CCC Buyer": "CCC Buyer",
  "Delete User": "Delete User",
  "No users found.": "No users found.",
  "Action": "Action",
  "User ID": "User ID",
  "No audit logs available.": "No audit logs available.",
  "Total Waste": "Total Waste",
  "Total Events": "Total Events",
  "No ward data available.": "No ward data available.",
  "Add ₹10,000": "Add ₹10,000",
  "Saving...": "Saving...",
  "Save Changes": "Save Changes",
  "Notification Preferences": "Notification Preferences",
  "Email Notifications": "Email Notifications",
  "Receive updates about your transactions via email.": "Receive updates about your transactions via email.",
  "SMS Alerts": "SMS Alerts",
  "Get instant SMS alerts for critical updates.": "Get instant SMS alerts for critical updates.",
  "Push Notifications": "Push Notifications",
  "Enable browser push notifications.": "Enable browser push notifications.",
  "Currently Active: ": "Currently Active: ",
  " Context (": " Context (",
  "GENESIS": "GENESIS",
  "Weight: ": "Weight: ",
  "Village: ": "Village: ",
  "Value: ": "Value: ",
  "FRAUD ALERT": "FRAUD ALERT",
  "Type: ": "Type: ",
  "How the Engine Works": "How the Engine Works",
  "© 2026 RupayKg Circular Economy OS. All rights reserved.": "© 2026 RupayKg Circular Economy OS. All rights reserved.",
  "Privacy": "Privacy",
  "Terms": "Terms",
  "RUPAYKG": "RUPAYKG",
  "urban": "urban",
  "rural": "rural",
  "Aggregator (Collection & Transport)": "Aggregator (Collection & Transport)",
  "Processor (Recycler)": "Processor (Recycler)",
  "Admin": "Admin",
  "National Regulator": "National Regulator",
  "Farmer": "Farmer",
  "Wallet Balance": "Wallet Balance",
  "Database Connection Failed": "Database Connection Failed",
  "No records found": "No records found",
  "No audit logs found": "No audit logs found",
  "Circular Economy Intake Form": "Circular Economy Intake Form",
  "Acreage (acres)": "Acreage (acres)",
  "Name": "Name",
  "GPS Captured: ": "GPS Captured: ",
  "Capturing GPS Coordinates...": "Capturing GPS Coordinates...",
  "GPS Capture Failed": "GPS Capture Failed",
  "GPS Required": "GPS Required",
  "Retry GPS": "Retry GPS",
  "Failed to register farmer": "Failed to register farmer",
  "Farmer registered successfully! ID: ": "Farmer registered successfully! ID: ",
  "e.g., Paddy, Wheat": "e.g., Paddy, Wheat",
  "Failed to get location. Please enter manually.": "Failed to get location. Please enter manually.",
  "Geolocation is not supported by this browser.": "Geolocation is not supported by this browser.",
  "Active Queue": "Active Queue",
  "Active Fleet": "Active Fleet",
  "Drivers Online": "Drivers Online",
  "Current Load": "Current Load",
  "Total Capacity": "Total Capacity",
  "Utilization": "Utilization",
  "Biomass in Stock": "Biomass in Stock",
  "Output Material": "Output Material",
  "Storage Utilization": "Storage Utilization",
  "Available for Pickup": "Available for Pickup",
  "Incoming for Processing": "Incoming for Processing",
  "No new tasks available.": "No new tasks available.",
  "Accept Pickup": "Accept Pickup",
  "Accept Receipt": "Accept Receipt",
  "Recently Processed": "Recently Processed",
  "No active tasks in your possession.": "No active tasks in your possession.",
  "Timestamp": "Timestamp",
  "Type": "Type",
  "Weight": "Weight",
  "Value": "Value",
  "MRV Status": "MRV Status",
  "No records found for the selected filter.": "No records found for the selected filter.",
  "Pending MRV": "Pending MRV",
  "Low": "Low",
  "Med": "Med",
  "High": "High",
  "Record ID": "Record ID",
  "Details": "Details",
  "AI Risk": "AI Risk",
  "Verified By": "Verified By",
  "No MRV history found": "No MRV history found",
  "Check back later for newly verified CCCs.": "Check back later for newly verified CCCs.",
  "Verified": "Verified",
  "Offset": "Offset",
  "Insufficient Funds": "Insufficient Funds",
  "Purchase Credit": "Purchase Credit",
  "Profile Settings": "Profile Settings",
  "Profile updated successfully": "Profile updated successfully",
  "Failed to update profile": "Failed to update profile",
  "An error occurred": "An error occurred",
  "The Foundational Structure and Operating Doctrine of RupayKg": "The Foundational Structure and Operating Doctrine of RupayKg",
  "RupayKg AI": "RupayKg AI",
  "Thinking...": "Thinking...",
  "Read Aloud": "Read Aloud",
  "Playing...": "Playing...",
  "Use Maps": "Use Maps",
  "Maps Grounding On": "Maps Grounding On",
  "Ask RupayKg AI...": "Ask RupayKg AI...",
  "Sources:": "Sources:",
  "Map Location": "Map Location",
  "Hello! I am RupayKg AI. How can I help you with waste management, CCCs, or finding nearby facilities?": "Hello! I am RupayKg AI. How can I help you with waste management, CCCs, or finding nearby facilities?",
  "Sorry, I encountered an error.": "Sorry, I encountered an error.",
  "Agricultural": "Agricultural",
  "Municipal": "Municipal",
  "Industrial": "Industrial",
  "Forestry": "Forestry",
  "Livestock": "Livestock",
  "Aquatic": "Aquatic",
  "Construction": "Construction",
  "Plastics": "Plastics",
  "Metals": "Metals",
  "E-Waste": "E-Waste",
  "Textiles": "Textiles",
  "Hazardous": "Hazardous",
  "Crop Residue (Stubble/Straw)": "Crop Residue (Stubble/Straw)",
  "Rice Husk & Bran": "Rice Husk & Bran",
  "Wheat Bran": "Wheat Bran",
  "Sugarcane Bagasse": "Sugarcane Bagasse",
  "Pressmud": "Pressmud",
  "Cotton Stalks": "Cotton Stalks",
  "Maize Cobs & Stalks": "Maize Cobs & Stalks",
  "Coconut Shells & Coir": "Coconut Shells & Coir",
  "Groundnut Shells": "Groundnut Shells",
  "Fruit & Vegetable Pomace": "Fruit & Vegetable Pomace",
  "Spent Grain (Brewery)": "Spent Grain (Brewery)",
  "Coffee Grounds/Husks": "Coffee Grounds/Husks",
  "Tea Waste": "Tea Waste",
  "Municipal Organic Waste": "Municipal Organic Waste",
  "Food & Kitchen Waste": "Food & Kitchen Waste",
  "Garden & Leaf Litter": "Garden & Leaf Litter",
  "Paper & Cardboard Waste": "Paper & Cardboard Waste",
  "Used Cooking Oil": "Used Cooking Oil",
  "Textile Waste (Natural)": "Textile Waste (Natural)",
  "Glass Bottles & Jars": "Glass Bottles & Jars",
  "Industrial Sludge (Organic)": "Industrial Sludge (Organic)",
  "Leather Scraps": "Leather Scraps",
  "Rubber Waste": "Rubber Waste",
  "Distillery Spent Wash": "Distillery Spent Wash",
  "Fly Ash": "Fly Ash",
  "Slag": "Slag",
  "Forestry Wood Chips": "Forestry Wood Chips",
  "Sawdust & Bark": "Sawdust & Bark",
  "Bamboo Waste": "Bamboo Waste",
  "Pine Needles": "Pine Needles",
  "Invasive Species (Lantana)": "Invasive Species (Lantana)",
  "Livestock Manure": "Livestock Manure",
  "Poultry Litter": "Poultry Litter",
  "Bone Meal": "Bone Meal",
  "Feather Waste": "Feather Waste",
  "Aquatic Algae/Seaweed": "Aquatic Algae/Seaweed",
  "Invasive Species (Water Hyacinth)": "Invasive Species (Water Hyacinth)",
  "Fish Processing Waste": "Fish Processing Waste",
  "Construction Wood Waste": "Construction Wood Waste",
  "Concrete Rubble (Recycled)": "Concrete Rubble (Recycled)",
  "Brick & Tile Waste": "Brick & Tile Waste",
  "Gypsum Board Scraps": "Gypsum Board Scraps",
  "PET Bottles (Clear)": "PET Bottles (Clear)",
  "HDPE Containers": "HDPE Containers",
  "LDPE Film/Wrap": "LDPE Film/Wrap",
  "PP Rigid Plastic": "PP Rigid Plastic",
  "PVC Scraps": "PVC Scraps",
  "Multi-Layered Plastic (MLP)": "Multi-Layered Plastic (MLP)",
  "Aluminum Cans": "Aluminum Cans",
  "Copper Wire Scraps": "Copper Wire Scraps",
  "Steel/Iron Scrap": "Steel/Iron Scrap",
  "Brass/Bronze Fittings": "Brass/Bronze Fittings",
  "Printed Circuit Boards (PCBs)": "Printed Circuit Boards (PCBs)",
  "Computer/Laptop Scraps": "Computer/Laptop Scraps",
  "Mobile Phone Waste": "Mobile Phone Waste",
  "Lithium-Ion Batteries": "Lithium-Ion Batteries",
  "Cables & Connectors": "Cables & Connectors",
  "Cotton Textile Scraps": "Cotton Textile Scraps",
  "Polyester/Synthetic Fabric": "Polyester/Synthetic Fabric",
  "Wool Waste": "Wool Waste",
  "Used Footwear": "Used Footwear",
  "Lead-Acid Batteries": "Lead-Acid Batteries",
  "Used Engine Oil": "Used Engine Oil",
  "Paint & Solvent Waste": "Paint & Solvent Waste",
  "E-Waste Batteries (Ni-Cd/Ni-MH)": "E-Waste Batteries (Ni-Cd/Ni-MH)",
  "Rice": "Rice",
  "Wheat": "Wheat",
  "Maize": "Maize",
  "I. Introduction": "I. Introduction",
  "RupayKg has been established as a Unified Waste-to-CCC Digital Operating System designed to support India’s transition toward a compliance-based CCC market.": "RupayKg has been established as a Unified Waste-to-CCC Digital Operating System designed to support India’s transition toward a compliance-based CCC market.",
  "The platform addresses a structural gap in India’s CCC ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade CCC supply.": "The platform addresses a structural gap in India’s CCC ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade CCC supply.",
  "RupayKg is not structured as a project developer, CCC trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.": "RupayKg is not structured as a project developer, CCC trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.",
  "II. Unified Operating System Model": "II. Unified Operating System Model",
  "Context": "Context",
  "Anchor": "Anchor",
  "Category": "Category",
  "Urban": "Urban",
  "Municipal Corp + Ward": "Municipal Corp + Ward",
  "Rural": "Rural",
  "Gram Panchayat + Village": "Gram Panchayat + Village",
  "* All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.": "* All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.",
  "III. Unified Stakeholder Architecture": "III. Unified Stakeholder Architecture",
  "Administrative Authority": "Administrative Authority",
  "Producers (EPR)": "Producers (EPR)",
  "CSR Contributors": "CSR Contributors",
  "The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.": "The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.",
  "IV. CCC Origination": "IV. CCC Origination",
  "Methane avoidance through diversion": "Methane avoidance through diversion",
  "Biomass-based fossil substitution": "Biomass-based fossil substitution",
  "Recycling substitution": "Recycling substitution",
  "V. Multi-Rail Architecture": "V. Multi-Rail Architecture",
  "Recycler Rail": "Recycler Rail",
  "CSR Rail": "CSR Rail",
  "EPR Rail": "EPR Rail",
  "Governance Layer": "Governance Layer",
  "CCC Rail": "CCC Rail",
  "VI. Regulator Sovereignty": "VI. Regulator Sovereignty",
  "VII. Strategic Position": "VII. Strategic Position",
  "When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated CCC value?": "When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated CCC value?",
  "India is entering a compliance CCC era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.": "India is entering a compliance CCC era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.",
  "RupayKg was built to unify them. Not as a CCC trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.": "RupayKg was built to unify them. Not as a CCC trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.",
  "Waste is no longer disposal. It is governance-linked climate infrastructure.": "Waste is no longer disposal. It is governance-linked climate infrastructure.",
  "— Founder, RupayKg": "— Founder, RupayKg",
  "Legally Styled": "Legally Styled",
  "DECLARATION OF FOUNDATIONAL STRUCTURE": "DECLARATION OF FOUNDATIONAL STRUCTURE",
  "Article I — Unified Operating System": "Article I — Unified Operating System",
  "RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.": "RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.",
  "Article II — Unified Stakeholder Doctrine": "Article II — Unified Stakeholder Doctrine",
  "The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, CCC Buyers, Regulator.": "The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, CCC Buyers, Regulator.",
  "Article III — Waste Classification": "Article III — Waste Classification",
  "Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.": "Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.",
  "Article IV — CCC Engine": "Article IV — CCC Engine",
  "All emission reductions shall be processed through a single CCC calculation engine with event-level MRV validation.": "All emission reductions shall be processed through a single CCC calculation engine with event-level MRV validation.",
  "Article V — Rail Separation": "Article V — Rail Separation",
  "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, CCC issuance. Double counting is prohibited.": "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, CCC issuance. Double counting is prohibited.",
  "Article VI — Regulator Sovereignty": "Article VI — Regulator Sovereignty",
  "Institutional Identity": "Institutional Identity",
  "RupayKg is hereby defined as: A Unified Waste-to-CCC Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability.": "RupayKg is hereby defined as: A Unified Waste-to-CCC Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability."
,
  "content-type": "content-type",
  "System Insight: Regional biomass output is projected to grow 5-10% next month. Local segregation efficiency remains high across districts.": "System Insight: Regional biomass output is projected to grow 5-10% next month. Local segregation efficiency remains high across districts.",
  "System Insight: Regional biomass output is projected to grow 5-10% next month as collection efficiency improves. We recommend prioritizing fuel allocation for high-yield zones to handle increasing volumes.": "System Insight: Regional biomass output is projected to grow 5-10% next month as collection efficiency improves. We recommend prioritizing fuel allocation for high-yield zones to handle increasing volumes.",
  ",": ",",
  ";base64,": ";base64,",
  ":": ":",
  "Waste Management • Resource Recovery • Digital MRV • ESG": "Waste Management • Resource Recovery • Digital MRV • ESG",
  "India's Circular Economy": "India's Circular Economy",
  "Operating System": "Operating System",
  "A unified digital platform for municipalities, industries, and rural ecosystems to manage resource flows. Integrating Waste Management, Digital MRV, Carbon Accounting, EPR Compliance, ESG Reporting, and AI-driven Operational Intelligence.": "A unified digital platform for municipalities, industries, and rural ecosystems to manage resource flows. Integrating Waste Management, Digital MRV, Carbon Accounting, EPR Compliance, ESG Reporting, and AI-driven Operational Intelligence.",
  "Waste & Resource Recovery": "Waste & Resource Recovery",
  "End-to-end traceability for municipal solid waste and agricultural biomass. Track collection, transport, and processing in real-time.": "End-to-end traceability for municipal solid waste and agricultural biomass. Track collection, transport, and processing in real-time.",
  "Sovereign Digital MRV": "Sovereign Digital MRV",
  "Automated measurement, reporting, and verification for carbon mitigation. Immutable audit trails with GPS, timestamp, and verifiable evidence.": "Automated measurement, reporting, and verification for carbon mitigation. Immutable audit trails with GPS, timestamp, and verifiable evidence.",
  "Carbon Accounting": "Carbon Accounting",
  "Generate compliant project design documents and calculate emission reductions using standard methodologies (CCTS / BEE).": "Generate compliant project design documents and calculate emission reductions using standard methodologies (CCTS / BEE).",
  "EPR Compliance": "EPR Compliance",
  "Streamlined Extended Producer Responsibility reporting. Connect producers with authorized recyclers to meet state and national mandates.": "Streamlined Extended Producer Responsibility reporting. Connect producers with authorized recyclers to meet state and national mandates.",
  "Enterprise ESG Reporting": "Enterprise ESG Reporting",
  "Generate comprehensive Scope 3 dashboards and sustainability impact reports for CSR contributors, boards, and regulatory bodies.": "Generate comprehensive Scope 3 dashboards and sustainability impact reports for CSR contributors, boards, and regulatory bodies.",
  "AI-Driven Intelligence": "AI-Driven Intelligence",
  "Machine learning for waste classification, anomaly detection in weighbridge data, and predictive carbon yield forecasting.": "Machine learning for waste classification, anomaly detection in weighbridge data, and predictive carbon yield forecasting.",
  "Generate Evidence": "Generate Evidence",
  "Choose your part in the Sovereign Environmental Trust Infrastructure.": "Choose your part in the Sovereign Environmental Trust Infrastructure.",
  "© 2026 RupayKg Digital Operating System. All rights reserved.": "© 2026 RupayKg Digital Operating System. All rights reserved.",
  "Select State": "Select State",
  "Select District": "Select District",
  "Sub-District": "Sub-District",
  "Select Sub-District": "Select Sub-District",
  "Local Body / Ward": "Local Body / Ward",
  "Select Local Body/Ward": "Select Local Body/Ward",
  "No PDD has been generated for this project yet. Click \"Generate PDD & Submit\" first.": "No PDD has been generated for this project yet. Click \"Generate PDD & Submit\" first.",
  "Failed to retrieve Project Design Document.": "Failed to retrieve Project Design Document.",
  "Offset Project Registered successfully under the ICM framework! You can now generate its AI-backed PDD.": "Offset Project Registered successfully under the ICM framework! You can now generate its AI-backed PDD.",
  "An error occurred during project registration.": "An error occurred during project registration.",
  "Project officially registered and validated under the national ICM CCTS registry!": "Project officially registered and validated under the national ICM CCTS registry!",
  "An error occurred during ACVA action submission.": "An error occurred during ACVA action submission.",
  "Performance-Linked Green Bond successfully issued! Linked to your offset project and deployed on-chain.": "Performance-Linked Green Bond successfully issued! Linked to your offset project and deployed on-chain.",
  "An error occurred during bond issuance.": "An error occurred during bond issuance.",
  "Enter investment amount (INR)": "Enter investment amount (INR)",
  "Investment successfully completed! Your funds are locked in the project escrow and registered on Hedera.": "Investment successfully completed! Your funds are locked in the project escrow and registered on Hedera.",
  "Indian Carbon Market (ICM) Compliance": "Indian Carbon Market (ICM) Compliance",
  "Offset Project Infrastructure": "Offset Project Infrastructure",
  "Register waste-to-carbon projects (Biomass, MSW, Biogas, Composting), generate AI-assisted Project Design Documents (PDDs), and connect to the national CCTS Offset Mechanism.": "Register waste-to-carbon projects (Biomass, MSW, Biogas, Composting), generate AI-assisted Project Design Documents (PDDs), and connect to the national CCTS Offset Mechanism.",
  "New Project": "New Project",
  "Registry Administration & Validation (ACVA)": "Registry Administration & Validation (ACVA)",
  "Review submitted Project Design Documents (PDDs) under CERC standards, perform compliance audits, approve project registrations, and prepare verified MRV records for CCTS issuance.": "Review submitted Project Design Documents (PDDs) under CERC standards, perform compliance audits, approve project registrations, and prepare verified MRV records for CCTS issuance.",
  "No active projects awaiting review or registered in registry.": "No active projects awaiting review or registered in registry.",
  "Registered": "Registered",
  "Under ACVA Review": "Under ACVA Review",
  "Revision Requested": "Revision Requested",
  "Rejected": "Rejected",
  "Review PDD": "Review PDD",
  "Validate & Approve": "Validate & Approve",
  "Compile MRV Data": "Compile MRV Data",
  "My Offset Projects": "My Offset Projects",
  "No offset projects registered.": "No offset projects registered.",
  "Draft PDD": "Draft PDD",
  "In Validation": "In Validation",
  "PDD Successfully Generated and Submitted for ACVA Validation!": "PDD Successfully Generated and Submitted for ACVA Validation!",
  "Re-Generate & Submit": "Re-Generate & Submit",
  "Generate AI PDD & Submit": "Generate AI PDD & Submit",
  "View Generated PDD": "View Generated PDD",
  "Approved BEE Methodologies": "Approved BEE Methodologies",
  "Import Policy": "Import Policy",
  "Loading methodologies...": "Loading methodologies...",
  "Issue Performance Bond": "Issue Performance Bond",
  "Register New ICM Offset Project": "Register New ICM Offset Project",
  "Project Title": "Project Title",
  "Description": "Description",
  "Project Type": "Project Type",
  "Location / District": "Location / District",
  "Linked BEE Methodology": "Linked BEE Methodology",
  "Register Project": "Register Project",
  "Project Design Document (PDD)": "Project Design Document (PDD)",
  "1. Executive Summary": "1. Executive Summary",
  "2. Baseline Scenario": "2. Baseline Scenario",
  "3. Additionality Analysis": "3. Additionality Analysis",
  "4. Monitoring & Verification Plan (MRV)": "4. Monitoring & Verification Plan (MRV)",
  "5. Estimated Emission Reductions": "5. Estimated Emission Reductions",
  "ACVA Auditor Comments": "ACVA Auditor Comments",
  "ACVA Verification Action Panel": "ACVA Verification Action Panel",
  "ACVA Auditor ID": "ACVA Auditor ID",
  "Decision Status": "Decision Status",
  "Currently pending ACVA transition": "Currently pending ACVA transition",
  "Auditor Evaluation Notes / Revision Demands": "Auditor Evaluation Notes / Revision Demands",
  "Detail any identified discrepancies, requested revisions to methodologies, or approval reasoning here...": "Detail any identified discrepancies, requested revisions to methodologies, or approval reasoning here...",
  "Approve & Register": "Approve & Register",
  "Request Revision": "Request Revision",
  "Close": "Close",
  "ACVA Project Audit & Verification": "ACVA Project Audit & Verification",
  "Pending ACVA validation": "Pending ACVA validation",
  "Review PDD, audit carbon offset claims, and issue compliance decisions.": "Review PDD, audit carbon offset claims, and issue compliance decisions.",
  "PDD document data not found or still loading.": "PDD document data not found or still loading.",
  "ACVA Auditor Decisions": "ACVA Auditor Decisions",
  "Provide your certified CERC registration/auditor credentials identifier.": "Provide your certified CERC registration/auditor credentials identifier.",
  "Evaluation Notes / Auditor Comments": "Evaluation Notes / Auditor Comments",
  "Enter verification findings, required methodology adjustments, additionality feedback, or reasoning for approval/rejection here...": "Enter verification findings, required methodology adjustments, additionality feedback, or reasoning for approval/rejection here...",
  "ACVA Governance Action Notice": "ACVA Governance Action Notice",
  "Approval will finalize the PDD state, registering the project in the Indian Carbon Market (ICM) registry and making it eligible for CCTS compliance issuance.": "Approval will finalize the PDD state, registering the project in the Indian Carbon Market (ICM) registry and making it eligible for CCTS compliance issuance.",
  "Approve & Register Project": "Approve & Register Project",
  "RUPAYKG ENTERPRISE CIRCULAR ECONOMY ENGINE": "RUPAYKG ENTERPRISE CIRCULAR ECONOMY ENGINE",
  "Import Methodology Policy": "Import Methodology Policy",
  "Methodology Name": "Methodology Name",
  "Sector": "Sector",
  "Standards Body": "Standards Body",
  "Methodology Policy Successfully Compiled to Registry Node!": "Methodology Policy Successfully Compiled to Registry Node!",
  "Failed to import policy.": "Failed to import policy.",
  "Compile & Import": "Compile & Import",
  "Compile MRV Audit Data": "Compile MRV Audit Data",
  "Generate high-quality, verifiable project data mapped to approved CCTS methodologies. This data payload can be submitted to National Registries by project developers or authorized auditors.": "Generate high-quality, verifiable project data mapped to approved CCTS methodologies. This data payload can be submitted to National Registries by project developers or authorized auditors.",
  "Total Volume Mitigated (kg CO₂e)": "Total Volume Mitigated (kg CO₂e)",
  "CCTS Sector": "CCTS Sector",
  "Compile MRV & Prepare for Registry": "Compile MRV & Prepare for Registry",
  "National Registry Interaction Hub": "National Registry Interaction Hub",
  "RupayKg does not issue carbon credits. We provide the foundational MRV data platform that allows you to submit high-quality, fully verifiable project data and baseline calculations to independent validators and national registries (CCTS / BEE) for offset issuance.": "RupayKg does not issue carbon credits. We provide the foundational MRV data platform that allows you to submit high-quality, fully verifiable project data and baseline calculations to independent validators and national registries (CCTS / BEE) for offset issuance.",
  "Verified Data Payloads": "Verified Data Payloads",
  "Validation Requests": "Validation Requests",
  "Verified MRV Payload Vault": "Verified MRV Payload Vault",
  "Your registry vault is currently empty.": "Your registry vault is currently empty.",
  "Compile MRV data from your verified projects to populate your vault.": "Compile MRV data from your verified projects to populate your vault.",
  "Verified & Registered": "Verified & Registered",
  "Validation Request Submitted!": "Validation Request Submitted!",
  "Request Validation": "Request Validation",
  "Auditor / Validator Dashboard": "Auditor / Validator Dashboard",
  "The exchange is currently quiet.": "The exchange is currently quiet.",
  "No active sell orders are listed on the open market.": "No active sell orders are listed on the open market.",
  "Awaiting Verification": "Awaiting Verification",
  "Verified and Forwarded to CCTS Registry!": "Verified and Forwarded to CCTS Registry!",
  "Action failed.": "Action failed.",
  "Audit & Verify": "Audit & Verify",
  "Your Request": "Your Request",
  "Log Waste": "Log Waste",
  "Onboard": "Onboard",
  "WhatsApp Bot": "WhatsApp Bot",
  "Playbook": "Playbook",
  "Reports": "Reports",
  "LGD Registry": "LGD Registry",
  "Onboarded Users": "Onboarded Users",
  "Verified Records": "Verified Records",
  "Collection Trends": "Collection Trends",
  "Recent MRV Logs": "Recent MRV Logs",
  "No logs recorded yet": "No logs recorded yet",
  "Log Waste Collection": "Log Waste Collection",
  "Capture real-time field data for MRV verification.": "Capture real-time field data for MRV verification.",
  "Waste logged successfully! AI validation in progress.": "Waste logged successfully! AI validation in progress.",
  "Failed to log waste.": "Failed to log waste.",
  "Error connecting to server.": "Error connecting to server.",
  "Manual Entry": "Manual Entry",
  "App-based Logging": "App-based Logging",
  "Recording from physical ledger": "Recording from physical ledger",
  "Real-time field capture": "Real-time field capture",
  "Switch to App": "Switch to App",
  "Switch to Manual": "Switch to Manual",
  "Location / Ward": "Location / Ward",
  "Manual Entry Notes": "Manual Entry Notes",
  "Enter details from physical ledger, e.g. Receipt #1234, Collector: Ramesh": "Enter details from physical ledger, e.g. Receipt #1234, Collector: Ramesh",
  "Photo Proof URL": "Photo Proof URL",
  "Collector ID": "Collector ID",
  "Estimated CCC Impact": "Estimated CCC Impact",
  "*Based on IPCC default factors for pilot region.": "*Based on IPCC default factors for pilot region.",
  "Submit Log": "Submit Log",
  "Onboard Field Partner": "Onboard Field Partner",
  "Register waste collectors and aggregators for the pilot OS.": "Register waste collectors and aggregators for the pilot OS.",
  "Partner onboarded successfully!": "Partner onboarded successfully!",
  "Failed to onboard partner.": "Failed to onboard partner.",
  "Operating Area": "Operating Area",
  "Onboard Partner": "Onboard Partner",
  "WhatsApp Fallback Bot": "WhatsApp Fallback Bot",
  "Low-connectivity workflow for field staff.": "Low-connectivity workflow for field staff.",
  "How it works": "How it works",
  "Collector sends \"LOG\" to the official WhatsApp number.": "Collector sends \"LOG\" to the official WhatsApp number.",
  "Bot asks for weight, type, and a photo of the receipt.": "Bot asks for weight, type, and a photo of the receipt.",
  "Data is automatically ingested into CCC OS MRV.": "Data is automatically ingested into CCC OS MRV.",
  "Official Bot Number": "Official Bot Number",
  "Download QR Code for Field": "Download QR Code for Field",
  "Simulated Chat": "Simulated Chat",
  "Great! Please send a photo of the waste on the scale.": "Great! Please send a photo of the waste on the scale.",
  "Verified! 45kg Organic logged at Area Hub. CCC Impact: +0.022 tCO2e.": "Verified! 45kg Organic logged at Area Hub. CCC Impact: +0.022 tCO2e.",
  "Type a message...": "Type a message...",
  "Operations Playbook": "Operations Playbook",
  "Standard Operating Procedures for National Deployment.": "Standard Operating Procedures for National Deployment.",
  "Download PDF": "Download PDF",
  "Active SOP: Ground Collection": "Active SOP: Ground Collection",
  "Version 1.2 • Updated 2 days ago": "Version 1.2 • Updated 2 days ago",
  "Field Script (Hindi)": "Field Script (Hindi)",
  "Quick Resources": "Quick Resources",
  "WhatsApp Bot Guide": "WhatsApp Bot Guide",
  "Waste Grading Chart": "Waste Grading Chart",
  "Payment Schedule": "Payment Schedule",
  "Field Support": "Field Support",
  "Need help with ground operations? Contact the pilot supervisor.": "Need help with ground operations? Contact the pilot supervisor.",
  "Call Supervisor": "Call Supervisor",
  "Pilot Impact Reports": "Pilot Impact Reports",
  "AI-generated executive summaries and data exports.": "AI-generated executive summaries and data exports.",
  "Generate New Report": "Generate New Report",
  "No Report Generated": "No Report Generated",
  "Click the button above to generate an AI-powered executive summary of your pilot data.": "Click the button above to generate an AI-powered executive summary of your pilot data.",
  "Data Exports": "Data Exports",
  "Raw MRV Data": "Raw MRV Data",
  "Verification Logs": "Verification Logs",
  "LGD Database Directory & National Gateway Sync": "LGD Database Directory & National Gateway Sync",
  "Sovereign-grade directory of India\'s local governments. Keep local bodies, blocks, and district registries up-to-date.": "Sovereign-grade directory of India\'s local governments. Keep local bodies, blocks, and district registries up-to-date.",
  "Synchronizing Datasets...": "Synchronizing Datasets...",
  "Trigger LGD Sync": "Trigger LGD Sync",
  "Sync Status": "Sync Status",
  "States Indexed": "States Indexed",
  "Districts Populated": "Districts Populated",
  "Last Synchronized": "Last Synchronized",
  "Registry Explorer": "Registry Explorer",
  "LGD Code": "LGD Code",
  "Select Sub-District / Block": "Select Sub-District / Block",
  "Sovereign Trust Rail info": "Sovereign Trust Rail info",
  "LGD profiles are stored securely in local state memory. Any changes to local administrative boundaries automatically broadcast telemetry hashes to Hedera Consensus Service.": "LGD profiles are stored securely in local state memory. Any changes to local administrative boundaries automatically broadcast telemetry hashes to Hedera Consensus Service.",
  "Sovereign Local Bodies List": "Sovereign Local Bodies List",
  "Items": "Items",
  "Local Body Name": "Local Body Name",
  "No Local Bodies Selected": "No Local Bodies Selected",
  "Select a State, District, and Sub-district on the left sidebar to explore the fully synchronized administrative local bodies.": "Select a State, District, and Sub-district on the left sidebar to explore the fully synchronized administrative local bodies.",
  "Go to Dashboard": "Go to Dashboard",
  "Upload Waste Data": "Upload Waste Data",
  "View Task Board": "View Task Board",
  "View History": "View History",
  "Admin Controls": "Admin Controls",
  "CCTS Market": "CCTS Market",
  "Offset Projects": "Offset Projects",
  "Operations Hub": "Operations Hub",
  "Enterprise OS & CPCB Hub": "Enterprise OS & CPCB Hub",
  "Operations Control Center": "Operations Control Center",
  "CCTS Carbon Market": "CCTS Carbon Market",
  "Hedera HCS Open Source Ledger": "Hedera HCS Open Source Ledger",
  "Enterprise MRV Suite 3.0": "Enterprise MRV Suite 3.0",
  "Database connection is not configured. System is running in local mode.": "Database connection is not configured. System is running in local mode.",
  "Total Waste Diverted": "Total Waste Diverted",
  "CO₂e Avoided": "CO₂e Avoided",
  "EPR Compliance Rate": "EPR Compliance Rate",
  "Active Recycling SLAs": "Active Recycling SLAs",
  "Active Recycling Partner Contracts": "Active Recycling Partner Contracts",
  "EPR Compliant": "EPR Compliant",
  "No contracts registered today": "No contracts registered today",
  "Contract ID": "Contract ID",
  "Waste Categories": "Waste Categories",
  "Min SLA Volume": "Min SLA Volume",
  "Pricing Agreement": "Pricing Agreement",
  "Duration / Ends": "Duration / Ends",
  "Blockchain Hash": "Blockchain Hash",
  "Verified Proof Available": "Verified Proof Available",
  "Recurring Pickup Planner": "Recurring Pickup Planner",
  "Waste Category": "Waste Category",
  "Organic / Wet Waste": "Organic / Wet Waste",
  "Plastics & Polymers": "Plastics & Polymers",
  "Paper, Cardboard & Dry": "Paper, Cardboard & Dry",
  "Industrial Hazardous": "Industrial Hazardous",
  "Crop Biomass": "Crop Biomass",
  "Est. Weight (kg)": "Est. Weight (kg)",
  "Frequency": "Frequency",
  "Daily": "Daily",
  "Weekly": "Weekly",
  "Fortnightly": "Fortnightly",
  "Monthly": "Monthly",
  "Target Day": "Target Day",
  "Contact Person": "Contact Person",
  "Scheduling...": "Scheduling...",
  "Register Pickup Routine": "Register Pickup Routine",
  "Recurring Logistics & Upcoming Pickups": "Recurring Logistics & Upcoming Pickups",
  "Day": "Day",
  "Assigned Vehicle": "Assigned Vehicle",
  "Volume": "Volume",
  "No repetitive routines configured yet.": "No repetitive routines configured yet.",
  "Auto Routing": "Auto Routing",
  "EPR Tracking & Compliance Vault": "EPR Tracking & Compliance Vault",
  "Audit Trail": "Audit Trail",
  "Clear compliance records. Audit passed.": "Clear compliance records. Audit passed.",
  "Verified on": "Verified on",
  "by": "by",
  "ESG Climate & Carbon Reporting Tool": "ESG Climate & Carbon Reporting Tool",
  "Download Audited Corporate Circular Net Report": "Download Audited Corporate Circular Net Report",
  "Generate and download an officially certified corporate ESG PDF statement containing real time blockchain reference timestamps for Scope 3 emissions deduction.": "Generate and download an officially certified corporate ESG PDF statement containing real time blockchain reference timestamps for Scope 3 emissions deduction.",
  "a": "a",
  "Export Standard ESG Report": "Export Standard ESG Report",
  "Live Database Connected": "Live Database Connected",
  "In-Memory Mode": "In-Memory Mode",
  "Citizens / Domestic": "Citizens / Domestic",
  "MRV Verified CO₂e Avoided": "MRV Verified CO₂e Avoided",
  "Methane Emission Prevention": "Methane Emission Prevention",
  "Verified Landfill Diversion": "Verified Landfill Diversion",
  "Immutable Registry Anchors": "Immutable Registry Anchors",
  "MRV Confidence & Trust": "MRV Confidence & Trust",
  "Verification Score": "Verification Score",
  "No waste data available yet.": "No waste data available yet.",
  "No portfolio data available yet.": "No portfolio data available yet.",
  "Fast AI Auto-fill": "Fast AI Auto-fill",
  "Auto-fill": "Auto-fill",
  "Crop Type (For Biomass)": "Crop Type (For Biomass)",
  "Estimate Biomass": "Estimate Biomass",
  "Tap to Capture Image": "Tap to Capture Image",
  "Uses mobile camera if available": "Uses mobile camera if available",
  "Retake Photo": "Retake Photo",
  "AI Biomass Verification Playground": "AI Biomass Verification Playground",
  "Interactive Engine": "Interactive Engine",
  "Simulate how our decentralized Rupay AI verification engine evaluates your material stream parameters in real-time based on selected weight, category, and visual properties.": "Simulate how our decentralized Rupay AI verification engine evaluates your material stream parameters in real-time based on selected weight, category, and visual properties.",
  "Please enter a valid weight in kg first.": "Please enter a valid weight in kg first.",
  "Run Live AI Verification Simulation": "Run Live AI Verification Simulation",
  "Confirm Intake & Generate Evidence": "Confirm Intake & Generate Evidence",
  "Satellite": "Satellite",
  "Unverified": "Unverified",
  "Anomaly": "Anomaly",
  "View W3C VC": "View W3C VC",
  "AI Verification Assessment": "AI Verification Assessment",
  "Satellite Verification": "Satellite Verification",
  "Land Cover": "Land Cover",
  "Confidence": "Confidence",
  "Anomalies detected in this area": "Anomalies detected in this area",
  "AI Risk Assessment": "AI Risk Assessment",
  "Waste & Payment Config": "Waste & Payment Config",
  "Fraud Alerts": "Fraud Alerts",
  "DPI Integrations": "DPI Integrations",
  "State Filter": "State Filter",
  "District Filter": "District Filter",
  "Sub-District Filter": "Sub-District Filter",
  "GP / Ward Filter": "GP / Ward Filter",
  "No trend data available yet.": "No trend data available yet.",
  "Verified MRV Volume": "Verified MRV Volume",
  "View Blockchain Proof": "View Blockchain Proof",
  "Waste & Payment Configuration": "Waste & Payment Configuration",
  "Save Configuration": "Save Configuration",
  "Global Payment Settings": "Global Payment Settings",
  "CCC Price (₹ per kg CO2)": "CCC Price (₹ per kg CO2)",
  "Global multiplier for CCC offset value.": "Global multiplier for CCC offset value.",
  "Logistics Margin (%)": "Logistics Margin (%)",
  "Percentage of total value allocated to aggregators.": "Percentage of total value allocated to aggregators.",
  "Base Value (₹/kg)": "Base Value (₹/kg)",
  "CCC Offset (kg CO2/kg)": "CCC Offset (kg CO2/kg)",
  "Fraud Detection Dashboard": "Fraud Detection Dashboard",
  "Total Flagged": "Total Flagged",
  "GPS Mismatches": "GPS Mismatches",
  "AI Rejected": "AI Rejected",
  "Reason": "Reason",
  "No fraud alerts detected.": "No fraud alerts detected.",
  "AgriStack Verifications": "AgriStack Verifications",
  "Live synchronization with the national AgriStack database for farmer identity and land parcel verification.": "Live synchronization with the national AgriStack database for farmer identity and land parcel verification.",
  "Verification ID": "Verification ID",
  "Farmer Name": "Farmer Name",
  "Land Parcel": "Land Parcel",
  "No AgriStack data available.": "No AgriStack data available.",
  "ONDC Marketplace Listings": "ONDC Marketplace Listings",
  "Listing ID": "Listing ID",
  "Material": "Material",
  "Quantity": "Quantity",
  "No ONDC listings available.": "No ONDC listings available.",
  "Enter your full name": "Enter your full name",
  "Enter organization name": "Enter organization name",
  "Enter district": "Enter district",
  "Enter state": "Enter state",
  "Issuance authority remains regulator-controlled. RupayKg generates registry-ready MRV data but does not independently issue CCCs. All CCCs must be event-traceable, registry-compatible, and align with national CCC governance frameworks.": "Issuance authority remains regulator-controlled. RupayKg generates registry-ready MRV data but does not independently issue CCCs. All CCCs must be event-traceable, registry-compatible, and align with national CCC governance frameworks.",
  "\"India’s Unified Waste-to-CCC Infrastructure Layer for the Compliance CCC Era.\"": "\"India’s Unified Waste-to-CCC Infrastructure Layer for the Compliance CCC Era.\"",
  "VIII. Digital Carbon MRV Doctrine": "VIII. Digital Carbon MRV Doctrine",
  "The platform operates a Digital MRV (Measurement, Reporting, and Verification) engine where every physical waste event automatically triggers a corresponding Carbon Lifecycle Event. Net emission reductions are calculated based on landfill methane avoidance, biomass substitution, and transport optimization, ensuring that every kilogram of waste and its climate value are immutably linked and audit-ready for national registries.": "The platform operates a Digital MRV (Measurement, Reporting, and Verification) engine where every physical waste event automatically triggers a corresponding Carbon Lifecycle Event. Net emission reductions are calculated based on landfill methane avoidance, biomass substitution, and transport optimization, ensuring that every kilogram of waste and its climate value are immutably linked and audit-ready for national registries.",
  "Founder's Note": "Founder's Note",
  "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, and Carbon Certificate (CCC) issuance. Double counting is explicitly prohibited through cryptographic Environmental Trust scores.": "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, and Carbon Certificate (CCC) issuance. Double counting is explicitly prohibited through cryptographic Environmental Trust scores.",
  "Issuance authority shall remain under regulator control. RupayKg serves as the digital evidence layer.": "Issuance authority shall remain under regulator control. RupayKg serves as the digital evidence layer.",
  "Article VII — Digital Carbon MRV": "Article VII — Digital Carbon MRV",
  "Every waste transaction must generate a carbon event ID with timestamp, stakeholder chain, and emission reduction estimate for sovereign auditability.": "Every waste transaction must generate a carbon event ID with timestamp, stakeholder chain, and emission reduction estimate for sovereign auditability.",
  "RupayKg is hereby defined as: India\'s Circular Economy Operating System, a unified digital platform integrating Waste Management, Digital MRV, and Carbon Accounting under a single national architecture.": "RupayKg is hereby defined as: India\'s Circular Economy Operating System, a unified digital platform integrating Waste Management, Digital MRV, and Carbon Accounting under a single national architecture.",
  "Verifiable Hedera Consensus Service (HCS) record of all MRV verification events": "Verifiable Hedera Consensus Service (HCS) record of all MRV verification events",
  "Chain Integrity Verified": "Chain Integrity Verified",
  "Chain Integrity Compromised": "Chain Integrity Compromised",
  "Public Ledger Explorer": "Public Ledger Explorer",
  "Hedera Guardian Policy Portal": "Hedera Guardian Policy Portal",
  "No blockchain records found.": "No blockchain records found.",
  "Block Hash": "Block Hash",
  "Previous Hash": "Previous Hash",
  "Transaction Data": "Transaction Data",
  "Protocol": "Protocol",
  "HCS Topic ID": "HCS Topic ID",
  "Type / Record": "Type / Record",
  "User / Generator": "User / Generator",
  "Waste / To": "Waste / To",
  "Amount / CCC": "Amount / CCC",
  "Registry ID": "Registry ID",
  "Guardian HCS Ledger AI Interface": "Guardian HCS Ledger AI Interface",
  "Query the Hedera Consensus Service topic the configured directly using natural language.": "Query the Hedera Consensus Service topic the configured directly using natural language.",
  "Example: How many carbon units are anchored in total?": "Example: How many carbon units are anchored in total?",
  "Query Ledger": "Query Ledger",
  "Guardian AI Response": "Guardian AI Response",
  "Not Initialized": "Not Initialized",
  "Compiled Policies": "Compiled Policies",
  "Secured Audits": "Secured Audits",
  "Hedera Guardian 4-Tier Node Architecture": "Hedera Guardian 4-Tier Node Architecture",
  "Decentralized digital MRV pipeline of India’s Circular Economy Operating System": "Decentralized digital MRV pipeline of India’s Circular Economy Operating System",
  "Phase 1: Setup Standard Registry (SR) Identity": "Phase 1: Setup Standard Registry (SR) Identity",
  "Generate Node DID & Auth Presentation": "Generate Node DID & Auth Presentation",
  "Phase 2: Import Sustainability Methodology Policies": "Phase 2: Import Sustainability Methodology Policies",
  "Upload & Validate Custom .Policy Schema": "Upload & Validate Custom .Policy Schema",
  "Phase 3: Automated dMRV Submission & Audit Trail": "Phase 3: Automated dMRV Submission & Audit Trail",
  "Validate dMRV & Register on HCS": "Validate dMRV & Register on HCS",
  "Verifiable Environment Credentials Audit Log": "Verifiable Environment Credentials Audit Log",
  "W3C Verifiable Credential 2.0": "W3C Verifiable Credential 2.0",
  "Interoperable Sovereign-Grade Compliance Object (JSON-LD)": "Interoperable Sovereign-Grade Compliance Object (JSON-LD)",
  "Guardian AI Analysis": "Guardian AI Analysis",
  "Run ESG Methodology Alignment Check": "Run ESG Methodology Alignment Check",
  "Raw VC JSON-LD Content": "Raw VC JSON-LD Content",
  "ISO 14064-3 Verifiable": "ISO 14064-3 Verifiable",
  "Download JSON-LD": "Download JSON-LD",
  "Sorry, I could not generate a response.": "Sorry, I could not generate a response.",
  "Genesis Whitepaper": "Genesis Whitepaper",
  "Foundational Structure & Operating Doctrine": "Foundational Structure & Operating Doctrine",
  "Introduction": "Introduction",
  "Unified Operating System Model": "Unified Operating System Model",
  "All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.": "All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.",
  "Unified Stakeholder Architecture": "Unified Stakeholder Architecture",
  "CCC Origination": "CCC Origination",
  "Multi-Rail Architecture": "Multi-Rail Architecture",
  "Regulator Sovereignty": "Regulator Sovereignty",
  "Strategic Position": "Strategic Position",
  "India’s Unified Waste-to-CCC Infrastructure Layer for the Compliance CCC Era.": "India’s Unified Waste-to-CCC Infrastructure Layer for the Compliance CCC Era.",
  "Founder, RupayKg": "Founder, RupayKg",
  "T": "T",
  "Failed to digitize": "Failed to digitize",
  "ENG_001', 'Dr. Suresh R. Mehta', 'ACM0022 Composting metrics strictly conform with CCTS registry standards.": "ENG_001', 'Dr. Suresh R. Mehta', 'ACM0022 Composting metrics strictly conform with CCTS registry standards."} },
  hi: { translation: {
  "Dashboard": "डैशबोर्ड",
  "Upload Waste": "कचरा अपलोड करें",
  "Task Board": "कार्य बोर्ड",
  "History": "इतिहास",
  "MRV Dashboard": "MRV डैशबोर्ड",
  "National KPI": "राष्ट्रीय KPI",
  "CCC Market": "CCC बाजार",
  "Genesis": "उत्पत्ति",
  "Settings": "सेटिंग्स",
  "Logout": "लॉग आउट",
  "System Overview": "सिस्टम अवलोकन",
  "Welcome back": "वापसी पर स्वागत है",
  "Language": "भाषा",
  "English": "अंग्रेज़ी",
  "Hindi": "हिंदी",
  "CCC Offset": "कार्बन ऑफसेट",
  "Total Earnings": "कुल कमाई",
  "Community Rank": "सामुदायिक रैंक",
  "Total Collected": "कुल एकत्रित",
  "Farmers Registered": "पंजीकृत किसान",
  "Logistics Margin": "लॉजिस्टिक्स मार्जिन",
  "Fleet Efficiency": "बेड़े की दक्षता",
  "Total Processed": "कुल प्रसंस्कृत",
  "CCCs": "CCCs",
  "Value Generated": "उत्पन्न मूल्य",
  "Processing Yield": "प्रसंस्करण उपज",
  "Total Investment": "कुल निवेश",
  "ESG Score": "ईएसजी स्कोर",
  "Platform Statistics": "मंच के आंकड़े",
  "Seed Demo Data": "डेमो डेटा डालें",
  "Reset Demo Data": "डेमो डेटा रीसेट करें",
  "Total Users": "कुल उपयोगकर्ता",
  "Total Weight": "कुल वजन",
  "CCCs Generated": "कार्बन कम हुआ",
  "Total Value": "कुल मूल्य",
  "Waste Distribution": "कचरा वितरण",
  "Recent Activity": "हाल की गतिविधि",
  "Performance Analytics": "प्रदर्शन विश्लेषण",
  "Register New Farmer": "नया किसान पंजीकृत करें",
  "New Collection Record": "नया संग्रह रिकॉर्ड",
  "New Processing Record": "नया प्रसंस्करण रिकॉर्ड",
  "New Intake Record": "नया इनटेक रिकॉर्ड",
  "Full Name": "पूरा नाम",
  "Mobile Number": "मोबाइल नंबर",
  "Land Area (Acres)": "भूमि क्षेत्र (एकड़)",
  "Crop Type": "फसल का प्रकार",
  "Farm Location": "खेत का स्थान",
  "Latitude": "अक्षांश",
  "Longitude": "देशांतर",
  "Get Current Location": "वर्तमान स्थान प्राप्त करें",
  "Registering...": "पंजीकरण हो रहा है...",
  "Register Farmer": "किसान पंजीकृत करें",
  "Transaction Ledger": "लेनदेन खाता",
  "All": "सभी",
  "Pending Pickup": "पिकअप लंबित",
  "In Transit": "रास्ते में",
  "Processed": "प्रसंस्कृत",
  "Operations Management": "संचालन प्रबंधन",
  "Foundational Doctrine": "मूलभूत सिद्धांत",
  "Account Settings": "खाता सेटिंग्स",
  "Weight (kg)": "वजन (किलो)",
  "Waste Type": "कचरे का प्रकार",
  "Location Confirmation (Google Maps)": "स्थान की पुष्टि (Google Maps)",
  "Estimated Value Breakdown": "अनुमानित मूल्य विवरण",
  "Base Value (Recycler)": "मूल मूल्य (रीसाइक्लर)",
  "CCC Value": "CCC मूल्य",
  "Total Sovereign Value": "कुल संप्रभु मूल्य",
  "Verification Image": "सत्यापन छवि",
  "Processing...": "प्रसंस्करण...",
  "Confirm Intake & Mint Value": "इनटेक की पुष्टि करें और मूल्य बनाएं",
  "Intake": "इनटेक",
  "Features": "विशेषताएं",
  "How it Works": "यह कैसे काम करता है",
  "Ecosystem Roles": "पारिस्थितिकी तंत्र की भूमिकाएं",
  "Launch OS": "OS लॉन्च करें",
  "Sovereign-Grade Circular Economy Engine": "संप्रभु-ग्रेड परिपत्र अर्थव्यवस्था इंजन",
  "Convert Every Kilogram of Waste into": "कचरे के हर किलोग्राम को बदलें",
  "Global Circular Value": "वैश्विक परिपत्र मूल्य",
  "RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.": "RupayKg एक परिपत्र अर्थव्यवस्था ऑपरेटिंग सिस्टम है जो समुदायों को कृषि, नगरपालिका और औद्योगिक कचरे से कमाई करने के लिए सशक्त बनाता है।",
  "Access the OS": "OS तक पहुंचें",
  "Read Whitepaper": "श्वेतपत्र पढ़ें",
  "Multi-Rail Value Engine": "मल्टी-रेल वैल्यू इंजन",
  "Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.": "प्रसंस्कृत बायोमाas के प्रत्येक किलोग्राम के लिए रीसाइक्लर, सीएसआर, नगर पालिका, CCC और ईपीआर रेल से एक साथ मूल्य निकालें।",
  "AI-Verified Intake": "AI-सत्यापित इनटेक",
  "Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.": "कचरे के प्रकार, वजन और भौगोलिक स्थान का स्वचालित सत्यापन अपरिवर्तनीय, संप्रभु-ग्रेड डेटा अखंडता सुनिश्चित करता है।",
  "Rural Wealth Creation": "ग्रामीण धन सृजन",
  "Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.": "नागरिकों के वॉलेट में सीधे धन वितरित करें, पर्यावरणीय देनदारियों को स्थानीय आर्थिक विकास में बदलें।",
  "Live Network Impact": "लाइव नेटवर्क प्रभाव",
  "Real-time waste throughput across the RupayKg OS": "RupayKg OS में वास्तविक समय का कचरा थ्रूपुट",
  "Live Stream": "लाइव स्ट्रीम",
  "Active Nodes": "सक्रिय नोड्स",
  "Value Minted": "मूल्य बनाया गया",
  "Network Topology": "नेटवर्क टोपोलॉजी",
  "Distributed biomass collection nodes": "वितरित बायोमास संग्रह नोड्स",
  "nodes": "नोड्स",
  "A seamless pipeline from waste generation to value realization.": "कचरा उत्पादन से मूल्य प्राप्ति तक एक निर्बाध पाइपलाइन।",
  "Generate": "उत्पन्न करें",
  "Citizens collect agricultural, municipal, or industrial waste.": "नागरिक कृषि, नगरपालिका या औद्योगिक कचरा एकत्र करते हैं।",
  "Aggregate": "एकत्रित करें",
  "Aggregators verify, weigh, and transport waste to facilities.": "एग्रीगेटर कचरे का सत्यापन, वजन और सुविधाओं तक परिवहन करते हैं।",
  "Process": "प्रक्रिया",
  "Recyclers convert waste into usable materials or energy.": "रीसाइक्लर कचरे को उपयोगी सामग्री या ऊर्जा में बदलते हैं।",
  "Mint Value": "मूल्य बनाएं",
  "Smart contracts distribute funds across all 5 value rails.": "स्मार्ट अनुबंध सभी 5 मूल्य रेलों में धन वितरित करते हैं।",
  "Choose your part in the circular economy.": "परिपत्र अर्थव्यवस्था में अपना हिस्सा चुनें।",
  "Citizen": "नागरिक",
  "Waste Generator": "कचरा उत्पादक",
  "Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.": "कृषि, नगरपालिका या औद्योगिक कचरा एकत्र करें और जमा करें। प्रदान किए गए कचरे के वजन और प्रकार के आधार पर सीधे वॉलेट जमा अर्जित करें।",
  "Upload waste records": "कचरा रिकॉर्ड अपलोड करें",
  "Instant wallet funding": "तत्काल वॉलेट फंडिंग",
  "Track environmental impact": "पर्यावरणीय प्रभाव को ट्रैक करें",
  "Aggregator": "एग्रीगेटर",
  "Collection & Transport": "संग्रह और परिवहन",
  "Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.": "नागरिक जमा का सत्यापन करें, कचरे को समेकित करें, और सामग्री को प्रसंस्करण सुविधाओं तक ले जाने के लिए रसद का प्रबंधन करें।",
  "Log collection batches": "संग्रह बैच लॉग करें",
  "Earn logistics margins": "लॉजिस्टिक्स मार्जिन कमाएं",
  "Route optimization data": "मार्ग अनुकूलन डेटा",
  "Recycler": "रीसाइक्लर",
  "Processor": "प्रोसेसर",
  "Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.": "एकत्रित कचरा प्राप्त करें और इसे अंतिम उत्पादों में संसाधित करें। सभी रेलों में अंतिम मूल्य प्राप्ति को ट्रिगर करें।",
  "Log processing yields": "प्रसंस्करण उपज लॉग करें",
  "Access CSR/EPR funds": "CSR/EPR फंड तक पहुंचें",
  "Generate CCCs": "CCC उत्पन्न करें",
  "Circular Economy Operating System": "परिपत्र अर्थव्यवस्था ऑपरेटिंग सिस्टम",
  "Context:": "संदर्भ:",
  "Login": "लॉग इन करें",
  "Register": "पंजीकरण करें",
  "Account Type": "खाता प्रकार",
  "Organization Name": "संगठन का नाम",
  "District": "जिला",
  "State": "राज्य",
  "Phone Number": "फोन नंबर",
  "Password": "पासवर्ड",
  "Access OS": "OS तक पहुंचें",
  "Create Account": "खाता बनाएं",
  "Quick Demo Access": "त्वरित डेमो एक्सेस",
  "Back to Home": "होम पर वापस जाएं",
  "System Audit Logs": "सिस्टम ऑडिट लॉग",
  "Global Impact Map": "वैश्विक प्रभाव मानचित्र",
  "Submission Heatmap": "सबमिशन हीटमैप",
  "Total Offset": "कुल ऑफसेट",
  "Farmers Supported": "समर्थित किसान",
  "Waste Diverted": "कचरा डायवर्ट किया गया",
  "Portfolio Composition": "पोर्टफोलियो संरचना",
  "Impact Distribution": "प्रभाव वितरण",
  "MRV Verification Dashboard": "MRV सत्यापन डैशबोर्ड",
  "Verify processed waste records to issue CCCs.": "CCC जारी करने के लिए प्रसंस्कृत कचरा रिकॉर्ड सत्यापित करें।",
  "Pending": "लंबित",
  "No pending MRV records": "कोई लंबित MRV रिकॉर्ड नहीं",
  "All processed waste has been verified.": "सभी प्रसंस्कृत कचरे का सत्यापन किया जा चुका है।",
  "CCC Reduction": "CCC में कमी",
  "Acreage": "एकड़",
  "AI Risk Score": "AI जोखिम स्कोर",
  "Location Verification": "स्थान सत्यापन",
  "Verify & Issue CCCs": "सत्यापित करें और CCC जारी करें",
  "Reject": "अस्वीकार करें",
  "CCC Offset Market": "CCC ऑफसेट बाजार",
  "Purchase verified CCC Certificates (CCCs) to offset your footprint.": "अपने पदचिह्न को ऑफसेट करने के लिए सत्यापित कार्बन क्रेडिट प्रमाणपत्र (CCC) खरीदें।",
  "Available CCCs": "उपलब्ध CCC",
  "Price per Tonne": "मूल्य प्रति टन",
  "Your Offset Balance": "आपका ऑफसेट बैलेंस",
  "Purchase CCC": "CCC खरीदें",
  "Amount to Purchase (Tonnes)": "खरीदने की मात्रा (टन)",
  "Total Cost": "कुल लागत",
  "Confirm Purchase": "खरीद की पुष्टि करें",
  "Cancel": "रद्द करें",
  "Recent Transactions": "हाल के लेनदेन",
  "Project": "परियोजना",
  "Amount": "मात्रा",
  "Price": "मूल्य",
  "Date": "तारीख",
  "Status": "स्थिति",
  "Network Active": "नेटवर्क सक्रिय",
  "National Dashboard": "राष्ट्रीय डैशबोर्ड",
  "Municipal Corporation": "नगर निगम",
  "Ward": "वार्ड",
  "MSW": "MSW",
  "Ward Analytics": "वार्ड विश्लेषण",
  "Ward-Level Analytics": "वार्ड-स्तरीय विश्लेषण",
  "Citizen (MSW Generator)": "नागरिक (MSW जनरेटर)",
  "Gram Panchayat": "ग्राम पंचायत",
  "Village": "गांव",
  "Biomass": "बायोमास",
  "Village Analytics": "गांव विश्लेषण",
  "Village-Level Analytics": "गांव-स्तरीय विश्लेषण",
  "Farmer / FPO (Biomass Generator)": "किसान / FPO (बायोमास जनरेटर)",
  "All Roles": "सभी भूमिकाएँ",
  "Citizens": "नागरिक",
  "Farmers / FPOs": "किसान / FPO",
  "Aggregators": "एग्रीगेटर",
  "Processors": "प्रोसेसर",
  "CSR Partners": "CSR पार्टनर",
  "EPR Partners": "EPR पार्टनर",
  "CCC Buyers": "कार्बन खरीदार",
  "Diverted": "डाइवर्टेड",
  "Fraud Alerts & Flagged Events": "धोखाधड़ी अलर्ट और ध्वजांकित घटनाएँ",
  "CCC Pool Status": "कार्बन पूल स्थिति",
  "User Management": "उपयोगकर्ता प्रबंधन",
  "Audit Logs": "ऑडिट लॉग",
  "Total Waste Events": "कुल कचरा घटनाएँ",
  "Processed Events": "प्रसंस्कृत घटनाएँ",
  "Wallet Disbursed": "वॉलेट वितरित",
  "Growth & Impact Trends": "विकास और प्रभाव रुझान",
  "Environmental Impact": "पर्यावरणीय प्रभाव",
  "Methane Avoided": "मीथेन से बचाव",
  "Water Saved": "पानी की बचत",
  "Trees Equivalent": "पेड़ों के बराबर",
  "Trees": "पेड़",
  "Economic Efficiency": "आर्थिक दक्षता",
  "Avg Price / kg": "औसत मूल्य / किलो",
  "Govt Cost Savings": "सरकारी लागत बचत",
  "* Government savings calculated based on avoided landfill management and environmental remediation costs.": "* सरकारी बचत की गणना लैंडफिल प्रबंधन और पर्यावरणीय उपचार लागतों से बचाव के आधार पर की गई है।",
  "Operational Health": "परिचालन स्वास्थ्य",
  "Processing Efficiency": "प्रसंस्करण दक्षता",
  "MRV Rejection Rate": "MRV अस्वीकृति दर",
  "Waste Composition": "कचरा संरचना",
  "No flagged events detected.": "कोई ध्वजांकित घटना नहीं मिली।",
  "Geospatial Fraud Distribution": "भौगोलिक धोखाधड़ी वितरण",
  "Total Minted CCC Units": "कुल निर्मित कार्बन इकाइयाँ",
  "User": "उपयोगकर्ता",
  "Role": "भूमिका",
  "Location": "स्थान",
  "Wallet": "वॉलेट",
  "Actions": "कार्रवाई",
  "Regulator": "नियामक",
  "Municipal Admin": "नगरपालिका व्यवस्थापक",
  "State Admin": "राज्य व्यवस्थापक",
  "Super Admin": "सपर एडमिन",
  "CSR Partner": "CSR पार्टनर",
  "EPR Partner": "EPR पार्टनर",
  "CCC Buyer": "कार्बन खरीदार",
  "Delete User": "उपयोगकर्ता हटाएं",
  "No users found.": "कोई उपयोगकर्ता नहीं मिला।",
  "Action": "कार्रवाई",
  "User ID": "उपयोगकर्ता आईडी",
  "No audit logs available.": "कोई ऑडिट लॉग उपलब्ध नहीं है।",
  "Total Waste": "कुल कचरा",
  "Total Events": "कुल घटनाएँ",
  "No ward data available.": "कोई वार्ड डेटा उपलब्ध नहीं है।",
  "Add ₹10,000": "₹10,000 जोड़ें",
  "Saving...": "सहेजा जा रहा है...",
  "Save Changes": "परिवर्तन सहेजें",
  "Notification Preferences": "अधिसूचना प्राथमिकताएँ",
  "Email Notifications": "ईमेल अधिसूचनाएँ",
  "Receive updates about your transactions via email.": "ईमेल के माध्यम से अपने लेनदेन के बारे में अपडेट प्राप्त करें।",
  "SMS Alerts": "SMS अलर्ट",
  "Get instant SMS alerts for critical updates.": "महत्वपूर्ण अपडेट के लिए तत्काल SMS अलर्ट प्राप्त करें।",
  "Push Notifications": "पुश अधिसूचनाएँ",
  "Enable browser push notifications.": "ब्राउज़र पुश अधिसूचनाएँ सक्षम करें।",
  "Currently Active: ": "वर्तमान में सक्रिय: ",
  " Context (": " संदर्भ (",
  "GENESIS": "उत्पत्ति (GENESIS)",
  "Weight: ": "वजन: ",
  "Village: ": "गांव: ",
  "Value: ": "मूल्य: ",
  "FRAUD ALERT": "धोखाधड़ी अलर्ट",
  "Type: ": "प्रकार: ",
  "How the Engine Works": "इंजन कैसे काम करता है",
  "© 2026 RupayKg Circular Economy OS. All rights reserved.": "© 2026 RupayKg Circular Economy OS. सर्वाधिकार सुरक्षित।",
  "Privacy": "गोपनीयता",
  "Terms": "शर्तें",
  "RUPAYKG": "RUPAYKG",
  "urban": "शहरी",
  "rural": "ग्रामीण",
  "Aggregator (Collection & Transport)": "एग्रीगेटर (संग्रह और परिवहन)",
  "Processor (Recycler)": "प्रोसेसर (रीसाइक्लर)",
  "Admin": "एडमिन",
  "National Regulator": "राष्ट्रीय नियामक",
  "Farmer": "किसान",
  "Wallet Balance": "वॉलेट बैलेंस",
  "Database Connection Failed": "डेटाबेस कनेक्शन विफल",
  "No records found": "कोई रिकॉर्ड नहीं मिला",
  "No audit logs found": "कोई ऑडिट लॉग नहीं मिला",
  "Circular Economy Intake Form": "परिपत्र अर्थव्यवस्था इनटेक फॉर्म",
  "Acreage (acres)": "एकड़ (एकड़)",
  "Name": "नाम",
  "GPS Captured: ": "GPS कैप्चर किया गया: ",
  "Capturing GPS Coordinates...": "GPS निर्देशांक कैप्चर किए जा रहे हैं...",
  "GPS Capture Failed": "GPS कैप्चर विफल",
  "GPS Required": "GPS आवश्यक",
  "Retry GPS": "GPS पुनः प्रयास करें",
  "Failed to register farmer": "किसान को पंजीकृत करने में विफल",
  "Farmer registered successfully! ID: ": "किसान सफलतापूर्वक पंजीकृत! आईडी: ",
  "e.g., Paddy, Wheat": "जैसे, धान, गेहूं",
  "Failed to get location. Please enter manually.": "स्थान प्राप्त करने में विफल। कृपया मैन्युअल रूप से दर्ज करें।",
  "Geolocation is not supported by this browser.": "इस ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है।",
  "Active Queue": "सक्रिय कतार",
  "Active Fleet": "सक्रिय बेड़ा",
  "Drivers Online": "ड्राइवर ऑनलाइन",
  "Current Load": "वर्तमान भार",
  "Total Capacity": "कुल क्षमता",
  "Utilization": "उपयोग",
  "Biomass in Stock": "स्टॉक में बायोमास",
  "Output Material": "आउटपुट सामग्री",
  "Storage Utilization": "भंडारण उपयोग",
  "Available for Pickup": "पिकअप के लिए उपलब्ध",
  "Incoming for Processing": "प्रसंस्करण के लिए आ रहा है",
  "No new tasks available.": "कोई नया कार्य उपलब्ध नहीं है।",
  "Accept Pickup": "पिकअप स्वीकार करें",
  "Accept Receipt": "रसीद स्वीकार करें",
  "Recently Processed": "हाल ही में प्रसंस्कृत",
  "No active tasks in your possession.": "आपके पास कोई सक्रिय कार्य नहीं है।",
  "Timestamp": "टाइमस्टैम्प",
  "Type": "प्रकार",
  "Weight": "वजन",
  "Value": "मूल्य",
  "MRV Status": "MRV स्थिति",
  "No records found for the selected filter.": "चयनित फ़िल्टर के लिए कोई रिकॉर्ड नहीं मिला।",
  "Pending MRV": "लंबित MRV",
  "Low": "कम",
  "Med": "मध्यम",
  "High": "उच्च",
  "Record ID": "रिकॉर्ड आईडी",
  "Details": "विवरण",
  "AI Risk": "AI जोखिम",
  "Verified By": "सत्यापित द्वारा",
  "No MRV history found": "कोई MRV इतिहास नहीं मिला",
  "No CCCs available": "कोई CCC उपलब्ध नहीं है",
  "Check back later for newly verified CCC Certificates.": "नए सत्यापित कार्बन क्रेडिट प्रमाणपत्रों के लिए बाद में देखें।",
  "Verified": "सत्यापित",
  "Offset": "ऑफसेट",
  "Insufficient Funds": "अपर्याप्त धन",
  "Profile Settings": "प्रोफ़ाइल सेटिंग्स",
  "Profile updated successfully": "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई",
  "Failed to update profile": "प्रोफ़ाइल अपडेट करने में विफल",
  "An error occurred": "एक त्रुटि हुई",
  "The Foundational Structure and Operating Doctrine of RupayKg": "RupayKg की मूलभूत संरचना और संचालन सिद्धांत",
  "RupayKg AI": "RupayKg AI",
  "Thinking...": "सोच रहा हूँ...",
  "Read Aloud": "ज़ोर से पढ़ें",
  "Playing...": "बज रहा है...",
  "Use Maps": "मैप्स का उपयोग करें",
  "Maps Grounding On": "मैप्स ग्राउंडिंग चालू",
  "Ask RupayKg AI...": "RupayKg AI से पूछें...",
  "Sources:": "स्रोत:",
  "Map Location": "मैप स्थान",
  "Hello! I am RupayKg AI. How can I help you with waste management, CCCs, or finding nearby facilities?": "नमस्ते! मैं RupayKg AI हूँ। मैं कचरा प्रबंधन, CCCs, या आस-पास की सुविधाओं को खोजने में आपकी कैसे मदद कर सकता हूँ?",
  "Sorry, I encountered an error.": "क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा।",
  "Agricultural": "कृषि",
  "Municipal": "नगरपालिका",
  "Industrial": "औद्योगिक",
  "Forestry": "वानिकी",
  "Livestock": "पशुधन",
  "Aquatic": "जलीय",
  "Construction": "निर्माण",
  "Plastics": "प्लास्टिक",
  "Metals": "धातु",
  "E-Waste": "ई-कचरा",
  "Textiles": "कपड़ा",
  "Hazardous": "खतरनाक",
  "Crop Residue (Stubble/Straw)": "फसल अवशेष (पराली/पुआल)",
  "Rice Husk & Bran": "चावल की भूसी और चोकर",
  "Wheat Bran": "गेहूं का चोकर",
  "Sugarcane Bagasse": "गन्ने की खोई",
  "Pressmud": "प्रेसमड",
  "Cotton Stalks": "कपास के डंठल",
  "Maize Cobs & Stalks": "मक्के के भुट्टे और डंठल",
  "Coconut Shells & Coir": "नारियल के गोले और जटा",
  "Groundnut Shells": "मूंगफली के छिलके",
  "Fruit & Vegetable Pomace": "फल और सब्जी का गूदा",
  "Spent Grain (Brewery)": "बचे हुए अनाज (शराब की भठ्ठी)",
  "Coffee Grounds/Husks": "कॉफी ग्राउंड/भूसी",
  "Tea Waste": "चाय का कचरा",
  "Municipal Organic Waste": "नगरपालिका जैविक कचरा",
  "Food & Kitchen Waste": "खाद्य और रसोई का कचरा",
  "Garden & Leaf Litter": "बगीचे और पत्तों का कचरा",
  "Paper & Cardboard Waste": "कागज और कार्डबोर्ड कचरा",
  "Used Cooking Oil": "इस्तेमाल किया हुआ खाना पकाने का तेल",
  "Textile Waste (Natural)": "कपड़ा कचरा (प्राकृतिक)",
  "Glass Bottles & Jars": "कांच की बोतलें और जार",
  "Industrial Sludge (Organic)": "औद्योगिक कीचड़ (जैविक)",
  "Leather Scraps": "चमड़े के टुकड़े",
  "Rubber Waste": "रबर कचरा",
  "Distillery Spent Wash": "डिस्टिलरी स्पेंट वॉश",
  "Fly Ash": "फ्लाई ऐश",
  "Slag": "स्लैग",
  "Forestry Wood Chips": "वानिकी लकड़ी के चिप्स",
  "Sawdust & Bark": "लकड़ी का बुरादा और छाल",
  "Bamboo Waste": "बांस का कचरा",
  "Pine Needles": "चीड़ की सुइयां",
  "Invasive Species (Lantana)": "आक्रामक प्रजातियां (लेंटाना)",
  "Livestock Manure": "पशुधन खाद",
  "Poultry Litter": "पोल्ट्री लिटर",
  "Bone Meal": "हड्डी का चूरा",
  "Feather Waste": "पंखों का कचरा",
  "Aquatic Algae/Seaweed": "जलीय शैवाल/समुद्री घास",
  "Invasive Species (Water Hyacinth)": "आक्रामक प्रजातियां (जलकुंभी)",
  "Fish Processing Waste": "मछली प्रसंस्करण कचरा",
  "Construction Wood Waste": "निर्माण लकड़ी का कचरा",
  "Concrete Rubble (Recycled)": "कंक्रीट का मलबा (पुनर्नवीनीकरण)",
  "Brick & Tile Waste": "ईंट और टाइल कचरा",
  "Gypsum Board Scraps": "जिप्सम बोर्ड के टुकड़े",
  "PET Bottles (Clear)": "पीईटी बोतलें (साफ)",
  "HDPE Containers": "एचडीपीई कंटेनर",
  "LDPE Film/Wrap": "एलडीपीई फिल्म/रैप",
  "PP Rigid Plastic": "पीपी कठोर प्लास्टिक",
  "PVC Scraps": "पीवीसी स्क्रैप",
  "Multi-Layered Plastic (MLP)": "बहु-स्तरित प्लास्टिक (MLP)",
  "Aluminum Cans": "एल्युमीनियम के डिब्बे",
  "Copper Wire Scraps": "तांबे के तार के टुकड़े",
  "Steel/Iron Scrap": "स्टील/लोहे का स्क्रैप",
  "Brass/Bronze Fittings": "पीतल/कांस्य फिटिंग",
  "Printed Circuit Boards (PCBs)": "प्रिंटेड सर्किट बोर्ड (PCBs)",
  "Computer/Laptop Scraps": "कंप्यूटर/लैपटॉप स्क्रैप",
  "Mobile Phone Waste": "मोबाइल फोन कचरा",
  "Lithium-Ion Batteries": "लिथियम-आयन बैटरी",
  "Cables & Connectors": "केबल और कनेक्टर",
  "Cotton Textile Scraps": "सूती कपड़े के टुकड़े",
  "Polyester/Synthetic Fabric": "पॉलिएस्टर/सिंथेटिक फैब्रिक",
  "Wool Waste": "ऊन का कचरा",
  "Used Footwear": "इस्तेमाल किए हुए जूते",
  "Lead-Acid Batteries": "लेड-एसिड बैटरी",
  "Used Engine Oil": "इस्तेमाल किया हुआ इंजन तेल",
  "Paint & Solvent Waste": "पेंट और विलायक कचरा",
  "E-Waste Batteries (Ni-Cd/Ni-MH)": "ई-कचरा बैटरी (Ni-Cd/Ni-MH)",
  "Rice": "चावल",
  "Wheat": "गेहूं",
  "Maize": "मक्का",
  "I. Introduction": "I. परिचय",
  "RupayKg has been established as a Unified Waste-to-CCC Digital Operating System designed to support India’s transition toward a compliance-based CCC market.": "RupayKg को एक एकीकृत अपशिष्ट-से-CCC डिजिटल ऑपरेटिंग सिस्टम के रूप में स्थापित किया गया है, जिसे अनुपालन-आधारित CCC बाजार की ओर भारत के संक्रमण का समर्थन करने के लिए डिज़ाइन किया गया है।",
  "The platform addresses a structural gap in India’s CCC ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade CCC supply.": "यह मंच भारत के कार्बन पारिस्थितिकी तंत्र में एक संरचनात्मक अंतर को संबोधित करता है: एक एकीकृत, नियामक-संरेखित डिजिटल बुनियादी ढांचे की अनुपस्थिति जो सत्यापित अपशिष्ट डायवर्जन को अनुपालन-ग्रेड कार्बन आपूर्ति में बदलने में सक्षम है।",
  "RupayKg is not structured as a project developer, CCC trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.": "RupayKg को एक परियोजना डेवलपर, कार्बन व्यापारी या रीसाइक्लिंग इकाई के रूप में संरचित नहीं किया गया है। यह एक बुनियादी ढांचा परत है जिसे वास्तुशिल्प दोहराव के बिना शहरी और ग्रामीण प्रशासनिक ढांचे में संचालित करने के लिए डिज़ाइन किया गया है।",
  "II. Unified Operating System Model": "II. एकीकृत ऑपरेटिंग सिस्टम मॉडल",
  "Context": "संदर्भ",
  "Anchor": "एंकर",
  "Category": "श्रेणी",
  "Urban": "शहरी",
  "Municipal Corp + Ward": "नगर निगम + वार्ड",
  "Rural": "ग्रामीण",
  "Gram Panchayat + Village": "ग्राम पंचायत + गांव",
  "* All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.": "* सभी ग्रामीण कृषि अवशेष और बायोमास गतिविधि को बायोमास के तहत वर्गीकृत किया गया है। कोई अलग कृषि वर्टिकल मौजूद नहीं है।",
  "III. Unified Stakeholder Architecture": "III. एकीकृत हितधारक वास्तुकला",
  "Administrative Authority": "प्रशासनिक प्राधिकरण",
  "Producers (EPR)": "उत्पादक (EPR)",
  "CSR Contributors": "CSR योगदानकर्ता",
  "The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.": "एग्रीगेटर को संरचनात्मक रूप से विलय की गई इकाई के रूप में परिभाषित किया गया है जो संग्रह और छँटाई सत्यापन के लिए जिम्मेदार है, जो कस्टडी की श्रृंखला के सत्यापन को सरल बनाता है।",
  "IV. CCC Origination": "IV. CCC उत्पत्ति",
  "Methane avoidance through diversion": "डायवर्जन के माध्यम से मीथेन से बचाव",
  "Biomass-based fossil substitution": "बायोमास-आधारित जीवाश्म प्रतिस्थापन",
  "Recycling substitution": "रीसाइक्लिंग प्रतिस्थापन",
  "V. Multi-Rail Architecture": "V. मल्टी-रेल वास्तुकला",
  "Recycler Rail": "रीसाइक्लर रेल",
  "CSR Rail": "CSR रेल",
  "EPR Rail": "EPR रेल",
  "Governance Layer": "शासन परत",
  "CCC Rail": "कार्बन रेल",
  "VI. Regulator Sovereignty": "VI. नियामक संप्रभुता",
  "CCC issuance authority remains regulator-controlled. RupayKg does not independently mint CCCs. All CCCs must be event-traceable, registry-compatible, and align with national CCC governance frameworks.": "CCC जारी करने का अधिकार नियामक-नियंत्रित रहता है। RupayKg स्वतंत्र रूप से CCC नहीं बनाता है। सभी CCC इवेंट-ट्रेसेबल, रजिस्ट्री-संगत होने चाहिए और राष्ट्रीय कार्बन गवर्नेंस फ्रेमवर्क के साथ संरेखित होने चाहिए।",
  "VII. Strategic Position": "VII. रणनीतिक स्थिति",
  "When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated CCC value?": "जब हमने RupayKg बनाना शुरू किया, तो हमने रीसाइक्लिंग से शुरुआत नहीं की। हमने एक संरचनात्मक प्रश्न के साथ शुरुआत की: ऐसा कोई एकीकृत बुनियादी ढांचा क्यों नहीं है जो कचरे को विनियमित कार्बन मूल्य में बदल दे?",
  "India is entering a compliance CCC era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.": "भारत एक अनुपालन कार्बन युग में प्रवेश कर रहा है। नगर निगम प्रणालियाँ मापने योग्य मीथेन उत्पन्न करती हैं। ग्रामीण बायोमास को जलाया जाता है या कम उपयोग किया जाता है। फिर भी प्रणालियाँ खंडित बनी हुई हैं।",
  "RupayKg was built to unify them. Not as a CCC trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.": "RupayKg को उन्हें एकीकृत करने के लिए बनाया गया था। कार्बन व्यापारी के रूप में नहीं। रीसाइक्लिंग स्टार्टअप के रूप में नहीं। बल्कि एक एकल ऑपरेटिंग सिस्टम के रूप में जो संरचनात्मक दोहराव के बिना नगर निगम वार्ड स्तर और ग्राम पंचायत गांव स्तर पर काम करने में सक्षम है।",
  "Waste is no longer disposal. It is governance-linked climate infrastructure.": "कचरा अब केवल निपटान नहीं है। यह शासन-लिंक्ड जलवायु बुनियादी ढांचा है।",
  "— Founder, RupayKg": "— संस्थापक, RupayKg",
  "Legally Styled": "कानूनी रूप से शैलीबद्ध",
  "DECLARATION OF FOUNDATIONAL STRUCTURE": "मूलभूत संरचना की घोषणा",
  "Article I — Unified Operating System": "अनुच्छेद I — एकीकृत ऑपरेटिंग सिस्टम",
  "RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.": "RupayKg एक एकल डिजिटल सिस्टम संचालित करेगा जो इसके तहत तैनात किया जा सकता है: (ए) नगर निगम + वार्ड (शहरी संदर्भ) (बी) ग्राम पंचायत + गांव (ग्रामीण संदर्भ)। संदर्भों के बीच कोई संरचनात्मक दोहराव मौजूद नहीं होगा।",
  "Article II — Unified Stakeholder Doctrine": "अनुच्छेद II — एकीकृत हितधारक सिद्धांत",
  "The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, CCC Buyers, Regulator.": "हितधारक संरचना देश भर में एक समान रहेगी और इसमें शामिल होंगे: अपशिष्ट जनरेटर, एग्रीगेटर, प्रोसेसर, प्रशासनिक प्राधिकरण, उत्पादक (EPR), CSR योगदानकर्ता, कार्बन खरीदार, नियामक।",
  "Article III — Waste Classification": "अनुच्छेद III — अपशिष्ट वर्गीकरण",
  "Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.": "अपशिष्ट को विशेष रूप से इस रूप में वर्गीकृत किया जाएगा: (ए) शहरी संदर्भ में MSW (बी) ग्रामीण संदर्भ में बायोमास। सभी कृषि अवशेषों को बायोमास के तहत वर्गीकृत किया जाएगा।",
  "Article IV — CCC Engine": "अनुच्छेद IV — CCC इंजन",
  "All emission reductions shall be processed through a single CCC calculation engine with event-level MRV validation.": "सभी उत्सर्जन कटौती को इवेंट-लेवल MRV सत्यापन के साथ एकल CCC गणना इंजन के माध्यम से संसाधित किया जाएगा।",
  "Article V — Rail Separation": "अनुच्छेद V — रेल पृथक्करण",
  "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, CCC issuance. Double counting is prohibited.": "RupayKg इनके बीच सख्त अलगाव बनाए रखेगा: रीसाइक्लर अकाउंटिंग, CSR अकाउंटिंग, EPR अनुपालन, शासन मूल्य, CCC जारी करना। दोहराव गणना निषिद्ध है।",
  "Article VI — Regulator Sovereignty": "अनुच्छेद VI — नियामक संप्रभुता",
  "CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs.": "CCC निर्माण अधिकार नियामक नियंत्रण में रहेगा। RupayKg स्वतंत्र रूप से CCC जारी नहीं करेगा।",
  "Institutional Identity": "संस्थागत पहचान",
  "RupayKg is hereby defined as: A Unified Waste-to-CCC Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability.": "RupayKg को एतद्द्वारा इस रूप में परिभाषित किया गया है: एक एकीकृत अपशिष्ट-से-CCC इन्फ्रास्ट्रक्चर प्लेटफॉर्म जो नियामक-संरेखित CCC उत्पत्ति क्षमता के साथ एकल राष्ट्रीय हितधारक वास्तुकला के तहत काम करता है।"
  ,
  "content-type": "content-type",
  "System Insight: Regional biomass output is projected to grow 5-10% next month. Local segregation efficiency remains high across districts.": "System Insight: Regional biomass output is projected to grow 5-10% next month. Local segregation efficiency remains high across districts.",
  "System Insight: Regional biomass output is projected to grow 5-10% next month as collection efficiency improves. We recommend prioritizing fuel allocation for high-yield zones to handle increasing volumes.": "System Insight: Regional biomass output is projected to grow 5-10% next month as collection efficiency improves. We recommend prioritizing fuel allocation for high-yield zones to handle increasing volumes.",
  ",": ",",
  ";base64,": ";base64,",
  ":": ":",
  "Waste Management • Resource Recovery • Digital MRV • ESG": "Waste Management • Resource Recovery • Digital MRV • ESG",
  "India's Circular Economy": "India's Circular Economy",
  "Operating System": "Operating System",
  "A unified digital platform for municipalities, industries, and rural ecosystems to manage resource flows. Integrating Waste Management, Digital MRV, Carbon Accounting, EPR Compliance, ESG Reporting, and AI-driven Operational Intelligence.": "A unified digital platform for municipalities, industries, and rural ecosystems to manage resource flows. Integrating Waste Management, Digital MRV, Carbon Accounting, EPR Compliance, ESG Reporting, and AI-driven Operational Intelligence.",
  "Waste & Resource Recovery": "Waste & Resource Recovery",
  "End-to-end traceability for municipal solid waste and agricultural biomass. Track collection, transport, and processing in real-time.": "End-to-end traceability for municipal solid waste and agricultural biomass. Track collection, transport, and processing in real-time.",
  "Sovereign Digital MRV": "Sovereign Digital MRV",
  "Automated measurement, reporting, and verification for carbon mitigation. Immutable audit trails with GPS, timestamp, and verifiable evidence.": "Automated measurement, reporting, and verification for carbon mitigation. Immutable audit trails with GPS, timestamp, and verifiable evidence.",
  "Carbon Accounting": "Carbon Accounting",
  "Generate compliant project design documents and calculate emission reductions using standard methodologies (CCTS / BEE).": "Generate compliant project design documents and calculate emission reductions using standard methodologies (CCTS / BEE).",
  "EPR Compliance": "EPR Compliance",
  "Streamlined Extended Producer Responsibility reporting. Connect producers with authorized recyclers to meet state and national mandates.": "Streamlined Extended Producer Responsibility reporting. Connect producers with authorized recyclers to meet state and national mandates.",
  "Enterprise ESG Reporting": "Enterprise ESG Reporting",
  "Generate comprehensive Scope 3 dashboards and sustainability impact reports for CSR contributors, boards, and regulatory bodies.": "Generate comprehensive Scope 3 dashboards and sustainability impact reports for CSR contributors, boards, and regulatory bodies.",
  "AI-Driven Intelligence": "AI-Driven Intelligence",
  "Machine learning for waste classification, anomaly detection in weighbridge data, and predictive carbon yield forecasting.": "Machine learning for waste classification, anomaly detection in weighbridge data, and predictive carbon yield forecasting.",
  "Generate Evidence": "Generate Evidence",
  "Choose your part in the Sovereign Environmental Trust Infrastructure.": "Choose your part in the Sovereign Environmental Trust Infrastructure.",
  "© 2026 RupayKg Digital Operating System. All rights reserved.": "© 2026 RupayKg Digital Operating System. All rights reserved.",
  "Select State": "Select State",
  "Select District": "Select District",
  "Sub-District": "Sub-District",
  "Select Sub-District": "Select Sub-District",
  "Local Body / Ward": "Local Body / Ward",
  "Select Local Body/Ward": "Select Local Body/Ward",
  "No PDD has been generated for this project yet. Click \"Generate PDD & Submit\" first.": "No PDD has been generated for this project yet. Click \"Generate PDD & Submit\" first.",
  "Failed to retrieve Project Design Document.": "Failed to retrieve Project Design Document.",
  "Offset Project Registered successfully under the ICM framework! You can now generate its AI-backed PDD.": "Offset Project Registered successfully under the ICM framework! You can now generate its AI-backed PDD.",
  "An error occurred during project registration.": "An error occurred during project registration.",
  "Project officially registered and validated under the national ICM CCTS registry!": "Project officially registered and validated under the national ICM CCTS registry!",
  "An error occurred during ACVA action submission.": "An error occurred during ACVA action submission.",
  "Performance-Linked Green Bond successfully issued! Linked to your offset project and deployed on-chain.": "Performance-Linked Green Bond successfully issued! Linked to your offset project and deployed on-chain.",
  "An error occurred during bond issuance.": "An error occurred during bond issuance.",
  "Enter investment amount (INR):', '100000": "Enter investment amount (INR):', '100000",
  "Investment successfully completed! Your funds are locked in the project escrow and registered on Hedera.": "Investment successfully completed! Your funds are locked in the project escrow and registered on Hedera.",
  "Indian Carbon Market (ICM) Compliance": "Indian Carbon Market (ICM) Compliance",
  "Offset Project Infrastructure": "Offset Project Infrastructure",
  "Register waste-to-carbon projects (Biomass, MSW, Biogas, Composting), generate AI-assisted Project Design Documents (PDDs), and connect to the national CCTS Offset Mechanism.": "Register waste-to-carbon projects (Biomass, MSW, Biogas, Composting), generate AI-assisted Project Design Documents (PDDs), and connect to the national CCTS Offset Mechanism.",
  "New Project": "New Project",
  "Registry Administration & Validation (ACVA)": "Registry Administration & Validation (ACVA)",
  "Review submitted Project Design Documents (PDDs) under CERC standards, perform compliance audits, approve project registrations, and prepare verified MRV records for CCTS issuance.": "Review submitted Project Design Documents (PDDs) under CERC standards, perform compliance audits, approve project registrations, and prepare verified MRV records for CCTS issuance.",
  "No active projects awaiting review or registered in registry.": "No active projects awaiting review or registered in registry.",
  "Registered": "Registered",
  "Under ACVA Review": "Under ACVA Review",
  "Revision Requested": "Revision Requested",
  "Rejected": "Rejected",
  "Review PDD": "Review PDD",
  "Validate & Approve": "Validate & Approve",
  "Compile MRV Data": "Compile MRV Data",
  "My Offset Projects": "My Offset Projects",
  "No offset projects registered.": "No offset projects registered.",
  "Draft PDD": "Draft PDD",
  "In Validation": "In Validation",
  "PDD Successfully Generated and Submitted for ACVA Validation!": "PDD Successfully Generated and Submitted for ACVA Validation!",
  "Re-Generate & Submit": "Re-Generate & Submit",
  "Generate AI PDD & Submit": "Generate AI PDD & Submit",
  "View Generated PDD": "View Generated PDD",
  "Approved BEE Methodologies": "Approved BEE Methodologies",
  "Import Policy": "Import Policy",
  "Loading methodologies...": "Loading methodologies...",
  "Issue Performance Bond": "Issue Performance Bond",
  "Register New ICM Offset Project": "Register New ICM Offset Project",
  "Project Title": "Project Title",
  "Description": "Description",
  "Project Type": "Project Type",
  "Location / District": "Location / District",
  "Linked BEE Methodology": "Linked BEE Methodology",
  "Register Project": "Register Project",
  "Project Design Document (PDD)": "Project Design Document (PDD)",
  "1. Executive Summary": "1. Executive Summary",
  "2. Baseline Scenario": "2. Baseline Scenario",
  "3. Additionality Analysis": "3. Additionality Analysis",
  "4. Monitoring & Verification Plan (MRV)": "4. Monitoring & Verification Plan (MRV)",
  "5. Estimated Emission Reductions": "5. Estimated Emission Reductions",
  "ACVA Auditor Comments": "ACVA Auditor Comments",
  "ACVA Verification Action Panel": "ACVA Verification Action Panel",
  "ACVA Auditor ID": "ACVA Auditor ID",
  "Decision Status": "Decision Status",
  "Currently pending ACVA transition": "Currently pending ACVA transition",
  "Auditor Evaluation Notes / Revision Demands": "Auditor Evaluation Notes / Revision Demands",
  "Detail any identified discrepancies, requested revisions to methodologies, or approval reasoning here...": "Detail any identified discrepancies, requested revisions to methodologies, or approval reasoning here...",
  "Approve & Register": "Approve & Register",
  "Request Revision": "Request Revision",
  "Close": "Close",
  "ACVA Project Audit & Verification": "ACVA Project Audit & Verification",
  "Pending ACVA validation": "Pending ACVA validation",
  "Review PDD, audit carbon offset claims, and issue compliance decisions.": "Review PDD, audit carbon offset claims, and issue compliance decisions.",
  "PDD document data not found or still loading.": "PDD document data not found or still loading.",
  "ACVA Auditor Decisions": "ACVA Auditor Decisions",
  "Provide your certified CERC registration/auditor credentials identifier.": "Provide your certified CERC registration/auditor credentials identifier.",
  "Evaluation Notes / Auditor Comments": "Evaluation Notes / Auditor Comments",
  "Enter verification findings, required methodology adjustments, additionality feedback, or reasoning for approval/rejection here...": "Enter verification findings, required methodology adjustments, additionality feedback, or reasoning for approval/rejection here...",
  "ACVA Governance Action Notice": "ACVA Governance Action Notice",
  "Approval will finalize the PDD state, registering the project in the Indian Carbon Market (ICM) registry and making it eligible for CCTS compliance issuance.": "Approval will finalize the PDD state, registering the project in the Indian Carbon Market (ICM) registry and making it eligible for CCTS compliance issuance.",
  "Approve & Register Project": "Approve & Register Project",
  "RUPAYKG ENTERPRISE CIRCULAR ECONOMY ENGINE": "RUPAYKG ENTERPRISE CIRCULAR ECONOMY ENGINE",
  "Import Methodology Policy": "Import Methodology Policy",
  "Methodology Name": "Methodology Name",
  "Sector": "Sector",
  "Standards Body": "Standards Body",
  "Methodology Policy Successfully Compiled to Registry Node!": "Methodology Policy Successfully Compiled to Registry Node!",
  "Failed to import policy.": "Failed to import policy.",
  "Compile & Import": "Compile & Import",
  "Compile MRV Audit Data": "Compile MRV Audit Data",
  "Generate high-quality, verifiable project data mapped to approved CCTS methodologies. This data payload can be submitted to National Registries by project developers or authorized auditors.": "Generate high-quality, verifiable project data mapped to approved CCTS methodologies. This data payload can be submitted to National Registries by project developers or authorized auditors.",
  "Total Volume Mitigated (kg CO₂e)": "Total Volume Mitigated (kg CO₂e)",
  "CCTS Sector": "CCTS Sector",
  "Compile MRV & Prepare for Registry": "Compile MRV & Prepare for Registry",
  "National Registry Interaction Hub": "National Registry Interaction Hub",
  "RupayKg does not issue carbon credits. We provide the foundational MRV data platform that allows you to submit high-quality, fully verifiable project data and baseline calculations to independent validators and national registries (CCTS / BEE) for offset issuance.": "RupayKg does not issue carbon credits. We provide the foundational MRV data platform that allows you to submit high-quality, fully verifiable project data and baseline calculations to independent validators and national registries (CCTS / BEE) for offset issuance.",
  "Verified Data Payloads": "Verified Data Payloads",
  "Validation Requests": "Validation Requests",
  "Verified MRV Payload Vault": "Verified MRV Payload Vault",
  "Your registry vault is currently empty.": "Your registry vault is currently empty.",
  "Compile MRV data from your verified projects to populate your vault.": "Compile MRV data from your verified projects to populate your vault.",
  "Verified & Registered": "Verified & Registered",
  "Validation Request Submitted!": "Validation Request Submitted!",
  "Request Validation": "Request Validation",
  "Auditor / Validator Dashboard": "Auditor / Validator Dashboard",
  "The exchange is currently quiet.": "The exchange is currently quiet.",
  "No active sell orders are listed on the open market.": "No active sell orders are listed on the open market.",
  "Awaiting Verification": "Awaiting Verification",
  "Verified and Forwarded to CCTS Registry!": "Verified and Forwarded to CCTS Registry!",
  "Action failed.": "Action failed.",
  "Audit & Verify": "Audit & Verify",
  "Your Request": "Your Request",
  "Log Waste": "Log Waste",
  "Onboard": "Onboard",
  "WhatsApp Bot": "WhatsApp Bot",
  "Playbook": "Playbook",
  "Reports": "Reports",
  "LGD Registry": "LGD Registry",
  "Onboarded Users": "Onboarded Users",
  "Verified Records": "Verified Records",
  "Collection Trends": "Collection Trends",
  "Recent MRV Logs": "Recent MRV Logs",
  "No logs recorded yet": "No logs recorded yet",
  "Log Waste Collection": "Log Waste Collection",
  "Capture real-time field data for MRV verification.": "Capture real-time field data for MRV verification.",
  "Waste logged successfully! AI validation in progress.": "Waste logged successfully! AI validation in progress.",
  "Failed to log waste.": "Failed to log waste.",
  "Error connecting to server.": "Error connecting to server.",
  "Manual Entry": "Manual Entry",
  "App-based Logging": "App-based Logging",
  "Recording from physical ledger": "Recording from physical ledger",
  "Real-time field capture": "Real-time field capture",
  "Switch to App": "Switch to App",
  "Switch to Manual": "Switch to Manual",
  "Location / Ward": "Location / Ward",
  "Manual Entry Notes": "Manual Entry Notes",
  "Enter details from physical ledger, e.g. Receipt #1234, Collector: Ramesh": "Enter details from physical ledger, e.g. Receipt #1234, Collector: Ramesh",
  "Photo Proof URL": "Photo Proof URL",
  "Collector ID": "Collector ID",
  "Estimated CCC Impact": "Estimated CCC Impact",
  "*Based on IPCC default factors for pilot region.": "*Based on IPCC default factors for pilot region.",
  "Submit Log": "Submit Log",
  "Onboard Field Partner": "Onboard Field Partner",
  "Register waste collectors and aggregators for the pilot OS.": "Register waste collectors and aggregators for the pilot OS.",
  "Partner onboarded successfully!": "Partner onboarded successfully!",
  "Failed to onboard partner.": "Failed to onboard partner.",
  "Operating Area": "Operating Area",
  "Onboard Partner": "Onboard Partner",
  "WhatsApp Fallback Bot": "WhatsApp Fallback Bot",
  "Low-connectivity workflow for field staff.": "Low-connectivity workflow for field staff.",
  "How it works": "How it works",
  "Collector sends \"LOG\" to the official WhatsApp number.": "Collector sends \"LOG\" to the official WhatsApp number.",
  "Bot asks for weight, type, and a photo of the receipt.": "Bot asks for weight, type, and a photo of the receipt.",
  "Data is automatically ingested into CCC OS MRV.": "Data is automatically ingested into CCC OS MRV.",
  "Official Bot Number": "Official Bot Number",
  "Download QR Code for Field": "Download QR Code for Field",
  "Simulated Chat": "Simulated Chat",
  "Great! Please send a photo of the waste on the scale.": "Great! Please send a photo of the waste on the scale.",
  "Verified! 45kg Organic logged at Area Hub. CCC Impact: +0.022 tCO2e.": "Verified! 45kg Organic logged at Area Hub. CCC Impact: +0.022 tCO2e.",
  "Type a message...": "Type a message...",
  "Operations Playbook": "Operations Playbook",
  "Standard Operating Procedures for National Deployment.": "Standard Operating Procedures for National Deployment.",
  "Download PDF": "Download PDF",
  "Active SOP: Ground Collection": "Active SOP: Ground Collection",
  "Version 1.2 • Updated 2 days ago": "Version 1.2 • Updated 2 days ago",
  "Field Script (Hindi)": "Field Script (Hindi)",
  "Quick Resources": "Quick Resources",
  "WhatsApp Bot Guide": "WhatsApp Bot Guide",
  "Waste Grading Chart": "Waste Grading Chart",
  "Payment Schedule": "Payment Schedule",
  "Field Support": "Field Support",
  "Need help with ground operations? Contact the pilot supervisor.": "Need help with ground operations? Contact the pilot supervisor.",
  "Call Supervisor": "Call Supervisor",
  "Pilot Impact Reports": "Pilot Impact Reports",
  "AI-generated executive summaries and data exports.": "AI-generated executive summaries and data exports.",
  "Generate New Report": "Generate New Report",
  "No Report Generated": "No Report Generated",
  "Click the button above to generate an AI-powered executive summary of your pilot data.": "Click the button above to generate an AI-powered executive summary of your pilot data.",
  "Data Exports": "Data Exports",
  "Raw MRV Data": "Raw MRV Data",
  "Verification Logs": "Verification Logs",
  "LGD Database Directory & National Gateway Sync": "LGD Database Directory & National Gateway Sync",
  "Sovereign-grade directory of India\'s local governments. Keep local bodies, blocks, and district registries up-to-date.": "Sovereign-grade directory of India\'s local governments. Keep local bodies, blocks, and district registries up-to-date.",
  "Synchronizing Datasets...": "Synchronizing Datasets...",
  "Trigger LGD Sync": "Trigger LGD Sync",
  "Sync Status": "Sync Status",
  "States Indexed": "States Indexed",
  "Districts Populated": "Districts Populated",
  "Last Synchronized": "Last Synchronized",
  "Registry Explorer": "Registry Explorer",
  "LGD Code": "LGD Code",
  "Select Sub-District / Block": "Select Sub-District / Block",
  "Sovereign Trust Rail info": "Sovereign Trust Rail info",
  "LGD profiles are stored securely in local state memory. Any changes to local administrative boundaries automatically broadcast telemetry hashes to Hedera Consensus Service.": "LGD profiles are stored securely in local state memory. Any changes to local administrative boundaries automatically broadcast telemetry hashes to Hedera Consensus Service.",
  "Sovereign Local Bodies List": "Sovereign Local Bodies List",
  "Items": "Items",
  "Local Body Name": "Local Body Name",
  "No Local Bodies Selected": "No Local Bodies Selected",
  "Select a State, District, and Sub-district on the left sidebar to explore the fully synchronized administrative local bodies.": "Select a State, District, and Sub-district on the left sidebar to explore the fully synchronized administrative local bodies.",
  "Go to Dashboard": "डैशबोर्ड पर जाएं",
  "Upload Waste Data": "कचरा डेटा अपलोड करें",
  "View Task Board": "कार्य बोर्ड देखें",
  "View History": "इतिहास देखें",
  "Admin Controls": "प्रशासन नियंत्रण",
  "CCTS Market": "CCTS बाजार",
  "Offset Projects": "ऑफसेट परियोजनाएं",
  "Operations Hub": "संचालन हब",
  "Enterprise OS & CPCB Hub": "एंटरप्राइज OS और CPCB हब",
  "Operations Control Center": "संचालन नियंत्रण केंद्र",
  "CCTS Carbon Market": "CCTS कार्बन बाजार",
  "Hedera HCS Open Source Ledger": "हेडेरा HCS ओपन सोर्स लेजर",
  "Enterprise MRV Suite 3.0": "एंटरप्राइज MRV सूट 3.0",
  "Database connection is not configured. System is running in local mode.": "Database connection is not configured. System is running in local mode.",
  "Total Waste Diverted": "कुल कचरा डाइवर्ट किया गया",
  "CO₂e Avoided": "CO₂e बचाया गया",
  "EPR Compliance Rate": "EPR अनुपालन दर",
  "Active Recycling SLAs": "सक्रिय रीसाइक्लिंग SLA",
  "Active Recycling Partner Contracts": "सक्रिय रीसाइक्लिंग पार्टनर अनुबंध",
  "EPR Compliant": "EPR Compliant",
  "No contracts registered today": "No contracts registered today",
  "Contract ID": "Contract ID",
  "Waste Categories": "Waste Categories",
  "Min SLA Volume": "Min SLA Volume",
  "Pricing Agreement": "Pricing Agreement",
  "Duration / Ends": "Duration / Ends",
  "Blockchain Hash": "Blockchain Hash",
  "Verified Proof Available": "Verified Proof Available",
  "Recurring Pickup Planner": "Recurring Pickup Planner",
  "Waste Category": "Waste Category",
  "Organic / Wet Waste": "जैविक / गीला कचरा",
  "Plastics & Polymers": "प्लास्टिक और पॉलिमर",
  "Paper, Cardboard & Dry": "कागज, गत्ता और सूखा",
  "Industrial Hazardous": "औद्योगिक खतरनाक कचरा",
  "Crop Biomass": "फसल बायोमास",
  "Est. Weight (kg)": "Est. Weight (kg)",
  "Frequency": "Frequency",
  "Daily": "दैनिक",
  "Weekly": "साप्ताहिक",
  "Fortnightly": "पाक्षिक",
  "Monthly": "मासिक",
  "Target Day": "Target Day",
  "Contact Person": "Contact Person",
  "Scheduling...": "Scheduling...",
  "Register Pickup Routine": "Register Pickup Routine",
  "Recurring Logistics & Upcoming Pickups": "Recurring Logistics & Upcoming Pickups",
  "Day": "Day",
  "Assigned Vehicle": "Assigned Vehicle",
  "Volume": "Volume",
  "No repetitive routines configured yet.": "No repetitive routines configured yet.",
  "Auto Routing": "Auto Routing",
  "EPR Tracking & Compliance Vault": "EPR Tracking & Compliance Vault",
  "Audit Trail": "Audit Trail",
  "Clear compliance records. Audit passed.": "Clear compliance records. Audit passed.",
  "Verified on": "Verified on",
  "by": "by",
  "ESG Climate & Carbon Reporting Tool": "ESG Climate & Carbon Reporting Tool",
  "Download Audited Corporate Circular Net Report": "Download Audited Corporate Circular Net Report",
  "Generate and download an officially certified corporate ESG PDF statement containing real time blockchain reference timestamps for Scope 3 emissions deduction.": "Generate and download an officially certified corporate ESG PDF statement containing real time blockchain reference timestamps for Scope 3 emissions deduction.",
  "a": "a",
  "Export Standard ESG Report": "Export Standard ESG Report",
  "Live Database Connected": "Live Database Connected",
  "In-Memory Mode": "In-Memory Mode",
  "Citizens / Domestic": "Citizens / Domestic",
  "MRV Verified CO₂e Avoided": "MRV Verified CO₂e Avoided",
  "Methane Emission Prevention": "मीथेन उत्सर्जन रोकथाम",
  "Verified Landfill Diversion": "सत्यापित लैंडफिल विचलन",
  "Immutable Registry Anchors": "Immutable Registry Anchors",
  "MRV Confidence & Trust": "MRV Confidence & Trust",
  "Verification Score": "Verification Score",
  "No waste data available yet.": "No waste data available yet.",
  "No portfolio data available yet.": "No portfolio data available yet.",
  "Fast AI Auto-fill": "Fast AI Auto-fill",
  "Auto-fill": "Auto-fill",
  "Crop Type (For Biomass)": "Crop Type (For Biomass)",
  "Estimate Biomass": "Estimate Biomass",
  "Tap to Capture Image": "Tap to Capture Image",
  "Uses mobile camera if available": "Uses mobile camera if available",
  "Retake Photo": "Retake Photo",
  "AI Biomass Verification Playground": "AI Biomass Verification Playground",
  "Interactive Engine": "Interactive Engine",
  "Simulate how our decentralized Rupay AI verification engine evaluates your material stream parameters in real-time based on selected weight, category, and visual properties.": "Simulate how our decentralized Rupay AI verification engine evaluates your material stream parameters in real-time based on selected weight, category, and visual properties.",
  "Please enter a valid weight in kg first.": "Please enter a valid weight in kg first.",
  "Run Live AI Verification Simulation": "Run Live AI Verification Simulation",
  "Confirm Intake & Generate Evidence": "Confirm Intake & Generate Evidence",
  "Satellite": "Satellite",
  "Unverified": "Unverified",
  "Anomaly": "Anomaly",
  "View W3C VC": "View W3C VC",
  "AI Verification Assessment": "AI Verification Assessment",
  "Satellite Verification": "Satellite Verification",
  "Land Cover": "Land Cover",
  "Confidence": "Confidence",
  "Anomalies detected in this area": "Anomalies detected in this area",
  "AI Risk Assessment": "AI Risk Assessment",
  "Waste & Payment Config": "Waste & Payment Config",
  "Fraud Alerts": "धोखाधड़ी चेतावनी",
  "DPI Integrations": "DPI एकीकरण",
  "State Filter": "राज्य फ़िल्टर",
  "District Filter": "ज़िला फ़िल्टर",
  "Sub-District Filter": "उप-ज़िला फ़िल्टर",
  "GP / Ward Filter": "ग्राम पंचायत / वार्ड फ़िल्टर",
  "No trend data available yet.": "No trend data available yet.",
  "Verified MRV Volume": "Verified MRV Volume",
  "View Blockchain Proof": "View Blockchain Proof",
  "Waste & Payment Configuration": "Waste & Payment Configuration",
  "Save Configuration": "कॉन्फ़िगरेशन सहेजें",
  "Global Payment Settings": "Global Payment Settings",
  "CCC Price (₹ per kg CO2)": "CCC Price (₹ per kg CO2)",
  "Global multiplier for CCC offset value.": "Global multiplier for CCC offset value.",
  "Logistics Margin (%)": "Logistics Margin (%)",
  "Percentage of total value allocated to aggregators.": "Percentage of total value allocated to aggregators.",
  "Base Value (₹/kg)": "Base Value (₹/kg)",
  "CCC Offset (kg CO2/kg)": "CCC Offset (kg CO2/kg)",
  "Fraud Detection Dashboard": "धोखाधड़ी पहचान डैशबोर्ड",
  "Total Flagged": "Total Flagged",
  "GPS Mismatches": "GPS Mismatches",
  "AI Rejected": "AI Rejected",
  "Reason": "Reason",
  "No fraud alerts detected.": "No fraud alerts detected.",
  "AgriStack Verifications": "एग्रीस्टैक सत्यापन",
  "Live synchronization with the national AgriStack database for farmer identity and land parcel verification.": "Live synchronization with the national AgriStack database for farmer identity and land parcel verification.",
  "Verification ID": "Verification ID",
  "Farmer Name": "Farmer Name",
  "Land Parcel": "Land Parcel",
  "No AgriStack data available.": "No AgriStack data available.",
  "ONDC Marketplace Listings": "ONDC मार्केटप्लेस सूचियां",
  "Listing ID": "Listing ID",
  "Material": "Material",
  "Quantity": "Quantity",
  "No ONDC listings available.": "No ONDC listings available.",
  "Enter your full name": "Enter your full name",
  "Enter organization name": "Enter organization name",
  "Enter district": "Enter district",
  "Enter state": "Enter state",
  "Issuance authority remains regulator-controlled. RupayKg generates registry-ready MRV data but does not independently issue CCCs. All CCCs must be event-traceable, registry-compatible, and align with national CCC governance frameworks.": "Issuance authority remains regulator-controlled. RupayKg generates registry-ready MRV data but does not independently issue CCCs. All CCCs must be event-traceable, registry-compatible, and align with national CCC governance frameworks.",
  "\"India’s Unified Waste-to-CCC Infrastructure Layer for the Compliance CCC Era.\"": "\"India’s Unified Waste-to-CCC Infrastructure Layer for the Compliance CCC Era.\"",
  "VIII. Digital Carbon MRV Doctrine": "VIII. Digital Carbon MRV Doctrine",
  "The platform operates a Digital MRV (Measurement, Reporting, and Verification) engine where every physical waste event automatically triggers a corresponding Carbon Lifecycle Event. Net emission reductions are calculated based on landfill methane avoidance, biomass substitution, and transport optimization, ensuring that every kilogram of waste and its climate value are immutably linked and audit-ready for national registries.": "The platform operates a Digital MRV (Measurement, Reporting, and Verification) engine where every physical waste event automatically triggers a corresponding Carbon Lifecycle Event. Net emission reductions are calculated based on landfill methane avoidance, biomass substitution, and transport optimization, ensuring that every kilogram of waste and its climate value are immutably linked and audit-ready for national registries.",
  "Founder's Note": "Founder's Note",
  "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, and Carbon Certificate (CCC) issuance. Double counting is explicitly prohibited through cryptographic Environmental Trust scores.": "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, and Carbon Certificate (CCC) issuance. Double counting is explicitly prohibited through cryptographic Environmental Trust scores.",
  "Issuance authority shall remain under regulator control. RupayKg serves as the digital evidence layer.": "Issuance authority shall remain under regulator control. RupayKg serves as the digital evidence layer.",
  "Article VII — Digital Carbon MRV": "Article VII — Digital Carbon MRV",
  "Every waste transaction must generate a carbon event ID with timestamp, stakeholder chain, and emission reduction estimate for sovereign auditability.": "Every waste transaction must generate a carbon event ID with timestamp, stakeholder chain, and emission reduction estimate for sovereign auditability.",
  "RupayKg is hereby defined as: India\'s Circular Economy Operating System, a unified digital platform integrating Waste Management, Digital MRV, and Carbon Accounting under a single national architecture.": "RupayKg is hereby defined as: India\'s Circular Economy Operating System, a unified digital platform integrating Waste Management, Digital MRV, and Carbon Accounting under a single national architecture.",
  "Verifiable Hedera Consensus Service (HCS) record of all MRV verification events": "Verifiable Hedera Consensus Service (HCS) record of all MRV verification events",
  "Chain Integrity Verified": "Chain Integrity Verified",
  "Chain Integrity Compromised": "Chain Integrity Compromised",
  "Public Ledger Explorer": "Public Ledger Explorer",
  "Hedera Guardian Policy Portal": "Hedera Guardian Policy Portal",
  "No blockchain records found.": "No blockchain records found.",
  "Block Hash": "Block Hash",
  "Previous Hash": "Previous Hash",
  "Transaction Data": "Transaction Data",
  "Protocol": "Protocol",
  "HCS Topic ID": "HCS Topic ID",
  "Type / Record": "Type / Record",
  "User / Generator": "User / Generator",
  "Waste / To": "Waste / To",
  "Amount / CCC": "Amount / CCC",
  "Registry ID": "Registry ID",
  "Guardian HCS Ledger AI Interface": "Guardian HCS Ledger AI Interface",
  "Query the Hedera Consensus Service topic the configured directly using natural language.": "Query the Hedera Consensus Service topic the configured directly using natural language.",
  "Example: How many carbon units are anchored in total?": "Example: How many carbon units are anchored in total?",
  "Query Ledger": "Query Ledger",
  "Guardian AI Response": "Guardian AI Response",
  "Not Initialized": "Not Initialized",
  "Compiled Policies": "Compiled Policies",
  "Secured Audits": "Secured Audits",
  "Hedera Guardian 4-Tier Node Architecture": "Hedera Guardian 4-Tier Node Architecture",
  "Decentralized digital MRV pipeline of India’s Circular Economy Operating System": "Decentralized digital MRV pipeline of India’s Circular Economy Operating System",
  "Phase 1: Setup Standard Registry (SR) Identity": "Phase 1: Setup Standard Registry (SR) Identity",
  "Generate Node DID & Auth Presentation": "Generate Node DID & Auth Presentation",
  "Phase 2: Import Sustainability Methodology Policies": "Phase 2: Import Sustainability Methodology Policies",
  "Upload & Validate Custom .Policy Schema": "Upload & Validate Custom .Policy Schema",
  "Phase 3: Automated dMRV Submission & Audit Trail": "Phase 3: Automated dMRV Submission & Audit Trail",
  "Validate dMRV & Register on HCS": "Validate dMRV & Register on HCS",
  "Verifiable Environment Credentials Audit Log": "Verifiable Environment Credentials Audit Log",
  "W3C Verifiable Credential 2.0": "W3C Verifiable Credential 2.0",
  "Interoperable Sovereign-Grade Compliance Object (JSON-LD)": "Interoperable Sovereign-Grade Compliance Object (JSON-LD)",
  "Guardian AI Analysis": "Guardian AI Analysis",
  "Run ESG Methodology Alignment Check": "Run ESG Methodology Alignment Check",
  "Raw VC JSON-LD Content": "Raw VC JSON-LD Content",
  "ISO 14064-3 Verifiable": "ISO 14064-3 Verifiable",
  "Download JSON-LD": "Download JSON-LD",
  "Sorry, I could not generate a response.": "Sorry, I could not generate a response.",
  "Genesis Whitepaper": "Genesis Whitepaper",
  "Foundational Structure & Operating Doctrine": "Foundational Structure & Operating Doctrine",
  "Introduction": "Introduction",
  "Unified Operating System Model": "Unified Operating System Model",
  "All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.": "All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.",
  "Unified Stakeholder Architecture": "Unified Stakeholder Architecture",
  "CCC Origination": "CCC Origination",
  "Multi-Rail Architecture": "Multi-Rail Architecture",
  "Regulator Sovereignty": "Regulator Sovereignty",
  "Strategic Position": "Strategic Position",
  "India’s Unified Waste-to-CCC Infrastructure Layer for the Compliance CCC Era.": "India’s Unified Waste-to-CCC Infrastructure Layer for the Compliance CCC Era.",
  "Founder, RupayKg": "Founder, RupayKg",
  "T": "T",
  "Failed to digitize": "Failed to digitize",
  "ENG_001', 'Dr. Suresh R. Mehta', 'ACM0022 Composting metrics strictly conform with CCTS registry standards.": "ENG_001', 'Dr. Suresh R. Mehta', 'ACM0022 Composting metrics strictly conform with CCTS registry standards."} },
  bn: { translation: {
  "Dashboard": "ড্যাশবোর্ড",
  "Upload Waste": "বর্জ্য আপলোড করুন",
  "Task Board": "টাস্ক বোর্ড",
  "History": "ইতিহাস",
  "MRV Dashboard": "MRV ড্যাশবোর্ড",
  "National KPI": "জাতীয় KPI",
  "CCC Market": "কার্বন মার্কেট",
  "Genesis": "জেনেসিস",
  "Settings": "সেটিংস",
  "Logout": "লগআউট",
  "System Overview": "সিস্টেম ওভারভিউ",
  "Welcome back": "ফিরে আসার জন্য স্বাগতম",
  "Language": "ভাষা",
  "English": "ইংরেজি",
  "Hindi": "হিন্দি",
  "CCC Offset": "কার্বন অফসেট",
  "Total Earnings": "মোট উপার্জন",
  "Community Rank": "কমিউনিটি র‍্যাঙ্ক",
  "Total Collected": "মোট সংগৃহীত",
  "Farmers Registered": "নিবন্ধিত কৃষক",
  "Logistics Margin": "লজিস্টিক মার্জিন",
  "Fleet Efficiency": "বহরের দক্ষতা",
  "Total Processed": "মোট প্রক্রিয়াজাত",
  "CCCs": "কার্বন ক্রেডিট",
  "Value Generated": "উৎপন্ন মূল্য",
  "Processing Yield": "প্রসেসিং ফলন",
  "Total Investment": "মোট বিনিয়োগ",
  "ESG Score": "ESG স্কোর",
  "Platform Statistics": "প্ল্যাটফর্ম পরিসংখ্যান",
  "Seed Demo Data": "ডেমো ডেটা সিড করুন",
  "Reset Demo Data": "ডেমো ডেটা রিসেট করুন",
  "Total Users": "মোট ব্যবহারকারী",
  "Total Weight": "মোট ওজন",
  "CCCs Generated": "কার্বন হ্রাস",
  "Total Value": "মোট মূল্য",
  "Waste Distribution": "বর্জ্য বিতরণ",
  "Recent Activity": "সাম্প্রতিক কার্যকলাপ",
  "Performance Analytics": "পারফরম্যান্স অ্যানালিটিক্স",
  "Register New Farmer": "নতুন কৃষক নিবন্ধন করুন",
  "New Collection Record": "নতুন সংগ্রহের রেকর্ড",
  "New Processing Record": "নতুন প্রসেসিং রেকর্ড",
  "New Intake Record": "নতুন ইনটেক রেকর্ড",
  "Full Name": "পুরো নাম",
  "Mobile Number": "মোবাইল নম্বর",
  "Land Area (Acres)": "জমির পরিমাণ (একর)",
  "Crop Type": "ফসলের ধরন",
  "Farm Location": "খামারের অবস্থান",
  "Latitude": "অক্ষাংশ",
  "Longitude": "দ্রাঘিমাংশ",
  "Get Current Location": "বর্তমান অবস্থান পান",
  "Registering...": "নিবন্ধন করা হচ্ছে...",
  "Register Farmer": "কৃষক নিবন্ধন করুন",
  "Transaction Ledger": "লেনদেন লেজার",
  "All": "সব",
  "Pending Pickup": "পিকআপ পেন্ডিং",
  "In Transit": "ট্রানজিটে",
  "Processed": "প্রক্রিয়াজাত",
  "Operations Management": "অপারেশন ম্যানেজমেন্ট",
  "Foundational Doctrine": "ভিত্তিগত মতবাদ",
  "Account Settings": "অ্যাকাউন্ট সেটিংস",
  "Weight (kg)": "ওজন (কেজি)",
  "Waste Type": "বর্জ্যের ধরন",
  "Location Confirmation (Google Maps)": "অবস্থান নিশ্চিতকরণ (গুগল ম্যাপস)",
  "Estimated Value Breakdown": "আনুমানিক মূল্যের বিবরণ",
  "Base Value (Recycler)": "বেস ভ্যালু (রিসাইক্লার)",
  "CCC Value": "কার্বন ক্রেডিট ভ্যালু",
  "Total Sovereign Value": "মোট সার্বভৌম মূল্য",
  "Verification Image": "যাচাইকরণ চিত্র",
  "Processing...": "প্রক্রিয়াকরণ হচ্ছে...",
  "Confirm Intake & Mint Value": "ইনটেক নিশ্চিত করুন এবং ভ্যালু মিন্ট করুন",
  "Intake": "ইনটেক",
  "Features": "বৈশিষ্ট্য",
  "How it Works": "এটি যেভাবে কাজ করে",
  "Ecosystem Roles": "ইকোসিস্টেম ভূমিকা",
  "Launch OS": "OS লঞ্চ করুন",
  "Sovereign-Grade Circular Economy Engine": "সার্বভৌম-গ্রেড সার্কুলার ইকোনমি ইঞ্জিন",
  "Convert Every Kilogram of Waste into": "প্রতি কিলোগ্রাম বর্জ্যকে রূপান্তর করুন",
  "Global Circular Value": "গ্লোবাল সার্কুলার ভ্যালু",
  "RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.": "RupayKg হল সার্কুলার ইকোনমি অপারেটিং সিস্টেম যা সম্প্রদায়গুলিকে একটি মাল্টি-রেল ভ্যালু ইঞ্জিনের মাধ্যমে কৃষি, পৌর এবং শিল্প বর্জ্য নগদীকরণ করতে সক্ষম করে।",
  "Access the OS": "OS অ্যাক্সেস করুন",
  "Read Whitepaper": "হোয়াইটপেপার পড়ুন",
  "Multi-Rail Value Engine": "মাল্টি-রেল ভ্যালু ইঞ্জিন",
  "Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.": "প্রক্রিয়াজাত প্রতি কিলোগ্রাম বায়োমাসের জন্য রিসাইক্লার, CSR, মিউনিসিপ্যাল, CCC এবং EPR রেল থেকে একযোগে মূল্য আহরণ করুন।",
  "AI-Verified Intake": "AI-যাচাইকৃত ইনটেক",
  "Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.": "বর্জ্যের ধরন, ওজন এবং ভূ-অবস্থানের স্বয়ংক্রিয় যাচাইকরণ অপরিবর্তনীয়, সার্বভৌম-গ্রেড ডেটা অখণ্ডতা নিশ্চিত করে।",
  "Rural Wealth Creation": "গ্রামীণ সম্পদ সৃষ্টি",
  "Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.": "সরাসরি নাগরিক ওয়ালেটে তহবিল বিতরণ করুন, পরিবেশগত দায়বদ্ধতাকে স্থানীয় অর্থনৈতিক বৃদ্ধিতে রূপান্তরিত করুন।",
  "Live Network Impact": "লাইভ নেটওয়ার্ক প্রভাব",
  "Real-time waste throughput across the RupayKg OS": "RupayKg OS জুড়ে রিয়েল-টাইম বর্জ্য থ্রুপুট",
  "Live Stream": "লাইভ স্ট্রিম",
  "Active Nodes": "সক্রিয় নোড",
  "Value Minted": "মিন্ট করা মূল্য",
  "Network Topology": "নেটওয়ার্ক টপোলজি",
  "Distributed biomass collection nodes": "বিতরণ করা বায়োমাস সংগ্রহ নোড",
  "nodes": "নোড",
  "A seamless pipeline from waste generation to value realization.": "বর্জ্য উৎপাদন থেকে মূল্য উপলব্ধি পর্যন্ত একটি নিরবচ্ছিন্ন পাইপলাইন।",
  "Generate": "তৈরি করুন",
  "Citizens collect agricultural, municipal, or industrial waste.": "নাগরিকরা কৃষি, পৌর বা শিল্প বর্জ্য সংগ্রহ করে।",
  "Aggregate": "একত্রিত করুন",
  "Aggregators verify, weigh, and transport waste to facilities.": "অ্যাগ্রিগেটররা বর্জ্য যাচাই করে, ওজন করে এবং সুবিধায় পরিবহন করে।",
  "Process": "প্রক্রিয়া",
  "Recyclers convert waste into usable materials or energy.": "রিসাইক্লাররা বর্জ্যকে ব্যবহারযোগ্য উপকরণ বা শক্তিতে রূপান্তর করে।",
  "Mint Value": "ভ্যালু মিন্ট করুন",
  "Smart contracts distribute funds across all 5 value rails.": "স্মার্ট কন্ট্রাক্ট সমস্ত ৫টি ভ্যালু রেল জুড়ে তহবিল বিতরণ করে।",
  "Choose your part in the circular economy.": "সার্কুলার ইকোনমিতে আপনার অংশ বেছে নিন।",
  "Citizen": "নাগরিক",
  "Waste Generator": "বর্জ্য উৎপাদনকারী",
  "Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.": "কৃষি, পৌর বা শিল্প বর্জ্য সংগ্রহ এবং জমা দিন। প্রদত্ত বর্জ্যের ওজন এবং প্রকারের উপর ভিত্তি করে সরাসরি ওয়ালেট ডিপোজিট উপার্জন করুন।",
  "Upload waste records": "বর্জ্য রেকর্ড আপলোড করুন",
  "Instant wallet funding": "তাত্ক্ষণিক ওয়ালেট ফান্ডিং",
  "Track environmental impact": "পরিবেশগত প্রভাব ট্র্যাক করুন",
  "Aggregator": "অ্যাগ্রিগেটর",
  "Collection & Transport": "সংগ্রহ এবং পরিবহন",
  "Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.": "নাগরিক আমানত যাচাই করুন, বর্জ্য একত্রিত করুন এবং প্রক্রিয়াকরণ সুবিধায় উপকরণ পরিবহনের জন্য লজিস্টিক পরিচালনা করুন।",
  "Log collection batches": "সংগ্রহের ব্যাচ লগ করুন",
  "Earn logistics margins": "লজিস্টিক মার্জিন উপার্জন করুন",
  "Route optimization data": "রুট অপ্টিমাইজেশান ডেটা",
  "Recycler": "রিসাইক্লার",
  "Processor": "প্রসেসর",
  "Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.": "একত্রিত বর্জ্য গ্রহণ করুন এবং এটি শেষ পণ্যে প্রক্রিয়াজাত করুন। সমস্ত রেল জুড়ে চূড়ান্ত মূল্য উপলব্ধি ট্রিগার করুন।",
  "Log processing yields": "প্রসেসিং ফলন লগ করুন",
  "Access CSR/EPR funds": "CSR/EPR ফান্ড অ্যাক্সেস করুন",
  "Generate CCCs": "কার্বন ক্রেডিট তৈরি করুন",
  "Circular Economy Operating System": "সার্কুলার ইকোনমি অপারেটিং সিস্টেম",
  "Context:": "প্রসঙ্গ:",
  "Login": "লগইন",
  "Register": "নিবন্ধন",
  "Account Type": "অ্যাকাউন্টের ধরন",
  "Organization Name": "সংস্থার নাম",
  "District": "জেলা",
  "State": "রাজ্য",
  "Phone Number": "ফোন নম্বর",
  "Password": "পাসওয়ার্ড",
  "Access OS": "OS অ্যাক্সেস করুন",
  "Create Account": "অ্যাকাউন্ট তৈরি করুন",
  "Quick Demo Access": "দ্রুত ডেমো অ্যাক্সেস",
  "Back to Home": "হোমে ফিরে যান",
  "System Audit Logs": "সিস্টেম অডিট লগ",
  "Global Impact Map": "গ্লোবাল ইমপ্যাক্ট ম্যাপ",
  "Submission Heatmap": "সাবমিশন হিটম্যাপ",
  "Total Offset": "মোট অফসেট",
  "Farmers Supported": "সমর্থিত কৃষক",
  "Waste Diverted": "ডাইভার্ট করা বর্জ্য",
  "Portfolio Composition": "পোর্টফোলিও কম্পোজিশন",
  "Impact Distribution": "প্রভাব বিতরণ",
  "MRV Verification Dashboard": "MRV যাচাইকরণ ড্যাশবোর্ড",
  "Verify processed waste records to issue CCCs.": "কার্বন ক্রেডিট ইস্যু করার জন্য প্রক্রিয়াজাত বর্জ্য রেকর্ড যাচাই করুন।",
  "Pending": "পেন্ডিং",
  "No pending MRV records": "কোনো পেন্ডিং MRV রেকর্ড নেই",
  "All processed waste has been verified.": "সমস্ত প্রক্রিয়াজাত বর্জ্য যাচাই করা হয়েছে।",
  "CCC Reduction": "CCC হ্রাস",
  "Credit Value": "ক্রেডিট ভ্যালু",
  "Acreage": "একর",
  "AI Risk Score": "AI রিস্ক স্কোর",
  "Location Verification": "অবস্থান যাচাইকরণ",
  "Verify & Issue Credits": "যাচাই করুন এবং ক্রেডিট ইস্যু করুন",
  "Reject": "প্রত্যাখ্যান",
  "Purchase verified CCCs to offset your footprint.": "আপনার ফুটপ্রিন্ট অফসেট করতে যাচাইকৃত কার্বন ক্রেডিট ক্রয় করুন।",
  "Available Credits": "উপলব্ধ ক্রেডিট",
  "Price per Tonne": "প্রতি টন মূল্য",
  "Your Offset Balance": "আপনার অফসেট ব্যালেন্স",
  "Purchase Credits": "ক্রেডিট ক্রয় করুন",
  "Amount to Purchase (Tonnes)": "ক্রয়ের পরিমাণ (টন)",
  "Total Cost": "মোট খরচ",
  "Confirm Purchase": "ক্রয় নিশ্চিত করুন",
  "Cancel": "বাতিল",
  "Recent Transactions": "সাম্প্রতিক লেনদেন",
  "Project": "প্রকল্প",
  "Amount": "পরিমাণ",
  "Price": "মূল্য",
  "Date": "তারিখ",
  "Status": "স্থিতি",
  "Network Active": "নেটওয়ার্ক সক্রিয়",
  "National Dashboard": "জাতীয় ড্যাশবোর্ড",
  "Municipal Corporation": "পৌরসভা কর্পোরেশন",
  "Ward": "ওয়ার্ড",
  "MSW": "MSW",
  "Ward Analytics": "ওয়ার্ড অ্যানালিটিক্স",
  "Ward-Level Analytics": "ওয়ার্ড-স্তরের অ্যানালিটিক্স",
  "Citizen (MSW Generator)": "নাগরিক (MSW জেনারেটর)",
  "Gram Panchayat": "গ্রাম পঞ্চায়েত",
  "Village": "গ্রাম",
  "Biomass": "বায়োমাস",
  "Village Analytics": "গ্রাম অ্যানালিটিক্স",
  "Village-Level Analytics": "গ্রাম-স্তরের অ্যানালিটিক্স",
  "Farmer / FPO (Biomass Generator)": "কৃষক / FPO (বায়োমাস জেনারেটর)",
  "All Roles": "সমস্ত ভূমিকা",
  "Citizens": "নাগরিক",
  "Farmers / FPOs": "কৃষক / FPO",
  "Aggregators": "অ্যাগ্রিগেটর",
  "Processors": "প্রসেসর",
  "CSR Partners": "CSR পার্টনার",
  "EPR Partners": "EPR পার্টনার",
  "CCC Buyers": "কার্বন ক্রেতা",
  "Diverted": "ডাইভার্ট করা",
  "Fraud Alerts & Flagged Events": "প্রতারণা সতর্কতা এবং ফ্ল্যাগ করা ইভেন্ট",
  "CCC Pool Status": "কার্বন পুল স্থিতি",
  "User Management": "ব্যবহারকারী ব্যবস্থাপনা",
  "Audit Logs": "অডিট লগ",
  "Total Waste Events": "মোট বর্জ্য ইভেন্ট",
  "Processed Events": "প্রক্রিয়াজাত ইভেন্ট",
  "Wallet Disbursed": "ওয়ালেট বিতরণ করা হয়েছে",
  "Growth & Impact Trends": "বৃদ্ধি এবং প্রভাবের প্রবণতা",
  "Environmental Impact": "পরিবেশগত প্রভাব",
  "Methane Avoided": "মিথেন এড়ানো",
  "Water Saved": "জল সাশ্রয়",
  "Trees Equivalent": "গাছের সমতুল্য",
  "Trees": "গাছ",
  "Economic Efficiency": "অর্থনৈতিক দক্ষতা",
  "Avg Price / kg": "গড় মূল্য / কেজি",
  "Govt Cost Savings": "সরকারি খরচ সাশ্রয়",
  "* Government savings calculated based on avoided landfill management and environmental remediation costs.": "* ল্যান্ডফিল ম্যানেজমেন্ট এবং পরিবেশগত প্রতিকার খরচ এড়ানোর ভিত্তিতে সরকারি সাশ্রয় গণনা করা হয়েছে।",
  "Operational Health": "অপারেশনাল হেলথ",
  "Processing Efficiency": "প্রক্রিয়াকরণ দক্ষতা",
  "MRV Rejection Rate": "MRV প্রত্যাখ্যান হার",
  "Waste Composition": "বর্জ্য গঠন",
  "No flagged events detected.": "কোনো ফ্ল্যাগ করা ইভেন্ট সনাক্ত করা যায়নি।",
  "Geospatial Fraud Distribution": "ভূ-স্থানিক প্রতারণা বিতরণ",
  "Total Minted CCC Units": "মোট মিন্ট করা কার্বন ইউনিট",
  "User": "ব্যবহারকারী",
  "Role": "ভূমিকা",
  "Location": "অবস্থান",
  "Wallet": "ওয়ালেট",
  "Actions": "অ্যাকশন",
  "Regulator": "নিয়ন্ত্রক",
  "Municipal Admin": "পৌরসভা অ্যাডমিন",
  "State Admin": "রাজ্য অ্যাডমিন",
  "Super Admin": "সুপার অ্যাডমিন",
  "CSR Partner": "CSR পার্টনার",
  "EPR Partner": "EPR পার্টনার",
  "CCC Buyer": "কার্বন ক্রেতা",
  "Delete User": "ব্যবহারকারী মুছুন",
  "No users found.": "কোনো ব্যবহারকারী পাওয়া যায়নি।",
  "Action": "অ্যাকশন",
  "User ID": "ব্যবহারকারী আইডি",
  "No audit logs available.": "কোনো অডিট লগ উপলব্ধ নেই।",
  "Total Waste": "মোট বর্জ্য",
  "Total Events": "মোট ইভেন্ট",
  "No ward data available.": "কোনো ওয়ার্ড ডেটা উপলব্ধ নেই।",
  "Add ₹10,000": "₹১০,০০০ যোগ করুন",
  "Saving...": "সংরক্ষণ করা হচ্ছে...",
  "Save Changes": "পরিবর্তনগুলি সংরক্ষণ করুন",
  "Notification Preferences": "বিজ্ঞপ্তি পছন্দ",
  "Email Notifications": "ইমেল বিজ্ঞপ্তি",
  "Receive updates about your transactions via email.": "ইমেলের মাধ্যমে আপনার লেনদেন সম্পর্কে আপডেট পান।",
  "SMS Alerts": "SMS সতর্কতা",
  "Get instant SMS alerts for critical updates.": "গুরুত্বপূর্ণ আপডেটের জন্য তাত্ক্ষণিক SMS সতর্কতা পান।",
  "Push Notifications": "পুশ বিজ্ঞপ্তি",
  "Enable browser push notifications.": "ব্রাউজার পুশ বিজ্ঞপ্তি সক্ষম করুন।",
  "Currently Active: ": "বর্তমানে সক্রিয়: ",
  " Context (": " প্রসঙ্গ (",
  "GENESIS": "জেনেসিস",
  "Weight: ": "ওজন: ",
  "Village: ": "গ্রাম: ",
  "Value: ": "মান: ",
  "FRAUD ALERT": "প্রতারণা সতর্কতা",
  "Type: ": "ধরন: ",
  "How the Engine Works": "ইঞ্জিন যেভাবে কাজ করে",
  "© 2026 RupayKg Circular Economy OS. All rights reserved.": "© ২০২৬ RupayKg সার্কুলার ইকোনমি OS। সর্বস্বত্ব সংরক্ষিত।",
  "Privacy": "গোপনীয়তা",
  "Terms": "শর্তাবলী",
  "RUPAYKG": "RUPAYKG",
  "urban": "শহুরে",
  "rural": "গ্রামীণ",
  "Aggregator (Collection & Transport)": "অ্যাগ্রিগেটর (সংগ্রহ ও পরিবহন)",
  "Processor (Recycler)": "প্রসেসর (রিসাইক্লার)",
  "Admin": "অ্যাডমিন",
  "National Regulator": "জাতীয় নিয়ন্ত্রক",
  "Farmer": "কৃষক",
  "Wallet Balance": "ওয়ালেট ব্যালেন্স",
  "Database Connection Failed": "ডেটাবেস সংযোগ ব্যর্থ হয়েছে",
  "No records found": "কোনো রেকর্ড পাওয়া যায়নি",
  "No audit logs found": "কোনো অডিট লগ পাওয়া যায়নি",
  "Circular Economy Intake Form": "সার্কুলার ইকোনমি ইনটেক ফর্ম",
  "Acreage (acres)": "একর (একর)",
  "Name": "নাম",
  "GPS Captured: ": "GPS ক্যাপচার করা হয়েছে: ",
  "Capturing GPS Coordinates...": "GPS স্থানাঙ্ক ক্যাপচার করা হচ্ছে...",
  "GPS Capture Failed": "GPS ক্যাপচার ব্যর্থ হয়েছে",
  "GPS Required": "GPS প্রয়োজন",
  "Retry GPS": "GPS পুনরায় চেষ্টা করুন",
  "Failed to register farmer": "কৃষক নিবন্ধন করতে ব্যর্থ হয়েছে",
  "Farmer registered successfully! ID: ": "কৃষক সফলভাবে নিবন্ধিত হয়েছে! আইডি: ",
  "e.g., Paddy, Wheat": "যেমন: ধান, গম",
  "Failed to get location. Please enter manually.": "অবস্থান পেতে ব্যর্থ হয়েছে। দয়া করে ম্যানুয়ালি প্রবেশ করুন।",
  "Geolocation is not supported by this browser.": "এই ব্রাউজার দ্বারা ভূ-অবস্থান সমর্থিত নয়।",
  "Active Queue": "সক্রিয় সারি",
  "Active Fleet": "সক্রিয় বহর",
  "Drivers Online": "ড্রাইভার অনলাইন",
  "Current Load": "বর্তমান লোড",
  "Total Capacity": "মোট ক্ষমতা",
  "Utilization": "ব্যবহার",
  "Biomass in Stock": "স্টকে থাকা বায়োমাস",
  "Output Material": "আউটপুট উপাদান",
  "Storage Utilization": "স্টোরেজ ব্যবহার",
  "Available for Pickup": "পিকআপের জন্য উপলব্ধ",
  "Incoming for Processing": "প্রক্রিয়াকরণের জন্য আসছে",
  "No new tasks available.": "কোনো নতুন কাজ উপলব্ধ নেই।",
  "Accept Pickup": "পিকআপ গ্রহণ করুন",
  "Accept Receipt": "রসিদ গ্রহণ করুন",
  "Recently Processed": "সম্প্রতি প্রক্রিয়াজাত",
  "No active tasks in your possession.": "আপনার দখলে কোনো সক্রিয় কাজ নেই।",
  "Timestamp": "টাইমস্ট্যাম্প",
  "Type": "ধরন",
  "Weight": "ওজন",
  "Value": "মান",
  "MRV Status": "MRV স্থিতি",
  "No records found for the selected filter.": "নির্বাচিত ফিল্টারের জন্য কোনো রেকর্ড পাওয়া যায়নি।",
  "Pending MRV": "পেন্ডিং MRV",
  "Low": "নিম্ন",
  "Med": "মাঝারি",
  "High": "উচ্চ",
  "Record ID": "রেকর্ড আইডি",
  "Details": "বিস্তারিত",
  "AI Risk": "AI ঝুঁকি",
  "Verified By": "যাচাই করেছেন",
  "No MRV history found": "কোনো MRV ইতিহাস পাওয়া যায়নি",
  "No credits available": "কোনো ক্রেডিট উপলব্ধ নেই",
  "Check back later for newly verified CCCs.": "নতুন যাচাইকৃত কার্বন ক্রেডিটের জন্য পরে আবার দেখুন।",
  "Verified": "যাচাইকৃত",
  "Offset": "অফসেট",
  "Insufficient Funds": "অপর্যাপ্ত তহবিল",
  "Purchase Credit": "ক্রেডিট ক্রয় করুন",
  "Profile Settings": "প্রোফাইল সেটিংস",
  "Profile updated successfully": "প্রোফাইল সফলভাবে আপডেট করা হয়েছে",
  "Failed to update profile": "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে",
  "An error occurred": "একটি ত্রুটি ঘটেছে",
  "The Foundational Structure and Operating Doctrine of RupayKg": "RupayKg-এর ভিত্তিগত কাঠামো এবং অপারেটিং মতবাদ",
  "I. Introduction": "I. ভূমিকা",
  "RupayKg has been established as a Unified Waste-to-CCC Digital Operating System designed to support India’s transition toward a compliance-based CCC market.": "RupayKg একটি ইউনিফাইড ওয়েস্ট-টু-CCC ডিজিটাল অপারেটিং সিস্টেম হিসাবে প্রতিষ্ঠিত হয়েছে যা একটি কমপ্লায়েন্স-ভিত্তিক CCC বাজারের দিকে ভারতের রূপান্তরকে সমর্থন করার জন্য ডিজাইন করা হয়েছে।",
  "The platform addresses a structural gap in India’s CCC ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade CCC supply.": "প্ল্যাটফর্মটি ভারতের কার্বন ইকোসিস্টেমের একটি কাঠামোগত ব্যবধানকে সম্বোধন করে: একটি একীভূত, নিয়ন্ত্রক-সারিবদ্ধ ডিজিটাল পরিকাঠামোর অনুপস্থিতি যা যাচাইকৃত বর্জ্য ডাইভারশনকে কমপ্লায়েন্স-গ্রেড কার্বন সরবরাহে রূপান্তর করতে সক্ষম।",
  "RupayKg is not structured as a project developer, CCC trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.": "RupayKg একটি প্রকল্প বিকাশকারী, কার্বন ব্যবসায়ী বা পুনর্ব্যবহারযোগ্য সত্তা হিসাবে গঠিত নয়। এটি একটি অবকাঠামো স্তর যা স্থাপত্যের অনুলিপি ছাড়াই শহুরে এবং গ্রামীণ প্রশাসনিক কাঠামো জুড়ে কাজ করার জন্য ডিজাইন করা হয়েছে।",
  "II. Unified Operating System Model": "II. ইউনিফাইড অপারেটিং সিস্টেম মডেল",
  "Context": "প্রসঙ্গ",
  "Anchor": "অ্যাঙ্কর",
  "Category": "বিভাগ",
  "Urban": "শহুরে",
  "Municipal Corp + Ward": "পৌর কর্পোরেশন + ওয়ার্ড",
  "Rural": "গ্রামীণ",
  "Gram Panchayat + Village": "গ্রাম পঞ্চায়েত + গ্রাম",
  "* All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.": "* সমস্ত গ্রামীণ কৃষি অবশিষ্টাংশ এবং বায়োমাস কার্যকলাপ বায়োমাসের অধীনে শ্রেণীবদ্ধ করা হয়। কোনো আলাদা কৃষি উল্লম্ব বিদ্যমান নেই।",
  "III. Unified Stakeholder Architecture": "III. ইউনিফাইড স্টেকহোল্ডার আর্কিটেকচার",
  "Administrative Authority": "প্রশাসনিক কর্তৃপক্ষ",
  "Producers (EPR)": "উৎপাদক (EPR)",
  "CSR Contributors": "CSR অবদানকারী",
  "The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.": "অ্যাগ্রিগেটরকে কাঠামোগতভাবে একীভূত সত্তা হিসাবে সংজ্ঞায়িত করা হয় যা সংগ্রহ এবং বাছাই যাচাইকরণের জন্য দায়ী, যা চেইন-অফ-কাস্টডি যাচাইকরণকে সহজ করে।",
  "IV. CCC Origination": "IV. কার্বন উৎপত্তি",
  "Methane avoidance through diversion": "ডাইভারশনের মাধ্যমে মিথেন পরিহার",
  "Biomass-based fossil substitution": "বায়োমাস-ভিত্তিক জীবাশ্ম প্রতিস্থাপন",
  "Recycling substitution": "রিসাইক্লিং প্রতিস্থাপন",
  "V. Multi-Rail Architecture": "V. মাল্টি-রেল আর্কিটেকচার",
  "Recycler Rail": "রিসাইক্লার রেল",
  "CSR Rail": "CSR রেল",
  "EPR Rail": "EPR রেল",
  "Governance Layer": "গভর্নেন্স লেয়ার",
  "CCC Rail": "কার্বন রেল",
  "VI. Regulator Sovereignty": "VI. নিয়ন্ত্রক সার্বভৌমত্ব",
  "CCC issuance authority remains regulator-controlled. RupayKg does not independently mint credits. All credits must be event-traceable, registry-compatible, and align with national CCC governance frameworks.": "CCC ইস্যু করার ক্ষমতা নিয়ন্ত্রক-নিয়ন্ত্রিত থাকে। RupayKg স্বাধীনভাবে ক্রেডিট মিন্ট করে না। সমস্ত ক্রেডিট অবশ্যই ইভেন্ট-ট্রেসযোগ্য, রেজিস্ট্রি-সামঞ্জস্যপূর্ণ এবং জাতীয় কার্বন গভর্নেন্স ফ্রেমওয়ার্কের সাথে সামঞ্জস্যপূর্ণ হতে হবে।",
  "VII. Strategic Position": "VII. কৌশলগত অবস্থান",
  "When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated CCC value?": "যখন আমরা RupayKg তৈরি করতে শুরু করি, তখন আমরা রিসাইক্লিং দিয়ে শুরু করিনি। আমরা একটি কাঠামোগত প্রশ্ন দিয়ে শুরু করেছি: কেন এমন কোনো একীভূত অবকাঠামো নেই যা বর্জ্যকে নিয়ন্ত্রিত কার্বন মূল্যে রূপান্তর করে?",
  "India is entering a compliance CCC era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.": "ভারত একটি কমপ্লায়েন্স কার্বন যুগে প্রবেশ করছে। পৌর ব্যবস্থা পরিমাপযোগ্য মিথেন উৎপন্ন করে। গ্রামীণ বায়োমাস পুড়িয়ে ফেলা হয় বা কম ব্যবহার করা হয়। তবুও সিস্টেমগুলি খণ্ডিত থাকে।",
  "RupayKg was built to unify them. Not as a CCC trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.": "RupayKg তাদের একত্রিত করার জন্য নির্মিত হয়েছিল। কার্বন ব্যবসায়ী হিসেবে নয়। রিসাইক্লিং স্টার্টআপ হিসেবে নয়। বরং একটি একক অপারেটিং সিস্টেম হিসাবে যা কাঠামোগত অনুলিপি ছাড়াই পৌর ওয়ার্ড স্তর এবং গ্রাম পঞ্চায়েত গ্রাম স্তরে কাজ করতে সক্ষম।",
  "Waste is no longer disposal. It is governance-linked climate infrastructure.": "বর্জ্য আর কেবল নিষ্পত্তি নয়। এটি শাসনের সাথে যুক্ত জলবায়ু অবকাঠামো।",
  "— Founder, RupayKg": "— প্রতিষ্ঠাতা, RupayKg",
  "Legally Styled": "আইনগতভাবে শৈলীযুক্ত",
  "DECLARATION OF FOUNDATIONAL STRUCTURE": "ভিত্তিগত কাঠামোর ঘোষণা",
  "Article I — Unified Operating System": "ধারা I — ইউনিফাইড অপারেটিং সিস্টেম",
  "RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.": "RupayKg একটি একক ডিজিটাল সিস্টেম পরিচালনা করবে যা এর অধীনে স্থাপনযোগ্য: (ক) পৌর কর্পোরেশন + ওয়ার্ড (শহুরে প্রসঙ্গ) (খ) গ্রাম পঞ্চায়েত + গ্রাম (গ্রামীণ প্রসঙ্গ)। প্রসঙ্গগুলির মধ্যে কোনো কাঠামোগত অনুলিপি থাকবে না।",
  "Article II — Unified Stakeholder Doctrine": "ধারা II — ইউনিফাইড স্টেকহোল্ডার মতবাদ",
  "The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, CCC Buyers, Regulator.": "স্টেকহোল্ডার কাঠামো দেশব্যাপী অভিন্ন থাকবে এবং এতে থাকবে: বর্জ্য উৎপাদনকারী, অ্যাগ্রিগেটর, প্রসেসর, প্রশাসনিক কর্তৃপক্ষ, উৎপাদক (EPR), CSR অবদানকারী, কার্বন ক্রেতা, নিয়ন্ত্রক।",
  "Article III — Waste Classification": "ধারা III — বর্জ্য শ্রেণিবিন্যাস",
  "Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.": "বর্জ্যকে একচেটিয়াভাবে শ্রেণীবদ্ধ করা হবে: (ক) শহুরে প্রসঙ্গে MSW (খ) গ্রামীণ প্রসঙ্গে বায়োমাস। সমস্ত কৃষি অবশিষ্টাংশ বায়োমাসের অধীনে শ্রেণীবদ্ধ করা হবে।",
  "Article IV — CCC Engine": "ধারা IV — CCC ইঞ্জিন",
  "All emission reductions shall be processed through a single CCC calculation engine with event-level MRV validation.": "সমস্ত নির্গমন হ্রাস ইভেন্ট-লেভেল MRV যাচাইকরণের সাথে একটি একক CCC গণনা ইঞ্জিনের মাধ্যমে প্রক্রিয়াজাত করা হবে।",
  "Article V — Rail Separation": "ধারা V — রেল পৃথকীকরণ",
  "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, CCC issuance. Double counting is prohibited.": "RupayKg এদের মধ্যে কঠোর পৃথকীকরণ বজায় রাখবে: রিসাইক্লার অ্যাকাউন্টিং, CSR অ্যাকাউন্টিং, EPR কমপ্লায়েন্স, গভর্নেন্স ভ্যালু, CCC ইস্যু। দ্বিগুণ গণনা নিষিদ্ধ।",
  "Article VI — Regulator Sovereignty": "ধারা VI — নিয়ন্ত্রক সার্বভৌমত্ব",
  "CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs.": "কার্বন মিন্ট করার ক্ষমতা নিয়ন্ত্রকের নিয়ন্ত্রণে থাকবে। RupayKg স্বাধীনভাবে কার্বন ক্রেডিট ইস্যু করবে না।",
  "Institutional Identity": "প্রাতিষ্ঠানিক পরিচয়",
  "RupayKg is hereby defined as: A Unified Waste-to-CCC Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability.": "RupayKg-কে এতদ্বারা সংজ্ঞায়িত করা হয়েছে: একটি ইউনিফাইড ওয়েস্ট-টু-CCC ইনফ্রাস্ট্রাকচার প্ল্যাটফর্ম যা একটি একক জাতীয় স্টেকহোল্ডার আর্কিটেকচারের অধীনে নিয়ন্ত্রক-সারিবদ্ধ কার্বন উৎপত্তি ক্ষমতার সাথে কাজ করে।"
  } },
  te: { translation: {
  "National KPI": "జాతీయ KPI",
  "History": "చరిత్ర",
  "Task Board": "టాస్క్ బోర్డ్",
  "Genesis": "ఆదికాండము",
  "Upload Waste": "వ్యర్థాలను అప్‌లోడ్ చేయండి",
  "Logout": "లాగ్అవుట్",
  "Settings": "సెట్టింగ్‌లు",
  "Dashboard": "డాష్‌బోర్డ్",
  "MRV Dashboard": "MRV డాష్‌బోర్డ్",
  "CCC Market": "కార్బన్ మార్కెట్",
  "Language": "భాష",
  "System Overview": "సిస్టమ్ అవలోకనం",
  "Farmers Registered": "రైతులు నమోదు చేసుకున్నారు",
  "Total Collected": "మొత్తం సేకరించబడింది",
  "Total Earnings": "మొత్తం ఆదాయాలు",
  "Hindi": "హిందీ",
  "English": "ఇంగ్లీష్",
  "CCC Offset": "కార్బన్ ఆఫ్‌సెట్",
  "Welcome back": "తిరిగి స్వాగతం",
  "Community Rank": "కమ్యూనిటీ ర్యాంక్",
  "Fleet Efficiency": "ఫ్లీట్ సామర్థ్యం",
  "Value Generated": "ఉత్పత్తి చేయబడిన విలువ",
  "Processing Yield": "ప్రాసెసింగ్ దిగుబడి",
  "Total Processed": "మొత్తం ప్రాసెస్ చేయబడింది",
  "CCCs": "కార్బన్ క్రెడిట్స్",
  "Seed Demo Data": "సీడ్ డెమో డేటా",
  "Logistics Margin": "లాజిస్టిక్స్ మార్జిన్",
  "Total Investment": "మొత్తం పెట్టుబడి",
  "ESG Score": "ESG స్కోర్",
  "Platform Statistics": "వేదిక గణాంకాలు",
  "Reset Demo Data": "డెమో డేటాను రీసెట్ చేయండి",
  "Waste Distribution": "వ్యర్థాల పంపిణీ",
  "Performance Analytics": "పనితీరు విశ్లేషణలు",
  "New Collection Record": "కొత్త కలెక్షన్ రికార్డ్",
  "CCCs Generated": "కార్బన్ తగ్గించబడింది",
  "Total Value": "మొత్తం విలువ",
  "Total Users": "మొత్తం వినియోగదారులు",
  "Register New Farmer": "కొత్త రైతును నమోదు చేయండి",
  "Total Weight": "మొత్తం బరువు",
  "Recent Activity": "ఇటీవలి కార్యాచరణ",
  "New Intake Record": "కొత్త ఇన్‌టేక్ రికార్డ్",
  "Full Name": "పూర్తి పేరు",
  "Crop Type": "పంట రకం",
  "Land Area (Acres)": "భూ విస్తీర్ణం (ఎకరాలు)",
  "Latitude": "అక్షాంశం",
  "Get Current Location": "ప్రస్తుత స్థానాన్ని పొందండి",
  "New Processing Record": "కొత్త ప్రాసెసింగ్ రికార్డ్",
  "Longitude": "రేఖాంశం",
  "Farm Location": "వ్యవసాయ స్థానం",
  "Mobile Number": "మొబైల్ నంబర్",
  "All": "అన్నీ",
  "Registering...": "నమోదు చేస్తోంది...",
  "Transaction Ledger": "లావాదేవీ లెడ్జర్",
  "Register Farmer": "రైతును నమోదు చేయండి",
  "Operations Management": "కార్యకలాపాల నిర్వహణ",
  "Processed": "ప్రాసెస్ చేయబడింది",
  "In Transit": "రవాణాలో",
  "Foundational Doctrine": "పునాది సిద్ధాంతం",
  "Account Settings": "ఖాతా సెట్టింగ్‌లు",
  "Pending Pickup": "పికప్ పెండింగ్‌లో ఉంది",
  "Waste Type": "వ్యర్థ రకం",
  "Location Confirmation (Google Maps)": "స్థాన నిర్ధారణ (గూగుల్ మ్యాప్స్)",
  "Confirm Intake & Mint Value": "తీసుకోవడం & పుదీనా విలువను నిర్ధారించండి",
  "Processing...": "ప్రాసెస్ చేస్తోంది...",
  "Base Value (Recycler)": "మూల విలువ (రీసైక్లర్)",
  "Total Sovereign Value": "మొత్తం సార్వభౌమ విలువ",
  "Weight (kg)": "బరువు (కిలోలు)",
  "CCC Value": "కార్బన్ క్రెడిట్ విలువ",
  "Verification Image": "ధృవీకరణ చిత్రం",
  "Estimated Value Breakdown": "అంచనా విలువ విభజన",
  "Launch OS": "OSని ప్రారంభించండి",
  "Intake": "తీసుకోవడం",
  "Access the OS": "OSని యాక్సెస్ చేయండి",
  "How it Works": "ఇది ఎలా పనిచేస్తుంది",
  "Convert Every Kilogram of Waste into": "ప్రతి కిలోగ్రాము వ్యర్థాలను మార్చండి",
  "RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.": "RupayKg అనేది వృత్తాకార ఆర్థిక వ్యవస్థ ఆపరేటింగ్ సిస్టమ్, ఇది బహుళ-రైలు విలువ ఇంజిన్ ద్వారా వ్యవసాయ, పురపాలక మరియు పారిశ్రామిక వ్యర్థాలను మానిటైజ్ చేయడానికి సంఘాలను శక్తివంతం చేస్తుంది.",
  "Sovereign-Grade Circular Economy Engine": "సావరిన్-గ్రేడ్ సర్క్యులర్ ఎకానమీ ఇంజిన్",
  "Ecosystem Roles": "పర్యావరణ వ్యవస్థ పాత్రలు",
  "Features": "ఫీచర్లు",
  "Global Circular Value": "గ్లోబల్ సర్క్యులర్ విలువ",
  "Rural Wealth Creation": "గ్రామీణ సంపద సృష్టి",
  "Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.": "రీసైక్లర్, CSR, మున్సిపల్, కార్బన్ మరియు EPR పట్టాల నుండి ప్రాసెస్ చేయబడిన ప్రతి కిలోగ్రాము బయోమాస్‌కు ఏకకాలంలో విలువను సంగ్రహించండి.",
  "Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.": "వ్యర్థ రకం, బరువు మరియు జియోలొకేషన్ యొక్క స్వయంచాలక ధృవీకరణ మార్పులేని, సార్వభౌమ-గ్రేడ్ డేటా సమగ్రతను నిర్ధారిస్తుంది.",
  "Multi-Rail Value Engine": "బహుళ-రైల్ విలువ ఇంజిన్",
  "Live Network Impact": "లైవ్ నెట్‌వర్క్ ప్రభావం",
  "Live Stream": "ప్రత్యక్ష ప్రసారం",
  "Read Whitepaper": "శ్వేతపత్రాన్ని చదవండి",
  "Real-time waste throughput across the RupayKg OS": "RupayKg OS అంతటా రియల్-టైమ్ వేస్ట్ త్రూపుట్",
  "Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.": "పౌరుల వాలెట్‌లకు నేరుగా నిధులను పంపిణీ చేయండి, పర్యావరణ బాధ్యతలను స్థానికీకరించిన ఆర్థిక వృద్ధిగా మారుస్తుంది.",
  "AI-Verified Intake": "AI-ధృవీకరించబడిన తీసుకోవడం",
  "Aggregate": "మొత్తం",
  "Aggregators verify, weigh, and transport waste to facilities.": "అగ్రిగేటర్లు వ్యర్థాలను వెరిఫై చేస్తారు, తూకం చేస్తారు మరియు సౌకర్యాలకు రవాణా చేస్తారు.",
  "Network Topology": "నెట్‌వర్క్ టోపాలజీ",
  "Value Minted": "విలువ ముద్రించబడింది",
  "Citizens collect agricultural, municipal, or industrial waste.": "పౌరులు వ్యవసాయ, మునిసిపల్ లేదా పారిశ్రామిక వ్యర్థాలను సేకరిస్తారు.",
  "Active Nodes": "క్రియాశీల నోడ్స్",
  "Distributed biomass collection nodes": "పంపిణీ చేయబడిన బయోమాస్ సేకరణ నోడ్‌లు",
  "A seamless pipeline from waste generation to value realization.": "వ్యర్థాల ఉత్పత్తి నుండి విలువను గ్రహించే వరకు అతుకులు లేని పైప్‌లైన్.",
  "Generate": "సృష్టించు",
  "nodes": "నోడ్స్",
  "Process": "ప్రక్రియ",
  "Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.": "వ్యవసాయ, మునిసిపల్ లేదా పారిశ్రామిక వ్యర్థాలను సేకరించి జమ చేయండి. అందించిన వ్యర్థాల బరువు మరియు రకం ఆధారంగా నేరుగా వాలెట్ డిపాజిట్‌లను సంపాదించండి.",
  "Upload waste records": "వ్యర్థ రికార్డులను అప్‌లోడ్ చేయండి",
  "Mint Value": "పుదీనా విలువ",
  "Waste Generator": "వ్యర్థ జనరేటర్",
  "Recyclers convert waste into usable materials or energy.": "రీసైక్లర్లు వ్యర్థాలను ఉపయోగించగల పదార్థాలు లేదా శక్తిగా మారుస్తాయి.",
  "Choose your part in the circular economy.": "వృత్తాకార ఆర్థిక వ్యవస్థలో మీ భాగాన్ని ఎంచుకోండి.",
  "Smart contracts distribute funds across all 5 value rails.": "స్మార్ట్ కాంట్రాక్టులు మొత్తం 5 వాల్యూ పట్టాలపై నిధులను పంపిణీ చేస్తాయి.",
  "Citizen": "పౌరుడు",
  "Instant wallet funding": "తక్షణ వాలెట్ నిధులు",
  "Aggregator": "అగ్రిగేటర్",
  "Collection & Transport": "సేకరణ & రవాణా",
  "Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.": "పౌరుల డిపాజిట్లను ధృవీకరించండి, వ్యర్థాలను ఏకీకృతం చేయండి మరియు ప్రాసెసింగ్ సౌకర్యాలకు పదార్థాలను రవాణా చేయడానికి లాజిస్టిక్‌లను నిర్వహించండి.",
  "Processor": "ప్రాసెసర్",
  "Log collection batches": "లాగ్ సేకరణ బ్యాచ్‌లు",
  "Recycler": "రీసైక్లర్",
  "Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.": "సమగ్ర వ్యర్థాలను స్వీకరించి, తుది ఉత్పత్తులను ప్రాసెస్ చేయండి. అన్ని పట్టాల అంతటా తుది విలువ రియలైజేషన్‌ను ట్రిగ్గర్ చేయండి.",
  "Route optimization data": "రూట్ ఆప్టిమైజేషన్ డేటా",
  "Earn logistics margins": "లాజిస్టిక్స్ మార్జిన్‌లను సంపాదించండి",
  "Track environmental impact": "పర్యావరణ ప్రభావాన్ని ట్రాక్ చేయండి",
  "District": "జిల్లా",
  "Generate CCCs": "కార్బన్ క్రెడిట్‌లను రూపొందించండి",
  "Access CSR/EPR funds": "CSR/EPR నిధులను యాక్సెస్ చేయండి",
  "Account Type": "ఖాతా రకం",
  "Context:": "సందర్భం:",
  "Log processing yields": "లాగ్ ప్రాసెసింగ్ దిగుబడి",
  "Circular Economy Operating System": "సర్క్యులర్ ఎకానమీ ఆపరేటింగ్ సిస్టమ్",
  "Register": "నమోదు చేసుకోండి",
  "Login": "లాగిన్ చేయండి",
  "Organization Name": "సంస్థ పేరు",
  "Password": "పాస్వర్డ్",
  "Access OS": "యాక్సెస్ OS",
  "Phone Number": "ఫోన్ నంబర్",
  "State": "రాష్ట్రం",
  "Submission Heatmap": "సమర్పణ హీట్‌మ్యాప్",
  "System Audit Logs": "సిస్టమ్ ఆడిట్ లాగ్‌లు",
  "Back to Home": "ఇంటికి తిరిగి వెళ్ళు",
  "Create Account": "ఖాతాను సృష్టించండి",
  "Quick Demo Access": "త్వరిత డెమో యాక్సెస్",
  "Global Impact Map": "గ్లోబల్ ఇంపాక్ట్ మ్యాప్",
  "Total Offset": "మొత్తం ఆఫ్‌సెట్",
  "Portfolio Composition": "పోర్ట్ఫోలియో కూర్పు",
  "Pending": "పెండింగ్‌లో ఉంది",
  "No pending MRV records": "MRV రికార్డులు పెండింగ్‌లో లేవు",
  "Farmers Supported": "రైతులకు మద్దతు పలికారు",
  "All processed waste has been verified.": "అన్ని ప్రాసెస్ చేయబడిన వ్యర్థాలు ధృవీకరించబడ్డాయి.",
  "Verify processed waste records to issue CCCs.": "కార్బన్ క్రెడిట్‌లను జారీ చేయడానికి ప్రాసెస్ చేయబడిన వ్యర్థ రికార్డులను ధృవీకరించండి.",
  "Impact Distribution": "ప్రభావం పంపిణీ",
  "Waste Diverted": "వ్యర్థాలను మళ్లించారు",
  "MRV Verification Dashboard": "MRV ధృవీకరణ డాష్‌బోర్డ్",
  "CCC Reduction": "CCC తగ్గింపు",
  "Purchase verified CCCs to offset your footprint.": "మీ పాదముద్రను ఆఫ్‌సెట్ చేయడానికి ధృవీకరించబడిన కార్బన్ క్రెడిట్‌లను కొనుగోలు చేయండి.",
  "Credit Value": "క్రెడిట్ విలువ",
  "Acreage": "విస్తీర్ణం",
  "Location Verification": "స్థాన ధృవీకరణ",
  "Verify & Issue Credits": "ధృవీకరించండి & క్రెడిట్‌లను జారీ చేయండి",
  "Reject": "తిరస్కరించు",
  "AI Risk Score": "AI రిస్క్ స్కోర్",
  "Available Credits": "అందుబాటులో ఉన్న క్రెడిట్‌లు",
  "Cancel": "రద్దు చేయి",
  "Total Cost": "మొత్తం ఖర్చు",
  "Project": "ప్రాజెక్ట్",
  "Amount to Purchase (Tonnes)": "కొనుగోలు చేయాల్సిన మొత్తం (టన్నులు)",
  "Amount": "మొత్తం",
  "Your Offset Balance": "మీ ఆఫ్‌సెట్ బ్యాలెన్స్",
  "Recent Transactions": "ఇటీవలి లావాదేవీలు",
  "Price per Tonne": "టన్నుకు ధర",
  "Purchase Credits": "కొనుగోలు క్రెడిట్స్",
  "Confirm Purchase": "కొనుగోలును నిర్ధారించండి",
  "Ward": "వార్డు",
  "Price": "ధర",
  "MSW": "MSW",
  "Status": "స్థితి",
  "Network Active": "నెట్‌వర్క్ యాక్టివ్",
  "Municipal Corporation": "మున్సిపల్ కార్పొరేషన్",
  "Date": "తేదీ",
  "Ward-Level Analytics": "వార్డు-స్థాయి విశ్లేషణలు",
  "Ward Analytics": "వార్డ్ అనలిటిక్స్",
  "National Dashboard": "జాతీయ డాష్‌బోర్డ్",
  "Village": "గ్రామం",
  "Gram Panchayat": "గ్రామ పంచాయితీ",
  "Village Analytics": "విలేజ్ అనలిటిక్స్",
  "All Roles": "అన్ని పాత్రలు",
  "Citizen (MSW Generator)": "పౌరుడు (MSW జనరేటర్)",
  "Village-Level Analytics": "గ్రామ-స్థాయి విశ్లేషణలు",
  "Biomass": "జీవ ద్రవ్యరాశి",
  "Citizens": "పౌరులు",
  "Farmers / FPOs": "రైతులు / FPOలు",
  "Farmer / FPO (Biomass Generator)": "రైతు / FPO (బయోమాస్ జనరేటర్)",
  "EPR Partners": "EPR భాగస్వాములు",
  "Aggregators": "అగ్రిగేటర్లు",
  "Fraud Alerts & Flagged Events": "మోసపూరిత హెచ్చరికలు & ఫ్లాగ్ చేయబడిన ఈవెంట్‌లు",
  "CSR Partners": "CSR భాగస్వాములు",
  "Diverted": "దారి మళ్లించారు",
  "Processors": "ప్రాసెసర్లు",
  "CCC Pool Status": "కార్బన్ పూల్ స్థితి",
  "Audit Logs": "ఆడిట్ లాగ్‌లు",
  "User Management": "వినియోగదారు నిర్వహణ",
  "CCC Buyers": "కార్బన్ కొనుగోలుదారులు",
  "Growth & Impact Trends": "గ్రోత్ & ఇంపాక్ట్ ట్రెండ్స్",
  "Environmental Impact": "పర్యావరణ ప్రభావం",
  "Total Waste Events": "మొత్తం వ్యర్థ సంఘటనలు",
  "Wallet Disbursed": "వాలెట్ పంపిణీ చేయబడింది",
  "Water Saved": "నీరు ఆదా చేయబడింది",
  "Trees": "చెట్లు",
  "Methane Avoided": "మీథేన్ నివారించబడింది",
  "Trees Equivalent": "చెట్లు సమానం",
  "Processed Events": "ప్రాసెస్ చేయబడిన ఈవెంట్‌లు",
  "Economic Efficiency": "ఆర్థిక సామర్థ్యం",
  "Avg Price / kg": "సగటు ధర / kg",
  "MRV Rejection Rate": "MRV తిరస్కరణ రేటు",
  "Processing Efficiency": "ప్రాసెసింగ్ సామర్థ్యం",
  "Total Minted CCC Units": "మొత్తం మింటెడ్ కార్బన్ యూనిట్లు",
  "Operational Health": "ఆపరేషనల్ హెల్త్",
  "Geospatial Fraud Distribution": "జియోస్పేషియల్ మోసం పంపిణీ",
  "* Government savings calculated based on avoided landfill management and environmental remediation costs.": "* నివారించబడిన పల్లపు నిర్వహణ మరియు పర్యావరణ నివారణ ఖర్చుల ఆధారంగా ప్రభుత్వ పొదుపులు లెక్కించబడతాయి.",
  "No flagged events detected.": "ఫ్లాగ్ చేయబడిన ఈవెంట్‌లు ఏవీ కనుగొనబడలేదు.",
  "Govt Cost Savings": "ప్రభుత్వ ఖర్చు ఆదా",
  "Waste Composition": "వ్యర్థాల కూర్పు",
  "Actions": "చర్యలు",
  "Role": "పాత్ర",
  "User": "వినియోగదారు",
  "Wallet": "వాలెట్",
  "CSR Partner": "CSR భాగస్వామి",
  "Location": "స్థానం",
  "Regulator": "రెగ్యులేటర్",
  "State Admin": "రాష్ట్ర అడ్మిన్",
  "Municipal Admin": "మున్సిపల్ అడ్మిన్",
  "Super Admin": "సూపర్ అడ్మిన్",
  "EPR Partner": "EPR భాగస్వామి",
  "Delete User": "వినియోగదారుని తొలగించండి",
  "Total Events": "మొత్తం ఈవెంట్‌లు",
  "CCC Buyer": "కార్బన్ కొనుగోలుదారు",
  "No users found.": "వినియోగదారులు కనుగొనబడలేదు.",
  "No ward data available.": "వార్డు డేటా అందుబాటులో లేదు.",
  "No audit logs available.": "ఆడిట్ లాగ్‌లు ఏవీ అందుబాటులో లేవు.",
  "Action": "చర్య",
  "Total Waste": "మొత్తం వ్యర్థాలు",
  "User ID": "వినియోగదారు ID",
  "Email Notifications": "ఇమెయిల్ నోటిఫికేషన్‌లు",
  "Push Notifications": "పుష్ నోటిఫికేషన్లు",
  "Notification Preferences": "నోటిఫికేషన్ ప్రాధాన్యతలు",
  "SMS Alerts": "SMS హెచ్చరికలు",
  "Enable browser push notifications.": "బ్రౌజర్ పుష్ నోటిఫికేషన్‌లను ప్రారంభించండి.",
  "Add ₹10,000": "₹10,000 జోడించండి",
  "Save Changes": "మార్పులను సేవ్ చేయండి",
  "Get instant SMS alerts for critical updates.": "క్లిష్టమైన నవీకరణల కోసం తక్షణ SMS హెచ్చరికలను పొందండి.",
  "Receive updates about your transactions via email.": "ఇమెయిల్ ద్వారా మీ లావాదేవీల గురించిన నవీకరణలను స్వీకరించండి.",
  "Saving...": "సేవ్ చేస్తోంది...",
  "Weight: ": "బరువు:",
  "Currently Active: ": "ప్రస్తుతం సక్రియం:",
  "GENESIS": "జెనెసిస్",
  "Value: ": "విలువ:",
  "FRAUD ALERT": "మోసం హెచ్చరిక",
  "© 2026 RupayKg Circular Economy OS. All rights reserved.": "© 2026 RupayKg సర్క్యులర్ ఎకానమీ OS. అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.",
  " Context (": "సందర్భం (",
  "Type: ": "రకం:",
  "Village: ": "గ్రామం:",
  "How the Engine Works": "ఇంజిన్ ఎలా పనిచేస్తుంది",
  "Processor (Recycler)": "ప్రాసెసర్ (రీసైక్లర్)",
  "Aggregator (Collection & Transport)": "అగ్రిగేటర్ (సేకరణ & రవాణా)",
  "Privacy": "గోప్యత",
  "rural": "గ్రామీణ",
  "Farmer": "రైతు",
  "RUPAYKG": "రూపాయికేజీ",
  "Terms": "నిబంధనలు",
  "National Regulator": "నేషనల్ రెగ్యులేటర్",
  "urban": "పట్టణ",
  "Admin": "అడ్మిన్",
  "Wallet Balance": "వాలెట్ బ్యాలెన్స్",
  "Acreage (acres)": "విస్తీర్ణం (ఎకరాలు)",
  "Circular Economy Intake Form": "సర్క్యులర్ ఎకానమీ తీసుకోవడం ఫారం",
  "GPS Captured: ": "GPS క్యాప్చర్ చేయబడింది:",
  "Capturing GPS Coordinates...": "GPS కోఆర్డినేట్‌లను సంగ్రహిస్తోంది...",
  "Database Connection Failed": "డేటాబేస్ కనెక్షన్ విఫలమైంది",
  "No audit logs found": "ఆడిట్ లాగ్‌లు ఏవీ కనుగొనబడలేదు",
  "No records found": "రికార్డులు ఏవీ దొరకలేదు",
  "GPS Capture Failed": "GPS క్యాప్చర్ విఫలమైంది",
  "Name": "పేరు",
  "GPS Required": "GPS అవసరం",
  "Failed to register farmer": "రైతును నమోదు చేయడంలో విఫలమైంది",
  "Retry GPS": "GPSని మళ్లీ ప్రయత్నించండి",
  "Drivers Online": "డ్రైవర్లు ఆన్‌లైన్",
  "Farmer registered successfully! ID: ": "రైతు విజయవంతంగా నమోదు! ID:",
  "Geolocation is not supported by this browser.": "ఈ బ్రౌజర్ ద్వారా జియోలొకేషన్‌కు మద్దతు లేదు.",
  "Active Queue": "యాక్టివ్ క్యూ",
  "Failed to get location. Please enter manually.": "స్థానాన్ని పొందడంలో విఫలమైంది. దయచేసి మాన్యువల్‌గా నమోదు చేయండి.",
  "e.g., Paddy, Wheat": "ఉదా., వరి, గోధుమ",
  "Active Fleet": "యాక్టివ్ ఫ్లీట్",
  "Output Material": "అవుట్‌పుట్ మెటీరియల్",
  "Current Load": "ప్రస్తుత లోడ్",
  "Biomass in Stock": "స్టాక్‌లో బయోమాస్",
  "Utilization": "వినియోగం",
  "Available for Pickup": "పికప్ కోసం అందుబాటులో ఉంది",
  "Storage Utilization": "నిల్వ వినియోగం",
  "Accept Pickup": "పికప్‌ని అంగీకరించండి",
  "Incoming for Processing": "ప్రాసెసింగ్ కోసం ఇన్‌కమింగ్",
  "No new tasks available.": "కొత్త టాస్క్‌లు ఏవీ అందుబాటులో లేవు.",
  "Total Capacity": "మొత్తం సామర్థ్యం",
  "Type": "టైప్ చేయండి",
  "Accept Receipt": "రసీదుని అంగీకరించండి",
  "Value": "విలువ",
  "No records found for the selected filter.": "ఎంచుకున్న ఫిల్టర్ కోసం రికార్డులు ఏవీ కనుగొనబడలేదు.",
  "No active tasks in your possession.": "మీ ఆధీనంలో యాక్టివ్ టాస్క్‌లు లేవు.",
  "MRV Status": "MRV స్థితి",
  "Recently Processed": "ఇటీవల ప్రాసెస్ చేయబడింది",
  "Timestamp": "సమయముద్ర",
  "Weight": "బరువు",
  "Pending MRV": "పెండింగ్‌లో ఉన్న MRV",
  "Med": "మెడ్",
  "High": "అధిక",
  "No credits available": "క్రెడిట్‌లు అందుబాటులో లేవు",
  "No MRV history found": "MRV చరిత్ర కనుగొనబడలేదు",
  "Low": "తక్కువ",
  "Record ID": "రికార్డ్ ID",
  "Details": "వివరాలు",
  "AI Risk": "AI ప్రమాదం",
  "Verified By": "ద్వారా ధృవీకరించబడింది",
  "Check back later for newly verified CCCs.": "కొత్తగా ధృవీకరించబడిన కార్బన్ క్రెడిట్‌ల కోసం తర్వాత మళ్లీ తనిఖీ చేయండి.",
  "Purchase Credit": "కొనుగోలు క్రెడిట్",
  "Profile Settings": "ప్రొఫైల్ సెట్టింగ్‌లు",
  "Profile updated successfully": "ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది",
  "Insufficient Funds": "సరిపోని నిధులు",
  "Offset": "ఆఫ్‌సెట్",
  "Verified": "ధృవీకరించబడింది",
  "I. Introduction": "I. పరిచయం",
  "An error occurred": "ఒక లోపం సంభవించింది",
  "Failed to update profile": "ప్రొఫైల్‌ను నవీకరించడంలో విఫలమైంది",
  "The Foundational Structure and Operating Doctrine of RupayKg": "రూపాయికేజీ యొక్క పునాది నిర్మాణం మరియు నిర్వహణ సిద్ధాంతం",
  "Category": "వర్గం",
  "The platform addresses a structural gap in India’s CCC ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade CCC supply.": "భారతదేశం యొక్క కార్బన్ పర్యావరణ వ్యవస్థలో నిర్మాణాత్మక అంతరాన్ని ప్లాట్‌ఫారమ్ పరిష్కరిస్తుంది: ధృవీకరించబడిన వ్యర్థాల మళ్లింపును సమ్మతి-గ్రేడ్ కార్బన్ సరఫరాగా మార్చగల ఏకీకృత, రెగ్యులేటర్-అలైన్డ్ డిజిటల్ ఇన్‌ఫ్రాస్ట్రక్చర్ లేకపోవడం.",
  "Municipal Corp + Ward": "మున్సిపల్ కార్పొరేషన్ + వార్డు",
  "Context": "సందర్భం",
  "RupayKg has been established as a Unified Waste-to-CCC Digital Operating System designed to support India’s transition toward a compliance-based CCC market.": "సమ్మతి-ఆధారిత కార్బన్ మార్కెట్ వైపు భారతదేశం యొక్క పరివర్తనకు మద్దతు ఇవ్వడానికి రూపొందించిన యూనిఫైడ్ వేస్ట్-టు-కార్బన్ డిజిటల్ ఆపరేటింగ్ సిస్టమ్‌గా RupayKg స్థాపించబడింది.",
  "RupayKg is not structured as a project developer, CCC trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.": "RupayKg అనేది ప్రాజెక్ట్ డెవలపర్, కార్బన్ ట్రేడర్ లేదా రీసైక్లింగ్ ఎంటిటీగా రూపొందించబడలేదు. ఇది ఆర్కిటెక్చరల్ డూప్లికేషన్ లేకుండా అర్బన్ మరియు రూరల్ అడ్మినిస్ట్రేటివ్ ఫ్రేమ్‌వర్క్‌లలో పనిచేయడానికి రూపొందించబడిన ఇన్‌ఫ్రాస్ట్రక్చర్ లేయర్.",
  "Urban": "అర్బన్",
  "Rural": "గ్రామీణ",
  "II. Unified Operating System Model": "II. ఏకీకృత ఆపరేటింగ్ సిస్టమ్ మోడల్",
  "Anchor": "యాంకర్",
  "CSR Contributors": "CSR కంట్రిబ్యూటర్స్",
  "The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.": "సేకరణ మరియు క్రమబద్ధీకరణ ధృవీకరణ, చైన్-ఆఫ్-కస్టడీ వెరిఫికేషన్‌కు బాధ్యత వహించే విలీన సంస్థగా అగ్రిగేటర్ నిర్మాణాత్మకంగా నిర్వచించబడింది.",
  "Gram Panchayat + Village": "గ్రామ పంచాయతీ + గ్రామం",
  "* All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.": "* అన్ని గ్రామీణ వ్యవసాయ అవశేషాలు మరియు బయోమాస్ కార్యకలాపాలు బయోమాస్ కింద వర్గీకరించబడ్డాయి. ప్రత్యేక వ్యవసాయ నిలువు ఉనికి లేదు.",
  "Biomass-based fossil substitution": "బయోమాస్ ఆధారిత శిలాజ ప్రత్యామ్నాయం",
  "IV. CCC Origination": "IV. కార్బన్ మూలం",
  "Methane avoidance through diversion": "మళ్లింపు ద్వారా మీథేన్ ఎగవేత",
  "Administrative Authority": "అడ్మినిస్ట్రేటివ్ అథారిటీ",
  "III. Unified Stakeholder Architecture": "III. యూనిఫైడ్ స్టేక్‌హోల్డర్ ఆర్కిటెక్చర్",
  "Producers (EPR)": "నిర్మాతలు (EPR)",
  "CSR Rail": "CSR రైలు",
  "Recycler Rail": "రీసైక్లర్ రైలు",
  "Recycling substitution": "రీసైక్లింగ్ ప్రత్యామ్నాయం",
  "V. Multi-Rail Architecture": "V. మల్టీ-రైల్ ఆర్కిటెక్చర్",
  "CCC issuance authority remains regulator-controlled. RupayKg does not independently mint credits. All credits must be event-traceable, registry-compatible, and align with national CCC governance frameworks.": "కార్బన్ జారీ అధికారం నియంత్రకం నియంత్రణలో ఉంటుంది. RupayKg స్వతంత్రంగా క్రెడిట్‌లను మింట్ చేయదు. అన్ని క్రెడిట్‌లు తప్పనిసరిగా ఈవెంట్-ట్రేస్ చేయదగినవి, రిజిస్ట్రీ-అనుకూలమైనవి మరియు జాతీయ కార్బన్ గవర్నెన్స్ ఫ్రేమ్‌వర్క్‌లకు అనుగుణంగా ఉండాలి.",
  "VI. Regulator Sovereignty": "VI. రెగ్యులేటర్ సార్వభౌమాధికారం",
  "EPR Rail": "EPR రైలు",
  "CCC Rail": "కార్బన్ రైలు",
  "VII. Strategic Position": "VII. వ్యూహాత్మక స్థానం",
  "Governance Layer": "గవర్నెన్స్ లేయర్",
  "When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated CCC value?": "మేము రూపాయికేజీని నిర్మించడం ప్రారంభించినప్పుడు, మేము రీసైక్లింగ్‌తో ప్రారంభించలేదు. మేము నిర్మాణాత్మక ప్రశ్నతో ప్రారంభించాము: వ్యర్థాలను నియంత్రిత కార్బన్ విలువగా మార్చే ఏకీకృత మౌలిక సదుపాయాలు ఎందుకు లేవు?",
  "Waste is no longer disposal. It is governance-linked climate infrastructure.": "వ్యర్థాలు ఇకపై పారవేయబడవు. ఇది గవర్నెన్స్-లింక్డ్ క్లైమేట్ ఇన్‌ఫ్రాస్ట్రక్చర్.",
  "India is entering a compliance CCC era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.": "భారతదేశం సమ్మతి కార్బన్ యుగంలోకి ప్రవేశిస్తోంది. పురపాలక వ్యవస్థలు కొలవగల మీథేన్‌ను ఉత్పత్తి చేస్తాయి. గ్రామీణ జీవపదార్ధాలు కాల్చివేయబడతాయి లేదా ఉపయోగించబడవు. అయినా వ్యవస్థలు ఛిన్నాభిన్నంగా ఉన్నాయి.",
  "Article II — Unified Stakeholder Doctrine": "ఆర్టికల్ II — ఏకీకృత వాటాదారుల సిద్ధాంతం",
  "RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.": "RupayKg కింద అమలు చేయగల ఒకే డిజిటల్ వ్యవస్థను నిర్వహిస్తుంది: (ఎ) మున్సిపల్ కార్పొరేషన్ + వార్డు (పట్టణ సందర్భం) (బి) గ్రామ పంచాయతీ + గ్రామం (గ్రామీణ సందర్భం). సందర్భాల మధ్య ఎటువంటి నిర్మాణాత్మక నకిలీ ఉండకూడదు.",
  "— Founder, RupayKg": "- వ్యవస్థాపకుడు, రూపాయికేజీ",
  "RupayKg was built to unify them. Not as a CCC trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.": "వాటిని ఏకం చేసేందుకు రూపాయికేజీని నిర్మించారు. కార్బన్ వ్యాపారిగా కాదు. రీసైక్లింగ్ స్టార్టప్‌గా కాదు. కానీ నిర్మాణాత్మక డూప్లికేషన్ లేకుండా మునిసిపల్ వార్డు స్థాయి మరియు గ్రామ పంచాయితీ గ్రామ స్థాయిలో పని చేయగల ఒకే ఆపరేటింగ్ సిస్టమ్‌గా.",
  "DECLARATION OF FOUNDATIONAL STRUCTURE": "ఫౌండషనల్ స్ట్రక్చర్ డిక్లరేషన్",
  "Legally Styled": "చట్టబద్ధంగా శైలి",
  "Article I — Unified Operating System": "ఆర్టికల్ I — యూనిఫైడ్ ఆపరేటింగ్ సిస్టమ్",
  "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, CCC issuance. Double counting is prohibited.": "రీసైక్లర్ అకౌంటింగ్, CSR అకౌంటింగ్, EPR సమ్మతి, గవర్నెన్స్ వాల్యూ, కార్బన్ జారీ వంటి వాటి మధ్య RupayKg ఖచ్చితమైన విభజనను కలిగి ఉంటుంది. డబుల్ లెక్కింపు నిషేధించబడింది.",
  "The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, CCC Buyers, Regulator.": "వాటాదారుల నిర్మాణం దేశవ్యాప్తంగా ఏకరీతిగా ఉంటుంది మరియు వీటిని కలిగి ఉంటుంది: వేస్ట్ జనరేటర్, అగ్రిగేటర్, ప్రాసెసర్, అడ్మినిస్ట్రేటివ్ అథారిటీ, ప్రొడ్యూసర్స్ (EPR), CSR కంట్రిబ్యూటర్స్, కార్బన్ కొనుగోలుదారులు, రెగ్యులేటర్.",
  "Article IV — CCC Engine": "ఆర్టికల్ IV - కార్బన్ ఇంజిన్",
  "Institutional Identity": "సంస్థాగత గుర్తింపు",
  "Article VI — Regulator Sovereignty": "ఆర్టికల్ VI - రెగ్యులేటర్ సార్వభౌమాధికారం",
  "CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs.": "కార్బన్ మింట్ అథారిటీ రెగ్యులేటర్ నియంత్రణలో ఉంటుంది. RupayKg స్వతంత్రంగా కార్బన్ క్రెడిట్‌లను జారీ చేయదు.",
  "Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.": "వ్యర్థాలను ప్రత్యేకంగా వర్గీకరించాలి: (ఎ) పట్టణ సందర్భంలో MSW (బి) గ్రామీణ సందర్భంలో బయోమాస్. అన్ని వ్యవసాయ అవశేషాలు బయోమాస్ కింద వర్గీకరించబడతాయి.",
  "Article V — Rail Separation": "ఆర్టికల్ V — రైలు విభజన",
  "All emission reductions shall be processed through a single CCC calculation engine with event-level MRV validation.": "అన్ని ఉద్గార తగ్గింపులు ఈవెంట్-స్థాయి MRV ధ్రువీకరణతో ఒకే కార్బన్ గణన ఇంజిన్ ద్వారా ప్రాసెస్ చేయబడతాయి.",
  "Article III — Waste Classification": "ఆర్టికల్ III — వ్యర్థాల వర్గీకరణ",
  "RupayKg is hereby defined as: A Unified Waste-to-CCC Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability.": "RupayKg ఇందుమూలంగా నిర్వచించబడింది: రెగ్యులేటర్-అలైన్డ్ కార్బన్ ఆరిజినేషన్ సామర్ధ్యంతో ఒకే జాతీయ వాటాదారు నిర్మాణం కింద పనిచేసే యూనిఫైడ్ వేస్ట్-టు-కార్బన్ ఇన్‌ఫ్రాస్ట్రక్చర్ ప్లాట్‌ఫాం."
  } },
  mr: { translation: {
  "History": "इतिहास",
  "Dashboard": "डॅशबोर्ड",
  "Task Board": "कार्य मंडळ",
  "Upload Waste": "कचरा अपलोड करा",
  "CCC Market": "कार्बन मार्केट",
  "National KPI": "राष्ट्रीय KPI",
  "Genesis": "उत्पत्ती",
  "Settings": "सेटिंग्ज",
  "MRV Dashboard": "MRV डॅशबोर्ड",
  "Logout": "लॉगआउट करा",
  "Total Collected": "एकूण गोळा",
  "Community Rank": "समुदाय रँक",
  "English": "इंग्रजी",
  "Language": "भाषा",
  "System Overview": "सिस्टम विहंगावलोकन",
  "CCC Offset": "कार्बन ऑफसेट",
  "Welcome back": "परत स्वागत आहे",
  "Hindi": "हिंदी",
  "Total Earnings": "एकूण कमाई",
  "Farmers Registered": "शेतकऱ्यांनी नोंदणी केली",
  "Total Processed": "एकूण प्रक्रिया",
  "Logistics Margin": "लॉजिस्टिक मार्जिन",
  "Platform Statistics": "प्लॅटफॉर्म आकडेवारी",
  "CCCs": "कार्बन क्रेडिट्स",
  "Processing Yield": "प्रक्रिया उत्पन्न",
  "Value Generated": "मूल्य व्युत्पन्न",
  "Total Investment": "एकूण गुंतवणूक",
  "ESG Score": "ईएसजी स्कोअर",
  "Seed Demo Data": "सीड डेमो डेटा",
  "Fleet Efficiency": "फ्लीट कार्यक्षमता",
  "Total Users": "एकूण वापरकर्ते",
  "Waste Distribution": "कचरा वितरण",
  "CCCs Generated": "कार्बन कमी",
  "Total Value": "एकूण मूल्य",
  "Reset Demo Data": "डेमो डेटा रीसेट करा",
  "Recent Activity": "अलीकडील क्रियाकलाप",
  "New Collection Record": "नवीन संग्रह रेकॉर्ड",
  "Register New Farmer": "नवीन शेतकरी नोंदणी करा",
  "Total Weight": "एकूण वजन",
  "Performance Analytics": "कामगिरी विश्लेषण",
  "Full Name": "पूर्ण नाव",
  "Mobile Number": "मोबाईल नंबर",
  "Latitude": "अक्षांश",
  "Longitude": "रेखांश",
  "Get Current Location": "वर्तमान स्थान मिळवा",
  "New Processing Record": "नवीन प्रक्रिया रेकॉर्ड",
  "New Intake Record": "नवीन सेवन रेकॉर्ड",
  "Farm Location": "फार्म स्थान",
  "Crop Type": "पीक प्रकार",
  "Land Area (Acres)": "जमीन क्षेत्र (एकर)",
  "Account Settings": "खाते सेटिंग्ज",
  "All": "सर्व",
  "Registering...": "नोंदणी करत आहे...",
  "Foundational Doctrine": "पायाभूत सिद्धांत",
  "Operations Management": "ऑपरेशन्स व्यवस्थापन",
  "Register Farmer": "शेतकरी नोंदणी करा",
  "Pending Pickup": "प्रलंबित पिकअप",
  "Processed": "प्रक्रिया केली",
  "Transaction Ledger": "व्यवहार खातेवही",
  "In Transit": "संक्रमण मध्ये",
  "Weight (kg)": "वजन (किलो)",
  "Total Sovereign Value": "एकूण सार्वभौम मूल्य",
  "Estimated Value Breakdown": "अंदाजे मूल्य ब्रेकडाउन",
  "Processing...": "प्रक्रिया करत आहे...",
  "Location Confirmation (Google Maps)": "स्थान पुष्टीकरण (Google नकाशे)",
  "Confirm Intake & Mint Value": "सेवन आणि मिंट व्हॅल्यूची पुष्टी करा",
  "CCC Value": "कार्बन क्रेडिट मूल्य",
  "Base Value (Recycler)": "मूळ मूल्य (रीसायकल)",
  "Waste Type": "कचरा प्रकार",
  "Verification Image": "पडताळणी प्रतिमा",
  "How it Works": "ते कसे कार्य करते",
  "Global Circular Value": "जागतिक परिपत्रक मूल्य",
  "Sovereign-Grade Circular Economy Engine": "सार्वभौम-ग्रेड वर्तुळाकार इकॉनॉमी इंजिन",
  "Access the OS": "OS मध्ये प्रवेश करा",
  "Convert Every Kilogram of Waste into": "प्रत्येक किलोग्रॅम कचरा मध्ये रूपांतरित करा",
  "Ecosystem Roles": "इकोसिस्टम भूमिका",
  "Intake": "सेवन",
  "Features": "वैशिष्ट्ये",
  "Launch OS": "OS लाँच करा",
  "RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.": "RupayKg ही वर्तुळाकार अर्थव्यवस्था कार्यप्रणाली आहे जी समुदायांना बहु-रेल्वे मूल्य इंजिनद्वारे कृषी, नगरपालिका आणि औद्योगिक कचऱ्याचे कमाई करण्यासाठी सक्षम करते.",
  "Multi-Rail Value Engine": "मल्टी-रेल व्हॅल्यू इंजिन",
  "AI-Verified Intake": "AI-सत्यापित सेवन",
  "Live Network Impact": "थेट नेटवर्क प्रभाव",
  "Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.": "सोबतच प्रक्रिया केलेल्या प्रत्येक किलोग्रॅम बायोमाससाठी रिसायकल, सीएसआर, म्युनिसिपल, कार्बन आणि ईपीआर रेलमधून मूल्य काढा.",
  "Live Stream": "थेट प्रवाह",
  "Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.": "पर्यावरणीय दायित्वांचे स्थानिक आर्थिक वाढीमध्ये रूपांतर करून, नागरिकांच्या वॉलेटमध्ये थेट निधी वितरित करा.",
  "Read Whitepaper": "श्वेतपत्रिका वाचा",
  "Real-time waste throughput across the RupayKg OS": "RupayKg OS वर रिअल-टाइम कचरा थ्रूपुट",
  "Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.": "कचरा प्रकार, वजन आणि भौगोलिक स्थानाची स्वयंचलित पडताळणी अपरिवर्तनीय, सार्वभौम-ग्रेड डेटा अखंडता सुनिश्चित करते.",
  "Rural Wealth Creation": "ग्रामीण संपत्ती निर्मिती",
  "Active Nodes": "सक्रिय नोडस्",
  "nodes": "नोडस्",
  "Value Minted": "मूल्य मिंटेड",
  "Generate": "निर्माण करा",
  "Citizens collect agricultural, municipal, or industrial waste.": "नागरिक कृषी, नगरपालिका किंवा औद्योगिक कचरा गोळा करतात.",
  "Aggregators verify, weigh, and transport waste to facilities.": "एग्रीगेटर्स कचऱ्याची पडताळणी करतात, वजन करतात आणि सुविधांमध्ये कचरा वाहतूक करतात.",
  "Aggregate": "एकूण",
  "A seamless pipeline from waste generation to value realization.": "कचरा निर्मितीपासून ते मूल्य प्राप्तीपर्यंत एक अखंड पाइपलाइन.",
  "Distributed biomass collection nodes": "वितरित बायोमास संकलन नोड्स",
  "Network Topology": "नेटवर्क टोपोलॉजी",
  "Process": "प्रक्रिया",
  "Upload waste records": "कचरा नोंदी अपलोड करा",
  "Recyclers convert waste into usable materials or energy.": "पुनर्वापर करणारे कचऱ्याचे वापरण्यायोग्य पदार्थ किंवा ऊर्जेत रूपांतर करतात.",
  "Smart contracts distribute funds across all 5 value rails.": "स्मार्ट कॉन्ट्रॅक्ट सर्व 5 व्हॅल्यू रेलमध्ये निधी वितरित करतात.",
  "Mint Value": "मिंट व्हॅल्यू",
  "Citizen": "नागरिक",
  "Waste Generator": "कचरा जनरेटर",
  "Choose your part in the circular economy.": "वर्तुळाकार अर्थव्यवस्थेत तुमचा भाग निवडा.",
  "Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.": "कृषी, नगरपालिका किंवा औद्योगिक कचरा गोळा आणि जमा करा. वजन आणि कचऱ्याच्या प्रकारावर आधारित थेट वॉलेट ठेवी मिळवा.",
  "Instant wallet funding": "झटपट वॉलेट निधी",
  "Collection & Transport": "संकलन आणि वाहतूक",
  "Track environmental impact": "पर्यावरणीय प्रभावाचा मागोवा घ्या",
  "Aggregator": "एग्रीगेटर",
  "Log collection batches": "लॉग संग्रह बॅचेस",
  "Recycler": "रिसायकल",
  "Processor": "प्रोसेसर",
  "Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.": "नागरिकांच्या ठेवींची पडताळणी करा, कचऱ्याचे एकत्रिकरण करा आणि प्रक्रिया सुविधांपर्यंत साहित्य वाहतूक करण्यासाठी रसद व्यवस्थापित करा.",
  "Route optimization data": "मार्ग ऑप्टिमायझेशन डेटा",
  "Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.": "एकत्रित कचरा प्राप्त करा आणि अंतिम उत्पादनांमध्ये त्यावर प्रक्रिया करा. सर्व रेलमध्ये अंतिम मूल्य प्राप्ती ट्रिगर करा.",
  "Earn logistics margins": "लॉजिस्टिक मार्जिन मिळवा",
  "Log processing yields": "लॉग प्रक्रिया उत्पन्न",
  "Account Type": "खाते प्रकार",
  "Generate CCCs": "कार्बन क्रेडिट्स तयार करा",
  "Access CSR/EPR funds": "सीएसआर/ईपीआर निधीमध्ये प्रवेश करा",
  "Context:": "संदर्भ:",
  "Circular Economy Operating System": "सर्कुलर इकॉनॉमी ऑपरेटिंग सिस्टम",
  "District": "जिल्हा",
  "Register": "नोंदणी करा",
  "Login": "लॉगिन करा",
  "Organization Name": "संस्थेचे नाव",
  "Back to Home": "घरी परत",
  "Password": "पासवर्ड",
  "System Audit Logs": "सिस्टम ऑडिट लॉग",
  "Global Impact Map": "जागतिक प्रभाव नकाशा",
  "State": "राज्य",
  "Submission Heatmap": "सबमिशन हीटमॅप",
  "Quick Demo Access": "द्रुत डेमो प्रवेश",
  "Create Account": "खाते तयार करा",
  "Phone Number": "फोन नंबर",
  "Access OS": "OS वर प्रवेश करा",
  "Total Offset": "एकूण ऑफसेट",
  "Verify processed waste records to issue CCCs.": "कार्बन क्रेडिट जारी करण्यासाठी प्रक्रिया केलेल्या कचरा रेकॉर्डची पडताळणी करा.",
  "No pending MRV records": "MRV नोंदी प्रलंबित नाहीत",
  "Farmers Supported": "शेतकऱ्यांनी पाठिंबा दिला",
  "MRV Verification Dashboard": "MRV पडताळणी डॅशबोर्ड",
  "Waste Diverted": "कचरा वळवला",
  "All processed waste has been verified.": "सर्व प्रक्रिया केलेल्या कचऱ्याची पडताळणी करण्यात आली आहे.",
  "Pending": "प्रलंबित",
  "Impact Distribution": "प्रभाव वितरण",
  "Portfolio Composition": "पोर्टफोलिओ रचना",
  "Carbon Reduction": "कार्बन कमी करणे",
  "Verify & Issue Credits": "सत्यापित करा आणि क्रेडिट जारी करा",
  "Available Credits": "उपलब्ध क्रेडिट्स",
  "Location Verification": "स्थान सत्यापन",
  "Purchase verified CCCs to offset your footprint.": "तुमचा फूटप्रिंट ऑफसेट करण्यासाठी सत्यापित कार्बन क्रेडिट्स खरेदी करा.",
  "Acreage": "एकरी",
  "Credit Value": "क्रेडिट मूल्य",
  "Reject": "नकार द्या",
  "AI Risk Score": "AI जोखीम स्कोअर",
  "Price per Tonne": "प्रति टन किंमत",
  "Purchase Credits": "क्रेडिट्स खरेदी करा",
  "Amount": "रक्कम",
  "Confirm Purchase": "खरेदीची पुष्टी करा",
  "Total Cost": "एकूण खर्च",
  "Your Offset Balance": "तुमची ऑफसेट शिल्लक",
  "Cancel": "रद्द करा",
  "Recent Transactions": "अलीकडील व्यवहार",
  "Project": "प्रकल्प",
  "Amount to Purchase (Tonnes)": "खरेदीची रक्कम (टन)",
  "Status": "स्थिती",
  "National Dashboard": "राष्ट्रीय डॅशबोर्ड",
  "Ward Analytics": "प्रभाग विश्लेषण",
  "Ward": "वार्ड",
  "MSW": "एमएसडब्ल्यू",
  "Date": "तारीख",
  "Municipal Corporation": "महानगरपालिका",
  "Ward-Level Analytics": "प्रभाग-स्तरीय विश्लेषण",
  "Price": "किंमत",
  "Network Active": "नेटवर्क सक्रिय",
  "Village": "गाव",
  "Citizen (MSW Generator)": "नागरिक (MSW जनरेटर)",
  "Village-Level Analytics": "गाव-स्तरीय विश्लेषण",
  "Citizens": "नागरिक",
  "Gram Panchayat": "ग्रामपंचायत",
  "Village Analytics": "गाव विश्लेषण",
  "Farmer / FPO (Biomass Generator)": "शेतकरी / FPO (बायोमास जनरेटर)",
  "Farmers / FPOs": "शेतकरी / एफपीओ",
  "Biomass": "बायोमास",
  "All Roles": "सर्व भूमिका",
  "EPR Partners": "EPR भागीदार",
  "CSR Partners": "CSR भागीदार",
  "Audit Logs": "ऑडिट नोंदी",
  "Diverted": "वळवले",
  "Aggregators": "एकत्रित करणारे",
  "CCC Pool Status": "कार्बन पूल स्थिती",
  "User Management": "वापरकर्ता व्यवस्थापन",
  "Processors": "प्रोसेसर",
  "Fraud Alerts & Flagged Events": "फसवणूक सूचना आणि ध्वजांकित इव्हेंट",
  "CCC Buyers": "कार्बन खरेदीदार",
  "Water Saved": "पाण्याची बचत",
  "Growth & Impact Trends": "वाढ आणि प्रभाव ट्रेंड",
  "Trees": "झाडे",
  "Total Waste Events": "एकूण कचरा घटना",
  "Trees Equivalent": "झाडे समतुल्य",
  "Methane Avoided": "मिथेन टाळले",
  "Environmental Impact": "पर्यावरणीय प्रभाव",
  "Wallet Disbursed": "वॉलेट वितरित केले",
  "Economic Efficiency": "आर्थिक कार्यक्षमता",
  "Processed Events": "प्रक्रिया केलेले कार्यक्रम",
  "* Government savings calculated based on avoided landfill management and environmental remediation costs.": "* टाळलेल्या लँडफिल व्यवस्थापन आणि पर्यावरणीय उपायांच्या खर्चावर आधारित सरकारी बचतीची गणना.",
  "Processing Efficiency": "प्रक्रिया कार्यक्षमता",
  "MRV Rejection Rate": "MRV नकार दर",
  "Govt Cost Savings": "सरकारी खर्च बचत",
  "Avg Price / kg": "सरासरी किंमत / किलो",
  "Geospatial Fraud Distribution": "भौगोलिक फसवणूक वितरण",
  "Operational Health": "ऑपरेशनल आरोग्य",
  "No flagged events detected.": "कोणतेही ध्वजांकित इव्हेंट आढळले नाहीत.",
  "Total Minted CCC Units": "एकूण मिंटेड कार्बन युनिट्स",
  "Waste Composition": "कचरा रचना",
  "Location": "स्थान",
  "State Admin": "राज्य प्रशासन",
  "User": "वापरकर्ता",
  "Super Admin": "सुपर ॲडमिन",
  "Municipal Admin": "महापालिका प्रशासन",
  "CSR Partner": "CSR भागीदार",
  "Actions": "क्रिया",
  "Regulator": "नियामक",
  "Role": "भूमिका",
  "Wallet": "पाकीट",
  "Action": "कृती",
  "No audit logs available.": "कोणतेही ऑडिट लॉग उपलब्ध नाहीत.",
  "EPR Partner": "EPR भागीदार",
  "Delete User": "वापरकर्ता हटवा",
  "No users found.": "कोणतेही वापरकर्ते आढळले नाहीत.",
  "CCC Buyer": "कार्बन खरेदीदार",
  "No ward data available.": "प्रभाग डेटा उपलब्ध नाही.",
  "Total Waste": "एकूण कचरा",
  "Total Events": "एकूण घटना",
  "User ID": "वापरकर्ता आयडी",
  "Email Notifications": "ईमेल सूचना",
  "SMS Alerts": "एसएमएस अलर्ट",
  "Notification Preferences": "सूचना प्राधान्ये",
  "Add ₹10,000": "₹10,000 जोडा",
  "Get instant SMS alerts for critical updates.": "गंभीर अद्यतनांसाठी त्वरित SMS सूचना मिळवा.",
  "Save Changes": "बदल जतन करा",
  "Enable browser push notifications.": "ब्राउझर पुश सूचना सक्षम करा.",
  "Receive updates about your transactions via email.": "ईमेलद्वारे तुमच्या व्यवहारांबद्दल अपडेट्स मिळवा.",
  "Push Notifications": "पुश सूचना",
  "Saving...": "सेव्ह करत आहे...",
  "FRAUD ALERT": "फसवणूक सूचना",
  "GENESIS": "उत्पत्ती",
  "Value: ": "मूल्य:",
  "Type: ": "प्रकार:",
  "Currently Active: ": "सध्या सक्रिय:",
  "How the Engine Works": "इंजिन कसे कार्य करते",
  "© 2026 RupayKg Circular Economy OS. All rights reserved.": "© 2026 RupayKg सर्कुलर इकॉनॉमी OS. सर्व हक्क राखीव.",
  " Context (": "संदर्भ (",
  "Weight: ": "वजन:",
  "Village: ": "गाव:",
  "Terms": "अटी",
  "Farmer": "शेतकरी",
  "Processor (Recycler)": "प्रोसेसर (रीसायकल)",
  "National Regulator": "राष्ट्रीय नियामक",
  "Admin": "ॲडमिन",
  "Aggregator (Collection & Transport)": "एग्रीगेटर (संकलन आणि वाहतूक)",
  "Privacy": "गोपनीयता",
  "rural": "ग्रामीण",
  "RUPAYKG": "RUPAYKG",
  "urban": "शहरी",
  "No records found": "कोणतेही रेकॉर्ड आढळले नाही",
  "Wallet Balance": "वॉलेट शिल्लक",
  "GPS Captured: ": "जीपीएस कॅप्चर केले:",
  "Name": "नाव",
  "Capturing GPS Coordinates...": "GPS निर्देशांक कॅप्चर करत आहे...",
  "No audit logs found": "कोणतेही ऑडिट लॉग आढळले नाहीत",
  "Acreage (acres)": "एकर (एकर)",
  "Circular Economy Intake Form": "परिपत्रक अर्थव्यवस्था सेवन फॉर्म",
  "GPS Capture Failed": "GPS कॅप्चर अयशस्वी",
  "Database Connection Failed": "डेटाबेस कनेक्शन अयशस्वी",
  "Failed to get location. Please enter manually.": "स्थान मिळवण्यात अयशस्वी. कृपया व्यक्तिचलितपणे प्रविष्ट करा.",
  "e.g., Paddy, Wheat": "उदा., भात, गहू",
  "Active Queue": "सक्रिय रांग",
  "GPS Required": "GPS आवश्यक",
  "Farmer registered successfully! ID: ": "शेतकऱ्यांनी यशस्वी नोंदणी केली! आयडी:",
  "Geolocation is not supported by this browser.": "भौगोलिक स्थान या ब्राउझरद्वारे समर्थित नाही.",
  "Active Fleet": "सक्रिय फ्लीट",
  "Drivers Online": "ड्रायव्हर्स ऑनलाइन",
  "Failed to register farmer": "शेतकऱ्याची नोंदणी करण्यात अयशस्वी",
  "Retry GPS": "GPS पुन्हा प्रयत्न करा",
  "Total Capacity": "एकूण क्षमता",
  "Storage Utilization": "स्टोरेज वापर",
  "Utilization": "उपयोग",
  "Output Material": "आउटपुट साहित्य",
  "Biomass in Stock": "स्टॉक मध्ये बायोमास",
  "Current Load": "वर्तमान भार",
  "Available for Pickup": "पिकअपसाठी उपलब्ध",
  "Accept Pickup": "पिकअप स्वीकारा",
  "Incoming for Processing": "प्रक्रियेसाठी येणारे",
  "No new tasks available.": "कोणतीही नवीन कार्ये उपलब्ध नाहीत.",
  "Type": "प्रकार",
  "Value": "मूल्य",
  "MRV Status": "MRV स्थिती",
  "No records found for the selected filter.": "निवडलेल्या फिल्टरसाठी कोणतेही रेकॉर्ड आढळले नाहीत.",
  "Pending MRV": "प्रलंबित MRV",
  "Recently Processed": "अलीकडे प्रक्रिया केली",
  "No active tasks in your possession.": "तुमच्या ताब्यात कोणतीही सक्रिय कार्ये नाहीत.",
  "Timestamp": "टाईमस्टॅम्प",
  "Weight": "वजन",
  "Accept Receipt": "पावती स्वीकारा",
  "No MRV history found": "कोणताही MRV इतिहास आढळला नाही",
  "Low": "कमी",
  "No credits available": "कोणतेही क्रेडिट उपलब्ध नाहीत",
  "Details": "तपशील",
  "Record ID": "रेकॉर्ड आयडी",
  "Verified By": "द्वारे सत्यापित",
  "AI Risk": "AI धोका",
  "High": "उच्च",
  "Med": "मेड",
  "Check back later for newly verified CCCs.": "नवीन सत्यापित कार्बन क्रेडिटसाठी नंतर पुन्हा तपासा.",
  "I. Introduction": "I. परिचय",
  "Insufficient Funds": "अपुरा निधी",
  "Profile Settings": "प्रोफाइल सेटिंग्ज",
  "Verified": "सत्यापित",
  "Failed to update profile": "प्रोफाइल अपडेट करण्यात अयशस्वी",
  "An error occurred": "एक त्रुटी आली",
  "Purchase Credit": "खरेदी क्रेडिट",
  "Offset": "ऑफसेट",
  "The Foundational Structure and Operating Doctrine of RupayKg": "RupayKg ची पायाभूत रचना आणि ऑपरेटिंग सिद्धांत",
  "Profile updated successfully": "प्रोफाइल यशस्वीरित्या अपडेट केले",
  "Urban": "शहरी",
  "Rural": "ग्रामीण",
  "RupayKg has been established as a Unified Waste-to-CCC Digital Operating System designed to support India’s transition toward a compliance-based CCC market.": "RupayKg ची स्थापना एक युनिफाइड वेस्ट-टू-कार्बन डिजिटल ऑपरेटिंग सिस्टीम म्हणून करण्यात आली आहे, जी भारताच्या अनुपालन-आधारित कार्बन मार्केटकडे संक्रमणास समर्थन देण्यासाठी डिझाइन केलेली आहे.",
  "The platform addresses a structural gap in India’s CCC ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade CCC supply.": "प्लॅटफॉर्म भारताच्या कार्बन इकोसिस्टममधील स्ट्रक्चरल गॅपला संबोधित करतो: एका एकीकृत, नियामक-संरेखित डिजिटल पायाभूत सुविधांचा अभाव, जो सत्यापित कचरा वळवण्याला अनुपालन-ग्रेड कार्बन पुरवठ्यामध्ये रूपांतरित करण्यास सक्षम आहे.",
  "II. Unified Operating System Model": "II. युनिफाइड ऑपरेटिंग सिस्टम मॉडेल",
  "RupayKg is not structured as a project developer, CCC trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.": "RupayKg ची रचना प्रकल्प विकासक, कार्बन व्यापारी किंवा पुनर्वापर करणारी संस्था म्हणून केलेली नाही. हा एक पायाभूत सुविधा स्तर आहे जो शहरी आणि ग्रामीण प्रशासकीय फ्रेमवर्कमध्ये वास्तुशास्त्रीय डुप्लिकेशनशिवाय ऑपरेट करण्यासाठी डिझाइन केलेला आहे.",
  "Anchor": "अँकर",
  "Category": "श्रेणी",
  "Municipal Corp + Ward": "महानगरपालिका + प्रभाग",
  "Context": "संदर्भ",
  "The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.": "एग्रीगेटरची संरचनात्मकरित्या व्याख्या केली जाते विलीन केलेली संस्था जी संकलन आणि क्रमवारी प्रमाणीकरणासाठी जबाबदार असते, साखळी-ऑफ-कस्टडी पडताळणी सुलभ करते.",
  "Biomass-based fossil substitution": "बायोमास-आधारित जीवाश्म प्रतिस्थापन",
  "* All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.": "* सर्व ग्रामीण कृषी अवशेष आणि बायोमास क्रियाकलाप बायोमास अंतर्गत वर्गीकृत आहेत. कोणतेही वेगळे कृषी अनुलंब अस्तित्वात नाही.",
  "Gram Panchayat + Village": "ग्रामपंचायत + गाव",
  "CSR Contributors": "CSR योगदानकर्ते",
  "III. Unified Stakeholder Architecture": "III. युनिफाइड स्टेकहोल्डर आर्किटेक्चर",
  "IV. CCC Origination": "IV. कार्बन उत्पत्ती",
  "Producers (EPR)": "उत्पादक (ईपीआर)",
  "Methane avoidance through diversion": "वळवून मिथेन टाळणे",
  "Administrative Authority": "प्रशासकीय प्राधिकरण",
  "Recycler Rail": "रीसायकल रेल",
  "Recycling substitution": "पुनर्वापराचा पर्याय",
  "V. Multi-Rail Architecture": "V. मल्टी-रेल आर्किटेक्चर",
  "EPR Rail": "ईपीआर रेल",
  "VI. Regulator Sovereignty": "सहावा. नियामक सार्वभौमत्व",
  "CCC issuance authority remains regulator-controlled. RupayKg does not independently mint credits. All credits must be event-traceable, registry-compatible, and align with national CCC governance frameworks.": "कार्बन जारी करणारे प्राधिकरण नियामक-नियंत्रित राहते. RupayKg स्वतंत्रपणे क्रेडिट देत नाही. सर्व क्रेडिट्स इव्हेंट-ट्रेसेबल, नोंदणी-सुसंगत आणि राष्ट्रीय कार्बन गव्हर्नन्स फ्रेमवर्कसह संरेखित असणे आवश्यक आहे.",
  "CSR Rail": "सीएसआर रेल",
  "Governance Layer": "शासन स्तर",
  "CCC Rail": "कार्बन रेल",
  "VII. Strategic Position": "VII. धोरणात्मक स्थिती",
  "Article I — Unified Operating System": "लेख I - युनिफाइड ऑपरेटिंग सिस्टम",
  "Legally Styled": "कायदेशीर शैलीत",
  "When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated CCC value?": "जेव्हा आम्ही RupayKg बनवायला सुरुवात केली तेव्हा आम्ही रिसायकलिंगपासून सुरुवात केली नाही. आम्ही एका स्ट्रक्चरल प्रश्नापासून सुरुवात केली: कचऱ्याचे नियमन केलेल्या कार्बन व्हॅल्यूमध्ये रूपांतर करणारी कोणतीही एकीकृत पायाभूत सुविधा का नाही?",
  "— Founder, RupayKg": "- संस्थापक, RupayKg",
  "RupayKg was built to unify them. Not as a CCC trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.": "त्यांना एकत्र करण्यासाठी RupayKg बांधले गेले. कार्बन व्यापारी म्हणून नाही. रिसायकलिंग स्टार्टअप म्हणून नाही. परंतु संरचनात्मक डुप्लिकेशनशिवाय महापालिका प्रभाग स्तरावर आणि ग्रामपंचायत ग्राम स्तरावर काम करण्यास सक्षम एकल कार्यप्रणाली म्हणून.",
  "India is entering a compliance CCC era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.": "भारत एक अनुपालन कार्बन युगात प्रवेश करत आहे. महानगरपालिका यंत्रणा मोजता येण्याजोगे मिथेन तयार करतात. ग्रामीण बायोमास जाळला जातो किंवा कमी वापरला जातो. तरीही यंत्रणा खंडित राहतात.",
  "RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.": "RupayKg खालील अंतर्गत उपयोजित करण्यायोग्य एकल डिजिटल प्रणाली ऑपरेट करेल: (अ) महानगरपालिका + प्रभाग (शहरी संदर्भ) (ब) ग्रामपंचायत + गाव (ग्रामीण संदर्भ). संदर्भांमध्ये कोणतेही स्ट्रक्चरल डुप्लिकेशन अस्तित्वात नसावे.",
  "Waste is no longer disposal. It is governance-linked climate infrastructure.": "कचऱ्याची आता विल्हेवाट नाही. ही शासनाशी निगडीत हवामान पायाभूत सुविधा आहे.",
  "DECLARATION OF FOUNDATIONAL STRUCTURE": "पायाभूत संरचनेची घोषणा",
  "Article II — Unified Stakeholder Doctrine": "कलम II — युनिफाइड स्टेकहोल्डर डॉक्ट्रीन",
  "Article III — Waste Classification": "कलम III — कचरा वर्गीकरण",
  "CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs.": "कार्बन मिंट प्राधिकरण नियामक नियंत्रणाखाली राहील. RupayKg स्वतंत्रपणे कार्बन क्रेडिट जारी करणार नाही.",
  "The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, CCC Buyers, Regulator.": "भागधारकांची रचना देशभरात एकसमान राहील आणि त्यात खालील गोष्टींचा समावेश असेल: कचरा जनरेटर, एग्रीगेटर, प्रोसेसर, प्रशासकीय प्राधिकरण, उत्पादक (ईपीआर), CSR योगदानकर्ते, कार्बन खरेदीदार, नियामक.",
  "Institutional Identity": "संस्थात्मक ओळख",
  "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, CCC issuance. Double counting is prohibited.": "RupayKg यामधील कठोर पृथक्करण राखेल: रीसायकल अकाउंटिंग, CSR अकाउंटिंग, EPR अनुपालन, गव्हर्नन्स व्हॅल्यू, कार्बन जारी करणे. दुहेरी मोजणी करण्यास मनाई आहे.",
  "Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.": "कचऱ्याचे वर्गीकरण केवळ खालीलप्रमाणे केले जाईल: (अ) शहरी संदर्भात एमएसडब्ल्यू (ब) ग्रामीण संदर्भात बायोमास. सर्व कृषी अवशेष बायोमास अंतर्गत वर्गीकृत केले जातील.",
  "Article VI — Regulator Sovereignty": "अनुच्छेद VI — नियामक सार्वभौमत्व",
  "All emission reductions shall be processed through a single CCC calculation engine with event-level MRV validation.": "सर्व उत्सर्जन कमी करण्याची प्रक्रिया घटना-स्तरीय MRV प्रमाणीकरणासह एकाच कार्बन गणना इंजिनद्वारे केली जाईल.",
  "Article IV — CCC Engine": "कलम IV - कार्बन इंजिन",
  "Article V — Rail Separation": "कलम V — रेल्वे वेगळे करणे",
  "RupayKg is hereby defined as: A Unified Waste-to-CCC Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability.": "RupayKg ची याद्वारे व्याख्या केली आहे: एक युनिफाइड वेस्ट-टू-कार्बन इन्फ्रास्ट्रक्चर प्लॅटफॉर्म जो नियामक-संरेखित कार्बन उत्पत्ती क्षमतेसह एकल राष्ट्रीय स्टेकहोल्डर आर्किटेक्चर अंतर्गत कार्यरत आहे."
  } },
  ta: { translation: {
  "CCC Market": "கார்பன் சந்தை",
  "MRV Dashboard": "எம்ஆர்வி டாஷ்போர்டு",
  "Genesis": "ஆதியாகமம்",
  "History": "வரலாறு",
  "Upload Waste": "கழிவுகளை பதிவேற்றவும்",
  "Task Board": "பணிக்குழு",
  "Logout": "வெளியேறு",
  "National KPI": "தேசிய கேபிஐ",
  "Settings": "அமைப்புகள்",
  "Dashboard": "டாஷ்போர்டு",
  "Welcome back": "மீண்டும் வரவேற்கிறோம்",
  "Total Collected": "மொத்தம் சேகரிக்கப்பட்டது",
  "English": "ஆங்கிலம்",
  "System Overview": "கணினி மேலோட்டம்",
  "CCC Offset": "கார்பன் ஆஃப்செட்",
  "Hindi": "ஹிந்தி",
  "Language": "மொழி",
  "Farmers Registered": "விவசாயிகள் பதிவு செய்துள்ளனர்",
  "Community Rank": "சமூக தரவரிசை",
  "Total Earnings": "மொத்த வருவாய்",
  "Total Processed": "மொத்தம் செயலாக்கப்பட்டது",
  "Value Generated": "உருவாக்கப்பட்ட மதிப்பு",
  "Total Investment": "மொத்த முதலீடு",
  "Logistics Margin": "லாஜிஸ்டிக்ஸ் விளிம்பு",
  "Seed Demo Data": "விதை டெமோ தரவு",
  "Platform Statistics": "மேடை புள்ளிவிவரங்கள்",
  "ESG Score": "ESG மதிப்பெண்",
  "Fleet Efficiency": "கடற்படை திறன்",
  "CCCs": "கார்பன் கடன்கள்",
  "Processing Yield": "செயலாக்க விளைச்சல்",
  "Recent Activity": "சமீபத்திய செயல்பாடு",
  "Reset Demo Data": "டெமோ தரவை மீட்டமைக்கவும்",
  "Performance Analytics": "செயல்திறன் பகுப்பாய்வு",
  "CCCs Generated": "கார்பன் குறைக்கப்பட்டது",
  "Total Users": "மொத்த பயனர்கள்",
  "Total Value": "மொத்த மதிப்பு",
  "Waste Distribution": "கழிவு விநியோகம்",
  "Register New Farmer": "புதிய விவசாயியை பதிவு செய்யுங்கள்",
  "New Collection Record": "புதிய வசூல் சாதனை",
  "Total Weight": "மொத்த எடை",
  "New Intake Record": "புதிய உட்கொள்ளல் பதிவு",
  "Crop Type": "பயிர் வகை",
  "Farm Location": "பண்ணை இடம்",
  "New Processing Record": "புதிய செயலாக்க பதிவு",
  "Full Name": "முழுப் பெயர்",
  "Longitude": "தீர்க்கரேகை",
  "Get Current Location": "தற்போதைய இருப்பிடத்தைப் பெறுங்கள்",
  "Mobile Number": "மொபைல் எண்",
  "Land Area (Acres)": "நிலப்பரப்பு (ஏக்கர்)",
  "Latitude": "அட்சரேகை",
  "Foundational Doctrine": "அடிப்படைக் கோட்பாடு",
  "Processed": "செயலாக்கப்பட்டது",
  "Operations Management": "செயல்பாட்டு மேலாண்மை",
  "Transaction Ledger": "பரிவர்த்தனை லெட்ஜர்",
  "In Transit": "போக்குவரத்தில்",
  "Registering...": "பதிவு செய்கிறது...",
  "Register Farmer": "பதிவு விவசாயி",
  "Pending Pickup": "பிக்அப் நிலுவையில் உள்ளது",
  "Account Settings": "கணக்கு அமைப்புகள்",
  "All": "அனைத்து",
  "Estimated Value Breakdown": "மதிப்பிடப்பட்ட மதிப்பு முறிவு",
  "Weight (kg)": "எடை (கிலோ)",
  "Base Value (Recycler)": "அடிப்படை மதிப்பு (மறுசுழற்சி செய்பவர்)",
  "Location Confirmation (Google Maps)": "இருப்பிட உறுதிப்படுத்தல் (Google Maps)",
  "Processing...": "செயலாக்குகிறது...",
  "Verification Image": "சரிபார்ப்பு படம்",
  "CCC Value": "கார்பன் கடன் மதிப்பு",
  "Confirm Intake & Mint Value": "உட்கொள்ளல் மற்றும் புதினா மதிப்பை உறுதிப்படுத்தவும்",
  "Total Sovereign Value": "மொத்த இறையாண்மை மதிப்பு",
  "Waste Type": "கழிவு வகை",
  "How it Works": "இது எப்படி வேலை செய்கிறது",
  "Features": "அம்சங்கள்",
  "Launch OS": "OS ஐ இயக்கவும்",
  "RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.": "RupayKg என்பது பல இரயில் மதிப்பு இயந்திரம் மூலம் விவசாய, நகராட்சி மற்றும் தொழிற்சாலை கழிவுகளை பணமாக்குவதற்கு சமூகங்களுக்கு அதிகாரம் அளிக்கும் வட்ட பொருளாதார இயக்க முறைமையாகும்.",
  "Convert Every Kilogram of Waste into": "ஒவ்வொரு கிலோகிராம் கழிவுகளையும் மாற்றவும்",
  "Intake": "உட்கொள்ளல்",
  "Global Circular Value": "உலகளாவிய சுற்றறிக்கை மதிப்பு",
  "Sovereign-Grade Circular Economy Engine": "இறையாண்மை தர வட்ட பொருளாதார இயந்திரம்",
  "Access the OS": "OS ஐ அணுகவும்",
  "Ecosystem Roles": "சுற்றுச்சூழல் பாத்திரங்கள்",
  "Multi-Rail Value Engine": "மல்டி-ரயில் மதிப்பு இயந்திரம்",
  "Read Whitepaper": "வெள்ளை காகிதத்தைப் படியுங்கள்",
  "Rural Wealth Creation": "கிராமப்புற செல்வத்தை உருவாக்குதல்",
  "Live Stream": "நேரடி ஸ்ட்ரீம்",
  "Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.": "ஒரே நேரத்தில் மறுசுழற்சி, CSR, முனிசிபல், கார்பன் மற்றும் EPR தண்டவாளங்களில் இருந்து ஒவ்வொரு கிலோகிராம் உயிர்ப்பொருளின் மதிப்பைப் பிரித்தெடுக்கவும்.",
  "Live Network Impact": "நேரடி நெட்வொர்க் தாக்கம்",
  "Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.": "குடிமக்கள் பணப்பைகளுக்கு நேரடியாக நிதி வழங்குதல், சுற்றுச்சூழல் பொறுப்புகளை உள்ளூர்மயமாக்கப்பட்ட பொருளாதார வளர்ச்சியாக மாற்றுதல்.",
  "Real-time waste throughput across the RupayKg OS": "RupayKg OS முழுவதிலும் நிகழ்நேர கழிவுகள்",
  "AI-Verified Intake": "AI- சரிபார்க்கப்பட்ட உட்கொள்ளல்",
  "Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.": "கழிவு வகை, எடை மற்றும் புவி இருப்பிடம் ஆகியவற்றின் தானியங்கு சரிபார்ப்பு மாறாத, இறையாண்மை தர தரவு ஒருமைப்பாட்டை உறுதி செய்கிறது.",
  "Value Minted": "மதிப்பு அச்சிடப்பட்டது",
  "Distributed biomass collection nodes": "விநியோகிக்கப்பட்ட பயோமாஸ் சேகரிப்பு முனைகள்",
  "A seamless pipeline from waste generation to value realization.": "கழிவு உற்பத்தியிலிருந்து மதிப்பு உணர்தல் வரை தடையற்ற குழாய்.",
  "Active Nodes": "செயலில் முனைகள்",
  "Aggregate": "மொத்தமாக",
  "Aggregators verify, weigh, and transport waste to facilities.": "திரட்டிகள் சரிபார்த்து, எடைபோட்டு, கழிவுகளை வசதிகளுக்கு கொண்டு செல்கின்றனர்.",
  "Network Topology": "நெட்வொர்க் டோபாலஜி",
  "Generate": "உருவாக்கு",
  "nodes": "முனைகள்",
  "Citizens collect agricultural, municipal, or industrial waste.": "குடிமக்கள் விவசாய, நகராட்சி அல்லது தொழிற்சாலை கழிவுகளை சேகரிக்கின்றனர்.",
  "Mint Value": "புதினா மதிப்பு",
  "Smart contracts distribute funds across all 5 value rails.": "ஸ்மார்ட் ஒப்பந்தங்கள் அனைத்து 5 மதிப்பு ரெயில்களிலும் நிதியை விநியோகிக்கின்றன.",
  "Recyclers convert waste into usable materials or energy.": "மறுசுழற்சி செய்பவர்கள் கழிவுகளை பயன்படுத்தக்கூடிய பொருட்கள் அல்லது ஆற்றலாக மாற்றுகிறார்கள்.",
  "Choose your part in the circular economy.": "வட்டப் பொருளாதாரத்தில் உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்.",
  "Process": "செயல்முறை",
  "Instant wallet funding": "உடனடி பணப்பை நிதி",
  "Upload waste records": "கழிவுப் பதிவுகளைப் பதிவேற்றவும்",
  "Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.": "விவசாய, நகராட்சி அல்லது தொழிற்சாலை கழிவுகளை சேகரித்து வைப்பு. வழங்கப்பட்ட கழிவுகளின் எடை மற்றும் வகையின் அடிப்படையில் நேரடி வாலட் வைப்புகளைப் பெறுங்கள்.",
  "Citizen": "குடிமகன்",
  "Waste Generator": "கழிவு ஜெனரேட்டர்",
  "Route optimization data": "பாதை தேர்வுமுறை தரவு",
  "Collection & Transport": "சேகரிப்பு மற்றும் போக்குவரத்து",
  "Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.": "திரட்டப்பட்ட கழிவுகளைப் பெற்று, அதை இறுதிப் பொருட்களாக செயலாக்கவும். அனைத்து தண்டவாளங்களிலும் இறுதி மதிப்பு உணர்தலை தூண்டவும்.",
  "Processor": "செயலி",
  "Log collection batches": "பதிவு சேகரிப்பு தொகுதிகள்",
  "Track environmental impact": "சுற்றுச்சூழல் பாதிப்பைக் கண்காணிக்கவும்",
  "Aggregator": "திரட்டி",
  "Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.": "குடிமக்கள் வைப்புகளை சரிபார்க்கவும், கழிவுகளை ஒருங்கிணைக்கவும் மற்றும் செயலாக்க வசதிகளுக்கு பொருட்களை கொண்டு செல்ல தளவாடங்களை நிர்வகிக்கவும்.",
  "Recycler": "மறுசுழற்சி செய்பவர்",
  "Earn logistics margins": "லாஜிஸ்டிக்ஸ் மார்ஜின்களைப் பெறுங்கள்",
  "Circular Economy Operating System": "சுற்றறிக்கை பொருளாதார இயக்க முறைமை",
  "Register": "பதிவு செய்யுங்கள்",
  "Log processing yields": "பதிவு செயலாக்க விளைச்சல்",
  "Generate CCCs": "கார்பன் வரவுகளை உருவாக்கவும்",
  "Login": "உள்நுழைக",
  "Account Type": "கணக்கு வகை",
  "Access CSR/EPR funds": "CSR/EPR நிதிகளை அணுகவும்",
  "District": "மாவட்டம்",
  "Organization Name": "அமைப்பின் பெயர்",
  "Context:": "சூழல்:",
  "Password": "கடவுச்சொல்",
  "Create Account": "கணக்கை உருவாக்கவும்",
  "Global Impact Map": "உலகளாவிய தாக்க வரைபடம்",
  "Quick Demo Access": "விரைவான டெமோ அணுகல்",
  "Access OS": "OS ஐ அணுகவும்",
  "System Audit Logs": "கணினி தணிக்கை பதிவுகள்",
  "Phone Number": "தொலைபேசி எண்",
  "Back to Home": "முகப்புக்குத் திரும்பு",
  "Submission Heatmap": "சமர்ப்பிப்பு வெப்ப வரைபடம்",
  "State": "மாநிலம்",
  "No pending MRV records": "MRV பதிவுகள் எதுவும் நிலுவையில் இல்லை",
  "All processed waste has been verified.": "அனைத்து பதப்படுத்தப்பட்ட கழிவுகளும் சரிபார்க்கப்பட்டன.",
  "Portfolio Composition": "போர்ட்ஃபோலியோ கலவை",
  "MRV Verification Dashboard": "MRV சரிபார்ப்பு டாஷ்போர்டு",
  "Verify processed waste records to issue CCCs.": "கார்பன் வரவுகளை வழங்க செயலாக்கப்பட்ட கழிவுப் பதிவுகளைச் சரிபார்க்கவும்.",
  "Farmers Supported": "விவசாயிகள் ஆதரித்தனர்",
  "Waste Diverted": "கழிவுகள் திசை திருப்பப்பட்டன",
  "Total Offset": "மொத்த ஆஃப்செட்",
  "Impact Distribution": "தாக்கம் விநியோகம்",
  "Pending": "நிலுவையில் உள்ளது",
  "Location Verification": "இருப்பிட சரிபார்ப்பு",
  "AI Risk Score": "AI ரிஸ்க் ஸ்கோர்",
  "CCC Reduction": "CCC குறைப்பு",
  "Credit Value": "கடன் மதிப்பு",
  "Purchase verified CCCs to offset your footprint.": "உங்கள் தடயத்தை ஈடுகட்ட சரிபார்க்கப்பட்ட கார்பன் கிரெடிட்களை வாங்கவும்.",
  "Verify & Issue Credits": "சரிபார்த்து & கடன்களை வழங்கவும்",
  "Acreage": "பரப்பளவு",
  "Reject": "நிராகரிக்கவும்",
  "Available Credits": "கிடைக்கும் கடன்கள்",
  "Price per Tonne": "ஒரு டன் விலை",
  "Amount": "தொகை",
  "Cancel": "ரத்து செய்",
  "Your Offset Balance": "உங்கள் ஆஃப்செட் இருப்பு",
  "Project": "திட்டம்",
  "Total Cost": "மொத்த செலவு",
  "Confirm Purchase": "வாங்குவதை உறுதிப்படுத்தவும்",
  "Amount to Purchase (Tonnes)": "வாங்க வேண்டிய தொகை (டன்)",
  "Purchase Credits": "கொள்முதல் கடன்கள்",
  "Recent Transactions": "சமீபத்திய பரிவர்த்தனைகள்",
  "Status": "நிலை",
  "Ward Analytics": "வார்டு பகுப்பாய்வு",
  "Municipal Corporation": "முனிசிபல் கார்ப்பரேஷன்",
  "Ward-Level Analytics": "வார்டு-நிலை பகுப்பாய்வு",
  "Ward": "வார்டு",
  "Date": "தேதி",
  "National Dashboard": "தேசிய டாஷ்போர்டு",
  "Price": "விலை",
  "Network Active": "நெட்வொர்க் செயலில் உள்ளது",
  "MSW": "எம்.எஸ்.டபிள்யூ",
  "Biomass": "பயோமாஸ்",
  "Farmers / FPOs": "விவசாயிகள் / FPOக்கள்",
  "Village": "கிராமம்",
  "Citizens": "குடிமக்கள்",
  "Village Analytics": "கிராம பகுப்பாய்வு",
  "Citizen (MSW Generator)": "குடிமகன் (MSW ஜெனரேட்டர்)",
  "All Roles": "அனைத்து பாத்திரங்களும்",
  "Gram Panchayat": "கிராம பஞ்சாயத்து",
  "Village-Level Analytics": "கிராம அளவிலான பகுப்பாய்வு",
  "Farmer / FPO (Biomass Generator)": "விவசாயி / FPO (பயோமாஸ் ஜெனரேட்டர்)",
  "Processors": "செயலிகள்",
  "EPR Partners": "ஈபிஆர் பார்ட்னர்ஸ்",
  "CSR Partners": "CSR பார்ட்னர்கள்",
  "CCC Pool Status": "கார்பன் பூல் நிலை",
  "Audit Logs": "தணிக்கை பதிவுகள்",
  "Aggregators": "திரட்டிகள்",
  "User Management": "பயனர் மேலாண்மை",
  "Diverted": "திசை திருப்பப்பட்டது",
  "Fraud Alerts & Flagged Events": "மோசடி எச்சரிக்கைகள் & கொடியிடப்பட்ட நிகழ்வுகள்",
  "CCC Buyers": "கார்பன் வாங்குபவர்கள்",
  "Trees": "மரங்கள்",
  "Total Waste Events": "மொத்த கழிவு நிகழ்வுகள்",
  "Wallet Disbursed": "பணப்பை விநியோகிக்கப்பட்டது",
  "Environmental Impact": "சுற்றுச்சூழல் பாதிப்பு",
  "Water Saved": "தண்ணீர் சேமிக்கப்பட்டது",
  "Methane Avoided": "மீத்தேன் தவிர்க்கப்பட்டது",
  "Processed Events": "செயலாக்கப்பட்ட நிகழ்வுகள்",
  "Trees Equivalent": "மரங்கள் சமமானவை",
  "Growth & Impact Trends": "வளர்ச்சி மற்றும் தாக்கப் போக்குகள்",
  "Economic Efficiency": "பொருளாதார திறன்",
  "Avg Price / kg": "சராசரி விலை / கிலோ",
  "* Government savings calculated based on avoided landfill management and environmental remediation costs.": "* தவிர்க்கப்பட்ட குப்பை மேலாண்மை மற்றும் சுற்றுச்சூழல் திருத்தச் செலவுகளின் அடிப்படையில் அரசு சேமிப்பு கணக்கிடப்படுகிறது.",
  "Total Minted CCC Units": "மொத்த மின்னூட்டப்பட்ட கார்பன் அலகுகள்",
  "Govt Cost Savings": "அரசாங்க செலவு சேமிப்பு",
  "MRV Rejection Rate": "MRV நிராகரிப்பு விகிதம்",
  "Geospatial Fraud Distribution": "ஜியோஸ்பேஷியல் மோசடி விநியோகம்",
  "Processing Efficiency": "செயலாக்க திறன்",
  "Operational Health": "செயல்பாட்டு ஆரோக்கியம்",
  "No flagged events detected.": "கொடியிடப்பட்ட நிகழ்வுகள் எதுவும் கண்டறியப்படவில்லை.",
  "Waste Composition": "கழிவு கலவை",
  "User": "பயனர்",
  "Location": "இடம்",
  "Role": "பங்கு",
  "State Admin": "மாநில நிர்வாகி",
  "CSR Partner": "CSR பார்ட்னர்",
  "Wallet": "பணப்பை",
  "Regulator": "சீராக்கி",
  "Actions": "செயல்கள்",
  "Municipal Admin": "நகராட்சி நிர்வாகம்",
  "Super Admin": "சூப்பர் அட்மின்",
  "EPR Partner": "ஈபிஆர் பார்ட்னர்",
  "No audit logs available.": "தணிக்கை பதிவுகள் எதுவும் கிடைக்கவில்லை.",
  "User ID": "பயனர் ஐடி",
  "No ward data available.": "வார்டு தரவு இல்லை.",
  "Total Waste": "மொத்த கழிவு",
  "No users found.": "பயனர்கள் யாரும் இல்லை.",
  "Delete User": "பயனரை நீக்கு",
  "Action": "செயல்",
  "CCC Buyer": "கார்பன் வாங்குபவர்",
  "Total Events": "மொத்த நிகழ்வுகள்",
  "Add ₹10,000": "₹10,000 சேர்க்கவும்",
  "SMS Alerts": "எஸ்எம்எஸ் எச்சரிக்கைகள்",
  "Get instant SMS alerts for critical updates.": "முக்கியமான புதுப்பிப்புகளுக்கு உடனடி SMS விழிப்பூட்டல்களைப் பெறுங்கள்.",
  "Email Notifications": "மின்னஞ்சல் அறிவிப்புகள்",
  "Enable browser push notifications.": "உலாவி புஷ் அறிவிப்புகளை இயக்கவும்.",
  "Notification Preferences": "அறிவிப்பு விருப்பத்தேர்வுகள்",
  "Save Changes": "மாற்றங்களைச் சேமிக்கவும்",
  "Push Notifications": "புஷ் அறிவிப்புகள்",
  "Saving...": "சேமிக்கிறது...",
  "Receive updates about your transactions via email.": "மின்னஞ்சல் மூலம் உங்கள் பரிவர்த்தனைகள் பற்றிய அறிவிப்புகளைப் பெறவும்.",
  " Context (": "சூழல் (",
  "Type: ": "வகை:",
  "© 2026 RupayKg Circular Economy OS. All rights reserved.": "© 2026 RupayKg சர்குலர் எகானமி ஓஎஸ். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
  "FRAUD ALERT": "மோசடி எச்சரிக்கை",
  "Currently Active: ": "தற்போது செயலில் உள்ளது:",
  "How the Engine Works": "எஞ்சின் எப்படி வேலை செய்கிறது",
  "GENESIS": "ஆதியாகமம்",
  "Village: ": "கிராமம்:",
  "Value: ": "மதிப்பு:",
  "Weight: ": "எடை:",
  "urban": "நகர்ப்புற",
  "Privacy": "தனியுரிமை",
  "Admin": "நிர்வாகி",
  "Farmer": "விவசாயி",
  "National Regulator": "தேசிய கட்டுப்பாட்டாளர்",
  "Aggregator (Collection & Transport)": "திரட்டி (சேகரிப்பு மற்றும் போக்குவரத்து)",
  "RUPAYKG": "ரூபாய்கே.ஜி",
  "Processor (Recycler)": "செயலி (மறுசுழற்சி)",
  "rural": "கிராமப்புற",
  "Terms": "விதிமுறைகள்",
  "No audit logs found": "தணிக்கை பதிவுகள் எதுவும் கிடைக்கவில்லை",
  "Wallet Balance": "பணப்பை இருப்பு",
  "Name": "பெயர்",
  "GPS Capture Failed": "GPS பிடிப்பு தோல்வியடைந்தது",
  "No records found": "பதிவுகள் எதுவும் கிடைக்கவில்லை",
  "Acreage (acres)": "ஏக்கர் (ஏக்கர்)",
  "GPS Captured: ": "GPS கைப்பற்றப்பட்டது:",
  "Circular Economy Intake Form": "சுற்றறிக்கை பொருளாதார உட்கொள்ளல் படிவம்",
  "Capturing GPS Coordinates...": "ஜி.பி.எஸ் ஒருங்கிணைப்புகளைப் பிடிக்கிறது...",
  "Database Connection Failed": "தரவுத்தள இணைப்பு தோல்வியடைந்தது",
  "Drivers Online": "டிரைவர்கள் ஆன்லைன்",
  "Active Queue": "செயலில் வரிசை",
  "Failed to register farmer": "விவசாயியை பதிவு செய்ய முடியவில்லை",
  "Retry GPS": "GPS ஐ மீண்டும் முயற்சிக்கவும்",
  "Farmer registered successfully! ID: ": "விவசாயி பதிவு வெற்றிகரமாக! ஐடி:",
  "Geolocation is not supported by this browser.": "புவிஇருப்பிடத்தை இந்த உலாவி ஆதரிக்கவில்லை.",
  "GPS Required": "ஜிபிஎஸ் தேவை",
  "Active Fleet": "செயலில் உள்ள கடற்படை",
  "e.g., Paddy, Wheat": "எ.கா., நெல், கோதுமை",
  "Failed to get location. Please enter manually.": "இருப்பிடத்தைப் பெறுவதில் தோல்வி. கைமுறையாக உள்ளிடவும்.",
  "Biomass in Stock": "பயோமாஸ் இருப்பு",
  "Incoming for Processing": "செயலாக்கத்திற்கான உள்வரும்",
  "Accept Pickup": "பிக்கப்பை ஏற்கவும்",
  "Available for Pickup": "பிக்அப்பிற்கு கிடைக்கும்",
  "Current Load": "தற்போதைய சுமை",
  "No new tasks available.": "புதிய பணிகள் எதுவும் இல்லை.",
  "Utilization": "பயன்பாடு",
  "Storage Utilization": "சேமிப்பு பயன்பாடு",
  "Output Material": "வெளியீடு பொருள்",
  "Total Capacity": "மொத்த கொள்ளளவு",
  "Value": "மதிப்பு",
  "Timestamp": "நேர முத்திரை",
  "MRV Status": "எம்ஆர்வி நிலை",
  "Weight": "எடை",
  "Recently Processed": "சமீபத்தில் செயலாக்கப்பட்டது",
  "Accept Receipt": "ரசீதை ஏற்கவும்",
  "No active tasks in your possession.": "உங்கள் வசம் செயலில் உள்ள பணிகள் எதுவும் இல்லை.",
  "No records found for the selected filter.": "தேர்ந்தெடுக்கப்பட்ட வடிப்பானுக்கான பதிவுகள் எதுவும் இல்லை.",
  "Pending MRV": "நிலுவையில் உள்ள எம்.ஆர்.வி",
  "Type": "வகை",
  "No MRV history found": "MRV வரலாறு இல்லை",
  "High": "உயர்",
  "Low": "குறைந்த",
  "AI Risk": "AI ஆபத்து",
  "Med": "மருத்துவம்",
  "Record ID": "பதிவு ஐடி",
  "Check back later for newly verified CCCs.": "புதிதாக சரிபார்க்கப்பட்ட கார்பன் கிரெடிட்களுக்கு பிறகு பார்க்கவும்.",
  "Details": "விவரங்கள்",
  "Verified By": "மூலம் சரிபார்க்கப்பட்டது",
  "No credits available": "வரவுகள் இல்லை",
  "Profile updated successfully": "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
  "Insufficient Funds": "போதிய நிதி இல்லை",
  "I. Introduction": "I. அறிமுகம்",
  "An error occurred": "பிழை ஏற்பட்டது",
  "Verified": "சரிபார்க்கப்பட்டது",
  "Profile Settings": "சுயவிவர அமைப்புகள்",
  "Purchase Credit": "கொள்முதல் கடன்",
  "The Foundational Structure and Operating Doctrine of RupayKg": "ரூபேகேஜியின் அடித்தள அமைப்பு மற்றும் செயல்பாட்டுக் கோட்பாடு",
  "Failed to update profile": "சுயவிவரத்தைப் புதுப்பிக்க முடியவில்லை",
  "Offset": "ஆஃப்செட்",
  "RupayKg is not structured as a project developer, CCC trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.": "RupayKg திட்ட உருவாக்குபவர், கார்பன் வர்த்தகர் அல்லது மறுசுழற்சி நிறுவனமாக கட்டமைக்கப்படவில்லை. இது கட்டிடக்கலை நகல் இல்லாமல் நகர்ப்புற மற்றும் கிராமப்புற நிர்வாக கட்டமைப்பில் செயல்பட வடிவமைக்கப்பட்ட உள்கட்டமைப்பு அடுக்கு ஆகும்.",
  "The platform addresses a structural gap in India’s CCC ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade CCC supply.": "இந்தியாவின் கார்பன் சுற்றுச்சூழல் அமைப்பில் உள்ள கட்டமைப்பு இடைவெளியை இந்த தளம் நிவர்த்தி செய்கிறது: சரிபார்க்கப்பட்ட கழிவுத் திசைதிருப்பலை இணக்க-தர கார்பன் விநியோகமாக மாற்றும் திறன் கொண்ட ஒரு ஒருங்கிணைந்த, ஒழுங்குபடுத்தப்பட்ட டிஜிட்டல் உள்கட்டமைப்பு இல்லாதது.",
  "II. Unified Operating System Model": "II. ஒருங்கிணைந்த இயக்க முறைமை மாதிரி",
  "Rural": "கிராமப்புறம்",
  "Urban": "நகர்ப்புறம்",
  "Category": "வகை",
  "Anchor": "நங்கூரம்",
  "RupayKg has been established as a Unified Waste-to-CCC Digital Operating System designed to support India’s transition toward a compliance-based CCC market.": "இணக்க அடிப்படையிலான கார்பன் சந்தையை நோக்கிய இந்தியாவின் மாற்றத்தை ஆதரிக்க வடிவமைக்கப்பட்ட ஒரு ஒருங்கிணைந்த கழிவு-கார்பன் டிஜிட்டல் இயக்க முறைமையாக RupayKg நிறுவப்பட்டுள்ளது.",
  "Context": "சூழல்",
  "Municipal Corp + Ward": "முனிசிபல் கார்ப் + வார்டு",
  "The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.": "திரட்டி என்பது, சேகரிப்பு மற்றும் வரிசைப்படுத்துதல் சரிபார்ப்பு, சங்கிலி-காவல் சரிபார்ப்பை எளிதாக்குதல் ஆகியவற்றிற்கு பொறுப்பான ஒன்றிணைந்த நிறுவனமாக கட்டமைப்பு ரீதியாக வரையறுக்கப்படுகிறது.",
  "Methane avoidance through diversion": "திசை திருப்புவதன் மூலம் மீத்தேன் தவிர்ப்பு",
  "CSR Contributors": "CSR பங்களிப்பாளர்கள்",
  "Gram Panchayat + Village": "கிராம பஞ்சாயத்து + கிராமம்",
  "III. Unified Stakeholder Architecture": "III. ஒருங்கிணைந்த பங்குதாரர் கட்டிடக்கலை",
  "Producers (EPR)": "தயாரிப்பாளர்கள் (EPR)",
  "IV. CCC Origination": "IV. கார்பன் தோற்றம்",
  "Administrative Authority": "நிர்வாக அதிகாரம்",
  "Biomass-based fossil substitution": "பயோமாஸ் அடிப்படையிலான புதைபடிவ மாற்றீடு",
  "* All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.": "* அனைத்து கிராமப்புற விவசாய எச்சங்கள் மற்றும் உயிர்ப்பொருள் செயல்பாடுகள் உயிர்ப்பொருளின் கீழ் வகைப்படுத்தப்பட்டுள்ளன. தனி விவசாய செங்குத்து இல்லை.",
  "V. Multi-Rail Architecture": "V. மல்டி-ரயில் கட்டிடக்கலை",
  "Recycler Rail": "மறுசுழற்சி ரயில்",
  "VII. Strategic Position": "VII. மூலோபாய நிலை",
  "Governance Layer": "ஆளுகை அடுக்கு",
  "CCC Rail": "கார்பன் ரயில்",
  "EPR Rail": "ஈபிஆர் ரயில்",
  "CCC issuance authority remains regulator-controlled. RupayKg does not independently mint credits. All credits must be event-traceable, registry-compatible, and align with national CCC governance frameworks.": "கார்பன் வெளியீட்டு ஆணையம் கட்டுப்பாட்டாளர் கட்டுப்பாட்டில் உள்ளது. RupayKg சுயாதீனமாக வரவுகளை வழங்காது. அனைத்து வரவுகளும் நிகழ்வு-கண்டுபிடிக்கக்கூடியதாக இருக்க வேண்டும், பதிவேட்டில் இணக்கமாக இருக்க வேண்டும் மற்றும் தேசிய கார்பன் ஆளுகை கட்டமைப்புகளுடன் சீரமைக்க வேண்டும்.",
  "Recycling substitution": "மறுசுழற்சி மாற்றீடு",
  "VI. Regulator Sovereignty": "VI. ஒழுங்குபடுத்துபவர் இறையாண்மை",
  "CSR Rail": "சிஎஸ்ஆர் ரயில்",
  "India is entering a compliance CCC era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.": "இந்தியா இணக்கமான கார்பன் சகாப்தத்தில் நுழைகிறது. நகராட்சி அமைப்புகள் அளவிடக்கூடிய மீத்தேன் உற்பத்தி செய்கின்றன. கிராமப்புற உயிர்மங்கள் எரிக்கப்படுகின்றன அல்லது குறைவாகப் பயன்படுத்தப்படுகின்றன. இன்னும் அமைப்புகள் துண்டு துண்டாக உள்ளன.",
  "RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.": "RupayKg கீழ் பயன்படுத்தக்கூடிய ஒற்றை டிஜிட்டல் அமைப்பை இயக்கும்: (அ) முனிசிபல் கார்ப்பரேஷன் + வார்டு (நகர்ப்புற சூழல்) (ஆ) கிராம பஞ்சாயத்து + கிராமம் (கிராமப்புற சூழல்). சூழல்களுக்கு இடையே கட்டமைப்பு ரீதியான நகல் எதுவும் இருக்கக்கூடாது.",
  "Article I — Unified Operating System": "கட்டுரை I — ஒருங்கிணைந்த இயக்க முறைமை",
  "Waste is no longer disposal. It is governance-linked climate infrastructure.": "கழிவுகள் இனி அகற்றப்படுவதில்லை. இது நிர்வாகத்துடன் இணைக்கப்பட்ட காலநிலை உள்கட்டமைப்பு ஆகும்.",
  "When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated CCC value?": "நாங்கள் RupayKg ஐ உருவாக்கத் தொடங்கியபோது, ​​மறுசுழற்சி செய்வதில் நாங்கள் தொடங்கவில்லை. நாங்கள் ஒரு கட்டமைப்பு கேள்வியுடன் தொடங்கினோம்: கழிவுகளை ஒழுங்குபடுத்தப்பட்ட கார்பன் மதிப்பாக மாற்றும் ஒருங்கிணைந்த உள்கட்டமைப்பு ஏன் இல்லை?",
  "— Founder, RupayKg": "- நிறுவனர், ரூபாய்கேஜி",
  "RupayKg was built to unify them. Not as a CCC trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.": "அவர்களை ஒருங்கிணைக்க ரூபாய்கேஜி கட்டப்பட்டது. கார்பன் வர்த்தகராக அல்ல. மறுசுழற்சி தொடக்கமாக அல்ல. ஆனால் ஒரே இயக்க முறைமையாக, நகராட்சி வார்டு அளவிலும், கிராம பஞ்சாயத்து கிராம அளவிலும் கட்டமைப்பு ரீதியிலான நகல் இல்லாமல் வேலை செய்யும் திறன் கொண்டது.",
  "Article II — Unified Stakeholder Doctrine": "கட்டுரை II — ஒருங்கிணைந்த பங்குதாரர் கோட்பாடு",
  "Legally Styled": "சட்டப்படி பாணியில்",
  "DECLARATION OF FOUNDATIONAL STRUCTURE": "அடிப்படைக் கட்டமைப்பின் பிரகடனம்",
  "The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, CCC Buyers, Regulator.": "பங்குதாரர் அமைப்பு நாடு முழுவதும் ஒரே மாதிரியாக இருக்கும் மற்றும் பின்வருவனவற்றை உள்ளடக்கியது: கழிவு ஜெனரேட்டர், திரட்டி, செயலி, நிர்வாக ஆணையம், உற்பத்தியாளர்கள் (EPR), CSR பங்களிப்பாளர்கள், கார்பன் வாங்குபவர்கள், ஒழுங்குபடுத்துபவர்.",
  "Article VI — Regulator Sovereignty": "கட்டுரை VI - ஒழுங்குபடுத்துபவர் இறையாண்மை",
  "CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs.": "கார்பன் மின்ட் ஆணையம் கட்டுப்பாட்டாளர் கட்டுப்பாட்டின் கீழ் இருக்கும். RupayKg சுயாதீனமாக கார்பன் கடன்களை வழங்காது.",
  "Article III — Waste Classification": "கட்டுரை III - கழிவு வகைப்பாடு",
  "Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.": "கழிவுகள் பிரத்தியேகமாக வகைப்படுத்தப்படும்: (அ) நகர்ப்புற சூழலில் MSW (b) கிராமப்புற சூழலில் உயிர்ப்பொருள். அனைத்து விவசாய எச்சங்களும் பயோமாஸின் கீழ் வகைப்படுத்தப்படும்.",
  "Article V — Rail Separation": "கட்டுரை V - ரயில் பிரிப்பு",
  "All emission reductions shall be processed through a single CCC calculation engine with event-level MRV validation.": "அனைத்து உமிழ்வு குறைப்புகளும் நிகழ்வு-நிலை MRV சரிபார்ப்புடன் ஒற்றை கார்பன் கணக்கீட்டு இயந்திரம் மூலம் செயலாக்கப்படும்.",
  "Institutional Identity": "நிறுவன அடையாளம்",
  "Article IV — CCC Engine": "கட்டுரை IV - கார்பன் எஞ்சின்",
  "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, CCC issuance. Double counting is prohibited.": "மறுசுழற்சி கணக்கியல், CSR கணக்கியல், EPR இணக்கம், ஆளுகை மதிப்பு, கார்பன் வெளியீடு ஆகியவற்றுக்கு இடையே RupayKg கடுமையான பிரிவினையை பராமரிக்க வேண்டும். இருமுறை எண்ணுவது தடைசெய்யப்பட்டுள்ளது.",
  "RupayKg is hereby defined as: A Unified Waste-to-CCC Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability.": "RupayKg என்பது இதன் மூலம் வரையறுக்கப்படுகிறது: ஒரு ஒருங்கிணைந்த கழிவு-கார்பன் உள்கட்டமைப்பு தளம், ஒழுங்குபடுத்தும்-சீரமைக்கப்பட்ட கார்பன் தோற்றுவிக்கும் திறனுடன் ஒரு தேசிய பங்குதாரர் கட்டமைப்பின் கீழ் இயங்குகிறது."
  } },
  ur: { translation: {
  "Settings": "ترتیبات",
  "Logout": "لاگ آؤٹ",
  "MRV Dashboard": "ایم آر وی ڈیش بورڈ",
  "History": "تاریخ",
  "National KPI": "نیشنل کے پی آئی",
  "Genesis": "پیدائش",
  "Task Board": "ٹاسک بورڈ",
  "Upload Waste": "فضلہ اپ لوڈ کریں۔",
  "Dashboard": "ڈیش بورڈ",
  "CCC Market": "کاربن مارکیٹ",
  "System Overview": "سسٹم کا جائزہ",
  "Language": "زبان",
  "CCC Offset": "کاربن آفسیٹ",
  "Hindi": "ہندی",
  "Welcome back": "دوبارہ خوش آمدید",
  "Farmers Registered": "کسان رجسٹرڈ",
  "Total Earnings": "کل آمدنی",
  "English": "انگریزی",
  "Total Collected": "کل جمع",
  "Community Rank": "کمیونٹی رینک",
  "Logistics Margin": "لاجسٹک مارجن",
  "CCCs": "کاربن کریڈٹس",
  "Total Processed": "ٹوٹل پروسیسڈ",
  "Processing Yield": "پروسیسنگ پیداوار",
  "Seed Demo Data": "سیڈ ڈیمو ڈیٹا",
  "ESG Score": "ESG سکور",
  "Platform Statistics": "پلیٹ فارم کے اعدادوشمار",
  "Fleet Efficiency": "فلیٹ کی کارکردگی",
  "Total Investment": "کل سرمایہ کاری",
  "Value Generated": "ویلیو جنریٹڈ",
  "Reset Demo Data": "ڈیمو ڈیٹا کو دوبارہ ترتیب دیں۔",
  "Recent Activity": "حالیہ سرگرمی",
  "New Collection Record": "نیا مجموعہ ریکارڈ",
  "Total Weight": "کل وزن",
  "Register New Farmer": "نئے کسان کو رجسٹر کریں۔",
  "Total Users": "کل صارفین",
  "Waste Distribution": "فضلہ کی تقسیم",
  "CCCs Generated": "کاربن میں کمی",
  "Performance Analytics": "کارکردگی کے تجزیات",
  "Total Value": "کل قدر",
  "Farm Location": "فارم کا مقام",
  "Full Name": "پورا نام",
  "Mobile Number": "موبائل نمبر",
  "Latitude": "عرض بلد",
  "Get Current Location": "موجودہ مقام حاصل کریں۔",
  "New Intake Record": "نیا انٹیک ریکارڈ",
  "Land Area (Acres)": "اراضی کا رقبہ (ایکڑ)",
  "Crop Type": "فصل کی قسم",
  "Longitude": "طول البلد",
  "New Processing Record": "نیا پروسیسنگ ریکارڈ",
  "Transaction Ledger": "ٹرانزیکشن لیجر",
  "Processed": "پروسیس شدہ",
  "Account Settings": "اکاؤنٹ کی ترتیبات",
  "Registering...": "رجسٹر ہو رہا ہے...",
  "Foundational Doctrine": "بنیادی نظریہ",
  "All": "تمام",
  "Operations Management": "آپریشنز مینجمنٹ",
  "Pending Pickup": "زیر التواء پک اپ",
  "Register Farmer": "فارمر کو رجسٹر کریں۔",
  "In Transit": "ٹرانزٹ میں",
  "Waste Type": "فضلہ کی قسم",
  "CCC Value": "کاربن کریڈٹ ویلیو",
  "Base Value (Recycler)": "بنیادی قدر (ری سائیکلر)",
  "Estimated Value Breakdown": "تخمینی قدر کی خرابی",
  "Verification Image": "تصدیقی تصویر",
  "Location Confirmation (Google Maps)": "مقام کی تصدیق (Google Maps)",
  "Confirm Intake & Mint Value": "انٹیک اور ٹکسال کی قیمت کی تصدیق کریں۔",
  "Processing...": "پروسیسنگ...",
  "Total Sovereign Value": "کل خودمختار قدر",
  "Weight (kg)": "وزن (کلوگرام)",
  "Ecosystem Roles": "ماحولیاتی نظام کے کردار",
  "How it Works": "یہ کیسے کام کرتا ہے۔",
  "Global Circular Value": "عالمی سرکلر ویلیو",
  "Access the OS": "OS تک رسائی حاصل کریں۔",
  "RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.": "RupayKg ایک سرکلر اکانومی آپریٹنگ سسٹم ہے جو کمیونٹیز کو ایک ملٹی ریل ویلیو انجن کے ذریعے زرعی، میونسپل اور صنعتی فضلے سے رقم کمانے کے لیے بااختیار بناتا ہے۔",
  "Convert Every Kilogram of Waste into": "ہر کلو گرام فضلہ کو میں تبدیل کریں۔",
  "Intake": "انٹیک",
  "Features": "خصوصیات",
  "Sovereign-Grade Circular Economy Engine": "خودمختار-گریڈ سرکلر اکانومی انجن",
  "Launch OS": "OS شروع کریں۔",
  "Live Network Impact": "لائیو نیٹ ورک کا اثر",
  "Real-time waste throughput across the RupayKg OS": "RupayKg OS میں ریئل ٹائم ویسٹ تھرو پٹ",
  "Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.": "ماحولیاتی ذمہ داریوں کو مقامی معاشی ترقی میں تبدیل کرتے ہوئے شہریوں کے بٹوے میں براہ راست فنڈز تقسیم کریں۔",
  "Rural Wealth Creation": "دیہی دولت کی تخلیق",
  "Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.": "بیک وقت ری سائیکلر، سی ایس آر، میونسپل، کاربن، اور ای پی آر ریلوں سے ہر کلوگرام بائیو ماس پروسیس شدہ قیمت نکالیں۔",
  "Multi-Rail Value Engine": "ملٹی ریل ویلیو انجن",
  "AI-Verified Intake": "AI- تصدیق شدہ انٹیک",
  "Live Stream": "لائیو سلسلہ",
  "Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.": "فضلہ کی قسم، وزن، اور جغرافیائی محل وقوع کی خودکار تصدیق ناقابل تغیر، خودمختار درجے کے ڈیٹا کی سالمیت کو یقینی بناتی ہے۔",
  "Read Whitepaper": "وائٹ پیپر پڑھیں",
  "Generate": "پیدا کریں۔",
  "Value Minted": "ویلیو منٹڈ",
  "Network Topology": "نیٹ ورک ٹوپولوجی",
  "Citizens collect agricultural, municipal, or industrial waste.": "شہری زرعی، میونسپل، یا صنعتی فضلہ جمع کرتے ہیں۔",
  "nodes": "نوڈس",
  "Active Nodes": "ایکٹو نوڈس",
  "Aggregators verify, weigh, and transport waste to facilities.": "جمع کرنے والے فضلے کی تصدیق، وزن اور سہولیات تک پہنچاتے ہیں۔",
  "Distributed biomass collection nodes": "بایڈماس کلیکشن نوڈس تقسیم کیے گئے۔",
  "Aggregate": "مجموعی",
  "A seamless pipeline from waste generation to value realization.": "فضلہ کی پیداوار سے قدر کی وصولی تک ایک ہموار پائپ لائن۔",
  "Waste Generator": "ویسٹ جنریٹر",
  "Recyclers convert waste into usable materials or energy.": "ری سائیکلرز فضلہ کو قابل استعمال مواد یا توانائی میں تبدیل کرتے ہیں۔",
  "Mint Value": "پودینہ ویلیو",
  "Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.": "زرعی، میونسپل، یا صنعتی فضلہ جمع اور جمع کریں۔ وزن اور فراہم کردہ فضلہ کی قسم کی بنیاد پر براہ راست والٹ ڈپازٹ حاصل کریں۔",
  "Choose your part in the circular economy.": "سرکلر اکانومی میں اپنا حصہ منتخب کریں۔",
  "Process": "عمل",
  "Upload waste records": "فضلہ کے ریکارڈ اپ لوڈ کریں۔",
  "Citizen": "شہری",
  "Smart contracts distribute funds across all 5 value rails.": "اسمارٹ کنٹریکٹس تمام 5 ویلیو ریلوں میں فنڈز تقسیم کرتے ہیں۔",
  "Instant wallet funding": "فوری بٹوے کی فنڈنگ",
  "Collection & Transport": "جمع اور نقل و حمل",
  "Track environmental impact": "ماحولیاتی اثرات کو ٹریک کریں۔",
  "Route optimization data": "روٹ آپٹیمائزیشن ڈیٹا",
  "Log collection batches": "لاگ کلیکشن بیچز",
  "Earn logistics margins": "لاجسٹک مارجن حاصل کریں۔",
  "Recycler": "ری سائیکلر",
  "Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.": "شہریوں کے ذخائر کی تصدیق کریں، فضلہ کو مضبوط کریں، اور سامان کو پروسیسنگ کی سہولیات تک پہنچانے کے لیے لاجسٹکس کا انتظام کریں۔",
  "Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.": "مجموعی فضلہ وصول کریں اور اسے حتمی مصنوعات میں پروسیس کریں۔ تمام ریلوں میں حتمی قدر کی وصولی کو متحرک کریں۔",
  "Aggregator": "جمع کرنے والا",
  "Processor": "پروسیسر",
  "Login": "لاگ ان",
  "Context:": "سیاق و سباق:",
  "District": "ضلع",
  "Circular Economy Operating System": "سرکلر اکانومی آپریٹنگ سسٹم",
  "Log processing yields": "لاگ پروسیسنگ کی پیداوار",
  "Register": "رجسٹر کریں۔",
  "Generate CCCs": "کاربن کریڈٹ تیار کریں۔",
  "Organization Name": "تنظیم کا نام",
  "Account Type": "اکاؤنٹ کی قسم",
  "Access CSR/EPR funds": "CSR/EPR فنڈز تک رسائی حاصل کریں۔",
  "Password": "پاس ورڈ",
  "State": "ریاست",
  "Back to Home": "واپس گھر پر",
  "System Audit Logs": "سسٹم آڈٹ لاگز",
  "Submission Heatmap": "جمع کرانے کا ہیٹ میپ",
  "Access OS": "OS تک رسائی حاصل کریں۔",
  "Create Account": "اکاؤنٹ بنائیں",
  "Quick Demo Access": "فوری ڈیمو رسائی",
  "Global Impact Map": "عالمی اثرات کا نقشہ",
  "Phone Number": "فون نمبر",
  "Pending": "زیر التواء",
  "Verify processed waste records to issue CCCs.": "کاربن کریڈٹ جاری کرنے کے لیے عمل شدہ فضلہ کے ریکارڈ کی تصدیق کریں۔",
  "All processed waste has been verified.": "تمام پروسیس شدہ فضلہ کی تصدیق ہو چکی ہے۔",
  "No pending MRV records": "کوئی زیر التواء MRV ریکارڈ نہیں ہے۔",
  "MRV Verification Dashboard": "MRV تصدیقی ڈیش بورڈ",
  "Farmers Supported": "کسانوں کی حمایت",
  "Total Offset": "ٹوٹل آفسیٹ",
  "Impact Distribution": "اثر کی تقسیم",
  "Waste Diverted": "فضلہ موڑ دیا گیا۔",
  "Portfolio Composition": "پورٹ فولیو کمپوزیشن",
  "Available Credits": "دستیاب کریڈٹس",
  "CCC Reduction": "CCC کی کمی",
  "Purchase verified CCCs to offset your footprint.": "اپنے فٹ پرنٹ کو آفسیٹ کرنے کے لیے تصدیق شدہ کاربن کریڈٹ خریدیں۔",
  "Acreage": "رقبہ",
  "Verify & Issue Credits": "تصدیق کریں اور کریڈٹ جاری کریں۔",
  "Credit Value": "کریڈٹ ویلیو",
  "Reject": "رد کرنا",
  "AI Risk Score": "AI رسک اسکور",
  "Location Verification": "مقام کی توثیق",
  "Your Offset Balance": "آپ کا آفسیٹ بیلنس",
  "Project": "پروجیکٹ",
  "Total Cost": "کل لاگت",
  "Confirm Purchase": "خریداری کی تصدیق کریں۔",
  "Price per Tonne": "فی ٹن قیمت",
  "Amount to Purchase (Tonnes)": "خریداری کی رقم (ٹن)",
  "Purchase Credits": "کریڈٹ خریدیں۔",
  "Recent Transactions": "حالیہ لین دین",
  "Cancel": "منسوخ کریں۔",
  "Amount": "رقم",
  "Status": "حیثیت",
  "National Dashboard": "قومی ڈیش بورڈ",
  "Price": "قیمت",
  "Date": "تاریخ",
  "Ward Analytics": "وارڈ تجزیات",
  "Municipal Corporation": "میونسپل کارپوریشن",
  "Ward": "وارڈ",
  "MSW": "ایم ایس ڈبلیو",
  "Network Active": "نیٹ ورک ایکٹو",
  "Ward-Level Analytics": "وارڈ لیول کے تجزیات",
  "Farmers / FPOs": "کسان / ایف پی او",
  "Village-Level Analytics": "گاؤں کی سطح کے تجزیات",
  "Biomass": "بایوماس",
  "Village": "گاؤں",
  "Citizen (MSW Generator)": "شہری (MSW جنریٹر)",
  "Citizens": "شہریوں",
  "All Roles": "تمام کردار",
  "Farmer / FPO (Biomass Generator)": "کسان / ایف پی او (بایوماس جنریٹر)",
  "Village Analytics": "گاؤں کے تجزیات",
  "Gram Panchayat": "گرام پنچایت",
  "Processors": "پروسیسرز",
  "CSR Partners": "سی ایس آر پارٹنرز",
  "CCC Buyers": "کاربن خریدار",
  "EPR Partners": "ای پی آر پارٹنرز",
  "Aggregators": "جمع کرنے والے",
  "User Management": "یوزر مینجمنٹ",
  "Audit Logs": "آڈٹ لاگز",
  "Diverted": "موڑ دیا گیا۔",
  "CCC Pool Status": "کاربن پول کی حیثیت",
  "Fraud Alerts & Flagged Events": "فراڈ الرٹس اور جھنڈے والے واقعات",
  "Methane Avoided": "میتھین سے اجتناب",
  "Economic Efficiency": "اقتصادی کارکردگی",
  "Total Waste Events": "ٹوٹل ویسٹ ایونٹس",
  "Environmental Impact": "ماحولیاتی اثرات",
  "Trees Equivalent": "درختوں کے برابر",
  "Processed Events": "پروسیس شدہ واقعات",
  "Trees": "درخت",
  "Wallet Disbursed": "پرس تقسیم کیا گیا۔",
  "Water Saved": "پانی بچایا",
  "Growth & Impact Trends": "نمو اور اثرات کے رجحانات",
  "No flagged events detected.": "کسی جھنڈے والے واقعات کا پتہ نہیں چلا۔",
  "* Government savings calculated based on avoided landfill management and environmental remediation costs.": "* گریز لینڈ فل مینجمنٹ اور ماحولیاتی تدارک کے اخراجات کی بنیاد پر حکومتی بچت کا حساب لگایا جاتا ہے۔",
  "Operational Health": "آپریشنل ہیلتھ",
  "Processing Efficiency": "پروسیسنگ کی کارکردگی",
  "Avg Price / kg": "اوسط قیمت / کلو",
  "MRV Rejection Rate": "MRV مسترد ہونے کی شرح",
  "Waste Composition": "فضلہ کی ترکیب",
  "Geospatial Fraud Distribution": "جغرافیائی فراڈ کی تقسیم",
  "Total Minted CCC Units": "کل ٹکسال کاربن یونٹس",
  "Govt Cost Savings": "حکومتی لاگت کی بچت",
  "Wallet": "پرس",
  "Actions": "اعمال",
  "Location": "مقام",
  "Municipal Admin": "میونسپل ایڈمن",
  "User": "صارف",
  "CSR Partner": "سی ایس آر پارٹنر",
  "Role": "کردار",
  "Regulator": "ریگولیٹر",
  "State Admin": "ریاستی منتظم",
  "Super Admin": "سپر ایڈمن",
  "No ward data available.": "وارڈ کا کوئی ڈیٹا دستیاب نہیں ہے۔",
  "No audit logs available.": "کوئی آڈٹ لاگ دستیاب نہیں ہے۔",
  "User ID": "یوزر آئی ڈی",
  "EPR Partner": "ای پی آر پارٹنر",
  "Action": "ایکشن",
  "Delete User": "صارف کو حذف کریں۔",
  "CCC Buyer": "کاربن خریدار",
  "No users found.": "کوئی صارف نہیں ملا۔",
  "Total Waste": "ٹوٹل ویسٹ",
  "Total Events": "کل واقعات",
  "Push Notifications": "پش اطلاعات",
  "Email Notifications": "ای میل اطلاعات",
  "Enable browser push notifications.": "براؤزر پش اطلاعات کو فعال کریں۔",
  "SMS Alerts": "ایس ایم ایس الرٹس",
  "Get instant SMS alerts for critical updates.": "اہم اپ ڈیٹس کے لیے فوری SMS الرٹس حاصل کریں۔",
  "Saving...": "محفوظ کر رہا ہے...",
  "Save Changes": "تبدیلیاں محفوظ کریں۔",
  "Receive updates about your transactions via email.": "ای میل کے ذریعے اپنے لین دین کے بارے میں اپ ڈیٹس حاصل کریں۔",
  "Add ₹10,000": "₹10,000 شامل کریں۔",
  "Notification Preferences": "اطلاع کی ترجیحات",
  "FRAUD ALERT": "فراڈ الرٹ",
  "GENESIS": "GENESIS",
  "Weight: ": "وزن:",
  "Currently Active: ": "فی الحال فعال:",
  "How the Engine Works": "انجن کیسے کام کرتا ہے۔",
  "Village: ": "گاؤں:",
  "Value: ": "قدر:",
  "© 2026 RupayKg Circular Economy OS. All rights reserved.": "© 2026 RupayKg سرکلر اکانومی OS۔ جملہ حقوق محفوظ ہیں۔",
  " Context (": "سیاق و سباق (",
  "Type: ": "قسم:",
  "Terms": "شرائط",
  "Admin": "ایڈمن",
  "rural": "دیہی",
  "RUPAYKG": "RUPAYKG",
  "Farmer": "کسان",
  "Aggregator (Collection & Transport)": "جمع کرنے والا (مجموعہ اور نقل و حمل)",
  "Processor (Recycler)": "پروسیسر (ری سائیکلر)",
  "Privacy": "رازداری",
  "urban": "شہری",
  "National Regulator": "نیشنل ریگولیٹر",
  "Name": "نام",
  "GPS Capture Failed": "GPS کیپچر ناکام ہو گیا۔",
  "No records found": "کوئی ریکارڈ نہیں ملا",
  "Acreage (acres)": "رقبہ (ایکڑ)",
  "Wallet Balance": "والیٹ بیلنس",
  "No audit logs found": "کوئی آڈٹ لاگز نہیں ملے",
  "Circular Economy Intake Form": "سرکلر اکانومی انٹیک فارم",
  "Database Connection Failed": "ڈیٹا بیس کنکشن ناکام ہو گیا۔",
  "Capturing GPS Coordinates...": "GPS کوآرڈینیٹس کیپچر کر رہا ہے...",
  "GPS Captured: ": "GPS کیپچر:",
  "e.g., Paddy, Wheat": "جیسے، دھان، گندم",
  "Failed to register farmer": "کسان رجسٹر کرنے میں ناکام",
  "Active Fleet": "ایکٹو فلیٹ",
  "GPS Required": "GPS کی ضرورت ہے۔",
  "Drivers Online": "ڈرائیورز آن لائن",
  "Failed to get location. Please enter manually.": "مقام حاصل کرنے میں ناکام۔ براہ کرم دستی طور پر درج کریں۔",
  "Farmer registered successfully! ID: ": "کسان کامیابی سے رجسٹرڈ! ID:",
  "Retry GPS": "GPS کی دوبارہ کوشش کریں۔",
  "Active Queue": "فعال قطار",
  "Geolocation is not supported by this browser.": "جغرافیائی محل وقوع اس براؤزر کے ذریعے تعاون یافتہ نہیں ہے۔",
  "Total Capacity": "کل صلاحیت",
  "Utilization": "استعمال",
  "No new tasks available.": "کوئی نیا کام دستیاب نہیں ہے۔",
  "Output Material": "آؤٹ پٹ مواد",
  "Current Load": "کرنٹ لوڈ",
  "Biomass in Stock": "اسٹاک میں بایوماس",
  "Accept Pickup": "پک اپ کو قبول کریں۔",
  "Available for Pickup": "پک اپ کے لیے دستیاب ہے۔",
  "Incoming for Processing": "پروسیسنگ کے لیے آنے والی",
  "Storage Utilization": "اسٹوریج کا استعمال",
  "No active tasks in your possession.": "آپ کے قبضے میں کوئی فعال کام نہیں ہے۔",
  "MRV Status": "ایم آر وی اسٹیٹس",
  "Recently Processed": "حال ہی میں کارروائی کی گئی۔",
  "No records found for the selected filter.": "منتخب فلٹر کے لیے کوئی ریکارڈ نہیں ملا۔",
  "Timestamp": "ٹائم اسٹیمپ",
  "Weight": "وزن",
  "Accept Receipt": "رسید قبول کریں۔",
  "Value": "قدر",
  "Type": "قسم",
  "Pending MRV": "زیر التواء MRV",
  "AI Risk": "AI رسک",
  "Details": "تفصیلات",
  "Low": "کم",
  "High": "اعلی",
  "Verified By": "کی طرف سے تصدیق شدہ",
  "Check back later for newly verified CCCs.": "نئے تصدیق شدہ کاربن کریڈٹس کے لیے بعد میں دوبارہ چیک کریں۔",
  "No MRV history found": "کوئی MRV تاریخ نہیں ملی",
  "Record ID": "ریکارڈ کی شناخت",
  "Med": "میڈ",
  "No credits available": "کوئی کریڈٹ دستیاب نہیں ہے۔",
  "Profile Settings": "پروفائل کی ترتیبات",
  "Failed to update profile": "پروفائل اپ ڈیٹ کرنے میں ناکام",
  "Profile updated successfully": "پروفائل کامیابی کے ساتھ اپ ڈیٹ ہو گیا۔",
  "Purchase Credit": "کریڈٹ خریدیں۔",
  "Verified": "تصدیق شدہ",
  "I. Introduction": "I. تعارف",
  "Insufficient Funds": "ناکافی فنڈز",
  "The Foundational Structure and Operating Doctrine of RupayKg": "RupayKg کا بنیادی ڈھانچہ اور آپریٹنگ نظریہ",
  "An error occurred": "ایک خرابی پیش آگئی",
  "Offset": "آفسیٹ",
  "II. Unified Operating System Model": "II یونیفائیڈ آپریٹنگ سسٹم ماڈل",
  "Category": "زمرہ",
  "Municipal Corp + Ward": "میونسپل کارپوریشن + وارڈ",
  "Context": "سیاق و سباق",
  "RupayKg has been established as a Unified Waste-to-CCC Digital Operating System designed to support India’s transition toward a compliance-based CCC market.": "RupayKg کو یونیفائیڈ ویسٹ ٹو کاربن ڈیجیٹل آپریٹنگ سسٹم کے طور پر قائم کیا گیا ہے جو تعمیل پر مبنی کاربن مارکیٹ کی طرف ہندوستان کی منتقلی کی حمایت کرنے کے لیے ڈیزائن کیا گیا ہے۔",
  "Anchor": "اینکر",
  "The platform addresses a structural gap in India’s CCC ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade CCC supply.": "یہ پلیٹ فارم ہندوستان کے کاربن ماحولیاتی نظام میں ایک ساختی خلاء کو دور کرتا ہے: ایک متحد، ریگولیٹر سے منسلک ڈیجیٹل انفراسٹرکچر کی عدم موجودگی جو تصدیق شدہ فضلہ کے موڑ کو تعمیل درجہ کاربن کی فراہمی میں تبدیل کرنے کے قابل ہے۔",
  "Rural": "دیہی",
  "RupayKg is not structured as a project developer, CCC trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.": "RupayKg کو پروجیکٹ ڈویلپر، کاربن ٹریڈر، یا ری سائیکلنگ ادارے کے طور پر تشکیل نہیں دیا گیا ہے۔ یہ ایک بنیادی ڈھانچے کی تہہ ہے جسے آرکیٹیکچرل ڈپلیکیشن کے بغیر شہری اور دیہی انتظامی فریم ورک میں کام کرنے کے لیے ڈیزائن کیا گیا ہے۔",
  "Urban": "شہری",
  "Gram Panchayat + Village": "گرام پنچایت + گاؤں",
  "Biomass-based fossil substitution": "بایوماس پر مبنی فوسل متبادل",
  "Producers (EPR)": "پروڈیوسرز (ای پی آر)",
  "Methane avoidance through diversion": "موڑ کے ذریعے میتھین سے بچنا",
  "III. Unified Stakeholder Architecture": "III متحد اسٹیک ہولڈر آرکیٹیکچر",
  "* All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.": "* تمام دیہی زرعی باقیات اور بائیو ماس کی سرگرمی کو بایوماس کے تحت درجہ بندی کیا گیا ہے۔ کوئی علیحدہ زرعی عمودی موجود نہیں ہے۔",
  "The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.": "Aggregator کو ساختی طور پر ضم شدہ ہستی کے طور پر بیان کیا گیا ہے جو جمع کرنے اور چھانٹنے کی توثیق کے لیے ذمہ دار ہے، جس سے زنجیر کی تحویل کی تصدیق کو آسان بنایا جاتا ہے۔",
  "IV. CCC Origination": "چہارم کاربن کی ابتدا",
  "Administrative Authority": "انتظامی اتھارٹی",
  "CSR Contributors": "CSR تعاون کنندگان",
  "Governance Layer": "گورننس کی تہہ",
  "Recycler Rail": "ری سائیکلر ریل",
  "VI. Regulator Sovereignty": "VI ریگولیٹر خودمختاری",
  "Recycling substitution": "ری سائیکلنگ کا متبادل",
  "CCC Rail": "کاربن ریل",
  "CCC issuance authority remains regulator-controlled. RupayKg does not independently mint credits. All credits must be event-traceable, registry-compatible, and align with national CCC governance frameworks.": "کاربن جاری کرنے والی اتھارٹی ریگولیٹر کے زیر کنٹرول رہتی ہے۔ RupayKg آزادانہ طور پر ٹکسال کریڈٹ نہیں کرتا ہے۔ تمام کریڈٹ ایونٹ کے قابل، رجسٹری سے مطابقت رکھنے والے، اور کاربن گورننس کے قومی فریم ورک کے مطابق ہونے چاہئیں۔",
  "V. Multi-Rail Architecture": "V. ملٹی ریل آرکیٹیکچر",
  "CSR Rail": "سی ایس آر ریل",
  "EPR Rail": "ای پی آر ریل",
  "VII. Strategic Position": "VII اسٹریٹجک پوزیشن",
  "When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated CCC value?": "جب ہم نے RupayKg بنانا شروع کیا تو ہم نے ری سائیکلنگ شروع نہیں کی۔ ہم نے ایک ساختی سوال کے ساتھ آغاز کیا: ایسا کوئی متفقہ انفراسٹرکچر کیوں نہیں ہے جو فضلہ کو ریگولیٹڈ کاربن ویلیو میں تبدیل کرتا ہے؟",
  "India is entering a compliance CCC era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.": "ہندوستان تعمیل کاربن دور میں داخل ہو رہا ہے۔ میونسپل سسٹم قابل پیمائش میتھین پیدا کرتے ہیں۔ دیہی بایوماس کو جلا یا کم استعمال کیا جاتا ہے۔ پھر بھی نظام بکھرے ہوئے ہیں۔",
  "Article II — Unified Stakeholder Doctrine": "آرٹیکل II - متحد اسٹیک ہولڈر نظریہ",
  "Legally Styled": "قانونی طور پر اسٹائل شدہ",
  "Waste is no longer disposal. It is governance-linked climate infrastructure.": "فضلہ اب ٹھکانے نہیں ہے۔ یہ گورننس سے منسلک آب و ہوا کا بنیادی ڈھانچہ ہے۔",
  "— Founder, RupayKg": "- بانی، RupayKg",
  "RupayKg was built to unify them. Not as a CCC trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.": "RupayKg ان کو متحد کرنے کے لیے بنایا گیا تھا۔ کاربن تاجر کے طور پر نہیں۔ ری سائیکلنگ اسٹارٹ اپ کے طور پر نہیں۔ لیکن ایک واحد آپریٹنگ سسٹم کے طور پر جو میونسپل وارڈ کی سطح اور گرام پنچایت گاؤں کی سطح پر ساختی نقل کے بغیر کام کرنے کے قابل ہے۔",
  "RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.": "RupayKg ایک واحد ڈیجیٹل سسٹم کو چلائے گا جو اس کے تحت قابل استعمال ہے: (a) میونسپل کارپوریشن + وارڈ (شہری سیاق و سباق) (b) گرام پنچایت + گاؤں (دیہی سیاق و سباق)۔ سیاق و سباق کے درمیان کوئی ساختی نقل موجود نہیں ہوگی۔",
  "Article I — Unified Operating System": "آرٹیکل I - یونیفائیڈ آپریٹنگ سسٹم",
  "DECLARATION OF FOUNDATIONAL STRUCTURE": "بنیادی ڈھانچے کا اعلان",
  "All emission reductions shall be processed through a single CCC calculation engine with event-level MRV validation.": "تمام اخراج میں کمی کو واقعہ کی سطح کے MRV کی توثیق کے ساتھ واحد کاربن کیلکولیشن انجن کے ذریعے عمل میں لایا جائے گا۔",
  "Article VI — Regulator Sovereignty": "آرٹیکل VI - ریگولیٹر خودمختاری",
  "The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, CCC Buyers, Regulator.": "اسٹیک ہولڈر کا ڈھانچہ ملک بھر میں یکساں رہے گا اور اس پر مشتمل ہوگا: ویسٹ جنریٹر، ایگریگیٹر، پروسیسر، انتظامی اتھارٹی، پروڈیوسرز (ای پی آر)، سی ایس آر کنٹریبیوٹرز، کاربن خریدار، ریگولیٹر۔",
  "Article III — Waste Classification": "آرٹیکل III - فضلہ کی درجہ بندی",
  "Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.": "فضلہ کو خصوصی طور پر درجہ بندی کیا جائے گا: (a) MSW شہری تناظر میں (b) دیہی تناظر میں بایوماس۔ تمام زرعی باقیات کو بایوماس کے تحت درجہ بندی کیا جائے گا۔",
  "Article IV — CCC Engine": "آرٹیکل IV - کاربن انجن",
  "Institutional Identity": "ادارہ جاتی شناخت",
  "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, CCC issuance. Double counting is prohibited.": "RupayKg ان کے درمیان سخت علیحدگی برقرار رکھے گا: ری سائیکلر اکاؤنٹنگ، CSR اکاؤنٹنگ، EPR تعمیل، گورننس ویلیو، کاربن جاری کرنا۔ دوہری گنتی ممنوع ہے۔",
  "CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs.": "کاربن منٹ اتھارٹی ریگولیٹر کے کنٹرول میں رہے گی۔ RupayKg آزادانہ طور پر کاربن کریڈٹ جاری نہیں کرے گا۔",
  "Article V — Rail Separation": "آرٹیکل V - ریل علیحدگی",
  "RupayKg is hereby defined as: A Unified Waste-to-CCC Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability.": "RupayKg کی تعریف اس طرح کی گئی ہے: ایک متحد ویسٹ ٹو کاربن انفراسٹرکچر پلیٹ فارم جو ایک واحد قومی اسٹیک ہولڈر آرکیٹیکچر کے تحت کام کرتا ہے جس میں ریگولیٹر سے منسلک کاربن پیدا کرنے کی صلاحیت ہے۔"
  } },
  gu: { translation: {
  "Dashboard": "ડેશબોર્ડ",
  "Task Board": "ટાસ્ક બોર્ડ",
  "CCC Market": "કાર્બન માર્કેટ",
  "Logout": "લોગઆઉટ",
  "National KPI": "રાષ્ટ્રીય KPI",
  "Upload Waste": "અપલોડ કચરો",
  "History": "ઈતિહાસ",
  "MRV Dashboard": "MRV ડેશબોર્ડ",
  "Genesis": "ઉત્પત્તિ",
  "Settings": "સેટિંગ્સ",
  "System Overview": "સિસ્ટમ વિહંગાવલોકન",
  "Community Rank": "સમુદાય રેન્ક",
  "Welcome back": "ફરી સ્વાગત છે",
  "Language": "ભાષા",
  "Total Collected": "કુલ એકત્રિત",
  "Farmers Registered": "ખેડૂતોએ નોંધણી કરાવી",
  "CCC Offset": "કાર્બન ઓફસેટ",
  "Total Earnings": "કુલ કમાણી",
  "Hindi": "હિન્દી",
  "English": "અંગ્રેજી",
  "Seed Demo Data": "બીજ ડેમો ડેટા",
  "Logistics Margin": "લોજિસ્ટિક્સ માર્જિન",
  "Processing Yield": "પ્રક્રિયા ઉપજ",
  "Platform Statistics": "પ્લેટફોર્મ આંકડા",
  "Total Processed": "કુલ પ્રક્રિયા",
  "Fleet Efficiency": "ફ્લીટ કાર્યક્ષમતા",
  "CCCs": "કાર્બન ક્રેડિટ્સ",
  "ESG Score": "ESG સ્કોર",
  "Total Investment": "કુલ રોકાણ",
  "Value Generated": "મૂલ્ય જનરેટ કર્યું",
  "Total Users": "કુલ વપરાશકર્તાઓ",
  "Total Weight": "કુલ વજન",
  "Register New Farmer": "નવા ખેડૂતની નોંધણી કરો",
  "Total Value": "કુલ મૂલ્ય",
  "Reset Demo Data": "ડેમો ડેટા રીસેટ કરો",
  "New Collection Record": "નવો સંગ્રહ રેકોર્ડ",
  "CCCs Generated": "કાર્બન ઘટાડો",
  "Performance Analytics": "પ્રદર્શન વિશ્લેષણ",
  "Waste Distribution": "કચરો વિતરણ",
  "Recent Activity": "તાજેતરની પ્રવૃત્તિ",
  "Latitude": "અક્ષાંશ",
  "Crop Type": "પાકનો પ્રકાર",
  "New Intake Record": "નવો ઇન્ટેક રેકોર્ડ",
  "Get Current Location": "વર્તમાન સ્થાન મેળવો",
  "Land Area (Acres)": "જમીન વિસ્તાર (એકર)",
  "New Processing Record": "નવો પ્રોસેસિંગ રેકોર્ડ",
  "Full Name": "પૂરું નામ",
  "Farm Location": "ફાર્મ સ્થાન",
  "Mobile Number": "મોબાઈલ નંબર",
  "Longitude": "રેખાંશ",
  "All": "બધા",
  "Transaction Ledger": "ટ્રાન્ઝેક્શન લેજર",
  "Registering...": "નોંધણી કરી રહ્યું છે...",
  "Account Settings": "એકાઉન્ટ સેટિંગ્સ",
  "Operations Management": "ઓપરેશન્સ મેનેજમેન્ટ",
  "Pending Pickup": "બાકી પિકઅપ",
  "Foundational Doctrine": "મૂળભૂત સિદ્ધાંત",
  "In Transit": "ટ્રાન્ઝિટમાં",
  "Register Farmer": "ખેડૂતની નોંધણી કરો",
  "Processed": "પ્રક્રિયા કરી",
  "Weight (kg)": "વજન (કિલો)",
  "Location Confirmation (Google Maps)": "લોકેશન કન્ફર્મેશન (Google Maps)",
  "Confirm Intake & Mint Value": "ઇન્ટેક અને મિન્ટ વેલ્યુની પુષ્ટિ કરો",
  "Total Sovereign Value": "કુલ સાર્વભૌમ મૂલ્ય",
  "Base Value (Recycler)": "મૂળ મૂલ્ય (રિસાયકલર)",
  "Verification Image": "ચકાસણી છબી",
  "Processing...": "પ્રક્રિયા કરી રહ્યું છે...",
  "CCC Value": "કાર્બન ક્રેડિટ મૂલ્ય",
  "Estimated Value Breakdown": "અંદાજિત મૂલ્ય ભંગાણ",
  "Waste Type": "કચરો પ્રકાર",
  "Intake": "ઇન્ટેક",
  "RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.": "RupayKg એ મલ્ટિ-રેલ વેલ્યુ એન્જિન દ્વારા કૃષિ, મ્યુનિસિપલ અને ઔદ્યોગિક કચરાનું મુદ્રીકરણ કરવા માટે સમુદાયોને સશક્તિકરણ કરતી પરિપત્ર અર્થવ્યવસ્થા ઓપરેટિંગ સિસ્ટમ છે.",
  "How it Works": "તે કેવી રીતે કામ કરે છે",
  "Features": "લક્ષણો",
  "Ecosystem Roles": "ઇકોસિસ્ટમ ભૂમિકાઓ",
  "Convert Every Kilogram of Waste into": "દરેક કિલોગ્રામ કચરાને માં કન્વર્ટ કરો",
  "Launch OS": "OS લોંચ કરો",
  "Access the OS": "OS ઍક્સેસ કરો",
  "Global Circular Value": "વૈશ્વિક પરિપત્ર મૂલ્ય",
  "Sovereign-Grade Circular Economy Engine": "સાર્વભૌમ-ગ્રેડ સર્ક્યુલર ઇકોનોમી એન્જિન",
  "Live Stream": "લાઇવ સ્ટ્રીમ",
  "AI-Verified Intake": "AI-વેરિફાઇડ ઇનટેક",
  "Real-time waste throughput across the RupayKg OS": "RupayKg OS પર રીઅલ-ટાઇમ વેસ્ટ થ્રુપુટ",
  "Live Network Impact": "લાઇવ નેટવર્ક અસર",
  "Read Whitepaper": "વ્હાઇટપેપર વાંચો",
  "Multi-Rail Value Engine": "મલ્ટિ-રેલ વેલ્યુ એન્જિન",
  "Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.": "તે જ સમયે પ્રક્રિયા કરાયેલા દરેક કિલોગ્રામ બાયોમાસ માટે રિસાયકલર, CSR, મ્યુનિસિપલ, કાર્બન અને EPR રેલ્સમાંથી મૂલ્ય કાઢો.",
  "Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.": "પર્યાવરણીય જવાબદારીઓને સ્થાનિક આર્થિક વૃદ્ધિમાં રૂપાંતરિત કરીને નાગરિક વૉલેટમાં સીધા જ ભંડોળનું વિતરણ કરો.",
  "Rural Wealth Creation": "ગ્રામીણ સંપત્તિ સર્જન",
  "Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.": "કચરાના પ્રકાર, વજન અને ભૌગોલિક સ્થાનની સ્વચાલિત ચકાસણી અપરિવર્તનશીલ, સાર્વભૌમ-ગ્રેડ ડેટાની અખંડિતતાને સુનિશ્ચિત કરે છે.",
  "Generate": "જનરેટ કરો",
  "Citizens collect agricultural, municipal, or industrial waste.": "નાગરિકો કૃષિ, મ્યુનિસિપલ અથવા ઔદ્યોગિક કચરો એકત્રિત કરે છે.",
  "Active Nodes": "સક્રિય ગાંઠો",
  "Network Topology": "નેટવર્ક ટોપોલોજી",
  "Value Minted": "મૂલ્ય મિન્ટેડ",
  "Distributed biomass collection nodes": "વિતરિત બાયોમાસ સંગ્રહ ગાંઠો",
  "A seamless pipeline from waste generation to value realization.": "કચરાના ઉત્પાદનથી મૂલ્ય પ્રાપ્તિ સુધીની સીમલેસ પાઇપલાઇન.",
  "Aggregate": "એકંદર",
  "Aggregators verify, weigh, and transport waste to facilities.": "એગ્રીગેટર્સ કચરાની ચકાસણી કરે છે, તેનું વજન કરે છે અને સુવિધાઓમાં કચરો વહન કરે છે.",
  "nodes": "ગાંઠો",
  "Recyclers convert waste into usable materials or energy.": "રિસાયકલર્સ કચરાને ઉપયોગી સામગ્રી અથવા ઊર્જામાં રૂપાંતરિત કરે છે.",
  "Process": "પ્રક્રિયા",
  "Instant wallet funding": "ઇન્સ્ટન્ટ વૉલેટ ફંડિંગ",
  "Citizen": "નાગરિક",
  "Mint Value": "મિન્ટ વેલ્યુ",
  "Waste Generator": "કચરો જનરેટર",
  "Smart contracts distribute funds across all 5 value rails.": "સ્માર્ટ કોન્ટ્રાક્ટ તમામ 5 મૂલ્યની રેલ્સમાં ભંડોળનું વિતરણ કરે છે.",
  "Choose your part in the circular economy.": "પરિપત્ર અર્થતંત્રમાં તમારો ભાગ પસંદ કરો.",
  "Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.": "કૃષિ, મ્યુનિસિપલ અથવા ઔદ્યોગિક કચરો એકત્રિત કરો અને જમા કરો. વજન અને કચરાના પ્રકારને આધારે ડાયરેક્ટ વૉલેટ ડિપોઝિટ કમાઓ.",
  "Upload waste records": "કચરાના રેકોર્ડ અપલોડ કરો",
  "Recycler": "રિસાયકલર",
  "Processor": "પ્રોસેસર",
  "Log collection batches": "લોગ સંગ્રહ બેચ",
  "Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.": "એકત્રિત કચરો મેળવો અને તેને અંતિમ ઉત્પાદનોમાં પ્રક્રિયા કરો. તમામ રેલ્સ પર અંતિમ મૂલ્ય અનુભૂતિને ટ્રિગર કરો.",
  "Route optimization data": "રૂટ ઓપ્ટિમાઇઝેશન ડેટા",
  "Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.": "નાગરિકોની થાપણો ચકાસો, કચરાને એકીકૃત કરો અને સામગ્રીને પ્રોસેસિંગ સુવિધાઓમાં પરિવહન કરવા માટે લોજિસ્ટિક્સનું સંચાલન કરો.",
  "Aggregator": "એગ્રીગેટર",
  "Earn logistics margins": "લોજિસ્ટિક્સ માર્જિન કમાઓ",
  "Track environmental impact": "પર્યાવરણીય પ્રભાવને ટ્રૅક કરો",
  "Collection & Transport": "સંગ્રહ અને પરિવહન",
  "Access CSR/EPR funds": "સીએસઆર/ઇપીઆર ફંડ્સ ઍક્સેસ કરો",
  "Circular Economy Operating System": "પરિપત્ર અર્થતંત્ર ઓપરેટિંગ સિસ્ટમ",
  "Organization Name": "સંસ્થાનું નામ",
  "Generate CCCs": "કાર્બન ક્રેડિટ જનરેટ કરો",
  "Account Type": "એકાઉન્ટ પ્રકાર",
  "Register": "નોંધણી કરો",
  "Log processing yields": "લોગ પ્રક્રિયા ઉપજ",
  "Login": "લૉગિન કરો",
  "Context:": "સંદર્ભ:",
  "District": "જિલ્લો",
  "Phone Number": "ફોન નંબર",
  "Access OS": "OS ઍક્સેસ કરો",
  "Back to Home": "ઘરે પાછા",
  "Submission Heatmap": "સબમિશન હીટમેપ",
  "Password": "પાસવર્ડ",
  "Global Impact Map": "વૈશ્વિક અસર નકશો",
  "Create Account": "એકાઉન્ટ બનાવો",
  "State": "રાજ્ય",
  "System Audit Logs": "સિસ્ટમ ઓડિટ લોગ્સ",
  "Quick Demo Access": "ઝડપી ડેમો ઍક્સેસ",
  "Farmers Supported": "ખેડૂતોએ ટેકો આપ્યો",
  "Impact Distribution": "અસર વિતરણ",
  "Total Offset": "કુલ ઓફસેટ",
  "MRV Verification Dashboard": "MRV ચકાસણી ડેશબોર્ડ",
  "Pending": "બાકી છે",
  "All processed waste has been verified.": "તમામ પ્રોસેસ્ડ કચરાની ચકાસણી કરવામાં આવી છે.",
  "Verify processed waste records to issue CCCs.": "કાર્બન ક્રેડિટ આપવા માટે પ્રોસેસ્ડ વેસ્ટ રેકોર્ડની ચકાસણી કરો.",
  "Waste Diverted": "કચરો વાળ્યો",
  "Portfolio Composition": "પોર્ટફોલિયો રચના",
  "No pending MRV records": "કોઈ MRV રેકોર્ડ બાકી નથી",
  "Acreage": "વાવેતર વિસ્તાર",
  "CCC Reduction": "CCC ઘટાડો",
  "Credit Value": "ક્રેડિટ મૂલ્ય",
  "Verify & Issue Credits": "ચકાસો અને ક્રેડિટ જારી કરો",
  "Purchase verified CCCs to offset your footprint.": "તમારા ફૂટપ્રિન્ટને ઓફસેટ કરવા માટે ચકાસાયેલ કાર્બન ક્રેડિટ્સ ખરીદો.",
  "Available Credits": "ઉપલબ્ધ ક્રેડિટ્સ",
  "Location Verification": "સ્થાન ચકાસણી",
  "Reject": "અસ્વીકાર કરો",
  "AI Risk Score": "AI જોખમ સ્કોર",
  "Cancel": "રદ કરો",
  "Confirm Purchase": "ખરીદીની પુષ્ટિ કરો",
  "Price per Tonne": "ટન દીઠ ભાવ",
  "Total Cost": "કુલ કિંમત",
  "Recent Transactions": "તાજેતરના વ્યવહારો",
  "Purchase Credits": "ક્રેડિટ્સ ખરીદો",
  "Your Offset Balance": "તમારું ઓફસેટ બેલેન્સ",
  "Project": "પ્રોજેક્ટ",
  "Amount to Purchase (Tonnes)": "ખરીદીની રકમ (ટન)",
  "Amount": "રકમ",
  "Status": "સ્થિતિ",
  "Ward Analytics": "વોર્ડ એનાલિટિક્સ",
  "Price": "કિંમત",
  "Date": "તારીખ",
  "MSW": "MSW",
  "Ward": "વોર્ડ",
  "Ward-Level Analytics": "વોર્ડ-લેવલ વિશ્લેષણ",
  "National Dashboard": "રાષ્ટ્રીય ડેશબોર્ડ",
  "Municipal Corporation": "મહાનગરપાલિકા",
  "Network Active": "નેટવર્ક સક્રિય",
  "Village": "ગામ",
  "Biomass": "બાયોમાસ",
  "Citizen (MSW Generator)": "નાગરિક (MSW જનરેટર)",
  "All Roles": "બધી ભૂમિકાઓ",
  "Farmers / FPOs": "ખેડૂતો/એફ.પી.ઓ",
  "Gram Panchayat": "ગ્રામ પંચાયત",
  "Citizens": "નાગરિકો",
  "Farmer / FPO (Biomass Generator)": "ખેડૂત / FPO (બાયોમાસ જનરેટર)",
  "Village Analytics": "વિલેજ એનાલિટિક્સ",
  "Village-Level Analytics": "ગ્રામ્ય-સ્તર વિશ્લેષણ",
  "EPR Partners": "EPR ભાગીદારો",
  "Audit Logs": "ઓડિટ લોગ્સ",
  "Diverted": "વાળ્યો",
  "User Management": "વપરાશકર્તા વ્યવસ્થાપન",
  "Fraud Alerts & Flagged Events": "છેતરપિંડી ચેતવણીઓ અને ચિહ્નિત ઇવેન્ટ્સ",
  "Processors": "પ્રોસેસર્સ",
  "CSR Partners": "CSR ભાગીદારો",
  "Aggregators": "એગ્રીગેટર્સ",
  "CCC Pool Status": "કાર્બન પૂલ સ્થિતિ",
  "CCC Buyers": "કાર્બન ખરીદદારો",
  "Total Waste Events": "કુલ કચરાની ઘટનાઓ",
  "Wallet Disbursed": "વૉલેટ વિતરિત",
  "Environmental Impact": "પર્યાવરણીય અસર",
  "Processed Events": "પ્રક્રિયા કરેલ ઇવેન્ટ્સ",
  "Growth & Impact Trends": "વૃદ્ધિ અને અસર વલણો",
  "Methane Avoided": "મિથેન ટાળ્યું",
  "Trees Equivalent": "વૃક્ષો સમકક્ષ",
  "Trees": "વૃક્ષો",
  "Water Saved": "પાણીની બચત",
  "Economic Efficiency": "આર્થિક કાર્યક્ષમતા",
  "Operational Health": "ઓપરેશનલ હેલ્થ",
  "MRV Rejection Rate": "MRV અસ્વીકાર દર",
  "* Government savings calculated based on avoided landfill management and environmental remediation costs.": "* સરકારી બચતની ગણતરી ટાળેલ લેન્ડફિલ મેનેજમેન્ટ અને પર્યાવરણીય ઉપાય ખર્ચના આધારે કરવામાં આવે છે.",
  "Processing Efficiency": "પ્રક્રિયા કાર્યક્ષમતા",
  "Geospatial Fraud Distribution": "જીઓસ્પેશિયલ છેતરપિંડી વિતરણ",
  "Avg Price / kg": "સરેરાશ કિંમત / કિગ્રા",
  "Govt Cost Savings": "સરકારી ખર્ચ બચત",
  "Total Minted CCC Units": "કુલ મિન્ટેડ કાર્બન એકમો",
  "Waste Composition": "કચરાની રચના",
  "No flagged events detected.": "કોઈ ફ્લેગ કરેલ ઇવેન્ટ્સ મળી નથી.",
  "Location": "સ્થાન",
  "Role": "ભૂમિકા",
  "CSR Partner": "CSR પાર્ટનર",
  "State Admin": "રાજ્ય સંચાલક",
  "Municipal Admin": "મ્યુનિસિપલ એડમિન",
  "Super Admin": "સુપર એડમિન",
  "User": "વપરાશકર્તા",
  "Wallet": "વૉલેટ",
  "Actions": "ક્રિયાઓ",
  "Regulator": "રેગ્યુલેટર",
  "EPR Partner": "EPR ભાગીદાર",
  "No audit logs available.": "કોઈ ઓડિટ લોગ ઉપલબ્ધ નથી.",
  "No users found.": "કોઈ વપરાશકર્તાઓ મળ્યા નથી.",
  "No ward data available.": "કોઈ વોર્ડ ડેટા ઉપલબ્ધ નથી.",
  "Delete User": "વપરાશકર્તા કાઢી નાખો",
  "Action": "ક્રિયા",
  "User ID": "વપરાશકર્તા ID",
  "CCC Buyer": "કાર્બન ખરીદનાર",
  "Total Events": "કુલ ઘટનાઓ",
  "Total Waste": "કુલ કચરો",
  "Push Notifications": "પુશ સૂચનાઓ",
  "Receive updates about your transactions via email.": "ઇમેઇલ દ્વારા તમારા વ્યવહારો વિશે અપડેટ્સ પ્રાપ્ત કરો.",
  "Save Changes": "ફેરફારો સાચવો",
  "Email Notifications": "ઇમેઇલ સૂચનાઓ",
  "Notification Preferences": "સૂચના પસંદગીઓ",
  "Add ₹10,000": "₹10,000 ઉમેરો",
  "Get instant SMS alerts for critical updates.": "જટિલ અપડેટ્સ માટે ત્વરિત SMS ચેતવણીઓ મેળવો.",
  "Saving...": "સાચવી રહ્યું છે...",
  "Enable browser push notifications.": "બ્રાઉઝર પુશ સૂચનાઓ સક્ષમ કરો.",
  "SMS Alerts": "SMS ચેતવણીઓ",
  "Currently Active: ": "હાલમાં સક્રિય:",
  "GENESIS": "જિનેસિસ",
  "Value: ": "મૂલ્ય:",
  "FRAUD ALERT": "છેતરપિંડી ચેતવણી",
  " Context (": "સંદર્ભ (",
  "© 2026 RupayKg Circular Economy OS. All rights reserved.": "© 2026 RupayKg સર્ક્યુલર ઇકોનોમી OS. સર્વાધિકાર આરક્ષિત.",
  "Type: ": "પ્રકાર:",
  "Village: ": "ગામ:",
  "Weight: ": "વજન:",
  "How the Engine Works": "એન્જિન કેવી રીતે કામ કરે છે",
  "Privacy": "ગોપનીયતા",
  "Farmer": "ખેડૂત",
  "RUPAYKG": "RUPAYKG",
  "National Regulator": "રાષ્ટ્રીય નિયમનકાર",
  "Admin": "એડમિન",
  "Aggregator (Collection & Transport)": "એગ્રીગેટર (સંગ્રહ અને પરિવહન)",
  "rural": "ગ્રામીણ",
  "urban": "શહેરી",
  "Terms": "શરતો",
  "Processor (Recycler)": "પ્રોસેસર (રિસાયકલર)",
  "GPS Captured: ": "જીપીએસ કેપ્ચર:",
  "Acreage (acres)": "વાવેતર વિસ્તાર (એકર)",
  "GPS Capture Failed": "GPS કેપ્ચર નિષ્ફળ થયું",
  "No audit logs found": "કોઈ ઓડિટ લોગ મળ્યા નથી",
  "Capturing GPS Coordinates...": "GPS કોઓર્ડિનેટ્સ કેપ્ચર કરી રહ્યાં છીએ...",
  "Database Connection Failed": "ડેટાબેઝ કનેક્શન નિષ્ફળ થયું",
  "Wallet Balance": "વૉલેટ બેલેન્સ",
  "Circular Economy Intake Form": "પરિપત્ર ઇકોનોમી ઇનટેક ફોર્મ",
  "Name": "નામ",
  "No records found": "કોઈ રેકોર્ડ મળ્યા નથી",
  "Failed to register farmer": "ખેડૂતની નોંધણી કરવામાં નિષ્ફળ",
  "Failed to get location. Please enter manually.": "સ્થાન મેળવવામાં નિષ્ફળ. કૃપા કરીને મેન્યુઅલી દાખલ કરો.",
  "e.g., Paddy, Wheat": "દા.ત., ડાંગર, ઘઉં",
  "GPS Required": "જીપીએસ જરૂરી",
  "Geolocation is not supported by this browser.": "ભૌગોલિક સ્થાન આ બ્રાઉઝર દ્વારા સમર્થિત નથી.",
  "Farmer registered successfully! ID: ": "ખેડૂતે સફળતાપૂર્વક નોંધણી કરી! ID:",
  "Active Fleet": "સક્રિય ફ્લીટ",
  "Retry GPS": "GPS ફરી પ્રયાસ કરો",
  "Active Queue": "સક્રિય કતાર",
  "Drivers Online": "ડ્રાઇવરો ઓનલાઇન",
  "Utilization": "ઉપયોગ",
  "Incoming for Processing": "પ્રક્રિયા માટે ઇનકમિંગ",
  "Current Load": "વર્તમાન લોડ",
  "Output Material": "આઉટપુટ સામગ્રી",
  "No new tasks available.": "કોઈ નવા કાર્યો ઉપલબ્ધ નથી.",
  "Available for Pickup": "પિકઅપ માટે ઉપલબ્ધ",
  "Accept Pickup": "પિકઅપ સ્વીકારો",
  "Storage Utilization": "સંગ્રહ ઉપયોગ",
  "Biomass in Stock": "સ્ટોકમાં બાયોમાસ",
  "Total Capacity": "કુલ ક્ષમતા",
  "Timestamp": "ટાઇમસ્ટેમ્પ",
  "Accept Receipt": "રસીદ સ્વીકારો",
  "Weight": "વજન",
  "No active tasks in your possession.": "તમારા કબજામાં કોઈ સક્રિય કાર્યો નથી.",
  "Value": "મૂલ્ય",
  "Pending MRV": "બાકી MRV",
  "Type": "પ્રકાર",
  "MRV Status": "MRV સ્થિતિ",
  "No records found for the selected filter.": "પસંદ કરેલ ફિલ્ટર માટે કોઈ રેકોર્ડ્સ મળ્યા નથી.",
  "Recently Processed": "તાજેતરમાં પ્રક્રિયા",
  "High": "ઉચ્ચ",
  "No MRV history found": "કોઈ MRV ઇતિહાસ મળ્યો નથી",
  "Record ID": "રેકોર્ડ આઈડી",
  "Low": "નીચું",
  "AI Risk": "AI જોખમ",
  "Details": "વિગતો",
  "Check back later for newly verified CCCs.": "નવા ચકાસાયેલ કાર્બન ક્રેડિટ્સ માટે પછીથી ફરી તપાસો.",
  "No credits available": "કોઈ ક્રેડિટ ઉપલબ્ધ નથી",
  "Verified By": "દ્વારા ચકાસાયેલ",
  "Med": "મેડ",
  "Insufficient Funds": "અપૂરતું ભંડોળ",
  "Offset": "ઓફસેટ",
  "An error occurred": "એક ભૂલ આવી",
  "I. Introduction": "I. પરિચય",
  "Failed to update profile": "પ્રોફાઇલ અપડેટ કરવામાં નિષ્ફળ",
  "Verified": "ચકાસાયેલ",
  "The Foundational Structure and Operating Doctrine of RupayKg": "RupayKg નું પાયાનું માળખું અને સંચાલન સિદ્ધાંત",
  "Profile updated successfully": "પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થઈ",
  "Profile Settings": "પ્રોફાઇલ સેટિંગ્સ",
  "Purchase Credit": "ખરીદી ક્રેડિટ",
  "Urban": "શહેરી",
  "Municipal Corp + Ward": "મ્યુનિસિપલ કોર્પોરેશન + વોર્ડ",
  "Anchor": "એન્કર",
  "RupayKg is not structured as a project developer, CCC trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.": "RupayKg એ પ્રોજેક્ટ ડેવલપર, કાર્બન ટ્રેડર અથવા રિસાયક્લિંગ એન્ટિટી તરીકે રચાયેલ નથી. તે એક ઇન્ફ્રાસ્ટ્રક્ચર સ્તર છે જે આર્કિટેક્ચરલ ડુપ્લિકેશન વિના શહેરી અને ગ્રામીણ વહીવટી માળખામાં કામ કરવા માટે રચાયેલ છે.",
  "RupayKg has been established as a Unified Waste-to-CCC Digital Operating System designed to support India’s transition toward a compliance-based CCC market.": "RupayKg ની સ્થાપના યુનિફાઇડ વેસ્ટ-ટુ-કાર્બન ડિજિટલ ઓપરેટિંગ સિસ્ટમ તરીકે કરવામાં આવી છે, જે અનુપાલન-આધારિત કાર્બન બજાર તરફ ભારતના સંક્રમણને સમર્થન આપવા માટે રચાયેલ છે.",
  "The platform addresses a structural gap in India’s CCC ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade CCC supply.": "પ્લેટફોર્મ ભારતના કાર્બન ઇકોસિસ્ટમમાં માળખાકીય તફાવતને સંબોધિત કરે છે: એકીકૃત, નિયમનકાર-સંરેખિત ડિજિટલ ઇન્ફ્રાસ્ટ્રક્ચરની ગેરહાજરી જે ચકાસાયેલ કચરાના ડાયવર્ઝનને અનુપાલન-ગ્રેડ કાર્બન સપ્લાયમાં રૂપાંતરિત કરવામાં સક્ષમ છે.",
  "Rural": "ગ્રામ્ય",
  "Context": "સંદર્ભ",
  "Category": "શ્રેણી",
  "II. Unified Operating System Model": "II. યુનિફાઇડ ઓપરેટિંગ સિસ્ટમ મોડલ",
  "Administrative Authority": "વહીવટી સત્તા",
  "* All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.": "* તમામ ગ્રામીણ કૃષિ અવશેષો અને બાયોમાસ પ્રવૃત્તિને બાયોમાસ હેઠળ વર્ગીકૃત કરવામાં આવે છે. કોઈ અલગ કૃષિ વર્ટિકલ અસ્તિત્વમાં નથી.",
  "Producers (EPR)": "નિર્માતાઓ (EPR)",
  "Biomass-based fossil substitution": "બાયોમાસ-આધારિત અશ્મિ અવેજી",
  "Gram Panchayat + Village": "ગ્રામ પંચાયત + ગામ",
  "The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.": "એગ્રિગેટરને માળખાકીય રીતે વ્યાખ્યાયિત કરવામાં આવે છે જે સંગ્રહ અને સૉર્ટિંગ માન્યતા માટે જવાબદાર મર્જ કરેલ એન્ટિટી છે, સાંકળ-ઓફ-કસ્ટડી ચકાસણીને સરળ બનાવે છે.",
  "III. Unified Stakeholder Architecture": "III. યુનિફાઇડ સ્ટેકહોલ્ડર આર્કિટેક્ચર",
  "Methane avoidance through diversion": "ડાયવર્ઝન દ્વારા મિથેન નિવારણ",
  "IV. CCC Origination": "IV. કાર્બન ઉત્પત્તિ",
  "CSR Contributors": "CSR યોગદાનકર્તાઓ",
  "Governance Layer": "શાસન સ્તર",
  "Recycler Rail": "રિસાયકલ રેલ",
  "VI. Regulator Sovereignty": "VI. રેગ્યુલેટર સાર્વભૌમત્વ",
  "VII. Strategic Position": "VII. વ્યૂહાત્મક સ્થિતિ",
  "EPR Rail": "EPR રેલ",
  "CSR Rail": "સીએસઆર રેલ",
  "Recycling substitution": "રિસાયક્લિંગ અવેજી",
  "CCC Rail": "કાર્બન રેલ",
  "V. Multi-Rail Architecture": "V. મલ્ટી-રેલ આર્કિટેક્ચર",
  "CCC issuance authority remains regulator-controlled. RupayKg does not independently mint credits. All credits must be event-traceable, registry-compatible, and align with national CCC governance frameworks.": "કાર્બન ઈસ્યુઅન્સ ઓથોરિટી રેગ્યુલેટર દ્વારા નિયંત્રિત રહે છે. RupayKg સ્વતંત્ર રીતે ક્રેડિટ મેળવતી નથી. તમામ ક્રેડિટ્સ ઇવેન્ટ-ટ્રેસેબલ, રજિસ્ટ્રી-સુસંગત અને રાષ્ટ્રીય કાર્બન ગવર્નન્સ ફ્રેમવર્ક સાથે સંરેખિત હોવા જોઈએ.",
  "India is entering a compliance CCC era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.": "ભારત અનુપાલન કાર્બન યુગમાં પ્રવેશી રહ્યું છે. મ્યુનિસિપલ સિસ્ટમ્સ માપી શકાય તેવું મિથેન ઉત્પન્ન કરે છે. ગ્રામીણ બાયોમાસ બાળવામાં આવે છે અથવા તેનો ઓછો ઉપયોગ થાય છે. છતાં સિસ્ટમો ખંડિત રહે છે.",
  "DECLARATION OF FOUNDATIONAL STRUCTURE": "ફાઉન્ડેશનલ સ્ટ્રક્ચરની ઘોષણા",
  "When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated CCC value?": "જ્યારે અમે RupayKg બનાવવાનું શરૂ કર્યું, ત્યારે અમે રિસાયક્લિંગથી શરૂઆત કરી ન હતી. અમે એક માળખાકીય પ્રશ્ન સાથે શરૂઆત કરી: શા માટે ત્યાં કોઈ એકીકૃત ઈન્ફ્રાસ્ટ્રક્ચર નથી જે કચરાને નિયંત્રિત કાર્બન મૂલ્યમાં રૂપાંતરિત કરે છે?",
  "RupayKg was built to unify them. Not as a CCC trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.": "RupayKg તેમને એક કરવા માટે બનાવવામાં આવ્યું હતું. કાર્બન વેપારી તરીકે નહીં. રિસાયક્લિંગ સ્ટાર્ટઅપ તરીકે નહીં. પરંતુ એકલ ઓપરેટિંગ સિસ્ટમ તરીકે મ્યુનિસિપલ વોર્ડ સ્તરે અને ગ્રામ પંચાયત ગ્રામ સ્તરે માળખાકીય ડુપ્લિકેશન વિના કામ કરવા સક્ષમ છે.",
  "Legally Styled": "કાયદેસર રીતે શૈલીયુક્ત",
  "Waste is no longer disposal. It is governance-linked climate infrastructure.": "કચરાનો હવે નિકાલ થતો નથી. તે ગવર્નન્સ સાથે જોડાયેલ ક્લાઈમેટ ઈન્ફ્રાસ્ટ્રક્ચર છે.",
  "Article II — Unified Stakeholder Doctrine": "કલમ II — એકીકૃત હિસ્સેદાર સિદ્ધાંત",
  "RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.": "RupayKg આ હેઠળ તૈનાત કરી શકાય તેવી સિંગલ ડિજિટલ સિસ્ટમનું સંચાલન કરશે: (a) મ્યુનિસિપલ કોર્પોરેશન + વોર્ડ (શહેરી સંદર્ભ) (b) ગ્રામ પંચાયત + ગામ (ગ્રામ્ય સંદર્ભ). સંદર્ભો વચ્ચે કોઈ માળખાકીય ડુપ્લિકેશન અસ્તિત્વમાં રહેશે નહીં.",
  "Article I — Unified Operating System": "કલમ I - યુનિફાઇડ ઓપરેટિંગ સિસ્ટમ",
  "— Founder, RupayKg": "- સ્થાપક, RupayKg",
  "Article III — Waste Classification": "કલમ III — કચરાનું વર્ગીકરણ",
  "Article IV — CCC Engine": "કલમ IV - કાર્બન એન્જિન",
  "CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs.": "કાર્બન મિન્ટ ઓથોરિટી રેગ્યુલેટરના નિયંત્રણ હેઠળ રહેશે. RupayKg સ્વતંત્ર રીતે કાર્બન ક્રેડિટ જારી કરશે નહીં.",
  "Article V — Rail Separation": "કલમ V — રેલ વિભાજન",
  "Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.": "કચરાને વિશિષ્ટ રીતે વર્ગીકૃત કરવામાં આવશે: (a) શહેરી સંદર્ભમાં MSW (b) ગ્રામીણ સંદર્ભમાં બાયોમાસ. તમામ કૃષિ અવશેષો બાયોમાસ હેઠળ વર્ગીકૃત કરવામાં આવશે.",
  "Article VI — Regulator Sovereignty": "કલમ VI — નિયમનકાર સાર્વભૌમત્વ",
  "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, CCC issuance. Double counting is prohibited.": "RupayKg વચ્ચે કડક અલગતા જાળવશે: રિસાયકલ એકાઉન્ટિંગ, CSR એકાઉન્ટિંગ, EPR અનુપાલન, ગવર્નન્સ મૂલ્ય, કાર્બન ઇશ્યુ. ડબલ ગણતરી પ્રતિબંધિત છે.",
  "The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, CCC Buyers, Regulator.": "હિસ્સેદારોનું માળખું દેશભરમાં એકસમાન રહેશે અને તેમાં સમાવિષ્ટ રહેશે: વેસ્ટ જનરેટર, એગ્રીગેટર, પ્રોસેસર, વહીવટી સત્તાધિકારી, ઉત્પાદકો (ઇપીઆર), સીએસઆર યોગદાનકર્તાઓ, કાર્બન ખરીદદારો, નિયમનકાર.",
  "All emission reductions shall be processed through a single CCC calculation engine with event-level MRV validation.": "તમામ ઉત્સર્જન ઘટાડાની પ્રક્રિયા ઘટના-સ્તરની MRV માન્યતા સાથે સિંગલ કાર્બન ગણતરી એન્જિન દ્વારા કરવામાં આવશે.",
  "Institutional Identity": "સંસ્થાકીય ઓળખ",
  "RupayKg is hereby defined as: A Unified Waste-to-CCC Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability.": "RupayKg ને આ રીતે વ્યાખ્યાયિત કરવામાં આવ્યું છે: એક યુનિફાઇડ વેસ્ટ-ટુ-કાર્બન ઇન્ફ્રાસ્ટ્રક્ચર પ્લેટફોર્મ જે નિયમનકાર-સંરેખિત કાર્બન ઉત્પત્તિ ક્ષમતા સાથે સિંગલ નેશનલ સ્ટેકહોલ્ડર આર્કિટેક્ચર હેઠળ કાર્યરત છે."
  } },
  kn: { translation: {
  "CCC Market": "ಕಾರ್ಬನ್ ಮಾರುಕಟ್ಟೆ",
  "Genesis": "ಜೆನೆಸಿಸ್",
  "Settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
  "Dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  "MRV Dashboard": "MRV ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  "History": "ಇತಿಹಾಸ",
  "Upload Waste": "ತ್ಯಾಜ್ಯವನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ",
  "Task Board": "ಕಾರ್ಯ ಮಂಡಳಿ",
  "Logout": "ಲಾಗ್ಔಟ್",
  "National KPI": "ರಾಷ್ಟ್ರೀಯ ಕೆಪಿಐ",
  "Community Rank": "ಸಮುದಾಯ ಶ್ರೇಣಿ",
  "Language": "ಭಾಷೆ",
  "System Overview": "ಸಿಸ್ಟಮ್ ಅವಲೋಕನ",
  "Total Earnings": "ಒಟ್ಟು ಗಳಿಕೆಗಳು",
  "Total Collected": "ಒಟ್ಟು ಸಂಗ್ರಹಿಸಲಾಗಿದೆ",
  "Farmers Registered": "ರೈತರು ನೋಂದಾಯಿಸಿದ್ದಾರೆ",
  "English": "ಇಂಗ್ಲೀಷ್",
  "Hindi": "ಹಿಂದಿ",
  "CCC Offset": "ಕಾರ್ಬನ್ ಆಫ್ಸೆಟ್",
  "Welcome back": "ಮರಳಿ ಸ್ವಾಗತ",
  "Fleet Efficiency": "ಫ್ಲೀಟ್ ದಕ್ಷತೆ",
  "Total Processed": "ಒಟ್ಟು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಿದೆ",
  "Logistics Margin": "ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮಾರ್ಜಿನ್",
  "CCCs": "ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್ಸ್",
  "Processing Yield": "ಸಂಸ್ಕರಣೆ ಇಳುವರಿ",
  "ESG Score": "ESG ಸ್ಕೋರ್",
  "Seed Demo Data": "ಬೀಜ ಡೆಮೊ ಡೇಟಾ",
  "Platform Statistics": "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಅಂಕಿಅಂಶಗಳು",
  "Value Generated": "ಮೌಲ್ಯವನ್ನು ರಚಿಸಲಾಗಿದೆ",
  "Total Investment": "ಒಟ್ಟು ಹೂಡಿಕೆ",
  "CCCs Generated": "ಕಾರ್ಬನ್ ಕಡಿಮೆಯಾಗಿದೆ",
  "Total Value": "ಒಟ್ಟು ಮೌಲ್ಯ",
  "New Collection Record": "ಹೊಸ ಕಲೆಕ್ಷನ್ ರೆಕಾರ್ಡ್",
  "Total Weight": "ಒಟ್ಟು ತೂಕ",
  "Performance Analytics": "ಕಾರ್ಯಕ್ಷಮತೆ ಅನಾಲಿಟಿಕ್ಸ್",
  "Reset Demo Data": "ಡೆಮೊ ಡೇಟಾವನ್ನು ಮರುಹೊಂದಿಸಿ",
  "Recent Activity": "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
  "Register New Farmer": "ಹೊಸ ರೈತರನ್ನು ನೋಂದಾಯಿಸಿ",
  "Waste Distribution": "ತ್ಯಾಜ್ಯ ವಿತರಣೆ",
  "Total Users": "ಒಟ್ಟು ಬಳಕೆದಾರರು",
  "New Intake Record": "ಹೊಸ ಸೇವನೆಯ ದಾಖಲೆ",
  "Farm Location": "ಫಾರ್ಮ್ ಸ್ಥಳ",
  "Mobile Number": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
  "Get Current Location": "ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಪಡೆಯಿರಿ",
  "New Processing Record": "ಹೊಸ ಸಂಸ್ಕರಣಾ ದಾಖಲೆ",
  "Land Area (Acres)": "ಭೂ ಪ್ರದೇಶ (ಎಕರೆ)",
  "Crop Type": "ಬೆಳೆ ಪ್ರಕಾರ",
  "Full Name": "ಪೂರ್ಣ ಹೆಸರು",
  "Latitude": "ಅಕ್ಷಾಂಶ",
  "Longitude": "ರೇಖಾಂಶ",
  "All": "ಎಲ್ಲಾ",
  "Transaction Ledger": "ವಹಿವಾಟು ಲೆಡ್ಜರ್",
  "In Transit": "ಸಾಗಣೆಯಲ್ಲಿ",
  "Pending Pickup": "ಪಿಕಪ್ ಬಾಕಿಯಿದೆ",
  "Foundational Doctrine": "ಫೌಂಡೇಶನಲ್ ಡಾಕ್ಟ್ರಿನ್",
  "Operations Management": "ಕಾರ್ಯಾಚರಣೆ ನಿರ್ವಹಣೆ",
  "Account Settings": "ಖಾತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
  "Processed": "ಸಂಸ್ಕರಿಸಲಾಗಿದೆ",
  "Registering...": "ನೋಂದಾಯಿಸಲಾಗುತ್ತಿದೆ...",
  "Register Farmer": "ನೋಂದಣಿ ರೈತ",
  "Base Value (Recycler)": "ಮೂಲ ಮೌಲ್ಯ (ಮರುಬಳಕೆ)",
  "Location Confirmation (Google Maps)": "ಸ್ಥಳ ದೃಢೀಕರಣ (ಗೂಗಲ್ ನಕ್ಷೆಗಳು)",
  "Waste Type": "ತ್ಯಾಜ್ಯದ ಪ್ರಕಾರ",
  "Weight (kg)": "ತೂಕ (ಕೆಜಿ)",
  "Verification Image": "ಪರಿಶೀಲನೆ ಚಿತ್ರ",
  "CCC Value": "ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್ ಮೌಲ್ಯ",
  "Total Sovereign Value": "ಒಟ್ಟು ಸಾರ್ವಭೌಮ ಮೌಲ್ಯ",
  "Estimated Value Breakdown": "ಅಂದಾಜು ಮೌಲ್ಯ ವಿಭಜನೆ",
  "Processing...": "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",
  "Confirm Intake & Mint Value": "ಸೇವನೆ ಮತ್ತು ಮಿಂಟ್ ಮೌಲ್ಯವನ್ನು ದೃಢೀಕರಿಸಿ",
  "Intake": "ಸೇವನೆ",
  "Convert Every Kilogram of Waste into": "ಪ್ರತಿ ಕಿಲೋಗ್ರಾಂ ತ್ಯಾಜ್ಯವನ್ನು ಪರಿವರ್ತಿಸಿ",
  "Global Circular Value": "ಜಾಗತಿಕ ಸುತ್ತೋಲೆ ಮೌಲ್ಯ",
  "Access the OS": "OS ಅನ್ನು ಪ್ರವೇಶಿಸಿ",
  "How it Works": "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
  "Features": "ವೈಶಿಷ್ಟ್ಯಗಳು",
  "Launch OS": "ಓಎಸ್ ಅನ್ನು ಪ್ರಾರಂಭಿಸಿ",
  "Ecosystem Roles": "ಪರಿಸರ ವ್ಯವಸ್ಥೆಯ ಪಾತ್ರಗಳು",
  "Sovereign-Grade Circular Economy Engine": "ಸಾರ್ವಭೌಮ-ದರ್ಜೆಯ ವೃತ್ತಾಕಾರದ ಆರ್ಥಿಕ ಎಂಜಿನ್",
  "RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.": "RupayKg ಎಂಬುದು ವೃತ್ತಾಕಾರದ ಆರ್ಥಿಕ ಕಾರ್ಯಾಚರಣಾ ವ್ಯವಸ್ಥೆಯಾಗಿದ್ದು, ಬಹು-ರೈಲು ಮೌಲ್ಯದ ಎಂಜಿನ್ ಮೂಲಕ ಕೃಷಿ, ಪುರಸಭೆ ಮತ್ತು ಕೈಗಾರಿಕಾ ತ್ಯಾಜ್ಯವನ್ನು ಹಣಗಳಿಸಲು ಸಮುದಾಯಗಳಿಗೆ ಅಧಿಕಾರ ನೀಡುತ್ತದೆ.",
  "Live Stream": "ಲೈವ್ ಸ್ಟ್ರೀಮ್",
  "Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.": "ಸಂಸ್ಕರಿಸಿದ ಪ್ರತಿ ಕಿಲೋಗ್ರಾಂ ಬಯೋಮಾಸ್‌ಗೆ ಮರುಬಳಕೆ, ಸಿಎಸ್‌ಆರ್, ಮುನ್ಸಿಪಲ್, ಕಾರ್ಬನ್ ಮತ್ತು ಇಪಿಆರ್ ರೈಲ್‌ಗಳಿಂದ ಏಕಕಾಲದಲ್ಲಿ ಮೌಲ್ಯವನ್ನು ಹೊರತೆಗೆಯಿರಿ.",
  "Read Whitepaper": "ಶ್ವೇತಪತ್ರವನ್ನು ಓದಿ",
  "Real-time waste throughput across the RupayKg OS": "RupayKg OS ನಾದ್ಯಂತ ನೈಜ-ಸಮಯದ ತ್ಯಾಜ್ಯ ಥ್ರೋಪುಟ್",
  "Multi-Rail Value Engine": "ಮಲ್ಟಿ-ರೈಲ್ ಮೌಲ್ಯದ ಎಂಜಿನ್",
  "Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.": "ತ್ಯಾಜ್ಯದ ಪ್ರಕಾರ, ತೂಕ ಮತ್ತು ಜಿಯೋಲೊಕೇಶನ್‌ನ ಸ್ವಯಂಚಾಲಿತ ಪರಿಶೀಲನೆಯು ಬದಲಾಗದ, ಸಾರ್ವಭೌಮ-ದರ್ಜೆಯ ಡೇಟಾ ಸಮಗ್ರತೆಯನ್ನು ಖಾತ್ರಿಗೊಳಿಸುತ್ತದೆ.",
  "Rural Wealth Creation": "ಗ್ರಾಮೀಣ ಸಂಪತ್ತು ಸೃಷ್ಟಿ",
  "AI-Verified Intake": "AI-ಪರಿಶೀಲಿಸಿದ ಸೇವನೆ",
  "Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.": "ನಾಗರಿಕ ವಾಲೆಟ್‌ಗಳಿಗೆ ನೇರವಾಗಿ ಹಣವನ್ನು ವಿತರಿಸಿ, ಪರಿಸರದ ಹೊಣೆಗಾರಿಕೆಗಳನ್ನು ಸ್ಥಳೀಯ ಆರ್ಥಿಕ ಬೆಳವಣಿಗೆಯಾಗಿ ಪರಿವರ್ತಿಸಿ.",
  "Live Network Impact": "ಲೈವ್ ನೆಟ್‌ವರ್ಕ್ ಪರಿಣಾಮ",
  "Value Minted": "ಮೌಲ್ಯವನ್ನು ಮುದ್ರಿಸಲಾಗಿದೆ",
  "Active Nodes": "ಸಕ್ರಿಯ ನೋಡ್ಗಳು",
  "Network Topology": "ನೆಟ್ವರ್ಕ್ ಟೋಪೋಲಜಿ",
  "A seamless pipeline from waste generation to value realization.": "ತ್ಯಾಜ್ಯ ಉತ್ಪಾದನೆಯಿಂದ ಮೌಲ್ಯ ಸಾಕ್ಷಾತ್ಕಾರಕ್ಕೆ ತಡೆರಹಿತ ಪೈಪ್‌ಲೈನ್.",
  "Distributed biomass collection nodes": "ಬಯೋಮಾಸ್ ಸಂಗ್ರಹಣೆ ನೋಡ್‌ಗಳನ್ನು ವಿತರಿಸಲಾಗಿದೆ",
  "Citizens collect agricultural, municipal, or industrial waste.": "ನಾಗರಿಕರು ಕೃಷಿ, ಪುರಸಭೆ ಅಥವಾ ಕೈಗಾರಿಕಾ ತ್ಯಾಜ್ಯವನ್ನು ಸಂಗ್ರಹಿಸುತ್ತಾರೆ.",
  "Aggregate": "ಒಟ್ಟುಗೂಡಿಸಿ",
  "Aggregators verify, weigh, and transport waste to facilities.": "ಸಂಗ್ರಾಹಕರು ತ್ಯಾಜ್ಯವನ್ನು ಪರಿಶೀಲಿಸುತ್ತಾರೆ, ತೂಕ ಮಾಡುತ್ತಾರೆ ಮತ್ತು ಸೌಲಭ್ಯಗಳಿಗೆ ಸಾಗಿಸುತ್ತಾರೆ.",
  "nodes": "ನೋಡ್ಗಳು",
  "Generate": "ರಚಿಸಿ",
  "Upload waste records": "ತ್ಯಾಜ್ಯ ದಾಖಲೆಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ",
  "Citizen": "ನಾಗರಿಕ",
  "Process": "ಪ್ರಕ್ರಿಯೆ",
  "Recyclers convert waste into usable materials or energy.": "ಮರುಬಳಕೆದಾರರು ತ್ಯಾಜ್ಯವನ್ನು ಬಳಸಬಹುದಾದ ವಸ್ತುಗಳು ಅಥವಾ ಶಕ್ತಿಯನ್ನಾಗಿ ಪರಿವರ್ತಿಸುತ್ತಾರೆ.",
  "Choose your part in the circular economy.": "ವೃತ್ತಾಕಾರದ ಆರ್ಥಿಕತೆಯಲ್ಲಿ ನಿಮ್ಮ ಭಾಗವನ್ನು ಆರಿಸಿ.",
  "Mint Value": "ಮಿಂಟ್ ಮೌಲ್ಯ",
  "Waste Generator": "ತ್ಯಾಜ್ಯ ಜನರೇಟರ್",
  "Instant wallet funding": "ತ್ವರಿತ ವಾಲೆಟ್ ನಿಧಿ",
  "Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.": "ಕೃಷಿ, ಪುರಸಭೆ ಅಥವಾ ಕೈಗಾರಿಕಾ ತ್ಯಾಜ್ಯವನ್ನು ಸಂಗ್ರಹಿಸಿ ಮತ್ತು ಠೇವಣಿ ಮಾಡಿ. ಒದಗಿಸಿದ ತ್ಯಾಜ್ಯದ ತೂಕ ಮತ್ತು ಪ್ರಕಾರದ ಆಧಾರದ ಮೇಲೆ ನೇರ ವಾಲೆಟ್ ಠೇವಣಿಗಳನ್ನು ಗಳಿಸಿ.",
  "Smart contracts distribute funds across all 5 value rails.": "ಸ್ಮಾರ್ಟ್ ಒಪ್ಪಂದಗಳು ಎಲ್ಲಾ 5 ಮೌಲ್ಯದ ಹಳಿಗಳಾದ್ಯಂತ ಹಣವನ್ನು ವಿತರಿಸುತ್ತವೆ.",
  "Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.": "ಒಟ್ಟುಗೂಡಿದ ತ್ಯಾಜ್ಯವನ್ನು ಸ್ವೀಕರಿಸಿ ಮತ್ತು ಅದನ್ನು ಅಂತಿಮ ಉತ್ಪನ್ನಗಳಾಗಿ ಸಂಸ್ಕರಿಸಿ. ಎಲ್ಲಾ ಹಳಿಗಳಾದ್ಯಂತ ಅಂತಿಮ ಮೌಲ್ಯದ ಸಾಕ್ಷಾತ್ಕಾರವನ್ನು ಪ್ರಚೋದಿಸಿ.",
  "Processor": "ಪ್ರೊಸೆಸರ್",
  "Collection & Transport": "ಸಂಗ್ರಹಣೆ ಮತ್ತು ಸಾರಿಗೆ",
  "Earn logistics margins": "ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಅಂಚುಗಳನ್ನು ಗಳಿಸಿ",
  "Aggregator": "ಸಂಗ್ರಾಹಕ",
  "Log collection batches": "ಲಾಗ್ ಸಂಗ್ರಹಣೆ ಬ್ಯಾಚ್‌ಗಳು",
  "Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.": "ನಾಗರಿಕ ಠೇವಣಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ತ್ಯಾಜ್ಯವನ್ನು ಕ್ರೋಢೀಕರಿಸಿ ಮತ್ತು ಸಂಸ್ಕರಣಾ ಸೌಲಭ್ಯಗಳಿಗೆ ವಸ್ತುಗಳನ್ನು ಸಾಗಿಸಲು ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಅನ್ನು ನಿರ್ವಹಿಸಿ.",
  "Recycler": "ಮರುಬಳಕೆ ಮಾಡುವವನು",
  "Route optimization data": "ಮಾರ್ಗ ಆಪ್ಟಿಮೈಸೇಶನ್ ಡೇಟಾ",
  "Track environmental impact": "ಪರಿಸರ ಪರಿಣಾಮವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
  "Login": "ಲಾಗಿನ್ ಮಾಡಿ",
  "Access CSR/EPR funds": "CSR/EPR ನಿಧಿಗಳನ್ನು ಪ್ರವೇಶಿಸಿ",
  "Context:": "ಸಂದರ್ಭ:",
  "Account Type": "ಖಾತೆ ಪ್ರಕಾರ",
  "Generate CCCs": "ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್‌ಗಳನ್ನು ರಚಿಸಿ",
  "Log processing yields": "ಲಾಗ್ ಸಂಸ್ಕರಣೆ ಇಳುವರಿ",
  "Circular Economy Operating System": "ಸರ್ಕ್ಯುಲರ್ ಎಕಾನಮಿ ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್",
  "District": "ಜಿಲ್ಲೆ",
  "Organization Name": "ಸಂಸ್ಥೆಯ ಹೆಸರು",
  "Register": "ನೋಂದಾಯಿಸಿ",
  "State": "ರಾಜ್ಯ",
  "Back to Home": "ಮನೆಗೆ ಹಿಂತಿರುಗಿ",
  "Access OS": "OS ಅನ್ನು ಪ್ರವೇಶಿಸಿ",
  "Quick Demo Access": "ತ್ವರಿತ ಡೆಮೊ ಪ್ರವೇಶ",
  "Password": "ಪಾಸ್ವರ್ಡ್",
  "Phone Number": "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
  "Submission Heatmap": "ಸಲ್ಲಿಕೆ ಹೀಟ್‌ಮ್ಯಾಪ್",
  "Global Impact Map": "ಜಾಗತಿಕ ಪರಿಣಾಮ ನಕ್ಷೆ",
  "System Audit Logs": "ಸಿಸ್ಟಮ್ ಆಡಿಟ್ ಲಾಗ್‌ಗಳು",
  "Create Account": "ಖಾತೆಯನ್ನು ರಚಿಸಿ",
  "Total Offset": "ಒಟ್ಟು ಆಫ್ಸೆಟ್",
  "Farmers Supported": "ರೈತರು ಬೆಂಬಲಿಸಿದರು",
  "Waste Diverted": "ತ್ಯಾಜ್ಯವನ್ನು ತಿರುಗಿಸಲಾಗಿದೆ",
  "Verify processed waste records to issue CCCs.": "ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್‌ಗಳನ್ನು ನೀಡಲು ಸಂಸ್ಕರಿಸಿದ ತ್ಯಾಜ್ಯ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
  "Impact Distribution": "ಪರಿಣಾಮ ವಿತರಣೆ",
  "All processed waste has been verified.": "ಎಲ್ಲಾ ಸಂಸ್ಕರಿಸಿದ ತ್ಯಾಜ್ಯವನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
  "Pending": "ಬಾಕಿಯಿದೆ",
  "No pending MRV records": "ಯಾವುದೇ ಬಾಕಿ ಉಳಿದಿರುವ MRV ದಾಖಲೆಗಳಿಲ್ಲ",
  "MRV Verification Dashboard": "MRV ಪರಿಶೀಲನೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  "Portfolio Composition": "ಪೋರ್ಟ್ಫೋಲಿಯೋ ಸಂಯೋಜನೆ",
  "Credit Value": "ಕ್ರೆಡಿಟ್ ಮೌಲ್ಯ",
  "Reject": "ತಿರಸ್ಕರಿಸಿ",
  "CCC Reduction": "CCC ಕಡಿತ",
  "Acreage": "ವಿಸ್ತೀರ್ಣ",
  "Purchase verified CCCs to offset your footprint.": "ನಿಮ್ಮ ಹೆಜ್ಜೆಗುರುತನ್ನು ಸರಿದೂಗಿಸಲು ಪರಿಶೀಲಿಸಿದ ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್‌ಗಳನ್ನು ಖರೀದಿಸಿ.",
  "AI Risk Score": "AI ರಿಸ್ಕ್ ಸ್ಕೋರ್",
  "Location Verification": "ಸ್ಥಳ ಪರಿಶೀಲನೆ",
  "Verify & Issue Credits": "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಕ್ರೆಡಿಟ್‌ಗಳನ್ನು ನೀಡಿ",
  "Available Credits": "ಲಭ್ಯವಿರುವ ಕ್ರೆಡಿಟ್‌ಗಳು",
  "Confirm Purchase": "ಖರೀದಿಯನ್ನು ದೃಢೀಕರಿಸಿ",
  "Recent Transactions": "ಇತ್ತೀಚಿನ ವಹಿವಾಟುಗಳು",
  "Cancel": "ರದ್ದುಮಾಡು",
  "Total Cost": "ಒಟ್ಟು ವೆಚ್ಚ",
  "Amount": "ಮೊತ್ತ",
  "Project": "ಯೋಜನೆ",
  "Purchase Credits": "ಖರೀದಿ ಕ್ರೆಡಿಟ್‌ಗಳು",
  "Amount to Purchase (Tonnes)": "ಖರೀದಿಸಲು ಮೊತ್ತ (ಟನ್)",
  "Your Offset Balance": "ನಿಮ್ಮ ಆಫ್‌ಸೆಟ್ ಬ್ಯಾಲೆನ್ಸ್",
  "Price per Tonne": "ಪ್ರತಿ ಟನ್‌ಗೆ ಬೆಲೆ",
  "Municipal Corporation": "ಮಹಾನಗರ ಪಾಲಿಕೆ",
  "Status": "ಸ್ಥಿತಿ",
  "MSW": "MSW",
  "Ward Analytics": "ವಾರ್ಡ್ ಅನಾಲಿಟಿಕ್ಸ್",
  "Ward-Level Analytics": "ವಾರ್ಡ್ ಮಟ್ಟದ ವಿಶ್ಲೇಷಣೆ",
  "Price": "ಬೆಲೆ",
  "Network Active": "ನೆಟ್‌ವರ್ಕ್ ಸಕ್ರಿಯವಾಗಿದೆ",
  "National Dashboard": "ರಾಷ್ಟ್ರೀಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  "Date": "ದಿನಾಂಕ",
  "Ward": "ವಾರ್ಡ್",
  "Citizen (MSW Generator)": "ನಾಗರಿಕ (MSW ಜನರೇಟರ್)",
  "Village-Level Analytics": "ಗ್ರಾಮ ಮಟ್ಟದ ವಿಶ್ಲೇಷಣೆ",
  "Biomass": "ಜೀವರಾಶಿ",
  "Village Analytics": "ವಿಲೇಜ್ ಅನಾಲಿಟಿಕ್ಸ್",
  "Village": "ಗ್ರಾಮ",
  "Farmer / FPO (Biomass Generator)": "ರೈತ / FPO (ಬಯೋಮಾಸ್ ಜನರೇಟರ್)",
  "Citizens": "ನಾಗರಿಕರು",
  "Gram Panchayat": "ಗ್ರಾಮ ಪಂಚಾಯತ್",
  "Farmers / FPOs": "ರೈತರು / FPOಗಳು",
  "All Roles": "ಎಲ್ಲಾ ಪಾತ್ರಗಳು",
  "Aggregators": "ಒಟ್ಟುಗೂಡಿಸುವವರು",
  "EPR Partners": "EPR ಪಾಲುದಾರರು",
  "CCC Buyers": "ಕಾರ್ಬನ್ ಖರೀದಿದಾರರು",
  "CSR Partners": "ಸಿಎಸ್ಆರ್ ಪಾಲುದಾರರು",
  "CCC Pool Status": "ಕಾರ್ಬನ್ ಪೂಲ್ ಸ್ಥಿತಿ",
  "User Management": "ಬಳಕೆದಾರ ನಿರ್ವಹಣೆ",
  "Diverted": "ದಿಕ್ಕು ತಪ್ಪಿಸಲಾಗಿದೆ",
  "Audit Logs": "ಆಡಿಟ್ ದಾಖಲೆಗಳು",
  "Fraud Alerts & Flagged Events": "ವಂಚನೆ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಫ್ಲ್ಯಾಗ್ ಮಾಡಿದ ಈವೆಂಟ್‌ಗಳು",
  "Processors": "ಸಂಸ್ಕಾರಕಗಳು",
  "Processed Events": "ಸಂಸ್ಕರಿಸಿದ ಘಟನೆಗಳು",
  "Total Waste Events": "ಒಟ್ಟು ತ್ಯಾಜ್ಯ ಘಟನೆಗಳು",
  "Wallet Disbursed": "ವಾಲೆಟ್ ವಿತರಿಸಲಾಗಿದೆ",
  "Economic Efficiency": "ಆರ್ಥಿಕ ದಕ್ಷತೆ",
  "Environmental Impact": "ಪರಿಸರದ ಪ್ರಭಾವ",
  "Trees Equivalent": "ಮರಗಳು ಸಮಾನ",
  "Methane Avoided": "ಮೀಥೇನ್ ತಪ್ಪಿಸಲಾಗಿದೆ",
  "Trees": "ಮರಗಳು",
  "Growth & Impact Trends": "ಬೆಳವಣಿಗೆ ಮತ್ತು ಪರಿಣಾಮದ ಪ್ರವೃತ್ತಿಗಳು",
  "Water Saved": "ನೀರು ಉಳಿಸಲಾಗಿದೆ",
  "Geospatial Fraud Distribution": "ಜಿಯೋಸ್ಪೇಷಿಯಲ್ ವಂಚನೆ ವಿತರಣೆ",
  "Processing Efficiency": "ಸಂಸ್ಕರಣೆ ದಕ್ಷತೆ",
  "Avg Price / kg": "ಸರಾಸರಿ ಬೆಲೆ / ಕೆಜಿ",
  "Operational Health": "ಕಾರ್ಯಾಚರಣೆಯ ಆರೋಗ್ಯ",
  "Waste Composition": "ತ್ಯಾಜ್ಯ ಸಂಯೋಜನೆ",
  "Total Minted CCC Units": "ಒಟ್ಟು ಮಿಂಟೆಡ್ ಕಾರ್ಬನ್ ಘಟಕಗಳು",
  "No flagged events detected.": "ಯಾವುದೇ ಫ್ಲ್ಯಾಗ್ ಮಾಡಿದ ಈವೆಂಟ್‌ಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ.",
  "* Government savings calculated based on avoided landfill management and environmental remediation costs.": "* ತಪ್ಪಿಸಿದ ಭೂಕುಸಿತ ನಿರ್ವಹಣೆ ಮತ್ತು ಪರಿಸರ ಪರಿಹಾರ ವೆಚ್ಚಗಳ ಆಧಾರದ ಮೇಲೆ ಸರ್ಕಾರದ ಉಳಿತಾಯವನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.",
  "Govt Cost Savings": "ಸರ್ಕಾರದ ವೆಚ್ಚ ಉಳಿತಾಯ",
  "MRV Rejection Rate": "MRV ನಿರಾಕರಣೆ ದರ",
  "Wallet": "ವಾಲೆಟ್",
  "Regulator": "ನಿಯಂತ್ರಕ",
  "Location": "ಸ್ಥಳ",
  "Super Admin": "ಸೂಪರ್ ಅಡ್ಮಿನ್",
  "State Admin": "ರಾಜ್ಯ ಆಡಳಿತ",
  "CSR Partner": "ಸಿಎಸ್ಆರ್ ಪಾಲುದಾರ",
  "User": "ಬಳಕೆದಾರ",
  "Municipal Admin": "ಪುರಸಭೆ ಆಡಳಿತಾಧಿಕಾರಿ",
  "Role": "ಪಾತ್ರ",
  "Actions": "ಕ್ರಿಯೆಗಳು",
  "Total Events": "ಒಟ್ಟು ಘಟನೆಗಳು",
  "EPR Partner": "ಇಪಿಆರ್ ಪಾಲುದಾರ",
  "No users found.": "ಯಾವುದೇ ಬಳಕೆದಾರರು ಕಂಡುಬಂದಿಲ್ಲ.",
  "No audit logs available.": "ಯಾವುದೇ ಆಡಿಟ್ ಲಾಗ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ.",
  "Action": "ಕ್ರಿಯೆ",
  "User ID": "ಬಳಕೆದಾರ ID",
  "Delete User": "ಬಳಕೆದಾರರನ್ನು ಅಳಿಸಿ",
  "CCC Buyer": "ಕಾರ್ಬನ್ ಖರೀದಿದಾರ",
  "Total Waste": "ಒಟ್ಟು ತ್ಯಾಜ್ಯ",
  "No ward data available.": "ಯಾವುದೇ ವಾರ್ಡ್ ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ.",
  "Email Notifications": "ಇಮೇಲ್ ಅಧಿಸೂಚನೆಗಳು",
  "Notification Preferences": "ಅಧಿಸೂಚನೆ ಪ್ರಾಶಸ್ತ್ಯಗಳು",
  "Receive updates about your transactions via email.": "ಇಮೇಲ್ ಮೂಲಕ ನಿಮ್ಮ ವಹಿವಾಟುಗಳ ಕುರಿತು ನವೀಕರಣಗಳನ್ನು ಸ್ವೀಕರಿಸಿ.",
  "Push Notifications": "ಪುಶ್ ಅಧಿಸೂಚನೆಗಳು",
  "Get instant SMS alerts for critical updates.": "ನಿರ್ಣಾಯಕ ನವೀಕರಣಗಳಿಗಾಗಿ ತ್ವರಿತ SMS ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಿರಿ.",
  "Save Changes": "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
  "SMS Alerts": "SMS ಎಚ್ಚರಿಕೆಗಳು",
  "Saving...": "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",
  "Enable browser push notifications.": "ಬ್ರೌಸರ್ ಪುಶ್ ಅಧಿಸೂಚನೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.",
  "Add ₹10,000": "₹10,000 ಸೇರಿಸಿ",
  "GENESIS": "ಜೆನೆಸಿಸ್",
  " Context (": "ಸಂದರ್ಭ (",
  "Currently Active: ": "ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ:",
  "Weight: ": "ತೂಕ:",
  "© 2026 RupayKg Circular Economy OS. All rights reserved.": "© 2026 RupayKg ಸರ್ಕ್ಯುಲರ್ ಎಕಾನಮಿ ಓಎಸ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
  "How the Engine Works": "ಎಂಜಿನ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
  "Village: ": "ಗ್ರಾಮ:",
  "Value: ": "ಮೌಲ್ಯ:",
  "Type: ": "ಪ್ರಕಾರ:",
  "FRAUD ALERT": "ವಂಚನೆ ಎಚ್ಚರಿಕೆ",
  "rural": "ಗ್ರಾಮೀಣ",
  "Privacy": "ಗೌಪ್ಯತೆ",
  "National Regulator": "ರಾಷ್ಟ್ರೀಯ ನಿಯಂತ್ರಕ",
  "Admin": "ನಿರ್ವಾಹಕ",
  "Terms": "ನಿಯಮಗಳು",
  "urban": "ನಗರ",
  "RUPAYKG": "ರೂಪಾಯಿಕೆಜಿ",
  "Farmer": "ರೈತ",
  "Processor (Recycler)": "ಪ್ರೊಸೆಸರ್ (ಮರುಬಳಕೆ)",
  "Aggregator (Collection & Transport)": "ಸಂಗ್ರಾಹಕ (ಸಂಗ್ರಹ ಮತ್ತು ಸಾರಿಗೆ)",
  "No records found": "ಯಾವುದೇ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
  "GPS Captured: ": "GPS ಸೆರೆಹಿಡಿಯಲಾಗಿದೆ:",
  "Capturing GPS Coordinates...": "GPS ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಸೆರೆಹಿಡಿಯಲಾಗುತ್ತಿದೆ...",
  "Wallet Balance": "ವಾಲೆಟ್ ಬ್ಯಾಲೆನ್ಸ್",
  "No audit logs found": "ಯಾವುದೇ ಆಡಿಟ್ ಲಾಗ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
  "Circular Economy Intake Form": "ವೃತ್ತಾಕಾರದ ಆರ್ಥಿಕ ಸೇವನೆಯ ನಮೂನೆ",
  "GPS Capture Failed": "GPS ಕ್ಯಾಪ್ಚರ್ ವಿಫಲವಾಗಿದೆ",
  "Database Connection Failed": "ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ",
  "Acreage (acres)": "ಎಕರೆ (ಎಕರೆ)",
  "Name": "ಹೆಸರು",
  "Farmer registered successfully! ID: ": "ರೈತರು ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಿಕೊಂಡಿದ್ದಾರೆ! ID:",
  "Retry GPS": "GPS ಅನ್ನು ಮರುಪ್ರಯತ್ನಿಸಿ",
  "Failed to register farmer": "ರೈತರನ್ನು ನೋಂದಾಯಿಸಲು ವಿಫಲವಾಗಿದೆ",
  "Active Fleet": "ಸಕ್ರಿಯ ಫ್ಲೀಟ್",
  "Drivers Online": "ಚಾಲಕರು ಆನ್ಲೈನ್",
  "GPS Required": "GPS ಅಗತ್ಯವಿದೆ",
  "Geolocation is not supported by this browser.": "ಜಿಯೋಲೊಕೇಶನ್ ಅನ್ನು ಈ ಬ್ರೌಸರ್ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ.",
  "e.g., Paddy, Wheat": "ಉದಾ., ಭತ್ತ, ಗೋಧಿ",
  "Failed to get location. Please enter manually.": "ಸ್ಥಳವನ್ನು ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ.",
  "Active Queue": "ಸಕ್ರಿಯ ಸರತಿ ಸಾಲು",
  "Storage Utilization": "ಶೇಖರಣಾ ಬಳಕೆ",
  "Total Capacity": "ಒಟ್ಟು ಸಾಮರ್ಥ್ಯ",
  "Incoming for Processing": "ಸಂಸ್ಕರಣೆಗಾಗಿ ಒಳಬರುತ್ತಿದೆ",
  "Utilization": "ಬಳಕೆ",
  "Output Material": "ಔಟ್ಪುಟ್ ಮೆಟೀರಿಯಲ್",
  "No new tasks available.": "ಯಾವುದೇ ಹೊಸ ಕಾರ್ಯಗಳು ಲಭ್ಯವಿಲ್ಲ.",
  "Current Load": "ಪ್ರಸ್ತುತ ಲೋಡ್",
  "Biomass in Stock": "ಬಯೋಮಾಸ್ ಇನ್ ಸ್ಟಾಕ್",
  "Accept Pickup": "ಪಿಕಪ್ ಸ್ವೀಕರಿಸಿ",
  "Available for Pickup": "ಪಿಕಪ್‌ಗೆ ಲಭ್ಯವಿದೆ",
  "MRV Status": "MRV ಸ್ಥಿತಿ",
  "Pending MRV": "ಬಾಕಿ ಉಳಿದಿರುವ MRV",
  "No records found for the selected filter.": "ಆಯ್ಕೆಮಾಡಿದ ಫಿಲ್ಟರ್‌ಗೆ ಯಾವುದೇ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
  "Type": "ಟೈಪ್ ಮಾಡಿ",
  "Accept Receipt": "ರಶೀದಿಯನ್ನು ಸ್ವೀಕರಿಸಿ",
  "Weight": "ತೂಕ",
  "No active tasks in your possession.": "ನಿಮ್ಮ ಬಳಿ ಯಾವುದೇ ಸಕ್ರಿಯ ಕಾರ್ಯಗಳಿಲ್ಲ.",
  "Recently Processed": "ಇತ್ತೀಚೆಗೆ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಿದೆ",
  "Value": "ಮೌಲ್ಯ",
  "Timestamp": "ಟೈಮ್‌ಸ್ಟ್ಯಾಂಪ್",
  "AI Risk": "AI ಅಪಾಯ",
  "Med": "ಮೆಡ್",
  "High": "ಹೆಚ್ಚು",
  "Verified By": "ಮೂಲಕ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
  "No credits available": "ಯಾವುದೇ ಕ್ರೆಡಿಟ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ",
  "No MRV history found": "ಯಾವುದೇ MRV ಇತಿಹಾಸ ಕಂಡುಬಂದಿಲ್ಲ",
  "Low": "ಕಡಿಮೆ",
  "Check back later for newly verified CCCs.": "ಹೊಸದಾಗಿ ಪರಿಶೀಲಿಸಿದ ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್‌ಗಳಿಗಾಗಿ ನಂತರ ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ.",
  "Details": "ವಿವರಗಳು",
  "Record ID": "ರೆಕಾರ್ಡ್ ಐಡಿ",
  "Offset": "ಆಫ್ಸೆಟ್",
  "Profile Settings": "ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
  "Purchase Credit": "ಖರೀದಿ ಕ್ರೆಡಿಟ್",
  "The Foundational Structure and Operating Doctrine of RupayKg": "ರೂಪಾಯಿಕೆಜಿಯ ಅಡಿಪಾಯದ ರಚನೆ ಮತ್ತು ಕಾರ್ಯಾಚರಣಾ ಸಿದ್ಧಾಂತ",
  "An error occurred": "ದೋಷ ಸಂಭವಿಸಿದೆ",
  "Insufficient Funds": "ಸಾಕಷ್ಟು ನಿಧಿಗಳು",
  "Profile updated successfully": "ಪ್ರೊಫೈಲ್ ಅನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ",
  "Failed to update profile": "ಪ್ರೊಫೈಲ್ ಅನ್ನು ನವೀಕರಿಸಲು ವಿಫಲವಾಗಿದೆ",
  "Verified": "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
  "I. Introduction": "I. ಪರಿಚಯ",
  "The platform addresses a structural gap in India’s CCC ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade CCC supply.": "ವೇದಿಕೆಯು ಭಾರತದ ಇಂಗಾಲದ ಪರಿಸರ ವ್ಯವಸ್ಥೆಯಲ್ಲಿನ ರಚನಾತ್ಮಕ ಅಂತರವನ್ನು ಪರಿಹರಿಸುತ್ತದೆ: ಏಕೀಕೃತ, ನಿಯಂತ್ರಕ-ಜೋಡಿಸಲಾದ ಡಿಜಿಟಲ್ ಮೂಲಸೌಕರ್ಯಗಳ ಅನುಪಸ್ಥಿತಿಯು ಪರಿಶೀಲಿಸಿದ ತ್ಯಾಜ್ಯವನ್ನು ಅನುಸರಣೆ-ದರ್ಜೆಯ ಕಾರ್ಬನ್ ಪೂರೈಕೆಯಾಗಿ ಪರಿವರ್ತಿಸುವ ಸಾಮರ್ಥ್ಯವನ್ನು ಹೊಂದಿದೆ.",
  "Category": "ವರ್ಗ",
  "RupayKg has been established as a Unified Waste-to-CCC Digital Operating System designed to support India’s transition toward a compliance-based CCC market.": "ಅನುಸರಣೆ ಆಧಾರಿತ ಕಾರ್ಬನ್ ಮಾರುಕಟ್ಟೆಯತ್ತ ಭಾರತದ ಪರಿವರ್ತನೆಯನ್ನು ಬೆಂಬಲಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಏಕೀಕೃತ ತ್ಯಾಜ್ಯದಿಂದ ಕಾರ್ಬನ್ ಡಿಜಿಟಲ್ ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್ ಆಗಿ RupayKg ಅನ್ನು ಸ್ಥಾಪಿಸಲಾಗಿದೆ.",
  "Municipal Corp + Ward": "ಮುನ್ಸಿಪಲ್ ಕಾರ್ಪ್ + ವಾರ್ಡ್",
  "II. Unified Operating System Model": "II. ಏಕೀಕೃತ ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್ ಮಾದರಿ",
  "Anchor": "ಆಂಕರ್",
  "RupayKg is not structured as a project developer, CCC trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.": "RupayKg ಅನ್ನು ಪ್ರಾಜೆಕ್ಟ್ ಡೆವಲಪರ್, ಕಾರ್ಬನ್ ವ್ಯಾಪಾರಿ ಅಥವಾ ಮರುಬಳಕೆ ಘಟಕವಾಗಿ ರಚಿಸಲಾಗಿಲ್ಲ. ಇದು ವಾಸ್ತುಶಿಲ್ಪದ ನಕಲು ಇಲ್ಲದೆ ನಗರ ಮತ್ತು ಗ್ರಾಮೀಣ ಆಡಳಿತಾತ್ಮಕ ಚೌಕಟ್ಟುಗಳಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಮೂಲಸೌಕರ್ಯ ಪದರವಾಗಿದೆ.",
  "Context": "ಸಂದರ್ಭ",
  "Rural": "ಗ್ರಾಮೀಣ",
  "Urban": "ನಗರ",
  "Administrative Authority": "ಆಡಳಿತಾತ್ಮಕ ಪ್ರಾಧಿಕಾರ",
  "Gram Panchayat + Village": "ಗ್ರಾಮ ಪಂಚಾಯತ್ + ಗ್ರಾಮ",
  "The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.": "ಸಂಗ್ರಾಹಕವನ್ನು ರಚನಾತ್ಮಕವಾಗಿ ವಿಲೀನಗೊಳಿಸಿದ ಘಟಕ ಎಂದು ವ್ಯಾಖ್ಯಾನಿಸಲಾಗಿದೆ.",
  "Producers (EPR)": "ನಿರ್ಮಾಪಕರು (EPR)",
  "Methane avoidance through diversion": "ತಿರುವು ಮೂಲಕ ಮೀಥೇನ್ ತಪ್ಪಿಸುವುದು",
  "* All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.": "* ಎಲ್ಲಾ ಗ್ರಾಮೀಣ ಕೃಷಿ ಅವಶೇಷಗಳು ಮತ್ತು ಜೀವರಾಶಿ ಚಟುವಟಿಕೆಗಳನ್ನು ಜೀವರಾಶಿ ಅಡಿಯಲ್ಲಿ ವರ್ಗೀಕರಿಸಲಾಗಿದೆ. ಯಾವುದೇ ಪ್ರತ್ಯೇಕ ಕೃಷಿ ಲಂಬ ಅಸ್ತಿತ್ವದಲ್ಲಿಲ್ಲ.",
  "IV. CCC Origination": "IV. ಕಾರ್ಬನ್ ಮೂಲ",
  "Biomass-based fossil substitution": "ಜೀವರಾಶಿ ಆಧಾರಿತ ಪಳೆಯುಳಿಕೆ ಪರ್ಯಾಯ",
  "CSR Contributors": "ಸಿಎಸ್ಆರ್ ಕೊಡುಗೆದಾರರು",
  "III. Unified Stakeholder Architecture": "III. ಯುನಿಫೈಡ್ ಸ್ಟೇಕ್‌ಹೋಲ್ಡರ್ ಆರ್ಕಿಟೆಕ್ಚರ್",
  "CSR Rail": "ಸಿಎಸ್ಆರ್ ರೈಲು",
  "VI. Regulator Sovereignty": "VI. ನಿಯಂತ್ರಕ ಸಾರ್ವಭೌಮತ್ವ",
  "CCC Rail": "ಕಾರ್ಬನ್ ರೈಲು",
  "EPR Rail": "ಇಪಿಆರ್ ರೈಲು",
  "V. Multi-Rail Architecture": "V. ಮಲ್ಟಿ-ರೈಲ್ ಆರ್ಕಿಟೆಕ್ಚರ್",
  "Recycling substitution": "ಮರುಬಳಕೆ ಪರ್ಯಾಯ",
  "VII. Strategic Position": "VII. ಕಾರ್ಯತಂತ್ರದ ಸ್ಥಾನ",
  "CCC issuance authority remains regulator-controlled. RupayKg does not independently mint credits. All credits must be event-traceable, registry-compatible, and align with national CCC governance frameworks.": "ಕಾರ್ಬನ್ ವಿತರಣಾ ಪ್ರಾಧಿಕಾರವು ನಿಯಂತ್ರಕ-ನಿಯಂತ್ರಿತವಾಗಿ ಉಳಿದಿದೆ. RupayKg ಸ್ವತಂತ್ರವಾಗಿ ಕ್ರೆಡಿಟ್‌ಗಳನ್ನು ನೀಡುವುದಿಲ್ಲ. ಎಲ್ಲಾ ಕ್ರೆಡಿಟ್‌ಗಳು ಈವೆಂಟ್-ಟ್ರೇಸ್ ಮಾಡಬಹುದಾದ, ನೋಂದಾವಣೆ-ಹೊಂದಾಣಿಕೆಯಾಗಿರಬೇಕು ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಕಾರ್ಬನ್ ಆಡಳಿತದ ಚೌಕಟ್ಟುಗಳೊಂದಿಗೆ ಜೋಡಿಸಬೇಕು.",
  "Recycler Rail": "ಮರುಬಳಕೆ ರೈಲು",
  "Governance Layer": "ಆಡಳಿತ ಪದರ",
  "DECLARATION OF FOUNDATIONAL STRUCTURE": "ಮೂಲಭೂತ ರಚನೆಯ ಘೋಷಣೆ",
  "India is entering a compliance CCC era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.": "ಭಾರತವು ಅನುಸರಣೆ ಇಂಗಾಲದ ಯುಗವನ್ನು ಪ್ರವೇಶಿಸುತ್ತಿದೆ. ಪುರಸಭೆಯ ವ್ಯವಸ್ಥೆಗಳು ಅಳೆಯಬಹುದಾದ ಮೀಥೇನ್ ಅನ್ನು ಉತ್ಪಾದಿಸುತ್ತವೆ. ಗ್ರಾಮೀಣ ಜೀವರಾಶಿಯನ್ನು ಸುಡಲಾಗುತ್ತದೆ ಅಥವಾ ಬಳಸಲಾಗುವುದಿಲ್ಲ. ಆದರೂ ವ್ಯವಸ್ಥೆಗಳು ಛಿದ್ರಗೊಂಡಿವೆ.",
  "— Founder, RupayKg": "- ಸಂಸ್ಥಾಪಕ, ರೂಪಾಯಿಕೆಜಿ",
  "When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated CCC value?": "ನಾವು RupayKg ಅನ್ನು ನಿರ್ಮಿಸಲು ಪ್ರಾರಂಭಿಸಿದಾಗ, ನಾವು ಮರುಬಳಕೆಯೊಂದಿಗೆ ಪ್ರಾರಂಭಿಸಲಿಲ್ಲ. ನಾವು ರಚನಾತ್ಮಕ ಪ್ರಶ್ನೆಯೊಂದಿಗೆ ಪ್ರಾರಂಭಿಸಿದ್ದೇವೆ: ತ್ಯಾಜ್ಯವನ್ನು ನಿಯಂತ್ರಿತ ಇಂಗಾಲದ ಮೌಲ್ಯಕ್ಕೆ ಪರಿವರ್ತಿಸುವ ಏಕೀಕೃತ ಮೂಲಸೌಕರ್ಯ ಏಕೆ ಇಲ್ಲ?",
  "Article II — Unified Stakeholder Doctrine": "ಲೇಖನ II - ಏಕೀಕೃತ ಮಧ್ಯಸ್ಥಗಾರರ ಸಿದ್ಧಾಂತ",
  "Legally Styled": "ಕಾನೂನುಬದ್ಧವಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ",
  "RupayKg was built to unify them. Not as a CCC trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.": "ಅವರನ್ನು ಒಗ್ಗೂಡಿಸಲು ರೂಪಾಯಿಕೆಜಿ ನಿರ್ಮಿಸಲಾಗಿದೆ. ಕಾರ್ಬನ್ ವ್ಯಾಪಾರಿಯಾಗಿ ಅಲ್ಲ. ಮರುಬಳಕೆಯ ಪ್ರಾರಂಭವಾಗಿ ಅಲ್ಲ. ಆದರೆ ರಚನಾತ್ಮಕ ನಕಲು ಇಲ್ಲದೆ ಮುನ್ಸಿಪಲ್ ವಾರ್ಡ್ ಮಟ್ಟ ಮತ್ತು ಗ್ರಾಮ ಪಂಚಾಯತ್ ಗ್ರಾಮ ಮಟ್ಟದಲ್ಲಿ ಕೆಲಸ ಮಾಡುವ ಸಾಮರ್ಥ್ಯವಿರುವ ಏಕೈಕ ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್ ಆಗಿ.",
  "Article I — Unified Operating System": "ಲೇಖನ I - ಏಕೀಕೃತ ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್",
  "Waste is no longer disposal. It is governance-linked climate infrastructure.": "ಇನ್ನು ತ್ಯಾಜ್ಯ ವಿಲೇವಾರಿ ಆಗಿಲ್ಲ. ಇದು ಆಡಳಿತ-ಸಂಯೋಜಿತ ಹವಾಮಾನ ಮೂಲಸೌಕರ್ಯವಾಗಿದೆ.",
  "RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.": "RupayKg ಅಡಿಯಲ್ಲಿ ನಿಯೋಜಿಸಬಹುದಾದ ಏಕೈಕ ಡಿಜಿಟಲ್ ವ್ಯವಸ್ಥೆಯನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ: (ಎ) ಮುನ್ಸಿಪಲ್ ಕಾರ್ಪೊರೇಷನ್ + ವಾರ್ಡ್ (ನಗರ ಸಂದರ್ಭ) (ಬಿ) ಗ್ರಾಮ ಪಂಚಾಯತ್ + ಗ್ರಾಮ (ಗ್ರಾಮೀಣ ಸಂದರ್ಭ). ಸಂದರ್ಭಗಳ ನಡುವೆ ಯಾವುದೇ ರಚನಾತ್ಮಕ ನಕಲು ಇರಬಾರದು.",
  "Article V — Rail Separation": "ಲೇಖನ V - ರೈಲು ಪ್ರತ್ಯೇಕತೆ",
  "Article III — Waste Classification": "ಲೇಖನ III - ತ್ಯಾಜ್ಯ ವರ್ಗೀಕರಣ",
  "Article IV — CCC Engine": "ಲೇಖನ IV - ಕಾರ್ಬನ್ ಎಂಜಿನ್",
  "Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.": "ತ್ಯಾಜ್ಯವನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ವರ್ಗೀಕರಿಸಬೇಕು: (ಎ) ನಗರ ಸನ್ನಿವೇಶದಲ್ಲಿ MSW (b) ಗ್ರಾಮೀಣ ಸಂದರ್ಭದಲ್ಲಿ ಜೀವರಾಶಿ. ಎಲ್ಲಾ ಕೃಷಿ ಅವಶೇಷಗಳನ್ನು ಬಯೋಮಾಸ್ ಅಡಿಯಲ್ಲಿ ವರ್ಗೀಕರಿಸಬೇಕು.",
  "All emission reductions shall be processed through a single CCC calculation engine with event-level MRV validation.": "ಎಲ್ಲಾ ಹೊರಸೂಸುವಿಕೆ ಕಡಿತಗಳನ್ನು ಈವೆಂಟ್-ಮಟ್ಟದ MRV ಮೌಲ್ಯೀಕರಣದೊಂದಿಗೆ ಒಂದೇ ಇಂಗಾಲದ ಲೆಕ್ಕಾಚಾರದ ಎಂಜಿನ್ ಮೂಲಕ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತದೆ.",
  "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, CCC issuance. Double counting is prohibited.": "RupayKg ಇವುಗಳ ನಡುವೆ ಕಟ್ಟುನಿಟ್ಟಾದ ಪ್ರತ್ಯೇಕತೆಯನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಬೇಕು: ಮರುಬಳಕೆಯ ಲೆಕ್ಕಪತ್ರ ನಿರ್ವಹಣೆ, CSR ಲೆಕ್ಕಪತ್ರ ನಿರ್ವಹಣೆ, EPR ಅನುಸರಣೆ, ಆಡಳಿತ ಮೌಲ್ಯ, ಕಾರ್ಬನ್ ವಿತರಣೆ. ಎರಡು ಬಾರಿ ಎಣಿಕೆ ಮಾಡುವುದನ್ನು ನಿಷೇಧಿಸಲಾಗಿದೆ.",
  "The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, CCC Buyers, Regulator.": "ಮಧ್ಯಸ್ಥಗಾರರ ರಚನೆಯು ರಾಷ್ಟ್ರವ್ಯಾಪಿ ಏಕರೂಪವಾಗಿರುತ್ತದೆ ಮತ್ತು ಇವುಗಳನ್ನು ಒಳಗೊಂಡಿರುತ್ತದೆ: ತ್ಯಾಜ್ಯ ಜನರೇಟರ್, ಸಂಗ್ರಾಹಕ, ಪ್ರೊಸೆಸರ್, ಆಡಳಿತ ಪ್ರಾಧಿಕಾರ, ನಿರ್ಮಾಪಕರು (ಇಪಿಆರ್), ಸಿಎಸ್ಆರ್ ಕೊಡುಗೆದಾರರು, ಕಾರ್ಬನ್ ಖರೀದಿದಾರರು, ನಿಯಂತ್ರಕ.",
  "Article VI — Regulator Sovereignty": "ಲೇಖನ VI - ನಿಯಂತ್ರಕ ಸಾರ್ವಭೌಮತ್ವ",
  "Institutional Identity": "ಸಾಂಸ್ಥಿಕ ಗುರುತು",
  "CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs.": "ಕಾರ್ಬನ್ ಮಿಂಟ್ ಪ್ರಾಧಿಕಾರವು ನಿಯಂತ್ರಕ ನಿಯಂತ್ರಣದಲ್ಲಿ ಉಳಿಯುತ್ತದೆ. RupayKg ಸ್ವತಂತ್ರವಾಗಿ ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್‌ಗಳನ್ನು ನೀಡುವುದಿಲ್ಲ.",
  "RupayKg is hereby defined as: A Unified Waste-to-CCC Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability.": "RupayKg ಅನ್ನು ಈ ಮೂಲಕ ಹೀಗೆ ವ್ಯಾಖ್ಯಾನಿಸಲಾಗಿದೆ: ನಿಯಂತ್ರಕ-ಜೋಡಣೆಗೊಂಡ ಇಂಗಾಲದ ಮೂಲದ ಸಾಮರ್ಥ್ಯದೊಂದಿಗೆ ಒಂದೇ ರಾಷ್ಟ್ರೀಯ ಮಧ್ಯಸ್ಥಗಾರರ ವಾಸ್ತುಶಿಲ್ಪದ ಅಡಿಯಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಏಕೀಕೃತ ತ್ಯಾಜ್ಯದಿಂದ ಇಂಗಾಲದ ಮೂಲಸೌಕರ್ಯ ವೇದಿಕೆ."
  } },
  ml: { translation: {
  "Settings": "ക്രമീകരണങ്ങൾ",
  "History": "ചരിത്രം",
  "CCC Market": "കാർബൺ മാർക്കറ്റ്",
  "Dashboard": "ഡാഷ്ബോർഡ്",
  "MRV Dashboard": "എംആർവി ഡാഷ്ബോർഡ്",
  "Upload Waste": "മാലിന്യങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക",
  "Task Board": "ടാസ്ക് ബോർഡ്",
  "Logout": "പുറത്തുകടക്കുക",
  "National KPI": "ദേശീയ കെ.പി.ഐ",
  "Genesis": "ഉല്പത്തി",
  "Language": "ഭാഷ",
  "Farmers Registered": "കർഷകർ രജിസ്റ്റർ ചെയ്തു",
  "Welcome back": "തിരികെ സ്വാഗതം",
  "Hindi": "ഹിന്ദി",
  "Community Rank": "കമ്മ്യൂണിറ്റി റാങ്ക്",
  "System Overview": "സിസ്റ്റം അവലോകനം",
  "Total Earnings": "ആകെ വരുമാനം",
  "Total Collected": "ആകെ ശേഖരിച്ചത്",
  "CCC Offset": "കാർബൺ ഓഫ്സെറ്റ്",
  "English": "ഇംഗ്ലീഷ്",
  "CCCs": "കാർബൺ ക്രെഡിറ്റ്",
  "Logistics Margin": "ലോജിസ്റ്റിക്സ് മാർജിൻ",
  "Platform Statistics": "പ്ലാറ്റ്ഫോം സ്ഥിതിവിവരക്കണക്കുകൾ",
  "Total Investment": "മൊത്തം നിക്ഷേപം",
  "Processing Yield": "വിളവ് പ്രോസസ്സ് ചെയ്യുന്നു",
  "ESG Score": "ESG സ്കോർ",
  "Total Processed": "ആകെ പ്രോസസ്സ് ചെയ്തു",
  "Seed Demo Data": "സീഡ് ഡെമോ ഡാറ്റ",
  "Value Generated": "മൂല്യം സൃഷ്ടിച്ചു",
  "Fleet Efficiency": "ഫ്ലീറ്റ് കാര്യക്ഷമത",
  "New Collection Record": "പുതിയ കളക്ഷൻ റെക്കോർഡ്",
  "Total Users": "മൊത്തം ഉപയോക്താക്കൾ",
  "Total Weight": "ആകെ ഭാരം",
  "Waste Distribution": "മാലിന്യ വിതരണം",
  "Register New Farmer": "പുതിയ കർഷകനെ രജിസ്റ്റർ ചെയ്യുക",
  "Total Value": "ആകെ മൂല്യം",
  "Recent Activity": "സമീപകാല പ്രവർത്തനം",
  "Performance Analytics": "പെർഫോമൻസ് അനലിറ്റിക്സ്",
  "Reset Demo Data": "ഡെമോ ഡാറ്റ പുനഃസജ്ജമാക്കുക",
  "CCCs Generated": "കാർബൺ കുറച്ചു",
  "Longitude": "രേഖാംശം",
  "Full Name": "പൂർണ്ണമായ പേര്",
  "Latitude": "അക്ഷാംശം",
  "New Intake Record": "പുതിയ ഇൻടേക്ക് റെക്കോർഡ്",
  "Get Current Location": "നിലവിലെ സ്ഥാനം നേടുക",
  "Mobile Number": "മൊബൈൽ നമ്പർ",
  "Land Area (Acres)": "ഭൂവിസ്തൃതി (ഏക്കറുകൾ)",
  "New Processing Record": "പുതിയ പ്രോസസ്സിംഗ് റെക്കോർഡ്",
  "Farm Location": "ഫാം സ്ഥാനം",
  "Crop Type": "വിളയുടെ തരം",
  "Register Farmer": "കർഷകരെ രജിസ്റ്റർ ചെയ്യുക",
  "Registering...": "രജിസ്റ്റർ ചെയ്യുന്നു...",
  "Operations Management": "ഓപ്പറേഷൻസ് മാനേജ്മെൻ്റ്",
  "Pending Pickup": "പിക്കപ്പ് ശേഷിക്കുന്നു",
  "Transaction Ledger": "ഇടപാട് ലെഡ്ജർ",
  "Account Settings": "അക്കൗണ്ട് ക്രമീകരണങ്ങൾ",
  "Processed": "പ്രോസസ്സ് ചെയ്തു",
  "All": "എല്ലാം",
  "In Transit": "യാത്രയിൽ",
  "Foundational Doctrine": "അടിസ്ഥാന സിദ്ധാന്തം",
  "Location Confirmation (Google Maps)": "ലൊക്കേഷൻ സ്ഥിരീകരണം (Google Maps)",
  "CCC Value": "കാർബൺ ക്രെഡിറ്റ് മൂല്യം",
  "Verification Image": "സ്ഥിരീകരണ ചിത്രം",
  "Weight (kg)": "ഭാരം (കിലോ)",
  "Base Value (Recycler)": "അടിസ്ഥാന മൂല്യം (റീസൈക്ലർ)",
  "Estimated Value Breakdown": "കണക്കാക്കിയ മൂല്യ ബ്രേക്ക്ഡൗൺ",
  "Processing...": "പ്രോസസ്സ് ചെയ്യുന്നു...",
  "Total Sovereign Value": "മൊത്തം പരമാധികാര മൂല്യം",
  "Confirm Intake & Mint Value": "ഇൻടേക്ക് & മിൻ്റ് മൂല്യം സ്ഥിരീകരിക്കുക",
  "Waste Type": "മാലിന്യ തരം",
  "How it Works": "ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു",
  "Sovereign-Grade Circular Economy Engine": "സോവറിൻ-ഗ്രേഡ് സർക്കുലർ ഇക്കണോമി എഞ്ചിൻ",
  "Access the OS": "OS ആക്സസ് ചെയ്യുക",
  "Global Circular Value": "ആഗോള സർക്കുലർ മൂല്യം",
  "Intake": "കഴിക്കുക",
  "RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.": "മൾട്ടി-റെയിൽ മൂല്യമുള്ള എഞ്ചിനിലൂടെ കാർഷിക, മുനിസിപ്പൽ, വ്യാവസായിക മാലിന്യങ്ങൾ ധനസമ്പാദനം നടത്താൻ കമ്മ്യൂണിറ്റികളെ ശാക്തീകരിക്കുന്ന സർക്കുലർ എക്കണോമി ഓപ്പറേറ്റിംഗ് സിസ്റ്റമാണ് RupayKg.",
  "Convert Every Kilogram of Waste into": "ഓരോ കിലോഗ്രാം മാലിന്യവും മാറ്റുക",
  "Features": "ഫീച്ചറുകൾ",
  "Ecosystem Roles": "ഇക്കോസിസ്റ്റം റോളുകൾ",
  "Launch OS": "OS സമാരംഭിക്കുക",
  "Rural Wealth Creation": "ഗ്രാമീണ സമ്പത്ത് സൃഷ്ടിക്കൽ",
  "Live Network Impact": "ലൈവ് നെറ്റ്‌വർക്ക് ഇംപാക്റ്റ്",
  "Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.": "മാലിന്യ തരം, ഭാരം, ജിയോലൊക്കേഷൻ എന്നിവയുടെ സ്വയമേവയുള്ള പരിശോധന, മാറ്റമില്ലാത്ത, പരമാധികാര-ഗ്രേഡ് ഡാറ്റാ സമഗ്രത ഉറപ്പാക്കുന്നു.",
  "Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.": "പാരിസ്ഥിതിക ബാധ്യതകളെ പ്രാദേശികവൽക്കരിച്ച സാമ്പത്തിക വളർച്ചയിലേക്ക് മാറ്റിക്കൊണ്ട്, പൗരൻമാരുടെ വാലറ്റുകളിലേക്ക് നേരിട്ട് ഫണ്ട് വിതരണം ചെയ്യുക.",
  "Multi-Rail Value Engine": "മൾട്ടി-റെയിൽ മൂല്യമുള്ള എഞ്ചിൻ",
  "AI-Verified Intake": "AI-പരിശോധിച്ച ഉപഭോഗം",
  "Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.": "സംസ്കരിച്ച ഓരോ കിലോഗ്രാം ബയോമാസിനും ഒരേസമയം റീസൈക്ലർ, സിഎസ്ആർ, മുനിസിപ്പൽ, കാർബൺ, ഇപിആർ റെയിലുകളിൽ നിന്ന് മൂല്യം വേർതിരിച്ചെടുക്കുക.",
  "Real-time waste throughput across the RupayKg OS": "RupayKg OS-ൽ ഉടനീളം തത്സമയ മാലിന്യ ത്രൂപുട്ട്",
  "Read Whitepaper": "വൈറ്റ്പേപ്പർ വായിക്കുക",
  "Live Stream": "തത്സമയ സ്ട്രീം",
  "Network Topology": "നെറ്റ്‌വർക്ക് ടോപ്പോളജി",
  "Active Nodes": "സജീവ നോഡുകൾ",
  "nodes": "നോഡുകൾ",
  "Citizens collect agricultural, municipal, or industrial waste.": "പൗരന്മാർ കാർഷിക, മുനിസിപ്പൽ അല്ലെങ്കിൽ വ്യാവസായിക മാലിന്യങ്ങൾ ശേഖരിക്കുന്നു.",
  "Distributed biomass collection nodes": "ബയോമാസ് ശേഖരണ നോഡുകൾ വിതരണം ചെയ്തു",
  "A seamless pipeline from waste generation to value realization.": "മാലിന്യ ഉൽപ്പാദനം മുതൽ മൂല്യ സാക്ഷാത്കാരത്തിലേക്കുള്ള തടസ്സമില്ലാത്ത പൈപ്പ്ലൈൻ.",
  "Aggregators verify, weigh, and transport waste to facilities.": "അഗ്രഗേറ്റർമാർ മാലിന്യം പരിശോധിച്ച്, തൂക്കി, സൗകര്യങ്ങളിലേക്ക് കൊണ്ടുപോകുന്നു.",
  "Aggregate": "സമാഹരിക്കുക",
  "Value Minted": "മൂല്യം രൂപപ്പെടുത്തിയത്",
  "Generate": "സൃഷ്ടിക്കുക",
  "Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.": "കാർഷിക, മുനിസിപ്പൽ അല്ലെങ്കിൽ വ്യാവസായിക മാലിന്യങ്ങൾ ശേഖരിച്ച് നിക്ഷേപിക്കുക. നൽകിയിരിക്കുന്ന മാലിന്യത്തിൻ്റെ ഭാരവും തരവും അടിസ്ഥാനമാക്കി നേരിട്ട് വാലറ്റ് നിക്ഷേപങ്ങൾ നേടുക.",
  "Smart contracts distribute funds across all 5 value rails.": "സ്മാർട്ട് കരാറുകൾ എല്ലാ 5 മൂല്യമുള്ള റെയിലുകളിലും ഫണ്ട് വിതരണം ചെയ്യുന്നു.",
  "Process": "പ്രക്രിയ",
  "Upload waste records": "മാലിന്യ രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക",
  "Waste Generator": "മാലിന്യ ജനറേറ്റർ",
  "Mint Value": "മിൻ്റ് മൂല്യം",
  "Recyclers convert waste into usable materials or energy.": "റീസൈക്ലർമാർ മാലിന്യങ്ങളെ ഉപയോഗയോഗ്യമായ വസ്തുക്കളോ ഊർജമോ ആക്കി മാറ്റുന്നു.",
  "Choose your part in the circular economy.": "വൃത്താകൃതിയിലുള്ള സമ്പദ്‌വ്യവസ്ഥയിൽ നിങ്ങളുടെ ഭാഗം തിരഞ്ഞെടുക്കുക.",
  "Citizen": "പൗരൻ",
  "Instant wallet funding": "തൽക്ഷണ വാലറ്റ് ഫണ്ടിംഗ്",
  "Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.": "സമാഹരിച്ച മാലിന്യങ്ങൾ സ്വീകരിച്ച് അന്തിമ ഉൽപ്പന്നങ്ങളാക്കി മാറ്റുക. എല്ലാ റെയിലുകളിലും അന്തിമ മൂല്യം തിരിച്ചറിയൽ പ്രവർത്തനക്ഷമമാക്കുക.",
  "Aggregator": "അഗ്രഗേറ്റർ",
  "Log collection batches": "ലോഗ് ശേഖരണ ബാച്ചുകൾ",
  "Recycler": "റീസൈക്ലർ",
  "Route optimization data": "റൂട്ട് ഒപ്റ്റിമൈസേഷൻ ഡാറ്റ",
  "Earn logistics margins": "ലോജിസ്റ്റിക്സ് മാർജിനുകൾ നേടുക",
  "Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.": "പൗരന്മാരുടെ നിക്ഷേപം പരിശോധിക്കുക, മാലിന്യങ്ങൾ ഏകീകരിക്കുക, സംസ്‌കരണ സൗകര്യങ്ങളിലേക്ക് സാമഗ്രികൾ എത്തിക്കുന്നതിന് ലോജിസ്റ്റിക്‌സ് കൈകാര്യം ചെയ്യുക.",
  "Track environmental impact": "പരിസ്ഥിതി ആഘാതം ട്രാക്ക് ചെയ്യുക",
  "Processor": "പ്രോസസ്സർ",
  "Collection & Transport": "ശേഖരണവും ഗതാഗതവും",
  "Organization Name": "സംഘടനയുടെ പേര്",
  "Generate CCCs": "കാർബൺ ക്രെഡിറ്റുകൾ സൃഷ്ടിക്കുക",
  "Register": "രജിസ്റ്റർ ചെയ്യുക",
  "Log processing yields": "ലോഗ് പ്രോസസ്സിംഗ് ആദായം",
  "District": "ജില്ല",
  "Access CSR/EPR funds": "CSR/EPR ഫണ്ടുകൾ ആക്സസ് ചെയ്യുക",
  "Circular Economy Operating System": "സർക്കുലർ ഇക്കണോമി ഓപ്പറേറ്റിംഗ് സിസ്റ്റം",
  "Login": "ലോഗിൻ",
  "Account Type": "അക്കൗണ്ട് തരം",
  "Context:": "സന്ദർഭം:",
  "Access OS": "OS ആക്സസ് ചെയ്യുക",
  "Submission Heatmap": "സമർപ്പിക്കൽ ഹീറ്റ്‌മാപ്പ്",
  "Create Account": "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
  "State": "സംസ്ഥാനം",
  "Back to Home": "വീട്ടിലേക്ക് മടങ്ങുക",
  "Phone Number": "ഫോൺ നമ്പർ",
  "Global Impact Map": "ഗ്ലോബൽ ഇംപാക്ട് മാപ്പ്",
  "Password": "രഹസ്യവാക്ക്",
  "System Audit Logs": "സിസ്റ്റം ഓഡിറ്റ് ലോഗുകൾ",
  "Quick Demo Access": "ദ്രുത ഡെമോ ആക്സസ്",
  "Impact Distribution": "ഇംപാക്ട് ഡിസ്ട്രിബ്യൂഷൻ",
  "Portfolio Composition": "പോർട്ട്ഫോളിയോ കോമ്പോസിഷൻ",
  "MRV Verification Dashboard": "MRV പരിശോധന ഡാഷ്‌ബോർഡ്",
  "Farmers Supported": "കർഷകർ പിന്തുണച്ചു",
  "Waste Diverted": "മാലിന്യം വഴിതിരിച്ചുവിട്ടു",
  "Pending": "തീർപ്പാക്കാത്തത്",
  "All processed waste has been verified.": "സംസ്കരിച്ച എല്ലാ മാലിന്യങ്ങളും പരിശോധിച്ചു.",
  "Verify processed waste records to issue CCCs.": "കാർബൺ ക്രെഡിറ്റുകൾ നൽകുന്നതിന് സംസ്കരിച്ച മാലിന്യ രേഖകൾ പരിശോധിക്കുക.",
  "Total Offset": "ആകെ ഓഫ്സെറ്റ്",
  "No pending MRV records": "തീർപ്പാക്കാത്ത MRV റെക്കോർഡുകളൊന്നുമില്ല",
  "Reject": "നിരസിക്കുക",
  "AI Risk Score": "AI റിസ്ക് സ്കോർ",
  "Location Verification": "ലൊക്കേഷൻ സ്ഥിരീകരണം",
  "Acreage": "ഏക്കർ",
  "CCC Reduction": "CCC കുറയ്ക്കൽ",
  "Credit Value": "ക്രെഡിറ്റ് മൂല്യം",
  "Verify & Issue Credits": "ക്രെഡിറ്റുകൾ പരിശോധിച്ച് ഇഷ്യൂ ചെയ്യുക",
  "Available Credits": "ലഭ്യമായ ക്രെഡിറ്റുകൾ",
  "Purchase verified CCCs to offset your footprint.": "നിങ്ങളുടെ കാൽപ്പാടുകൾ ഓഫ്‌സെറ്റ് ചെയ്യുന്നതിന് പരിശോധിച്ചുറപ്പിച്ച കാർബൺ ക്രെഡിറ്റുകൾ വാങ്ങുക.",
  "Price per Tonne": "ഒരു ടണ്ണിന് വില",
  "Confirm Purchase": "വാങ്ങൽ സ്ഥിരീകരിക്കുക",
  "Total Cost": "ആകെ ചെലവ്",
  "Cancel": "റദ്ദാക്കുക",
  "Purchase Credits": "പർച്ചേസ് ക്രെഡിറ്റുകൾ",
  "Amount to Purchase (Tonnes)": "വാങ്ങാനുള്ള തുക (ടൺ)",
  "Your Offset Balance": "നിങ്ങളുടെ ഓഫ്‌സെറ്റ് ബാലൻസ്",
  "Amount": "തുക",
  "Recent Transactions": "സമീപകാല ഇടപാടുകൾ",
  "Project": "പദ്ധതി",
  "Date": "തീയതി",
  "MSW": "എം.എസ്.ഡബ്ല്യു",
  "National Dashboard": "ദേശീയ ഡാഷ്ബോർഡ്",
  "Price": "വില",
  "Network Active": "നെറ്റ്‌വർക്ക് സജീവമാണ്",
  "Ward Analytics": "വാർഡ് അനലിറ്റിക്സ്",
  "Status": "നില",
  "Ward": "വാർഡ്",
  "Ward-Level Analytics": "വാർഡ്-ലെവൽ അനലിറ്റിക്സ്",
  "Municipal Corporation": "മുനിസിപ്പൽ കോർപ്പറേഷൻ",
  "Village": "ഗ്രാമം",
  "Farmer / FPO (Biomass Generator)": "കർഷകൻ / FPO (ബയോമാസ് ജനറേറ്റർ)",
  "Citizen (MSW Generator)": "പൗരൻ (MSW ജനറേറ്റർ)",
  "Farmers / FPOs": "കർഷകർ / എഫ്പിഒകൾ",
  "Citizens": "പൗരന്മാർ",
  "Biomass": "ബയോമാസ്",
  "Gram Panchayat": "ഗ്രാമപഞ്ചായത്ത്",
  "Village Analytics": "വില്ലേജ് അനലിറ്റിക്സ്",
  "Village-Level Analytics": "വില്ലേജ്-ലെവൽ അനലിറ്റിക്സ്",
  "All Roles": "എല്ലാ വേഷങ്ങളും",
  "CCC Pool Status": "കാർബൺ പൂൾ നില",
  "CSR Partners": "CSR പങ്കാളികൾ",
  "Processors": "പ്രോസസ്സറുകൾ",
  "Aggregators": "അഗ്രഗേറ്ററുകൾ",
  "Diverted": "വഴിതിരിച്ചുവിട്ടു",
  "Audit Logs": "ഓഡിറ്റ് ലോഗുകൾ",
  "EPR Partners": "ഇപിആർ പങ്കാളികൾ",
  "Fraud Alerts & Flagged Events": "വഞ്ചന അലേർട്ടുകളും ഫ്ലാഗുചെയ്‌ത ഇവൻ്റുകളും",
  "User Management": "ഉപയോക്തൃ മാനേജ്മെൻ്റ്",
  "CCC Buyers": "കാർബൺ വാങ്ങുന്നവർ",
  "Methane Avoided": "മീഥേൻ ഒഴിവാക്കി",
  "Trees Equivalent": "മരങ്ങൾ തുല്യമാണ്",
  "Total Waste Events": "മൊത്തം മാലിന്യ പരിപാടികൾ",
  "Economic Efficiency": "സാമ്പത്തിക കാര്യക്ഷമത",
  "Trees": "മരങ്ങൾ",
  "Environmental Impact": "പാരിസ്ഥിതിക ആഘാതം",
  "Growth & Impact Trends": "വളർച്ചയും ഇംപാക്ട് ട്രെൻഡുകളും",
  "Processed Events": "പ്രോസസ്സ് ചെയ്ത ഇവൻ്റുകൾ",
  "Water Saved": "വെള്ളം സംരക്ഷിച്ചു",
  "Wallet Disbursed": "വാലറ്റ് വിതരണം ചെയ്തു",
  "* Government savings calculated based on avoided landfill management and environmental remediation costs.": "* സർക്കാർ സമ്പാദ്യം കണക്കാക്കുന്നത് ഒഴിവാക്കിയ ലാൻഡ്ഫിൽ മാനേജ്മെൻ്റും പാരിസ്ഥിതിക പരിഹാര ചെലവുകളും അടിസ്ഥാനമാക്കിയാണ്.",
  "Total Minted CCC Units": "മൊത്തം മിൻ്റഡ് കാർബൺ യൂണിറ്റുകൾ",
  "Avg Price / kg": "ശരാശരി വില / കിലോ",
  "Operational Health": "പ്രവർത്തന ആരോഗ്യം",
  "Waste Composition": "മാലിന്യ രചന",
  "MRV Rejection Rate": "എംആർവി നിരസിക്കൽ നിരക്ക്",
  "No flagged events detected.": "ഫ്ലാഗുചെയ്‌ത ഇവൻ്റുകളൊന്നും കണ്ടെത്തിയില്ല.",
  "Govt Cost Savings": "സർക്കാർ ചെലവ് ലാഭിക്കൽ",
  "Processing Efficiency": "പ്രോസസ്സിംഗ് കാര്യക്ഷമത",
  "Geospatial Fraud Distribution": "ജിയോസ്പേഷ്യൽ ഫ്രോഡ് വിതരണം",
  "Regulator": "റെഗുലേറ്റർ",
  "Location": "സ്ഥാനം",
  "User": "ഉപയോക്താവ്",
  "CSR Partner": "CSR പങ്കാളി",
  "Role": "പങ്ക്",
  "Municipal Admin": "മുനിസിപ്പൽ അഡ്മിൻ",
  "Wallet": "വാലറ്റ്",
  "Actions": "പ്രവർത്തനങ്ങൾ",
  "Super Admin": "സൂപ്പർ അഡ്മിൻ",
  "State Admin": "സംസ്ഥാന അഡ്മിൻ",
  "User ID": "ഉപയോക്തൃ ഐഡി",
  "Delete User": "ഉപയോക്താവിനെ ഇല്ലാതാക്കുക",
  "Total Waste": "മൊത്തം മാലിന്യം",
  "Action": "ആക്ഷൻ",
  "EPR Partner": "ഇപിആർ പങ്കാളി",
  "Total Events": "മൊത്തം ഇവൻ്റുകൾ",
  "No audit logs available.": "ഓഡിറ്റ് ലോഗുകളൊന്നും ലഭ്യമല്ല.",
  "No users found.": "ഉപയോക്താക്കളെ കണ്ടെത്തിയില്ല.",
  "No ward data available.": "വാർഡ് വിവരങ്ങളൊന്നും ലഭ്യമല്ല.",
  "CCC Buyer": "കാർബൺ വാങ്ങുന്നയാൾ",
  "Receive updates about your transactions via email.": "ഇമെയിൽ വഴി നിങ്ങളുടെ ഇടപാടുകളെക്കുറിച്ചുള്ള അപ്‌ഡേറ്റുകൾ സ്വീകരിക്കുക.",
  "Saving...": "സംരക്ഷിക്കുന്നു...",
  "Add ₹10,000": "₹10,000 ചേർക്കുക",
  "Email Notifications": "ഇമെയിൽ അറിയിപ്പുകൾ",
  "Get instant SMS alerts for critical updates.": "നിർണായക അപ്‌ഡേറ്റുകൾക്കായി തൽക്ഷണ SMS അലേർട്ടുകൾ നേടുക.",
  "SMS Alerts": "SMS അലേർട്ടുകൾ",
  "Enable browser push notifications.": "ബ്രൗസർ പുഷ് അറിയിപ്പുകൾ പ്രവർത്തനക്ഷമമാക്കുക.",
  "Save Changes": "മാറ്റങ്ങൾ സംരക്ഷിക്കുക",
  "Push Notifications": "പുഷ് അറിയിപ്പുകൾ",
  "Notification Preferences": "അറിയിപ്പ് മുൻഗണനകൾ",
  "Value: ": "മൂല്യം:",
  "FRAUD ALERT": "തട്ടിപ്പ് മുന്നറിയിപ്പ്",
  "Currently Active: ": "നിലവിൽ സജീവം:",
  "How the Engine Works": "എഞ്ചിൻ എങ്ങനെ പ്രവർത്തിക്കുന്നു",
  "Type: ": "തരം:",
  "Weight: ": "ഭാരം:",
  "Village: ": "ഗ്രാമം:",
  "© 2026 RupayKg Circular Economy OS. All rights reserved.": "© 2026 RupayKg സർക്കുലർ ഇക്കണോമി ഒഎസ്. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
  " Context (": "സന്ദർഭം (",
  "GENESIS": "ഉല്പത്തി",
  "Privacy": "സ്വകാര്യത",
  "rural": "ഗ്രാമീണ",
  "Terms": "നിബന്ധനകൾ",
  "Farmer": "കർഷകൻ",
  "Aggregator (Collection & Transport)": "അഗ്രഗേറ്റർ (ശേഖരണവും ഗതാഗതവും)",
  "National Regulator": "ദേശീയ റെഗുലേറ്റർ",
  "urban": "നഗര",
  "Processor (Recycler)": "പ്രോസസ്സർ (റീസൈക്ലർ)",
  "Admin": "അഡ്മിൻ",
  "RUPAYKG": "രൂപയ്ക്ക്",
  "Wallet Balance": "വാലറ്റ് ബാലൻസ്",
  "No records found": "രേഖകളൊന്നും കണ്ടെത്തിയില്ല",
  "Name": "പേര്",
  "GPS Capture Failed": "GPS ക്യാപ്‌ചർ പരാജയപ്പെട്ടു",
  "GPS Captured: ": "GPS പിടിച്ചെടുത്തു:",
  "Acreage (acres)": "ഏക്കർ (ഏക്കറുകൾ)",
  "Database Connection Failed": "ഡാറ്റാബേസ് കണക്ഷൻ പരാജയപ്പെട്ടു",
  "Capturing GPS Coordinates...": "GPS കോർഡിനേറ്റുകൾ ക്യാപ്ചർ ചെയ്യുന്നു...",
  "Circular Economy Intake Form": "സർക്കുലർ ഇക്കണോമി ഇൻടേക്ക് ഫോം",
  "No audit logs found": "ഓഡിറ്റ് ലോഗുകളൊന്നും കണ്ടെത്തിയില്ല",
  "Active Queue": "സജീവമായ ക്യൂ",
  "GPS Required": "GPS ആവശ്യമാണ്",
  "e.g., Paddy, Wheat": "ഉദാ: നെല്ല്, ഗോതമ്പ്",
  "Retry GPS": "GPS വീണ്ടും ശ്രമിക്കുക",
  "Active Fleet": "സജീവ ഫ്ലീറ്റ്",
  "Farmer registered successfully! ID: ": "കർഷകൻ രജിസ്റ്റർ ചെയ്തു! ഐഡി:",
  "Failed to register farmer": "കർഷകരെ രജിസ്റ്റർ ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു",
  "Drivers Online": "ഡ്രൈവർമാർ ഓൺലൈൻ",
  "Failed to get location. Please enter manually.": "ലൊക്കേഷൻ ലഭിക്കുന്നതിൽ പരാജയപ്പെട്ടു. ദയവായി നേരിട്ട് നൽകുക.",
  "Geolocation is not supported by this browser.": "ജിയോലൊക്കേഷനെ ഈ ബ്രൗസർ പിന്തുണയ്ക്കുന്നില്ല.",
  "Utilization": "വിനിയോഗം",
  "Available for Pickup": "പിക്കപ്പിന് ലഭ്യമാണ്",
  "Current Load": "നിലവിലെ ലോഡ്",
  "Storage Utilization": "സംഭരണ ​​വിനിയോഗം",
  "Total Capacity": "മൊത്തം ശേഷി",
  "No new tasks available.": "പുതിയ ടാസ്‌ക്കുകളൊന്നും ലഭ്യമല്ല.",
  "Incoming for Processing": "പ്രോസസ്സിംഗിനായി ഇൻകമിംഗ്",
  "Accept Pickup": "പിക്കപ്പ് സ്വീകരിക്കുക",
  "Biomass in Stock": "ബയോമാസ് ഇൻ സ്റ്റോക്ക്",
  "Output Material": "ഔട്ട്പുട്ട് മെറ്റീരിയൽ",
  "No active tasks in your possession.": "നിങ്ങളുടെ കൈവശം സജീവമായ ജോലികളൊന്നുമില്ല.",
  "Pending MRV": "തീർപ്പാക്കാത്ത എം.ആർ.വി",
  "Value": "മൂല്യം",
  "Recently Processed": "അടുത്തിടെ പ്രോസസ്സ് ചെയ്തത്",
  "No records found for the selected filter.": "തിരഞ്ഞെടുത്ത ഫിൽട്ടറിനായി രേഖകളൊന്നും കണ്ടെത്തിയില്ല.",
  "Weight": "ഭാരം",
  "Accept Receipt": "രസീത് സ്വീകരിക്കുക",
  "Timestamp": "ടൈംസ്റ്റാമ്പ്",
  "MRV Status": "MRV നില",
  "Type": "ടൈപ്പ് ചെയ്യുക",
  "Details": "വിശദാംശങ്ങൾ",
  "AI Risk": "AI റിസ്ക്",
  "No credits available": "ക്രെഡിറ്റുകളൊന്നും ലഭ്യമല്ല",
  "Med": "മെഡി",
  "No MRV history found": "MRV ചരിത്രമൊന്നും കണ്ടെത്തിയില്ല",
  "Low": "താഴ്ന്നത്",
  "High": "ഉയർന്നത്",
  "Verified By": "പരിശോധിച്ചുറപ്പിച്ചത്",
  "Check back later for newly verified CCCs.": "പുതുതായി പരിശോധിച്ച കാർബൺ ക്രെഡിറ്റുകൾക്കായി പിന്നീട് വീണ്ടും പരിശോധിക്കുക.",
  "Record ID": "റെക്കോർഡ് ഐഡി",
  "Profile Settings": "പ്രൊഫൈൽ ക്രമീകരണങ്ങൾ",
  "Insufficient Funds": "അപര്യാപ്തമായ ഫണ്ടുകൾ",
  "Profile updated successfully": "പ്രൊഫൈൽ വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു",
  "The Foundational Structure and Operating Doctrine of RupayKg": "റുപേകെജിയുടെ അടിസ്ഥാന ഘടനയും പ്രവർത്തന സിദ്ധാന്തവും",
  "Verified": "പരിശോധിച്ചുറപ്പിച്ചു",
  "Offset": "ഓഫ്സെറ്റ്",
  "Failed to update profile": "പ്രൊഫൈൽ അപ്ഡേറ്റ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു",
  "I. Introduction": "I. ആമുഖം",
  "An error occurred": "ഒരു പിശക് സംഭവിച്ചു",
  "Purchase Credit": "പർച്ചേസ് ക്രെഡിറ്റ്",
  "The platform addresses a structural gap in India’s CCC ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade CCC supply.": "ഇന്ത്യയുടെ കാർബൺ ആവാസവ്യവസ്ഥയിലെ ഘടനാപരമായ വിടവ് ഈ പ്ലാറ്റ്‌ഫോം പരിഹരിക്കുന്നു: പരിശോധിച്ചുറപ്പിച്ച മാലിന്യ വ്യതിചലനത്തെ കംപ്ലയൻസ്-ഗ്രേഡ് കാർബൺ വിതരണത്തിലേക്ക് പരിവർത്തനം ചെയ്യാൻ കഴിവുള്ള ഏകീകൃത, റെഗുലേറ്റർ-അലൈൻ ചെയ്ത ഡിജിറ്റൽ ഇൻഫ്രാസ്ട്രക്ചറിൻ്റെ അഭാവം.",
  "RupayKg has been established as a Unified Waste-to-CCC Digital Operating System designed to support India’s transition toward a compliance-based CCC market.": "കംപ്ലയൻസ് അധിഷ്ഠിത കാർബൺ വിപണിയിലേക്കുള്ള ഇന്ത്യയുടെ പരിവർത്തനത്തെ പിന്തുണയ്ക്കുന്നതിനായി രൂപകൽപ്പന ചെയ്‌തിരിക്കുന്ന ഏകീകൃത മാലിന്യ-കാർബൺ ഡിജിറ്റൽ ഓപ്പറേറ്റിംഗ് സിസ്റ്റമായാണ് RupayKg സ്ഥാപിച്ചിരിക്കുന്നത്.",
  "RupayKg is not structured as a project developer, CCC trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.": "RupayKg ഒരു പ്രോജക്റ്റ് ഡെവലപ്പർ, കാർബൺ ട്രേഡർ അല്ലെങ്കിൽ റീസൈക്ലിംഗ് എൻ്റിറ്റി എന്ന നിലയിൽ രൂപപ്പെടുത്തിയിട്ടില്ല. വാസ്തുവിദ്യാ ഡ്യൂപ്ലിക്കേഷൻ ഇല്ലാതെ നഗര-ഗ്രാമ ഭരണ ചട്ടക്കൂടുകളിലുടനീളം പ്രവർത്തിക്കാൻ രൂപകൽപ്പന ചെയ്‌തിരിക്കുന്ന ഒരു ഇൻഫ്രാസ്ട്രക്ചർ പാളിയാണിത്.",
  "Urban": "അർബൻ",
  "II. Unified Operating System Model": "II. ഏകീകൃത ഓപ്പറേറ്റിംഗ് സിസ്റ്റം മോഡൽ",
  "Anchor": "ആങ്കർ",
  "Rural": "ഗ്രാമീണ",
  "Context": "സന്ദർഭം",
  "Category": "വിഭാഗം",
  "Municipal Corp + Ward": "മുനിസിപ്പൽ കോർപ്പറേഷൻ + വാർഡ്",
  "Gram Panchayat + Village": "ഗ്രാമപഞ്ചായത്ത് + ഗ്രാമം",
  "* All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.": "* എല്ലാ ഗ്രാമീണ കാർഷിക അവശിഷ്ടങ്ങളും ബയോമാസ് പ്രവർത്തനങ്ങളും ബയോമാസിന് കീഴിൽ തരംതിരിച്ചിരിക്കുന്നു. പ്രത്യേക കാർഷിക ലംബങ്ങളൊന്നും നിലവിലില്ല.",
  "Methane avoidance through diversion": "വഴിതിരിച്ചുവിടലിലൂടെ മീഥേൻ ഒഴിവാക്കൽ",
  "IV. CCC Origination": "IV. കാർബൺ ഉത്ഭവം",
  "III. Unified Stakeholder Architecture": "III. ഏകീകൃത ഓഹരി ഉടമ വാസ്തുവിദ്യ",
  "Administrative Authority": "അഡ്മിനിസ്ട്രേറ്റീവ് അതോറിറ്റി",
  "Producers (EPR)": "നിർമ്മാതാക്കൾ (ഇപിആർ)",
  "CSR Contributors": "CSR സംഭാവന ചെയ്യുന്നവർ",
  "The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.": "അഗ്രഗേറ്ററിനെ ഘടനാപരമായി നിർവചിച്ചിരിക്കുന്നത് ശേഖരണത്തിനും സാധൂകരണത്തിനും ഉത്തരവാദിയായ ലയിപ്പിച്ച എൻ്റിറ്റിയാണ്, കസ്റ്റഡി സ്ഥിരീകരണം ലളിതമാക്കുന്നു.",
  "Biomass-based fossil substitution": "ബയോമാസ് അടിസ്ഥാനമാക്കിയുള്ള ഫോസിൽ പകരം വയ്ക്കൽ",
  "Recycler Rail": "റീസൈക്ലർ റെയിൽ",
  "Governance Layer": "ഭരണ പാളി",
  "V. Multi-Rail Architecture": "വി. മൾട്ടി-റെയിൽ ആർക്കിടെക്ചർ",
  "CCC Rail": "കാർബൺ റെയിൽ",
  "CCC issuance authority remains regulator-controlled. RupayKg does not independently mint credits. All credits must be event-traceable, registry-compatible, and align with national CCC governance frameworks.": "കാർബൺ ഇഷ്യൂസ് അതോറിറ്റി റെഗുലേറ്റർ നിയന്ത്രണത്തിലാണ്. RupayKg സ്വതന്ത്രമായി ക്രെഡിറ്റുകൾ നൽകുന്നില്ല. എല്ലാ ക്രെഡിറ്റുകളും ഇവൻ്റ്-ട്രേസ് ചെയ്യാവുന്നതും രജിസ്ട്രി-അനുയോജ്യവും ദേശീയ കാർബൺ ഗവേണൻസ് ചട്ടക്കൂടുകളുമായി യോജിപ്പിക്കുന്നതുമായിരിക്കണം.",
  "VI. Regulator Sovereignty": "VI. റെഗുലേറ്റർ പരമാധികാരം",
  "CSR Rail": "സിഎസ്ആർ റെയിൽ",
  "VII. Strategic Position": "VII. തന്ത്രപരമായ സ്ഥാനം",
  "EPR Rail": "ഇപിആർ റെയിൽ",
  "Recycling substitution": "റീസൈക്ലിംഗ് സബ്സ്റ്റിറ്റ്യൂഷൻ",
  "India is entering a compliance CCC era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.": "ഇന്ത്യ ഒരു കാർബൺ യുഗത്തിലേക്ക് കടക്കുകയാണ്. മുനിസിപ്പൽ സംവിധാനങ്ങൾ അളക്കാവുന്ന മീഥേൻ ഉത്പാദിപ്പിക്കുന്നു. ഗ്രാമീണ ജൈവവസ്തുക്കൾ കത്തിക്കുകയോ ഉപയോഗശൂന്യമാവുകയോ ചെയ്യുന്നു. എന്നിട്ടും സംവിധാനങ്ങൾ ശിഥിലമായി തുടരുന്നു.",
  "When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated CCC value?": "RupayKg നിർമ്മിക്കാൻ തുടങ്ങിയപ്പോൾ, ഞങ്ങൾ പുനരുപയോഗം ആരംഭിച്ചില്ല. ഞങ്ങൾ ഒരു ഘടനാപരമായ ചോദ്യത്തോടെയാണ് ആരംഭിച്ചത്: മാലിന്യങ്ങളെ നിയന്ത്രിത കാർബൺ മൂല്യമാക്കി മാറ്റുന്ന ഏകീകൃത അടിസ്ഥാന സൗകര്യങ്ങൾ ഇല്ലാത്തത് എന്തുകൊണ്ട്?",
  "RupayKg was built to unify them. Not as a CCC trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.": "അവരെ ഏകീകരിക്കുന്നതിനാണ് റുപേകെജി നിർമ്മിച്ചത്. ഒരു കാർബൺ വ്യാപാരി എന്ന നിലയിലല്ല. ഒരു റീസൈക്ലിംഗ് സ്റ്റാർട്ടപ്പ് ആയിട്ടല്ല. എന്നാൽ മുനിസിപ്പൽ വാർഡ് തലത്തിലും ഗ്രാമപഞ്ചായത്ത് വില്ലേജ് തലത്തിലും ഘടനാപരമായ ഡ്യൂപ്ലിക്കേഷൻ ഇല്ലാതെ പ്രവർത്തിക്കാൻ കഴിവുള്ള ഒരു ഓപ്പറേറ്റിംഗ് സിസ്റ്റം എന്ന നിലയിൽ.",
  "Waste is no longer disposal. It is governance-linked climate infrastructure.": "മാലിന്യം ഇനി സംസ്കരിക്കില്ല. ഇത് ഭരണവുമായി ബന്ധപ്പെട്ട കാലാവസ്ഥാ ഇൻഫ്രാസ്ട്രക്ചറാണ്.",
  "Legally Styled": "നിയമപരമായി ശൈലിയിലുള്ളത്",
  "Article I — Unified Operating System": "ആർട്ടിക്കിൾ I - ഏകീകൃത ഓപ്പറേറ്റിംഗ് സിസ്റ്റം",
  "RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.": "RupayKg ഇനിപ്പറയുന്ന പ്രകാരം വിന്യസിക്കാവുന്ന ഒരൊറ്റ ഡിജിറ്റൽ സംവിധാനം പ്രവർത്തിപ്പിക്കും: (എ) മുനിസിപ്പൽ കോർപ്പറേഷൻ + വാർഡ് (നഗര സന്ദർഭം) (ബി) ഗ്രാമപഞ്ചായത്ത് + ഗ്രാമം (ഗ്രാമീണ സന്ദർഭം). സന്ദർഭങ്ങൾക്കിടയിൽ ഘടനാപരമായ ഡ്യൂപ്ലിക്കേഷൻ ഉണ്ടാകരുത്.",
  "— Founder, RupayKg": "- സ്ഥാപകൻ, RupayKg",
  "DECLARATION OF FOUNDATIONAL STRUCTURE": "അടിസ്ഥാന ഘടനയുടെ പ്രഖ്യാപനം",
  "Article II — Unified Stakeholder Doctrine": "ആർട്ടിക്കിൾ II - ഏകീകൃത ഓഹരി ഉടമകളുടെ സിദ്ധാന്തം",
  "Article IV — CCC Engine": "ആർട്ടിക്കിൾ IV - കാർബൺ എഞ്ചിൻ",
  "Article VI — Regulator Sovereignty": "ആർട്ടിക്കിൾ VI - റെഗുലേറ്റർ പരമാധികാരം",
  "The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, CCC Buyers, Regulator.": "സ്റ്റേക്ക്‌ഹോൾഡർ ഘടന രാജ്യത്തുടനീളം ഏകീകൃതമായി തുടരും, അതിൽ ഇവ ഉൾപ്പെടുന്നു: വേസ്റ്റ് ജനറേറ്റർ, അഗ്രഗേറ്റർ, പ്രോസസർ, അഡ്മിനിസ്ട്രേറ്റീവ് അതോറിറ്റി, പ്രൊഡ്യൂസർമാർ (ഇപിആർ), സിഎസ്ആർ സംഭാവന ചെയ്യുന്നവർ, കാർബൺ വാങ്ങുന്നവർ, റെഗുലേറ്റർ.",
  "CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs.": "കാർബൺ മിൻ്റ് അതോറിറ്റി റെഗുലേറ്റർ നിയന്ത്രണത്തിൽ തുടരും. RupayKg സ്വതന്ത്രമായി കാർബൺ ക്രെഡിറ്റുകൾ നൽകില്ല.",
  "Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.": "മാലിന്യങ്ങളെ പ്രത്യേകമായി തരംതിരിച്ചിരിക്കുന്നു: (എ) നഗര പശ്ചാത്തലത്തിൽ എംഎസ്ഡബ്ല്യു (ബി) ഗ്രാമീണ സാഹചര്യത്തിൽ ജൈവവസ്തു. എല്ലാ കാർഷിക അവശിഷ്ടങ്ങളും ബയോമാസ് പ്രകാരം തരംതിരിക്കണം.",
  "Institutional Identity": "സ്ഥാപനപരമായ ഐഡൻ്റിറ്റി",
  "All emission reductions shall be processed through a single CCC calculation engine with event-level MRV validation.": "ഇവൻ്റ്-ലെവൽ എംആർവി മൂല്യനിർണ്ണയത്തോടെയുള്ള ഒരൊറ്റ കാർബൺ കണക്കുകൂട്ടൽ എഞ്ചിൻ വഴി എല്ലാ എമിഷൻ കുറയ്ക്കലുകളും പ്രോസസ്സ് ചെയ്യും.",
  "Article V — Rail Separation": "ആർട്ടിക്കിൾ V - റെയിൽ വേർതിരിവ്",
  "Article III — Waste Classification": "ആർട്ടിക്കിൾ III - മാലിന്യ വർഗ്ഗീകരണം",
  "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, CCC issuance. Double counting is prohibited.": "RupayKg ഇവയ്ക്കിടയിൽ കർശനമായ വേർതിരിവ് നിലനിർത്തണം: റീസൈക്ലർ അക്കൗണ്ടിംഗ്, CSR അക്കൗണ്ടിംഗ്, EPR പാലിക്കൽ, ഭരണ മൂല്യം, കാർബൺ വിതരണം. ഇരട്ട എണ്ണുന്നത് നിരോധിച്ചിരിക്കുന്നു.",
  "RupayKg is hereby defined as: A Unified Waste-to-CCC Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability.": "RupayKg ഇതിനാൽ നിർവചിച്ചിരിക്കുന്നത്: ഒരു ഏകീകൃത മാലിന്യ-കാർബൺ ഇൻഫ്രാസ്ട്രക്ചർ പ്ലാറ്റ്ഫോം, റെഗുലേറ്റർ-അലൈൻഡ് കാർബൺ ഉത്ഭവ ശേഷിയുള്ള ഒരൊറ്റ ദേശീയ ഓഹരി ഉടമയുടെ ആർക്കിടെക്ചറിന് കീഴിൽ പ്രവർത്തിക്കുന്നു."
  } },
  or: { translation: {
  "Settings": "ସେଟିଂସମୂହ",
  "History": "ଇତିହାସ",
  "Logout": "ଲଗଆଉଟ୍ |",
  "Upload Waste": "ଆବର୍ଜନା ଅପଲୋଡ୍ କରନ୍ତୁ |",
  "Task Board": "ଟାସ୍କ ବୋର୍ଡ |",
  "National KPI": "ଜାତୀୟ KPI",
  "CCC Market": "କାର୍ବନ ବଜାର |",
  "MRV Dashboard": "MRV ଡ୍ୟାସବୋର୍ଡ |",
  "Genesis": "ଆଦି",
  "Dashboard": "ଡ୍ୟାସବୋର୍ଡ |",
  "Language": "ଭାଷା",
  "Total Collected": "ସମୁଦାୟ ସଂଗୃହିତ |",
  "System Overview": "ସିଷ୍ଟମ୍ ସମୀକ୍ଷା",
  "English": "ଇଂରାଜୀ |",
  "Welcome back": "ସ୍ Welcome ାଗତ",
  "CCC Offset": "କାର୍ବନ ଅଫସେଟ |",
  "Hindi": "ହିନ୍ଦୀ",
  "Community Rank": "ସମ୍ପ୍ରଦାୟ ମାନ୍ୟତା",
  "Farmers Registered": "କୃଷକମାନେ ପଞ୍ଜିକୃତ ହୋଇଥିଲେ |",
  "Total Earnings": "ମୋଟ ରୋଜଗାର |",
  "CCCs": "କାର୍ବନ କ୍ରେଡିଟ୍ |",
  "Logistics Margin": "ଲଜିଷ୍ଟିକ୍ ମାର୍ଜିନ୍ |",
  "Total Processed": "ସମୁଦାୟ ପ୍ରକ୍ରିୟାକରଣ |",
  "ESG Score": "ESG ସ୍କୋର |",
  "Processing Yield": "ଅମଳ ପ୍ରକ୍ରିୟାକରଣ |",
  "Value Generated": "ମୂଲ୍ୟ ଉତ୍ପନ୍ନ",
  "Platform Statistics": "ପ୍ଲାଟଫର୍ମ ପରିସଂଖ୍ୟାନ |",
  "Seed Demo Data": "ବିହନ ଡେମୋ ଡାଟା |",
  "Fleet Efficiency": "ଫ୍ଲାଇଟ୍ ଦକ୍ଷତା |",
  "Total Investment": "ମୋଟ ବିନିଯୋଗ |",
  "Waste Distribution": "ଆବର୍ଜନା ବଣ୍ଟନ |",
  "CCCs Generated": "କାର୍ବନ ହ୍ରାସ |",
  "Total Users": "ମୋଟ ବ୍ୟବହାରକାରୀ |",
  "Register New Farmer": "ନୂତନ କୃଷକ ପଞ୍ଜିକରଣ କରନ୍ତୁ |",
  "Reset Demo Data": "ଡେମୋ ଡାଟା ପୁନ Res ସେଟ୍ କରନ୍ତୁ |",
  "Recent Activity": "ସାମ୍ପ୍ରତିକ କାର୍ଯ୍ୟକଳାପ",
  "Total Value": "ମୋଟ ମୂଲ୍ୟ",
  "Performance Analytics": "କାର୍ଯ୍ୟଦକ୍ଷତା ଆନାଲିଟିକ୍ସ |",
  "New Collection Record": "ନୂତନ ସଂଗ୍ରହ ରେକର୍ଡ |",
  "Total Weight": "ମୋଟ ଓଜନ |",
  "New Processing Record": "ନୂତନ ପ୍ରକ୍ରିୟାକରଣ ରେକର୍ଡ |",
  "Land Area (Acres)": "ଜମି କ୍ଷେତ୍ର (ଏକର)",
  "Longitude": "ଦ୍ରାଘିମା",
  "Full Name": "ପୂର୍ଣ୍ଣ ନାମ",
  "Mobile Number": "ମୋବାଇଲ୍ ନମ୍ବର |",
  "New Intake Record": "ନୂତନ ଭୋଜନ ରେକର୍ଡ |",
  "Latitude": "ଅକ୍ଷାଂଶ",
  "Get Current Location": "ସାମ୍ପ୍ରତିକ ଅବସ୍ଥାନ ପ୍ରାପ୍ତ କରନ୍ତୁ |",
  "Crop Type": "ଫସଲ ପ୍ରକାର |",
  "Farm Location": "ଫାର୍ମ ଅବସ୍ଥାନ",
  "Transaction Ledger": "କାରବାର ଲେଜର",
  "All": "ସମସ୍ତ",
  "Pending Pickup": "ବିଚାରାଧୀନ ପିକଅପ୍ |",
  "Registering...": "ପଞ୍ଜିକରଣ ...",
  "Register Farmer": "ପଞ୍ଜିକରଣ କୃଷକ |",
  "Account Settings": "ଖାତା ସେଟିଂସମୂହ |",
  "Foundational Doctrine": "ମୂଳ ତତ୍ତ୍। |",
  "Operations Management": "ଅପରେସନ୍ସ ମ୍ୟାନେଜମେଣ୍ଟ",
  "Processed": "ପ୍ରକ୍ରିୟାକରଣ",
  "In Transit": "ଗମନାଗମନରେ |",
  "Verification Image": "ଯାଞ୍ଚ ପ୍ରତିଛବି |",
  "Confirm Intake & Mint Value": "ଭୋଜନ ଏବଂ ମେଣ୍ଟ ମୂଲ୍ୟ ନିଶ୍ଚିତ କରନ୍ତୁ |",
  "CCC Value": "କାର୍ବନ କ୍ରେଡିଟ୍ ମୂଲ୍ୟ",
  "Processing...": "ପ୍ରକ୍ରିୟାକରଣ ...",
  "Weight (kg)": "ଓଜନ (କେଜି)",
  "Estimated Value Breakdown": "ଆନୁମାନିକ ମୂଲ୍ୟ ବ୍ରେକଡାଉନ୍ |",
  "Total Sovereign Value": "ସମୁଦାୟ ସାର୍ବଭ Val ମ ମୂଲ୍ୟ |",
  "Location Confirmation (Google Maps)": "ଅବସ୍ଥାନ ନିଶ୍ଚିତକରଣ (ଗୁଗୁଲ୍ ମ୍ୟାପ୍ସ)",
  "Base Value (Recycler)": "ଆଧାର ମୂଲ୍ୟ (ରିସାଇକ୍ଲର୍)",
  "Waste Type": "ଆବର୍ଜନା ପ୍ରକାର |",
  "Sovereign-Grade Circular Economy Engine": "ସାର୍ବଭ ign ମ-ଗ୍ରେଡ୍ ସର୍କୁଲାର୍ ଇକୋନୋମି ଇଞ୍ଜିନ୍ |",
  "Intake": "ଭୋଜନ",
  "Global Circular Value": "ଗ୍ଲୋବାଲ୍ ସର୍କୁଲାର୍ ମୂଲ୍ୟ |",
  "RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.": "RupayKg ହେଉଛି ସର୍କୁଲାର ଇକୋନୋମି ଅପରେଟିଂ ସିଷ୍ଟମ ଯାହାକି ମଲ୍ଟି ରେଳ ମୂଲ୍ୟ ଇଞ୍ଜିନ ମାଧ୍ୟମରେ କୃଷି, ପ municipal ରପାଳିକା ଏବଂ ଶିଳ୍ପ ବର୍ଜ୍ୟବସ୍ତୁକୁ ମୋନେଟାଇଜ୍ କରିବାକୁ ସମ୍ପ୍ରଦାୟକୁ ସଶକ୍ତ କରିଥାଏ |",
  "Access the OS": "OS କୁ ପ୍ରବେଶ କରନ୍ତୁ |",
  "Convert Every Kilogram of Waste into": "ପ୍ରତ୍ୟେକ କିଲୋଗ୍ରାମ ବର୍ଜ୍ୟବସ୍ତୁକୁ ରୂପାନ୍ତର କରନ୍ତୁ |",
  "Features": "ବ Features ଶିଷ୍ଟ୍ୟଗୁଡିକ",
  "How it Works": "ଏହା କିପରି କାମ କରେ |",
  "Launch OS": "OS ଆରମ୍ଭ କରନ୍ତୁ |",
  "Ecosystem Roles": "ଇକୋସିଷ୍ଟମ୍ ଭୂମିକା |",
  "Live Stream": "ଲାଇଭ୍ ଷ୍ଟ୍ରିମ୍ |",
  "Live Network Impact": "ଲାଇଭ୍ ନେଟୱାର୍କ ପ୍ରଭାବ |",
  "Simultaneously extract value from Recycler, CSR, Municipal, CCC, and EPR rails for every kilogram of biomass processed.": "ପ୍ରକ୍ରିୟାକୃତ ପ୍ରତ୍ୟେକ କିଲୋଗ୍ରାମ ବାୟୋମାସ୍ ପାଇଁ ରିସାଇକ୍ଲର୍, ସିଏସ୍ଆର୍, ମ୍ୟୁନିସିପାଲିଟି, କାର୍ବନ୍, ଏବଂ ଇପିଆର ରେଳରୁ ଏକକାଳୀନ ମୂଲ୍ୟ ବାହାର କରନ୍ତୁ |",
  "Real-time waste throughput across the RupayKg OS": "RupayKg OS ରେ ରିଅଲ୍-ଟାଇମ୍ ବର୍ଜ୍ୟବସ୍ତୁ ଥ୍ରୋପପୁଟ୍ |",
  "Automated verification of waste type, weight, and geolocation ensures immutable, sovereign-grade data integrity.": "ବର୍ଜ୍ୟବସ୍ତୁ ପ୍ରକାର, ଓଜନ, ଏବଂ ଭ ol ଗଳିକ ଅବସ୍ଥାନର ସ୍ୱୟଂଚାଳିତ ଯାଞ୍ଚ ଅକ୍ଷୟ, ସାର୍ବଭ grade ମ-ଗ୍ରେଡ୍ ତଥ୍ୟ ଅଖଣ୍ଡତାକୁ ସୁନିଶ୍ଚିତ କରେ |",
  "Multi-Rail Value Engine": "ମଲ୍ଟି ରେଳ ମୂଲ୍ୟ ଇଞ୍ଜିନ୍ |",
  "Read Whitepaper": "ହ୍ it ାଇଟପେପର ପ Read ନ୍ତୁ |",
  "Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.": "ନାଗରିକ ୱାଲେଟକୁ ସିଧାସଳଖ ଅର୍ଥ ବଣ୍ଟନ କରନ୍ତୁ, ପରିବେଶ ଦାୟିତ୍ local କୁ ସ୍ଥାନୀୟ ଅର୍ଥନ growth ତିକ ଅଭିବୃଦ୍ଧିରେ ପରିଣତ କରନ୍ତୁ |",
  "Rural Wealth Creation": "ଗ୍ରାମୀଣ ଧନ ସୃଷ୍ଟି |",
  "AI-Verified Intake": "AI- ଯାଞ୍ଚ ହୋଇଥିବା ଭୋଜନ |",
  "Aggregate": "ସମୁଦାୟ",
  "nodes": "ନୋଡଗୁଡିକ",
  "A seamless pipeline from waste generation to value realization.": "ବର୍ଜ୍ୟବସ୍ତୁ ଉତ୍ପାଦନ ଠାରୁ ମୂଲ୍ୟ ହାସଲ ପର୍ଯ୍ୟନ୍ତ ଏକ ବିହୀନ ପାଇପଲାଇନ |",
  "Distributed biomass collection nodes": "ବଣ୍ଟିତ ବାୟୋମାସ୍ ସଂଗ୍ରହ ନୋଡ୍ |",
  "Value Minted": "ମୂଲ୍ୟ ମୁଦ୍ରିତ |",
  "Network Topology": "ନେଟୱାର୍କ ଟପୋଲୋଜି |",
  "Citizens collect agricultural, municipal, or industrial waste.": "ନାଗରିକମାନେ କୃଷି, ପ municipal ରପାଳିକା କିମ୍ବା ଶିଳ୍ପ ବର୍ଜ୍ୟବସ୍ତୁ ସଂଗ୍ରହ କରନ୍ତି |",
  "Aggregators verify, weigh, and transport waste to facilities.": "ଏଗ୍ରିଗେଟରମାନେ ବର୍ଜ୍ୟବସ୍ତୁକୁ ଯାଞ୍ଚ, ଓଜନ ଏବଂ ପରିବହନ ପାଇଁ ପରିବହନ କରନ୍ତି |",
  "Active Nodes": "ସକ୍ରିୟ ନୋଡ୍ |",
  "Generate": "ସୃଷ୍ଟି କରନ୍ତୁ |",
  "Recyclers convert waste into usable materials or energy.": "ରିସାଇକ୍ଲର୍ ବର୍ଜ୍ୟବସ୍ତୁକୁ ବ୍ୟବହାର ଯୋଗ୍ୟ ସାମଗ୍ରୀ କିମ୍ବା ଶକ୍ତିରେ ପରିଣତ କରେ |",
  "Mint Value": "ମେଣ୍ଟ ମୂଲ୍ୟ",
  "Smart contracts distribute funds across all 5 value rails.": "ସ୍ମାର୍ଟ ଚୁକ୍ତିନାମା ସମସ୍ତ 5 ମୂଲ୍ୟ ରେଲ୍ ମଧ୍ୟରେ ପାଣ୍ଠି ବଣ୍ଟନ କରେ |",
  "Instant wallet funding": "ତତକ୍ଷଣାତ୍ ୱାଲେଟ୍ ପାଣ୍ଠି |",
  "Process": "ପ୍ରକ୍ରିୟା",
  "Upload waste records": "ଆବର୍ଜନା ରେକର୍ଡଗୁଡିକ ଅପଲୋଡ୍ କରନ୍ତୁ |",
  "Collect and deposit agricultural, municipal, or industrial waste. Earn direct wallet deposits based on the weight and type of waste provided.": "କୃଷି, ପ municipal ରପାଳିକା, କିମ୍ବା ଶିଳ୍ପ ବର୍ଜ୍ୟବସ୍ତୁ ସଂଗ୍ରହ ଏବଂ ଜମା କର | ପ୍ରଦାନ କରାଯାଇଥିବା ବର୍ଜ୍ୟବସ୍ତୁର ଓଜନ ଏବଂ ପ୍ରକାର ଉପରେ ଆଧାର କରି ସିଧାସଳଖ ୱାଲେଟ୍ ଜମା ରୋଜଗାର କରନ୍ତୁ |",
  "Waste Generator": "ଆବର୍ଜନା ଜେନେରେଟର",
  "Choose your part in the circular economy.": "ବୃତ୍ତାକାର ଅର୍ଥନୀତିରେ ଆପଣଙ୍କର ଅଂଶ ବାଛନ୍ତୁ |",
  "Citizen": "ନାଗରିକ",
  "Aggregator": "ଏଗ୍ରିଗେଟର୍",
  "Track environmental impact": "ପରିବେଶ ପ୍ରଭାବକୁ ଟ୍ରାକ୍ କରନ୍ତୁ |",
  "Collection & Transport": "ସଂଗ୍ରହ ଏବଂ ପରିବହନ",
  "Receive aggregated waste and process it into end-products. Trigger the final value realization across all rails.": "ଏକତ୍ରିତ ବର୍ଜ୍ୟବସ୍ତୁ ଗ୍ରହଣ କର ଏବଂ ଏହାକୁ ଶେଷ ଉତ୍ପାଦରେ ପ୍ରକ୍ରିୟାକରଣ କର | ସମସ୍ତ ରେଳଗୁଡିକରେ ଅନ୍ତିମ ମୂଲ୍ୟ ହୃଦୟଙ୍ଗମକୁ ଟ୍ରିଗର କରନ୍ତୁ |",
  "Log collection batches": "ଲଗ୍ ସଂଗ୍ରହ ବ୍ୟାଚ୍ |",
  "Recycler": "ରିସାଇକ୍ଲର୍ |",
  "Processor": "ସଞ୍ଚାଳକ",
  "Verify citizen deposits, consolidate waste, and manage logistics to transport materials to processing facilities.": "ନାଗରିକ ଜମା ଯାଞ୍ଚ କରନ୍ତୁ, ବର୍ଜ୍ୟବସ୍ତୁକୁ ଏକତ୍ର କରନ୍ତୁ ଏବଂ ପ୍ରକ୍ରିୟାକରଣ ସୁବିଧାକୁ ସାମଗ୍ରୀ ପରିବହନ ପାଇଁ ଲଜିଷ୍ଟିକ୍ସ ପରିଚାଳନା କରନ୍ତୁ |",
  "Route optimization data": "ମାର୍ଗ ଅପ୍ଟିମାଇଜେସନ୍ ତଥ୍ୟ |",
  "Earn logistics margins": "ଲଜିଷ୍ଟିକ୍ ମାର୍ଜିନ ରୋଜଗାର କରନ୍ତୁ |",
  "Generate CCCs": "କାର୍ବନ କ୍ରେଡିଟ୍ ସୃଷ୍ଟି କରନ୍ତୁ |",
  "Login": "ଲଗଇନ୍ କରନ୍ତୁ |",
  "Circular Economy Operating System": "ସର୍କୁଲାର୍ ଇକୋନୋମି ଅପରେଟିଂ ସିଷ୍ଟମ୍ |",
  "Organization Name": "ସଂଗଠନ ନାମ",
  "Context:": "ପ୍ରସଙ୍ଗ:",
  "Access CSR/EPR funds": "CSR / EPR ପାଣ୍ଠିକୁ ପ୍ରବେଶ କରନ୍ତୁ |",
  "Log processing yields": "ଲଗ୍ ପ୍ରକ୍ରିୟାକରଣ ଅମଳ |",
  "Register": "ପଞ୍ଜିକରଣ କର |",
  "District": "ଜିଲ୍ଲା",
  "Account Type": "ଖାତା ପ୍ରକାର",
  "Phone Number": "ଫୋନ୍ ନମ୍ବର |",
  "Access OS": "OS କୁ ପ୍ରବେଶ କରନ୍ତୁ |",
  "Back to Home": "ଘରକୁ ଫେରନ୍ତୁ |",
  "Global Impact Map": "ଗ୍ଲୋବାଲ୍ ଇମ୍ପାକ୍ଟ ମ୍ୟାପ୍ |",
  "State": "ରାଜ୍ୟ",
  "Password": "ପାସୱାର୍ଡ",
  "Quick Demo Access": "ଦ୍ରୁତ ଡେମୋ ଆକ୍ସେସ୍ |",
  "Submission Heatmap": "ଦାଖଲ ହିଟ୍ମ୍ୟାପ୍ |",
  "System Audit Logs": "ସିଷ୍ଟମ୍ ଅଡିଟ୍ ଲଗ୍ |",
  "Create Account": "ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ |",
  "Total Offset": "ସମୁଦାୟ ଅଫସେଟ୍ |",
  "No pending MRV records": "କ MR ଣସି ବିଚାରାଧୀନ MRV ରେକର୍ଡ ନାହିଁ |",
  "All processed waste has been verified.": "ସମସ୍ତ ପ୍ରକ୍ରିୟାକୃତ ବର୍ଜ୍ୟବସ୍ତୁ ଯାଞ୍ଚ କରାଯାଇଛି |",
  "Verify processed waste records to issue CCCs.": "କାର୍ବନ କ୍ରେଡିଟ୍ ଦେବା ପାଇଁ ପ୍ରକ୍ରିୟାକୃତ ବର୍ଜ୍ୟ ରେକର୍ଡଗୁଡିକ ଯାଞ୍ଚ କରନ୍ତୁ |",
  "Portfolio Composition": "ପୋର୍ଟଫୋଲିଓ ରଚନା",
  "Pending": "ବିଚାରାଧୀନ ଅଛି",
  "MRV Verification Dashboard": "MRV ଯାଞ୍ଚ ଡ୍ୟାସବୋର୍ଡ |",
  "Farmers Supported": "କୃଷକମାନେ ସମର୍ଥିତ |",
  "Waste Diverted": "ବର୍ଜ୍ୟବସ୍ତୁ",
  "Impact Distribution": "ପ୍ରଭାବ ବଣ୍ଟନ |",
  "Acreage": "ଏକର",
  "Location Verification": "ଅବସ୍ଥାନ ଯାଞ୍ଚ",
  "Available Credits": "ଉପଲବ୍ଧ କ୍ରେଡିଟ୍ |",
  "AI Risk Score": "AI ବିପଦ ସ୍କୋର |",
  "Credit Value": "କ୍ରେଡିଟ୍ ମୂଲ୍ୟ",
  "Verify & Issue Credits": "କ୍ରେଡିଟ୍ ଯାଞ୍ଚ ଏବଂ ପ୍ରଦାନ କରନ୍ତୁ |",
  "Reject": "ପ୍ରତ୍ୟାଖ୍ୟାନ କରନ୍ତୁ |",
  "CCC Reduction": "CCC ହ୍ରାସ |",
  "Purchase verified CCCs to offset your footprint.": "ଆପଣଙ୍କର ପାଦଚିହ୍ନ ବନ୍ଦ କରିବାକୁ ଯାଞ୍ଚ ହୋଇଥିବା କାର୍ବନ କ୍ରେଡିଟ୍ କ୍ରୟ କରନ୍ତୁ |",
  "Cancel": "ବାତିଲ୍ କରନ୍ତୁ |",
  "Purchase Credits": "କ୍ରେଡିଟ୍ କ୍ରୟ କରନ୍ତୁ |",
  "Project": "ପ୍ରକଳ୍ପ",
  "Price per Tonne": "ଟନ୍ ପ୍ରତି ମୂଲ୍ୟ |",
  "Amount": "ପରିମାଣ",
  "Total Cost": "ମୋଟ ମୂଲ୍ୟ",
  "Your Offset Balance": "ତୁମର ଅଫସେଟ୍ ବାଲାନ୍ସ |",
  "Amount to Purchase (Tonnes)": "କ୍ରୟ ପରିମାଣ (ଟନ୍)",
  "Confirm Purchase": "କ୍ରୟ ନିଶ୍ଚିତ କରନ୍ତୁ |",
  "Recent Transactions": "ସାମ୍ପ୍ରତିକ କାରବାର",
  "Municipal Corporation": "ମ୍ୟୁନିସିପାଲିଟି କର୍ପୋରେସନ୍",
  "Price": "ମୂଲ୍ୟ",
  "Network Active": "ନେଟୱାର୍କ ସକ୍ରିୟ |",
  "MSW": "MSW",
  "Date": "ତାରିଖ",
  "Ward Analytics": "ୱାର୍ଡ ଆନାଲିଟିକ୍ସ |",
  "National Dashboard": "ଜାତୀୟ ଡ୍ୟାସବୋର୍ଡ |",
  "Status": "ସ୍ଥିତି",
  "Ward-Level Analytics": "ୱାର୍ଡ ସ୍ତରୀୟ ଆନାଲିଟିକ୍ସ |",
  "Ward": "ୱାର୍ଡ",
  "Gram Panchayat": "ଗ୍ରାମ ପଞ୍ଚାୟତ",
  "Citizen (MSW Generator)": "ନାଗରିକ (MSW ଜେନେରେଟର)",
  "Village": "ଗାଁ",
  "All Roles": "ସମସ୍ତ ଭୂମିକା",
  "Farmer / FPO (Biomass Generator)": "କୃଷକ / FPO (ବାୟୋମାସ୍ ଜେନେରେଟର)",
  "Village-Level Analytics": "ଗ୍ରାମ ସ୍ତରୀୟ ଆନାଲିଟିକ୍ସ |",
  "Village Analytics": "ଗ୍ରାମ ଆନାଲିଟିକ୍ସ |",
  "Farmers / FPOs": "କୃଷକ / FPO",
  "Biomass": "ବାୟୋମାସ୍ |",
  "Citizens": "ନାଗରିକ",
  "CCC Pool Status": "କାର୍ବନ ପୁଲ୍ ସ୍ଥିତି |",
  "Aggregators": "ଏଗ୍ରିଗେଟର୍ସ",
  "Processors": "ସଞ୍ଚାଳକ",
  "CSR Partners": "CSR ସହଭାଗୀଗଣ |",
  "EPR Partners": "EPR ସହଭାଗୀଗଣ |",
  "CCC Buyers": "କାର୍ବନ କ୍ରେତା |",
  "Audit Logs": "ଅଡିଟ୍ ଲଗ୍ |",
  "Fraud Alerts & Flagged Events": "ଜାଲିଆତି ଆଲର୍ଟ ଏବଂ ଫ୍ଲାଗ୍ ହୋଇଥିବା ଘଟଣା |",
  "User Management": "ବ୍ୟବହାରକାରୀ ପରିଚାଳନା",
  "Diverted": "ବିଭ୍ରାନ୍ତ |",
  "Water Saved": "ଜଳ ସଞ୍ଚୟ ହୋଇଛି |",
  "Total Waste Events": "ସମୁଦାୟ ବର୍ଜ୍ୟବସ୍ତୁ ଘଟଣା |",
  "Wallet Disbursed": "ୱାଲେଟ୍ ବିତରଣ |",
  "Environmental Impact": "ପରିବେଶ ପ୍ରଭାବ",
  "Growth & Impact Trends": "ଅଭିବୃଦ୍ଧି ଏବଂ ପ୍ରଭାବ ଧାରା |",
  "Methane Avoided": "ମିଥେନରୁ ଦୂରେଇ ରହିଲେ |",
  "Economic Efficiency": "ଆର୍ଥିକ ଦକ୍ଷତା |",
  "Trees": "ଗଛଗୁଡିକ |",
  "Trees Equivalent": "ଗଛ ସମାନ |",
  "Processed Events": "ପ୍ରକ୍ରିୟାକରଣ ଘଟଣା |",
  "Waste Composition": "ଆବର୍ଜନା ରଚନା |",
  "Operational Health": "କାର୍ଯ୍ୟକ୍ଷମ ସ୍ୱାସ୍ଥ୍ୟ",
  "Geospatial Fraud Distribution": "ଭ osp ଗୋଳିକ ଜାଲିଆତି ବଣ୍ଟନ |",
  "* Government savings calculated based on avoided landfill management and environmental remediation costs.": "* ଲ୍ୟାଣ୍ଡଫିଲ୍ ପରିଚାଳନା ଏବଂ ପରିବେଶ ପ୍ରତିକାର ଖର୍ଚ୍ଚ ଉପରେ ଆଧାର କରି ସରକାରୀ ସଞ୍ଚୟ ଗଣନା କରାଯାଇଛି |",
  "Avg Price / kg": "ହାରାହାରି ମୂଲ୍ୟ / କି.ଗ୍ରା",
  "Total Minted CCC Units": "ସମୁଦାୟ ମେଣ୍ଟେଡ୍ କାର୍ବନ୍ ୟୁନିଟ୍ |",
  "No flagged events detected.": "କ flag ଣସି ଫ୍ଲାଗ୍ ହୋଇଥିବା ଘଟଣା ଚିହ୍ନଟ ହୋଇନାହିଁ |",
  "Processing Efficiency": "ପ୍ରକ୍ରିୟାକରଣ ଦକ୍ଷତା |",
  "MRV Rejection Rate": "MRV ପ୍ରତ୍ୟାଖ୍ୟାନ ହାର",
  "Govt Cost Savings": "ସରକାରୀ ମୂଲ୍ୟ ସଞ୍ଚୟ",
  "CSR Partner": "CSR ସହଭାଗୀ |",
  "Municipal Admin": "ମ୍ୟୁନିସିପାଲିଟି ଆଡମିନି",
  "User": "ଉପଯୋଗକର୍ତ୍ତା |",
  "Wallet": "ୱାଲେଟ୍ |",
  "Location": "ଅବସ୍ଥାନ",
  "Regulator": "ନିୟାମକ",
  "Role": "ଭୂମିକା",
  "Actions": "କାର୍ଯ୍ୟ",
  "State Admin": "ରାଜ୍ୟ ପ୍ରଶାସକ",
  "Super Admin": "ସୁପର ଆଡମିନି |",
  "EPR Partner": "EPR ସହଭାଗୀ |",
  "No users found.": "କ users ଣସି ଉପଭୋକ୍ତା ପାଇଲେ ନାହିଁ |",
  "Delete User": "ଉପଯୋଗକର୍ତ୍ତା ବିଲୋପ କରନ୍ତୁ |",
  "Total Waste": "ସମୁଦାୟ ବର୍ଜ୍ୟବସ୍ତୁ |",
  "Action": "କାର୍ଯ୍ୟ",
  "No ward data available.": "କ ward ଣସି ୱାର୍ଡ ତଥ୍ୟ ଉପଲବ୍ଧ ନାହିଁ |",
  "No audit logs available.": "କ audit ଣସି ଅଡିଟ୍ ଲଗ୍ ଉପଲବ୍ଧ ନାହିଁ |",
  "Total Events": "ମୋଟ ଘଟଣା",
  "User ID": "ବ୍ୟବହାରକାରୀ ID",
  "CCC Buyer": "କାର୍ବନ କ୍ରେତା |",
  "Notification Preferences": "ବିଜ୍ଞପ୍ତି ପସନ୍ଦଗୁଡିକ |",
  "Get instant SMS alerts for critical updates.": "ଜଟିଳ ଅଦ୍ୟତନ ପାଇଁ ତୁରନ୍ତ SMS ଆଲର୍ଟ ପାଆନ୍ତୁ |",
  "Add ₹10,000": "₹ 10,000 ଯୋଡନ୍ତୁ |",
  "SMS Alerts": "SMS ଆଲର୍ଟ |",
  "Receive updates about your transactions via email.": "ଇମେଲ ମାଧ୍ୟମରେ ତୁମର କାରବାର ବିଷୟରେ ଅଦ୍ୟତନ ଗ୍ରହଣ କର |",
  "Save Changes": "ପରିବର୍ତ୍ତନଗୁଡିକ ସଞ୍ଚୟ କରନ୍ତୁ |",
  "Enable browser push notifications.": "ବ୍ରାଉଜର୍ ପୁସ୍ ବିଜ୍ଞପ୍ତିକୁ ସକ୍ଷମ କରନ୍ତୁ |",
  "Push Notifications": "ପୁସ୍ ବିଜ୍ଞପ୍ତିଗୁଡିକ |",
  "Email Notifications": "ଇମେଲ୍ ବିଜ୍ଞପ୍ତିଗୁଡିକ |",
  "Saving...": "ସଞ୍ଚୟ ...",
  " Context (": "ପ୍ରସଙ୍ଗ (",
  "GENESIS": "ଜେନେସିସ୍",
  "Village: ": "ଗାଁ:",
  "FRAUD ALERT": "FRAUD ALERT",
  "Type: ": "ପ୍ରକାର:",
  "Currently Active: ": "ସମ୍ପ୍ରତି ସକ୍ରିୟ:",
  "Value: ": "ମୂଲ୍ୟ:",
  "How the Engine Works": "ଇଞ୍ଜିନ୍ କିପରି କାମ କରେ |",
  "© 2026 RupayKg Circular Economy OS. All rights reserved.": "© 2026 RupayKg ସର୍କୁଲାର୍ ଇକୋନୋମି OS | ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ |",
  "Weight: ": "ଓଜନ:",
  "rural": "ଗ୍ରାମୀଣ",
  "Terms": "ସର୍ତ୍ତାବଳୀ",
  "RUPAYKG": "RUPAYKG",
  "National Regulator": "ଜାତୀୟ ନିୟାମକ",
  "Processor (Recycler)": "ସଞ୍ଚାଳକ (ରିସାଇକ୍ଲର୍)",
  "Privacy": "ଗୋପନୀୟତା",
  "Farmer": "କୃଷକ",
  "Admin": "ଆଡମିନି",
  "urban": "ସହରୀ",
  "Aggregator (Collection & Transport)": "ଏଗ୍ରିଗେଟର୍ (ସଂଗ୍ରହ ଏବଂ ପରିବହନ)",
  "Wallet Balance": "ୱାଲେଟ୍ ସନ୍ତୁଳନ |",
  "No records found": "କ records ଣସି ରେକର୍ଡ ମିଳିଲା ନାହିଁ |",
  "Database Connection Failed": "ଡାଟାବେସ୍ ସଂଯୋଗ ବିଫଳ ହେଲା |",
  "Circular Economy Intake Form": "ବୃତ୍ତାକାର ଅର୍ଥନୀତି ଗ୍ରହଣ ଫର୍ମ |",
  "No audit logs found": "କ audit ଣସି ଅଡିଟ୍ ଲଗ୍ ମିଳିଲା ନାହିଁ |",
  "Acreage (acres)": "ଏକର (ଏକର)",
  "GPS Captured: ": "GPS ଧରାଯାଇଛି:",
  "Name": "ନାମ",
  "GPS Capture Failed": "ଜିପିଏସ୍ କ୍ୟାପଚର ବିଫଳ ହେଲା |",
  "Capturing GPS Coordinates...": "ଜିପିଏସ୍ କୋର୍ଡିନେଟ୍ କ୍ୟାପଚର୍ ...",
  "Retry GPS": "GPS ପୁନ ry ଚେଷ୍ଟା କରନ୍ତୁ |",
  "Failed to register farmer": "କୃଷକ ପଞ୍ଜିକରଣ କରିବାରେ ବିଫଳ |",
  "Farmer registered successfully! ID: ": "କୃଷକ ସଫଳତାର ସହିତ ପଞ୍ଜୀକୃତ! ID:",
  "e.g., Paddy, Wheat": "ଯଥା, ଧାନ, ଗହମ |",
  "Geolocation is not supported by this browser.": "ଏହି ବ୍ରାଉଜର୍ ଦ୍ୱାରା ଭୂଗୋଳ ସମର୍ଥିତ ନୁହେଁ |",
  "Active Queue": "ସକ୍ରିୟ ଧାଡି |",
  "Active Fleet": "ସକ୍ରିୟ ଫ୍ଲାଇଟ୍ |",
  "Drivers Online": "ଡ୍ରାଇଭରମାନେ ଅନଲାଇନ୍ |",
  "GPS Required": "GPS ଆବଶ୍ୟକ |",
  "Failed to get location. Please enter manually.": "ସ୍ଥାନ ପାଇବାରେ ବିଫଳ | ଦୟାକରି ହସ୍ତକୃତ ଭାବରେ ପ୍ରବେଶ କରନ୍ତୁ |",
  "Accept Pickup": "ପିକଅପ୍ ଗ୍ରହଣ କରନ୍ତୁ |",
  "Utilization": "ଉପଯୋଗ",
  "Current Load": "ସାମ୍ପ୍ରତିକ ଲୋଡ୍ |",
  "No new tasks available.": "କ new ଣସି ନୂତନ କାର୍ଯ୍ୟ ଉପଲବ୍ଧ ନାହିଁ |",
  "Biomass in Stock": "ଷ୍ଟକ୍ରେ ବାୟୋମାସ୍ |",
  "Available for Pickup": "ପିକଅପ୍ ପାଇଁ ଉପଲବ୍ଧ |",
  "Total Capacity": "ମୋଟ ସାମର୍ଥ୍ୟ |",
  "Output Material": "ଆଉଟପୁଟ୍ ସାମଗ୍ରୀ",
  "Incoming for Processing": "ପ୍ରକ୍ରିୟାକରଣ ପାଇଁ ଆସୁଛି |",
  "Storage Utilization": "ସଂରକ୍ଷଣ ବ୍ୟବହାର",
  "No active tasks in your possession.": "ଆପଣଙ୍କ ଅଧୀନରେ କ active ଣସି ସକ୍ରିୟ କାର୍ଯ୍ୟ ନାହିଁ |",
  "Type": "ଟାଇପ୍ କରନ୍ତୁ |",
  "Recently Processed": "ସମ୍ପ୍ରତି ପ୍ରକ୍ରିୟାକରଣ |",
  "Timestamp": "ଟାଇମଷ୍ଟ୍ୟାମ୍ପ |",
  "Weight": "ଓଜନ",
  "MRV Status": "MRV ସ୍ଥିତି |",
  "No records found for the selected filter.": "ମନୋନୀତ ଫିଲ୍ଟର ପାଇଁ କ records ଣସି ରେକର୍ଡ ମିଳିଲା ନାହିଁ |",
  "Value": "ମୂଲ୍ୟ",
  "Pending MRV": "ବିଚାରାଧୀନ MRV",
  "Accept Receipt": "ରସିଦ ଗ୍ରହଣ କରନ୍ତୁ |",
  "Verified By": "ଦ୍ Ver ାରା ଯାଞ୍ଚ କରାଯାଇଛି |",
  "High": "ଉଚ୍ଚ",
  "No credits available": "କ No ଣସି କ୍ରେଡିଟ୍ ଉପଲବ୍ଧ ନାହିଁ |",
  "No MRV history found": "କ MR ଣସି MRV ଇତିହାସ ମିଳିଲା ନାହିଁ |",
  "Details": "ବିବରଣୀ",
  "AI Risk": "AI ବିପଦ |",
  "Check back later for newly verified CCCs.": "ନୂତନ ଯାଞ୍ଚ ହୋଇଥିବା କାର୍ବନ କ୍ରେଡିଟ୍ ପାଇଁ ପରେ ପୁନ back ଯାଞ୍ଚ କରନ୍ତୁ |",
  "Low": "ନିମ୍ନ",
  "Med": "ମେଡ",
  "Record ID": "ରେକର୍ଡ ID",
  "The Foundational Structure and Operating Doctrine of RupayKg": "RupayKg ର ମୂଳ ଗଠନ ଏବଂ ଅପରେଟିଂ ଡକ୍ଟ୍ରିନ୍ |",
  "Verified": "ଯାଞ୍ଚ ହୋଇଛି |",
  "Profile Settings": "ପ୍ରୋଫାଇଲ୍ ସେଟିଂସମୂହ |",
  "I. Introduction": "I. ପରିଚୟ",
  "An error occurred": "ଏକ ତ୍ରୁଟି ଘଟିଲା |",
  "Insufficient Funds": "ପର୍ଯ୍ୟାପ୍ତ ପାଣ୍ଠି |",
  "Failed to update profile": "ପ୍ରୋଫାଇଲ୍ ଅପଡେଟ୍ କରିବାରେ ବିଫଳ |",
  "Purchase Credit": "କ୍ରେଡିଟ୍ କ୍ରୟ କରନ୍ତୁ |",
  "Offset": "ଅଫସେଟ୍ |",
  "Profile updated successfully": "ପ୍ରୋଫାଇଲ୍ ସଫଳତାର ସହିତ ଅଦ୍ୟତନ ହେଲା |",
  "Category": "ବର୍ଗ",
  "II. Unified Operating System Model": "II ୟୁନିଫାଏଡ୍ ଅପରେଟିଂ ସିଷ୍ଟମ୍ ମଡେଲ୍ |",
  "Anchor": "ଆଙ୍କର୍",
  "RupayKg is not structured as a project developer, CCC trader, or recycling entity. It is an infrastructure layer designed to operate across urban and rural administrative frameworks without architectural duplication.": "RupayKg ଏକ ପ୍ରକଳ୍ପ ବିକାଶକାରୀ, ଅଙ୍ଗାରକାମ୍ଳ ବ୍ୟବସାୟୀ କିମ୍ବା ପୁନ yc ବ୍ୟବହାରକାରୀ ସଂସ୍ଥା ଭାବରେ ଗଠିତ ନୁହେଁ | ଏହା ଏକ ଭିତ୍ତିଭୂମି ସ୍ତର ଯାହାକି ସ୍ଥାପତ୍ୟ ନକଲ ବିନା ସହରୀ ଏବଂ ଗ୍ରାମୀଣ ପ୍ରଶାସନିକ framework ାଞ୍ଚାରେ କାର୍ଯ୍ୟ କରିବା ପାଇଁ ପରିକଳ୍ପିତ |",
  "Municipal Corp + Ward": "ମ୍ୟୁନିସିପାଲିଟି କର୍ପ + ୱାର୍ଡ |",
  "RupayKg has been established as a Unified Waste-to-CCC Digital Operating System designed to support India’s transition toward a compliance-based CCC market.": "ରୁପାଇକେ ଏକ ୟୁନିଫାଏଡ୍ ବର୍ଜ୍ୟବସ୍ତୁରୁ କାର୍ବନ୍ ଡିଜିଟାଲ୍ ଅପରେଟିଂ ସିଷ୍ଟମ୍ ଭାବରେ ପ୍ରତିଷ୍ଠିତ ହୋଇଛି ଯାହା ଏକ ଅନୁପାଳନ ଭିତ୍ତିକ କାର୍ବନ ବଜାର ଆଡକୁ ଭାରତର ପରିବର୍ତ୍ତନକୁ ସମର୍ଥନ କରିବା ପାଇଁ ପରିକଳ୍ପିତ |",
  "Urban": "ସହରୀ",
  "The platform addresses a structural gap in India’s CCC ecosystem: the absence of a unified, regulator-aligned digital infrastructure capable of converting verified waste diversion into compliance-grade CCC supply.": "ଏହି ପ୍ଲାଟଫର୍ମ ଭାରତର କାର୍ବନ ଇକୋସିଷ୍ଟମରେ ଏକ ଗଠନମୂଳକ ବ୍ୟବଧାନକୁ ସମାଧାନ କରେ: ଏକୀକୃତ, ନିୟାମକ-ଆଲାଇନ୍ ହୋଇଥିବା ଡିଜିଟାଲ୍ ଭିତ୍ତିଭୂମିର ଅନୁପସ୍ଥିତି ଯାଞ୍ଚ ହୋଇଥିବା ବର୍ଜ୍ୟବସ୍ତୁକୁ ପାଚନ-ଗ୍ରେଡ୍ କାର୍ବନ ଯୋଗାଣରେ ପରିଣତ କରିବାରେ ସକ୍ଷମ |",
  "Rural": "ଗ୍ରାମୀଣ",
  "Context": "ପ୍ରସଙ୍ଗ",
  "* All rural agricultural residue and biomass activity is classified under Biomass. No separate agricultural vertical exists.": "* ସମସ୍ତ ଗ୍ରାମୀଣ କୃଷି ଅବଶିଷ୍ଟାଂଶ ଏବଂ ବାୟୋମାସ୍ କାର୍ଯ୍ୟକଳାପ ବାୟୋମାସ୍ ଅଧୀନରେ ବର୍ଗୀକୃତ | କ separate ଣସି ପୃଥକ କୃଷି ଭୂଲମ୍ବ ନାହିଁ |",
  "Producers (EPR)": "ଉତ୍ପାଦକ (EPR)",
  "The Aggregator is structurally defined as the merged entity responsible for collection and sorting validation, simplifying chain-of-custody verification.": "ସଂଗ୍ରହକାରୀ ଏବଂ ସର୍ଟିଂ ବ valid ଧତା, ଶୃଙ୍ଖଳା-ଅଫ୍-ହେଫ୍ଟ ଯାଞ୍ଚକୁ ସରଳୀକରଣ ପାଇଁ ମିଶ୍ରିତ ସଂସ୍ଥା ଭାବରେ ଏଗ୍ରିଗେଟରକୁ ଗଠନମୂଳକ ଭାବରେ ବ୍ୟାଖ୍ୟା କରାଯାଇଛି |",
  "CSR Contributors": "CSR ଯୋଗଦାନକାରୀ |",
  "Gram Panchayat + Village": "ଗ୍ରାମ ପଞ୍ଚାୟତ + ଗ୍ରାମ",
  "Methane avoidance through diversion": "ଡାଇଭର୍ସନ ମାଧ୍ୟମରେ ମିଥେନ ଏଡାଇବା |",
  "Biomass-based fossil substitution": "ବାୟୋମାସ୍ ଆଧାରିତ ଜୀବାଶ୍ମ ପ୍ରତିସ୍ଥାପନ |",
  "Administrative Authority": "ପ୍ରଶାସନିକ ପ୍ରାଧିକରଣ |",
  "IV. CCC Origination": "IV। କାର୍ବନ ଉତ୍ପତ୍ତି |",
  "III. Unified Stakeholder Architecture": "III ୟୁନିଫାଏଡ୍ ହିତାଧିକାରୀ ସ୍ଥାପତ୍ୟ |",
  "Recycling substitution": "ରିସାଇକ୍ଲିଂ ପ୍ରତିସ୍ଥାପନ",
  "EPR Rail": "EPR ରେଳ",
  "V. Multi-Rail Architecture": "V. ମଲ୍ଟି ରେଳ ସ୍ଥାପତ୍ୟ |",
  "CSR Rail": "CSR ରେଳ |",
  "CCC issuance authority remains regulator-controlled. RupayKg does not independently mint credits. All credits must be event-traceable, registry-compatible, and align with national CCC governance frameworks.": "କାର୍ବନ ପ୍ରଦାନ କର୍ତ୍ତୃପକ୍ଷ ନିୟନ୍ତ୍ରକ-ନିୟନ୍ତ୍ରିତ ଅଟନ୍ତି | RupayKg ସ୍ ently ାଧୀନ ଭାବରେ କ୍ରେଡିଟ୍ ମେଣ୍ଟ କରେ ନାହିଁ | ସମସ୍ତ କ୍ରେଡିଟ୍ ଇଭେଣ୍ଟ-ଟ୍ରେସେବଲ୍, ରେଜିଷ୍ଟ୍ରି-ସୁସଙ୍ଗତ ଏବଂ ଜାତୀୟ କାର୍ବନ ଶାସନ framework ାଞ୍ଚା ସହିତ ସମାନ ହେବା ଜରୁରୀ |",
  "Recycler Rail": "ରିସାଇକ୍ଲର୍ ରେଳ |",
  "CCC Rail": "କାର୍ବନ ରେଳ |",
  "Governance Layer": "ଶାସନ ସ୍ତର",
  "VII. Strategic Position": "VII ରଣନୀତିକ ଅବସ୍ଥାନ |",
  "VI. Regulator Sovereignty": "VI। ନିୟାମକ ସାର୍ବଭ .ମତ୍ୱ |",
  "DECLARATION OF FOUNDATIONAL STRUCTURE": "ଫାଉଣ୍ଡେସନ ଷ୍ଟ୍ରକଚରର ଘୋଷଣା |",
  "RupayKg was built to unify them. Not as a CCC trader. Not as a recycling startup. But as a single operating system capable of working at Municipal Ward level and Gram Panchayat Village level without structural duplication.": "ସେମାନଙ୍କୁ ଏକୀକରଣ କରିବା ପାଇଁ ରୁପେକ୍ ନିର୍ମାଣ କରାଯାଇଥିଲା | କାର୍ବନ ବ୍ୟବସାୟୀ ଭାବରେ ନୁହେଁ | ଏକ ରିସାଇକ୍ଲିଂ ଷ୍ଟାର୍ଟଅପ୍ ଭାବରେ ନୁହେଁ | କିନ୍ତୁ ଏକକ ଅପରେଟିଂ ସିଷ୍ଟମ ଭାବରେ ମ୍ୟୁନିସିପାଲିଟି ୱାର୍ଡ ସ୍ତର ଏବଂ ଗ୍ରାମ ପଞ୍ଚାୟତ ଗ୍ରାମ ସ୍ତରରେ ଗଠନମୂଳକ ନକଲ ବିନା କାର୍ଯ୍ୟ କରିବାକୁ ସକ୍ଷମ |",
  "Article II — Unified Stakeholder Doctrine": "ଧାରା II - ୟୁନିଫାଏଡ୍ ହିତାଧିକାରୀ ଉପଦେଶ |",
  "When we began building RupayKg, we did not start with recycling. We started with a structural question: Why is there no unified infrastructure that converts waste into regulated CCC value?": "ଯେତେବେଳେ ଆମେ RupayKg ନିର୍ମାଣ ଆରମ୍ଭ କଲୁ, ଆମେ ପୁନ yc ବ୍ୟବହାରରୁ ଆରମ୍ଭ କରିନାହୁଁ | ଆମେ ଏକ ଗଠନମୂଳକ ପ୍ରଶ୍ନ ସହିତ ଆରମ୍ଭ କଲୁ: କାହିଁକି କ un ଣସି ଏକୀକୃତ ଭିତ୍ତିଭୂମି ନାହିଁ ଯାହା ବର୍ଜ୍ୟବସ୍ତୁକୁ ନିୟନ୍ତ୍ରିତ କାର୍ବନ ମୂଲ୍ୟରେ ପରିଣତ କରେ?",
  "India is entering a compliance CCC era. Municipal systems generate measurable methane. Rural biomass is burned or underutilized. Yet the systems remain fragmented.": "ଭାରତ ଏକ ଅନୁପାଳନ କାର୍ବନ ଯୁଗରେ ପ୍ରବେଶ କରୁଛି | ମ୍ୟୁନିସିପାଲିଟି ସିଷ୍ଟମଗୁଡିକ ମାପିବା ଯୋଗ୍ୟ ମିଥେନ ସୃଷ୍ଟି କରେ | ଗ୍ରାମୀଣ ବାୟୋମାସ୍ ପୋଡିଯାଏ କିମ୍ବା ଅବ୍ୟବହୃତ ହୁଏ | ତଥାପି ତନ୍ତ୍ରଗୁଡ଼ିକ ଖଣ୍ଡବିଖଣ୍ଡିତ |",
  "Legally Styled": "ଆଇନଗତ ଭାବରେ ଷ୍ଟାଇଲ୍ |",
  "Waste is no longer disposal. It is governance-linked climate infrastructure.": "ବର୍ଜ୍ୟବସ୍ତୁ ଆଉ ନିଷ୍କାସନ ନୁହେଁ | ଏହା ଶାସନ ସହ ଜଡିତ ଜଳବାୟୁ ଭିତ୍ତିଭୂମି |",
  "RupayKg shall operate a single digital system deployable under: (a) Municipal Corporation + Ward (Urban Context) (b) Gram Panchayat + Village (Rural Context). No structural duplication shall exist between contexts.": "RupayKg ଅଧୀନରେ ନିୟୋଜିତ ଏକକ ଡିଜିଟାଲ୍ ସିଷ୍ଟମ କାର୍ଯ୍ୟ କରିବ: ପ୍ରସଙ୍ଗ ମଧ୍ୟରେ କ No ଣସି ଗଠନମୂଳକ ନକଲ ରହିବ ନାହିଁ |",
  "— Founder, RupayKg": "- ପ୍ରତିଷ୍ଠାତା, ରୁପେ କେ",
  "Article I — Unified Operating System": "ଆର୍ଟିକିଲ୍ I - ୟୁନିଫାଏଡ୍ ଅପରେଟିଂ ସିଷ୍ଟମ୍ |",
  "Waste shall be classified exclusively as: (a) MSW in Urban context (b) Biomass in Rural context. All agricultural residue shall be classified under Biomass.": "ବର୍ଜ୍ୟବସ୍ତୁକୁ କେବଳ ଶ୍ରେଣୀଭୁକ୍ତ କରାଯିବ: (କ) ସହରୀ ପ୍ରସଙ୍ଗରେ MSW (ଖ) ଗ୍ରାମୀଣ ପ୍ରସଙ୍ଗରେ ବାୟୋମାସ୍ | ସମସ୍ତ କୃଷି ଅବଶିଷ୍ଟାଂଶ ବାୟୋମାସ୍ ଅଧୀନରେ ବର୍ଗୀକୃତ ହେବ |",
  "All emission reductions shall be processed through a single CCC calculation engine with event-level MRV validation.": "ସମସ୍ତ ନିର୍ଗମନ ହ୍ରାସ ଇଭେଣ୍ଟ ସ୍ତରର MRV ବ ation ଧତା ସହିତ ଏକକ କାର୍ବନ ଗଣନା ଇଞ୍ଜିନ୍ ମାଧ୍ୟମରେ ପ୍ରକ୍ରିୟାକରଣ କରାଯିବ |",
  "Article III — Waste Classification": "ଧାରା III - ବର୍ଜ୍ୟବସ୍ତୁ ବର୍ଗୀକରଣ |",
  "The stakeholder structure shall remain uniform nationwide and consist of: Waste Generator, Aggregator, Processor, Administrative Authority, Producers (EPR), CSR Contributors, CCC Buyers, Regulator.": "ଭାଗଚାଷୀ structure ାଞ୍ଚା ଦେଶବ୍ୟାପୀ ସମାନ ରହିବ ଏବଂ ଏଥିରେ ଅନ୍ତର୍ଭୁକ୍ତ: ଆବର୍ଜନା ଜେନେରେଟର, ଏଗ୍ରିଗେଟର୍, ପ୍ରୋସେସର୍, ଆଡମିନିଷ୍ଟ୍ରେଟିଭ୍ ଅଥରିଟି, ଉତ୍ପାଦକ (ଇପିଆର), ସିଏସ୍ଆର୍ ଅବଦାନକାରୀ, କାର୍ବନ୍ କ୍ରେତା, ରେଗୁଲେଟର |",
  "CCC mint authority shall remain under regulator control. RupayKg shall not independently issue CCCs.": "କାର୍ବନ ମେଣ୍ଟ କର୍ତ୍ତୃପକ୍ଷ ନିୟନ୍ତ୍ରକ ନିୟନ୍ତ୍ରଣରେ ରହିବେ | RupayKg ସ୍ independ ାଧୀନ ଭାବରେ କାର୍ବନ କ୍ରେଡିଟ୍ ପ୍ରଦାନ କରିବ ନାହିଁ |",
  "Institutional Identity": "ଅନୁଷ୍ଠାନିକ ପରିଚୟ |",
  "Article V — Rail Separation": "ଧାରା V - ରେଳ ବିଚ୍ଛିନ୍ନତା |",
  "Article IV — CCC Engine": "ଧାରା IV - କାର୍ବନ ଇଞ୍ଜିନ୍ |",
  "Article VI — Regulator Sovereignty": "ଧାରା VI - ନିୟାମକ ସାର୍ବଭ .ମତ୍ୱ |",
  "RupayKg shall maintain strict separation between: Recycler accounting, CSR accounting, EPR compliance, Governance value, CCC issuance. Double counting is prohibited.": "RupayKg ମଧ୍ୟରେ କଠୋର ପୃଥକତା ବଜାୟ ରଖିବ: ରିସାଇକ୍ଲର୍ ଆକାଉଣ୍ଟିଂ, ସିଏସ୍ଆର ଆକାଉଣ୍ଟିଂ, ଇପିଆର ଅନୁପାଳନ, ଶାସନ ମୂଲ୍ୟ, କାର୍ବନ ପ୍ରଦାନ | ଦୁଇଥର ଗଣନା ନିଷେଧ |",
  "RupayKg is hereby defined as: A Unified Waste-to-CCC Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability.": "RupayKg କୁ ଏହିପରି ଭାବରେ ବ୍ୟାଖ୍ୟା କରାଯାଇଛି: ଏକ ୟୁନିଫାଏଡ୍ ବର୍ଜ୍ୟବସ୍ତୁରୁ କାର୍ବନ୍ ଭିତ୍ତିଭୂମି ପ୍ଲାଟଫର୍ମ, ଏକ ଜାତୀୟ ହିତାଧିକାରୀ ସ୍ଥାପତ୍ୟ ଅଧୀନରେ ନିୟନ୍ତ୍ରକ-ଆଲାଇନ୍ କାର୍ବନ ଉତ୍ପାଦନ କ୍ଷମତା ସହିତ କାର୍ଯ୍ୟ କରେ |"
  } },
  pa: { translation: {
  "History": "ਇਤਿਹਾਸ",
  "Upload Waste": "ਕੂੜਾ ਅੱਪਲੋਡ ਕਰੋ",
  "Settings": "ਸੈਟਿੰਗਾਂ",
  "Task Board": "ਟਾਸਕ ਬੋਰਡ",
  "Genesis": "ਉਤਪਤ",
  "Dashboard": "ਡੈਸ਼ਬੋਰਡ",
  "CCC Market": "ਕਾਰਬਨ ਮਾਰਕੀਟ",
  "Logout": "ਲਾਗਆਉਟ",
  "National KPI": "ਰਾਸ਼ਟਰੀ ਕੇ.ਪੀ.ਆਈ",
  "MRV Dashboard": "MRV ਡੈਸ਼ਬੋਰਡ",
  "Total Earnings": "ਕੁੱਲ ਕਮਾਈਆਂ",
  "Farmers Registered": "ਕਿਸਾਨ ਰਜਿਸਟਰਡ",
  "System Overview": "ਸਿਸਟਮ ਸੰਖੇਪ ਜਾਣਕਾਰੀ",
  "Hindi": "ਹਿੰਦੀ",
  "Language": "ਭਾਸ਼ਾ",
  "CCC Offset": "ਕਾਰਬਨ ਆਫਸੈੱਟ",
  "Total Collected": "ਕੁੱਲ ਇਕੱਠਾ ਕੀਤਾ",
  "English": "ਅੰਗਰੇਜ਼ੀ",
  "Community Rank": "ਕਮਿਊਨਿਟੀ ਰੈਂਕ",
  "Welcome back": "ਵਾਪਸ ਸਵਾਗਤ",
  "Fleet Efficiency": "ਫਲੀਟ ਕੁਸ਼ਲਤਾ",
  "Total Investment": "ਕੁੱਲ ਨਿਵੇਸ਼",
  "Seed Demo Data": "ਬੀਜ ਡੈਮੋ ਡੇਟਾ",
  "Value Generated": "ਮੁੱਲ ਤਿਆਰ ਕੀਤਾ",
  "ESG Score": "ESG ਸਕੋਰ",
  "Logistics Margin": "ਲੌਜਿਸਟਿਕ ਮਾਰਜਿਨ",
  "CCCs": "ਕਾਰਬਨ ਕ੍ਰੈਡਿਟ",
  "Total Processed": "ਕੁੱਲ ਪ੍ਰਕਿਰਿਆ ਕੀਤੀ ਗਈ",
  "Processing Yield": "ਪ੍ਰੋਸੈਸਿੰਗ ਉਪਜ",
  "Platform Statistics": "ਪਲੇਟਫਾਰਮ ਅੰਕੜੇ",
  "Waste Distribution": "ਰਹਿੰਦ-ਖੂੰਹਦ ਦੀ ਵੰਡ",
  "Total Weight": "ਕੁੱਲ ਵਜ਼ਨ",
  "Reset Demo Data": "ਡੈਮੋ ਡਾਟਾ ਰੀਸੈਟ ਕਰੋ",
  "Performance Analytics": "ਪ੍ਰਦਰਸ਼ਨ ਵਿਸ਼ਲੇਸ਼ਣ",
  "New Collection Record": "ਨਵਾਂ ਸੰਗ੍ਰਹਿ ਰਿਕਾਰਡ",
  "Recent Activity": "ਹਾਲੀਆ ਗਤੀਵਿਧੀ",
  "Total Users": "ਕੁੱਲ ਵਰਤੋਂਕਾਰ",
  "CCCs Generated": "ਕਾਰਬਨ ਘਟਾਇਆ",
  "Total Value": "ਕੁੱਲ ਮੁੱਲ",
  "Register New Farmer": "ਨਵੇਂ ਕਿਸਾਨ ਨੂੰ ਰਜਿਸਟਰ ਕਰੋ",
  "Full Name": "ਪੂਰਾ ਨਾਂਮ",
  "Land Area (Acres)": "ਜ਼ਮੀਨੀ ਖੇਤਰ (ਏਕੜ)",
  "New Intake Record": "ਨਵਾਂ ਇਨਟੇਕ ਰਿਕਾਰਡ",
  "Get Current Location": "ਮੌਜੂਦਾ ਸਥਾਨ ਪ੍ਰਾਪਤ ਕਰੋ",
  "Crop Type": "ਫਸਲ ਦੀ ਕਿਸਮ",
  "New Processing Record": "ਨਵਾਂ ਪ੍ਰੋਸੈਸਿੰਗ ਰਿਕਾਰਡ",
  "Longitude": "ਲੰਬਕਾਰ",
  "Farm Location": "ਫਾਰਮ ਟਿਕਾਣਾ",
  "Mobile Number": "ਮੋਬਾਇਲ ਨੰਬਰ",
  "Latitude": "ਵਿਥਕਾਰ",
  "Registering...": "ਰਜਿਸਟਰ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
  "All": "ਸਾਰੇ",
  "In Transit": "ਢੁਆਈ ਵਿੱਚ",
  "Processed": "ਪ੍ਰਕਿਰਿਆ ਕੀਤੀ ਗਈ",
  "Transaction Ledger": "ਟ੍ਰਾਂਜੈਕਸ਼ਨ ਲੇਜ਼ਰ",
  "Operations Management": "ਓਪਰੇਸ਼ਨ ਪ੍ਰਬੰਧਨ",
  "Pending Pickup": "ਲੰਬਿਤ ਪਿਕਅੱਪ",
  "Register Farmer": "ਕਿਸਾਨ ਰਜਿਸਟਰ ਕਰੋ",
  "Account Settings": "ਖਾਤਾ ਯੋਜਨਾ",
  "Foundational Doctrine": "ਬੁਨਿਆਦੀ ਸਿਧਾਂਤ",
  "Waste Type": "ਰਹਿੰਦ-ਖੂੰਹਦ ਦੀ ਕਿਸਮ",
  "Total Sovereign Value": "ਕੁੱਲ ਪ੍ਰਭੂਸੱਤਾ ਮੁੱਲ",
  "Base Value (Recycler)": "ਮੂਲ ਮੁੱਲ (ਰੀਸਾਈਕਲਰ)",
  "CCC Value": "ਕਾਰਬਨ ਕ੍ਰੈਡਿਟ ਮੁੱਲ",
  "Estimated Value Breakdown": "ਅਨੁਮਾਨਿਤ ਮੁੱਲ ਵਿਘਨ",
  "Verification Image": "ਪੁਸ਼ਟੀਕਰਨ ਚਿੱਤਰ",
  "Weight (kg)": "ਭਾਰ (ਕਿਲੋ)",
  "Confirm Intake & Mint Value": "ਦਾਖਲੇ ਅਤੇ ਪੁਦੀਨੇ ਦੇ ਮੁੱਲ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
  "Location Confirmation (Google Maps)": "ਟਿਕਾਣਾ ਪੁਸ਼ਟੀ (Google ਨਕਸ਼ੇ)",
  "Processing...": "ਪ੍ਰਕਿਰਿਆ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
  "Features": "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
  "Convert Every Kilogram of Waste into": "ਹਰ ਕਿਲੋਗ੍ਰਾਮ ਕੂੜੇ ਨੂੰ ਵਿੱਚ ਬਦਲੋ",
  "Global Circular Value": "ਗਲੋਬਲ ਸਰਕੂਲਰ ਮੁੱਲ",
  "Sovereign-Grade Circular Economy Engine": "ਸਾਵਰੇਨ-ਗ੍ਰੇਡ ਸਰਕੂਲਰ ਆਰਥਿਕ ਇੰਜਣ",
  "How it Works": "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
  "RupayKg is the circular economy operating system empowering communities to monetize agricultural, municipal, and industrial waste through a multi-rail value engine.": "RupayKg ਇੱਕ ਸਰਕੂਲਰ ਅਰਥਵਿਵਸਥਾ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਹੈ ਜੋ ਭਾਈਚਾਰਿਆਂ ਨੂੰ ਇੱਕ ਬਹੁ-ਰੇਲ ਮੁੱਲ ਇੰਜਣ ਦੁਆਰਾ ਖੇਤੀਬਾੜੀ, ਮਿਉਂਸਪਲ ਅਤੇ ਉਦਯੋਗਿਕ ਰਹਿੰਦ-ਖੂੰਹਦ ਦਾ ਮੁਦਰੀਕਰਨ ਕਰਨ ਲਈ ਸ਼ਕਤੀ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।",
  "Access the OS": "OS ਤੱਕ ਪਹੁੰਚ ਕਰੋ",
  "Launch OS": "OS ਲਾਂਚ ਕਰੋ",
  "Ecosystem Roles": "ਈਕੋਸਿਸਟਮ ਰੋਲ",
  "Intake": "ਦਾਖਲਾ",
  "Live Stream": "ਲਾਈਵ ਸਟ੍ਰੀਮ",
  "Read Whitepaper": "ਵ੍ਹਾਈਟ ਪੇਪਰ ਪੜ੍ਹੋ",
  "AI-Verified Intake": "AI-ਪ੍ਰਮਾਣਿਤ ਦਾਖਲੇ",
  "Directly disburse funds to citizen wallets, transforming environmental liabilities into localized economic growth.": "ਨਾਗਰਿਕ ਬਟੂਏ ਨੂੰ ਸਿੱਧੇ ਤੌਰ 'ਤੇ ਫੰਡ ਵੰਡੋ, ਵਾਤਾਵਰਣ ਦੀਆਂ ਦੇਣਦਾਰੀਆਂ ਨੂੰ ਸਥਾਨਕ ਆਰਥਿਕ ਵਿਕਾਸ ਵਿੱਚ ਬਦਲੋ।",
  "Rural Wealth Creation": "ਪੇਂਡੂ ਦੌਲਤ ਸਿx���[O\ٝ7|�~���HppO��ߌ�y�w[��Tm�^�I�0�F�D6����uhz�<�C5v��,EF�O��I��?��^��pf��c�j�����\g�����Y��Y��ߌ�?���\c���f���u��&�m��պ�A���f�],�ټ�Zk��qsenv�����Jִ_�2n�V�\��5���옅�m�y{��o4��v�l�3�(��NǬ��Z����ɿ�d�欿q�?1g����6���������_�Ͼ[��wp�ݗgv��}aw��S�����K�l�����#��jG���a��~��e���������|��>~���/����~�o����_�쬿��_���?������c��S\�A���wس�����)����=:������/_��yݲ�՘���m>�3��Zl�r��CsǾiB���q�� 8�g͉nc97�N77ݥv�[\Z�uMVk�ԺK����d��\4w��M�/;�;���n�]��L���ӱ۵c�x���n�&t�� 7���â}�L/�Xr���p�X,=�S8��M�b���o�шS����n^7�2�Z�m- L^��J>n�ť.�b^4�Y����y�4��{�l�i�)�@��	K���Գnf�n��ntW����,Oq���n|}��:�a?�#�_S���r$C�>
��{����5~�wO����=y��cG�Er�/��,6i�" &�`�pt�8���W/�_p�4����K� ,�����>��-����{��P1��-ز���G��BR�qIO���_|����|ў(=�����B<w�{�����4��}�W܌/Dpl���kj]�Ţ�w�M0�#�n�q�Ǵ!_����W�n�1��X+�ͼ�d�r��E
��H����-�PGtL,�W��?Y��w��e�J�^d���VT7Z��2k+L�V�$�d��O_#9��jq���>��ئ_���G�H��#�kπ,��h�Q��#�����7�a���B[S��g���Mc%oZ�H���}1o�m��n�z�me`���љw�V�+ߣ���::�����vbC�u¯�o�))���Vf���!ٶ�r�Ę���J�+�BVk4-��^�����n	ϓ2�%o�B�d��`)�¸��q�y �p�vp�ͮR�ۋ�����P��N�'K�d�=�D���~�[̨W�����բ�6+�ݬFu^�Ѷ|�Y@S+ZŲ���� ت'��k�|���b|��zE߼�oN���Z����l$�+{$;ߗ3��#�� �����V�B>�
+"�f�ת7Z���.��7�V�\����b�-�f�ՙ��v���ι8�H���%��@����H��˘ �6�.�۸GJ����P��/�@=���x��>b⎩�D�-�@��h�^D	�`G)����#����#�&i����D摀��$<U����ZVH�0�V�^�tZ�J6tѡ�2>��&e��"+��a	h�9cc��Ko����˽"j�ʿz�Rt�T��Z�nٳn�(�!<P��g�z1	B�$i-�t���9u5s>Bw���+����6�ŗ�4��f��W`{�AS��;�ib��R&�:1`��>����/�����X$�0�-���
�1~����/�"ab����U(O�Ɓ�:E�aQ?M�m��V���8��h�:�n�v,f?fC�
ݲBN����y�[w{Jj���n3�o���bB�$��n��β����2j�#\����9q�P	�-�l_hUhY�b�>SB��$�itIJ�����޳Z`��m7�6���F�
���5���m�aZ;���`���ٽ�{LZ�8.®)S��Ăj�5d��aJ+���M~�9B.q�w���oO�A�]���VמM�� �� r#��ʉ��wP~9*���z�.���SKD,* c����|"�'�x��. �+�Ʋ�"t*�$�Jy��o|?�%�[T�N�Y���hu�MS͢
���~ ���S,�f�|֭-���[��8~K����=G�9����_#poYh%�ܪ����_!�*��nġ[��Vy�^Z���߷A��u�
�$I���KU����8��z�V+z�D�k���b��
�}�n���Uy	� �8�	�%5�W�f/����r͚X����2�ʌ�ył����K>w�t�D���^�Z�u�����)��R"�~,�|��CqV�A�Y}�i!��&DJ�Dz�(~d���:���*؃^&��/�7KE+7�{��r4o����D���W�����|�0��7ԫ����R�0���j���gr�b5�%f&���p7����Y�[QO�bs+[�g��t|i'��� ��J3ի[`9VI�cg���X�� ����pK���,ˬN�Im�{t��M;`�V�
����ɻ���>�{8!�������s��}5�,�>|[Ɖ�����woq��ܶ�5Go���K���gS|�O�1a��e��Oܭ��Ы �o��G�n�<�n[������r�hSlŤ�#r�-�ȸ� �\���*q�|����L��n�'�6�����=��>����׳�2��z+ T�̘>�X[7�"��G
S0b�u8�b��l�2kZ��Ȣ �ZΞo��� <ؽE��'f�z��W�+�2�}��G�x<�Ѿ"ZxA�������Kf��kvKr��u��E�*���Ҷ
o��e���X]w�ڗ���Z��>��� .a��JcN���ׂ(�|��3�9�W���ppz��(��$��`��/ �Xek:p	dL��F羙�BG�`,���!�6��#�q,_}aK/���+5K��������#�a��L<�va��]��O�4�F��Q�O&rE�Swn��%N%۱�E��w.���3wd��3�{տ��wh>�o�Ô	&k���9���i�X�[e�68�H$2����,K�L���"�k.gMx��'/�K:�X��/��&�� 0Fc�\�#�gW"^#Fѫ	bx����r�8w��^֣K��P:�ʕ��*j��Z����VF\Eu��7�y�L���*�����n'��C!�w�<����u�n��C�d�O�j�@��vU�Fη���H�SڈA�
)V7/ HM��ܶ��5}���l�ҳ���ޕ�pO�b3Oq�a��.��3w:���"Zmo&�X�T+��F���@�ݗ8���D�y���CO����������e��k �Bb��� }abAv�f��X�V��X#aBҁ��Г�����3Z��͘%��"KNf�U�zx�*�����ѭ���(9�b��u���B<x�|���Nv+=���E��#�r��( �L�������o�O5r�":e��"B� �J� ��wW��Y��U����zV�4��;^\�'�h�v��U���>࿷�L�|�|���<���s �(���oH�Ӻ� ��.�V�v�9yj���G����	�8���T���W,8���p���s�7�ƃ��;-������!�-����P�v:'�]D=�9�9�kw�@�8���Sf(�Q5sm�b�Fު���:�a`����� ��7;@#�8���^Y�ʻKY�J��i���05q#��y+�D��k��\� �i�4�M�������s2��Q�󝧮NvH�xp��C�ɹ{��[d�U39]҆Ϟmv��e���ԃEC�����~���v�m�5���e��
giY��4Ϛ�%��^e����ޫ
�����}��W�5Rʨ$Ҭd%߉s���>�q_I�?77 ���t�v쎩eMS`��dD���%��r9���A�2�����5���e�s�SN���>W�a���PZa���B'��}%���bN�AY�=���9�Μ�aD?b��N�WD����J�y�$r(|,�V#)vS�hvl�l~@P��-�ۅY`e��43��k�T�[�_:��3���PXhå��h��t

�X�^:�LE�$��.����'*E�;~򁷆y�v}���. �!@o���Zf!�Z���T}��D�I�d"V�׉�G�	��_�ȉ* ���|ח@ x!�'�1�+�c)�Kb@��	�f�߹'�ńA�@��tL��J?!��>��):;���+�}�rH!�s��0���1�Xn�6-.�"��q%VM�ES��E�/?�6$݁��P�ZeQPu�	�'9��~�E�����+落��Y�'<��+G-����<t��@̑ቤ��=%5bb�b�n�����>��O`l��x�{(��c`^Ooҳ�I�=��w=�y��L�lw�w��
2?��<�%���H��r��/{J	;���Z����H�g��Y2����e	u������sR��uEg
~���P�Y/����\	P�+<wk�ddB�W�m�E'��A�N
NۡSaW�.����1��pI��8�^����"�|!�x��G������C��H�>�?X'A,�V�Jxr�%Ӗɞ�}_�%��5ޟq��wOa v#[�HLh���	��%[�٬%zm�{��*{k�s"S8�KCIA�W��(0*&��y'��2�/��;�O~�Z�VN晛4�.lC�n�b`�Rx�O��E�n�9g�h�kI>��g�i�S�P��+����\)�n������Ej{ar��&9�o��٩Ϯ����f�r�$N�����ks�s�.(YPB֘�,��5~���3�l�=c?g��LL�-.d����}���L���7������^B���,Y{d�VcOr'���u�ƕ�6�:����n�^v �����z������=�쳺͘�^�gt:��B�
4c���\�0�3�~�b��\Dy��	L{cf�\�V��vn�[�J��I�*�^x�Y����x����O$syWA���s|mQ��j)����/��_ja��@S��w�}��y�A���퀏�P�oh�m���8x3��rD�ZaU�� {OΛ���CB�.HT���}A����nu���Z�vu2���A$���L�M2�	��6I*Qr��%*�D�u��U��{O/9����_�r�*R�?�:v}�l6�W��ݻ��y���S��Hr&�� E}BL1z"�1if�9P���.g����J�<$�Z,8�&M��?�9��;��ZOdO��g8kwc6�M���EΞ8A0���^�w��t$�̯Z]n?e�>Y�N4�|_	��`����SO�6����9��,Ti1��6�a;�Xx�!��1wZM�2�R�C�"�K}�@5����;=�]�Y�����ZBxԥ����Jԍ���%�$���f�w})B��Ј�mM�=���丙����qso)�\,q��lX0P�(M���6��%,�mHQ��������l%�5��	�F`��cwz]��p�ˋ4����5W��z١Z��53���ފ�%al����SӭZ���Lv8��H.�cUNς�$��)m!9�Nx�ƕ�R�pn��y�a��z��[(�u�r�}kہ���*lo��E�SXQ�ݺ�\D�n��Y���K0�͘ɫ�.Q1NI$��}g�� �?���җ���Tz������`���\O�j�f@��Zq�N'��4��g\f3=},I�(��cZrc9�t��h݇B��<H��B0;y�f���.�Zp���@�tL��Y|�aF⑈�����0s}R�z~�g�¾��g#>97�X����<�9I!z�r0(��ȶ�\�c/����j:[UW_�d<��13���2��cD���(3XbP�x���G>�;�oy!��E)��M��*a����7~u�]6�1V��� 0m��Tѱ�� ��,��f�T�!J�2�2~���|����W�k��1{1I&p�F�:���y�6�܁i�?D�uz���$�L����F��b�F�SȆ�" /��7"Y�Mҭ<"�����u!
�R�(,9����H�+c�S�Y�.��g7S|;s�v��>l���E��oZ� ~<t�K���[<���P���S^]s��.ؗGvC�n_J�����ݮ��p ��G�+)J"V�-�xz,j�bf(e?�k���K��i��ݶ<\�j J��d�'z�`�ފ��;&L���\�ߚ{^2m9������*D�5%��盍Β%}�YA~�E@����Xl`�UTj�y���"�eC�nd���e�?:Tjp;!�e�"�f�%���/g��9�j�d*]�^���n/�ɒZ ����]?��	�ZC4��D�R\vl$�5�R�hr�.�O?3��|�u�Q�H|ORdEZ��]/�~�J���E���S�(>:)%��Z�2�!�AӖm��J�r��Sa�42W��V/lD��Ta>;�}�
�E��=&sm�^)�	�C�,3�
�aX��7���hI�����5���jX�����Lwa��eQ�B;�-X�H�g�b����G:�Q����d�G�����l9�b��y��.A47�b��4��z�2[�5�r�巳p�����J68��)5u$is Q���KK�)�vC{�x�j�b+� xi�v#��tTJ�z,{4Ex�<�s,�M����Gr�,�Yz[�dx"�5��6�m�u���9}�x��y*(,F�h�l�ba�Ŵ˖F�m�c�Y��-).f+`D9� \c�~e�%����Ģ�d�Gbd|dĚȚ�(u�G;ղte�ǹ�0��k*�����о��Gԯ��L}�^T���+y�O=�r ��v�P���!WI�f�/r$�2��bC���7<��p��Q�Tp�Z����;`�t�P6�O#� Z'�d[j�+��r��Ka�w���ZAj?֣ &ĿW��x"�+���5D����(q�H�S�ڒ�1d�Ά�ŁQ`V��O")�i[Zo��>.O�E�]�e'/�iՏ�Eks��F�T0�r��\L�W��RX�&nA����N���a�'���4��V�s����ba�ֳvt}5�,;��bL�G^��Sl&qׁ���^��Q�Zlv��x�����DҹO��:4���B�;�H�b�P���̈́D0wȡAr��o"�$	���^�'�(�2��N��9��Gn�=;\�/X�hZ�:߱��e�'��i��F�q���S����I��^�;���l.u#(?�VRPW7�����n�G�s�]*�u�ku`,'�;��hlVd�1��� /��!é���m��T��b]��`?�!��^@��z�<ҷݤ 6���5�'��� Sä�m�|%#p��j����6����A���]��Wg8^N�,nɨ�ص5�J?��c��I����?����h}'�q�s�7���h�[����N�R�� $�J��0z6v*�r���@�t����(��2�&Gn%�;��d��8����Xi�nJ�?��n����)�����XM�� (�;mX���z���ذ`(��MjىN	w�Q_�j���T�0�Ssj�N�����R���!��^4�LK�0�E,��Y;S���KE��VIJ�A����Ҳ�	���� ��fW�N����. gvY��烴�	I�s�E�1�@�5dO?�;��qa��t�]|([�Q}��	�<�ѡ_�_�	bC�+y�#��^���V���7%��nM��|-a�×��4kZ���c)�ff���ϧ�3�����cV���z@�]o��r)#�!�� OXt�]"�o���HQ�7��̴�$}��ip���FL?�&0wu����z��4s5�;�]i�h/���dƲ&�L�}�f}Ԓ�z���_0Upʌ�3NL��<�O����݇����s��m���0 yA�"�L���D~[�z�b���[C��=~��¾[W^{���䉇쾄�(�/PW���.�scRx4�K��"*���'D��E� H$�菌<�-sf2 @K����/k�Oi�ii�,�<�ɉ�����P�C��M��)�q˗����v�_�C��t�v��2i.��;f�B��̐��
�8|c�1$�`�G &�O؎~ ��4�E<��U��@�����I�<��.W��S���Ql�1� EG4�����<H^���A�.�'#� [��BHO��> 1���'�0A�vORV��'p>'�(�/*�� �i-h
]otV�N֔�����W�[��<��#��������9FHxR
�4?8�����E���n#9ҁ�@�v�xB�)H�t�ݲ�,���}ގI��&T_���M���v�������;�͝�����n_ſ�n�����]����5����Tz���2���xo�b����������4�\�b���<���'˓�^N_@\ �
b�����̽%�kX��΁�9(G�ݕ�CǿC�MG�sc/����>���i����ϧ��?K�(3'���(CŦ��x�Ⱦ���8Q��$̗�H���5�x���tcd��T���(�K8�88�Z��bMtqOG�H�?J�T���a-/NE��v6�a���	�Yǒ2�_BNpX m���{m�m� z�K��_�]���a�>�E蜡]������� [�oMP����	j';U��K�_�ytǐ�a%�U�/H�,gS�i`��@EA�W���5?d��b.���6��WE�i֔#�)!k����>�����F��6�޷t餉Lʫ�����$XK'ũV��"н�cY~��0&��VG����~�-�U;l���^^q�*j�9H�� WQ��?� 8䉺�Xܱw�+�w�'�#���v�z�<�_y�O�W�R�~�*��/��M���A�n��'��T.���N.��@��:�)�ة�1����$��͝8\�I��F��Ĭ[�<pB�=�B�.��^�@.�Kz��ɨۻ%A�h6��wN9��ӄp�ғĻ=iM�h ����|C��m	-Äs���i��y��mMK#�\%|zDPT����Bk���ܗA��T9לBNe0���}����IV��P��Cٱ���;��ω+�	:�\���b���\*�A���Y<gxبS��u�\�p�Dwˍ{y�F+��MUH��~��8.-u0w���h�;'�z{*�R�Q�?c/�����X�2(x:�">xLj�d�ܹ$�΄�4,q��΅�cj�M �M�ş��x&�
�:�(hk�!2n��N��ysa7�u9�6������{6����#����G<��:wī�p���P���'1��/H�����u,wڍ�:���z��I����+�#S����f2O ��01`4�Npa�؎���;��JY���p�	�ǈD���������●eK¶H9�l����&�����#�ѵ9E<U
��b|QJ�7ͼ��v�L�K�CΌd�:�<ѩ"��J�˶���'���
��G~~��pu@Jv�~dvV��WUM��-�N�U�J��RЦSN��	�YT��sY;��G�dU�Ҁ�E�)�����3�4����24���}sY�����}8�;9���l�.i�������/NM*���=����N����R�X�(u��lo�l����3�;;�&���)�ZV��X�7{8����#�î�������7a�<��g{}���M�J3�����8��E}J����|���{�W$���l���=����3f�K���/g�q ���?�v������g{��ڀ݀����ZH����c�	�Q�e�߷������/�⍿��{��S�y�IG+��%ݎu�궝��X�ޠ��	���{��+�2\�kQ�lֺ�Gv�?~��<%�18w|�L��{�X�A#��Z��S!�| v�1Of�=����Ym�!���.������}���Ss�UQ�ξ��2A�X��均H�00}X���{=8��g�Oi8iд�x�E�4�F�(�D��y���?�6�q���3\��b��b�yS_G2�?��^�;G�H��P%��t}���K�����!�	w*{�5�Z�So]LȦp�p"R��%aGoO�@d x��აLx�1(�_�]�ނ`?y�����y�A�I�h����5����a���@���7�V�[x+���m��;&"����Ous��x��U��ԾXb[e�ݭ/����s7�=NV\��z�����T,�YL�䝮���[(�� ¶�g���s_��̗�Lq.1��G\�{�A��LHJ?�m�N��ȐpEQ�K{c|^�OY����y&o���-��C����At�).H���+�(�)��?4^�=��]��IƳ�݇~�%��V�8�x[���&��@���|�_�r�B%Ҟ�3�+r�X���U��O��5�Hlm,呅Y,mư���ɔ�1U¼�a�%�U9���u^�cOz|���Ȓ�g�im�?����yD�[}|��M���UNw�&=�Y=ˢ��Ms�;�op���|o��p��gflʵ��������]���#x�\d�ص��<�@�G�:�Ł�}M���q����ޝ�(DG���V2��D��.V����'�NG�v��-0v��7/&�.�jN�M��3�d�J��n���.����A�L�_q�Jڕ��p�Z;�soa#U�����f^_��>�5��?�|��y�kN[l��hSX���&�i�!Wet�����X��'1�s�iz/bl"�?���s>n�k�sSep����� �΂?@4��P�a����`c�N������i,P�/EC��n�����{�)i9��'d=2N�T%c���e�O��
_Yx����##vN_��PeG�S�d��լp���$ԛ�#_���%3v�O���&΁��-O�^�Iռ��؍� '֭lEdp,$uH8|^�-o�����z�YL��IRD���¸_/*:��y䄼F�P$?	3|�毚J�����jI���@����-����C6�I^;*�P<M$!\��1)�Lܠ��ݫ�����_���Y�0�	G�߸/�Sp���rP�qgה�7��h���z͹�����T 94�F|��|���OQ_�~�׉�{V�tm��D���oqǴT%�M$�c��=�+�i�c[���ݥ��|y�xH�X5��4r�tx�h�p_�7˒�E\�V��׮��]b�2֛��#��zN)	}��6bi>���>.I��Q�Fl�
b��Ss:N��������@R��a0� aƄl�OU9�Q����)s{��xjB|KO�qV�GAͻ,��v���&yKQ~�AEW%c(����q���T�'T5�IY�p�K{����,!s�X�8:��F�mW5��j����Ǣϋ��G�^���QM��O����IK�>ҒQl����T����\�FO+q>YAV�k���J�"��G���*>�Wd�O$&���F�Z�� ���3п8��w�>Ğߝqrσ�Z���5�!�y��5�+Y�4jf｛Tc݂Lc��amG��R�8@����w|������SE�6n�
�])��v�Wn�������2��v*�F�����<
�Z<vgZ ���rS�nA �oW��8$�-���r�f$��f�y�j�4�r�R5oG�:5��ˇ�6�Ŷ��FE���]Jc`�	��?�N%�9�i����8D�9�"��8�5�ݑ�W"�4م�yp�18���K�����un��p�?���aHKU��6��3e�8���N���s��L���g�&H�	�n�P�CWjn� D�<�c��9�X�8�v���q�����ݯGi�`x�vĚc��&$h�u�&.�O�y���{���^�V^�:Vf濅b�.㘅v��)���5�2�1����� ���I9�������u�ʝ�,n�-o�hF2���T�6�3೷��?R��Iis.;y��?Ge���=��b+�^���^���C&>᠅�J]�7P�\G�ݬRG�1�#�M�ϡ�i6}��zs�B�k0�*��Z����K�I���?S�%����^q���H�$�&�����+7��f!�1
p4��oK�����`:)�?8���a@.'H����%��P�"rmyBX��n�b��⪠%	�(3(f	�p�������U!K>ӱb�	V�Jc%��H�жs	5eQd�t��w�p�0�y�A{fs�jH4R��� Ϋ/Y�!��,u౗+��s �r�|���?�x+_/<Um�BW��,� ��X�,iSF��,�'*X�� �U������x�ҫ�,���<6ZI���z:�ke�Bz�a{�9TT�|K<q�,���q��,�4K~7Q�)]�+{��3:@/�Z���;��dR)�6M�?8U,1��k��"�@�VF�����[��|e�0;`I��c[��d���(�?��c֏�� J�����	l���7�.�EC8����(r���Ց��v����!�}�rpE$�U��oS?�T����`���-u�����d��:�����,x| �OFYE��̩�m:� g�Ї� :N����bRy�VD"��.����q�I:&��1	%��Nlq~��2�������:7�W�2� ��;���X��.�5[$��p�67Ɛp��@h�~�*jx�:�ѳ ��I'�%��(��Y,��z>�֖D��y%��<_�5,�`S�1ɍ8r�0�DFt5�b�j&�!k��έ����w�b�xF��̑�P���C�d���r.��VH&�N��۸nA%���+t-Ag�nDc�h��[h@��o}��+
O�z��[)���S#	YR-�b�r)�.��N-�
��y�#1e^���!Y���эsf�
Ԋ�:�V��+:g��
��e���˘b౉=Bg:(e?^q9D%+1�.I����lg����
�>C!�ؚt�\��+��O�T������E�H��")#��8��ɡ�jΛ�j������S]`>��0�</�q�H<R]��P�$�2��&�N���^�Z"��d�����C�l�L�>�i���/�<[�\�E�t�c8�en�"� ��"��y��)S�@2�P�L0�L!� �����]�#��l�1������~�3�f�^��̈�A�4>�a�A�l<&�8]qE��87כ��
��Yw9[ѕ��󅉑��ɷ�䭙��y���l�:��n������!�$��8������2(� ��4�,��a
����Q������ia(#7L<���*Eɦ�{�㶺��Bx����3D�,(�+}v�j���
s�X^�z����K89���9��!L�Y��i���.D��yV��;F���lcT��ճT�2'w�F�&�N1�S�ܩf�Q�_����+���rZ���~�\R���#�IC���ԏ\��ܷ-�q�B���&��P���g�%Y��'% ��㖳�vR"�j�c����u�8D����`
�6��1�\��-�U��*s�|A�M����*�@�ـ)�M� ���4O�ӂ@�!^�������H7�.x�����p�S)'�� ��X���L�L��ތ4A�X�I�t��.�8o�B�ANꅢ讴����g����*O}��0���*�^Y�+c�����K=��%����+�-�1���]%�%$k�_�ޑ6��&T�T�_ ���I��ң(�n���;����p�S㣓Oҗ�miN���2��m�-ɛ�C�;�ڒ%�'��0��a�i"`ǚ�Vbg|	�P@���1��$(��AH�Z�c�t Y�r�׮W�NI�~M�K�C.sJOe��p��D(J�2� BW��Te�q����M�ľda�Z��	/���͠�5�G<h�!�ߚ��16b^��'\���N��(G���U��䴇��)���?��FI�K�Y�3�r¿��J%1X�s4-@4�t��̓�b?MOuW�}N�;σAΌaEE}���@��=�_����t4���۠���h�p�H��	K�`��
оh���qbPP�Ez�g�?��D�q"�h*�$X��/�8z俞�nƤ/N|����2W:`V/�6���Y�h�d�nKk?�!	+��#��D�А�d�f]#�q� �K�)�}��e�}5���)����Ib�\@ � �R�4�I����vֳ��-�j�[r�;خAI%Pf��`=}"��%�ୄ����c׭`:�/����z�R�ܐ8��L�Ǣ]�#G��K�L]\D����;N�0�R+�
�`�Q�;<d�v�����e��uէ�:�S/ׂ�������|O��qs�A���^�(`z���}��EF�s�br���s�f��>4�~�k<ȚJl[��'\nʬ�Г\[5�V����k:���G��7������`��g�NJ]�qҺIFH���z�(���iUA8ϕv�0,��l���.6,q���R��1�q<;v��2�{	�d!cM���*o��~�>P@�*��E%��s���E�/�I����*�s���Lr�x�E����(�G�2*���e�a˰�Z�������K�~��H)�}ϧ�5_V^3��߶F�ǋ7�w��AI���r\�PY42H�%x?�� *M��]{2CR�$e$�5���+J��aF�~Qop��»�p�$!6�Ԑ7j�ч� 	D��h؏H���'_��<_6�J�0Jj�d��:$
Nb+	�����WE�G�-���U- %��bL �2L���IP	j~Ҝ끟�ۄ\u!�����Eռg��ؚ�No�lz���C�ZI6K3w�9�t8��p5������A텪�1�
��L_u�'8ۗ���s�%�!��h��R���riѭ���ԗYs�Р�P�J�Y�ZdV���<5���f�������_������A�=<gQQ����gI0_	�=;`@�u�v��������+4?��I*(�z@�抅��q]kЋ��j�HK� $:C�u������'�|BCsƩ���ּ�$Fٍs��LF�$^��nН��HQ����[��dM�T�DULUɑ\��y��"�J[���
�8�'i�y���]�Sn42M���*�( ���u�	�}�W�][
�Խ����^g��t�h�vVsd� +{x�P$=���!�ykȀ�\���Mz���31���j\6�3%�jp0ޕkp`�m	N/~����%�$���������8�R࿓/�O��`�|�����Yi���q���
�_ߙ_|���r��u�n�L�"{>�l���ۑ��o]���L�$r�4���T&�A�"	���1�N}v�Lݼ6{&��I����ks�s���@�*�j�]DJ-*@}A �(J<���MF �J�2N|�3�b�U��=�d�B����;�^w9�]��`Aa'+��>L	��ǵ^r�U3�Φ�0��
�=W��D����o+Ä�]R�g3S�������U�o7���L�� #�j��`�='ohS�79z�_�-��.�1H\�13g�d+�
�.���L�e1�֓4k�J���V���+�8q́��Q�YZ)4��vD �������'��qN�0c�� P�8J� i'����R�:�U�gr�r_B��w�,�M�嶍�b][�X�s��E���ō���'p&Ln���1��q�c�\S���4��@R%�HIBr�*�a?�WE�y��
�Sy A_�RT������f�횎�יy����#��6L������͉�I��If��m�u̝VSۓ�����D��F��_gZh��^�s�ѱN2,=�х��'�������L�!Md?H��������qSdz(�\�73Y��:n�-���A5=T P�7��xD���8���k��a�]ҖĮ�o��j��C/���՟��"��~)nzC�5�y?	|��3Y̻Fhy��4s�j��|�=�R/(�naZq8����f0^AR�����9�<�]3����Ml�����<���+l�Ǆ\�̜l%�i�gg�+@=���gxUe�6E�37��^	��6��%���[�u��D]�������B/�[\������=�3�w8=@�	�T��H&%M�,��?�åӈg*�Ȣz���iwF�x��!�3���M"�A�P��ҭ^RB��
=���nX�* �ĭ�aOC���Hƹ�)��gm��ek:�O��sϙr�5l��GR��^s���,4�]U�ڵB@.���Xk�bH�P���H�Z����K�/��m}/Q��h��1n�q�"@�FKfw�i�6����l,�n��4�#�0�1
�>�0�C?jB���=߅�P�bM���;��D�T�I;W.bI/�.e���]���k�K���OQL���^]�Yu$�����3���}���41���j��Aʵc�]���5��	N"�����r�y��6}^�QҰ�f��M'f�e,d)7�e�I�eK���Ѳ�
W�s���ȦZ&o��1�h|W"�&���F��D�y��4��@��M��,P�����!��V���]s�J�=�E�GPX��O��I�ଉ�'}L�L��J�h�Q��bɆ|_n:�2j	a�}��^�!vW�*m�%;:���%C������kf�km&鈊��n���$c��:5]1��lk����tw�Ѻ���_x	�>��������U�T��C�X���9�L3[�_.h!x���:Ի�练4j+�����.�q��i�1|?賳��)�cg�v�������L�:(bS�6g�W\L�'>�^�uD�/��O��h�4o6k�lٟ��v-k�/���
 � �*�\�	v:�`c���a+���^��?�"9TYI����3�>���G"\4�q͐d�T��Je��s��o�A@Xz�Wx�p�W�Kd �Np��D��[�=�G��v{u�Z���Z��3V�� ���kR��nCK�D�$�n�5W�g�/�Nn��Q�d8�rhT�3�N�I�*ݗ��\Ѷ@����+�C�ǎ��>�U��oz�yj�t�����ݤ���[Ay�a�{�|g�7�[�
^�g</F�	/ ��V� ��kMX���ڗ���i�OY�^�܏ȥ��'�i��Y��vl�ۛ�H�U{��b�����h	�ރc�����A"uq�B��=+,j.�%ʰ�{*n>�2/D��)�g�7Z�X�<�[��5H���-Z���D~i`�
�K%��g˽�v
A���vpdMw� S'�$r�·2�����y��C���?вb��F�RԊV�k��n�hW���7�(�����Ҷ2��{B;¾IԒnX�\ܓ8a83h����I|�/��=��˙ԏ����w�?&6K��
��m�S{�r;��W/�|f�������ޞ���q��y��sHם����u�9�Xބ�y�'���I���]�!u��C����tZ�Elu{(�l@�?��|��_J��h6����߰"'����<[07ݮ˛�� 2�ELr"	>��K��П��������Aᐗ}�W��>"�Fs }�q���?��X��e5{���PM^H��
43�9Z\����m��=V/�M���r	X����;1��S9=l暽:2�/R̄��`�>Q���c��T��ڊ�_�Q�ޑ�c$���h�}֝:�xF�(dq7�M��MĎ�����P]kJ6-%X\�$cȠo<$ wR� kf�~L�~�"sx��Rc�	� �x2�C���e�@A�f��>Q�!!��4��ly�(|�{+�5L�̀�|;����d%������;�z�u���J^��'�nf���D.�����CM���o�����X�N����W�Ec���^@��Qo)�/,�g�K���PL�ʭ���n���0x�^��옂���������1"�V�bf!`�=̽��1����捋�D�%�-�Z�Q�:J**�t�����_{�^<	ɛ��z���_o$���~����![�ļޫ�C���N��Ճ�XkCz�,"vͼ�k�n|=�NZN��Biǻy���~j�JcsE�H'<Ի��]VW:�e�>P
g-aJ<-�f��U}8v��g.!���F[L�J�j���9��ӫ3�0�҂�ܫ�崔���#8��pƸ�h._�ז]�I����Q��Ԑ.b3f��ب�=�uH�T۝�I�� �t��+����j��.�67�Ut;�|�ح�3��(C)Q93N��6
��p����F�̕����#e��%�\)V P�k��`����ya�~��y��tl���,B�&s��<��CX3�ӹx�a���߇}���{���M�8RZ�}[W�1���;H����e��+�;qjf�/�|N=a��Hh�������t�x3[�+��nj��}��֋�?�T���n�Q^(Ӄ�n�H(h����z��[���gx9���z�Jr�#�	�߾���m�`��)�in�����1��<� ÑcA,�hOClX�Es5����s�V���׳��'W�J�0��N����`�`�������]�wf�2\��9f���C+���s@����q�{F�5C�S5+AK���?�����xqR�>�D,%��V�Lw����l�x6�z@%�]���![�nE�Rk�6&��/������@wcb�����|z��.��<_���w#l
�<3jO(�R�3̄���_T�H�G�����1v���d���"��Iާ�&���P�n���.��`T�����ȣ��p횙��hY�4ZV�h��	Zَ�i,�("L����RS�1��E &�Du(v�0E���C��Ɓ��)�Ӏ:}�}����R��r�D32#Nh�p�EE&ݸ(*�-ű�s�)6r��^l��Ι��'���-�*I? �Ɨ\���TD>_��G)����ߖV�s����ʕ�H��A�`�h9U�p�w�{ɹ������]��wɰ���4�rz�`�I���*��om��eX�����L���T��T��\"�,�f��u�.L�up�C=����l�[�F����� ��rW�%�B��;P�	)��т�!M�J7&�&�f��y�:!��Z���s�8�gۤ;��cj6�C����^��-�-�0-H/�L��^n��3 RR�ĆQ���e�=��"����Zb��O��?F���\�T�p�L!��4bGX�H��j^������<<�ЮBQ���qs���z��7Y��n�2nBk'����ʫ,+��O�W��3����� q;�NK�	ڐ 盍Β�<�S&���Uf��p��Mx,�U��*�3�!����������5h��0*�|�{n{R�����(�q�j~Y67���M�W	Xfk��d?L$瞦�s
�VZy�8�L�swT[��XH�������**�¾��o���,��T!��۸�����
�i_#�A5�RѬC���r҉�������1��<��ʓȲ�_���S�|Y�N��bK����2иz;�#wֵ!���Y8��ڈ�XF��������G���z�m����$���(R��z�5Oc�ff/��X�z4��l�#6U�s��-ĮAŐ�~@2{�'b���TkM��˳��k�� �.��bj��U0j$r굀��ja�ܶ�3_����D|=��6�nAA�u�����	���ʈ2��Z7��=8�c���pLV��������޹j9B߸<�\�k�J�^J��KK��I�x��C�p/{��h�2ȸ���+wp�+�UiR�]�'�)fxu��x�t�� ��X�h�&���Z��-��M��opM�b�ȕ���O���!.g|Jɏg^�%�O_�n����ң�R���F?�&�q#݊\;��-ݟ��dь�=�n���2rϙ6��t�4�n_�[�m�5n�B�����R��$48-V�4-��X����U��M�����@�����M'Yg3q��$*�:y����T653��)��4�&�e�(�`ẁ�Y��(�S(�fT��p�0U���+�7s�.� �T��8�A�ް�ĩ��q=�򚷬'��k4����������.I������s�^���+t�2�=���2����+ n����Zp72�"�.�
ˎg�㍧ p듚(]/r��5�V��B�n��\�B�Q�6er/�sjs97��`ӏs�n{u+��C�����!���:�\�=3����6�k�$2��C�N�s��ۄ� T,���&�/DcĒ���y�?|�,x��q=������K��\1�
n��ұ#q��V9�N� i�+���N:b;Q{���5��1sރ�%�Ŭe�{�&V�1�=�V]����#A��z����pd�W�s�7�����[B<)-�M�h��̪̮8�:�����l�������&�g|UԾ��q�ϣת䍒��g�@�{�'�J4� �����ٌ$ڜw(�V�v/'�p/�-�f0~_]Ǖk���G�̀������w@�ˣ�!�iW�ś��swP�K1��~�@}zڪ��'�y)����R�Ԯ���Z�4��=u��m,MT2&��E4=溫Mw�����"�E{%T`Da����b o@.�F&�2�]���H����g�4�L��=�2����N@��~qP����~���<�x(��I W;�$��	�8�%,��±d�nVZ!%�0�0�b���P"K�<A�-a}!G�)NLv��}�7�%>:s�2�A��cezAI邖����"�f*}B�G(=�'��Z ��+����ВK��w"kLW�EbIq��4�Udt]2c�����]�f=��4�����:���7���_J�O�K6tB8�F�u� �aĠ���N�6����(a���vZ��T�|H��K�ܼ�����ò[�j��3	k+uu�u����$�5������K����ǫv<��������k���^�v�������;�͝�����n_ſ�n�����]����5I.\wM��g�]a�����vF�c�XE{�٤�J�q�(�)/�Y�r��29u����-4����g���v����y�Z��d����e�zU�������t��Q	���'��~�tURU.Lq��J��{���N��¿��4I���KV�2��ͽ����O�����t���9%R�o�x�:�5/�Z��(��L�h-B�O��Rt���9���EZ�-�Y���GV�6���h=�Y���Ҵ�~����:!r�X�k�WN��KX0Z�~�;}�x��f��zD�����4{H@Ζ���j�7�=�bH=_p�N�Q�<����j�f}�KiF���Y�
Q�0�$}aG��(���]�m�����`>�n���"��\���{��r����?."����G�[(t��]eɉI��(]�{EɾA�F��q($�s���6r��� O&I�S�9H�XQPQ}��}��QJ�.{JG�";��}��҇b�_�"�A�G;+K+I;+.��G�bx$²����� �aY0�o�;b:/��F�(��y�B=2'/p�b�?;ҾU�x��
�贁I|�IبSȼAUk���4W�:����F[���$���,0n� �����M�2��6g�' v?Q��B	QK�1E��'J�_�3�ԇq㌁}�5�"?�8r����ϓ�1��C9�b\�2�M�d1B$˱����2/	#�m�ك�G+��s� ���횴�ƶ�a����"K�<��;�ďJls�W���ܹr*�7�g"���=�K:ܩ���G2q�p$�S�'Lu�NQ��,c^�9�|L~o�]i�6��9-�s%���b��S>*��P:	B�Q�J�`8�]2h�j���B>�����r6������!9+��Is���-�-d��Rc�!�s�r��ηҸ,�؀��/4��N�erJ����y��[ʠ������}�APr
,��c�����3���࿯b�+�$�Wn��=��� 8�'M]2S���0@8#��.�@�Q����«x�%�g���
�%I�	h����l����m�s<�)�Ȥ�KC��Ā�ps�D�����PU�=â��P֠��X�Ǝ��je@ �$�&�{0<Rx�@�%dK��l���J�K�Q�:Y��OLұԢR�׻��vw�^y�{ ��=�՛�;K��~����ӳ��v�^��l����AG�ݓ��g�;v������-�%_[�)�ȥn���vߟ�~П�,�U�����S�2g�Op�\}����r��Q����W�����v�^޵�ic��zm�
��Y�>U,��8-�;�鿴��T�f��v����k�w����%���]wV�-,(���ٮ=w�?������;�ٛ��D����7��]�|P���l96������i�/K��ח��=&���7��$�X����S�d8�u!�#څw�v����Y!���5���!\��5��V�A�|/Ĵ����Z�=I�����7�-k�]Z:xdgD'r�<����������	^�D������� m�ꇁ��=�����G�ȧ��0�7*t�V�+�"Ne�>��:����:��7����~���h�kk���?�}�L���t:��e�ކ��}���E��WlzG��^�y��s�K�}��7~.��j�\��{�;�M��G�����;b�K{).�I,h�y�I�ੑ�2B0�,���k&�^�`_����,�m��� ���F�����d�O�#��h4;��T����M$r,��-��ȶ�ѿ�Y�z��T�w㫟a��-�n�ɂ�ؓ��
�
��a�j�6�}��tB�kܪPJ���v����{���k���.�zޢ�;�~���x��p	�7?;�����C��W�3
�S\
�2ꃈ\ߖ�7j_5+M�h-I&:�pO�Du|�o�lށ��Cگ�x#j��;��Ȗ+�>]��h%�D����ƻ)�Z��}�I'���}oD�n"�:J�����K�`��&�i��8%�{;1�&��{<�'A7�۽�y��!�)�����4�� �Rw�A����G�J�E�w{$ZE���{���Ӏ��	���A�p:��w��g��1*Y�F?�ֿ�5>ȿwS;
�]��R%�d?��l�P��}i�"+)��ƪ����Y9�^�q_・nu��)0���v���)w7�E(pNv�O�#�!Ә ��B^�ڗW�{��#�C״�w�a+6���T�N5�
g�W�0E^��>5l�3mǔM �2�5��mV������'-��B��6�i�q_�ȍ��-~��T,�D�݄����q0�������)��b�PwI"�~��&��,w-����E|�Z�O�3���������K��PȣB5c�/�  ]
4G�N�#��Qi�s���L/+4?�AL�ⷤLJt�(2��/CK�d�%�`%��ŏ�>����{_�w�_u:їV�i�G@cji$C��Xb{�^�)-4,��?�n���*�j�"~S�>x�X�VBɣ�pCNUXi.|�۟�[���������V�(Z��r՜�d}͂�e̺��l���z��A�>�k`f�߸���d�ϡ�.wlrXpC.
�G"�`����z��z��3�7B��$(FV���+T� 7·W�/�b2(�v�CmB4-aE�ܦ����g<�4Ao��9�郉�4FP:��A�B�A����g2*�G�E��Ht�#İIbL�q�C����zE$H7�y�CWm�~E���%l������)N:���B��:5v�1ة��s�qp@���Ӎf1��%��ޱs��3�:_z�������z��Rb�d��|�8A�9;W���|����|y�xH�5��@[�na��Vޅ��~�q�,K�#է5\�h��q�:�Xن ��p�Τx����٩�'���<��Ｕ!�Qm����|����8�����=k�2sᄏ�M��6T.�b=d�e�Y1u:N�Rǁ`�S�,�/�E��S�/hj�ʪ��52�`7�<��iK~��KH��O����F��P������V�/@�|��Z��e��O��{�W���.Z�-�4#��B-�F3_�r5��.v�&�F� ;v*4���O����*m���f�a��#i.�n�e$�o\8؁�w�;ą��P���}Q�]�}"C�փ}牝�`!o�Ǽr7��rת�e��d�3�Iz��λP>cኅ�����^�H6M�zpC�k�F����G��?��˳fw	ZzF_�q}���i�Ɓ���A4o��D^��Ji���;M�������c����Ha�S1Cp�P�nA�oʀ5M$U-z�2J�H�.z�F�� Ӱ�K�U����ZH�V�ؖP�Hx�8CD�ѶG�<`_������O���06W�f��4�N �����"��y=����ç��\TZ�ʋ^Ǌ���P��e��.�5o��]5 �"йA���������h���xMsZ3�����#�[O���)i�N,6��JB���O��C�d���?�㊪���)�i(�ˈѫ�m��D%���.c�J�	k��!D�����%`%�N�*�Cc���ۉP��{�.pziN{-d�.v�[ZE]P+ŕ^R|C��-ǆ����\�TYe	B���[��ޕm�*ɶ<}�%lu���H0wR����n�z �U��<&0��0�wβ`���Ԡ0��~�m��98"*�5��[�>;2����]z�X�BzqUO2�@w�"H��	�bw��:yM<*I �4S'<��U_!�o����QdT@�sA������ �;�HL�£&ؖ+���	E(���\���h�(C��8}N�� �_-�^{ L�l�\S	���68����ww:��\
���3u��X�-C�L���X�ɒ�>KQ���{�3Pq����~`��/���~`�Nl;Hy�X(�fٻ�G���
�,�5V�mX]��4����u �1�dF�=��^0
	���9�}惨.1Ó[�<�A/�w+�~W����l�!!X�NsLv���A��3r�?����Eb��@��xru����סzK�\�ʧ�+X����M���lՅ!a�hh�xJ�ɶ����b�p�=�eWI�"��z��+���|�3q,�Q/'�u��*�Q�! amg�X���QW�:��A�w?)�e'��rH��o15H+pqjƻ[��!�_	�$���� ��Ҷ������c�DJ.�X��L`���<Q����A� %�3p�lq��'o�'V�N�Τ��n,B9)�Bbm%���_�'�*�sX0�������쳅�SzXt��JO1u�>��>�GV�,3v�=ي�׳_Hĩ]��I�1��1'�S���l>$'�s��X6�wޔ�@�b�,���&����W���>���j�#7a��M���~����LhFt鬪�R��8��XHʆ$�Qt�ij��eg[9�c?^q�%S+��eﾊ܇N%����r��5WJ��,��1�pK�0Z��Ϥ�^�g�H��Y�f��[H�\nډ��F�[��>-�t�QΙ�8L��i��G�_�$R��7�5(��L�Mي�a#����[.%s
�.�)&.���$HG���P.5J�c���0J��6�M`5IIb�@:��B�g�r���ś���D"��s4����Ep �٤�њ�7�Xv~1Vv�U�,l��gbkl+v��Bjo��3Y��P��o�p�KI�����O!�o|Oہ��:�T�����D�7���� N�hBn��D����.bNQԩ^��{���w�w�"���8��W=��SLi�����V�w�\�p̦��d��k:�w�7/]>�{�,������=�N���xqjX"',�ٮ]D`=)ŝF����5�B�	Ty�}��ZC�~n�d��5'�ˠJ�1��U���g����A��}żZ�ٰ^�DA�͘��?F*� ��F[��vo����;�^������)���%�i��	��Vξe#9Q p��~j�y�	ZH`_Xp�O�KS$�-Q�2c�`�������^�mqq�L|�o	#*�!�8lC��E�w	>M����4�}�F2�
r������l�s߯�������
����컨��=�	���fP�E�@w�Zt�s���Q�����|�W��f��!���J -�g!�*+�p����D\��g��~�C�g�� ��+,���Bɡ�P���4�ֳ�>@|FJ�=
�T��T
��mM�|-��^$�%oS����N#���y�j�JZ�c�K0�];��.ԿpʲJ�����K�+E�$;�����ǂ��3�7�JJlj�^��%�^��$���v_6�Q��	����p�Q��{G���@�$2��	��������Į�q	���΋	ʘ�"5���#�=���w�m�v8��D��ԯ;NvU_{����:�(����5n����D/E0���0�J��A!�8��W��R͞..��'nb��A�Lx�G�4�VMGxnP�� �߂Gay��Za+�D"�O�*L>�J�I��H򠴽`��-�t�-���s1c�kGC_*�ocC���F�,g�BF�5 p/�ف�A�ɂ�/��3w���A���7�i����2c�y(ު����S��J#Q�:r�R����$��*�Bt{�9����U`q/�f$�{�&��	�a����[��	��;�}�x���M�t/�L��t
�W��tǋ�
���Ğ��c\og=+��x��O�u�Pp�5h�ȃ� 'K�*��Dx!ɜ���YZVqh6��
��b���!��IH�#w
�L��'2%�5;�6)�����`�������r�w]E?�Z?�La��5�k��5dM�iy�j���l�{@1sك<���x�zz�h4��Lx�ru��	�~\�d�S������K2z\o�H�N���}^Sp���R��ـA��{61�p�S�(��԰�g�F�Z��v͈?�i�HِO7�S����,�V;��w�����!�PO%�z��9T����с[��I$��2�'"CX��RH$<7S����>{OV^�d�(Gqa�#��+�N�_J	,�%[bO�W|�ܐ ]���'\�I��C�F�6p��Nȋ�������AK��~�������]n�=�sn�"�thN�R'%q%#�3�$�/4����������.^�w	fj��:�x�0����vx5�֜Vr��;@�o���h�xaف
�<)/Գl��l���,!�zQU�ٴ�c���3w��Q_gĚ�A9�4��Ɣo��BK�����F;�gU��H����&�� ���O��E�7g�z�;cW��G	l�KX�<Pȋ��/�j�^�Py���-6d��<��ܞ\nF;%$�s��*<��yhsd�Y�H��{��~K*���:p����+Y�a�3 (*Ix-m�m�u���ޗ���&�F
q9��.\I�����!���PZ�J	���
���Y�+�����uUE�E�΋r2�ԒvE8QEoO�]@���h�^�p�$�T����+݊,ei���5y�c���j}.���F�l\�>U�������O�?��S�0�xձ][�B�Ď?�t!�����5�6�b��wBX�X�W�(�[�bj��OaR��[�3�maik7�������'-��sPT	����k���ě�������^2�C$��KK��Zc/գ[
$�mVt�H?O�;y�&����0$�����A#3��9�8�u�A4%v:�ފ��� '���ȋc��p���$HD�/��#�	�W��b���rm�K��-�9�͵����T'Vv�Đ���y��u���lo^*e\ӧ u5�f�p�g�>�j�n^��;�3Rr��^����Kź~������Ræz2%3]E*�_ߙ_|���r��u2o����FV<`�Rc<Q�w�\&N����#Ϯ��\�8-��J�=��N��#J�#�ƻy{��_�Y��P���	��mWi �A&&��IE���ې�p2S%���MxqY�|63��_�P �ȳ�ݦGQ�~��R�޷Co���-uJ����|����M�JQ/ĞY3�Nw�0�coI�VgB_Pd$iG��bh4,�"@D��-%�E��˱�)g�̕l:��E�P��&�c��O�,^��X�D]J���T ݁{��f,�z��>l&Օ�[��n՝��KM��|Co���8�cL�DO���<���\���eԴҍ]�ܩ�z����Mv��k��(�J2 lx�p�
K�а�"A͉M�k�·�gR�9�N�n.��v���@�kk���]�L]�taӄ�R3�ب�Bt�{����tz�v��k6Wb-m��×��Y���q�3��\w���	�Il�_Rg�6~h����}3�p�.�#H�Z��ep$�50�V"�=OMr�m�AǦN�]:�w۫@i���ux��1�ꨏ��|rqr��d��긹��g��.�d܈���I���@���oz�� ������̀X��{y%��qvS�b�5r��f���X��%�#ك똃�ّz}
$wH�I�I#du��H	�}�f?"Ã��ݤ� ���vʌ�چ8j��i5���Ko�iI���ze�R���1pX��,2�>�@����������J����i]��E���t�����f`��G�ޭ>sݢv�?��כ�YV&Xا۠K���8�?hH ��ӭZ��p�4�0R��=�)�l�%�d���]v.%g����N�9nq���՞�R��F�jP\�ȣ�[&���fs�e}���# ����ΐ��7��N7[vI��d"
�y&bl :�6m�:�Eb�Vl)��ًN'�d�I��%�O�ʎ�eW�5|��E2�{js��oͮ*��mUa�q�J��=J��G��ɀg�;��U+�D�	G�X��I���T*��Y;?���2��ǝ*�ϸ�odX�7[��ZU�� �&�h��Д���CE2����e��4*H��J4�%�~��W�K��4\�>�'�z�|�2<���^Y6�י|(\=�	��"Y��SҶO�j6������@S��R^��W��&&G �Y�g),H�v���=i�%��J@�{^��#���U6�TW��$�;Th��kz��Gb��#*�+K�J����J�pUW��t���{�\w%zҖ��A/X�b�G.X����/����2f�O��]�C�f����=��V��* =H66jNJ, ���ߢdi��	�s���͠��^�QuW�(ݹ�[�w� �ަJ���R#o4�����*���{��(j�>�]�$��&�(#31���4?�vL�;��f)<�q�U[*ھ��:s�/�|Q/�R�.�]��q�ƥ����]�nTG��z٣n�_"s�s&�yl��E���K�5�D1N�Dy�f$4�	JB2�~%ʗL��תSu�%o!��sN��}]{�d� �_�桤��.�<� 
+��	^,9��D��G {|��M�ݐ���=:� p �X3��,�X���e��H�
r�,���Iٽ��A�j�Rs0���S�ļ���Ѕj���*��Ƕ+ ͏�zt�����|w�ۧ��4��C&u�1�;�4��P���4�Ɋ�y�E�|�Wߔ�־RW��lZ������͕6��a�0�Ӄ�l�$_����;1D�B,������rvt��i����X��<է����[ϼ�<1j6"�9s�J���L�'��xll]IK:>[2q
��(���ʪ=��m���bj�ѡ���=���o��=�&i���B�cF�#Z�An���:�]wDx
�p��y5��j<Q�I_c�8����p�wŕѯ��@�$U܈Cru�����|�Dh/ʃ��փ�f�%�:��27�ql������Bڭ;�b���w6F ���nmetC��g��C����o�Y�|��
\(q�ٳH���]ʊd���c������N諟�Z_w#�4���H賏`]=\o(���,1G��\>�-�o�X[�n��p�@�� xo�K�O�TzȊ�ڬC�ګ/�ٔ59�b��t��P��r����x����qd�>��t�������aE�j����75��V&>�J��ɧ��}6���jȁ���p��5�K����}��`$��zc)��+�@,��#B4�=�D�	�³
6D�X�A���ۯLT�|���ӨZN.��u{}o�6F ڦ�)��\7z0�z-�.����cN>L��nġW�84��A��2��|����࡭ �3�~G ���L��0�CꇐRl���uԻ��]r�,�~��r 
W}�K0�p�/��ѱ�,	�h`����1�%k�*W�Y'.�f���O��l���G�sEer�k�Q?������XV�3F1�A����F�꜇�b��Q��4«����]�v�h@�C'0����r��	������No�=��ޜ�ƃ�^�C0�<��E^k-J4�X=�#\�Y:qA�D����l���
��v��&	=1J8�Ǉ��I�`�<^�r~�+*��C�Fr�vx���#x����i^
��X�E���%�8G�bL�e��p�W�_��jֺ�{wVk|��:x�j���FCMox�����L��8�|�ܣ>p&4�����\�쩞G�O�t�A��v����;��Ð�F������H'Æ1>L0-u�+��糠�"��+���_�420o���p��U�ڌL���bu�)�TXR�yW�G�E��h�� r�[@��t��
��@V^�
Bv�{mȌ�E��bH�B-��p��yK_�����ae��S��S�D���3)��/͚Ķ�$$z�P�T
M���E.�~�����j�VJ����;�6pQ���J
�6��.A��ɞ��V��m�g0�|+V�;^��/�{��£��I���<5N1�%˷%v��{�ac*ŦaҖM1í�&�Ʈ- �X��c]�cRi�TB����7ʠ@ݽ8�6�~U�(nuv�Ƥ�=kz !�	D���@�������
� �STt���Q]v7o��ݰ��Օ��ⓘ1OF������G����yEu��wr�m��#zxL���r�A�"����tL�w��8S�����(���*-&���8n�,\i9
�3i��e�C�mx��,k�v�!8>�Z8^礩˝�u�G�/��#�7�?��rm������w��'�υ������>9{��k�j1C7���a�9LG3ܡ����`e��|�?���w��������.��p�O�13��3�k����S���)��%���a?�=�+��/P6��v�B��[�@)����6$�c�h��O��4�]rg&�7��A%6��4%Z��/��h�3M���I��y��ܖ3��ޓзQ�W����&f�
�Tp>Og���kH�t{-�j�7I�F`̙.�w���#׋���q��Q��G��w���2E��G�����fl7��_�U{C��U�>��c��Mv��Y�#7b�&(�tF���,WB��_����n�ӧKMTR��TcD+��bb1��@�I����QՏ�B�#�״r�C�؂6����ߔ��D2�L��������K��Wb��(��b�	[�Qh.)y(`95A���!�i7ߛ�P���C���%�&"5Q��VW��r0c�B�{��?`=���L��p�I�)��<|�vJw3'	<;��m���
{Pnu��)���#��[�,�,��CȐ[('�]t��_�֑[@{��Zwֿ��J��^�wr���Mk���E�YXۊ�-;������=D�Ǧ�x̟h�N�����<�&��/���E�1��y�|<�M�h�/�.�=��8���F�>8���=�]E*���d��ojP�s:�i���5�p#Ap_V��t�n�S�͸�@*�L�j���~)n&�?�;2L.�Wۤ�1nxr{&�Kaw{]l$�����e��ƵL���d���Jm��!��J�Q�qH~���璀��v1M�~����ajp�z����:u@㯾��{A�?�����UB���)-c(��g���[�`m�0����5�C�;^���$�9�E����	��u�IZ����������cOZ��*�(������M�_tר/M\lԓݜ���/�7Y��i/��}��}����d�iϧ��{�o�	��&�bxk��Щ���mE���-Ⱦ���e�ת�T1Ψ�����X�[4��=^jS��Kα��_τՙ{�ߞ2�a-�hk��h��lP��AA��eQQw���Q#�	�o�i��r�*��F������	D�����{=M��lA�Fo��4:�HX�2B�wJ����o����5M�s$^�ٍ�O��������Tm�0�!'�-ޢ &������׏ń#����i��Q���v���3�dԩ��]E�t��8�@��ȇ�i�y��m��t���.=�ڣ�;rѻ���̍�G�l�����x2R���A�,�$�t��+d
��bIF��R����0d��ȫ��K��&��dg�C;}���I�(@5��/�qqyZ�9��7o�۰��e���˯���{�R7+yw�,�Y�%�������j�&b��0�fDӗ����p��0����oS-�@u��]��OE7a2����|�d���i�	;�ia!.���:2~C~�>�}9ꌗ��p�ϻ�'OUO�-k���5�2�v[�p
��U�����>�w}
,ݗ"b6y���&�w�\����	�_��3z�tr��˛�ޮ���Ng삷�����>�@y�q�8��(0���`2�1A&y"BfQ���
��21�����\?8�e�&���pG��!� 3�An����uv�v�b�/8Q}!9�K*�2�M]��槽�.#}c|�FސjGh��)��vjFR��<�	�P�d���G~�2^c���5���O��yo�{�۲G\�s��x?z�7��mS�e������Ͼ��]%�KA���9�x�m&tz�E����Χ�h��#��c�����E�$�G�Qwh�����>�.��:�t'��9�x����L$�������/�e�Υ�kN�bh�&"�E���6�A����c����p)ɚ��I�F�o��TN�,�7`���t�r�rL�B_�H^��:CT�l2B�6V��d0�����-��1s��7�jNY�	�>ܩ�`_�@-y������&Zzݠ����f�^��͓��
MC�,�=Ogl��;Q,Ž�5֕�Z�T�E�	%�P�?M`^%lJ�+ê�V%���x��#��>�O����p}�X�#ݧƔ����Rܳ���`�O�ȁX�}�����XR9�m����3�7 �(���*�&O�1N杲���!����Q��58;�U�p SVV.k%I�Ka!l�W�?f��g)QD�&U�(kZ� ���i���#s2A�h�֪�V%��ж��?c%#r�U�9 �̰Vɨ�;��)ʍE)1: ,v�Ŵ�|�`�:Ww����U�>BȨ��T|]K���D�g�B���T�xކ�7:��pgkQ�w(�,�@Խ(�'A?��埂B�u�ё��_Z�Kc�CA�LS\E/)m�|,���#�H�{u[��|i��i�g�[�Dˋ�aZH����� �@�:��uRsRZ#����D.���`#��1����k�W��<R�it��>��p���Q�tw�F��/��tW<	�~�>Aӽ��X�ͼ���dg�B��zRL��I�قg���=�q�?����5�l�L��쩪�:�vSQԑ)���I�H�1j_DN��2�B-pv�/�v��PY�ڋ���|�-�Rɇ�Ҙ��xn�9�r-�.q��P�C�������.b'7��ѫ�"��`��Ө-�rی��	(�xO �����Z��bChÇ�U�g�Aͳ�� kk�q�&�u��������D�W5���X�c.Y�{9a5�=?���l��~�q��� ��[��G���Ţ{m��*s�X��"	i�]	�j��-㑜<L�Y��,΅�������G��ε��o{GQŇ�j�yn�/�L��]R}3.��A�ES��7�>;�'lH�!Ci= �3A�L�/��[���T�ɨ���`�rL��p�-��Тo)n3���@����T��1�����-�.u5�ZF�� �Ո����v|���rxA�t�e���
 )��)`�8i�qlN+?�d������oK���p�Ԣ�u�$�\oXmB;�K"���`�?�$��A�b��f�4���J'�{��WF��<`�ɓ�6�V�iU��wlA߳�� �$��&%���g�Q���#r[���G�^��ϧ*r��RH��Q	�.��ѯ|7#	{j^؛�AHmZ�d�&����!��)�SBJ�'mˈT;#0p��Â1B�$�Bb�����[Cm�Ζ����^���DŘ�:�9���/���ԭ|�	��R�}��?�����ל@D�&�B�I�\�a�+���N�1_[� lb��T�M�݄^�ngW�pѰ����P\��f��1����FE�)W��m�v�Fn�^��_N��d��v}����ۂ�R=!�#�Z_۩�A��1)��ר��F�
�!T���V�R���!�96o6�L��PؾŻp�͌cj�356�RG�@�.�B���fzn6ֱlB)LWJ�c`��  ����[oG�.�Wb^�Iy0�A/�j��%��1�JR+�u��gc I��x㠛V��9j�)���)薀�_"�/9�b]#22���y�XUy�X����V��D*1o
3ņ��
�{�Jj���[b�U��b�L�$Z�O����Y���Z�����z9��Zޙ<\}�Ϻ1�x�p�v���5�][8�y!Wt2����=�6W��9���$�k0�'
]^K���oE��I�Ȃc��
Uxꀋ�8x�VUy� �@����՛�:"M�����-��1���Zل�	�Co��N��$������+𐣹/��MX�FQn�)�2
�Ժ�+l�`�Kߨa�α�c�)���c�h�� ��H��Pgt��G�
Ļ8��� �L�֡��������Y�f�P���A��SDnں�VY)�x$e؈�`'�ò���qޑS|�̉ӧ��%�I&+'�N0%\~��f3u-7�D	�$�)�1��� �=L�v#�����r����KLSh� �p��mM�O�bn+�b��T����/fǎ#%5aE�P����6���\:���d`Pf�m*�/M��V����-�@{�
��@ÿ4���oEa`�6o|v@�Q~2nA��~gn_�ݵAw�<@�w�JXsF�ٰ�"�j�I�^7��]!�/;�{�Ĵ��ɨH�q7���S;�tƞ�5y�*qu��*)�J����
�sJ��[���F�f������yK�5�7�=aQ�]�bh��ef3�DS�;��~��<hc���\q��$�$p���g
���[�����F�M>&��s�ȺP�\s���ر��X[�׸��ƹ�WX��dɺ&Y0!�&
�z}�ٴ���7�ƆQ��; ��*W��ڭ2R��\6p�鴏��O���(P���l��љ8\p'E(�V��^�ɐI�Z&Z�2�o²�0ٵ�b�AX����y`��"&���<P��m0��#.m���&tg9$�[
|Qa����i(��(�4�~��6'��?_�:�(��2�%�����k�VՏ�jH���$��h|!F���I�������1�����sM_������O+^�?|0��)�f�>�2Y�3���5#���(���㮿w@�ⶳ'I/��L�F�;<H���U�F��?�f�3_q�r����4\�@� s]���M#��]*�û��Q���~��G�$	���|�@�c�P*1ҟҬ�ѹ�q���&	6w�'haOq���2��C�m��,˼tQk�kt/�I������<qu�o�倿~'׽Y�s��VDP|`ڂ���`r�k(��[�03 ���-Ѵ�#�F��B񢗟�6�w+��m�Q䍧B��F����Yw�׉@����$�1�׮e$.���ͣ�2+*�L�3�,B&��@
їx%������	������BS4m/�7�Y�΀p�+f��)j"�-#[�'SVC3�-� +�W��OE�fj��kA�a�y��F[�Ge"�����ES���wYN;H�M���t�c��-�Ѳ�<�k9���B��Z�M��]��}��{��j�
��vm�;[���B��b"�#�c&�{��a�l1�+�sp��ǔ�.l��K���LxIF���ڑ�e���){5�Jʇ-N41��DG����X�O3Йzk$�$'�AY@E���Eb7���6&��m��Q�G�<��.���7'���hi��`Ǿ�w�|�r��F~
3��ܓ��ߘ�8��Mn[�n����;�&�J�i�R׬u�&,M8��Yg�B��ORf5��(��f��H�:E)δ�L��	vi')!��=�����U�9��~:\�%Ǧ��.�(�����ʕG���B]�B�.˽���>Ʌ���C3��*�m�/�zT]�6H(qJ�O2��{�yn�I�R�i�O7�Lv�$4�k�舤|iT�XZ�R3��i���\�)O1�`%�@�-h�5�p"ͫ��%�Q� ��̌�4	M��v+q^3�L+m�}W�b�U/����]��	c�. �=���������>f��1 od��=�� ]!VNA���������䚬���LU�J3P�馛X�;O8Ў)�a~��|^���]�͸{��٭C3����`��D!�W�=�A��ï�"�'Io/ uD�����f�7\���ǌ����z0^π��e�P�-��[#�KV�<�-�"H�4şڢE-����G�G��/?�|�"M�+ŝ2ʨ��+c��-����|��o�(���;�y*4T �cJ���|H�Y��:VF��r��N�8��dN�s����T�DDQO�g�}'��OT�	F~�~,��I9�uG0v,��F8���%��̽���2���3
1l��ש-CtKZ.�TC����w=�N��ъ��w-�<����^�OC�D<Eݽ����m�ZJ˄�j^�@�3�BL����ٓ!^{!�,����~��d�􁩩�=c�v��;b%�Nf60�]�FnQ�9o4Z�6gS��ĺo�U�	��mʏ�.I{�f%
��8'U>�w�.��ƙ�=�J˫��M��Q���M--�6 Ab��-�5�AM��}b�� �5[�}�67�
l�n7Z�����<��d�� ~��[���ӓ��5�!�WFb�-����"�B=�
y]O�͚x��#��|���LX���E�Qa(��6��Ԟ�]���wH����Ż��i^�4�_�`� *��u`P��fFW=��=]�|�\�;���>Ǯ|�ꦪD�a�ǝ���i��v�Ժ��1%{р\C�+�o��Wɕr��E���[�l�?�ɲ�.No.�K0�4�����8��$[Kng��x�5O�LWKU��l�\�ƪw��Dn����VJ-����d�)��H(�6��c{��ɒ�YY��9��oy��Rt]r����˩�\�t�_����~��'�[���ʳ���&t en��Qa?e_�$v�H;�UN*#��uw�����|��;���I�!���OJkj���⽆r������9��'��sc�Ҟa85�u��U���]�raeqE�Q#�$���qd���&J��皆�ϡFȟj��>%*��6e��mD1)�Pf�e��r<{��d}�G���{Ѝ�W�U�]�ڄ���P�gW2�teFvp{K�?�J��������������]G@� �� ��Dyr��Y�1G�Y�fΦO�JZD�oL��ߵ�)5"����w�/,_���%��O� ��r��$j&U�����26��z�����_]��q�u��Gͯm.���I�F.�OHB���Q��m�\�Sw��5�Q����)8.|D}���j]�k�`s(��'/Nw3y��	iAx�`��J/|iiŝ+��B�ç��;sH�?��}̉�z��Oz����b5��!E�x*]@�H�0�uF��o!_2&؄�)����ޕJ�,��M�I(�ȏͅ3٫6D2����lF���?3w{����̖��U�$�����B�[
$���REt�����(�qy�]t�����}��_'�/��PE:�f�3/�^M�pt��a9�-F�l��ג�M�|x���7��偿�� ��H�@Mg��{���(���(=���XF����6N� 8�	U�Rtq����nƴ��Ft�E�Ő��]n��_J��	j�"����ߘ��ax��=�n�*��#2�8WJC3��"l,J A6ʑ��wK��9L����sG]�S�4�����
��|��3D��s��>:�����6�#���I.���0+�z+��v��	ӵ���I��Ţ�@h������د�߸�����7}���rh#ӣ��}����9���c�D2؅eް�/�{[o�%��.�&4c?U���x�D�Q�T����x�\�g'*�CC�ʨZ�m��i����5Vگ�Q�&��WxE�ʭQD*���V��ф��*��5a�՜��Q��N`�k�#�[�%G�y���Z�o 1����R����~~_�n~��U���L���ի
��bV��g�@S�2Qb�C�2[#���
|l�=�O�/q��_�e@�ϋ��skh�;fLOt���˵�f9��- �[sIuBK2�h�E<�J����).�-߭w{#�y�Q3�mz�MG��}��Ǐt#���0zkJA��|����2Hv�.�Vh$�_�v�Ȥ���k}G�n�[C\���T�66�MT�����&
��Q��p�%���F2 [yz�[8p#��gdp��f��Qiu�	�-2�Cfs�|��Qpd�H~-%��~r��d�.Ww�v3��V�v;�q� ���M��������5�ڑ��Q$�/-�\B�-�a�l�?��n�]۔�KP�i٨_.|U l�wan�%��ZO�Op9{atE3+���.�]9�=�����i��d�	V�Q�?�4��lW����뤣��Fl�+2�
����,�@0B��8U���
�佈�;x�&S,D5��6v��y�w + y#��.�&� �h��XՈkT*,�(;�'=�\N�3Ş{�>.��cH��E��d�7��������f���d��[��ڏGb���6�Hw�U�����*�+������e80t�8�,mo����ԝ0����m�i�z�:�ǭy�@����N��˽b�K�g��[�I�s��
s�T�)��9ά��1j�A�'YMR��F��6�����zt)�pf朅D���d��x����nz��BI��P��{:[�wYA9�M�\�2��!Ú��n�I�D�){@>�S>G�94O��BG
P�N���V��/���ފ[�D6�YMB�!��P<pE<D�_l����a�.�H3r��3�2�fY���|��cv���@�z�Y����df�z�b-P���Z�L.iվ�N���_�K|���b��X6$�rJ�aձڥP&7�ʁ�K�8yu�o�>=�w4o��g���m�y�ĩIL�N�7���������\��B�9�zs<�-�Vt:��������(� �V��d��3!-V�P�?�pc�5����8��S<{��D��@�tl��\s�����8�E��J��$���g�i+8�5��W�=5�x4�[g��1p	��x>a�Z�-�p~H�Δ�[��κ����͚�i�9K�����K�&�1֚��\���7%��l��Jyv�Z���y�9��}�۵��)7��� �Wu�d}���V}�u$,��ƙ]1y�@^��������UEd��������A�l����)�*�r��0�/0�H���Y7��X�c/n��\�>�6���vĕ=�b6=���V��Gh��5�"�?��Dj�j����S�y��Z<T����/ĳ�g�u\J|��A�> s�j=^A��gmD��o��<�b)��P������͝Rq>ԟ�$`Y��[Yx��OP���	��;9���-��_5l� ���3��\��A8k=�<�8\�j.���ʭ=c{�`XxY���������v�&��hZ�t�2��ěC�-k���v�
���D�L�[5ى��G�{E�~��TbQk��� =��^-��m,Q��w͒�V�Ύ�ڳ\������BgQ�ɳv�5�|��lGR6t�I+�QTޣP��^ݞ��V�0Q�Qf�s!0N�D�,nYD�P��B�xc��z����bx��L'0�7�ѫ`�G��r��V�}��(l/-��������#���Ov�Ed�yvsӐ��l�1��.��Q�fH��.����y,	��G���Í����+6.��`�/l0P�M+Xt�ϻC�"np+:���T%�<�^�?V�6���E���Ѧ�/�j�-Ms@�]�T�$�� ��r�z?�M!Y�����g�PQӤF3�Q3g�{�)0Y�Q&x�?i�#�a�%�p�4i>�ܦ��K�ӷ�jh�Z��r��/�c���:TQa����:u� �f�qN]/N�|%�A5�N\���2�5�T3)�L�F	�c�����K9 pX��x�-EM�oّ�
��y��!Kʮ3
)�u����(�[E*�/�~��H)�:̜�\���mF*'�8⎕�v/��O��(�w �N���ҽP�L���]�ڏ��@�������ȍ0��)S�GM�G�`4ޚwg��`H ��N�3����wN4�8Yz�"�O��0�~�s�&UTO��p�wQ$���L��K�d`��]�w���𼡚ۘ�m��T�̻iҴV>$�"��T������#d>]����,�M�H��3��S�97����2r�ZC�)s�i���r64�,��U}�Y�t�[հ�q�B��?���g�'py'�N5�5�I/
�D�XRj�����|d�t�#P!�?�>�F����hm ��Zeс&n*�J��tr����s�+�r]��-`36�7�)�����7*5��8Ar�zm�8`�>�7�_<@>ʻ������_�#e�eї7m���=�9g2�y�H�G.��	Bg�gp��b�h;�r���gJSs(QC��q�౅;b~`��O>4�$���1��Mw)�&(3����!cM�7y�d.�R��aP:�t����./,/\[�z�]��.^�~�|���e�rm���kח/8m
�����|�����f~���Mg����S�m�����`4��uّ�ѐ�	[�j;�p�θ��˲�Q��̈́*7�r3��R�Fr4n�;SjY7�8$�|l7��5��pR�f�3������l����9���M:v�����U8�{�9�Uy�HzL��	�H�T�ȥ��G�zT�Ň�v�O�����ީi\͈= ?Ӥ/jw�`/���GW.��;�>��1)?���x�` j�%g�'�J�&�y���&��\�x���f�@�>�*���C�3��m	>(���mZ���n�ء�jD�����2��֚Wx��0|���3׭b�l�� ��M�Mt�w�u��1y���|/��t�Z�`d�|��p���et��.�.�+,ȵ\�j���;b��s�tM��lp�X�_ZW�ji�o�z�a�G��>�%��r���׸�ko�c��>Ĥ[����g\<�(�[�pZ ���v�EC��+_���
պ��4����6��F]=�e�i���俭-�� T"$h5ً2An:
��}�}5�߮g}�!�JU�`���L�o����y�y�G���/I��^%�0�����y��EO����lZ.�F]��y�	ʞi2���~��Sz�|f�OwF�Ի��x�&�G��������Ԅ��D�#�潟='�/ 6zkP��v5Rl����:ul�§AE;���碓UP����:�ګA���|I��l�s�'}?-�e"c����ѩAs��Ju�,�_�%>#Ƒc��=���ዋ��`�!�ײ��Ƀ'	h�c�.>7�<4ֻ�<'����,y�̀��b�0.:Kp+��87>��k]�0�6$��&�H�@��jm�+��H�3��lo]�Ek"���D��;b*���z��u
S���	��KO,V7�7�>x��A�����Z?㒁��h5��d�5��×,j�����1Cn�Y��y��˧Ҝ��`���=�����Y��}��3����F�c�v�4��t��k���{���O��!��R��ddR����@j@���9�h͆�@������*�*�G�9[��\����aC��v� n�'Xm�mb�U1<���2�q����i-���(�Q��� ������'w�ۉu;���=ecBs�1��dq���E�9��Q���p��.IUM�(�aZ�;�N�6�G/_[?!�Uo�ٴ���Z+*�x��'�O �����/l�Bc�� �8E�p��u֤9��菶�׊�mwV����r����q[j[�)��g�5�1T�~(�x���煵�Ao�6݈���_--N�	�M�G�<��������;���jn\ި�#n2dV%�ڠ����@�ؒ��� 4��TL/��������t�M~`9m���uw�Y���@���A/}!��<�}6��ν��sTP��U����w_Ǣ�S�R���Y�|�U��n��s��=��1��׭-�<�eYa2�/&_��@<���yP=�gHWUP���?���D��b�N9����>�邋e�9�34�Q�/S���-U�y^�%c���q�M�L�#_X�d'�=d�%�M���m�v	5��\#�IG�
L�y��x��c���9�4���0hޞ�Ι'q +�!
��7#'�a�|:�b�EJ��P��N��G�g�;��S��hr�)��e�m=�>[���kvS����x`i��ɬ�Wʻΐ#"?�t���tSd�+l�>��1���C<s`��qu��k8pNK%�M{������gN��POAz�r 2r`�h(9O�i����c�p+cb!���X�ϪU�)����Ǝ��v��e�e�f/�r�'�6����-3y;hm6��ӷa'���Iި�x�M�.�{=3���ܸ
w,���$�:�\�������L�9�DើPD:�n��)'���-i`�:#i�+�KX��}����_�	�q��Cw��l��!�1s���f�9����]��A�#,LjB��Lx�Ȱ6�*��8�J�##o���?���#�4����ɖe\�(y�K#�$��1��1]�%=K�"J�x�,K~^)a�	)�BO��!�^.XD7s{㔜��u������>�Qh.'�c�RUA�b�uXz�v���ʱL澟��X��y���=�58���,<e.�6V�n޶敯j��ͺ@��,��O�2CG��b{���'qIh�/x�m3 2�~g���ݩ�)7�<��Թ����e"qZܔ�3�9����ꄡ�d�~����kӲh��MZW@��j�םk������F��9������U�Wm `�Z��: c�������紎pjL�U�z�Kk@�^%Z��	q�g��!~�d�<䃏��%dQH��m���������3k���W�B�̏`爒:�K�V��&2��r1���,d�<ά-L��$XGi�������/�g�	��/�6��$�A8�x]K��Z{H��U�E���w�e�Y�Y�K��jf�&C.�_���!���1�n���B%���SB$O"U'�}�u�ǹ�������I˄���jK#H������������Z[��f-�x����m�P��s�6�/,�	[�U�D9��!�ٝc�@��*�o��!�-�`y��Hp�P�6-x��p]/�#���C��0{
��m��2��0��	ݏ	�QltT�������F=��}��V������<��f�	�'�}��<�N���#�����L��Dϕ.艢_V�aoە��.�i��A�)0�P��U�w�@�$ N�*���m�7�q�A�TzgAvi����}+��v�5�lr�Y���ԔH?F��SCy����\UR���c,"IXy't3#i�f E-��n[�1�g+�i?0�hB��Fo�;�elr���h����)d���k@5���g�byn����>`畒�练r@����ց���͠��g��3$ȳ#c{],	�� mP��|w�m�a��p{̆�=��O#��D�����(L�+��^��OF*c� &�R2D�F��S�4n��f�-1}���;I��~�ɭ�Mk�Syp����g�ɬ�����-2���ӯ:�I��,�PT ����Ѥn��D�9�y?|�*�^��xM"A��E���X��E$Ł�pD��w&W�a�dT��,µjI��ʭcX��Jf�;��3���.���Vmyoec[�+c!��`'�(�����PO�S7��@��x���D^�kqF۽���9q���[�D�[ݭˠ�G��6M$�%��Z�����٣s����H�]&����"��B����v�A����	�q�r�芅�][ɤ�!WT8322�Ӑ;{lc�x���4�c�+�����iSS���Tx\ic�>�XT���/�D��t�d��2{I�&ZDɃ����c��Ov���y��d��BC��	�1��}`�a�wQ��y�2������w*{Ry�5�9�@X'�qԶ���BrmI-1jE��قl"�y�H��A9JƮ��~nĩ�I��[U�=2�!w�~6y�1�ԉ�t��>�T��x�zL�.~��ۦ�R�*EW��B���GUC�?��J3����u+R�8)�P �暩�����J���w��?��oƙl8Ћ4b�������N�����J����̕���T�d,^�o̓Gf?o�cm/aΎ@�"���y�UCub����q���?�2�q�ҁ>� ��������'���w7�JN�z
5�n��
c=ը�&Տ]�����q@�<� ����hI�xh8
靧�L��>5k�(���_0��(qH�59�	Q[�����nF�U�	<j3���>j�n�L?��<X�T��%g�=�*���B��6C�ݼ��s�Է��R�A-��8�O����iT}�ٌ��������&8~�����
E�|�\⅓�#�^����j��r��h�V�ף|��Z���ؗT`F��u7Ymu�eE��5��k�WI!��FZ��X{��k�� ��>�Zᦒṕ�Ӑ-]�*i��t=SHFS7���șwR�ke��`N����-O�����q&[�t&w��:𿎸Ʈ;�=i@C��1�&�@eF_��`��L)�K��"LW}
y��鿥��طv�6)�?�u*+�㮷KۈR��UN��G��o�H�1���#��#���}b���b8�+�1&h�Q�6�z6VF ��^ˮ�<�p��횟�E�,t��+�S�	۰���z(�%��/���^d5��Is�����[�O+��?ؤ��T�sC�H�z�VՏ1�8��+|��I�Y;R#G�g�n�)Z�'�F3��I"�)̸�khw0�*� �2�gr�L���M�+<~y�
��H�>n���x%Q���� M�U&M|l�%.���ʝ�6�"���&Oa0W�mz��5B�Q6"�nH
��/��xjJ���1:�&eOB����Z�0���,���xI��C,
�f�9Ǚ��&Tھ�o�s*��jʹb���f�^�f1��l��%�P����b�4`D��R��[#B2N1�e�b����m|���I��0Q�	��q�IGm�l:��N~4^=�1���֌��&Ȁc�"m�,�im�"�����^g
m��մ�Ǹ$��w�V�:%T2��9l;K�q���B{��=���끨��4I�����_+�<f�_���ʥ��w���U��^_�FQN�l?w�k��	�Ҳ��*w�s�ES^u(ҟV0j{��!����pZe#f�1L;����>�/vJR�A��X/:iΑ9�����{o�����q�+=&g��m��l��J��(d�|O��_0}��{�� ��3������p5+sm�ܴR�;w9p��mʜ��胵�S8&�� �!���v�N��KW5`Wo�t؝����XB��g��ѝ�/A-N��迱��~��Ӫ����w�Wv3L*'U�SS���i���ӯ�n�
~4'���&���j9Ù��om���m�3�^�ܪ������#���SR��Y�iNZK����:��%�"��k�UG3UfPyqo��pf�z�i��L.�?�}�e��Q�lRu`.���yL��{�����p�p��@�D��]g�+�����ǌ�;�q��-Y29D�*���7�Y��u�����ۯ�i���������	�s��	���H�/\��) �K;�3��|7����_��k�R��)Ζ�j&b!�u���0��{�>S>���ׅ�ȴ��E&�\��2A����܅ߌ�w����$ 8�1��M�Ӹ��N������QTǑ�I�C>��/O�Z��^
t/3���g��#K[�_�O�1��Q�<V�g��;����6�d~��Nf�懂�&�hug\nXW�cr���bG�/K���n]�􁹱�c=�kw��;��lʢ��ɋy>�c��C=���?�W*�N�6��]�&�Q�+�=Z��(�%�-��yMbR"����I���84�^/Ė]*�!�������m��c���I��-�n��qC�:�'�'�
<t·���n`e���qi|�?�t���J�'��L�60"|J�/k�E�D�x771�FEO�ж�NLk<�Rt�Z�T��<
A�4p*fe�w ������
�j�ǹ�q��x�u�^��o]�4�4��P3ëWs}N���{aSCm� Buh�6�ظD����X�$%ć֧H=	S���U�Z��ѩ*"����Z<?yA��bJS"���y�x��o_��v!'�(��לw!���
N�մf�����2i�����n�2n(j�����U��;o�f���g(B���S�;碩�����}e$��R�?{j7�޿�qy��|2��'��o����ϒ�����]��1���xx�%m�E�W&����V�#�۠�[!�ٜ?+�>���7���ߎU�2�#�2tw���޼�ʡt�L����i�Q/���6�v��~&��I9����a�.h���+Ǖ��V(����Y8�&a`���y�\/}���a���jGwM^�1/) x����7L3v��֕t��?�C��0�f�e
�]P-!P�t	�
KX`H��8֙�m^R�n�N��>���jN>;i�N"F��[�mp�r�eL�4��e��$�����D_�?����'�?�3���Y�I��� /�L���?��9˯���ɰ¥>��~0���F��e���p��[�|a�ڄ�L-/��8 ��l��@;�P`�.ڕ�õe��<L��d#�G��(��\XY\����J��ǚ��%���6%����4+�Tf %��r��c.��b���!g2�d�/-��W��E:��Vf$u�����qǣ�����L^��;c�����!tB���P>�51K�%5��X����)S7�G����J��v��L?�΃��Gl@�� �@S��5�|^�1�QFA��O弲�N�5x�\Ht�\���0`,��ޥ�w��v��CH`�2x��W�1G��lՙڵ�E�Zp,s�̅1�RZ;"a!	��f
��\}.��G�ݨ��6����W*A�e�|�(����
�P&�dWKc&���}6M_'�f����
{Q��q�I�u��m|�T{>p+i���wx���7��E���Bx�w�z�@X}�pP���^o�o|(�F�hj��/Ò�����b��>PpHu�M�
|x4؆�l||��g�6���}�B���>��t�g��[e!�a�ó��94$~!-Qb w�Q��̻�^	���Blӯ�����9Q{��6�x�D��ϥ���N�W��� ��'�x��~	#zG~�	��Va�6�l�xP$Z1�:?�!��Q�s�l�@�)�֝`Iu�-��QcaLo�{1�9PI�����<3﵃^��}ۯ����^z�$9S��~H�dȋ�v1s�g�3#%�/�n#��/�P>�V�&\Ě�аݺRf��ʨZ�m��iPһ�P7Baq�e�|���-�4#��_z���n��(m����\�E(���J^��������,���|��V����R��򎢑��E��F���\
��8�?��Vn��-�<]+��h��Rd��`>�H�G�.� n�+���,}���p~ ��KJ<&��|� �_���ʏHda�YX�wH|m�$Rx+��V[�xh��?��σ?�ة]�U��2��jf�ftXtp�N��*�P0����恗8��w{#�B�Q�ˮ�� ʄ��w��Ij�����{������w����P��%5����,�!�*ˑ��>ܜ�Hn���tǭr�v��z����թ?�nZ;0�kp̵��x�^"�7��DV�E�S���@[���DyٓrM^:���gr�<�!
X�K*�=zM� �cs��<�(y�-c��[�����1C4�eP/N��2r���|��IW�d����ƣ��<�2/ʻQ���Xfz���AJ=��'�Hv}R��I�R!�!��P
#wQ@�s�>�:�a�|�1�w�S�}��o9A�E�2R�ǣ�֨�q��I[�zݸ��F/1����9!�!U�w�`��N��~��_�&1�<x��@[�0ުyH� i�!��.r����;�	I�|ʕ���9�B2�H�.�z�H@.���Qji�����0�_L�!��w�ac'aw=�OGT>\��N����d0/� e��ũ�#����p§ߗ\�觓�{Ŷ�6�r��ܠ-g[���"�f�J�\W����6K �È8(��q����V�JIS����C̣�8����V�K��G�FS��k���S��S��z��R��G~c�H#��):�8�j��z�:��r���Ȋ��ąB���Į��q�o��7�w4ϛ�M�q�m|�y�D%��}&OSsSP�>1��i.t�ԁ��wN;1r�!��0�[<���tN����o�Ql���#��/��mNiɌ�g��]��>�Af�z4����nt�I||ü�^�9�����[.;!�rN�l�s��b�P�I#y�O[�O�qw�FX�,V�������O	�s#U#燿|(���ة*yK�$���h��_����L�9}xD�d-R�>,�OSfq�)��t��% �;��6�ji����?�չ�3�E���C����昤����a�&bHA��XA���y�����,��{��5�u�3n��1�
{x�	��C"Of�2.�����:���j¢J�nQ�>UY��"6�j�2/S�*�+xӠN�I
�PM����[��B�V%��Ԅ{g�)ӍP�	s��5��Ȼ`��-���戞p4�)HgFl'��c�������ƭ��1T��oV[툳���8bv�͠_k3C��1�g�݂�������Iʔ��wW�"����
l3����vT����|�]��t<f�FŨ7����2T-����($��	���jzQX����2�j (Ӯ���� T��eO�c�Ż�:pۈ��BJ~�GBݞ7�C?�I��2������,�S�^��]�1��U��-I�=Y��ͷΛV���\�,��ڳ�Ńw�YBWG"�TlU�"r�Ȱ��AV�}�y��y��`.׷ä�[E�?W�ϭ�����M̘Dݝ�t�n`�"+�ڛG(��x�Ơ��jy䬥� �w:5�Yb�Ě�'pH�O�B,+<8�?�r������2̅W'� �w��y# �}=G���j}��sU�\��!�J���%�Q?�m��Ӟ3S9�Ʒy�lʱ�El�	��r��"�<����@�~Q�u��F�&�$�p�:� �T%&���� ��6�����l��?p�_��9 �-q����s���s�g9��!������g�����O3wU3K�;�)�Y|ںL�%�xQN�'��J	�4��鑦J�ӷ�j0�Z��2��/�c���|Q�R���Sv� &&e}:����F_�e����{^��Fef�#�τ������|��X�K?����_��y���,�{y��)�=�`{�Ud^7��;��NG��� �k ��R�����*��˚���:�Ģ��a��K��o�l|z�d#��L6"��F�,�D/w���K���{���}�C�p�bz��(�%u�J
x��Yt����ԽT�0B���wh)�O��_���2�-�Sz�Q�������0��6���yP����w7K� v�Q�D�͸�l�q7omӄ�A����4%胫'�v��Y��_
��U8x ��5�1��]Ν���G��,��W���k������2�I���z��^�̡	g�?�[ow:�B*AS��w���v�ZL�n�n�$����x��6 @��}�)b�~g��B&΋|���c�	��3rZ�2�U���ּ;;�� �)�t��u���xI�|~ ���pa�	c�\�2�^�����Ttؑ���j�?��3�Tw�y��6�Z����i���g�Y�6�m�������|�eJs�e*PTБW��A���21J�+�eĪ��)kpi�����`"V���2'ϗv��6J/��a��U}�����a��Z��
s����f�x��O�F5~���.�19`٫y�T�TV#��t;b����qB��I�x�ڡ� +P�AM��ż�\���<3
�.��+�0�������l$���H�x7/��8 @!N�u9B(]�J�6�$Bh9�t{&��W5��X:��Lr�8�7��dʕ�7�)	ӡ������-��g+�|��3��׈ڊ	)l&H�4�C���¯��6h���%�S߳G�~��Τ3jئo����A���kg[�j;�h��3n�8�̋��n&`x���Y=��iI�x�2�ֳ�8$ֽ>���5��pRU�f~2E��Z��,n����3xj�&U������*��f/���<�n	L��	`��ɥ�`�z�����.�O��	��ީiL������i:0��H�#���RG�@H��?��~N�|E� X��./,/\[�z�]��.^�~�|���e�rm���kח/t
H&%��� D��$j��V[�c�h{����}mPP��h$�Ǌ����u�t��n�c0i�]�~�%s�fM�a�I��k*.�/��M��UV�<���蘗>��˧;�B�ԏ�&ڱ�C�Gj���?��S*陵�+���q��@�u-u�Y���6_��ԅY�i
q�\ˍw6f���݀�K�$sX���Er����k���KRo��d�Vn�
��w�{scZ�оЇ�0��s������0S#u����˔��L���~�7���L�*�T�[�X��D�ҏ��q�2���Jw�f��V��Q���o���Ln��7��Ƃ��Q�f � q��xY�F�� /r�w��Ƌ W�B��5���d� S�I�O��z�i�Q&O��<�6��Q�O���}$fFSs�俤�S{�|�&�w�+A��bA��rИ�o�('O郶+y0πGEU���F�H  2�D����WB�K��d��-��|Hl&�1s)�ԧU��v������(����F4�zz���У��%��L��6��vt!��$iH�e��D�P��@����IZ�F�%��%���=�#�: �1��C���a<v�Iy��)[^�п�����Jf������\9����P� �E����v5�Ѩ ���4(y��s�d��C'���VN����<��sV0_�hKʳ��j�~Zv̤u�rA���F�(����҉�V�YŚ ��5��ܳ�g���S�4�@uk��θ�<�w1�{-1_h�Do	���;�[���\
���U���J��ܞ����}�����	�"���-T��p��c�$-&��Pgb*�ˠM��7��ʪ7ҼJ�Hg�!J�z��'�O ����_GS���7�X�gƾ���A͆�2﹥���3z�JxSu�>��F��]m���0�+@X�#}��5"���WK��L\A��W��:�x��w� I����o��c������;�����g��r�Q�G��~$\����
Y�lD8��*���7Av�� �r
���a�T���n��[ �W���`#��y[�vs�����<��h�܌�h����X@|���a��⪷�w���*�N?��=��a��SQtm&g�VU�<���qb��/�'����-)���b/W��1�¼����r&�%��#�+��w��ti�������P���<��e���Y�4m�)�_��J[�I(=T:-�A۠�Ly�F���)���<q�hIsK��T���%�P�`����Ab3���a0p���j5^�<1�!�K4��!SݱK�ؿSG:yC�D<7=��> �n�}X���o{2� \��p�l�h��}r�����dpH�М*�p��y�.��9Hs���!��/&�P`ssu�����pY|>��Jy�Yz�}[͊�f�DN���T�2��6O�e.<���Dڊ�f0�o�����%G�᠙����'�(Q^���#��Z* �!�JF(���"Gl|�A^�>
TJCn
d�˱��`A�Rh\м�ȯ���zV�]���ޚ�'o�����~V���|h8R(|�g{��A�]<f॑CŐ<�=P*+���qzB���� D����YO˙�/)q:naPnf��U>��H���~%��Ac�jˌGNK��v�#+������z��i��/���\�	86Pm�v[~���g[��bbR���R�2��S����1xꬓ�[1�X@H�P����s�z1�[{��l�VW\Y��岳QJ%�߰��5�'��k#��2����#���5ux$>R^�Ȍ:�g��=��r7�L�'3�m)���6�Vz�Tsƈ��Y������TU�������Q�V���(I{|�ZIQ睌��E�����������=��o��<m�4�/� &�H(�Gd@h�%�>l^��#]��)��<+�:m!��#�.xgs3�Q��z}z�S�M����P�H�����]� �L��j�ѯ�6t'���SB���3�p�xJ6��0Ne��~��U �֩�x��A8Iϖ����w).%���<t)S'1Y���L�f"B���%X�P���Vua~k�v�0�z��03�*ϺMFHa���y��7��X}-�l��d�C�
-a�9�� Hל�ܧ��Nl��p�$�� K��<Jo�����RI<Baw�=Hs��Y��̾8�U؈��n�����J�)5L >"�\��&_?�o=o����p�Ka��K�c�Z��ˏQH�؃F���%w#=W�C�^`�;9v������g�F��e�"��{}���}u�Q�	�h�&�$���٩�ѥ���[[P��-���Ų�̼f���3}��Ÿ�v��Y�U8��D�Nxn�ks��'尷��������L��
���jh�|ls�|΄y<�|��Tk�w0W<:�q��b��׈�&Ӣ�c/ƣ
�m�m�༝��(�*�7-v��~��ץ#�Rʎ _Q��c7Z���g�F��Z��-���C�\�h&^�A�m�^$�I�iC33f���8E�>����̫[.�����|�D�/B�W����=+�cfH�bU���kf��S��\B�
u[Ŗ�W�:aX�������w����{ۮ�-4E��̮�M)W����CA���`�q�Q|����a��@)��`7�Y���OҺ<n�&�S�N�S���$�j�iz�	�@�� �#�b�7�P-�qU�:Af�DR�[y%�)5|���Az���|:��k V��d�|�ଭ���a��p�~�#CE;b����/�y���W� 7���6��c��=6��-%�,�Cl�.�V��=j,��m�nV�@�8�ؙ���"���.�U��׶�}>�����g��o�|U�N4P��%83�4������!�%�xj�H�z��~���笝�s�T��K�oF���0�:��~�a��g�C$)�Ry�k��}R�Vj�eIo���֖� zt�����L%ޱʭkt�&��ػ��^c�9jit!EҪş�$䑗J;�rxՈ�rs��;I�נ-��Ǎ��j$�S�j�o|�7�����Vw���h:qC����Ȳz��C
rn����qPD��e�I�nd��\�悹�����!��Ǝ��k"��=+J���c/�Z��܍m9�_�n����\�Do'��+�QN��(��x����i]Ax�RH~�&P����`HI��)%m���M)��cs{A�'�S�����f���>��1��ݪ*��x�n?����kBNaOM��Qh_����q�����h��g��ΤX	��G�&?�O`Z������!(�'\��1Y�7���A���9-����S�8��3�$I#{��)��r�d�9��ă�OD�v�m���`WC_	܁Y�:gڄۉ�ݲ�F�U��Em.�ձ/$�,���*�1�����Q�6��lEl
/8�k����vvY�|��Eb�7d�K�2b?6M|���do(4	�"�D��1u]Gw��͙QR*������5�S]���M��L	d[(>��5�
�������<4Ip'������?o)P��fb�	"Иlh�Ru��c��4��yT`��|�7���EB��A��������X��`�	�L@n6 Y-Fk�ح�IX>R���_�8$�"K�Jc'�w�q嬇T��n'��dK���4/��Y^dw��\�����|`K^s�}��[��:Q����i�0���\[�eۉ��5�1~q��);p���B�?�βߙ�¹ �y��0���\�6�X?������������5�7~k��Fu��4HiI��K�y;�~n�W�y��#"�#�����F��),?�[Y>Y�u����.��'�Nէ�g��NR���P(r�:>#wa�3���36��&T)���J���Rn�6V�S�m}ܷ���i�*���A�򐍫����]A��&7:���1Z�Y�ǥ�,V� #����2��mE5z����x$y:<|Ol�2^��O�b�Y���W�W��F����G!�W�w�x�5I&<c̒7_^�~Z�������t�*���0�x(Y�=1-�\�0�/�XsŽ|�I��#@�J`d�I'||9z�VՏ!�h.�M*Ej�k�H���7eL��D�m"�P�gthr�Β7����ܹjs+�=0�~�+��A�s��q��
+n阸o�6T�z���^�i�dq��2�+й����s�<�|3o���YH�c��.ā�搮��EG�ƙ�]�����( i��Pj���� �w"���L���
*�:b?��2�}
��]���^�L�0E}�L��2X'u�@i�O�*�9aq�����Z��:�?���{2�G
j�]:�2�b��\.a2� ��l'�F�)Tgf�2YF�_�E��>'_yr�O$'Q'�[�{���ڗ�a��6?�?$3]]��'GF]�Ƚ��0�^U������%�I�y��ɨ�T[6�t��;��}���T�\1X�3f.d���d�@���+���6
�ɟ5�����N��*���7RL��7�H�g"�*��J�[���/�������V���QJ ���kZ4��lу�h�TDmj�'cyP���_Tα����	���h׸4�O���U�\ &�OҌ��s���m���zH�������#,V�GQ?������f����A'm�:2G�㢴�뼄:��R���.����>go&�F�ɓ�{�����i\d���2�xR	�3�G�o�_��>D�����;�..]u3�Y&��S�����VJ�Ekl��W�o���Iv|tSV7|(�*�n���׭e�÷��,��`eђ�^��r��1�Ha���	�K�g��e��xR�9K�`ԧa�7������`�4�����0�6�wО�TU=gU`�tc��O�I?BGs��kBG����K� �������{m�#~�.�� s�. �]�v�����L�?I@�8�BGB�УZ�^�h��� ��[����I�#3�\iE1Y�"��R�Cw�7�W�E���#P��fP�9D�v!��>ÁҸ*ҽ]�1*l��\������;%�~� d<���[qj�n��SFI9*���Aa����?���ֲ�p���aCdɌ<#QS6�(3OHq!�}-~d�51�a!0�̃�~G��J�(���4��\g�1}��K�3����T����2ΘD6n����>K�_�OCˆ\$ӹjWX�E�Z��L�y��O��-1��f�!��p�8��+
���z7P������ :�t�D�Uٱ�V�I��%�/&�u'�E��a]ou#����0��V��9��',�2������n���Ӭ�����+�N�&']�
�y{uJ�5��#�XR��O���j����U�'	�-3y��.��pt�v�)����){iV)xMi����1��9(�jc��X���-{]˨����-%�v ~��$"����gь3R�$T���N58A��MQ�^%*M��������5m��X���F�1�:�Sy��"��f���W(Y;,�S!W �n�:7���Lwʌ;��[a�Ȫ��O�_���3e�bz�L�n��e]�F��/qB��y����wn��C!�͎S�$Yiㆦ��� ��b��t��p�n����\�����_�.l��xx��%1�%�W���e��[t��߆s�����Y@�3�W���n.�K�������0��L��#���BWJ�"s�q,��اRo����t:�/���Of?�����Å=���\�x��^DWaNXH͏L
���(�{�F;�`��g��BE���+�u�2җ<���C�S �T��s��E��|�B��o-�|'?J�.���R��a������i�m�S�јa
���Ē�v'0��XC��4=�_���s>��(E|�W��ͽ2��y�v��I���C�|ǟ� }`�$E��W.]�raeqE*��l�<���H��B��G�dY^�~�-\��|�-��X�6 ��B�bW�%�e�V�{^\��X�0� 1k��)w�+C�Lƞ�yQ��r�����v����O�8���Vp�� �#��)�Cn���Ю��@�ύ� 7���L��vS3d;��9M ��<��Ԅ�d����bm.�kK�H���r�iv�����<���j
y�_�p5^�|:^�wL�;�f�L�y��s���b\2}m}�Fr42vח~��K�9�'w��Pi����Eo2Ja<f��3e4��.��,�B�ߤ�jg���.V��@]�Uƾ��3Ҳ��=ϥ��>ՠ4�ޮ�/��Gd�������`5�%�kC�pR��!r �^�4;��k���.�i݃+��uZ��Gƛ�`��G�m�FM�P� 0n�0̀�P�|����T��;�g��ڶ�b�j�4kT�N��*ϸ��&#���G1F���.�7�g}���lϺ���B�Bc�p�q��	�HGt E�����	G�3�/v��E���7-�\z?%P��K�[#
cv�G�m8T�/Dww&��9	�kH`�`ё2�Э�Xa�y�A����݂��k
�^�����<�s�{�(���ǥ�Ֆ�'{ T�6ʑ�w�wK�Tm�
��1LO��e�'􌄍�C��@&XH1���Ć��J�l{�b��e���r��qw`��<�	�{��5Sr��*��>�k�7n�<�Y��W%���GR�Г.��\�U���-4�$��_��:��t=La5��h�''C���pŚ�.kz"���r�Vn�2Or�h�G����G�����I��ˠ���B�TQ�Z�G��Uщ<hp�JP��K�����@)t&U{����-��7�c>t�݅Ӭ� �]M ~4�L�d�w�baf����ݶ����s-�����R��[D}��@r]a �j�W��u7K�o��>e�s���Jҁ	[� �{Z-�4���87y���o�x=&l�?��N�����AD��"�7�*���
��%B\�_H�3��E�''LR1��0U��!n���)~.���}KO9𬝭�Rw��"���e���zg�48�(�;�V�NܖV���%��y�4��f᫪�2J����A���ad�Y�&�&�&~�\�悸^ 5��{5�OCZ��c�_�/��Ahy/����(�I@�V�7���sß�@n�5��U$����§^ ��c���1'
�Qrޮ���l��������ax��a�,O��%�$�!v�&�g��}��b;�2}?��(�&b2��O&��X�D��gz�N_�r0�'�Z[g�#��/���Amp�PF��{�?6e�.�#ͣI$O�WBc�#^����mce�y`�Lb��HR1û�:֚���������8��Z[��������۶6�6�n&�H z՘��� D���M��\��IM�	���ޑ"��N���y�E�ih��n
��_�]T�k�c���m�������$tx���қ�D�w_�YrO'/��]��OYϿ&U�Ȼ$�)����>-{��e�ش� ׿V�����xJ8����8���g����/���!��<���������.Z�'q3�����.^�߮11��0�:����>#�ve��!?�����Br(�!��x�ޱ��K���`{�oF���!B/Hj}���e���b���I�Sbͨ�v�B�j��I�<�*%H�	����$����j��Zw��2,5p =��Τg��؟�5��az�lع���-�q�5���2��C.�>�gޙ�	�k.�)�xa��$�e��������F�t����t*���/��d,���L��gVF�U���v��{JT�m?���3l���'^0٧c��~���vŖ��8�@~K��O$h�4����[��OV��`��g��+�����o��)�ޒ����8���Dt(��j4� P�nG�}̇T�E�����0L8W�����PUI�T� ��UkU<r+^��j窮�ऌ�SrE��~bYg����d�_HA���:�rk0���(7��	͂��y���7��N�r�Gagt���8b�0�x�젼[�mY�u�Q���c׍�/� �'�0��˒���4ȩ��K�p?p��W����ZYX0�cS�̱�$*�!�ƚ�D��I��#I�g�}��:~k~�&����|�X�~4���	�|ɫ�
˗�b�]��U�ć�ҕH��\p	x�A���CY�	�P�L� j���v��x;xn�^�%>`,:����ѵ�y���G�Z)f��؝Jp�+���Dˌ{����zM�5�_�����h���"�6��g���-1�ԭ��� �ԝj3����4�W�����za݂^���x�߱�˓>e�+/Cz���1��W� �n���-�oI�}le/k����\J:K B�k�4v��%d��+6�C!�c��݄�y�VwK�����+�R܅M�Zn[	�cFy�x���bs����bQ{�z~!��R���Ss�_�cÎ�/�y����rH�g.���!t��}���p�'�\ރX��쩜aNv���m<��y�j��o�����*7�~���������g%;����,oIH���e?0��pϖ�'O�������ni��$}?�y�2�_���w�M���T�n� �?��1{�ݒ�\]�Q�����Ai����h>J�g�z�x�b�:�z���6 p�rp�Z�Q�������(D>.%��N�fL0�^�k�:; ��_�kbs(��&G��4 �/moǛ8�;R���p(��g5�SIK���9��AX��5U!ϰ�<�Z6���.�w��4�)<���ޯ[���ŋ����$���?�5���Ij�^a�-w7�G\x�%�(��`n��9����C^.�!��;���./i�E�^��[r���CW@m�ov�~��}����C���J:�M����g������
P��ǮȔ�lT��Ӌ���LĶc$��i�-�%�4��I�>��ï�];,�����P/�|-K���\P���|�����sg�	�5�J��0�:N�G���J˿�5�����bk�#v��R�5�
��ӱ;r��)�G�"K[����^յM�2���Vw�9���l��k�e�s��n.X�ZZ4�p��K��!��P8�"+3�{G���k�L�{
@I��A>���S��7�f�z�%�hN�l{Z���X�8��3H4��9͙��	�T|�4�s8�>��ʹ4EK>V����$�ғ��I Й[X󺳶�!�:�	�
;���g$t�	��<��
����[�zw(�0~؎=�ʭ���uc�M�:]v��uN�����Si�ɫ�\FRlQZ�d�҄��DE����On)-� �����B���՞w� ?=t4ꆢuX��Q5�n����	����F묄=t>����oCl���@��%V��ϭ^@�s�B���1R9J�tj�&���ܓ��e;����l!��'lB����.���T�"�)�/�`��{,��9�rF�G�Ú��F
��I|.ۜ�y�W�k��|�Қ5��[|W�"@gLkk�8��M�Uj׵?��?"�mr�ih_(������=�DP���#�?�N2�Ћ�T��7�(� D��	�W��3�S���J���Y��%�=�=����n��1RP^+�B����"�a$�:�P�@�mNNk�ǂ�$�V�!I8_��Y�2R!� u�V2����v�Њ�������R\�s,�}a�S�K�o��h�ȗxk��OG:�1�_�h����T#�\�a4UM��8��υ+3S���� �)���y�)z���8/����?�:�{�����F�:I!:%�1�{y���sŨܨ���ٷ�E7�����ǌL��y#t�����P��Ӂ�� y �G8�ɧnqW+����Ax�3�[]2�~h�
���n�u��؀�E���송���`�o����!_�A^j�����p�{�%�V��3��N�MT�Y$����d�TI�O��N�����S^|�2�sx��q�w�H�{��כ�a��O&�������٣�@R�ωC}�#��Ф���ɣz>�FF#��k�����ギQ�b�zF�V��)��.FG��벍�u�'�A����ؚ�'� �M3����<ŀ���N��SPM����:�rϻ+ޣ,�
<�����B�s�ۮ%��μ�(���%rv�Q�8�1G�{"y����>�S�Kx����l���8K��︐�������1<�31TS;�$l�[{�5�����ekd�(�ƴZ�:�f.,-��2 d7J4>���d[�؆#�����Ȃj��X�{�@{5�mǟ�|c>��������xn��x�,��eM2�t��O����i�ɠ�i��n����Co��P^23aÓ�R�h���S_�\Y���rTY^E�P��&�^�i���@�u:\�w�h��7�,��)�r�,[�/�/�Ie3���.�@-��Y7삧�F���۟������Q�َF�O����m.s�x���P,r������G���|4�7�I^�4N����o����HUN����$�R�r�#�%3C�%#Fy_�	�_�D۟S`�f�`�l~�&��9Az:�n�T%:�]o�`>v�lBR�����[6�ڻZ"+��,!������y^��ABC(� �>C��7�\xj�*��4Һﴩ�||"J�p��b)?V�&k�� r��A��&��#��#�q1�ַ5F8K�4{�o�y����O���\&���@��dZr%Bf�l��T;�3��ZNl�ξr�#�&Ŗ�أ�o��a>�\t�=4�������ͱ���� W�1_w�-V�l��� ��=�5��rpL�)3��}�a~Rsn�;[�{#d>|�w�h���^�SJ���:W{O�����yK:�������B��V��J�|�ٻA���;/�v�Lx���{��.�M��\֪ �K���(x�ޖ/.:�V���i AY~̂,p����+����T`��-������T��U}���zdX�8���{�o�m��~Sa>g�m��x�깯��PF�'����.
�U�梜������>bW���8=�Roj�n��F�w��n/t�f��z�0���P�`�$3�n��$D�(I��q9�?�n�
"�pJXt�Ʀ���8�:��g��S�!L�� *^9�X� 1�/5g֯�����dG|..�x0��\k��1��u�s��h(l����[~��_ӟ����u��e����Z��L*��9S�B[�"jU>a�UZ!��&»Rf����8�8��3%�� ��+%�?�z�V��)���θ��ˎ�pX�p3����_����)� ���:�/cD�I"���?���P�[��k���b�&0�v�|���-K<��j��f>��5�c�R��C�����rR���k5!�M�C�$�N���=�>& ���L��˚~���%�$�3�$�I�|�G�2ԇ�q� %�T@��-��żp<����Ͳz���1�A+����f<�8���Ԍ��[�.G�"O����hVV��bs��e+@y]�X�G9���[U�2��h2{�ʴq�����r�4�:a��y���5�01�E�&9)	�&�^��zȱ�o�^d�-�P'��
왉�N[ͽ?Y���v��KDS� C�L)I�cA@��$X���Z�,$p*�)��];�V�������ּ;;���XTRh#sa��Ň62�)�^�"��,�Q�/pY)o�
�=QF�6�Y7����cp3�q���u��I��i��טXB�bG"�	.T" o��#B�I���<�X5�נA�[%uꅭ�Y�d:]پ���+�n�pk����s���-^��^t�^�r>�k�[��|�ܵ���>E����¾�ujFAa~�tS@��d�4d��&���02\�N ��	���V�� Q���j�5%ɨ�Y� �uB�9��3�K��2��t<��q�Ϭ�:�uB�k�i��A5����%w������j�%c�C �4V�̕O}�Yגȟ5������4��DE���c�U�p���L�_�~��Q� �@�&x���'OI�WK3��k�b�@�x6
��DHh��1!�6(�� S9,�&��'��=��
Z��5:u�<�L��j?���^�A��)�O�"i�u'wU\c�Ψ�c��\fW��);н�b�|�̡r�%�0�]��Zfxr\���r���F��
"�-��[�x.��k
8Tc���h��#�jR�G+<��z�g�A�O�|�f�2��QS��{�1�򯮴LPZl�גҨ1^AXm���]1h� �%�8)-8�kTz��P7��s֙zHޡU�޼;_����@��Uԭ�j���ڢQ�mFۆ�9�����,0�t"��kJ�P	||�z���#���tT�2d*_��QR��W��g��M�.B% ߀s�߮���u�OH1����M��b~k�Y�WO9Cǈ� �+�Y|P�1 Hz|�iGD�@Or&#pj	�I$��q��bʘ>�'��RFr�LT�)�6���)	���_�Wj4chŠҶ"� V���B� 	��p�/�0��A؇�IAI2����i?VX^C@1a�"Kθ�|��b\fXbp��(��I��	Zr!$Œ��*Ea� ���;"^�������g2&inr���$�D�w[ݬ���ऱ&�&�(-�e~e3qa�c�&���������x��'�O ����g�����?��{�� gtq�}x�yPP�QͰU����F��z���2��V�*R�����q�L�Ď�&Z)���ײ~_Jx>��?(�ϧn{%�?�EA&�d{��+X��!�����C�\���4����Rn�ڨ�#Qc_�"��t�6-ۍ��M�����u].�BZ�� Ac�yA'���5]f��1�|��>������'HcDI�W��u�[ޕJ!�G�@85u�R�+J�g����Vu��`>~��p��p4�z)��^�siء������$4c��/��B0�X����,{��,��� �a���4��wh_�B1��G�����.����AEi��5fΡ�B�,b��f� 6�}+�1���VD��U�����dt��ǅ�Kne�(:HO؟"���?P}N�X���f���UK&Af��_w�^J�>��V_�:,���D�p�r|?��^����7�������Q	�P>#l���Oe�|��\�h�D��bZv^��������H
Y(G"�`�ʾgư�Gk��"�3��n�+�m}�]vEq�A'��l,�%��Z�])�:;�g�Iڱ�DuÛe`��r9�q��5�c�CZ�f���ɜZ8�ț(��jY�qĖ8�����2}�O�.��	q�t4|�飨�A`}�m�	1"O=��ң�Ua!�!��w�L�Br��F���;�v��>�k�x�6u�x��Ĩ4���ݍ�^�r�1a��L@x��#&�+��U�bK��7y?�D���@@� avG*L&��F�����a����h��ya�iUˆ���o[͋c��4�tD!Q��츅AY��3�	��j�aI|c��m%�-�{i��0]+�^H����=���潄���\O���t���ﴔQ��儰Ed��D�޳:�#Ԝ�[W����j��)�����5�3]��l��kټďh;z�k���Qy]�}{`~x��f�vH�F��1t�S{�!C�u� �@П��L8t�\����fٳ��x�B+���Sgt3v���H��՘�Sy��-lz�����L�����|�S���y��������+�����H �k���w���1s�� E���	��!¬%���)|�1W���1����ˤ�����3�6���>ő�h7s{�h�P�	_C��W��Y�BQ�7�/
����r��� �&w�C$6��j��φ��3(֘�,�H f�J/j�w�=�|j(����Y�������@{�೫a �ՕT���Ӛtt`]��dUR�x��A�á~�&'�a�x�cI�k��rs���h�5J  �ͨr�U���M�ϺM�a�QW�F-�����&1��m(�P!7IC��\|�����:���3����%%%�L��H4��y��Ar��'�By�x�m &؟ߣBz#&P�������S<19��.��[x��(�asT�X�2��[������ñ�2��a@�������U�Wm B�Z�j1��k�'�G��=���<����Y(��4O�G�R�Z�D��b�H���6�:�|É��&�:w	yY�1����W�suJ�	�F���:��A������Z��FDH�;t���nYe��}F�5]�*4Ӷ+6�Qcx�=�T�R�0�(���u�ra�P�)n�ή�m �^���� A�H�$�kš%"�H��wەK7j�2�"q!��+�j���,��t�@�;�7ofg.����R�=@d���@��h)j�i�Պ���#�����xv�ӽF�>��?�z�DN]��l	�Q�wY��f8&�U_.JCΠ]:8������Lu��X ��z�\fe>��g�Q�	|���}��lvA�i2)�"?o��~��t�U��kD���tA7�������~���>�>�C�/��5vo�q�`�A=�M�>OJ��R[n*f�xw̉CB��X<��y���6C<q���PǗy��>5���v�dv �>`#ᅃ�\D����f�5Gǳ��i`&w�#`�����/���rh���hP-pO��b���[�b
S�L4ߙf�[��T�t�ټЧ��x���S����^02:+�s�k�J��/��R2�P����&)z�oƓ�)	��f:�A[��U2�z�	��k�r�� �����2���a�-�s�]{���(j�=(�Ti#JZG
e���^QƏ��່�p�ؖ����Z����k�(�uY�&$(s'Q�*D6���ʚ>��+�"ky���N���A������T����(#�̯ϐY��]��?�I���"+R��M�@��Q�G���2�5����'��E7yG����s�Qu��{�D�r�Ym~�f��u���+�<���R��%��L��m "�Z4��	F �B��@��g`��~���o��\Q.�}����}�n��T���	q\A𤒞-��*4�i��~�f��_��˲z���S����!�G�`�J�{a��5s��t/�2TN����x�]�e#&�>H�y|mTM��4�����4��a�p <�G���^��x�����Y�ܐ��]�"G���e��;F{-r� �1�9< ,Nvn�,�2�h�ATG�I8���Y|n��S�:F�9<�����   ��ܽ]S�ו/~>Ş�E
� ��j�B7SX/6�&B�ʗ-�u	h�/R�SS%#��T��h���Ƃ`�$d1�Q�|
�ܸ�I�^�{��짻Q2�9��������^/��[k�r;���`�p|>N�q��^,@��}dY�5�����P�Q_�&�Ŧ��}�BW�g]k�����Ug�|�R�1j�o��!���%�˶�
O�8��V(�Z�S����Y��U����������+A����(ꀩuYO5��v[�=�^�6U � /.m��Ìi�k���ܻn�W1�W�٤������-	�Ywe����Am�(�������3db�4�v]YC�]��`���S)�,��Q_Pg���机� �r�R�[f'J�/�o�R�����b��ɬr��3������԰�6A�7|��>0"_j#�*�������|��i&֕IB�߿&���r�|SB�OI1_Y�y��Q/5��b�r�IҒ�n���:�POۃ����m	���+�?35}UN�z"J}�dյ���0r�~���|מbQ��,*P'FlKE�X!�E4����������/��d D,��[��D��ufYZ$���^[��e2��K�t�B>��T�Z��Ϗ\�����x���7�1�*�ش)�9EW4U4'��5#'c�A������%zW�Y�S���䅷 Кc�S��2l<��'Xi"k���@����-H\bz���91mĹO�:��r3���/����@qU��¸7c��d�}��_��[��oċBL��Dd�<��a�$�<>�|��P�:�BH���k���"�!������^�
���ZgN�Xa5p6��İ�M,�	�_Wƛ��VY�l(�Qfy�w�']&��SZ����I�&b����ϊ��,�0́*�	)�J�(�dz$Pc�E������X�� vb(�(e�i�J,��ՎCz�2c5�6R�*.,���5��l����M'�����tZY-6۞s���sL{/��`���)�SY�oL��Wd��o�2�L�>��:�G撌&:n��U�ox#4��^.c�G�2�oà��AJ�(|���+�;����f�Zڗ���^�����]�����{�eyg�i�p	�S԰�/��~�~?f{����G���kk��H����v�W"���'���z(�Ԝ�:�p�9ﶦ� �P'!������:�lv`��6y��N����o�#Y�/۽��8��G9���cIl���T�0����u���ie;��,��:2�X�X�~=�������P���^�g8s������L�n1k7'��~�x�W�G�C�1H8E�%��m%R��lo���˪��20�S��9=態&��*B�jR��K~G�t�{�6�)+q㣣����
���Om:�>�(e�0Kl9TTA��c�^�n�^Hh��e���p!{�?r��$UX��tw���Q�nϰ�Ҫ�0�m�苇��ﶓ�.�O^�m��PA6���
��9��ـiy@\�L�I����A��V�n�i~��"�K�oC����	�ЋL���#��rg'>pC��C���&��-(#4_f�r�WV�WC`���<c�[&��K��/ּt��[ruo�Q�@
�lk�8 ��lW�2�o[�U���F솠MK����9~�r��e~A�� F�VG&�S�ǂ���L	?�������}ݰ6�`�Q·w�U��S8���������3g��Y[bh��R�%�$�<��u��$ja��#ͺ��}uhd׋�U�WcGu�(f#Q|�"@�j�(���d;�%��DFM��	�lm@fc� p�U�T33pSPUF���(��O����$�	��U����������n�v��  �M��ir��E�,�T�;(|J���������K��ܜ~nZ$����ծ�?����<o'녹���OV���Y��fOܙ�v�j�*�a{ׄ���\��X�=�i�����%��0@��|iGB�G��[�ꌱw���1xh֔�i�l��1H�:��X��n���Q�]�,	_�\)�#Z6�p��ݵ�]��S-�4�����=$��`Q#�Es�J��M׮]��Pm�	</!��H9pԧ�7O4,&��y�����vPM;�0�X	ȴ���H�*���nN�N��i\4��C(��vY�K� a]i�дnTr$�6��KC6���A2�:��t�l�]i�Ջ��	4���$�+��i�iE���K�/y����`il#��ʅUOMN\ޞ)g�6���:��<���a��$��B?�=�Ĭ6��y�dW�	�^�ƨ�y��:��}��.�>&��X�@p��xB&�eo%�z��:�o��r�*�ڴ��3A�4T����F�D��"X��g��Y�Vס =��XW�7���<�]e����������7�GO�C��:` X�>^	�j�z>Ѩ���O�_�[(�C��f'$&Z�t�ة���O��@�ơ��TE٫�V]�`)Mf����K�����o�_��}���(&-N��t5��pTh�A�����l�]Tӏq�y�Ɇu�B�s-q�*�J�R	��;僔�"`�����-S�R�^��vFB`��c�bw�Qs�yv4]�l���>�Q��ʲ��w��G$��^z�۾��{B�_�7֔�r=H/-J�g9~ ��.��D�<o�<*�$�S+�����YT~mv��ɐ�;t�ù����_)a���L�v@ףZB�v *�����3��Le�D����'���7r�6�oܥhv��I�����ו�/(�(Y��qYnH��d�Q���������?�G-N,S&�Cq��y���>`���P��	|���ѣ|�K��c�vc��\�8��BT��B��n^�4�(m�Y�|81��߅?�?c����$���kҫ_�hw�>Z=�'?�Pݐ����N�>�d��W� �L���ZMb�\�'U�փlA)D>�JVM%�.c��A�g��/B3���i���o
��se:-��_���`��Ǆ��8K=]�(�j���b���N�:]l��Ĥ_�f����'���I(�A!4�"����4��f.)
njs�ٚ3�׵Fm%��z0�΅� ����buя���QH�U�*��I�j�����{��6GX`�qM��|�ռ��q��̻U���Z�	_����c����d�	��^(~�m����|�Ж��A���3s�a���#Eg���h��ff|���G��c�Kz1:3:샪z}q�]�RH�S
�F�5���ӻ���y�ۖ�!N�����b`OMl��v��"�,�d8���J����I���Jϭ���(W��f�~[��9ݝ�]�;gɉ��#L�������(F�|�y���`~V�L<4��$�Q����o�'V�ֆ�):N�w�M�`spX$��]��"��K��N���r��&��+۱?�U�Fc�\��?�v�Q�y.��dɧB���ՑI� ��8��@k��#0L���jb�5N�g*����4?�Sx��%Cd�E�J��(�Ź����U��P1s�S�ׯ�~Yy�S�L��v�J�Om�6��n�$�*�vk��1Q�}�7�sC�WԦ4�G���5k��R�]���Tޏ@�(&r皵��U&tm}l!,^c"�sO+�z-2dtB��;�D+�~�ii��P9w��.�@_�"�Hn]�����#�l3����sE�S�cq#o���	�҂d���P2��1���u�wӍَZj[X�I�|cܙ�~ѱ��xWa9�4���j�L�3b�;�3�ȃ6��~x58�~L���s��BߡE�y�["���;5El�p�{9�y�e���g�J1uG�Yd �Tx��:���
�/%��"�i˂3�뺩I�w��@�W��b��R!�+�ɭ:~E���+�3���/�;���.ifi��2��T�=�xP\WhfGE�"[�W�y���Z?Ȅ+��V>�ؼ+Z-/ͩ)P�fT�� zZ�`N�#M��I�8Y�P�&���cP��(�4KZ?���T��[!ۺ�L�Ap	����5[����%��N��(�T�̦x|ԙ���*�	z~��q�����j��&1�E�����g���	s��T&g�Ԋ8��.s7:�l(�\��T�ƫ�M���DFb�8,���K�_w�Y'�8n�<�/�Q���*��y��bz���.���Ӌ���I;�SWE\��>jK�4k��7�a��*s����Ӎ�V��Y/�4b̟F��1�7j���6e�ܮs�53�q��+8g�I�f�MJ*!�a�W�{��6��j\�E���bw�|�����v�+�R�@�r�����>D>��8�%�d^/3��:j�f�j�H������^��@k�;��#�TQug�S#x%��q�*L��]+f�U5M��@��6�ia����?��;p�ڼ�*�{��E�\Y���ׅ���$�E��]-��/6W ���� 3j����׻^��B/��0?�&�C���aMw����ك0��ߞ�e��47T "�8+ߥ]5P�S��i�8��Ղv�?���P���NF�g���	�o��ڱ�e<b��Mυ��7����C>�0���"��	��ӑ��j��.q���:�{FgϽ0��U�".� �Z�ނ�Ξ�/�3��уn�CXH���.���d�{;2�GYgk��N�J9�_�Lp�5 �b�:��vC�cM��3<��ň�R9����͜��R7@�e�?��υ��K+�$1�$�>I	���N:�Qɡ�x�N���#rQ��/��s7����2H�p{��t��D3��Ṿ���K{\�i�7��Ws���|��+S1��W�x�,���z�T��.\TQ3n]�I3�u�y%絷����ʓF��<Tݪ*�U���i�ಣ6�-dc֟��:7WIE)d�wO(wH���d�GE���da %�i�V�;�#�#����vAF=7l��̬�D4p"*�E���2�<��Ps���Y��#zF�f�f�.��|\
�	�����r����3���:�S�tN��.��W2/�)lPy�+5����\J!��N�X�{b-��{���9�J}����w?�Y;���\�B:7�� GM�H�Ĵ��j7ٚհ����k7�vM/✕+���Hszd���4��X���~C�D_|LY�y�I�N���3��}�Ԋ���&�Q�3.�}��;�F 
�ݰ{��hV�5r�o+9W$_ S����AL#Bh#s�P��LÊ�"����� UaX���(e���.
e�!���r,���h��,o����b/��BY��:3q�D��w�+����ߖTl�:3� 5P�D�C�>@���+�4ת]!d����g�b�`)���RM������6�+vυ]Uz^�YP���f��Pjd��r‸~�E��'�].��c��4��R���pf���/Ai��L3�u�;<��S����!M�����+�bޭ�_-��^����QY����	�|��������W#�L��H\�H�_�]�c^Ĉ�w�N*f��V/�^f/�H��ay�;.}I�޼SO
�W2�	��� ?�j����4��\׳�V8[iK��`}�S�3��qb�_
���팔��VȂ'ިwpx��r'O�k��܄)_����Ω����s��/(�Tv�+��4��44j*vq����ĸ��_W��t2�_�ώ�
	��3P� ~��/ɨ������!�CJ��c�>��  4�����o�>F�+0����x�6�.w��G���o��GB�t���3��K�`	�S���[�A
N�KWy�^��WL$>���ȣm�N�b������0�f�G�:�����1BE(b��@	��[�w����i$���3�=c-��.@ }���=8��T�"�rVU�N��	"�AJ�NcU���y/)L䎁��2���'fP���dgq6��$������kUB���o_��ϊ�;����%��0�\DPO�I7T;�my�����`��|�U�4n�f<ɇ)�٠����{�ѹ��)�^;���`�J��|�my}�{�Pi��;��f�<��h�efFA=	���	��G�~�ʧ)�ط�;��5c�\~4�K90�	49���*��A�������:�����YQ�[�Q#�t�2���Zۋ(N$�x�m�Y�����m\�=0<<]�B�q�!�_��%f�;�֤l���F)D�Wrd���JT�ص��	b)���{�S}&����4Yy_�J&�δ̕�%�y��Hu`�?
�|����5�i=��7G�萠��ˠ3�A�ӶΜ:7va����κ�|��i�i윛�x��S?�p�R@�fâM��C���[z�X�_ށ�����CP�Ṕ��P�7$w�/C�ݮ�¨{��c�Q�bl�I �9�C��b�xA��	1����C`���-EDݣ��7 V��e6��yW]�
��2%�I�ƎV/?Ψ�p�ʹ�{m�g�ӛ%�)�Y�ˠ��Al�k%��\H6�\�Q�'*���,��z�L�0�随JF K���<�ި7��vmV8:���7�X�p�$&�&�e�bn��U<X1ڝ%A`�p��u�_�§����y�T ��ƀGf)8�F�ڱ�LB+al����"&{�<&@��HN#�WJ)��T(}�)�t:v@��*�%֕5v���{�'��}�Xe,N�hV�+M3$;���c?��T]�:�{���U��xٰ3x���@�xԝnv�����-��W��K���y�z����'ڻ�#r�&�o��p��^p/�b�}�D��k�� �7�xx\����Ǵܥ|3t4k��֤H��"�����[A�|���?w�˅M�?������/zg����K�t�8rJ
�}i����?̟�*����{�ٕJ���(B�%g.e����B.U���ԏ=1��s+½��M/�q�s8uv����ά�:�ؒ|��S_��fb���ړ]M3�r{E� mc�{���!�<Mi)�����Ao��X���(�t�Q'j��9}�%���M�|�iO�aW�����#�&�� KMZ�C*!�K�~ɚx�9���?y�xV(��-0.��k��8'�ԡ˸�J�-B�,Y�݀1>Հ/�;�z$�����[eؿ�	_(,��������lr� }��:-��6L�|��� K�1�^PsD�)KQ���Fnf����6�FNG?�.s����<m$
)h�dzF�ՃA��W�>��}��Wz6"E�-��0AV3����I?u+�b�/����7���PN�AG�:�ql}�ME�����DC�t�e��9���u�q"gBH�� k���y|�����TSʙ��5�����'�?�[���(?�@	���U*-V�a��h�J�����˼Ӂ��3d4<�jpV��x���ȧ��bf�� 	���yQ�g�� ���I��������*���������o��/��ֆ��7��'��G�����/?�:ڙfk�?y�q�Ľ��������B$|+z�#Gx�כ����2��h��|T[iR��m�Hp�+��ӷ��ɼw���yx����_���?H�"s��׵�ҏ'����C��?��PŽ��{������^�؅����w�6���'x~����\m~����?�/rx�v�h���?s�`�/Ѯ������]���'���pZP�Я��W��z��I�ޯ�<���M��z�����Wa�_?wG7�9�������Rp73�;��۝���_������6<ɪ�����I��\k�i=����۸{�����>����Odż��i,�~/PXw�����k�4_��y,���'λ;ͣq��z�̿�*��;y_��h	^ωع�W��(�N�T�I>�s�º�����o�r�~�� ]l���~mV�'va�p3���}r�$~���kE�#����në�އ���=����n^��wÌ!�����An�D����8�X�6��r:��6|��A��*�O`5��5��?iˬj6^o��Z	.�l}��
F�-,�������u��	R��ۇ��?��y);���h�� �͟H7��Kl���K��^(`�O$^t�����y)�OĢFO�#�II�Xgם�DGu�PݢB�����?�>7;���x�˪y�ޡ�^���";Uh2v�����@.�J�¸o6ڍU؃-�n�(�a+�sf5�'G��ාb�-!h�V�#�`�j5tf���)�U�w_%>c�>�����y��"z��c��E{���� ����ݰ��>z~t���e�-���N�o^�z�0i�|�ؿ�-����$��F���6��]?hZZØ��+�e�sŋ�_�x����{xbH�����X����1m�� ����m\���!��h��'�Bř�T��K"�a#��qD����eMx�a���^���Q��wQ� �՘?��m�{aE}���jUT��X���H�c8����i�KQ�(�>����T�����;���C�������4����ڛP����Kx���/������x�G�� #�Ʉ�4  Yu�2r,�X���3'�;����?\=a������ȋ0��P���V���UH-�d�!s|`��"��2�f��z��p���w��}0nw���F��F:��h������qHn�A�ɒ���{I��p��s}�޼>�_ߡc��t󍣟É�>�ي�uvpS�D�H�B^j�a��f"���+A%����
���W"�g�P5L�B��1��d�A���;y%Lv?8l���	-��'W�{1{�o���_j~I�{�>�=��k�	��-t�?yMש֝���V���z+��SD ���E���ls(�il�QJ.��)����*P�4���N��AH�=4%�Tp����[h^'��G����5�eM�ݜ�3���]p&��)6 {sXz��Sr��EX��
g����������-�?���F����Cq���6��ν����wè�כG$K�!̪^g�[T�J��]����prU��~����?�,ʎ���)�`�nLҢ�Gt���z�Ǐ�o�Մ�gƭԁ	8vQ�J�,x�g~-��$@��ȻTl���Y
RĤ�ayF(x;��J��%<�bC�u��5 ����}��G����
 �jl�W�=�ð����+�=O����x57�a�#\K�|c�Iz�U�o�*c������-�C� Ϧr�������]ǆ��a�h �vL�l�P>87H	�^�H��cטr38�k���_�"~��1D]+�}쓱�|�}�oz��_�����.�_?%I� ����$k��/ ���p��#�E��\mvě�">��6��p�\�!&�?9z��p���%8�/���ǻ�i@c�G��~|D��S����t�%���%�͐�q>z��߼��G����-�U;xJ�m��$Kk�;��F+��;�Dp�4�-��p\�k�U���<R���S�fZ��k�,��`�ѵ�� ��������-D���\<�d�#�Un�A�*����7�3@F �~�~[v҂z��o�c�e8���ʿ6_4�m���A)]���t�9�$LQ�fia�� փ�uh2��)4Z�*���>������(�<!p��'((����U��W�L�$�%fz`곒y�^��,��uÓi@��pS��$z'�ss�L�&�{Ae`d��n
�ѹcA�p��Sb��k_#�@�]�/�l���,���]�Hg~9@M7]�b}�;f/$7= ��8�����Q��R<ū8߬�y�����㑳R�]��@yy�ݐg�M28�?Jp����m�@�uc����͂�_h,м��	�sʩG�"�ޤ�lN�Dh��,p!8��0��m�/?��ϰf�3BM�MLA}X�`�>I/ @m������n�#4�|L������3��:�p�>X���E�9��-݇�	��iq�Y`�T���x<�A�;�u�g!j��`Yɾ���'����AUu�D+���>���3��K��|�O,D����Z��@)D�U4����/����*Eir)r� 
�Ѷ2\�;(<"���lz'�zC�`c>%���E��iP����3�@0>y��;���f1�Pd��R5h��m���mx��w���&�F����\r��a?h��p�n��O}>�\2�2����9�,��9�uL�9XY$�z��ߚ�{��@%�D����U�$�w���q�����<1�e'Y|��&��ć��[�xba2��| X*�-�3keLfs�ļʂ�YfO 
�b�>�@�Jۣ�b�1|p����%Mo/,Z�Z
��:�Gn� }�=�g�B��%��Dzd�����آ#cY�B� ^�0G#?�'�h� ��)�v�-j�&:t)pM$q�B>MY�	6�@�k��p
��䝸)i�Fۯ?�!Eж	B�# HDk?����ao�Ⱥ�~��`�B1�-���.�U#���'e7��~���&�l#љ@�g~��0�J4 Z���s��l��VV�0.4Ak4| *�_���?F�ԇk?f�3J�&�zt+@@rl�5g��r�֙�R�3��]2}�J��fj�򈒋��z�<|�4QJ����qδ4�5�p���(�4\xR#���жZ���?��DC>���\A5e$���I��c�ݫ'�t� �i*(M ��I��H�����l�t]0�b�_�AŐe�7�	��̓wq�K<��S�JX,���9�N���y��^�ӗJ����3>�G�W��Q��&!=Qr��l3���"�t�����J�ݽ,����Zg��F��d�j�%'_F��p����Mń�'c8W�/x;f�|I����������k�	zZi:b�ޠߧ��Cx՝B)���1��L�oD��1j���%^�4uΫ�&�%���r��<��k9��F=0d�k���bS �9��1��9zD��#��Ř'��O{{�LG�kj%��6z�G�}�-�')E��$)9:�65̀�~% �^"W��Ʒ�����tmdH�?@I��(+��A]!��C�j,�O��4no��WӿH��+���ws8ʜZ���n��Y��iq���b�aA���������%n΅z9�QxcF4��5�T�Q��Ű扗ͣ&���»��"�]��(Ϣ����]6�Q�	p��v<�ִ�E>=PA�}fY�>�Ѽ�P��E��t��Yhy�~�"�|���+��yӊ)���`���O�|8|y�h�c��#�-h�`�E�V�6A"r1�!��4m�+}�8/߶/�[�;�>6����<�j�����a��ر����B��+�[�1�ma���p��0�{|>7�N����e�y����&�G�	-)w��i\��"T�UW��#G��������`�p�	���+�T���%9�`��s9�Cx�lS~i�%eV#ِ��Y��?b��CdY{��|'h�	G�Ր���bF		T�`�.�G9�'��
�[72�m�S�)�:�rg'>h[���
�&g
�Kg��Kվ*va�n
";���7���}��D��v��g�GuCRTߠ�ӻ����>��@>�0�:a�/p����O���E��m��p۶�ܻ�|Iq�v8���kʶ�^��W`�'��Y3�͒1�$�'�.)�g��j�3da*�-�E'j��<�v��E�@-��>۪u�<�ݛ�~u�#�(�t�?A����!��zdG�@�[� n_��$vȅ�<1]�`�"xx2y�$����'�d9�GRN�}ǜ{��Й����N�V�c��V���0�����#�u��m?ͤ%/�ƿH`$g����:σY�Q�䗋ax�#ΐR  ��l_�k��k�|���$� ��;����۸V�����6ѯ�蘹�@��pǺ���p3�$H2	�((z�y��><�_!����^N؃��C��ڊ��x�K�N~�ȭ@�\�����<S�$�y��>�����4�A���C��um��2����2�;~'ّ�c}��]��ob2��	�a�5��,�e��C�~a��D�4Q-�m��럟�P��=Dj>��Ǯ�8r��rWg^B��x���D7��FIt��p^j����(Z=d[()��v�(^��L�7�O�1�4+Z��m�z��ڤ�(��(��o��ij�(m!�Uް���eC�7���0�AR ��.��Xu-������>�������Pi�#!A�u!H/m�:�X+�qw1�͎�w��;م�K�	� <��!qup�M&,�e���������4���_�ڟ�*=H��`6rLQ���/���|��~�z��L�U�l����+̬./+pG�m�����(���^�/!��#ץ�ܘ�`~2vG���Q4�R�ѪT�2w^���~٫SȪ��
b�����f�Y�"C��1h_�>p�����dj@���&r��\@�K���p�9�8��ՠ�4��S����E���m�A�,��Y+Yg�iUz~��er�*^�w�;`3���]?f���n����K�����o�M!�5M�6���"<��E�tтINJq�����h�������-u� �6o�{�M*�Z"��}�?�뽯9J!㔨�� ��s��Д���7ܵF�A;���t�I�������),�]
���r���7=)���Q�G������X���or��H�$�%�s�]�.��=����qL�?��P� �"��-^����d!O�o��ɿ�������Rt��Ij�Ԃ@{Q/��?H�\f��ƌ>ݲ��tڈ%� +��a�9&�|��V�&�?S�xa���n�ܙ�"}�+�Gc��Ţ5ǐ��ڷ,�N�}��wو��i:��E<,���M�3b��*����Nd�l7ĿȲN(�w��a��]�'E��Ð�-xj�ВY#�{���R�'�P-�rb�\P}�\e�=���,i�H/I6W}�m�z����"u��#�
?>���Tm']�!S(^����&oqNF!��%.�����ݚ�V��x��%��q�����&DL�6�}�G���$�x���[����sF���/z���g��&X�J����2f H'��7Y��:�BEg��a�tK�3�K��H���\1�ׅ���v(/�P' |�=�ao����O���U�j�����-$�>��e���m)_������3��ޏ���ݥ+EM�oкx���s@n�[G܁��ص�5'�h�Y��-mq��;E�A�����t���o����xkM�̌�d������5�!,����tJ�y��X�A|��8����n�-�����6�}A�f����u��06 l�M�Gm�;���X���O���-Iה�^���ۜgv�����;�z�Y�/�Qk_ͅTN~���B��8(SNj���ڂb���jS܂���/�go�4g��4��	�h��5C>a&�2��G�056�m����&��)�G+}p|~���]x#���[�-v2� ۷�7��j�7[`13�5 �\��E�oA	�g��g0x��F��!�XU�8�&{�1���H*�vq��ワq�������36�/�s��n�vX#�����TB�=k�ז;X#e@�� ���0D�-%�h�l;�M�M5�e����I�є�9
8_H� �'+����s��%��~�US�ѷ�yf�b5`���Ԉ�ss����m��,��]^��.�	Й�6 �!�M�����T�z+��ʲqY@-|G��r���#HN�Ӽ�Ђ�v�� ����?;r.�in"��
��
�n+�9�m����R��p;�,/?�R&��|��)��;+S�P�'S1K�G�w&:�L-�������]�wE��%�95���s �����o�|/|�xwX���Z�F<&�c$#�S:{@M��+���6	y��p�9�(o1>�~b;���1m\��=�`0Jx$��
�( U��9��m��\;�%�*�����T=Z�e%r���'��;^b34���-���}��
�ƽ
�� h�]�Ǫӱ��$}rBPIգ%�` }�����曔^�>s[m��j]�a��U�tC*8�I�KAJYky�[S�X�V(d�����(i�TU�.CO8��[˷�<�۟R�]�h������\�:�P)$B�v0O��6��ܰ�l냣�$�5Sf/�Pl~KV�9&י6��	�����~a�&e�L[�|��ۘ�B%��!��I쮜�a��mr�)H=?u��O����y��4��||�Y��7�Z1�H�� ��#d�C�LĨͧZbfbF��sʨB
�A4<P<ntf�����53:&�����#8���1��l��^ji&�Q�6؂�f�j�H�C��^SO���:* t+>�I�`�ۈ��g�BanEf�yDX��� R%zT��VJL����7�D��O��<�p6����A9��vNӼ�mt4�.��-s�gc.���#�̓�)+KBs�s��E�e�Mj�0���f��\ӵ���r�ko�zBfZl��$���E���+�4;�TLuHU32�t߅ߑ+,��͊��v�-��W�W�T~�!{J���啎ۓdg�������&�3�-<��R�b���g���װ���8�2�\!�	���cswO��8������6T:�����1�=miYn]�CJ��!����)Mj܉~�H�bIC)�[=^H�K�Y�5R�\�+������.�����=�ؒ��+�g��+��zxC�I��-}B�Q-����H��\^�%��\/�pb�c)�~�#٨�U���h��WՁ�ۛK�(�)_���^��F��[ȃ�fu�3A�����.��?hp��y���e�Mó�"�f�lCxt#x4ղ���$.o��s�-�36B���ש.�;6�ᶱ�o\�8J�����)���I���ᏹ�5��P��睛?(:������Y��_@�S@\R�v���{��Ls� �ok������0���}?)���*��r���C�	��"r��o�dt�y�F��7F�������.*�I~e�ۦ�#�������G���M�f҂��,�PG\ruѪ��=�.ü+}�R��W𹟐�^	}K��H�GD�	cq�Jί�zI����H?OO)�t�lU���*D�֔���q��.�Z[�Hd�(+�q5��r���� 7�9�mEa1����F�|�r���*���a��L��&fA�p�SM̞ymty��X��3�ѩŶJ��AU��Ͳ��D�$�":#�������Yx1���1�� =��邞G<��먻T� ��?EH�O�E��\����z[X9��S��+� �m�K�]M�=�e�?���H��`����� ���X����7��W�VNV�(�ý�/����jT�s���י3厸I�j@g+,�I�L5��K�Y)��"�\���b���;[=pn-����L�}�PK7����Ծ\�L��ÕQQ	��R�r��	�KÉƍu�8R�����ƶt+-�¤Y&WRJ�����f �cN;N�;j/-;{"�u����"Y�Pa#��������O����������h, �ҏf��GN��S� S���2��I��/R$���q�H���̴���m䎮�{�d��M&�&}��x�gp���x�٫]!|�4����=��V����j������R����n�z����s�J�ک3u�y\�hX�	?��J-sj�/^(�x{r�������WA���U%����˴���L1���'Km�]�wS���7��^)�R"�H[K'�&G��96�kp��O(q�f2G�f&�� @3�ڊ�����j��bn�铍T�]����:q��c87 ���2�[ђJR�4���A�1>#�e 4�w,q������Y��뫠�:g6��q��X�E:�6F�R\�}ɞ�֓��VLĔ�L�y�F��[��As�b�ұ:��NIh�i���3��߰v�:6��l��F�`��׫8Z{g��@և�r�|�N�š�01F�����v�R���9߆�'��D�%��2�6�	����4�Q�=�ϭ��d�+γ��v����q��N��I�[����vN~��/�P&g��/���f��n����'�G)ќ�dd�ÍX�9��Bu։�8�xt���Gx@)��VF��&���U�d�x���M[�`g���ߤ�k2�{5,I`�f��8����̌��1ڴ��B�g�ʼ�-�
M.�xi�I�0�}/�BI�����|����F���d~�@k���^e�μ_�-���ҕI�/y=��L���I�(�:�=�`�K���N��]�-4z��q_��Q�*��>?�6\:�N6Y'ʿR�(ϮEu���>i�\����;ăb�K��l����~%*�ߐq����s�l�9W��I'Ƀ4=2õ��isst��{;ɝg���n���Y��[R�w�n+�EU���ϰ5s�Wx�x؝�K�d��f��Cڮ<�kF���oS�Cŭ]���O�q�4J}���D�ZE�톥�+�m�C�H~tk��o��6�wN>�����(RZB�S�z�%�:��D�6$3����8��<3��lD����z^Z�F���eK& ��m��t(Ĳ�C���P98���H��l��"ɟ&�H2S�ޘ��<Wwe�>�G�rګ}�>'��ɲ�h����y���u��J��C��A?17�4f��D܌՛K�+�"ѐ`|�%r��`�يf�Y!K�&���5	;-;И��8�ʭY(;k8�~���h����Q��&�B���Ta���Î���5�;ȿ�3�/m���
��Q�����Y�eM�w	����3���s��%ouռ�p�YD��$����u2�������F�?��>pe�?^�Ы�Js�:|Jf�};�����5P�Ñߡ�۱�V9X�=�M��o��6T�y�2~���A�P_�\1?�Y������z��L]�Ӻ�~r���B�^��h��jh�<$�
��hn�ଉ��X"9���z�p�_���7L����*�}���O}F&':��U<��x��J��T�a欦��{[������ҁ|Zz�!y�M�p��w��Ub	�c�����F�9�/��ϣ��)]���2N!���~�5/�d<"�N.��̋ʦ�E�e��i��.vT�q�V4�@�����?=���&��
a2�ܡ8��l�WZ��t6Ѥ��W~I�|b(� ih�.��Û}F���\��wD
�p��{�_
q>��z�%օ�N��6D��As����&��.���؏W��B���R�IrX�#�T.�ߑ�
�WK�
���ޡ%y!�b��y{Fv����1'�*��'�<<殇�V-=Мps��֡�	����l[^���l��i��Wyo�4����_QL��kkt=�%ѣ0_��.�B��Wz%z�-��e\4��>�<��˼Of��^��J��m_�$��F4��ls���BY)�P���VJ�!�(c���*±�'?a0䑜��J�`q�u-���F�\�Y��/	l�5�1�������,�A����x��N8�Bs�dP�x���1J��]�8қS�ǌB�P�e��_��)N���ȫ���Q���~M�t�������1�d:_�l��>�k�A����="���nGE^��(��au�"ϐ�k�rEt)g�K���i��aK�o�|d�FhW�(�M���5I|v���8*d�3=�<�Ŷ�)�0��N�ʸ��Y8�X���cc��`c�Q�[�ey%�y)��6j���]A��l�g68ƀ+����"��)���9�u����q�+��S��W���[r��x|��6�b�B�׫����3-ɸ���8�bj+]�`�9SE9������G?�"�I���$���:rZ2K)w#�J<Lo���+���������Ko��L<��R���h�� ��ق\���R�o4���hcs����J��M�U��l�i�I��#�ע\<�u�T�*!�I�<?��j4������0���*n�@Nn��yx����Vn�y��}�K�%�ŧt8����^�Ò�A�����׷�
 �h�;��OE9�~r���>��/ ��5�`@`�HX��r��/�f��U�E�(�'��&\�Hf�{���ڲ�di<�@��E�a���������{��{tJ·�<��xg�&����t����R C��G4!����5�2�h� �lx�S�ߤ�q�e!�]<��/�Ւ�l��仚g�v�S2�Y�?AŁ1ܸ=�]�-��]6����3��@3������H,�I������$��f��?�yҙ�"���-��9M�4/�/R6M�Wɋ�a���Bm����y�Ƞ�-C`�>�8ܕ�m]
D{����Qҭz}ٻ ��G�V��4jAL������T�U=m��2N�6.�=6X���c��k�bMr���)�zt�2��������0"��5�T�R�
�h�����5�l���n�@Л�����>{��y��*5a�\yPV+�5.3�W�ɹ�rFm�C+R�*��w�e��Y����W�����$VoܠO8�b����X�H�8v��(��d�d+;��pM���(�b>�fΉ���z!pjJaa��/��WI�_�ǆW�XǐZѐ����h�=��̼�C�Qd35t�GN��� /V]����JQ���䅷 &��>�et��2D��#�he6t���E H�Tz�(����#���W�����貱\��	�����'�k^�Z3�yѝ�c%�k�_#�:b[w>]���r���Y��]��Ss��🔐��@�?���8�i�*7�5M\�I�g<Y�|m�w欤<�a[xM���{M���X�nK�qF��%�s��:Ѻ�X`<���e�u|Ͽ����K|�N#�,� >�=YU�D�ݾ���-�C���}�Js>&~�����)U��������/�)c��T��S�?�6��#��!^.og�;"~���H�D��!.��O�d���*�3�9��8Y��l�^�7����in�CY�z*;��]�����E?�1�W�Y�U��C�$��=���%�
|F���̱�!�W�{�#X�iRkx�p_>xC�{2E��<4�pM�;��1EZzՕi���?ʦ(�@���.�6����Fz�+[8 ����pZ�qI��X�q]���2�D<�K��A�lnj��H97��+d��_��PS�1&!f+�� �hz�n��"o���,�|���,�[����7��9��bғ�[�PW��`'��R%Ls{�%$k�.UD�J����8i��XEh-���z�m��v��~*��m��F��B-��ƇY%�xj�^��<��fF�fX�g�fN�H��T1��O ��ZV�R�.�Oz���cs��yaV1��τ������D@8��43�*Q���f��V[��TW�J��R�1�9R+v\nږ��H�8����Ȇ����z���"������ ������B[�K!��D�Db<���R��u=0��l��f �kzU��re.����y\�n;9�lq�$ )��+������:��A�)ɗGe��)��pЦ`C;�#�!I�[��@X�^O�"�
?��%�R��P�Z �Y�ؽ��N|���ٍ�Nd|�����+8����}9�!�u"�!�z\�^|Bq��a�<���߇��t�} _K�����D���)�e�-�-H=Q�0m��)�o*7�������}�tJe����ޢ�)���V��g��A'�tw�j��m�K=0Y��٘*�L0���*"(x��fs�Y}�y*��uU��l�֭�ps�d�����x�~&�ˆ�F�6���Z	���g��ܯ�EUG�7Z�a�o
5T�
��'މ����J���<��j�Ԇ?���ex+-��*��;��n�Zm�^���Z����p��Z���Mڏms���z����/(���L���R̉����g8{�2�w��1�
~m�NY~6iY����;ZMYḵ�ff]1 o%E ���/Z�|��_g�T.�t�d�1�a�g7������D�aOX���vֵkנtS{�WMH5����q}��M��H`>(�i���n��#vj+H�zP/w�/�l���Ӌ1b�s�<�P�#�����S
��iLB�f�����	��b~y;���pJ�ݒ�$�+����'e�?<�h3�
!�]�q��2��k
HS��-�?ȹx��,��H#]�P,������!7�l��/zd��8#8�#�&(���0x(�4+�?��Շ�v�ߗ��&�c�"�]Q�%)L��z�d��0*L�-o���x����cĶ��hQ�&���Բ,�P�P�m�]F�*M�ɌP��L~Ğ����&��2��:�U���c����e6)~Wlo�7��8>�����2���U�n`V�%3���wP.)��L�N�qV. DW�TؐJ奆٬wȒA�VXr^�ˢe��`�~ɯح���Q�qU��a��8T+��_>�Ҡc,������6���6�:]�cU��ގ�h��]�B�yKo�����(�`���4;��0(̈$J(���X�������o�����]��	��0)��<?ɡ�Z��6$%���R;�z�7;�φ���&~-�ٴi�n�J�ۙ/�m���ژ4�oP�`��4:���J2lWYs���~�Jc���m�r�a���
��
�|`�Ny�v��f��J�?7ٓb/��]gW�;.�tт��н!����|m�dZ�O���sx��7]&G=K���;�j��{=&�:�v�5YgG3�ַ>=�!��y���6.��A@��3�M���5P
 ��V�G�;�T8Ll���Ȟ��� ��j�~�2i:�e�̿�������q��3��ͻs��_�;N�e	#35_ǡ�0GB�O�W�a�ڧ����N]]��dA7���^��;w���>�O	�Q\��(�.2�n��54R���2B�*{���7�'?�ߓj<�����I5=�I��$wKI|O�$Y*ƶ�BV���z��a��x>�N�}��w��i� 9�΀�I���Vga,V�gMS�jS��)���&�%�e�e���Ek���E�,���9�'����g����t�����':r/
�tQ�2��c��"K�x�P"<�S����^(r>�	��eL�A␖�f�ӕ�)-+�jrS���I/�o�f�݉Iw���]��5�ݸ���J3�ƽ��]��(U�V䳣� d�5��:t��n����ٚ@�Km�{��K8»z���J"BG8���Qg"�W��� �pDt7T3��Bo?���W�Fܲ�l��4N��I\����vr�_vE*���Kb�.J7�ӡ�N�e�ᤸO��"�S�e�.���sy� q�,�	q4W���M�hϧl�R��4��L쟬gX[� ص��y����.��������%H1�֡��^�K�����ߥ��ɰ=��v���^���MV��[8��}0?�K˰B�ͦ-�a��}�-����8�x���%�"���S�`�#���W�"�V��i��ȸb\X��@9���=�q�{�N�"!���谛�����ҕ��$q:����XOF2� y�):NVn�M�`op�&��]?U���R�����1�D�����yS2�7)n$'�?�VPڢ�~α�<k�<��=[��
n��n]�}����Z�!d
Bv�"sۚs[
�{���1.��@���\`�i�O�5�^.[�"�k�f�C�lZ� 9gT4}A7	 ������Ziy��`-�J����T;���h�c���>%_�T����V�W`bXm�6�-����Z�Zy��a�N��$7Zߗ.�1�BG���J��2�L���P�lIk�@��OK�+����@J���*Bo��bMèJ������r��?:u�੖�T�N�;�6�[P�|7ݘ����G�[W�PJ� ���Q}Cwq4d�,�#[�cr\l��Nm.�@Ә�$�c�0I��H�9d�W���W�
ͣȻ���X��}��^�+��U���f�� �絷�߈>j	�:t���2���G����i h�ճ�5�$*0���[�=�#�tb����Q��Vjy�%�8�T�@��%Q��ħ��)b�Ù�ze�]_�ɐ��RU��(�D�u��wR���S�^��9Q�h����}�xw?F�~�>�.v��ߴ�˞��!ɬ+��zvO�@' a�J?���0�|�@�*���Km��A.�m�J-�{���{��^���?*���]�jy�М�O0�V�R
!�!���Y����J��>O
I�G!��yv,�G]�HBK�py����ɳ����]�|t��P�+�QN9,己RPQy��槮4[֛��f��j(�q�<*+�O����E�K�� E��fM���i���]X��y�L&��2a&1�r�;ځ����ӳ�Eoi�E���Ae��n���qC0���ɯ�bs���:��M��"�}&���UU8Q{�m��{����A�� �+-�U��j��!hK}Ƨ��e��sh�S��^���ۦ��̈́;$��
���O�t��&9�bV��v[j��E��[�c���@P�����r���'f'Q��2�v�E!Er��Ϫ�Qa�㳥�~�S^�!Wr���O7fX��T�GG�Q�>�ڟo��M�7�C�E͌!�!�ĉj�;!wāe��eIm#$�f�^���Z���<QV!lcՖ8�c��j�1t�D�����XQ��Ԅ��a��$`s�hk�����ы�f��t�(W7�?�-�hAfd���D�8m>L���-@�֮�V�'1&�]n) |���B?�pYg�O,��a����Th�B�u�K���<F���2<��X�G}�ɢ��-4p'� �|�R�P>�����&�}��؍D��,����<�b+ 7	����^8s��#"�7�S�.U8���栅�!�\}��>ԙ������i�X�RnEtxǽ,��d�7�R�Q(�v>��������0t��+{�.�Y; O�\�B2,����Xhz�$H�iKn^��'YG��v���"ڸRk̏4�G���N��uZ���6=�G�����$�.�f��i*��1p,#�I��v���ҍ̶ H,
��~}x�Gj����$����,���h��tG�T`�j�����.�'dL`��3BY�f�w�W�:�%!��aL�n'!T�e�I����ظ=��fp��L7Zg*}��/�N��5�s��,l�)��}�Ԙ�6�����H���8�����Ps�Q��-F6�JH�?$��gw�15��o�U������ L�V�x�IY�(���"!���eG�Ψ���.�:�/��C3A�M����.��n^�Q����i�|<�ǡC���g��"�h�\��-S��yE���K|3c<�y�9 ��� � Ӿ�d (��z7}�(�������%�Kf�|;y	kX���Q���hn�*���6�$�_X��3=e*�z��x��-z�C+
ɴ�p/�L)�|2޻�w#5�|E��	*�.��𵌻S�44 �ũ�B�24o��ƅ�V�`��J��7���$A�J��A#W��*�����>T�Z�h][�l�q�G����	G#ăܼ@���3X|�Op���E՝���YLY�j&8u���W��W���y��y�Aweg/� J�KU���>U�BS
�������É����s��0-A��Uܸ��	���^��;�4��eX��ff6<� .�p0@�[�P�c�"E�s��0��ܜ�5�G��XTv- �7J��br���q�(��u���2Jm��S�!�T�u�A>V�^P$���j`?���x`���ye0�&�˗�R~iT�oGNݚ3W�ҽP+TbZ(�C��j��6��o�ნvmV��zF�j\���_�ۚ�A�zy[��{�%��ҩ�ؠ�I���̅"ݷ+z�	1?ƅ#�<n����ݟo��2��4㔊��E�WG���1e�>s��؅�����>8��~�����sn��O]���Ϳ���0�7��2���׶!B<����+�=+�����s�1��� w_1�l���1�9�v���tF�;]�P� �K�c�l-�����N@���v?H����w�X��訽�B�.%�K�p�{�@O��=����QY}]A����@�Au�d����(�j������r`R�ŀ�_¯� Z_�1�\V�e"��G���|���Ѐi��4�xp߹b�����i��A,ܦ �#ų%tǵV�,�tPM�o����-��"��ÕG$�1�+��^S�� �oK�ja������p��^��pC���n��Tm(���h�|�������X���됙����e�J�!��3�����M=���-�~��t���/̷P��)�p����B��H�$�>��M/�O��ǣ,=����p�u��'9��Y��3T�����G�k[�JG.@�0Cx<�y�=|���<���Cr7�9�k��W�6jD�N@[&�F^k{�đO@@�b*���-�ս{�祋�[�?.:ĳ��R(Q����Q�*��ț*��ߍ�W:n���I{��4{�h�&ʋǟ�]K��|>j#�-/~U]�$��I?��>;O���T'��NF�vx�����QY!l��=Q��9�����«��U�+D�3�q;�uv�Y@0<AuGݥ�� W�S��i�h�v=�.]Y���$N��9]/����04�����T�I+M���`�6շx'���1gf���g�����V�uob�����}��^�ԯ�_��W�vտU���b�0o�X��%|6��$���퉳D�ٱ�/U@�x��͛�s�O!y�6�X�?�Xy��Ł ��:�`Bx	��.'7lr��N�V�]U
?d\8p8²�[G]�>3���(0U��~��z�c�x�Ju7�]����/Ly���I�r�t�ް둲6R��ڿ�����������
Ud*8�i��Ţ��|DB%4W	|D���A;$����dԩ���a���ӧ� � Sp2M\�]̿Z^�*x#���U�ҫ���(�P�̓%X�G(�9v^}r���|J��h��\�;ځ]��F���)q��y�F�b��'Me�48�����h�I�I�hԝnv�ە���j^i\n�r_�B4�����iVR��0놤�݄�N�K>��,��){���P=?�b���JN������sz���g�X"�&�N��u���Z\�E5adI�.6U^�lj���ϟ�Z����K@�(~J��� �T:R���\`6[��g������ѷ䆄{�\s�*3�s�9���'	�{�ԩ}�ٱ�*�����g�L�����6��OcD�4#@62ѩ%�E�A0�|I�+GC:����:�Ae�	v�ʻ@E+�c�hS;C(�2	+�&G3Mγ�=�\!#)���k�����|�AvD|rY _9�������JHYn� |-��m���H&�#׉X�[���,h��w!KC.wjem2����9?��0%�6�`Jl &�l9�'�X�`<��'���.��Tȕ�`�SSH<�r��n�@��D̒\�D�Zk�	�K9��#Q��2�*EE4��K0־|�^T3��BQ{��*�:OR8&#0�(��qB��(Q���?�\��7N��Ee#���R5��Z��#k�������|G�]�@�iv;R '}o����p����a��c�KeࡅTXa�`�x_Ӌ��¸̲W)%��7=H����0{mH������@0F����f�Ʋr����'\3.E�s0:އ�j�ڃ�����>���)���&�Y��x�Z��.��8�Z�:j�����i�:E�J�j�ްɒm�*�K.h'�L��ܬWt�N�q�Zk>�Dx�51���j�3]%ʪb��Ŭ��
,�ע������ߞ�z���ǌPe��d ��{�2�m4��tZ2�L��a�@�E����zJ]�M�[/��~�q��8���	b��oG(���F�4�;\�ǃ�7>�hw���MF3�3#e4""H4��P=�3���lu�Q�9Z]�wp`�i��N��}'ձ<%4��4ࠧ�Bb���;j6�$�"��}V`�X�H�r����U˙�����^}���(Z�}$��4h8�̏��զ�H��=���t�DP��@�?��B�~q��N���tŨƼR�:]Qz�S]R��{��d�1��-tB-N�~g+��Ǵ��� �j��3�5�~!�e�..�2��p{n#Xuk.'��u�s�zk574f������4�\�C�]w�'�k=�kԐ����Au�(�o�Q;P�������c*�|�24��ÕwLo�բKv�2����ۼQ����s5K���S�Dڋ���Vs�L�F3*nA���s��suۚsSAn�!�,ڥQJ�"����El#��.�)��H�
�������3Ƒ�6	53(ݹ�>Sh����>�ۄ�+�3�f���[��E�+M�lW��Xԥ��ǳ��A
�r�������9�y�j%�3�U* ��A�ۿ����rCWgN�9C�iH�<�j�b}:`&%�nu�+�Z���m69_[͙��5�X�sW嫪����
<ٕU�pb�}�H�s:5Mu�>]�3�e����A��;�R\�7����kz���R�\_u�i��hDS|������ПH�?��DPh�5-��͙�g^��I��s��A�!��kQT-j�%Pyi��;otl�s��G�ͫJ �Do���^O�B��KMҶ�6�H��{"o����7E뻳����#���c8�cZM�o�e���6�"̢i-�7f�3�mN3���d�d{�tVQ���=�J}Y)�j$|S�oF�T_�-4��p���F�C������e�nNX�Tט�w!���N����2������Ȁ����q�:�uJrP�UPi~�7-aLܨ�4�����b�o^�d��{�l�T�E/Q��/�YRF��ة�oԦ�׀�1lՇ��
����^ףL!��P?�;?u%�EB-�ݍ�>�fk���f�=�芟A�h�ey�՜S&��!s�t>�� G�&��>��!|\M.�� c��6��f��H��L���
�B��0�@�K
�ˤ\w+8L,�qᰤ�Ŧ�T�i�n�I�m�eC���
dT�)i�fLO�b�F�5�2�Pip[M����b0Cp�rX����.8���}��GA�^��w%�+�;1��]ˆ��ϥ��U�&M�(�A%wк	o�u��)r��}�9�H��\�A/�H`Y�e.�B-�9� ����$�?�ַ���|���ȓ)6 ��}���mk=0n!;��s��j�_t�b.��ʦ�JJDy�.�����Cgs�zZQ���>�c�;��H�q��Jw�k��%	$��hS���X`7�8�ə���q,J{�����R�I;w�AYk���G:K&ؽjL��m��Y%�KT^�S5︸��c�>��A\��k#���oX� {%I�����g!�~73�yϨ�ы�dt%���`�g(��f"��^U�,�����@bu��-)J��W��v�.gg�O�x�Y/��*|T^�}������o�l��0-�"ԑ�Ir��n�6��֯��Yr�`�>d�)rE��l.E���}�j��WD�;|��V[zrU��+�#*�б��'�>����SQ�߫���7/���.4
�B!��aQ�Lv�5��==+wx�LFzR2H2��2��,=���'7Xa^ �{S�q>xF�5�U�&G����rF]��L�$s�SW�M��i\5泡n�#ӑ��ⷄ@�%���<�㙢t=�@>�I�d�.� ���νdR�7�J+���|%xD����[j }�+�l�T�M%�<��D{f1 j��r�f��M������SA�S}[.~_�cT�dOuR��딦E'��˫.�Xz�_/p����"�@�'.��_���m[�NE8d\|� k^k�� �A�� 5�XY�*�b���s&%�Mr�t1Ǩw5������[�ďF�s��/,=w�i���09�,&i���P�^�IX����9ЇX?���6������e���� f	��hn��j0q��~���X���I�XM�I^�KL���GRԓ+��t���|m_�	+�\�b��5�Է�k�zM�b��)�\s�Z�˵���{�f�1l4b�(��&�FÄj}��4L:U��Uux"�	.i�2�]ɼO�
�H��ʡ�&;��Q��a��l"O��Lr��0���Tp����^�����*��*��*�찔����dJ_J�R����+�����G\�Q2��RCC�b	a����O�`5	�D����C*=�b�>�@�?ڣ^f3�O��tr�%���H�3��J{׏���ظ�����a��Ӟӽ2�3T�Th���������M�	���٦]�)YM�A	��l*����o�O��J����h�E`��t� �G�B��H�z�<p���䅷 �0�Ǥ��[e��Â�$*�#�M�`J���_���q���g�k����!_�tS�"4�^� �מ���>h�����v���t��h���8��3�||`|]k<Aτ&��5��,靵.�<���Js>�����MSvK��m��u�{MY��XDwK����K��6oa+�ۀ�'݆��s�A%V�%
�9���Q�Cg0*%é��8</��'�5���h�=/s�0�o[�ȡ���P�J�b&X��H��0�"`�)��z�oZ8cm���K%��ih��0�3���*_K!��2t8C�K�5(��w\��@��2�;sXmĤl����B�ˣ�i�^eK�}��W�t��sQs�-��� <�̀�(x�d���C8R�����_��Ƒp�#�oj����J�,��$�]JU��~� �:���gE�%YP-�P�2�4�^(`l����g�v�@J[�r'?��g�S9Uk]Fڻ�W�nL���o>g�f_#�ES��E�Aq�����fg���Ag���~T4>5
Ɩ��qб\���`�5�2
����<�4#c�]��'�OΫ؅%U��AM���t:vt�̬��"�	�v^�����|��T�j��7�O��@����}+���v�3���1��7�Nm�p����� RuN�!�hp.���%Hb+9_����>���r/�C_q�Q��mhXiJy���D��Ty^��0�N���1_Y���`K�f�dP��8��d�ceS#p���YRJ|lu{U��2�v"t���)��+��&��?�g�3ʈoZ�u=�~;�x�i���X��g�]Z|�X��|�|����u���+��c�E��>醠i��xN�ȕN=;���\I�@|��gl�)/�f��l4�n����]Qc?�-wv��'�-|�o:�Up��3xE���t/����;�"��;5�ɥ��W�oDW�|9�Y;�K����f��ǐ�h�e�ٜ���g<���uUdM�Z����H�-s�&1+��~��".5�O�z2���\��2X�@�V.@��N *�Yf���j�j]��f���Y��0?�����ϗ<~*���=! Ȍ�W�W*�Q���o�ƞM[ei�y����" )�e$E��L+�iE��u#3_h������D���7�l)��vii���/�Yz�:S�~�U(����l
����w�Ҭ�B�������q���\�����]+"�[�n�/y�4|vp�$�B��i&A�Uo	�V�LJk��ʇ�����rg~�m\��Z����Dh&����]��V�&�
��`���n�p���8�>�rWw�5�Li����5dMf���ڮ^t��H�S0��W��iWZ���Ѩ ��6���E*��5��IBH=
�J.G���-u��5(5�g���I���Q}�� ź`>.Nj���n�L�=5V!�tvI���*b�.��ݨ�u��3�gj������)!	!Q�<�O,��C�p ��گ�{�O�٨�ڶb��5'�;���^^��q<����@���C�m����(R �O�;��I�Q�d}8�(k�/����1yƻX�߮��V�lN��p��dэ^�%&��g`fu�n�P�A���o����R�2��c�H�v�����k�2sW�j䔑AH�@��<��iR8���DN����F�䭖\��={��wP�u��J*��W��ms��B�t�7�p���:+�`b��&|�P�_�E}.��G%�yo&o�����m��n���+�˺,�Xj?jb���-[�k��� n`MW�s�`GTu����ݟ�������~n�?8�&EE����8q��L#�;t�ˠ�H�k�Ku���s���>z�4��<y~��(��Qۭ��. OK��;<v�M��k��z�*-���3i� �8�~�87��4���e��,������.��P#X)ߤ�����`�mh�H��Kzf��2;�*���ťQ����c���G/S��/�3}?Y����K	��7��.Ü4L�t>�5j�ώf�o�s��IA�p�m9v�T��|�`B4��)Xz��{��Sᜭ�,�P�d�塂�&C��P���O����g&�'U�U��Ą��T�v3�	zE �J.mψPKIo����p��uUW����H���i���
��H��e�o�3��0��i7v�̅�}0�8#FE�)��d�ɧ:���߻����j�2�m�Z���j���N�ơ�|Y`��@ A���ݘ�����&(�0���J��
�0;D�m�fJ���u���tR�:Ek�%�E�f#�]�̮��)�����}�E��3��jαd�>������=���{�>잨��8,���3`w���Z���?x���]�#�P�"�\�����Uږ�����3�7�*GR�MK#��w'&ݩ������_oK�
g��׫�*�$�.��'s�&����^��b�q!�Ňo6[uh`���2/`+�lS���v�����Jڇ�C�m�ހ>�)%��%��D�7T3]C@��=3/c���t��z7�}�W$z�^�\��)�����ڵ��U�_������a)(!���ӶGϘ� y�)B��RVd'�+x~�%tu=���Q�~|ݏ��ӧNe2��R��t�T"p)l���#6��k2��4���M�B�:�o�/�}%|[�a��Hԕ�"�E�[#"î�#r��Ϗo�H�{�z𮸌s���s{��D��4���K|/��p�E��vG��`E/ϐ��X�n��U?kF�)7�@�|�)~٢ ���D�+�Yu@b�.,2��#�lm1s�ԓ�v��`2qn.q*D�Ȇ2%�|���\"����F�o�#F�4��ֺ{��r�4�?Ř��+[:�,�g�����K�q��՞�o��ݟ{�%�&`�=��M��6���LC�N=��F!~	�����	��C6]Dy��R��E�i������,�eT���Z1ԍ���}�x"g�U�C( �{eo!/_)
��G]�N��Q�Qơ����>�U{0��������\1]���k&/��?Kl`�2p��@��S�'������E�"��\R{�OL̏��jV�5�S��)'	������SH���sEd�ꨪE�X�;�)lT��Q[��U�ִA��,ǡHY.1>�����82/�����z�_Т�V���m}d�Od�.di/��3}|N)1�AGDJ�:	����fG�2���x��h'�Xl�뱭�۝�;����+���ƯJ6��ѓ�J5b�L��	orɅa�{�*���<ܧ�z)�xw��,E�	�c�r$Y��S���#�,E��#:���@ߕa�HfUw�s�k�'��J-!�^F���� v�p�HP n>lx���r���O�b��ҹ�Ҵ*�:�̟�!��&�36e��l"̋G+Q�:�t�S�b�ʈ���ꇬ*Z�&���+��k�$+6��AR)��0��1;�gE�9�"�U�1%�	�XcKQ���%�?�0{����r��S1k�\r�œbO\K��ڞ��;���K���<ῼKO�\C�g��y��m2�u�Xፄt@o/�o�p�ua�V	��3�<�)�~��Y���qP*�Z?��񭉱�%+a��*��2����_6���Y��h��b�GФ&�AsU�ڝ��,�0e��n�[�^և��`��Y���_Z|
���S|@�L��m���η�MԆ}�h�~���l�d�t�������Uqɳjz���Y�S}�
�ru�B��mK�����c��K{_iT�0o�QI������Dݲ�b�CM�\^Ņ�7�J��p#���d�GX���k?�fl�ځi%��&�^!�.����U�'=���q���e��gՃ���K'���J[���z�[hc�?x4����}8�9����E<���u�(�р��uꪕ����2���BB���7K�̸�8�e���6�8�s�o|�>��_��b;z�7m|�6A���E7�\�,1��N:�R@P�.k�n��	Yp�w�����   ����mo\ו&����|��4��n����LD�Ԥd����(�ɂ�UL�H&�Hl:����VZ��G�đ-�@Gz(`~��_2{������T�I>�XU�e��볞�=���a�_�����k%>8����l��i��aBt���e:�D��S,4渿u��k��_�6�,MQ��s��g����h�lXU��XomAt�&�N�t��!�l�z �hˍq��2@�ddu�v�ω|vG"��m�ld����1�H���Y҂t��C���8*LJ�1Cm��l���彌��_>�o1��_S: ���䨘�{�8�9���!�Yb��G�vb�ӥR��2���_�	�NF�b���/bߛ�4<�%�7���n��R z�v���G�k�x�1뽸��v�ym��9����=bA{��PWB���sW��5N*�ܴ�eo&A\�-Y� �y�����sEF,K4ͼ�C�g���ANn�\�P��.c�$	Zg�l!!BV�϶h˲��`�!���	�Ψ�r0/'�W'@��t@�!*��7���U��#m'$7�7���3�%��OH��C��Y�j�6���j��v�u�@�� tb��7[}�q��P�O;쓅�	�sn�{���l�:�F��:����h~�$
�ToW��R	I��I�:�S*�
m�Tc�#���.�(%����۩�!��Z�Cz}xڧ��3�9>�G�0��2����Fx񪾭�>��?���j�D�q[�V�N{��7f6nѸH�U�������k�K}7�����\@��v�����9{O�Y�4�P�E���� K]���ꉠs�r��j��&�;��Fd��������O*l�?�� �;��-%���z�HA#�X�C�?�C��TP����������Y`��*�&;S��~�����­�
� ��g� :b�� ��+��G������8�ϼ��Sk�]��T��t�nP��SFeߌg(RgVT�ẓ���6RL���%X��w�&<U	1Rr�S���Ewm�]�`���+)d� �s�1�%��*Qѿ�ˠ�|#J������̆�����)!v�C��.~�cEN*Le�tN����3O}�Q��'V�y�ҝ.������,fQ(CB�|�Ж���q�]�:�^�U��NS��i��2*WC瑾@�v=�����#��8TI�C({����Mg��Nx�&�Ct�Oz��=�=xgʪ�U,��u��S��`�����t���I)�`����CO������O�z�ܙ�KW/_r�ϻ�]:��p�-_]�v�굥sRܛ��FN����V�&�)�ED���`�e�j�(1��7���ޫ����7�� ���%{�>�8����}R�,@�E�&g�t��9J�dB켒B����7%i@��iY�(����!Wzl>S�C����v�h���4��e&ݼ�VEZ�8"���`�+�x���W���a�3ѻ=y�d��[��=H[hKD��!݂�ڸ��S��Td�	��Z�0��p���[M���>�d�є&=�P8,#s2)Q7��c�$D�����
��,�*d��({<�;�Jg)ܩ)v쟈������.tP�O*����� Q�����""jRn�H�S���-G(2�8W���S�i��}S�|\���2)��W���܈���2L�nu�L#��ИK��O��\������Q�b�ʹf]�'��n&�3�mm�̦ͬ�O�n����9�Q���F������N*(��*��.)FC���I������Ii���1�
����S��'�s�z>4O̪�ʥ���zT�Ç��Y��ܞ�F�5��B8Se�Jw�0+���|DY� �� .Oy0&�_�;Ĥ�����0��;í���嚸F�o�nx�[%��Ԧ4�.��z��l�sV�� �i5�(x�P-5%�q�>�w��q��o����up���)i
�D�תM#2b���z�@a>����C8�����6��TLK�oq�ohGNQ~��3a<�/�����V 1b~����s�q�~.��p�ӛL�����wB�����z��^�
�)X��Z}۽�a���DIS�9|�K�7ՎɁ	;fÆ�9��}��'N7�K���(�Y`% e`�!˝6r�U
U��a�-1H�>t��]�: �E��4�<��:�P9��<�5h�x�w��PvE��7'�!ʅ[6��7�W�yK��}E˭?w�`�W��c;,7�JW����f�T-��A11�. H`��V��5M�Im�%��L�j�I��E�/ٚk�$U��܉s�Mj
�>/-iJ��/$�^B(h�A�#$�.}����
��+.&��W�v:=o�������'S�qA�1���v�&��+`j)�e��फ़�݀6��EN�`&ڋ2���W<�b���C���P�sYB�=�}���2"x X���:'��Z�ԗT�4(K	��ī�H����l{QMQRs�!�r�X�TS���㕃Ҍ�׉���PS��T�y���K�c*Ui�
�].TM3	��TC�SwJ2�i�dKD�#�b��0�"U�ҫ�k<Qi�\42f�9��[|�����K�R\�|pq �2o��M�!��!�%��=㚲ma����օKG�����骺�k�Z����I�*p��B��g��Z`E=������� >�p�Gp�q&�	�dIL��;���p
�W��3�C�J�
s��BD�>Wɛ�eC��/ ��	���*O�t	���O�:w�	��_'h��F���  _-���7�k��Y���~Z��@��Aw��A�9�s�926٪=�H�a�M�v��h#�����~r(.��:��\+�σ?�%κ�c PY߬���|�N	H/�X4ؼ[�7�,Ɖ�+{�rj\qy�aC��Ppj$E9���
���ݞ��ZQ�|W.8�7���ω�I���.ɈND�A�Ėk/z���"�8%�Ro�I�8��.M�U�����re���gl	C7��3"g�Օ�ɴL�M�;Ml4���А���uS@��p�ܒ����~�K�qԆ�4�aL8}������Y��(�逢�*uSS ��<���
���\�y� Ӹ㴮������W�PK���0�n��&�]���q����.I�� N;�/�z�cAu��Of�-	)P��Ǹ8�\<�i�3�M�G���VO5�;��q�K	���l�4$<̧��)�i��O�+-{f�܇>���Ȏ%�%�֠�[����{c�n��0Y�܁��	i�����)n1�;h>�66���<p���7�����d�I��l1�F��P���c���R���m;!�"Ύ���(ÛAa��j���vBw��e"�n�w��t6����r�!�&ڏF_F_[=x���$r��d�/�c�B�=;�o��~G�zV&٣���q�$M@MG��̯B6���COq�L^2 �1E26GDD��έjB�LGT��߾�G�t��[�210��щym�b�:���.�ɬ���U�~����&g&{ �쯜�KL�KġB�ֵ*_�R���|:����DBY|2+�&�U��5s�c ����s%b�3P3�A���2F��/5AV�����c�h\�<P"o+�]
[ ӌ�)��"����ۅ���r*�@r�슌�7?7��iŏ�+@�a�MF�]Q�;v��E��,���Y0\�:��D�3 �@yf��2�ă��&�z��~�.��Bx&^�a٩�ǤbL�dY�R&��;-2�E�]�Q��Ȑai�W���rr���J��J1���2�vt�[����$GG�o	n�iT[Y�����s\ٯ�rHT����2��mqU��p����f�/�������4�"�IBR��Q��#T
Q�&v37�gE�R�o 8��VyKJ&o~2���QRuh�Z�jȜ[�������C����T{�	�5�?5M��#�񔥃�=�٦dX~�؋GF��i�%�ݪ�+��/E)e���w����'nʬu�Tq�]����f�/nJĚ/��zp��ǽ�w�L'ĥ�I�z�Y���,}=�����ʤZ	5B>5���$HY�-� $���r���dV�
�.9pQbr� �_�-�aK��bs�[V)��a��f�W��ԨV5�6��k>����¶�f��R�we�O	�<�:�2\�u�3I��k&��Ӗ��
Ee�J�2i�߳�育,9X"��&�p���:�=�k�f�Y�����d>���t:���H��-zLi=ʅ	��<��6���� %�E�m��N��p��At [�#�KAEW�2M#���-�ND��8�*v��b���[��P8r�s?��0��c����Ϸ7��U����.zC���xU2��ס(Pdh	��`���@k!��95�XL�܎���2�;o�>��G�z1���2�>
�?7�6��\����Ms�Q�E���e+]`)&�.8�l�dV�\=�����#�o�x¯��.��9h���x��vŧ�="ð6�oJ);ԯ�� KQҠ��N�p�0��;����#*������tA-D��UԪs��9���٤��{U'�Qу��'u?���IF���:;�Z[�g��	C�X?��hd��bChn�C���!����4Տ:�b�Mm[�ր���U��~+L%�a��ȅg'�v;X�W'��A���H�:�n=LV����o��:h^�����>��<#�����6qz��]�crعHH9U��hJ~��|l�u�"4Y[�	�z�R1�~�h��8v�xdi���*ֱ����Gɛ�+�}��3�Y��G�p�PB�f�Q�I���I�$�v�^���v�_��t4��d`Q�x+��[k���N⡑2C�I�ؾ��E#%9��`1v"OL������2J��o�7r@C�c�:z�����g6R*(������;f�\^�gRԙ�e����n����VF���,rU~����.x�[���m�]�M�~od�%�饑�9ԺQ��v�iI�6�(F]E{M��K��=s|�]�	�Ⱦs�\��K}��e�#P`�J�
�}����]�W�VT��$�4咊cf�@F�i�&�`�d(HfB�q2��;�⭩��M��
hb���`S��U%_����2�W4q��/	%�9MJ5;�^�CF�H��"���fd���9�n2�L6"M�����D�oks�$٤(0��Ӊ�(��*k��/�P����;��kqf���Ā����I!u��N���78Fј�5��-i�U�	�U2�I^�6��p�i(F�^�T��d�%���At�^��7��"�c?�2�0����O:dU��bD���5`����N�03��тsS����f�!�����kǟ"�բ�4OA�}��G]��9�%��_�劺RG=՞����SZJ�$�V'�i�S��$l��^�1Np�(�B�|�f����ʤ��N
?d�k+:(��O[�T?��+�zJw�F�uL�2!�J���~|)�@��!�ݖp�O�\�쇞(J۠{���f{��R�_�����J@��y�{��$���M�2�L���{�~��<bR<���q���
���St2����]����u6ɳ�J	$� ܷ��W��)��b�F"+���F���`G�>P|x�-�#�΁�\@�+8:E����,æ?N�u ? +�ցz{)|�����2��J�?	a��Ѹ���ő
{����2fD�}*����S�A����O��s��YB��J�+��i񓮖�f����ol�(_ &���,x�>�<Xo�XB$%Ԋ�e�#�:�-��Z:sY���<���l��R��:fT��J�&*����奟C�{MG��⟗s��J�,�a�dUF��88~�w�!0B|$�:���z!�~-.�,��^�C&��pR���K��}.�}B<�	���D�=�P<��&E�5�+�D�a�m�t^��\��v�>
K�"�Z��-��LB�qI1�
��i�k�cW�j��9��g(^��������L��@,rëw��H0�>�¿��]�"��
����5�����Q�o9M�m�+��v��u
�Nlw�,�(��/m�����&�P���!���Y�A jq���2���3��2�`_Yn&MЬ\Om'i���}��;��܊�c��z��].���jӜ�K�'��x�I�9����&�O�����k��0�h,$ӎ�x	��#����eނm0������j֜��O�"kd�������z��yc�δ+o#V�ÁA�Ǔ�q�a`W80��[��G[ D� R:σ'�Ѝºn��v
S�zM�!ӡ~&I��Һ��=,1Ї2K9ھ�4�ʦ ��i�k����tz�m6x�C�y�L�ra3��~�dOg��{=����������g9��Y-�"�py���6k�^��D����Յ���>-�^�I$�^5�<�J�@��#��|6�ݕ��O3��F��F�5g�Òa�E������d~����g�IZ~h�A�|�ꭞ|V<�}�7�b���������a�c�mÀ{�$�%Ȱ{�,;�;O��1A.�g�C%mU����X2�+��%4���u�*V����.ل���lѯ�U��!vb�����V*��`��<�Nh��3�)W���MrѤd�ARpq�E�4�a��n]N�sw��e7��8�G����~�a��&W��~r�#�Axb�8<�p�ǡ�,�͠B��k5Z�T��g%�aލ4�Q�� �t�������"z,�,�%�1z�0M-�V6(�h��%\�K��c�B��LU-�n�+�~�Y���j�YR�����)��i�Sw�/9�:<it�g�l�;�޷�<`��	��~k�����:��� �B1�7�yT'8�E�Jk0�5�鞛eydJ�t�!q_#MTM���VnCJ��Ԟ2c�����AQݹ_�;7[]+������!���bC�dwV��|̔�������W8��ŔC ���\�G�0���#�� h�p�(���([�P�>K�Ͷ�O~��L:���-�t;���G���N�\������?�:�o��˭�E��#���81��J�B��(��p=�MbR�x]�k�&��$Y#����]��b(S�W!_Z��(-"'7^֦M�R%���O�@Vc��C.>o&�S
�q�bp��j*���x�����al���e�F���|Sz�&�:�L�w��}��Iu�ZN�5F���@���Eh:�8��磽�Z'P̱�uĸZ>��;D^�OեRH���+"�|Do�'�8^\	�G�D��Q�V�ʵ�s $����=1�S�Q/�[�aj�_4��,'�[�	���՘��D(�_Iֵ^�lT��;�V�3Z2�q���+nC�����_�7
Q� �^S�Y_r��[��[_S�dH�fa,�لF.���93��%�4.�5F�	��dU�üf��#4{�������ATv�{p�m��;��SS�S�F�]7�͂XѡU��V���{����p%[�s)]6CWb�oʝnA<ZŪo���Q��)n��ųS�K�P� K!z\N��SN�`�P�R{m��8�,74U��pb	�ķ�������
���+޳���7��Xr�\\�ބ���b����~@S�cf"|���kcdeJNp\�1|f��+/�+0�)��G&k�nvZH��M9_��.2��7ʸ��N����������k�����2���#��9�Ī�Xlu�gT���_e�s5�O��Q�i)���w��M_k���Ԭt����
t�B�������ޟ{������Y�o�F4t����D	�j����� �pvՆ)�'7; �B?lX�a.����I:���xcpv8�㌸�*4���I�q���8��.m��<���Q@��6[忓� 	&�D(��1��x! ��-a�B{�p�����'8F؋<�3A�o��n�����������,�e�2Ҁ��a�W�7),�s �eI���d�afwdb�g&�?�<{����wNa]��DQ�ݦ���9�JR��_F)|�����kg���sKW'$�J�2�r�]:���,ƽ��L���Ñg'�!G��qV#�g��@�c�.�,�R������>u�qϧ��+���e�jGDG�0ϲB�����q=�'��3	g�$y+�tTP�1�|�����&����'�� ���u��g�f�3Y.#$�����?�I�<�. Fz���^�>v�3)���J(xB�����i����׏���7z��^������*:3�aR%�ʹ��2��,_[kk4�4�,�g��@���"�m�Z>�PO���e��yǭ_�h?��d�-���@²�1	C�ً�j�E�h2��y�t�)����&�|��<G�uu����v)8��^*~=�j�����b����`���wҪw��,/%3�z�Es�9�c�v{{�]�(Zxe�?�85Dd����xv ������Js��Fy�����y`;`5��N�?���m7f�W�(�������6�v���VuC��B��]x�}v��<~����.���O�w>z��O\�솧X9�A��^���4ݕn�(̽�4�f�E}�SqWr��������z.���|�A�}-�fL���>�œ�M�09��BxJ�C�a�6ƻ����!u[?5~u'�L�����,Kn���Q:gJԏ��b�-�ശZ�B%�)ԭCr-�$79�(m"z�Wxg�5�Q�RVV����T9!��A�f�<��>�p\z��9v�-Ŋd����/�V���$<��!��=�!���Ѵ�`/�G@�u�I��7� ���ubE��)^�Woؓ�(����XVbC �5�V8�Gu�������Q��\e8�������;V� eY z@/2P[#��_�k��C����X�ؽI{�+�ͯ(t/2	(����HBh=,��߭u�#QxPc�E���JO��Ώ���Wk��B5����~�B�FS�������̀�m��I����,��֦�� iV#)��LB�G���4��q-��j_0"[EBs�V����ϖ��m��F�z#L�p�Pֆ����`B��ӿ(�$�����a�>R>d�bjP�*��;GK�_]�58�����w�3��
߈8�H%.�������!&�Ȳ���6Ȼ�"�UMh�n���'�#h�\>s�Jd�Іǜ�65��WѼk����)Mٱ���b�E֓2�bOf�pS��L��z�vs2�5�.���59�=��;�Jd��Q7Iw�a*{�1c/��c+��y�drC+!�U���1��KǑ�4[2)�Ȥ�	:�e��#@�<�䛗/=!Z�O�(��sd[�~�m���6���+�9�����i��>c׃��x4D_F�p�:����^|l; �`c_om�\�&�����:����G�o�������s��f��z')�S��h�n�9����;��M�<��	z�u !��cA%a �7�����M����<�xM��۲�&�����"G���|("���gJZ�]��FM[qe�fB[n0pC�QG,�r�p�׀�L��ΑA�d�a�TΒ'���mbZz�*�))�F�P5��_�ʅ�4J%���#8Т�<\0m�w����"��(~;_63��NG`}�_��-M�I�J[��Ɨ�Z�� ��3��@E���ϒF(�C����g�R#F�pV���G�jD����a�ڔ+NO^"��i�a�МfSH�h)� ����R�ԥ����6���̝� ��G:�_��Ca.�n���y�
���%��'CZilWH��K�͢�8>uVch����4�0��{#�Z��Z�nk��2V6��`�PR
�]�Py����گ�J��ڒ�a�'�H�,P�������d�Rh��c�}����
���X+2�%�6��;k~9I���r��[�İӋOc�8I�+���!���'�B&� o`�G_���� kr��T�H�@>SÚ._JC��:[�Ս��."������:mb˵��/d�����.#I���WՔ���TߴkG�Gt��z8ƀ���{;�iXC�'t�'G�X����ܰFdm;��huz��Zcu���v�h?�87u�*=�R�@��C����TM{�D� ���F��D��9�&-���!��Cz}xڧbo������	~)d<�K�� ���:�]�#A2VO��jPi�E�N{�;3�h�!��j��=�L��������" l�v\����ث<�[�or�^���M��)o�Ѱ����$���T�а�A^w0�WJ$ɾ�n�K��mt��ʕ!���$fr���P�� !d�'_��$��Bx�ܕ%m����J�L��&pC�1�5j�]k��q�M{G�N[pm8�l��/�!�x�}j��EN9.���؞L�P$Q?�˫c�zlmE��tU��kc��
Yg�m�9�)`zy)`C�G��+R��Db��{���q3���uF��M�	���Y;+]��>��1��@^�a���Ϊ��h�f	�r�Nә���U���_������M� �&�=
�x��]ʎj^��:�s[zyXI�t
2�b�V'�*M�+�b���n
���/0B�x;�CX���bʩ#�������4v�5�e���8X�l7 ��[�*$�Bh�z�s�g^^�5����&�:f�3�r��S�4�n�?i�L����kQa��H�p+�SUu�p�o�S�P	��Z�
����wlХb�t%��T�.AL��neC]2_��ˠ�z#.��y��T.C҆�>s٤ޮ��'ƣ��Տ�Ы��q%\G�>����b~����f��Q��Y�@f]��T���D��q(	�R/��y�j��>B�D�pчA�,����8���CYhp�b~�{�͔n����p�@y��u�=�~mw|$5lu93���������p�0QS"�����b���JG���<@��t��U&$*�W��^"�e�A������E��ۿ��M�4Z��a���0��7N�@���Ξ;sqai����K��yw��Kgÿ.��K��\��tN��S�)����B#.��LH*�QZo��ʸ�@�p0vƋJ��p03 �"ɯ5��?��|��~=.������m�A9(@������8��Ўj CLI��W�K��}��|(ʪ&Ŷ"2j}��A��Ɋ�Vsx�����v}�dW�{'�L~��ד����՗��qP{[�ӼKP��N}���+熭R��$���cN��}�!)��aȩ�%��۝�c@����b�C������C��y��Ћx���� �R ��x �,o[B"a�h�@~R�'E�Ew<�u�>�(I�I��q���e"1A�Zq�bE\9�^��L)hłg�"W�j8���{&��'R���ر�Ȁ���f� J��
LMk���`HY@�7oO^(����{��O'���
��sXIC�D�\3W��Y�<+y��2|�d&���!
��`' =]lB�m� ���?j�'أ�V�}0��  p�tر�)@ 4���@��X�%����/p�ǘ�r�GV��`�ߔ�)��돳lI� &O*Tne��&M��9��/V����6���h9�=qq��/Y��S�QD^�p���ˤ��_�.#��G0eY+mi=��pFDH͔Oゆ\������Q�k�ʹf]���Nn&���%x�̦ͬ�O��nM/3��sH�����d�*�n8�@[��H���Ms��׿ϖ%8F��r�����*l�>&X���<����χn�Y�[�t�x_�j������b���'�g��eMM��T���]$5����,�8�̞�`L*;|E�{p�F���.��.(Z�2�ص�Tߟ�0�8�7dk��s&�B8p���#�1�%� ��[��Fg���c�O'^����Ӡ���xdu  ��߈<ϻ�4�笂~C���s�'}?Mpg|e���0�G�O�88ZJ�:G)�lޔ���'��zݷ�G軸����������"B�>�����<���t=�%��-����0���dx�0��\�=���a8�=p&�H���� :^��%�zq�1Z�<���Ih��]3���v����&;Y}�G�d�	D}��{?��N�����&z<�;�N��E�6�q��Z�9�se��Z���?"/
�=��h�%��_��K��Q�E�-��r�e���f����S:�l��q�-�O_��_��Qz�|�"RT�҇y0i�l=0]�`#�6�$�N��4���J5��ln'@ұ�u��F�L�G��6�!�s$4焞b�Ut×l9ͬ�ϢVG��9���4���i6���P^��Ąk���!ۥ��O`�{+�{_1ngw��#�\�iΈ~��a?���@��!�}Bu�ߘ��� ����x�S|���$yM�R`�|:$0YeR"��&W�8�C��fQF�{ư"ۃS1<S�
*�	�Gff�N����@*����U�Ce]=���p+�T)��_5�أ����-<xx表SRBGC5e�b&��B���Y�p����P(�������\p%(m	���96M�=%��Z�
���&�SQ��DYT28~��K����8u���J�P���!ʃN���ib!N�)�j�^ ?s��\[������!��7�:�"�bG��̥���S��dV���]�0�h�ɸ�_�G�|IBq��n����d�-�]1o_*-���t��<��|�\*�Y;� �� �����:�����]^X�U�VC��nxD�vjҌ���ޱnf��{�z�]�o��<��ܵ�	C_U\xVǒ0��	L2�6��fb���Y�~Y�{jƴ�f����gw�#y)Γ �w��:bEA�>4�W@�wٛgvO̩^����Nq+2Fi�ϩO�e��/�z�c���.5qZ<v�$~��{ޤAk�P)���%���҅�jt�����TcjE,���!�#g��V�.��tC�A�H4	���b�f1���*Y�@��$!�H�!�ݡL���T۩�`�����n��}�%�qQ��g�-�Ї	�ge6&:nP����}$�)�p��������p�b�v8�HGI�Εb �	�dZMb^dĳ����MI��
��34��� �o���s��}����u�
X��올�S~�}�`�o%ƒ����N�;xKnXB(r���%�Scz�2�R����ۥf�E�#�peſ������-8/Ʈ�w���-��Id��qL�B?Ό��Y�)��:&��V��v��[)Rs^�>� U��|hhR�Et�[g�\< 
�����X���-0G�"�U��s���Ql砿e����k�,�
��!˴0(Znf�0N��	��~\'d���>r}r��}#��5@]��;t�)��:Vb�P��a8?�v�i�d�����R����;�1�^�R`��iG�w�.��B�F�򕿢pMf�t�*���.}Fc�c�4�&=�?]�!�nGg���������9��ۺǮ��#21����+�҈�Ê�H�k�Lcsִ��lF�&�?c�#�����U��C�)�B���9�h�=�;�Uf��LK��̅~�����%���`�KP�����Cc�fn��I��u��W�G����M�|����~�.FQ����JM�#?Io�4Lt��&R_EtZ�H=�=�M�z�;[�B���^-�h�o��&Oɕ��&�1�@�N��;��f��7����������FX�ͤ�+�y�v�-�k���#�[��H]�����ܡ��V���bk�[�p���6H�l���A��T=v��d.�w4]�-8��<_� ϧS ﰃ�"8m��1�v��t�� ��Q-�����y#���_�(�����U_��B�.��*�wD�]�[�[^�@�S��ڛ�^D�L���d�luz�1��^���U���7�B�uP=]�;��/����m�~�H�R8��	��J6�b�IW׮Qpk��G&t6�b�3�C'� �fEtsŐ���.�N������`�=6F��`��"Ɉ$�&�󤊘��G���FM�E
���i\@2��3�� ��QN�_�M�J�,�y=�F������Y����������ϰ�b��������F2��Q���_��/���ǔ[���fn�r:���#o7�%�K�N]8ڗ��p/w�p�zE<�n��S���1_�7	��s�~UiT��c`��Wo�ʽ��QҊ��S�I�|)q�~��� s��9�"���=�8ߵ�~�C��~�bL�޼���s 1Ңa h_�h{\��i��$9�ƶZ[ڥ�Q��s�Ad���|v���s;�4�����]~�k�ă�Q�?�y��h��[�^�^�,�F�7O�u�9a��P����l0�p}���)]d�9�[%{�S?<���b�u�[Qv d4��\��Q�|�/��>��|c"�}1��M��|�Kzщ���zt��%)�	�=o�w>@(b�H��	,;Sh)�_�a�{��_�I�D~lw0+&��^�V��_Xl���������I�"bgP���Ms�����˷�#����D��8!���bv>j���n�C�"����E�fgխ�a�J�|G�N�1v�NN5G�*v?ٶ�FI���c#�+rL�ɯ-[ɔ����������y�A���|Ó�Z+���@Ѐ�!�Sp�1���ؑg�r�kc`�Z���怆��^;�y�z�Y���P�3��������\� t%fD��h��ol��e#2�V����� W��|"z:?��e�&+�F`ģ�X+��Zk��\a��.��b�~�.�+ϗ��b����'�;�"���N��#��k���K=�um�U���9�:A��:~�$�<��\�x���x�^��E#�;P�Ǒ���d���k�/?'�n�=�.� [��頻�G��J޴�<С��@d���������.�ҟ8&V_��o(��6���Ύ�s�q�E�x�����E	�$����Y0�na���4�!�9�H��/4�����ˈ�����Q��&�q,�\�Q9��q�Rq~L��A���\��myX�ES;&���j�[RB&3�qY�u'�#��W�q1H�*D��s��
�]a<�Nv��2�������ժ$mZN�S����7\��J`&����b^�$�dR>Ъ6�5�
��M	�[ȳ�5�@���`}f����&�#r�N/��lJb����� b;��qY����`�V���U#��7`�V mIe�-����Y��e	g'���a,Q[��
��Rx<%k6a�C�������F�?�< ���:����Y�ϣ������	�L���'ߥ�^7p<�A�$'_E|�o���!����F���3O��t2�J�����y|v�}>L`(;9��]�^����6�Mwu�Y"���.KV�.��ₘ8��B���s{�m�%�ؘ7��>��:K5l��j�)Zp�������G�o
>�� �C��.Nn֭�є�lCg���hu�]DT��0�|��������a��8�i�ֿ��$�\E4m[���f�q�]փ�E�slKF�ݱ��E�������m3@`f,a�Q�xNm��󖂐J�]9R�z!�SVN�����:�Q�H���f&�qꪾ���>����AT�S�&>P�g]�̀NM���������Q�"j�pP}A��K:���!½�>,:?�=�d��@�N!��F��nԵ�E��m
.��;F9�x8��<g��~Ř5��`��J��`_����;���g�*�����3�~u&�b�dԪ�¥x������m^T(���)^�h�˃�V�My\��.��]i��I'���A�(�we�ߋ1�8��+�d�f�qa�9�B�7�t��.,@��xe�jG:�0�w�� V�vI�5[W�E����;��+�_� �T;)�F=aJ�?*i� *W���y��89QQ��Q�Ȫ/�ƶOt݁zm����f&��o�fk+yp۩D-R��(l����� l�7e�7�<;�Nħ�.���+�x���N�H@?W���P+uQE��I|[�߲�>x��U�m֚�xm��"�:Ž�pʴp��A͙=� �1$r�A�t͏�ۅ��&�%h�G�N��~�v�,�q)���c����l(ב�NJD��(����G�<�Yl��;٧�*$���y�����7�"���9�l0���+�J��Gp�ɭhyd]�9���Q��N�d�qlj�~�TͰmT�qVdk&z�fH(-�]��51�,��M��H+�S�����uhU�����(9�2�:�S:ד}��K[���cfiN�b���}H_���Z�_E-I �d/������hNm�T#������֠�E)�(vE�xdo�=5xU	D�ڢ~*�Y��¥&�����5�{&c�D3g�LG�I�/@��isR�$`-ϙ��dw�MUZ�T�5;�c���*�c�@H5џ���s������'2z�a�WJt�lPEãbH7���=��<��s���‰��\��z�ʒ�.���������x���s��eKx��_<z�_b�MW�A��*CA�d( e�K�u���������%�|	>-F�x�����٩a�yl֖��Y�,�R��򯜀`�DZ4bS|$�M������#5.֭��1zĆ�T���l4Uף�p_ƕ��G�}�s��A8Q5�� [��tO���o������$�I��/#�j��kt?w�\v3�+���M���5TǓ^,/4Y8�'3��Gf�$����;
3#r��ڧ$���V�|V�t8�����0V�p.}hՍM������xt��O�y�0�����ϟ��?c8Hy%@��=�W|DB����:\K�9�gb��5�P�&bc;�$N�f�>�+�~�Y��q$ѯz���������h0�5�^��4�Q�H6Uj3�"���Ra����-�G��V� ��K�c~n��)�h%��Z�Q\�v۲�K~�M9���ܳ��l���_$� �l�
Ů�em���;��q�f�++������8�*��Z	�&2��e�}E
�֭J��$�5���G-���:�)�@�F�$�
y~������ܺ�������J�M���RSf����9�E����16+�su�?�X�Z�7��,���R�fV��>}���R~!~F���nغ	=�
�NFM�� :���:�F��E���ǁ���!*��.i�,)!����qO &��*'
r�EMf,�[=�C�� 'k�E�����&ܙ�()��o�;�U~�nPN��<��I�0�eE3c �q���86&�����w�rvyJ��C��`�@	v��)��1F����D3ya���߇?*a�>͝x *[:���} �I�)�#YV&>�&x��wk����k��u��@Z��<��%�Q���U~!%븠��M��Az�P�� �&���rޑV.T@��Gũ@z�#�%��;0u'����d���m�)�VR.�/:g�����o�*Su����~6���vi�n޲�is?�:�^�oͤXQ[��A֡������G���W���lN圖Z$(�H+�"�g/b��$�a�D�Zr�G�-˺�A�7�[∊#�(��>}ݻ�x��Hb�Nv�������xv�w�*K�=�a��S������
R���e�VZ`7�X����-2�#��u7;-�ݦ��!�Ξ�|�� �'{�P|L����4�[O��1��9ug|,�nHrx%�UE~��e���z�F�{��_Q�L��v�y�w�Ͻ����S��c�y������0]H�>ZS���ϯ��|PvƁ�CHXx���ab�����ic���TZ4ܣ���ۄK�i+ ��ɢH�x�M����b��Q�j��gT�4K���R�H�?�-�rԊ���o���49������m�s�&�����6��Z��X��f�sps�g2}�(?�[Nz�yo�/$�@��"� H	�B߼p�ҹ��eQ�uܪ���u�-]����.�ޒ�f�gtG���f*qC���U  X0v�Z�2�U�NE+@�d�m*��[J�{��y/�h����t����gi�-����| �s��T�$�7���"4P3�Xw?3i�#sP�������K׮,|��ÂhY��{���j1،j��L��s���5��� ]7� �ڽ��?0y�����{�GSj7�C\W��;˒0.�#ep�nZ����7���\B�b��f��D��3�ϣW�2�Q�5�{�!N�_�?�Z�}���im�Ɓ��e����6�{��:���%���<"e�z;�k�C��� M�"\�(Ƽ.����]F�ܭz)z��ᭊ6��;D��D�c5XIc?����/=5�f�2i���+��h<��)�Lf֥������pQw�w�����@��v��7�2,��"�Ә�4{=qfRa�|F��Ñ��%��=�I�.O�'v��8�y�w�����Y�Rھ�t�я�i\(�]�G{��-�w5��EX�X�HE��朏5���9w}��2�K�8�-�k�B�3��gP��˽�0gHbkO�����=���۠FBB�ʲ���Eʚ�:S��u�׋�cޕ���-�d�9Ő'ð��4�A5��� �Q���`ow���\�p��Ƅ��#7dd�[�Q�0�{�r�I���b���f����,�a;
�շ�J�@�������د�O��YV���Q8�s��8�� R�X������ۑb6�f�G}&��B1��BAu/Y:�J�=Ps��$ꖭ�(A%��d�}�?�J��*�՚B�ѕa��^�=���F9G����OԜ��Z����l���x�5Q����~�D4k7�TĚm��%���C�|�|N��B,����t�u(��"Kۓو��j?p�@VAKY�ԯN�	�q��wi��h�U͒Dو�.����,�`V3_!F+��J
�N_Z�����
O�8l��u�#Q@��AQ��K�-����q��ӹty_�%_E�,���O���%���%tB��m=��6[�rL��L�\��Ԏ��.����b8jmn�P�R��1*5@]�">��H��X^Q��nv�OI�&^���2ɒ�TI�B"vK�Xfy:�8[���99��ŝ��@2v�鬚[���s$O���O>`aZEt�j_����y�.�<� A�m��u�ŤtHn�7�p�H8��(�c������}:P��T���v�yS�3���%88'�2���)�7�X��uz�(J�s;���v�A����h��a�=ُŦ́D��KE�q�_rk0Z fv���߱��J��G��)>��'E m���h��T�n4�סGu�f�Q�����pL葑;?��D"Gѓ�N�һ��c�.���-y��jM��j�������*8*�%D.�S�߸+�ן4��
����(�6�2?=�Q�SR�w8 Q˚!�g�d�
��m��/o�t��m��q����yyi�����ƃ�p���,�=ȓ�k�_�9��#��Ս��]�1���Bo�� �3¸>s���Ga���֟n��0 K
f�Pke�؆V����|.3ů�Y���xn`��?'!X/Q����u ��C�U(<Ą����'�XY�3�Q��d�sq�"Q���t�uP��%�Ǩ�g|��λ*�ԨjM;��9�B�"�	`�N�F�h���54]�LS�z��=�1o���*��Yn�jCט��Է��� �ZB�x��?l
��|��YV�Ap��B�k�9}.�H/��+0�,L���";@�,���hC<2^�)�a��� ]@��@P`�&�M��kMW��Kq�ٲJq̈T%�]f�&K/ˤ�I�� �z)nZ^'�ό�t
3/(G�2%��&M]�i�Ј�2J"�i�+NL�����g���D1q��[��J��)��l��t�#3D!d�� Љ��~9n]����G���ap�^ș�ƽ�:���z��鶶}|`ONh(�*��{�^�F���6��	� �1ck���c�V�>2S���7`|�ϸ����qzr{.�2r�<��!��o7�#C~���n(��Ȟ[�=�1�Z�Bh	nsr �����,o�ȄA���*��)��*J5���~�Y�#�l�'������"��HB�!��D�b�3ج�'#�e��v��#��z˳2�ib�3��c:I���|5>��e�552�p��oa��@�ÕҐ���TF��h��e3�z���F���A?�d���͠�.��p�sn�3�{�f����D�-����r>����b��:�^2�� &+>��΀���y����tp:����S�wx�+�Mu��x_\�c�S܁�;�._j~�D�$���:�0���g�*�MTYJ��=���V7�����.lt��uy)��BL���M��S��F��^��xʟ3�,͖�`'��e��%�L
���x���kGчps����p����Z���S1�S8�
dv��sn�_ym;Lc�huz��Zcu<����(�2E$��/�U��UFM���ڛD茿��%v%W��ɟ�?�p��-�D��t1a��pzŤ8��W+\k��J�y��ߠ:l�����=΅�>I���N�r��`#/��uP
[gM3%�@�/�q)�;��i��վ�İTw��܌��^	e\��7�6R�����7&� ��s�h��!���W3 ����zRMgܡ)�8,V����v<��2����'�Z��;����84��@�'��Lc�_`���&ؙ���	��T�@�$(6���a965����y3X�l7 z�'>��F�XW��8	ϼ���!A%Q�:t�.�K�K�ki����p�kl1�7!��K��%��K��WJf��o5��K:�2���m�%���abp�"�|�P�t�D����T��>�������L7Ӻ�ِ�X�׈�ܕ�����!ʹ�1���S�ҦgwI�+_<N�����1S������h���\Y�~�#q
P�}(�2�tC)�.D|�ӦTPm��)9���^��3���<����^~�]�ئ����_��i���_#�G-�=)'J���_
d��!��4@>ÖĜ'���'�R��
B�/w���1>(_����Y'�0&��8��g�y-�D�I�]>|qM��ټ39M��(��O��Q����qY��/)l���;���@U(	b� h�E�<B�g�T��IQ.$�;-�� ��'��b��ZM�H�J�<#���П�0��`��Hq�	ػ� t� e0X#�ٟ#���e��\�^t��}a2�u��\����dYJ�V���4�xjXK$�-G%ɫ�$|)����k�W"���*�}q��HN�s����&��o��[W�J��9������Å
�J��,d���YlB^b��_���?j�7h��V�}0�� �U�t��)/����H| ��#p��p�	����5�%�����9�q��|!N���h�����~9�Y�B��\a���LJ/�c�K���@4���8p�Wkw\u"y_lm9�\:�AQ�"�
�0��4�Q)%���G�gv���tI��E��;S����J��^;Jn��(6F6�� 
A��4ǿ��=�o@�}rU��J�7��
�:���`�G�3��[].�h���
���`�@��M��q��
�:0ߑŕų[�����u��3'w��DE=��3��.^��.�w�/_�t6�k�[��t���kK�l<M!Bm�̤��/z�rjˣ�����a+���~f�U�2k��LW���d�}�����o���y7ӚuY�F�%H7����9�fVfSE-yQ7��	s�Y�M2�>�݂��*�n����Dߗ4�7R��g����~�T��OZ�<����g�#*(�7a�v���fU5ʫ�+����)>�[�%�Y��7����R�~�������O�2B:�(���G6wk��_(��vƯQe�ږ�|��b	H*��>�J�~���*��Ep�G�p�.���9(��2BܵpN�?�a�x�oH/j�0�L�5D�X��^�[�1�o� (�A���a�?%����}��I�^��4i�:Ṕ�&�[�PN�������p�~!;f���Ĭ����P�lBQ픕��ᆏ-핱u�1N�SY�?�[lCW��NQ���ҜI5�=�t_P�<�a�4�C����sY\�<$3�����2B� FW0�Z��� ��|��lG�H�2%�jDЀp�e\wcB���-��}��ذ��q�o)M�wh�U�9�Ѥ=J��qP��S�k���� 0��k��icEfP�e�ͻd<ߜ��9i��sU���%[�DgK��Ð�sNk$�6��e��q ��#�S௱�<��B��[#�Q�x���R�\Y0�Tҩ�z̹�Zq�Ogs*�T���M� U��Vs�SI��*5b(�-�Q���;:$��ս�Kn��Ee1��������%;<������t�;���Ê֐���� G�}��Z��nZP�M��b�����YjB��~*�5�t���9gT �8�%��=Ɯ���(��r�\�;y�����W�啦z������z�N���@�	.v 4C�W�ŉic�5�*k��].O1X&)u����V|����"&��q���:UX��=����1�Ta��6�sb>���'��+ƌq��ҭXм[ȃ����nlф0J�x�Rٷ���\aL�X�n}��a�\nO�l�$�5g�#���",P)�O%����5����c�G6琍���r~'�*��-:���Q�fi��,��Ă�r���!��5*?C��5�����3���|����p\G����� ���Vo}��t3���o���˝57���.�R����?��{�4��{�?�O��~�%����k��&C`��׵�hG���{���_�?�{��_���{����z�_�o�"\�.\{� zx'��3�?��{E�_�W�+��7��b�;ࣥ��:Z������|ro�������?�����b����k^kC��E���4ǃ�>Fy�&�C��?�x��f�9����{]��G�ߛs3�A����b�.�xŇٝ��5������"����!���q���b�����8�\��TU�h��<��1������yo<������V���{���q���!��/�{�Q�=�:���ӧ�G6��4t9��my�����o�   �� ��_�