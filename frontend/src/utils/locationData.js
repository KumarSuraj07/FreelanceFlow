// Country → States → Cities data (curated common countries)
export const LOCATION_DATA = {
  "United States": {
    "California": ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose"],
    "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
    "Texas": ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
    "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
    "Illinois": ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"],
    "Washington": ["Seattle", "Spokane", "Tacoma", "Bellevue", "Olympia"],
    "Georgia": ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens"],
    "Colorado": ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Boulder"],
    "Arizona": ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"],
    "Massachusetts": ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
  },
  "United Kingdom": {
    "England": ["London", "Manchester", "Birmingham", "Leeds", "Liverpool"],
    "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
    "Wales": ["Cardiff", "Swansea", "Newport", "Bangor", "St Davids"],
    "Northern Ireland": ["Belfast", "Derry", "Lisburn", "Newry", "Armagh"],
  },
  "India": {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
    "Delhi": ["New Delhi", "Dwarka", "Rohini", "Saket", "Lajpat Nagar"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad"],
    "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  },
  "Canada": {
    "Ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton"],
    "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond"],
    "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil"],
    "Alberta": ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "St. Albert"],
    "Manitoba": ["Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie"],
  },
  "Australia": {
    "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Central Coast", "Maitland"],
    "Victoria": ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton"],
    "Queensland": ["Brisbane", "Gold Coast", "Sunshine Coast", "Townsville", "Cairns"],
    "Western Australia": ["Perth", "Fremantle", "Bunbury", "Geraldton", "Kalgoorlie"],
    "South Australia": ["Adelaide", "Mount Gambier", "Whyalla", "Murray Bridge", "Port Augusta"],
  },
  "Germany": {
    "Bavaria": ["Munich", "Nuremberg", "Augsburg", "Regensburg", "Ingolstadt"],
    "Berlin": ["Berlin"],
    "Hamburg": ["Hamburg"],
    "North Rhine-Westphalia": ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Duisburg"],
    "Baden-Württemberg": ["Stuttgart", "Karlsruhe", "Freiburg", "Heidelberg", "Mannheim"],
  },
  "France": {
    "Île-de-France": ["Paris", "Versailles", "Boulogne-Billancourt", "Saint-Denis", "Argenteuil"],
    "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice", "Toulon", "Aix-en-Provence", "Avignon"],
    "Auvergne-Rhône-Alpes": ["Lyon", "Grenoble", "Saint-Étienne", "Clermont-Ferrand", "Annecy"],
    "Nouvelle-Aquitaine": ["Bordeaux", "Limoges", "Poitiers", "Pau", "Bayonne"],
  },
  "Brazil": {
    "São Paulo": ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "Sorocaba"],
    "Rio de Janeiro": ["Rio de Janeiro", "Niterói", "Nova Iguaçu", "Duque de Caxias", "São Gonçalo"],
    "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
    "Bahia": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna"],
  },
  "Pakistan": {
    "Punjab": ["Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", "Multan"],
    "Sindh": ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah"],
    "Khyber Pakhtunkhwa": ["Peshawar", "Mardan", "Mingora", "Kohat", "Abbottabad"],
    "Balochistan": ["Quetta", "Turbat", "Khuzdar", "Hub", "Chaman"],
    "Islamabad Capital Territory": ["Islamabad"],
  },
  "Nigeria": {
    "Lagos": ["Lagos", "Ikeja", "Badagry", "Epe", "Ikorodu"],
    "Abuja FCT": ["Abuja", "Gwagwalada", "Kuje", "Bwari", "Kwali"],
    "Kano": ["Kano", "Wudil", "Gaya", "Bichi", "Rano"],
    "Rivers": ["Port Harcourt", "Obio-Akpor", "Okrika", "Eleme", "Bonny"],
  },
  "South Africa": {
    "Gauteng": ["Johannesburg", "Pretoria", "Soweto", "Ekurhuleni", "Centurion"],
    "Western Cape": ["Cape Town", "Stellenbosch", "George", "Paarl", "Worcester"],
    "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Newcastle", "Richards Bay", "Ladysmith"],
  },
  "Singapore": { "Singapore": ["Singapore", "Jurong", "Tampines", "Woodlands", "Ang Mo Kio"] },
  "UAE": {
    "Dubai": ["Dubai", "Deira", "Bur Dubai", "Jumeirah", "Al Quoz"],
    "Abu Dhabi": ["Abu Dhabi", "Al Ain", "Khalifa City", "Mussafah", "Ruwais"],
    "Sharjah": ["Sharjah", "Khor Fakkan", "Kalba", "Dhaid"],
  },
  "Netherlands": {
    "North Holland": ["Amsterdam", "Haarlem", "Alkmaar", "Zaandam", "Hilversum"],
    "South Holland": ["Rotterdam", "The Hague", "Leiden", "Dordrecht", "Delft"],
    "Utrecht": ["Utrecht", "Amersfoort", "Nieuwegein", "Zeist", "Houten"],
  },
  "Spain": {
    "Community of Madrid": ["Madrid", "Alcalá de Henares", "Leganés", "Getafe", "Alcorcón"],
    "Catalonia": ["Barcelona", "Hospitalet de Llobregat", "Badalona", "Terrassa", "Sabadell"],
    "Andalusia": ["Seville", "Málaga", "Córdoba", "Granada", "Almería"],
  },
  "Italy": {
    "Lombardy": ["Milan", "Brescia", "Bergamo", "Monza", "Como"],
    "Lazio": ["Rome", "Latina", "Frosinone", "Viterbo", "Rieti"],
    "Campania": ["Naples", "Salerno", "Caserta", "Pozzuoli", "Torre del Greco"],
  },
  "Japan": {
    "Tokyo": ["Tokyo", "Shinjuku", "Shibuya", "Harajuku", "Akihabara"],
    "Osaka": ["Osaka", "Sakai", "Higashiosaka", "Hirakata", "Toyonaka"],
    "Kanagawa": ["Yokohama", "Kawasaki", "Sagamihara", "Fujisawa", "Yokosuka"],
  },
  "China": {
    "Beijing": ["Beijing"],
    "Shanghai": ["Shanghai"],
    "Guangdong": ["Guangzhou", "Shenzhen", "Dongguan", "Foshan", "Zhuhai"],
    "Zhejiang": ["Hangzhou", "Ningbo", "Wenzhou", "Shaoxing", "Jiaxing"],
  },
  "Other": { "Other": ["Other"] },
}

export const COUNTRIES = Object.keys(LOCATION_DATA)

export function getStates(country) {
  return country ? Object.keys(LOCATION_DATA[country] || {}) : []
}

export function getCities(country, state) {
  return (country && state) ? (LOCATION_DATA[country]?.[state] || []) : []
}
