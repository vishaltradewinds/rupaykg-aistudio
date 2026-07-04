const fs = require('fs');
let code = fs.readFileSync('src/constants.ts', 'utf8');

const replacement = `export const INDIAN_STATES: Record<string, Record<string, Record<string, string[]>>> = {
  "Andhra Pradesh": {
    "Visakhapatnam": {
      "Urban": ["Gajuwaka", "MVP Colony", "Bheemunipatnam", "Pendurthi", "Madhurawada"],
      "Rural": ["Anandapuram", "Padmanabham", "Rambilli", "Munagapaka"]
    },
    "Vijayawada": {
      "Urban": ["Benz Circle", "Patamata", "Bhavanipuram", "Gollapudi"],
      "Rural": ["Ibrahimpatnam", "Kanchikacherla", "Nandigama"]
    },
    "Guntur": {
      "Urban": ["Arundelpet", "Brodipet", "Mangalagiri", "Tenali"],
      "Rural": ["Tadikonda", "Thullur", "Amaravati", "Prathipadu"]
    }
  },
  "Assam": {
    "Kamrup Metropolitan": {
      "Urban": ["Guwahati", "Dispur", "Azara", "Chandmari"],
      "Rural": ["Sonapur", "Kamalpur", "Hajo"]
    },
    "Dibrugarh": {
      "Urban": ["Dibrugarh Town", "Chabua", "Naharkatia"],
      "Rural": ["Tengakhat", "Moran", "Tingkhong"]
    }
  },
  "Bihar": {
    "Patna": {
      "Urban": ["Kankarbagh", "Rajendra Nagar", "Patliputra", "Danapur"],
      "Rural": ["Maner", "Bihta", "Naubatpur", "Paliganj"]
    },
    "Gaya": {
      "Urban": ["Bodh Gaya", "Gaya Town", "Sherghati"],
      "Rural": ["Dobhi", "Barachatti", "Fatehpur"]
    },
    "Muzaffarpur": {
      "Urban": ["Motijheel", "Mithanpura", "Ahiyapur"],
      "Rural": ["Minapur", "Bochahan", "Kanti"]
    }
  },
  "Gujarat": {
    "Ahmedabad": {
      "Urban": ["Navrangpura", "Vastrapur", "Satellite", "Bopal", "Maninagar"],
      "Rural": ["Sanand", "Daskroi", "Bavla", "Dholka"]
    },
    "Surat": {
      "Urban": ["Adajan", "Vesu", "Piplod", "Varachha", "Katargam"],
      "Rural": ["Olpad", "Kamrej", "Palsana", "Bardoli"]
    },
    "Vadodara": {
      "Urban": ["Alkapuri", "Akota", "Fatehgunj", "Karelibaug"],
      "Rural": ["Padra", "Savli", "Karjan", "Waghodia"]
    }
  },
  "Haryana": {
    "Gurugram": {
      "Urban": ["DLF Phase 1-5", "Cyber City", "Sushant Lok", "Golf Course Road"],
      "Rural": ["Sohna", "Pataudi", "Farrukhnagar"]
    },
    "Faridabad": {
      "Urban": ["NIT", "Green Fields", "Sector 15", "Ballabgarh"],
      "Rural": ["Tigaon", "Prithla", "Hassanpur"]
    }
  },
  "Karnataka": {
    "Bengaluru Urban": {
      "Urban": ["Koramangala", "Indiranagar", "Whitefield", "Jayanagar", "Malleswaram", "HSR Layout"],
      "Rural": []
    },
    "Bengaluru Rural": {
      "Urban": ["Devanahalli", "Nelamangala"],
      "Rural": ["Dodballapura", "Hoskote", "Tubagere", "Vijayapura"]
    },
    "Mysuru": {
      "Urban": ["Gokulam", "Kuvempunagar", "Saraswathipuram", "Vijayanagar"],
      "Rural": ["Hunsur", "Nanjangud", "HD Kote", "Periyapatna"]
    },
    "Hubballi-Dharwad": {
      "Urban": ["Vidya Nagar", "Navanagar", "Gokul Road", "Saptapur"],
      "Rural": ["Kundgol", "Kalghatgi", "Navalgund"]
    }
  },
  "Kerala": {
    "Thiruvananthapuram": {
      "Urban": ["Kowdiar", "Vellayambalam", "Kazhakkoottam", "Pettah"],
      "Rural": ["Neyyattinkara", "Nedumangad", "Kattakkada", "Varkala"]
    },
    "Ernakulam": {
      "Urban": ["Kochi", "Edappally", "Kakkanad", "Fort Kochi", "Aluva"],
      "Rural": ["Paravur", "Muvattupuzha", "Kothamangalam", "Angamaly"]
    },
    "Kozhikode": {
      "Urban": ["Nadakkavu", "Vellimadukunnu", "Mavoor Road", "Eranhipaalam"],
      "Rural": ["Vadakara", "Koyilandy", "Thamarassery"]
    }
  },
  "Madhya Pradesh": {
    "Indore": {
      "Urban": ["Vijay Nagar", "Palasia", "Bhawarkuan", "Rajwada"],
      "Rural": ["Mhow", "Sanwer", "Depalpur", "Rau"]
    },
    "Bhopal": {
      "Urban": ["MP Nagar", "Arera Colony", "Kolar Road", "Bairagarh"],
      "Rural": ["Berasia", "Huzur", "Phanda"]
    }
  },
  "Maharashtra": {
    "Mumbai": {
      "Urban": ["Andheri", "Bandra", "Colaba", "Dadar", "Juhu", "Borivali", "Goregaon", "Worli"],
      "Rural": []
    },
    "Pune": {
      "Urban": ["Kothrud", "Hinjewadi", "Shivajinagar", "Kharadi", "Wakad", "Baner", "Viman Nagar"],
      "Rural": ["Bhor", "Velhe", "Purandar", "Haveli", "Mulshi", "Shirur", "Baramati"]
    },
    "Nagpur": {
      "Urban": ["Sitabuldi", "Dharampeth", "Sadar", "Manewada", "Wardhaman Nagar"],
      "Rural": ["Kamptee", "Hingna", "Umred", "Katol", "Saoner"]
    },
    "Nashik": {
      "Urban": ["Panchavati", "Satpur", "Ambad", "Indira Nagar", "CIDCO"],
      "Rural": ["Igatpuri", "Trimbakeshwar", "Sinnar", "Niphad", "Dindori"]
    }
  },
  "Punjab": {
    "Ludhiana": {
      "Urban": ["Model Town", "Sarabha Nagar", "BRS Nagar", "Civil Lines"],
      "Rural": ["Jagraon", "Khanna", "Raikot", "Samrala"]
    },
    "Amritsar": {
      "Urban": ["Ranjit Avenue", "Civil Lines", "Putlighar", "Majitha Road"],
      "Rural": ["Ajnala", "Baba Bakala", "Attari"]
    }
  },
  "Rajasthan": {
    "Jaipur": {
      "Urban": ["Malviya Nagar", "Vaishali Nagar", "Mansarovar", "C Scheme", "Bapu Nagar"],
      "Rural": ["Sanganer", "Bassi", "Chomu", "Phagi", "Kotputli"]
    },
    "Jodhpur": {
      "Urban": ["Sardarpura", "Chopasni Housing Board", "Shastri Nagar"],
      "Rural": ["Osian", "Phalodi", "Balesar", "Luni"]
    },
    "Udaipur": {
      "Urban": ["Fatehpura", "Hiran Magri", "Madhuban", "Shobhagpura"],
      "Rural": ["Girwa", "Mavli", "Vallabhnagar", "Salumber"]
    }
  },
  "Tamil Nadu": {
    "Chennai": {
      "Urban": ["T Nagar", "Adyar", "Velachery", "Mylapore", "Anna Nagar", "Tambaram", "Guindy"],
      "Rural": []
    },
    "Coimbatore": {
      "Urban": ["Peelamedu", "RS Puram", "Gandhipuram", "Vadavalli", "Saravanampatti"],
      "Rural": ["Pollachi", "Mettupalayam", "Valparai", "Kinathukadavu"]
    },
    "Madurai": {
      "Urban": ["Anna Nagar", "KK Nagar", "SS Colony", "Tallakulam"],
      "Rural": ["Melur", "Usilampatti", "Thirumangalam", "Vadipatti"]
    },
    "Tiruchirappalli": {
      "Urban": ["Srirangam", "Thillai Nagar", "Cantonment", "Woraiyur"],
      "Rural": ["Manapparai", "Lalgudi", "Musiri", "Thuraiyur"]
    }
  },
  "Telangana": {
    "Hyderabad": {
      "Urban": ["Banjara Hills", "Jubilee Hills", "HITEC City", "Gachibowli", "Kukatpally", "Madhapur"],
      "Rural": []
    },
    "Ranga Reddy": {
      "Urban": ["Shamshabad", "Ibrahimpatnam"],
      "Rural": ["Chevella", "Shadnagar", "Moinabad", "Maheshwaram"]
    }
  },
  "Uttar Pradesh": {
    "Lucknow": {
      "Urban": ["Gomti Nagar", "Hazratganj", "Aliganj", "Indira Nagar", "Mahanagar"],
      "Rural": ["Malihabad", "Bakshi Ka Talab", "Mohanlalganj", "Gosainganj"]
    },
    "Kanpur": {
      "Urban": ["Kidwai Nagar", "Civil Lines", "Kakadeo", "Swaroop Nagar"],
      "Rural": ["Ghatampur", "Bilhaur", "Shivrajpur", "Kalyanpur"]
    },
    "Varanasi": {
      "Urban": ["Lanka", "Sigra", "Bhelupur", "Cantt", "Assi"],
      "Rural": ["Pindra", "Sewapuri", "Arajiline", "Cholapur"]
    },
    "Agra": {
      "Urban": ["Tajganj", "Sikandra", "Dayalbagh", "Kamla Nagar"],
      "Rural": ["Fatehabad", "Kheragarh", "Kiraoli", "Bah"]
    }
  },
  "West Bengal": {
    "Kolkata": {
      "Urban": ["Salt Lake", "New Town", "Ballygunge", "Alipore", "Park Street", "Jadavpur"],
      "Rural": []
    },
    "Howrah": {
      "Urban": ["Shibpur", "Santragachi", "Salkia", "Bally"],
      "Rural": ["Uluberia", "Bagnan", "Amta", "Jagatballavpur"]
    },
    "Darjeeling": {
      "Urban": ["Darjeeling Town", "Kurseong", "Siliguri"],
      "Rural": ["Mirik", "Phansidewa", "Naxalbari", "Matigara"]
    }
  }
};`;

code = code.replace(/export const INDIAN_STATES: Record<string, Record<string, Record<string, string\[\]>>> = \{[\s\S]*?\};/, replacement);

fs.writeFileSync('src/constants.ts', code);
console.log("Constants updated with comprehensive states");
