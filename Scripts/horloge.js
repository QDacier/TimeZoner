document.addEventListener('DOMContentLoaded', (event) => {
    // DOM Elements
    const hourHand = document.getElementById('aigHr');
    const minuteHand = document.getElementById('aigMin');
    const secondHand = document.getElementById('aigSec'); // This is the second hand for the analog clock
    const cityDisplay = document.getElementById('ville');
    const timeDisplay = document.getElementById('heure');
    const secondsCB = document.getElementById('secondable'); // This is your checkbox
    const secondsLabel = document.querySelector('label[for="secondable"]');
    const horlogeContainer = document.getElementById('horloge');
    const horlogeBG = document.getElementById('horlogeBG');
    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');
    const searchInput = document.getElementById('search-input');
    const body = document.body;
    const autocompleteSuggestionsDiv = document.getElementById('autocomplete-suggestions');


    // ------------------- Global Variables for Time and Location -------------------
    let currentCity = "Search for a City";
    let currentIANAtimezone = null;
    let isCitySearched = false;
    let selectedIndex = -1; // To keep track of the currently selected suggestion

    // Map des villes avec leurs fuseaux horaires
    const cityToTimezoneMap = {
        "london": { "timezone": "Europe/London", "displayName": "London, UK" },
        "paris": { "timezone": "Europe/Paris", "displayName": "Paris, France" },
        "new york": { "timezone": "America/New_York", "displayName": "New York, USA" },
        "los angeles": { "timezone": "America/Los_Angeles", "displayName": "Los Angeles, USA" },
        "tokyo": { "timezone": "Asia/Tokyo", "displayName": "Tokyo, Japan" },
        "sydney": { "timezone": "Australia/Sydney", "displayName": "Sydney, Australia" },
        "dubai": { "timezone": "Asia/Dubai", "displayName": "Dubai, UAE" },
        "berlin": { "timezone": "Europe/Berlin", "displayName": "Berlin, Germany" },
        "rome": { "timezone": "Europe/Rome", "displayName": "Rome, Italy" },
        "madrid": { "timezone": "Europe/Madrid", "displayName": "Madrid, Spain" },
        "moscow": { "timezone": "Europe/Moscow", "displayName": "Moscow, Russia" },
        "beijing": { "timezone": "Asia/Shanghai", "displayName": "Beijing, China" },
        "shanghai": { "timezone": "Asia/Shanghai", "displayName": "Shanghai, China" },
        "delhi": { "timezone": "Asia/Kolkata", "displayName": "Delhi, India" },
        "mumbai": { "timezone": "Asia/Kolkata", "displayName": "Mumbai, India" },
        "singapore": { "timezone": "Asia/Singapore", "displayName": "Singapore, Singapore" },
        "hong kong": { "timezone": "Asia/Hong_Kong", "displayName": "Hong Kong, China" },
        "cape town": { "timezone": "Africa/Johannesburg", "displayName": "Cape Town, South Africa" },
        "johannesburg": { "timezone": "Africa/Johannesburg", "displayName": "Johannesburg, South Africa" },
        "rio de janeiro": { "timezone": "America/Sao_Paulo", "displayName": "Rio de Janeiro, Brazil" },
        "buenos aires": { "timezone": "America/Argentina/Buenos_Aires", "displayName": "Buenos Aires, Argentina" },
        "mexico": { "timezone": "America/Mexico_City", "displayName": "Mexico City, Mexico" },
        "toronto": { "timezone": "America/Toronto", "displayName": "Toronto, ON, Canada" },
        "montréal": { "timezone": "America/Montreal", "displayName": "Montréal, QC, Canada" },
        "québec": { "timezone": "America/Montreal", "displayName": "Québec, QC, Canada" },
        "ottawa": { "timezone": "America/Toronto", "displayName": "Ottawa, ON, Canada" },
        "vancouver": { "timezone": "America/Vancouver", "displayName": "Vancouver, BC, Canada" },
        "sao paulo": { "timezone": "America/Sao_Paulo", "displayName": "Sao Paulo, Brazil" },
        "cairo": { "timezone": "Africa/Cairo", "displayName": "Cairo, Egypt" },
        "istanbul": { "timezone": "Europe/Istanbul", "displayName": "Istanbul, Turkey" },
        "bangkok": { "timezone": "Asia/Bangkok", "displayName": "Bangkok, Thailand" },
        "jakarta": { "timezone": "Asia/Jakarta", "displayName": "Jakarta, Indonesia" },
        "manila": { "timezone": "Asia/Manila", "displayName": "Manila, Philippines" },
        "auckland": { "timezone": "Pacific/Auckland", "displayName": "Auckland, New Zealand" },
        "washington": { "timezone": "America/New_York", "displayName": "Washington D.C., USA" },
        "bruxelles": { "timezone": "Europe/Brussels", "displayName": "Bruxelles, Belgium" },
        "rabat": { "timezone": "Africa/Casablanca", "displayName": "Rabat, Morocco" },
        "amsterdam": { "timezone": "Europe/Amsterdam", "displayName": "Amsterdam, Netherlands" },
        "dublin": { "timezone": "Europe/Dublin", "displayName": "Dublin, Ireland" },
        "lisbon": { "timezone": "Europe/Lisbon", "displayName": "Lisbon, Portugal" },
        "vienna": { "timezone": "Europe/Vienna", "displayName": "Vienna, Austria" },
        "prague": { "timezone": "Europe/Prague", "displayName": "Prague, Czech Republic" },
        "warsaw": { "timezone": "Europe/Warsaw", "displayName": "Warsaw, Poland" },
        "athens": { "timezone": "Europe/Athens", "displayName": "Athens, Greece" },
        "helsinki": { "timezone": "Europe/Helsinki", "displayName": "Helsinki, Finland" },
        "stockholm": { "timezone": "Europe/Stockholm", "displayName": "Stockholm, Sweden" },
        "oslo": { "timezone": "Europe/Oslo", "displayName": "Oslo, Norway" },
        "copenhagen": { "timezone": "Europe/Copenhagen", "displayName": "Copenhagen, Denmark" },
        "edinburgh": { "timezone": "Europe/London", "displayName": "Edinburgh, UK" },
        "chicago": { "timezone": "America/Chicago", "displayName": "Chicago, USA" },
        "denver": { "timezone": "America/Denver", "displayName": "Denver, USA" },
        "phoenix": { "timezone": "America/Phoenix", "displayName": "Phoenix, USA" },
        "anchorage": { "timezone": "America/Anchorage", "displayName": "Anchorage, USA" },
        "honolulu": { "timezone": "Pacific/Honolulu", "displayName": "Honolulu, USA" },
        "bogota": { "timezone": "America/Bogota", "displayName": "Bogota, Colombia" },
        "lima": { "timezone": "America/Lima", "displayName": "Lima, Peru" },
        "santiago": { "timezone": "America/Santiago", "displayName": "Santiago, Chile" },
        "caracas": { "timezone": "America/Caracas", "displayName": "Caracas, Venezuela" },
        "lagos": { "timezone": "Africa/Lagos", "displayName": "Lagos, Nigeria" },
        "nairobi": { "timezone": "Africa/Nairobi", "displayName": "Nairobi, Kenya" },
        "riyadh": { "timezone": "Asia/Riyadh", "displayName": "Riyadh, Saudi Arabia" },
        "jerusalem": { "timezone": "Asia/Jerusalem", "displayName": "Jerusalem, Israel" },
        "seoul": { "timezone": "Asia/Seoul", "displayName": "Seoul, South Korea" },
        "kuala lumpur": { "timezone": "Asia/Kuala_Lumpur", "displayName": "Kuala Lumpur, Malaysia" },
        "ho chi minh city": { "timezone": "Asia/Ho_Chi_Minh", "displayName": "Ho Chi Minh City, Vietnam" },
        "perth": { "timezone": "Australia/Perth", "displayName": "Perth, Australia" },
        "brisbane": { "timezone": "Australia/Brisbane", "displayName": "Brisbane, Australia" },
        "adelaide": { "timezone": "Australia/Adelaide", "displayName": "Adelaide, Australia" },
        "wellington": { "timezone": "Pacific/Auckland", "displayName": "Wellington, New Zealand" },
        "canberra": { "timezone": "Australia/Sydney", "displayName": "Canberra, Australia" },
        "brasilia": { "timezone": "America/Sao_Paulo", "displayName": "Brasilia, Brazil" },
        "new delhi": { "timezone": "Asia/Kolkata", "displayName": "New Delhi, India" },
        "abuja": { "timezone": "Africa/Lagos", "displayName": "Abuja, Nigeria" },
        "algiers": { "timezone": "Africa/Algiers", "displayName": "Algiers, Algeria" },
        "tripoli": { "timezone": "Africa/Tripoli", "displayName": "Tripoli, Libya" },
        "tunis": { "timezone": "Africa/Tunis", "displayName": "Tunis, Tunisia" },
        "khartoum": { "timezone": "Africa/Khartoum", "displayName": "Khartoum, Sudan" },
        "addis ababa": { "timezone": "Africa/Addis_Ababa", "displayName": "Addis Ababa, Ethiopia" },
        "mogadishu": { "timezone": "Africa/Mogadishu", "displayName": "Mogadishu, Somalia" },
        "djibouti": { "timezone": "Africa/Djibouti", "displayName": "Djibouti, Djibouti" },
        "asmara": { "timezone": "Africa/Asmara", "displayName": "Asmara, Eritrea" },
        "doha": { "timezone": "Asia/Qatar", "displayName": "Doha, Qatar" },
        "manama": { "timezone": "Asia/Bahrain", "displayName": "Manama, Bahrain" },
        "kuwait city": { "timezone": "Asia/Kuwait", "displayName": "Kuwait City, Kuwait" },
        "abu dhabi": { "timezone": "Asia/Dubai", "displayName": "Abu Dhabi, UAE" },
        "muscat": { "timezone": "Asia/Muscat", "displayName": "Muscat, Oman" },
        "sana'a": { "timezone": "Asia/Aden", "displayName": "Sana'a, Yemen" },
        "baku": { "timezone": "Asia/Baku", "displayName": "Baku, Azerbaijan" },
        "tbilisi": { "timezone": "Asia/Tbilisi", "displayName": "Tbilisi, Georgia" },
        "yerevan": { "timezone": "Asia/Yerevan", "displayName": "Yerevan, Armenia" },
        "astana": { "timezone": "Asia/Almaty", "displayName": "Astana, Kazakhstan" },
        "tashkent": { "timezone": "Asia/Tashkent", "displayName": "Tashkent, Uzbekistan" },
        "bishkek": { "timezone": "Asia/Bishkek", "displayName": "Bishkek, Kyrgyzstan" },
        "dushanbe": { "timezone": "Asia/Dushanbe", "displayName": "Dushanbe, Tajikistan" },
        "ashgabat": { "timezone": "Asia/Ashgabat", "displayName": "Ashgabat, Turkmenistan" },
        "kathmandu": { "timezone": "Asia/Kathmandu", "displayName": "Kathmandu, Nepal" },
        "thimphu": { "timezone": "Asia/Thimphu", "displayName": "Thimphu, Bhutan" },
        "dhaka": { "timezone": "Asia/Dhaka", "displayName": "Dhaka, Bangladesh" },
        "colombo": { "timezone": "Asia/Colombo", "displayName": "Colombo, Sri Lanka" },
        "male": { "timezone": "Indian/Maldives", "displayName": "Malé, Maldives" },
        "ulaanbaatar": { "timezone": "Asia/Ulaanbaatar", "displayName": "Ulaanbaatar, Mongolia" },
        "pyongyang": { "timezone": "Asia/Pyongyang", "displayName": "Pyongyang, North Korea" },
        "vientiane": { "timezone": "Asia/Vientiane", "displayName": "Vientiane, Laos" },
        "phnom penh": { "timezone": "Asia/Phnom_Penh", "displayName": "Phnom Penh, Cambodia" },
        "naypyidaw": { "timezone": "Asia/Yangon", "displayName": "Naypyidaw, Myanmar" },
        "bandar seri begawan": { "timezone": "Asia/Brunei", "displayName": "Bandar Seri Begawan, Brunei" },
        "dili": { "timezone": "Asia/Dili", "displayName": "Dili, Timor-Leste" },
        "port moresby": { "timezone": "Pacific/Port_Moresby", "displayName": "Port Moresby, Papua New Guinea" },
        "honiara": { "timezone": "Pacific/Guadalcanal", "displayName": "Honiara, Solomon Islands" },
        "suva": { "timezone": "Pacific/Fiji", "displayName": "Suva, Fiji" },
        "nukuʻalofa": { "timezone": "Pacific/Tongatapu", "displayName": "Nukuʻalofa, Tonga" },
        "apia": { "timezone": "Pacific/Apia", "displayName": "Apia, Samoa" },
        "palikir": { "timezone": "Pacific/Pohnpei", "displayName": "Palikir, Micronesia" },
        "majuro": { "timezone": "Pacific/Majuro", "displayName": "Majuro, Marshall Islands" },
        "tarawa": { "timezone": "Pacific/Tarawa", "displayName": "Tarawa, Kiribati" },
        "yaren": { "timezone": "Pacific/Nauru", "displayName": "Yaren, Nauru" },
        "funafuti": { "timezone": "Pacific/Funafuti", "displayName": "Funafuti, Tuvalu" },
        "alofi": { "timezone": "Pacific/Niue", "displayName": "Alofi, Niue" },
        "hagåtña": { "timezone": "Pacific/Guam", "displayName": "Hagåtña, Guam" },
        "saipan": { "timezone": "Pacific/Saipan", "displayName": "Saipan, Northern Mariana Islands" },
        "pago pago": { "timezone": "Pacific/Pago_Pago", "displayName": "Pago Pago, American Samoa" },
        "nouméa": { "timezone": "Pacific/Noumea", "displayName": "Nouméa, New Caledonia" },
        "papeete": { "timezone": "Pacific/Tahiti", "displayName": "Papeete, French Polynesia" },
        "adamstown": { "timezone": "Pacific/Pitcairn", "displayName": "Adamstown, Pitcairn Islands" },
        "fakaofo": { "timezone": "Pacific/Fakaofo", "displayName": "Fakaofo, Tokelau" },
        "jamestown": { "timezone": "Atlantic/St_Helena", "displayName": "Jamestown, Saint Helena" },
        "stanley": { "timezone": "Atlantic/Stanley", "displayName": "Stanley, Falkland Islands" },
        "george town": { "timezone": "America/Cayman", "displayName": "George Town, Cayman Islands" },
        "road town": { "timezone": "America/Tortola", "displayName": "Road Town, British Virgin Islands" },
        "basseterre": { "timezone": "America/St_Kitts", "displayName": "Basseterre, Saint Kitts and Nevis" },
        "castries": { "timezone": "America/St_Lucia", "displayName": "Castries, Saint Lucia" },
        "kingstown": { "timezone": "America/St_Vincent", "displayName": "Kingstown, Saint Vincent and the Grenadines" },
        "st. john's": { "timezone": "America/Antigua", "displayName": "St. John's, Antigua and Barbuda" },
        "roseau": { "timezone": "America/Dominica", "displayName": "Roseau, Dominica" },
        "bridgetown": { "timezone": "America/Barbados", "displayName": "Bridgetown, Barbados" },
        "port of spain": { "timezone": "America/Port_of_Spain", "displayName": "Port of Spain, Trinidad and Tobago" },
        "paramaribo": { "timezone": "America/Paramaribo", "displayName": "Paramaribo, Suriname" },
        "georgetown": { "timezone": "America/Guyana", "displayName": "Georgetown, Guyana" },
        "cayenne": { "timezone": "America/Cayenne", "displayName": "Cayenne, French Guiana" },
        "panama city": { "timezone": "America/Panama", "displayName": "Panama City, Panama" },
        "san jose": { "timezone": "America/Costa_Rica", "displayName": "San Jose, Costa Rica" },
        "managua": { "timezone": "America/Managua", "displayName": "Managua, Nicaragua" },
        "tegucigalpa": { "timezone": "America/Tegucigalpa", "displayName": "Tegucigalpa, Honduras" },
        "san salvador": { "timezone": "America/El_Salvador", "displayName": "San Salvador, El Salvador" },
        "guatemala city": { "timezone": "America/Guatemala", "displayName": "Guatemala City, Guatemala" },
        "belmopan": { "timezone": "America/Belize", "displayName": "Belmopan, Belize" },
        "nassau": { "timezone": "America/Nassau", "displayName": "Nassau, Bahamas" },
        "havana": { "timezone": "America/Havana", "displayName": "Havana, Cuba" },
        "port-au-prince": { "timezone": "America/Port-au-Prince", "displayName": "Port-au-Prince, Haiti" },
        "santo domingo": { "timezone": "America/Santo_Domingo", "displayName": "Santo Domingo, Dominican Republic" },
        "kingston": { "timezone": "America/Jamaica", "displayName": "Kingston, Jamaica" },
        "reykjavik": { "timezone": "Atlantic/Reykjavik", "displayName": "Reykjavik, Iceland" },
        "bern": { "timezone": "Europe/Zurich", "displayName": "Bern, Switzerland" },
        "budapest": { "timezone": "Europe/Budapest", "displayName": "Budapest, Hungary" },
        "bucharest": { "timezone": "Europe/Bucharest", "displayName": "Bucharest, Romania" },
        "sofia": { "timezone": "Europe/Sofia", "displayName": "Sofia, Bulgaria" },
        "belgrade": { "timezone": "Europe/Belgrade", "displayName": "Belgrade, Serbia" },
        "zagreb": { "timezone": "Europe/Zagreb", "displayName": "Zagreb, Croatia" },
        "ljubljana": { "timezone": "Europe/Ljubljana", "displayName": "Ljubljana, Slovenia" },
        "sarajevo": { "timezone": "Europe/Sarajevo", "displayName": "Sarajevo, Bosnia and Herzegovina" },
        "tirana": { "timezone": "Europe/Tirane", "displayName": "Tirana, Albania" },
        "skopje": { "timezone": "Europe/Skopje", "displayName": "Skopje, North Macedonia" },
        "podgorica": { "timezone": "Europe/Podgorica", "displayName": "Podgorica, Montenegro" },
        "chișinău": { "timezone": "Europe/Chisinau", "displayName": "Chișinău, Moldova" },
        "kyiv": { "timezone": "Europe/Kyiv", "displayName": "Kyiv, Ukraine" },
        "minsk": { "timezone": "Europe/Minsk", "displayName": "Minsk, Belarus" },
        "riga": { "timezone": "Europe/Riga", "displayName": "Riga, Latvia" },
        "vilnius": { "timezone": "Europe/Vilnius", "displayName": "Vilnius, Lithuania" },
        "tallinn": { "timezone": "Europe/Tallinn", "displayName": "Tallinn, Estonia" },
        "valletta": { "timezone": "Europe/Malta", "displayName": "Valletta, Malta" },
        "nicosia": { "timezone": "Asia/Nicosia", "displayName": "Nicosia, Cyprus" },
        "beirut": { "timezone": "Asia/Beirut", "displayName": "Beirut, Lebanon" },
        "damascus": { "timezone": "Asia/Damascus", "displayName": "Damascus, Syria" },
        "baghdad": { "timezone": "Asia/Baghdad", "displayName": "Baghdad, Iraq" },
        "tehran": { "timezone": "Asia/Tehran", "displayName": "Tehran, Iran" },
        "kabul": { "timezone": "Asia/Kabul", "displayName": "Kabul, Afghanistan" },
        "islamabad": { "timezone": "Asia/Karachi", "displayName": "Islamabad, Pakistan" },
        "ulan bator": { "timezone": "Asia/Ulaanbaatar", "displayName": "Ulaanbaatar, Mongolia" },
        "st. john's": { "timezone": "America/St_Johns", "displayName": "St. John's, NL, Canada" },
        "charlottetown": { "timezone": "America/Halifax", "displayName": "Charlottetown, PE, Canada" },
        "halifax": { "timezone": "America/Halifax", "displayName": "Halifax, NS, Canada" },
        "fredericton": { "timezone": "America/Moncton", "displayName": "Fredericton, NB, Canada" },
        "winnipeg": { "timezone": "America/Winnipeg", "displayName": "Winnipeg, MB, Canada" },
        "regina": { "timezone": "America/Regina", "displayName": "Regina, SK, Canada" },
        "edmonton": { "timezone": "America/Edmonton", "displayName": "Edmonton, AB, Canada" },
        "calgary": { "timezone": "America/Edmonton", "displayName": "Calgary, AB, Canada" },
        "victoria": { "timezone": "America/Vancouver", "displayName": "Victoria, BC, Canada" },
        "yellowknife": { "timezone": "America/Yellowknife", "displayName": "Yellowknife, NT, Canada" },
        "whitehorse": { "timezone": "America/Whitehorse", "displayName": "Whitehorse, YT, Canada" },
        "iqaluit": { "timezone": "America/Iqaluit", "displayName": "Iqaluit, NU, Canada" },
        "seattle": { "timezone": "America/Los_Angeles", "displayName": "Seattle, WA, USA" },
        "san francisco": { "timezone": "America/Los_Angeles", "displayName": "San Francisco, CA, USA" },
        "houston": { "timezone": "America/Chicago", "displayName": "Houston, TX, USA" },
        "miami": { "timezone": "America/New_York", "displayName": "Miami, FL, USA" },
        "philadelphia": { "timezone": "America/New_York", "displayName": "Philadelphia, PA, USA" },
        "detroit": { "timezone": "America/Detroit", "displayName": "Detroit, MI, USA" },
        "boston": { "timezone": "America/New_York", "displayName": "Boston, MA, USA" },
        "atlanta": { "timezone": "America/New_York", "displayName": "Atlanta, GA, USA" },
        "dallas": { "timezone": "America/Chicago", "displayName": "Dallas, TX, USA" },
        "salt lake city": { "timezone": "America/Denver", "displayName": "Salt Lake City, UT, USA" },
        "las vegas": { "timezone": "America/Los_Angeles", "displayName": "Las Vegas, NV, USA" },
        "portland": { "timezone": "America/Los_Angeles", "displayName": "Portland, OR, USA" },
        "albuquerque": { "timezone": "America/Denver", "displayName": "Albuquerque, NM, USA" },
        "omaha": { "timezone": "America/Chicago", "displayName": "Omaha, NE, USA" },
        "nashville": { "timezone": "America/Chicago", "displayName": "Nashville, TN, USA" },
        "new orleans": { "timezone": "America/Chicago", "displayName": "New Orleans, LA, USA" },
        "minneapolis": { "timezone": "America/Chicago", "displayName": "Minneapolis, MN, USA" },
        "indianapolis": { "timezone": "America/Indianapolis", "displayName": "Indianapolis, IN, USA" },
        "cleveland": { "timezone": "America/New_York", "displayName": "Cleveland, OH, USA" },
        "baltimore": { "timezone": "America/New_York", "displayName": "Baltimore, MD, USA" },
        "charlotte": { "timezone": "America/New_York", "displayName": "Charlotte, NC, USA" },
        "columbus": { "timezone": "America/New_York", "displayName": "Columbus, OH, USA" },
        "milwaukee": { "timezone": "America/Chicago", "displayName": "Milwaukee, WI, USA" },
        "san antonio": { "timezone": "America/Chicago", "displayName": "San Antonio, TX, USA" },
        "fairbanks": { "timezone": "America/Anchorage", "displayName": "Fairbanks, AK, USA" },
        "honolulu": { "timezone": "Pacific/Honolulu", "displayName": "Honolulu, HI, USA" },
        "punta cana": { "timezone": "America/Santo_Domingo", "displayName": "Punta Cana, Dominican Republic" },
        "puerto plata": { "timezone": "America/Santo_Domingo", "displayName": "Puerto Plata, Dominican Republic" },
        "andorra la vella": { "timezone": "Europe/Andorra", "displayName": "Andorra la Vella, Andorra" },
        "luanda": { "timezone": "Africa/Luanda", "displayName": "Luanda, Angola" },
        "porto-novo": { "timezone": "Africa/Porto-Novo", "displayName": "Porto-Novo, Benin" },
        "la paz": { "timezone": "America/La_Paz", "displayName": "La Paz, Bolivia" },
        "sucre": { "timezone": "America/La_Paz", "displayName": "Sucre, Bolivia" },
        "gaborone": { "timezone": "Africa/Gaborone", "displayName": "Gaborone, Botswana" },
        "ouagadougou": { "timezone": "Africa/Ouagadougou", "displayName": "Ouagadougou, Burkina Faso" },
        "gitega": { "timezone": "Africa/Bujumbura", "displayName": "Gitega, Burundi" },
        "yaounde": { "timezone": "Africa/Douala", "displayName": "Yaounde, Cameroon" },
        "praia": { "timezone": "Atlantic/Cape_Verde", "displayName": "Praia, Cape Verde" },
        "bangui": { "timezone": "Africa/Bangui", "displayName": "Bangui, Central African Republic" },
        "n'djamena": { "timezone": "Africa/Ndjamena", "displayName": "N'Djamena, Chad" },
        "moroni": { "timezone": "Indian/Comoro", "displayName": "Moroni, Comoros" },
        "kinshasa": { "timezone": "Africa/Kinshasa", "displayName": "Kinshasa, DR Congo" },
        "brazzaville": { "timezone": "Africa/Brazzaville", "displayName": "Brazzaville, Rep. of the Congo" },
        "yamoussoukro": { "timezone": "Africa/Abidjan", "displayName": "Yamoussoukro, Côte d'Ivoire" },
        "quito": { "timezone": "America/Guayaquil", "displayName": "Quito, Ecuador" },
        "malabo": { "timezone": "Africa/Malabo", "displayName": "Malabo, Equatorial Guinea" },
        "mbabane": { "timezone": "Africa/Mbabane", "displayName": "Mbabane, Eswatini" },
        "lobamba": { "timezone": "Africa/Mbabane", "displayName": "Lobamba, Eswatini" },
        "libreville": { "timezone": "Africa/Libreville", "displayName": "Libreville, Gabon" },
        "banjul": { "timezone": "Africa/Banjul", "displayName": "Banjul, Gambia" },
        "accra": { "timezone": "Africa/Accra", "displayName": "Accra, Ghana" },
        "saint george's": { "timezone": "America/Grenada", "displayName": "Saint George's, Grenada" },
        "conakry": { "timezone": "Africa/Conakry", "displayName": "Conakry, Guinea" },
        "bissau": { "timezone": "Africa/Bissau", "displayName": "Bissau, Guinea-Bissau" },
        "amman": { "timezone": "Asia/Amman", "displayName": "Amman, Jordan" },
        "prishtina": { "timezone": "Europe/Belgrade", "displayName": "Prishtina, Kosovo" },
        "maseru": { "timezone": "Africa/Maseru", "displayName": "Maseru, Lesotho" },
        "monrovia": { "timezone": "Africa/Monrovia", "displayName": "Monrovia, Liberia" },
        "vaduz": { "timezone": "Europe/Vaduz", "displayName": "Vaduz, Liechtenstein" },
        "luxembourg city": { "timezone": "Europe/Luxembourg", "displayName": "Luxembourg City, Luxembourg" },
        "antananarivo": { "timezone": "Indian/Antananarivo", "displayName": "Antananarivo, Madagascar" },
        "lilongwe": { "timezone": "Africa/Blantyre", "displayName": "Lilongwe, Malawi" },
        "bamako": { "timezone": "Africa/Bamako", "displayName": "Bamako, Mali" },
        "nouakchott": { "timezone": "Africa/Nouakchott", "displayName": "Nouakchott, Mauritania" },
        "port louis": { "timezone": "Indian/Mauritius", "displayName": "Port Louis, Mauritius" },
        "maputo": { "timezone": "Africa/Maputo", "displayName": "Maputo, Mozambique" },
        "windhoek": { "timezone": "Africa/Windhoek", "displayName": "Windhoek, Namibia" },
        "niamey": { "timezone": "Africa/Niamey", "displayName": "Niamey, Niger" },
        "melekeok": { "timezone": "Pacific/Palau", "displayName": "Melekeok, Palau" },
        "asuncion": { "timezone": "America/Asuncion", "displayName": "Asuncion, Paraguay" },
        "kigali": { "timezone": "Africa/Kigali", "displayName": "Kigali, Rwanda" },
        "sao tome": { "timezone": "Africa/Sao_Tome", "displayName": "Sao Tome, Sao Tome and Principe" },
        "dakar": { "timezone": "Africa/Dakar", "displayName": "Dakar, Senegal" },
        "victoria (seychelles)": { "timezone": "Indian/Mahe", "displayName": "Victoria, Seychelles" },
        "freetown": { "timezone": "Africa/Freetown", "displayName": "Freetown, Sierra Leone" },
        "bratislava": { "timezone": "Europe/Bratislava", "displayName": "Bratislava, Slovakia" },
        "juba": { "timezone": "Africa/Juba", "displayName": "Juba, South Sudan" },
        "dodoma": { "timezone": "Africa/Dar_es_Salaam", "displayName": "Dodoma, Tanzania" },
        "lome": { "timezone": "Africa/Lome", "displayName": "Lome, Togo" },
        "ankara": { "timezone": "Europe/Istanbul", "displayName": "Ankara, Turkey" },
        "kampala": { "timezone": "Africa/Kampala", "displayName": "Kampala, Uganda" },
        "montevideo": { "timezone": "America/Montevideo", "displayName": "Montevideo, Uruguay" },
        "port vila": { "timezone": "Pacific/Port_Vila", "displayName": "Port Vila, Vanuatu" },
        "vatican city": { "timezone": "Europe/Vatican", "displayName": "Vatican City, Vatican City" },
        "hanoi": { "timezone": "Asia/Ho_Chi_Minh", "displayName": "Hanoi, Vietnam" },
        "lusaka": { "timezone": "Africa/Lusaka", "displayName": "Lusaka, Zambia" },
        "harare": { "timezone": "Africa/Harare", "displayName": "Harare, Zimbabwe" },
        "king edward point": { "timezone": "Atlantic/South_Georgia", "displayName": "King Edward Point, South Georgia and the South Sandwich Islands" },
        "nuuk": { "timezone": "America/Godthab", "displayName": "Nuuk, Greenland" },
        "longyearbyen": { "timezone": "Arctic/Longyearbyen", "displayName": "Longyearbyen, Svalbard and Jan Mayen" },
        "flying fish cove": { "timezone": "Indian/Christmas", "displayName": "Flying Fish Cove, Christmas Island" },
        "west island": { "timezone": "Indian/Cocos", "displayName": "West Island, Cocos (Keeling) Islands" },
        "the valley": { "timezone": "America/Anguilla", "displayName": "The Valley, Anguilla" },
        "saint helier": { "timezone": "Europe/Jersey", "displayName": "Saint Helier, Jersey" },
        "douglas": { "timezone": "Europe/Isle_of_Man", "displayName": "Douglas, Isle of Man" },
        "saint peter port": { "timezone": "Europe/Guernsey", "displayName": "Saint Peter Port, Guernsey" },
        "brades": { "timezone": "America/Montserrat", "displayName": "Brades, Montserrat" },
        "cockburn town": { "timezone": "America/Grand_Turk", "displayName": "Cockburn Town, Turks and Caicos Islands" },
        "gibraltar": { "timezone": "Europe/Gibraltar", "displayName": "Gibraltar, Gibraltar" },
        "saint pierre": { "timezone": "America/Miquelon", "displayName": "Saint-Pierre, Saint Pierre and Miquelon" },
        "mamoudzou": { "timezone": "Indian/Mayotte", "displayName": "Mamoudzou, Mayotte" },
        "saint-denis": { "timezone": "Indian/Reunion", "displayName": "Saint-Denis, Reunion" },
        "gustavia": { "timezone": "America/St_Barthelemy", "displayName": "Gustavia, Saint Barthélemy" },
        "marigot": { "timezone": "America/St_Martin", "displayName": "Marigot, Saint Martin" },
        "torshavn": { "timezone": "Atlantic/Faroe", "displayName": "Tórshavn, Faroe Islands" },
        "mariehamn": { "timezone": "Europe/Mariehamn", "displayName": "Mariehamn, Åland Islands" },
        "george town (ascension)": { "timezone": "Atlantic/Ascension", "displayName": "George Town, Ascension Island" },
        "ramallah": { "timezone": "Asia/Jerusalem", "displayName": "Ramallah, Palestine" },
        "gaza": { "timezone": "Asia/Gaza", "displayName": "Gaza, Palestine" },
        "cluj-napoca": { "timezone": "Europe/Bucharest", "displayName": "Cluj-Napoca, Romania" },
        "brasov": { "timezone": "Europe/Bucharest", "displayName": "Brașov, Romania" },
        "sibiu": { "timezone": "Europe/Bucharest", "displayName": "Sibiu, Romania" },
        "Nice": { "timezone": "Europe/Paris", "displayName": "Nice, France" },
    };

    /**
     * Updates the analog clock hands, digital display, sun/moon orbit,
     * and background color based on the currently selected city's time.
     */
    function updateClock() {
        const now = new Date();

        let localHours, localMinutes, localSeconds;
        const orbitRadius = 180;

        // Determine if seconds should be shown based on checkbox state
        const showSeconds = secondsCB.checked;

        if (isCitySearched && currentIANAtimezone) {
            // --- Get Time Components for the Selected City's Timezone ---
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: currentIANAtimezone,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric', // Always get seconds to allow for showing/hiding
                hourCycle: 'h23' // Ensures 24-hour format for calculation
            });

            // Use formatToParts to reliably extract hour, minute, second
            const parts = formatter.formatToParts(now);
            const getPart = (type) => parseInt(parts.find(p => p.type === type).value);

            localHours = getPart('hour');
            localMinutes = getPart('minute');
            localSeconds = getPart('second');

            // ------------------- Calculate Hand Rotations -------------------
            const secondDegrees = localSeconds * 6;
            const minuteDegrees = (localMinutes * 6) + (localSeconds * 0.1);
            const hourDegrees = (localHours * 30) + (localMinutes * 0.5);

            hourHand.style.transform = `translate(-50%, -100%) rotate(${hourDegrees}deg)`;
            minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteDegrees}deg)`;

            // Conditionally show/hide the analog second hand
            secondHand.style.transform = `translate(-50%, -100%) rotate(${secondDegrees}deg)`;
            secondHand.style.display = showSeconds ? 'block' : 'none';

            // ------------------- Update Digital Time Display -------------------
            const formattedHours = String(localHours).padStart(2, '0');
            const formattedMinutes = String(localMinutes).padStart(2, '0');
            let digitalTimeText = `${formattedHours}:${formattedMinutes}`;

            // Conditionally add seconds to digital display
            if (showSeconds) {
                const formattedSeconds = String(localSeconds).padStart(2, '0');
                digitalTimeText += `:${formattedSeconds}`;
            }
            timeDisplay.textContent = digitalTimeText;

            // ------------------- Control Sun and Moon Orbit -------------------
            const totalMinutesOfDay = localHours * 60 + localMinutes;
            const totalSecondsOfDay = totalMinutesOfDay * 60 + localSeconds;
            const orbitProgressDegrees = (totalSecondsOfDay / (24 * 3600)) * 360;

            const sunOrbitAngle = (orbitProgressDegrees - 90 + 360) % 360;
            const moonOrbitAngle = (sunOrbitAngle + 180) % 360;

            const finalRotateSunAngle = (-sunOrbitAngle + 360) % 360;
            const finalRotateMoonAngle = (-moonOrbitAngle + 360) % 360;

            sun.style.transform = `translate(-50%, -50%) rotate(${finalRotateSunAngle}deg) translateX(${orbitRadius}px) rotate(${-finalRotateSunAngle}deg)`;
            moon.style.transform = `translate(-50%, -50%) rotate(${finalRotateMoonAngle}deg) translateX(${orbitRadius}px) rotate(${-finalRotateMoonAngle}deg)`;

            // --- Day/Night Background Color Change based on specific sky stages ---
            let r, g, b;

            const midnightDeepColor = { r: 15, g: 15, b: 30 };     // Very deep indigo (00:00, 24:00)
            const preDawnDarkColor = { r: 30, g: 20, b: 60 };     // Dark purple-blue (around 04:00)
            const dawnLightColor = { r: 100, g: 80, b: 120 };  // Muted purple-grey (around 05:00)
            const dawnOrangePinkColor = { r: 255, g: 120, b: 80 };  // Soft orange-pink (around 06:00)
            const sunrisePeakColor = { r: 255, g: 180, b: 70 };  // Vibrant orange/yellow (around 07:00)
            const morningBlueSkyColor = { r: 135, g: 206, b: 235 }; // Clear morning sky blue (around 08:00-10:00)
            const middayBrightColor = { r: 173, g: 216, b: 230 }; // Lightest mid-day blue (around 12:00-15:00)
            const goldenHourColor = { r: 255, g: 215, b: 100 }; // Warm yellow/orange (around 17:00)
            const sunsetPeakColor = { r: 255, g: 99, b: 71 };   // Intense red-orange (around 18:00)
            const twilightPurpleColor = { r: 80, g: 0, b: 120 };     // Dark violet (around 19:00)
            const earlyNightDarkColor = { r: 25, g: 25, b: 70 };     // Darkening blue-purple (around 21:00)


            // Calculate total minutes past midnight for interpolation (0 to 1439)
            const totalMinutes = localHours * 60 + localMinutes;

            // --- change couleur selon heure ---
            if (totalMinutes >= 0 && totalMinutes < 240) { // 00:00 (Midnight) to 04:00 (Pre-Dawn Dark)
                const progress = totalMinutes / 240;
                r = midnightDeepColor.r + (preDawnDarkColor.r - midnightDeepColor.r) * progress;
                g = midnightDeepColor.g + (preDawnDarkColor.g - midnightDeepColor.g) * progress;
                b = midnightDeepColor.b + (preDawnDarkColor.b - midnightDeepColor.b) * progress;
            } else if (totalMinutes >= 240 && totalMinutes < 300) { // 04:00 to 05:00 (Pre-Dawn Dark to Dawn Light)
                const progress = (totalMinutes - 240) / 60;
                r = preDawnDarkColor.r + (dawnLightColor.r - preDawnDarkColor.r) * progress;
                g = preDawnDarkColor.g + (dawnLightColor.g - preDawnDarkColor.g) * progress;
                b = preDawnDarkColor.b + (dawnLightColor.b - preDawnDarkColor.b) * progress;
            } else if (totalMinutes >= 300 && totalMinutes < 360) { // 05:00 to 06:00 (Dawn Light to Dawn Orange/Pink)
                const progress = (totalMinutes - 300) / 60;
                r = dawnLightColor.r + (dawnOrangePinkColor.r - dawnLightColor.r) * progress;
                g = dawnLightColor.g + (dawnOrangePinkColor.g - dawnLightColor.g) * progress;
                b = dawnLightColor.b + (dawnOrangePinkColor.b - dawnLightColor.b) * progress;
            } else if (totalMinutes >= 360 && totalMinutes < 420) { // 06:00 to 07:00 (Dawn Orange/Pink to Sunrise Peak)
                const progress = (totalMinutes - 360) / 60;
                r = dawnOrangePinkColor.r + (sunrisePeakColor.r - dawnOrangePinkColor.r) * progress;
                g = dawnOrangePinkColor.g + (sunrisePeakColor.g - dawnOrangePinkColor.g) * progress;
                b = dawnOrangePinkColor.b + (sunrisePeakColor.b - dawnOrangePinkColor.b) * progress;
            } else if (totalMinutes >= 420 && totalMinutes < 660) { // 07:00 to 11:00 (Sunrise Peak to Mid Morning Sky)
                const progress = (totalMinutes - 420) / 240;
                r = sunrisePeakColor.r + (morningBlueSkyColor.r - sunrisePeakColor.r) * progress;
                g = sunrisePeakColor.g + (morningBlueSkyColor.g - sunrisePeakColor.g) * progress;
                b = sunrisePeakColor.b + (morningBlueSkyColor.b - sunrisePeakColor.b) * progress;
            } else if (totalMinutes >= 660 && totalMinutes < 960) { // 11:00 to 16:00 (Mid Morning Sky to Midday Bright)
                const progress = (totalMinutes - 660) / 300; // 5 hours = 300 minutes
                r = morningBlueSkyColor.r + (middayBrightColor.r - morningBlueSkyColor.r) * progress;
                g = morningBlueSkyColor.g + (middayBrightColor.g - morningBlueSkyColor.g) * progress;
                b = morningBlueSkyColor.b + (middayBrightColor.b - morningBlueSkyColor.b) * progress;
            } else if (totalMinutes >= 960 && totalMinutes < 1080) { // 16:00 to 18:00 (Midday Bright to Golden Hour)
                const progress = (totalMinutes - 960) / 120;
                r = middayBrightColor.r + (goldenHourColor.r - middayBrightColor.r) * progress;
                g = middayBrightColor.g + (goldenHourColor.g - middayBrightColor.g) * progress;
                b = middayBrightColor.b + (goldenHourColor.b - middayBrightColor.b) * progress;
            } else if (totalMinutes >= 1080 && totalMinutes < 1140) { // 18:00 to 19:00 (Golden Hour to Sunset Peak)
                const progress = (totalMinutes - 1080) / 60;
                r = goldenHourColor.r + (sunsetPeakColor.r - goldenHourColor.r) * progress;
                g = goldenHourColor.g + (sunsetPeakColor.g - goldenHourColor.g) * progress;
                b = goldenHourColor.b + (sunsetPeakColor.b - goldenHourColor.b) * progress;
            } else if (totalMinutes >= 1140 && totalMinutes < 1230) { // 19:00 to 20:30 (Sunset Peak to Twilight Purple)
                const progress = (totalMinutes - 1140) / 90;
                r = sunsetPeakColor.r + (twilightPurpleColor.r - sunsetPeakColor.r) * progress;
                g = sunsetPeakColor.g + (twilightPurpleColor.g - sunsetPeakColor.g) * progress;
                b = sunsetPeakColor.b + (twilightPurpleColor.b - sunsetPeakColor.b) * progress;
            } else if (totalMinutes >= 1230 && totalMinutes < 1320) { // 20:30 to 22:00 (Twilight Purple to Early Night Dark)
                const progress = (totalMinutes - 1230) / 90;
                r = twilightPurpleColor.r + (earlyNightDarkColor.r - twilightPurpleColor.r) * progress;
                g = twilightPurpleColor.g + (earlyNightDarkColor.g - twilightPurpleColor.g) * progress;
                b = twilightPurpleColor.b + (earlyNightDarkColor.b - twilightPurpleColor.b) * progress;
            } else { // totalMinutes >= 1320 && totalMinutes < 1440 (22:00 to 24:00 (Midnight))
                const progress = (totalMinutes - 1320) / 120;
                r = earlyNightDarkColor.r + (midnightDeepColor.r - earlyNightDarkColor.r) * progress;
                g = earlyNightDarkColor.g + (midnightDeepColor.g - earlyNightDarkColor.g) * progress;
                b = midnightDeepColor.b + (midnightDeepColor.b - earlyNightDarkColor.b) * progress;
            }

            // arrondissement des valeurs
            r = Math.round(r);
            g = Math.round(g);
            b = Math.round(b);

            body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        } else {
            // --- Default values when no city is selected ---

            // Set hands to 12:00
            hourHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;
            minuteHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;
            // Hide second hand if no city is searched, regardless of checkbox
            secondHand.style.display = 'none';

            // Digital time default
            timeDisplay.textContent = "--:--";

            // Sun/Moon orbit default
            const utcHours = now.getUTCHours();
            const utcMinutes = now.getUTCMinutes();
            const utcSeconds = now.getUTCSeconds();
            const totalSecondsOfDayUTC = (utcHours * 3600) + (utcMinutes * 60) + utcSeconds;
            const orbitProgressDegreesUTC = (totalSecondsOfDayUTC / (24 * 3600)) * 360;

            const sunOrbitAngleUTC = (orbitProgressDegreesUTC - 90 + 360) % 360;
            const moonOrbitAngleUTC = (sunOrbitAngleUTC + 180) % 360;

            const finalRotateSunAngleUTC = (-sunOrbitAngleUTC + 360) % 360;
            const finalRotateMoonAngleUTC = (-moonOrbitAngleUTC + 360) % 360;

            sun.style.transform = `translate(-50%, -50%) rotate(${finalRotateSunAngleUTC}deg) translateX(${orbitRadius}px) rotate(${-finalRotateSunAngleUTC}deg)`;
            moon.style.transform = `translate(-50%, -50%) rotate(${finalRotateMoonAngleUTC}deg) translateX(${orbitRadius}px) rotate(${-finalRotateMoonAngleUTC}deg)`;

            // Default background color
            body.style.backgroundColor = `rgb(22, 31, 40)`;
        }

        // Always update the city display with currentCity (either searched city or "Search for a City")
        cityDisplay.textContent = currentCity;
    }


    function BriceDeNice(isBricable) {
        if (isBricable) {
            horlogeBG.style.background = "black";
            body.style.background = "yellow";
            cityDisplay.style.color = "black";
            timeDisplay.style.color = "black";
            secondHand.style.background = "yellow";
            minuteHand.style.background = "yellow";
            hourHand.style.background = "yellow";
        }
        else {
            horlogeBG.style.background = "black";
            body.style.background = "yellow";
            cityDisplay.style.color = "white";
            timeDisplay.style.color = "white";
            secondHand.style.background = "yellow";
            minuteHand.style.background = "yellow";
            hourHand.style.background = "yellow";
        }
    }

    // City search logic
    async function searchCity() {
        const city = searchInput.value.trim();
        if (!city) {
            toggleAutocompleteVisibility(); // Hide suggestions
            return;
        }

        // Convert to lowercase for case-insensitive search
        let lowerCaseCity = city.toLowerCase();
        let cityData = cityToTimezoneMap[lowerCaseCity];

        // If direct match not found, check display names
        if (!cityData) {
            for (const key in cityToTimezoneMap) {
                if (cityToTimezoneMap[key].displayName.toLowerCase() === lowerCaseCity) {
                    cityData = cityToTimezoneMap[key];
                    lowerCaseCity = key; // Update key to ensure proper internal lookup if needed
                    break;
                }
            }
        }

        if (cityData) {
            // City found
            currentIANAtimezone = cityData.timezone;
            currentCity = cityData.displayName;
            isCitySearched = true;
            horlogeContainer.style.display = 'flex'; // Show the clock container

            updateClock(); // Update clock immediately after setting new city
            searchInput.value = ""; // Clear search bar
            autocompleteSuggestionsDiv.classList.remove('is-visible'); // Hide suggestions after search
            autocompleteSuggestionsDiv.innerHTML = ''; // Clear suggestions content
            selectedIndex = -1; // Reset selection after search
        } else {
            // City not found
            alert(
                `The city "${city}" is not found in our list.\n` +
                "Please check spelling or try another city from the predefined list."
            );
            isCitySearched = false;
            currentIANAtimezone = null;
            currentCity = "Search for a City";
            horlogeContainer.style.display = 'none'; // Hide the clock container

            // Reset visual elements to their default "no city" state
            hourHand.style.transform = "translate(-50%, -100%) rotate(0deg)";
            minuteHand.style.transform = "translate(-50%, -100%) rotate(0deg)";
            secondHand.style.display = 'none'; // Ensure second hand is hidden
            body.style.backgroundColor = "rgb(22, 31, 40)"; // Ensure it resets to dark
            autocompleteSuggestionsDiv.classList.remove('is-visible'); // Hide suggestions on failed search
            autocompleteSuggestionsDiv.innerHTML = ''; // Clear suggestions content
            selectedIndex = -1; // Reset selection on failed search
        }
    }

    /**
     * Manages highlighting of autocomplete suggestions based on selectedIndex.
     * @param {number} index - The index of the suggestion to highlight.
     */
    function highlightSuggestion(index) {
        const suggestions = autocompleteSuggestionsDiv.querySelectorAll('.autocomplete-suggestion-item');
        // Remove existing highlights
        suggestions.forEach(item => {
            item.classList.remove('selected-suggestion');
        });

        // Apply highlight to the new selected item
        if (index >= 0 && index < suggestions.length) {
            suggestions[index].classList.add('selected-suggestion');
            // Optional: Scroll the highlighted item into view
            suggestions[index].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        }
    }

    /**
     * Toggles the visibility of autocomplete suggestions via the 'is-visible' CSS class.
     * It ensures suggestions are only shown if there are matching results AND the input is not empty.
     */
    function toggleAutocompleteVisibility() {
        // Check if there are actual suggestion elements AND the input field has text
        if (autocompleteSuggestionsDiv.children.length > 0 && searchInput.value.trim().length > 0) {
            autocompleteSuggestionsDiv.classList.add('is-visible');
        } else {
            autocompleteSuggestionsDiv.classList.remove('is-visible');
            autocompleteSuggestionsDiv.innerHTML = ''; // Clear content when hidden
            selectedIndex = -1; // Reset selection when hidden
        }
    }


    // --- Event Listener for search input (handles autocomplete generation) ---
    searchInput.addEventListener('input', function () {
        const inputValue = this.value.trim().toLowerCase();
        autocompleteSuggestionsDiv.innerHTML = ''; // Clear previous suggestions
        selectedIndex = -1; // Reset selection when input changes

        if (inputValue.length === 0) {
            toggleAutocompleteVisibility(); // Hide suggestions if input is empty
            return;
        }

        const matchingCities = [];
        for (const cityKey in cityToTimezoneMap) {
            const displayName = cityToTimezoneMap[cityKey].displayName.toLowerCase();
            // Check if the display name (or key) includes the input value
            if (displayName.includes(inputValue) || cityKey.includes(inputValue)) {
                matchingCities.push(cityToTimezoneMap[cityKey].displayName);
            }
        }

        if (matchingCities.length > 0) {
            matchingCities.forEach((cityName, index) => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('autocomplete-suggestion-item');
                suggestionItem.textContent = cityName;

                // Add mouseover event to update selectedIndex
                suggestionItem.addEventListener('mouseover', function () {
                    selectedIndex = index;
                    highlightSuggestion(selectedIndex);
                });

                suggestionItem.addEventListener('click', () => {
                    searchInput.value = cityName; // Set the input value
                    searchCity(); // Trigger the search immediately (searchCity will handle hiding)
                });
                autocompleteSuggestionsDiv.appendChild(suggestionItem);
            });
            toggleAutocompleteVisibility(); // Show suggestions if matches were found
        } else {
            toggleAutocompleteVisibility(); // Hide if no matches found
        }
    });

    // --- Hide suggestions when clicking outside the search input/suggestions ---
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !autocompleteSuggestionsDiv.contains(e.target)) {
            toggleAutocompleteVisibility(); // Hide using the toggle function
        }
    });


    // --- Event Listener for Keyboard (Enter, ArrowUp, ArrowDown) ---
    searchInput.addEventListener('keydown', (event) => {
        const suggestions = autocompleteSuggestionsDiv.querySelectorAll('.autocomplete-suggestion-item');
        const numSuggestions = suggestions.length;

        if (event.key === 'ArrowUp') {
            event.preventDefault(); // Prevent cursor from moving to start of input
            if (numSuggestions > 0) {
                selectedIndex = (selectedIndex - 1 + numSuggestions) % numSuggestions;
                highlightSuggestion(selectedIndex);
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault(); // Prevent cursor from moving to end of input
            if (numSuggestions > 0) {
                selectedIndex = (selectedIndex + 1) % numSuggestions;
                highlightSuggestion(selectedIndex);
            }
        } else if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission (if input is inside a form)

            // If autocomplete is visible and there are suggestions
            if (autocompleteSuggestionsDiv.classList.contains('is-visible') && numSuggestions > 0) {
                let cityToSearch = '';
                if (selectedIndex !== -1) {
                    // If an item is selected by arrows, use its text
                    cityToSearch = suggestions[selectedIndex].textContent;
                } else {
                    // If no item is selected (e.g., just typed and pressed Enter),
                    // use the first suggestion if available, otherwise use current input value
                    cityToSearch = suggestions[0] ? suggestions[0].textContent : searchInput.value;
                }

                searchInput.value = cityToSearch; // Set input value to the chosen city
                searchCity(); // Trigger search with the selected/chosen city (searchCity will handle hiding)
            } else {
                // If no suggestions are visible, search the current input value directly
                searchCity();
            }
        }
    });

    // --- Event Listener for Seconds Checkbox ---
    secondsCB.addEventListener('change', updateClock);


    // --- Initial State Setup on Page Load ---
    cityDisplay.textContent = currentCity;
    timeDisplay.textContent = "--:--";
    horlogeContainer.style.display = 'none'; // Clock is hidden by default
    isCitySearched = false;
    toggleAutocompleteVisibility(); // Ensure autocomplete suggestions are hidden on initial page load

    // Set initial state of second hand based on checkbox (it's unchecked by default)
    secondHand.style.display = 'none'; // Initially hide the analog second hand

    // Initial clock update and then set interval
    updateClock();
    setInterval(updateClock, 1000); // Update clock every second
});