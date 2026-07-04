const fs = require('fs');

const statesData = {
  "Andaman and Nicobar Islands": {
    "South Andaman": {
      "Urban": ["Port Blair Ward 1", "Port Blair Ward 2", "Port Blair Ward 3", "Port Blair Ward 4", "Port Blair Ward 5"],
      "Rural": ["Bambooflat", "Garacharma", "Prothrapur", "Ferrargunj", "Wimberlygunj"]
    },
    "Nicobar": {
      "Urban": [],
      "Rural": ["Car Nicobar", "Nancowry", "Great Nicobar", "Kamorta"]
    }
  },
  "Andhra Pradesh": {
    "Visakhapatnam": {
      "Urban": ["Gajuwaka Ward 1", "MVP Colony Ward 2", "Bheemunipatnam Ward 3", "Pendurthi Ward 4", "Madhurawada Ward 5"],
      "Rural": ["Anandapuram Village", "Padmanabham Village", "Rambilli Village", "Munagapaka Village"]
    },
    "Vijayawada": {
      "Urban": ["Benz Circle Ward 1", "Patamata Ward 2", "Bhavanipuram Ward 3", "Gollapudi Ward 4"],
      "Rural": ["Ibrahimpatnam Village", "Kanchikacherla Village", "Nandigama Village"]
    },
    "Guntur": {
      "Urban": ["Arundelpet Ward 1", "Brodipet Ward 2", "Mangalagiri Ward 3", "Tenali Ward 4"],
      "Rural": ["Tadikonda Village", "Thullur Village", "Amaravati Village", "Prathipadu Village"]
    },
    "Tirupati": {
      "Urban": ["Alipiri Ward 1", "Tiruchanoor Ward 2", "Renigunta Ward 3"],
      "Rural": ["Chandragiri Village", "Pakala Village", "Puttur Village"]
    }
  },
  "Arunachal Pradesh": {
    "Papum Pare": {
      "Urban": ["Itanagar Ward 1", "Itanagar Ward 2", "Naharlagun Ward 1", "Naharlagun Ward 2"],
      "Rural": ["Doimukh Village", "Sagalee Village", "Kimin Village"]
    },
    "Tawang": {
      "Urban": ["Tawang Town Ward 1", "Tawang Town Ward 2"],
      "Rural": ["Lumla Village", "Jang Village", "Zemithang Village"]
    }
  },
  "Assam": {
    "Kamrup Metropolitan": {
      "Urban": ["Guwahati Ward 1", "Guwahati Ward 2", "Dispur Ward 1", "Azara Ward 1", "Chandmari Ward 1"],
      "Rural": ["Sonapur Village", "Kamalpur Village", "Hajo Village"]
    },
    "Dibrugarh": {
      "Urban": ["Dibrugarh Town Ward 1", "Dibrugarh Town Ward 2", "Chabua Ward 1"],
      "Rural": ["Tengakhat Village", "Moran Village", "Tingkhong Village"]
    },
    "Jorhat": {
      "Urban": ["Jorhat Town Ward 1", "Jorhat Town Ward 2", "Titabor Ward 1"],
      "Rural": ["Teok Village", "Majuli Village", "Mariani Village"]
    }
  },
  "Bihar": {
    "Patna": {
      "Urban": ["Kankarbagh Ward 1", "Rajendra Nagar Ward 2", "Patliputra Ward 3", "Danapur Ward 4"],
      "Rural": ["Maner Village", "Bihta Village", "Naubatpur Village", "Paliganj Village"]
    },
    "Gaya": {
      "Urban": ["Bodh Gaya Ward 1", "Gaya Town Ward 1", "Sherghati Ward 1"],
      "Rural": ["Dobhi Village", "Barachatti Village", "Fatehpur Village"]
    },
    "Muzaffarpur": {
      "Urban": ["Motijheel Ward 1", "Mithanpura Ward 1", "Ahiyapur Ward 1"],
      "Rural": ["Minapur Village", "Bochahan Village", "Kanti Village"]
    },
    "Bhagalpur": {
      "Urban": ["Nathnagar Ward 1", "Kahalgaon Ward 1", "Sultanganj Ward 1"],
      "Rural": ["Sabour Village", "Colgong Village", "Pirpainti Village"]
    }
  },
  "Chandigarh": {
    "Chandigarh": {
      "Urban": ["Sector 17 Ward 1", "Sector 22 Ward 2", "Sector 35 Ward 3", "Manimajra Ward 4"],
      "Rural": ["Kishangarh Village", "Kaimbwala Village", "Khuda Ali Sher Village"]
    }
  },
  "Chhattisgarh": {
    "Raipur": {
      "Urban": ["Tatibandh Ward 1", "Shankar Nagar Ward 2", "Civil Lines Ward 3", "Naya Raipur Ward 4"],
      "Rural": ["Abhanpur Village", "Arang Village", "Tilda Village"]
    },
    "Bilaspur": {
      "Urban": ["Sarkanda Ward 1", "Tarbahar Ward 2", "Tifra Ward 3"],
      "Rural": ["Kota Village", "Takhatpur Village", "Masturi Village"]
    },
    "Bastar": {
      "Urban": ["Jagdalpur Ward 1", "Jagdalpur Ward 2"],
      "Rural": ["Bastanar Village", "Tokapal Village", "Lohandiguda Village"]
    }
  },
  "Dadra and Nagar Haveli and Daman and Diu": {
    "Daman": {
      "Urban": ["Nani Daman Ward 1", "Moti Daman Ward 2"],
      "Rural": ["Kachigam Village", "Bhimpore Village", "Marwad Village"]
    },
    "Dadra and Nagar Haveli": {
      "Urban": ["Silvassa Ward 1", "Silvassa Ward 2"],
      "Rural": ["Dadra Village", "Naroli Village", "Samarvarni Village"]
    }
  },
  "Delhi": {
    "New Delhi": {
      "Urban": ["Connaught Place Ward 1", "Chanakyapuri Ward 2", "Vasant Vihar Ward 3", "RK Puram Ward 4"],
      "Rural": []
    },
    "South West Delhi": {
      "Urban": ["Dwarka Ward 1", "Najafgarh Ward 2", "Palam Ward 3"],
      "Rural": ["Chhawla Village", "Kapashera Village", "Ghumanhera Village"]
    },
    "North West Delhi": {
      "Urban": ["Rohini Ward 1", "Pitampura Ward 2", "Shalimar Bagh Ward 3"],
      "Rural": ["Kanjhawala Village", "Bawana Village", "Narela Village"]
    }
  },
  "Goa": {
    "North Goa": {
      "Urban": ["Panaji Ward 1", "Mapusa Ward 2", "Porvorim Ward 3", "Calangute Ward 4"],
      "Rural": ["Bicholim Village", "Pernem Village", "Sattari Village"]
    },
    "South Goa": {
      "Urban": ["Margao Ward 1", "Vasco da Gama Ward 2", "Ponda Ward 3"],
      "Rural": ["Salcete Village", "Quepem Village", "Canacona Village", "Sanguem Village"]
    }
  },
  "Gujarat": {
    "Ahmedabad": {
      "Urban": ["Navrangpura Ward 1", "Vastrapur Ward 2", "Satellite Ward 3", "Bopal Ward 4", "Maninagar Ward 5"],
      "Rural": ["Sanand Village", "Daskroi Village", "Bavla Village", "Dholka Village"]
    },
    "Surat": {
      "Urban": ["Adajan Ward 1", "Vesu Ward 2", "Piplod Ward 3", "Varachha Ward 4", "Katargam Ward 5"],
      "Rural": ["Olpad Village", "Kamrej Village", "Palsana Village", "Bardoli Village"]
    },
    "Vadodara": {
      "Urban": ["Alkapuri Ward 1", "Akota Ward 2", "Fatehgunj Ward 3", "Karelibaug Ward 4"],
      "Rural": ["Padra Village", "Savli Village", "Karjan Village", "Waghodia Village"]
    },
    "Rajkot": {
      "Urban": ["Kalawad Road Ward 1", "Amin Marg Ward 2", "Yagnik Road Ward 3"],
      "Rural": ["Gondal Village", "Jasdan Village", "Morbi Village"]
    }
  },
  "Haryana": {
    "Gurugram": {
      "Urban": ["DLF Phase 1-5 Ward 1", "Cyber City Ward 2", "Sushant Lok Ward 3", "Golf Course Road Ward 4"],
      "Rural": ["Sohna Village", "Pataudi Village", "Farrukhnagar Village"]
    },
    "Faridabad": {
      "Urban": ["NIT Ward 1", "Green Fields Ward 2", "Sector 15 Ward 3", "Ballabgarh Ward 4"],
      "Rural": ["Tigaon Village", "Prithla Village", "Hassanpur Village"]
    },
    "Panchkula": {
      "Urban": ["Sector 20 Ward 1", "Sector 21 Ward 2", "Pinjore Ward 3"],
      "Rural": ["Kalka Village", "Barwala Village", "Morni Village"]
    }
  },
  "Himachal Pradesh": {
    "Shimla": {
      "Urban": ["Mall Road Ward 1", "Sanjauli Ward 2", "Chotta Shimla Ward 3", "Tutu Ward 4"],
      "Rural": ["Theog Village", "Rampur Village", "Chopal Village", "Jubbal Village"]
    },
    "Kangra": {
      "Urban": ["Dharamshala Ward 1", "Palampur Ward 2", "Kangra Town Ward 3"],
      "Rural": ["Baijnath Village", "Dehra Village", "Nurpur Village"]
    },
    "Mandi": {
      "Urban": ["Mandi Town Ward 1", "Sundernagar Ward 2"],
      "Rural": ["Jogindernagar Village", "Karsog Village", "Sarkaghat Village"]
    }
  },
  "Jammu and Kashmir": {
    "Srinagar": {
      "Urban": ["Lal Chowk Ward 1", "Rajbagh Ward 2", "Dal Gate Ward 3", "Hazratbal Ward 4"],
      "Rural": ["Khonmoh Village", "Dhara Village", "Phak Village"]
    },
    "Jammu": {
      "Urban": ["Gandhi Nagar Ward 1", "Trikuta Nagar Ward 2", "Bahu Fort Ward 3"],
      "Rural": ["R S Pura Village", "Akhnoor Village", "Bishnah Village"]
    },
    "Anantnag": {
      "Urban": ["Anantnag Town Ward 1", "Bijbehara Ward 2"],
      "Rural": ["Pahalgam Village", "Dooru Village", "Kokernag Village"]
    }
  },
  "Jharkhand": {
    "Ranchi": {
      "Urban": ["Morabadi Ward 1", "Doranda Ward 2", "Hinoo Ward 3", "Kanke Ward 4"],
      "Rural": ["Ormanjhi Village", "Namkum Village", "Silli Village"]
    },
    "East Singhbhum": {
      "Urban": ["Jamshedpur Ward 1", "Bistupur Ward 2", "Sakchi Ward 3", "Mango Ward 4"],
      "Rural": ["Ghatshila Village", "Potka Village", "Patamda Village"]
    },
    "Dhanbad": {
      "Urban": ["Bank More Ward 1", "Saraidhela Ward 2", "Jharia Ward 3"],
      "Rural": ["Nirsa Village", "Topchanchi Village", "Tundi Village"]
    }
  },
  "Karnataka": {
    "Bengaluru Urban": {
      "Urban": ["Koramangala Ward 1", "Indiranagar Ward 2", "Whitefield Ward 3", "Jayanagar Ward 4", "Malleswaram Ward 5", "HSR Layout Ward 6"],
      "Rural": []
    },
    "Bengaluru Rural": {
      "Urban": ["Devanahalli Ward 1", "Nelamangala Ward 2"],
      "Rural": ["Dodballapura Village", "Hoskote Village", "Tubagere Village", "Vijayapura Village"]
    },
    "Mysuru": {
      "Urban": ["Gokulam Ward 1", "Kuvempunagar Ward 2", "Saraswathipuram Ward 3", "Vijayanagar Ward 4"],
      "Rural": ["Hunsur Village", "Nanjangud Village", "HD Kote Village", "Periyapatna Village"]
    },
    "Hubballi-Dharwad": {
      "Urban": ["Vidya Nagar Ward 1", "Navanagar Ward 2", "Gokul Road Ward 3", "Saptapur Ward 4"],
      "Rural": ["Kundgol Village", "Kalghatgi Village", "Navalgund Village"]
    },
    "Mangaluru": {
      "Urban": ["Kodialbail Ward 1", "Kadri Ward 2", "Urwa Ward 3", "Bejai Ward 4"],
      "Rural": ["Bantwal Village", "Puttur Village", "Sullia Village"]
    }
  },
  "Kerala": {
    "Thiruvananthapuram": {
      "Urban": ["Kowdiar Ward 1", "Vellayambalam Ward 2", "Kazhakkoottam Ward 3", "Pettah Ward 4"],
      "Rural": ["Neyyattinkara Village", "Nedumangad Village", "Kattakkada Village", "Varkala Village"]
    },
    "Ernakulam": {
      "Urban": ["Kochi Ward 1", "Edappally Ward 2", "Kakkanad Ward 3", "Fort Kochi Ward 4", "Aluva Ward 5"],
      "Rural": ["Paravur Village", "Muvattupuzha Village", "Kothamangalam Village", "Angamaly Village"]
    },
    "Kozhikode": {
      "Urban": ["Nadakkavu Ward 1", "Vellimadukunnu Ward 2", "Mavoor Road Ward 3", "Eranhipaalam Ward 4"],
      "Rural": ["Vadakara Village", "Koyilandy Village", "Thamarassery Village"]
    },
    "Thrissur": {
      "Urban": ["Swaraj Round Ward 1", "Poonkunnam Ward 2", "Ollur Ward 3"],
      "Rural": ["Chalakudy Village", "Irinjalakuda Village", "Guruvayur Village"]
    }
  },
  "Ladakh": {
    "Leh": {
      "Urban": ["Leh Town Ward 1", "Leh Town Ward 2"],
      "Rural": ["Nubra Village", "Khalsi Village", "Nyoma Village"]
    },
    "Kargil": {
      "Urban": ["Kargil Town Ward 1", "Kargil Town Ward 2"],
      "Rural": ["Zanskar Village", "Sanku Village", "Drass Village"]
    }
  },
  "Lakshadweep": {
    "Lakshadweep": {
      "Urban": ["Kavaratti Ward 1", "Kavaratti Ward 2"],
      "Rural": ["Agatti Village", "Amini Village", "Andrott Village", "Minicoy Village"]
    }
  },
  "Madhya Pradesh": {
    "Indore": {
      "Urban": ["Vijay Nagar Ward 1", "Palasia Ward 2", "Bhawarkuan Ward 3", "Rajwada Ward 4"],
      "Rural": ["Mhow Village", "Sanwer Village", "Depalpur Village", "Rau Village"]
    },
    "Bhopal": {
      "Urban": ["MP Nagar Ward 1", "Arera Colony Ward 2", "Kolar Road Ward 3", "Bairagarh Ward 4"],
      "Rural": ["Berasia Village", "Huzur Village", "Phanda Village"]
    },
    "Gwalior": {
      "Urban": ["Lashkar Ward 1", "Morar Ward 2", "Thatipur Ward 3"],
      "Rural": ["Dabra Village", "Bhitarwar Village", "Ghatigaon Village"]
    },
    "Jabalpur": {
      "Urban": ["Civil Lines Ward 1", "Wright Town Ward 2", "Ranjhi Ward 3"],
      "Rural": ["Panagar Village", "Patan Village", "Kundam Village"]
    }
  },
  "Maharashtra": {
    "Mumbai": {
      "Urban": ["Andheri Ward 1", "Bandra Ward 2", "Colaba Ward 3", "Dadar Ward 4", "Juhu Ward 5", "Borivali Ward 6", "Goregaon Ward 7", "Worli Ward 8"],
      "Rural": []
    },
    "Pune": {
      "Urban": ["Kothrud Ward 1", "Hinjewadi Ward 2", "Shivajinagar Ward 3", "Kharadi Ward 4", "Wakad Ward 5", "Baner Ward 6", "Viman Nagar Ward 7"],
      "Rural": ["Bhor Village", "Velhe Village", "Purandar Village", "Haveli Village", "Mulshi Village", "Shirur Village", "Baramati Village"]
    },
    "Nagpur": {
      "Urban": ["Sitabuldi Ward 1", "Dharampeth Ward 2", "Sadar Ward 3", "Manewada Ward 4", "Wardhaman Nagar Ward 5"],
      "Rural": ["Kamptee Village", "Hingna Village", "Umred Village", "Katol Village", "Saoner Village"]
    },
    "Nashik": {
      "Urban": ["Panchavati Ward 1", "Satpur Ward 2", "Ambad Ward 3", "Indira Nagar Ward 4", "CIDCO Ward 5"],
      "Rural": ["Igatpuri Village", "Trimbakeshwar Village", "Sinnar Village", "Niphad Village", "Dindori Village"]
    },
    "Thane": {
      "Urban": ["Naupada Ward 1", "Vartak Nagar Ward 2", "Kopri Ward 3", "Majiwada Ward 4"],
      "Rural": ["Shahapur Village", "Murbad Village", "Kalyan Rural Village"]
    }
  },
  "Manipur": {
    "Imphal West": {
      "Urban": ["Thangmeiband Ward 1", "Uripok Ward 2", "Sagolband Ward 3", "Keishamthong Ward 4"],
      "Rural": ["Lamsang Village", "Patsoi Village", "Wangoi Village"]
    },
    "Imphal East": {
      "Urban": ["Khurai Ward 1", "Wangkhei Ward 2", "Porompat Ward 3"],
      "Rural": ["Sawombung Village", "Keirao Bitra Village", "Jiribam Village"]
    }
  },
  "Meghalaya": {
    "East Khasi Hills": {
      "Urban": ["Shillong Ward 1", "Laitumkhrah Ward 2", "Pynthorumkhrah Ward 3", "Mawlai Ward 4"],
      "Rural": ["Mylliem Village", "Mawryngkneng Village", "Mawsynram Village"]
    },
    "West Garo Hills": {
      "Urban": ["Tura Ward 1", "Tura Ward 2"],
      "Rural": ["Dadenggre Village", "Rongram Village", "Tikrikilla Village"]
    }
  },
  "Mizoram": {
    "Aizawl": {
      "Urban": ["Dawrpui Ward 1", "Khatla Ward 2", "Bawngkawn Ward 3", "Chanmari Ward 4"],
      "Rural": ["Darlawn Village", "Thingsulthliah Village", "Aibawk Village"]
    },
    "Lunglei": {
      "Urban": ["Lunglei Town Ward 1", "Lunglei Town Ward 2"],
      "Rural": ["Hnahthial Village", "Lungsen Village", "Bunghmun Village"]
    }
  },
  "Nagaland": {
    "Kohima": {
      "Urban": ["Kohima Town Ward 1", "Kohima Town Ward 2", "Kohima Town Ward 3"],
      "Rural": ["Chiephobozou Village", "Jakhama Village", "Sechu Zubza Village"]
    },
    "Dimapur": {
      "Urban": ["Dimapur Town Ward 1", "Dimapur Town Ward 2", "Chumukedima Ward 1"],
      "Rural": ["Medziphema Village", "Niuland Village", "Dhansiripar Village"]
    }
  },
  "Odisha": {
    "Khordha": {
      "Urban": ["Bhubaneswar Ward 1", "Bhubaneswar Ward 2", "Jatni Ward 1", "Khordha Town Ward 1"],
      "Rural": ["Begunia Village", "Bolagarh Village", "Chilika Village"]
    },
    "Cuttack": {
      "Urban": ["Cuttack City Ward 1", "Cuttack City Ward 2", "Choudwar Ward 1"],
      "Rural": ["Athagarh Village", "Banki Village", "Niali Village"]
    },
    "Ganjam": {
      "Urban": ["Brahmapur Ward 1", "Brahmapur Ward 2", "Chatrapur Ward 1"],
      "Rural": ["Aska Village", "Bhanjanagar Village", "Hinjilicut Village"]
    }
  },
  "Puducherry": {
    "Puducherry": {
      "Urban": ["White Town Ward 1", "Lawspet Ward 2", "Ozhukarai Ward 3", "Ariyankuppam Ward 4"],
      "Rural": ["Villianur Village", "Bahour Village", "Nettapakkam Village"]
    },
    "Karaikal": {
      "Urban": ["Karaikal Town Ward 1", "Karaikal Town Ward 2"],
      "Rural": ["Thirunallar Village", "Nedungadu Village", "Kottucherry Village"]
    }
  },
  "Punjab": {
    "Ludhiana": {
      "Urban": ["Model Town Ward 1", "Sarabha Nagar Ward 2", "BRS Nagar Ward 3", "Civil Lines Ward 4"],
      "Rural": ["Jagraon Village", "Khanna Village", "Raikot Village", "Samrala Village"]
    },
    "Amritsar": {
      "Urban": ["Ranjit Avenue Ward 1", "Civil Lines Ward 2", "Putlighar Ward 3", "Majitha Road Ward 4"],
      "Rural": ["Ajnala Village", "Baba Bakala Village", "Attari Village"]
    },
    "Jalandhar": {
      "Urban": ["Model Town Ward 1", "Adarsh Nagar Ward 2", "Jalandhar Cantt Ward 3"],
      "Rural": ["Nakodar Village", "Phillaur Village", "Shahkot Village"]
    }
  },
  "Rajasthan": {
    "Jaipur": {
      "Urban": ["Malviya Nagar Ward 1", "Vaishali Nagar Ward 2", "Mansarovar Ward 3", "C Scheme Ward 4", "Bapu Nagar Ward 5"],
      "Rural": ["Sanganer Village", "Bassi Village", "Chomu Village", "Phagi Village", "Kotputli Village"]
    },
    "Jodhpur": {
      "Urban": ["Sardarpura Ward 1", "Chopasni Housing Board Ward 2", "Shastri Nagar Ward 3"],
      "Rural": ["Osian Village", "Phalodi Village", "Balesar Village", "Luni Village"]
    },
    "Udaipur": {
      "Urban": ["Fatehpura Ward 1", "Hiran Magri Ward 2", "Madhuban Ward 3", "Shobhagpura Ward 4"],
      "Rural": ["Girwa Village", "Mavli Village", "Vallabhnagar Village", "Salumber Village"]
    },
    "Kota": {
      "Urban": ["Talwandi Ward 1", "Mahaveer Nagar Ward 2", "Dadabari Ward 3"],
      "Rural": ["Sangod Village", "Pipalda Village", "Digod Village"]
    }
  },
  "Sikkim": {
    "East Sikkim": {
      "Urban": ["Gangtok Ward 1", "Gangtok Ward 2", "Singtam Ward 1", "Rangpo Ward 1"],
      "Rural": ["Pakyong Village", "Rongli Village", "Rhenock Village"]
    },
    "South Sikkim": {
      "Urban": ["Namchi Ward 1", "Jorethang Ward 1"],
      "Rural": ["Ravangla Village", "Temi Tarku Village", "Yangang Village"]
    }
  },
  "Tamil Nadu": {
    "Chennai": {
      "Urban": ["T Nagar Ward 1", "Adyar Ward 2", "Velachery Ward 3", "Mylapore Ward 4", "Anna Nagar Ward 5", "Tambaram Ward 6", "Guindy Ward 7"],
      "Rural": []
    },
    "Coimbatore": {
      "Urban": ["Peelamedu Ward 1", "RS Puram Ward 2", "Gandhipuram Ward 3", "Vadavalli Ward 4", "Saravanampatti Ward 5"],
      "Rural": ["Pollachi Village", "Mettupalayam Village", "Valparai Village", "Kinathukadavu Village"]
    },
    "Madurai": {
      "Urban": ["Anna Nagar Ward 1", "KK Nagar Ward 2", "SS Colony Ward 3", "Tallakulam Ward 4"],
      "Rural": ["Melur Village", "Usilampatti Village", "Thirumangalam Village", "Vadipatti Village"]
    },
    "Tiruchirappalli": {
      "Urban": ["Srirangam Ward 1", "Thillai Nagar Ward 2", "Cantonment Ward 3", "Woraiyur Ward 4"],
      "Rural": ["Manapparai Village", "Lalgudi Village", "Musiri Village", "Thuraiyur Village"]
    },
    "Salem": {
      "Urban": ["Hasthampatti Ward 1", "Suramangalam Ward 2", "Ammapet Ward 3", "Kondalampatti Ward 4"],
      "Rural": ["Attur Village", "Omalur Village", "Mettur Village", "Sankari Village"]
    }
  },
  "Telangana": {
    "Hyderabad": {
      "Urban": ["Banjara Hills Ward 1", "Jubilee Hills Ward 2", "HITEC City Ward 3", "Gachibowli Ward 4", "Kukatpally Ward 5", "Madhapur Ward 6"],
      "Rural": []
    },
    "Ranga Reddy": {
      "Urban": ["Shamshabad Ward 1", "Ibrahimpatnam Ward 1"],
      "Rural": ["Chevella Village", "Shadnagar Village", "Moinabad Village", "Maheshwaram Village"]
    },
    "Medchal-Malkajgiri": {
      "Urban": ["Malkajgiri Ward 1", "Alwal Ward 1", "Quthbullapur Ward 1", "Uppal Ward 1"],
      "Rural": ["Medchal Village", "Keesara Village", "Ghatkesar Village"]
    },
    "Warangal": {
      "Urban": ["Hanamkonda Ward 1", "Kazipet Ward 1", "Warangal Fort Ward 1"],
      "Rural": ["Wardhannapet Village", "Narsampet Village", "Parkal Village"]
    }
  },
  "Tripura": {
    "West Tripura": {
      "Urban": ["Agartala Ward 1", "Agartala Ward 2", "Agartala Ward 3", "Agartala Ward 4"],
      "Rural": ["Mohanpur Village", "Jirania Village", "Dukli Village"]
    },
    "Gomati": {
      "Urban": ["Udaipur Ward 1", "Amarpur Ward 1"],
      "Rural": ["Kakraban Village", "Matabari Village", "Killa Village"]
    }
  },
  "Uttar Pradesh": {
    "Lucknow": {
      "Urban": ["Gomti Nagar Ward 1", "Hazratganj Ward 2", "Aliganj Ward 3", "Indira Nagar Ward 4", "Mahanagar Ward 5"],
      "Rural": ["Malihabad Village", "Bakshi Ka Talab Village", "Mohanlalganj Village", "Gosainganj Village"]
    },
    "Kanpur": {
      "Urban": ["Kidwai Nagar Ward 1", "Civil Lines Ward 2", "Kakadeo Ward 3", "Swaroop Nagar Ward 4"],
      "Rural": ["Ghatampur Village", "Bilhaur Village", "Shivrajpur Village", "Kalyanpur Village"]
    },
    "Varanasi": {
      "Urban": ["Lanka Ward 1", "Sigra Ward 2", "Bhelupur Ward 3", "Cantt Ward 4", "Assi Ward 5"],
      "Rural": ["Pindra Village", "Sewapuri Village", "Arajiline Village", "Cholapur Village"]
    },
    "Agra": {
      "Urban": ["Tajganj Ward 1", "Sikandra Ward 2", "Dayalbagh Ward 3", "Kamla Nagar Ward 4"],
      "Rural": ["Fatehabad Village", "Kheragarh Village", "Kiraoli Village", "Bah Village"]
    },
    "Gautam Buddha Nagar": {
      "Urban": ["Noida Sector 18 Ward 1", "Greater Noida Ward 2", "Noida Sector 62 Ward 3"],
      "Rural": ["Dadri Village", "Jewar Village", "Dankaur Village"]
    }
  },
  "Uttarakhand": {
    "Dehradun": {
      "Urban": ["Rajpur Road Ward 1", "Dalanwala Ward 2", "Clement Town Ward 3", "Premnagar Ward 4"],
      "Rural": ["Vikasnagar Village", "Rishikesh Rural Village", "Doiwala Village", "Kalsi Village"]
    },
    "Haridwar": {
      "Urban": ["Har Ki Pauri Ward 1", "Kankhal Ward 2", "Jwalapur Ward 3", "Roorkee Ward 4"],
      "Rural": ["Bhagwanpur Village", "Laksar Village", "Narsan Village"]
    },
    "Nainital": {
      "Urban": ["Nainital Town Ward 1", "Haldwani Ward 2", "Ramnagar Ward 3"],
      "Rural": ["Bhimtal Village", "Bhowali Village", "Betalghat Village"]
    }
  },
  "West Bengal": {
    "Kolkata": {
      "Urban": ["Salt Lake Ward 1", "New Town Ward 2", "Ballygunge Ward 3", "Alipore Ward 4", "Park Street Ward 5", "Jadavpur Ward 6"],
      "Rural": []
    },
    "Howrah": {
      "Urban": ["Shibpur Ward 1", "Santragachi Ward 2", "Salkia Ward 3", "Bally Ward 4"],
      "Rural": ["Uluberia Village", "Bagnan Village", "Amta Village", "Jagatballavpur Village"]
    },
    "Darjeeling": {
      "Urban": ["Darjeeling Town Ward 1", "Kurseong Ward 2", "Siliguri Ward 3"],
      "Rural": ["Mirik Village", "Phansidewa Village", "Naxalbari Village", "Matigara Village"]
    },
    "North 24 Parganas": {
      "Urban": ["Barasat Ward 1", "Barrackpore Ward 2", "Bidhannagar Ward 3", "Dum Dum Ward 4"],
      "Rural": ["Basirhat Village", "Bangaon Village", "Hingalganj Village", "Sandeshkhali Village"]
    }
  }
};

let code = fs.readFileSync('src/constants.ts', 'utf8');

const stringifiedStates = JSON.stringify(statesData, null, 2);

const replacement = "export const INDIAN_STATES: Record<string, Record<string, Record<string, string[]>>> = " + stringifiedStates + ";";

code = code.replace(/export const INDIAN_STATES: Record<string, Record<string, Record<string, string\[\]>>> = \{[\s\S]*?\};/, replacement);

fs.writeFileSync('src/constants.ts', code);
console.log("All Indian states updated successfully!");
