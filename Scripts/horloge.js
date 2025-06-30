document.addEventListener('DOMContentLoaded', (event) => {
    // DOM Elements
    const hourHand = document.getElementById('aigHr');
    const minuteHand = document.getElementById('aigMin');
    const secondHand = document.getElementById('aigSec');
    const cityDisplay = document.getElementById('ville');
    const timeDisplay = document.getElementById('heure');
    const horlogeContainer = document.getElementById('horloge');
    const horlogeBG = document.getElementById('horlogeBG');
    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const body = document.body;
    const autocompleteSuggestionsDiv = document.getElementById('autocomplete-suggestions');


    // ------------------- Global Variables for Time and Location -------------------
    let currentCity = "Search for a City";
    let currentIANAtimezone = null;
    let isCitySearched = false;

    // A comprehensive map of common city names to their IANA Timezone IDs and a display name.
    const cityToTimezoneMap = {
        "london": { "timezone": "Europe/London", "displayName": "London" },
        "paris": { "timezone": "Europe/Paris", "displayName": "Paris" },
        "new york": { "timezone": "America/New_York", "displayName": "New York" },
        "los angeles": { "timezone": "America/Los_Angeles", "displayName": "Los Angeles" },
        "tokyo": { "timezone": "Asia/Tokyo", "displayName": "Tokyo" },
        "sydney": { "timezone": "Australia/Sydney", "displayName": "Sydney" },
        "dubai": { "timezone": "Asia/Dubai", "displayName": "Dubai" },
        "berlin": { "timezone": "Europe/Berlin", "displayName": "Berlin" },
        "rome": { "timezone": "Europe/Rome", "displayName": "Rome" },
        "madrid": { "timezone": "Europe/Madrid", "displayName": "Madrid" },
        "moscow": { "timezone": "Europe/Moscow", "displayName": "Moscow" },
        "beijing": { "timezone": "Asia/Shanghai", "displayName": "Beijing" },
        "shanghai": { "timezone": "Asia/Shanghai", "displayName": "Shanghai" },
        "delhi": { "timezone": "Asia/Kolkata", "displayName": "Delhi" },
        "mumbai": { "timezone": "Asia/Kolkata", "displayName": "Mumbai" },
        "singapore": { "timezone": "Asia/Singapore", "displayName": "Singapore" },
        "hong kong": { "timezone": "Asia/Hong_Kong", "displayName": "Hong Kong" },
        "cape town": { "timezone": "Africa/Johannesburg", "displayName": "Cape Town" },
        "johannesburg": { "timezone": "Africa/Johannesburg", "displayName": "Johannesburg" },
        "rio de janeiro": { "timezone": "America/Sao_Paulo", "displayName": "Rio de Janeiro" },
        "buenos aires": { "timezone": "America/Argentina/Buenos_Aires", "displayName": "Buenos Aires" },
        "mexico": { "timezone": "America/Mexico_City", "displayName": "Mexico City" },
        "toronto": { "timezone": "America/Toronto", "displayName": "Toronto" },
        "montréal": { "timezone": "America/Montreal", "displayName": "Montréal" },
        "québec": { "timezone": "America/Montreal", "displayName": "Québec" },
        "ottawa": { "timezone": "America/Toronto", "displayName": "Ottawa" },
        "vancouver": { "timezone": "America/Vancouver", "displayName": "Vancouver" },
        "sao paulo": { "timezone": "America/Sao_Paulo", "displayName": "Sao Paulo" },
        "cairo": { "timezone": "Africa/Cairo", "displayName": "Cairo" },
        "istanbul": { "timezone": "Europe/Istanbul", "displayName": "Istanbul" },
        "bangkok": { "timezone": "Asia/Bangkok", "displayName": "Bangkok" },
        "jakarta": { "timezone": "Asia/Jakarta", "displayName": "Jakarta" },
        "manila": { "timezone": "Asia/Manila", "displayName": "Manila" },
        "auckland": { "timezone": "Pacific/Auckland", "displayName": "Auckland" },
        "washington": { "timezone": "America/New_York", "displayName": "Washington D.C." },
        "bruxelles": { "timezone": "Europe/Brussels", "displayName": "Bruxelles" },
        "rabat": { "timezone": "Africa/Casablanca", "displayName": "Rabat" },
        "amsterdam": { "timezone": "Europe/Amsterdam", "displayName": "Amsterdam" },
        "dublin": { "timezone": "Europe/Dublin", "displayName": "Dublin" },
        "lisbon": { "timezone": "Europe/Lisbon", "displayName": "Lisbon" },
        "vienna": { "timezone": "Europe/Vienna", "displayName": "Vienna" },
        "prague": { "timezone": "Europe/Prague", "displayName": "Prague" },
        "warsaw": { "timezone": "Europe/Warsaw", "displayName": "Warsaw" },
        "athens": { "timezone": "Europe/Athens", "displayName": "Athens" },
        "helsinki": { "timezone": "Europe/Helsinki", "displayName": "Helsinki" },
        "stockholm": { "timezone": "Europe/Stockholm", "displayName": "Stockholm" },
        "oslo": { "timezone": "Europe/Oslo", "displayName": "Oslo" },
        "copenhagen": { "timezone": "Europe/Copenhagen", "displayName": "Copenhagen" },
        "edinburgh": { "timezone": "Europe/London", "displayName": "Edinburgh" },
        "chicago": { "timezone": "America/Chicago", "displayName": "Chicago" },
        "denver": { "timezone": "America/Denver", "displayName": "Denver" },
        "phoenix": { "timezone": "America/Phoenix", "displayName": "Phoenix" },
        "anchorage": { "timezone": "America/Anchorage", "displayName": "Anchorage" },
        "honolulu": { "timezone": "Pacific/Honolulu", "displayName": "Honolulu" },
        "bogota": { "timezone": "America/Bogota", "displayName": "Bogota" },
        "lima": { "timezone": "America/Lima", "displayName": "Lima" },
        "santiago": { "timezone": "America/Santiago", "displayName": "Santiago" },
        "caracas": { "timezone": "America/Caracas", "displayName": "Caracas" },
        "lagos": { "timezone": "Africa/Lagos", "displayName": "Lagos" },
        "nairobi": { "timezone": "Africa/Nairobi", "displayName": "Nairobi" },
        "riyadh": { "timezone": "Asia/Riyadh", "displayName": "Riyadh" },
        "jerusalem": { "timezone": "Asia/Jerusalem", "displayName": "Jerusalem" },
        "seoul": { "timezone": "Asia/Seoul", "displayName": "Seoul" },
        "kuala lumpur": { "timezone": "Asia/Kuala_Lumpur", "displayName": "Kuala Lumpur" },
        "ho chi minh city": { "timezone": "Asia/Ho_Chi_Minh", "displayName": "Ho Chi Minh City" },
        "perth": { "timezone": "Australia/Perth", "displayName": "Perth" },
        "brisbane": { "timezone": "Australia/Brisbane", "displayName": "Brisbane" },
        "adelaide": { "timezone": "Australia/Adelaide", "displayName": "Adelaide" },
        "wellington": { "timezone": "Pacific/Auckland", "displayName": "Wellington" },
        "canberra": { "timezone": "Australia/Sydney", "displayName": "Canberra" },
        "brasilia": { "timezone": "America/Sao_Paulo", "displayName": "Brasilia" },
        "new delhi": { "timezone": "Asia/Kolkata", "displayName": "New Delhi" },
        "abuja": { "timezone": "Africa/Lagos", "displayName": "Abuja" },
        "algiers": { "timezone": "Africa/Algiers", "displayName": "Algiers" },
        "tripoli": { "timezone": "Africa/Tripoli", "displayName": "Tripoli" },
        "tunis": { "timezone": "Africa/Tunis", "displayName": "Tunis" },
        "khartoum": { "timezone": "Africa/Khartoum", "displayName": "Khartoum" },
        "addis ababa": { "timezone": "Africa/Addis_Ababa", "displayName": "Addis Ababa" },
        "mogadishu": { "timezone": "Africa/Mogadishu", "displayName": "Mogadishu" },
        "djibouti": { "timezone": "Africa/Djibouti", "displayName": "Djibouti" },
        "asmara": { "timezone": "Africa/Asmara", "displayName": "Asmara" },
        "doha": { "timezone": "Asia/Qatar", "displayName": "Doha" },
        "manama": { "timezone": "Asia/Bahrain", "displayName": "Manama" },
        "kuwait city": { "timezone": "Asia/Kuwait", "displayName": "Kuwait City" },
        "abu dhabi": { "timezone": "Asia/Dubai", "displayName": "Abu Dhabi" },
        "muscat": { "timezone": "Asia/Muscat", "displayName": "Muscat" },
        "sana'a": { "timezone": "Asia/Aden", "displayName": "Sana'a" },
        "baku": { "timezone": "Asia/Baku", "displayName": "Baku" },
        "tbilisi": { "timezone": "Asia/Tbilisi", "displayName": "Tbilisi" },
        "yerevan": { "timezone": "Asia/Yerevan", "displayName": "Yerevan" },
        "astana": { "timezone": "Asia/Almaty", "displayName": "Astana" },
        "tashkent": { "timezone": "Asia/Tashkent", "displayName": "Tashkent" },
        "bishkek": { "timezone": "Asia/Bishkek", "displayName": "Bishkek" },
        "dushanbe": { "timezone": "Asia/Dushanbe", "displayName": "Dushanbe" },
        "ashgabat": { "timezone": "Asia/Ashgabat", "displayName": "Ashgabat" },
        "kathmandu": { "timezone": "Asia/Kathmandu", "displayName": "Kathmandu" },
        "thimphu": { "timezone": "Asia/Thimphu", "displayName": "Thimphu" },
        "dhaka": { "timezone": "Asia/Dhaka", "displayName": "Dhaka" },
        "colombo": { "timezone": "Asia/Colombo", "displayName": "Colombo" },
        "male": { "timezone": "Indian/Maldives", "displayName": "Malé" },
        "ulaanbaatar": { "timezone": "Asia/Ulaanbaatar", "displayName": "Ulaanbaatar" },
        "pyongyang": { "timezone": "Asia/Pyongyang", "displayName": "Pyongyang" },
        "vientiane": { "timezone": "Asia/Vientiane", "displayName": "Vientiane" },
        "phnom penh": { "timezone": "Asia/Phnom_Penh", "displayName": "Phnom Penh" },
        "naypyidaw": { "timezone": "Asia/Yangon", "displayName": "Naypyidaw" },
        "bandar seri begawan": { "timezone": "Asia/Brunei", "displayName": "Bandar Seri Begawan" },
        "dili": { "timezone": "Asia/Dili", "displayName": "Dili" },
        "port moresby": { "timezone": "Pacific/Port_Moresby", "displayName": "Port Moresby" },
        "honiara": { "timezone": "Pacific/Guadalcanal", "displayName": "Honiara" },
        "suva": { "timezone": "Pacific/Fiji", "displayName": "Suva" },
        "nukuʻalofa": { "timezone": "Pacific/Tongatapu", "displayName": "Nukuʻalofa" },
        "apia": { "timezone": "Pacific/Apia", "displayName": "Apia" },
        "palikir": { "timezone": "Pacific/Pohnpei", "displayName": "Palikir" },
        "majuro": { "timezone": "Pacific/Majuro", "displayName": "Majuro" },
        "tarawa": { "timezone": "Pacific/Tarawa", "displayName": "Tarawa" },
        "yaren": { "timezone": "Pacific/Nauru", "displayName": "Yaren" },
        "funafuti": { "timezone": "Pacific/Funafuti", "displayName": "Funafuti" },
        "alofi": { "timezone": "Pacific/Niue", "displayName": "Alofi" },
        "hagåtña": { "timezone": "Pacific/Guam", "displayName": "Hagåtña" },
        "saipan": { "timezone": "Pacific/Saipan", "displayName": "Saipan" },
        "pago pago": { "timezone": "Pacific/Pago_Pago", "displayName": "Pago Pago" },
        "nouméa": { "timezone": "Pacific/Noumea", "displayName": "Nouméa" },
        "papeete": { "timezone": "Pacific/Tahiti", "displayName": "Papeete" },
        "adamstown": { "timezone": "Pacific/Pitcairn", "displayName": "Adamstown" },
        "fakaofo": { "timezone": "Pacific/Fakaofo", "displayName": "Fakaofo" },
        "jamestown": { "timezone": "Atlantic/St_Helena", "displayName": "Jamestown" },
        "stanley": { "timezone": "Atlantic/Stanley", "displayName": "Stanley" },
        "george town": { "timezone": "America/Cayman", "displayName": "George Town" },
        "road town": { "timezone": "America/Tortola", "displayName": "Road Town" },
        "basseterre": { "timezone": "America/St_Kitts", "displayName": "Basseterre" },
        "castries": { "timezone": "America/St_Lucia", "displayName": "Castries" },
        "kingstown": { "timezone": "America/St_Vincent", "displayName": "Kingstown" },
        "st. john's": { "timezone": "America/Antigua", "displayName": "St. John's" },
        "roseau": { "timezone": "America/Dominica", "displayName": "Roseau" },
        "bridgetown": { "timezone": "America/Barbados", "displayName": "Bridgetown" },
        "port of spain": { "timezone": "America/Port_of_Spain", "displayName": "Port of Spain" },
        "paramaribo": { "timezone": "America/Paramaribo", "displayName": "Paramaribo" },
        "georgetown": { "timezone": "America/Guyana", "displayName": "Georgetown" },
        "cayenne": { "timezone": "America/Cayenne", "displayName": "Cayenne" },
        "panama city": { "timezone": "America/Panama", "displayName": "Panama City" },
        "san jose": { "timezone": "America/Costa_Rica", "displayName": "San Jose" },
        "managua": { "timezone": "America/Managua", "displayName": "Managua" },
        "tegucigalpa": { "timezone": "America/Tegucigalpa", "displayName": "Tegucigalpa" },
        "san salvador": { "timezone": "America/El_Salvador", "displayName": "San Salvador" },
        "guatemala city": { "timezone": "America/Guatemala", "displayName": "Guatemala City" },
        "belmopan": { "timezone": "America/Belize", "displayName": "Belmopan" },
        "nassau": { "timezone": "America/Nassau", "displayName": "Nassau" },
        "havana": { "timezone": "America/Havana", "displayName": "Havana" },
        "port-au-prince": { "timezone": "America/Port-au-Prince", "displayName": "Port-au-Prince" },
        "santo domingo": { "timezone": "America/Santo_Domingo", "displayName": "Santo Domingo" },
        "kingston": { "timezone": "America/Jamaica", "displayName": "Kingston" },
        "reykjavik": { "timezone": "Atlantic/Reykjavik", "displayName": "Reykjavik" },
        "bern": { "timezone": "Europe/Zurich", "displayName": "Bern" },
        "budapest": { "timezone": "Europe/Budapest", "displayName": "Budapest" },
        "bucharest": { "timezone": "Europe/Bucharest", "displayName": "Bucharest" },
        "sofia": { "timezone": "Europe/Sofia", "displayName": "Sofia" },
        "belgrade": { "timezone": "Europe/Belgrade", "displayName": "Belgrade" },
        "zagreb": { "timezone": "Europe/Zagreb", "displayName": "Zagreb" },
        "ljubljana": { "timezone": "Europe/Ljubljana", "displayName": "Ljubljana" },
        "sarajevo": { "timezone": "Europe/Sarajevo", "displayName": "Sarajevo" },
        "tirana": { "timezone": "Europe/Tirane", "displayName": "Tirana" },
        "skopje": { "timezone": "Europe/Skopje", "displayName": "Skopje" },
        "podgorica": { "timezone": "Europe/Podgorica", "displayName": "Podgorica" },
        "chișinău": { "timezone": "Europe/Chisinau", "displayName": "Chișinău" },
        "kyiv": { "timezone": "Europe/Kyiv", "displayName": "Kyiv" },
        "minsk": { "timezone": "Europe/Minsk", "displayName": "Minsk" },
        "riga": { "timezone": "Europe/Riga", "displayName": "Riga" },
        "vilnius": { "timezone": "Europe/Vilnius", "displayName": "Vilnius" },
        "tallinn": { "timezone": "Europe/Tallinn", "displayName": "Tallinn" },
        "valletta": { "timezone": "Europe/Malta", "displayName": "Valletta" },
        "nicosia": { "timezone": "Asia/Nicosia", "displayName": "Nicosia" },
        "beirut": { "timezone": "Asia/Beirut", "displayName": "Beirut" },
        "damascus": { "timezone": "Asia/Damascus", "displayName": "Damascus" },
        "baghdad": { "timezone": "Asia/Baghdad", "displayName": "Baghdad" },
        "tehran": { "timezone": "Asia/Tehran", "displayName": "Tehran" },
        "kabul": { "timezone": "Asia/Kabul", "displayName": "Kabul" },
        "islamabad": { "timezone": "Asia/Karachi", "displayName": "Islamabad" },
        "ulan bator": { "timezone": "Asia/Ulaanbaatar", "displayName": "Ulaanbaatar" },
        "st. john's": { "timezone": "America/St_Johns", "displayName": "St. John's, NL" },
        "charlottetown": { "timezone": "America/Halifax", "displayName": "Charlottetown, PEI" },
        "halifax": { "timezone": "America/Halifax", "displayName": "Halifax, NS" },
        "fredericton": { "timezone": "America/Moncton", "displayName": "Fredericton, NB" },
        "winnipeg": { "timezone": "America/Winnipeg", "displayName": "Winnipeg, MB" },
        "regina": { "timezone": "America/Regina", "displayName": "Regina, SK" },
        "edmonton": { "timezone": "America/Edmonton", "displayName": "Edmonton, AB" },
        "calgary": { "timezone": "America/Edmonton", "displayName": "Calgary, AB" },
        "victoria": { "timezone": "America/Vancouver", "displayName": "Victoria, BC" },
        "yellowknife": { "timezone": "America/Yellowknife", "displayName": "Yellowknife, NWT" },
        "whitehorse": { "timezone": "America/Whitehorse", "displayName": "Whitehorse, YK" },
        "iqaluit": { "timezone": "America/Iqaluit", "displayName": "Iqaluit, NU" },
        "seattle": { "timezone": "America/Los_Angeles", "displayName": "Seattle, WA" },
        "san francisco": { "timezone": "America/Los_Angeles", "displayName": "San Francisco, CA" },
        "houston": { "timezone": "America/Chicago", "displayName": "Houston, TX" },
        "miami": { "timezone": "America/New_York", "displayName": "Miami, FL" },
        "philadelphia": { "timezone": "America/New_York", "displayName": "Philadelphia, PA" },
        "detroit": { "timezone": "America/Detroit", "displayName": "Detroit, MI" },
        "boston": { "timezone": "America/New_York", "displayName": "Boston, MA" },
        "atlanta": { "timezone": "America/New_York", "displayName": "Atlanta, GA" },
        "dallas": { "timezone": "America/Chicago", "displayName": "Dallas, TX" },
        "salt lake city": { "timezone": "America/Denver", "displayName": "Salt Lake City, UT" },
        "las vegas": { "timezone": "America/Los_Angeles", "displayName": "Las Vegas, NV" },
        "portland": { "timezone": "America/Los_Angeles", "displayName": "Portland, OR" },
        "albuquerque": { "timezone": "America/Denver", "displayName": "Albuquerque, NM" },
        "omaha": { "timezone": "America/Chicago", "displayName": "Omaha, NE" },
        "nashville": { "timezone": "America/Chicago", "displayName": "Nashville, TN" },
        "new orleans": { "timezone": "America/Chicago", "displayName": "New Orleans, LA" },
        "minneapolis": { "timezone": "America/Chicago", "displayName": "Minneapolis, MN" },
        "indianapolis": { "timezone": "America/Indianapolis", "displayName": "Indianapolis, IN" },
        "cleveland": { "timezone": "America/New_York", "displayName": "Cleveland, OH" },
        "baltimore": { "timezone": "America/New_York", "displayName": "Baltimore, MD" },
        "charlotte": { "timezone": "America/New_York", "displayName": "Charlotte, NC" },
        "columbus": { "timezone": "America/New_York", "displayName": "Columbus, OH" },
        "milwaukee": { "timezone": "America/Chicago", "displayName": "Milwaukee, WI" },
        "san antonio": { "timezone": "America/Chicago", "displayName": "San Antonio, TX" },
        "fairbanks": { "timezone": "America/Anchorage", "displayName": "Fairbanks, AK" },
        "honolulu": { "timezone": "Pacific/Honolulu", "displayName": "Honolulu, HI" },
    };

    /**
     * Updates the analog clock hands, digital display, sun/moon orbit,
     * and background color based on the currently selected city's time.
     */
    function updateClock() {
        const now = new Date();

        let localHours, localMinutes, localSeconds;
        const orbitRadius = 180;

        if (isCitySearched && currentIANAtimezone) {
            // --- Get Time Components for the Selected City's Timezone ---
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: currentIANAtimezone,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
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
            secondHand.style.transform = `translate(-50%, -100%) rotate(${secondDegrees}deg)`;

            // ------------------- Update Digital Time Display -------------------
            const formattedHours = String(localHours).padStart(2, '0');
            const formattedMinutes = String(localMinutes).padStart(2, '0');
            timeDisplay.textContent = `${formattedHours}:${formattedMinutes}`;

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

            // Define more specific RGB colors for different times of day based on your reference
            // FINE-TUNE THESE RGB VALUES USING A COLOR PICKER ON YOUR REFERENCE IMAGE!
            const midnightDeepColor = { r: 15, g: 15, b: 30 };    // Very deep indigo (00:00, 24:00)
            const preDawnDarkColor = { r: 30, g: 20, b: 60 };    // Dark purple-blue (around 04:00)
            const dawnLightColor = { r: 100, g: 80, b: 120 };  // Muted purple-grey (around 05:00)
            const dawnOrangePinkColor = { r: 255, g: 120, b: 80 };  // Soft orange-pink (around 06:00)
            const sunrisePeakColor = { r: 255, g: 180, b: 70 };  // Vibrant orange/yellow (around 07:00)
            const morningBlueSkyColor = { r: 135, g: 206, b: 235 }; // Clear morning sky blue (around 08:00-10:00)
            const middayBrightColor = { r: 173, g: 216, b: 230 }; // Lightest mid-day blue (around 12:00-15:00)
            const goldenHourColor = { r: 255, g: 215, b: 100 }; // Warm yellow/orange (around 17:00)
            const sunsetPeakColor = { r: 255, g: 99, b: 71 };   // Intense red-orange (around 18:00)
            const twilightPurpleColor = { r: 80, g: 0, b: 120 };    // Dark violet (around 19:00)
            const twilightBlueColor = { r: 40, g: 40, b: 90 };    // Deep blue after purple (around 20:00)
            const earlyNightDarkColor = { r: 25, g: 25, b: 70 };    // Darkening blue-purple (around 21:00)


            // Calculate total minutes past midnight for interpolation (0 to 1439)
            const totalMinutes = localHours * 60 + localMinutes;

            // --- Interpolation Logic based on more granular time segments ---
            if (totalMinutes >= 0 && totalMinutes < 240) { // 00:00 (Midnight) to 04:00 (Pre-Dawn Dark)
                // Interpolate from Midnight Deep to Pre-Dawn Dark
                const progress = totalMinutes / 240; // 4 hours = 240 minutes
                r = midnightDeepColor.r + (preDawnDarkColor.r - midnightDeepColor.r) * progress;
                g = midnightDeepColor.g + (preDawnDarkColor.g - midnightDeepColor.g) * progress;
                b = midnightDeepColor.b + (preDawnDarkColor.b - midnightDeepColor.b) * progress;
            } else if (totalMinutes >= 240 && totalMinutes < 300) { // 04:00 to 05:00 (Pre-Dawn Dark to Dawn Light)
                const progress = (totalMinutes - 240) / 60; // 1 hour = 60 minutes
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
                const progress = (totalMinutes - 420) / 240; // 4 hours = 240 minutes
                r = sunrisePeakColor.r + (morningBlueSkyColor.r - sunrisePeakColor.r) * progress;
                g = sunrisePeakColor.g + (morningBlueSkyColor.g - sunrisePeakColor.g) * progress;
                b = sunrisePeakColor.b + (morningBlueSkyColor.b - sunrisePeakColor.b) * progress;
            } else if (totalMinutes >= 660 && totalMinutes < 960) { // 11:00 to 16:00 (Mid Morning Sky to Midday Bright)
                const progress = (totalMinutes - 660) / 300; // 5 hours = 300 minutes
                r = morningBlueSkyColor.r + (middayBrightColor.r - morningBlueSkyColor.r) * progress;
                g = morningBlueSkyColor.g + (middayBrightColor.g - morningBlueSkyColor.g) * progress;
                b = morningBlueSkyColor.b + (middayBrightColor.b - morningBlueSkyColor.b) * progress;
            } else if (totalMinutes >= 960 && totalMinutes < 1080) { // 16:00 to 18:00 (Midday Bright to Golden Hour)
                const progress = (totalMinutes - 960) / 120; // 2 hours = 120 minutes
                r = middayBrightColor.r + (goldenHourColor.r - middayBrightColor.r) * progress;
                g = middayBrightColor.g + (goldenHourColor.g - middayBrightColor.g) * progress;
                b = middayBrightColor.b + (goldenHourColor.b - middayBrightColor.b) * progress;
            } else if (totalMinutes >= 1080 && totalMinutes < 1140) { // 18:00 to 19:00 (Golden Hour to Sunset Peak)
                const progress = (totalMinutes - 1080) / 60; // 1 hour = 60 minutes
                r = goldenHourColor.r + (sunsetPeakColor.r - goldenHourColor.r) * progress;
                g = goldenHourColor.g + (sunsetPeakColor.g - goldenHourColor.g) * progress;
                b = goldenHourColor.b + (sunsetPeakColor.b - goldenHourColor.b) * progress;
            } else if (totalMinutes >= 1140 && totalMinutes < 1230) { // 19:00 to 20:30 (Sunset Peak to Twilight Purple)
                const progress = (totalMinutes - 1140) / 90; // 1.5 hours = 90 minutes
                r = sunsetPeakColor.r + (twilightPurpleColor.r - sunsetPeakColor.r) * progress;
                g = sunsetPeakColor.g + (twilightPurpleColor.g - sunsetPeakColor.g) * progress;
                b = sunsetPeakColor.b + (twilightPurpleColor.b - sunsetPeakColor.b) * progress;
            } else if (totalMinutes >= 1230 && totalMinutes < 1320) { // 20:30 to 22:00 (Twilight Purple to Early Night Dark)
                const progress = (totalMinutes - 1230) / 90; // 1.5 hours = 90 minutes
                r = twilightPurpleColor.r + (earlyNightDarkColor.r - twilightPurpleColor.r) * progress;
                g = twilightPurpleColor.g + (earlyNightDarkColor.g - twilightPurpleColor.g) * progress;
                b = twilightPurpleColor.b + (earlyNightDarkColor.b - twilightPurpleColor.b) * progress;
            } else { // totalMinutes >= 1320 && totalMinutes < 1440 (22:00 to 24:00 (Midnight))
                // Early Night Dark to Midnight Deep
                const progress = (totalMinutes - 1320) / 120; // 2 hours = 120 minutes
                r = earlyNightDarkColor.r + (midnightDeepColor.r - earlyNightDarkColor.r) * progress;
                g = earlyNightDarkColor.g + (midnightDeepColor.g - earlyNightDarkColor.g) * progress;
                b = earlyNightDarkColor.b + (midnightDeepColor.b - earlyNightDarkColor.b) * progress;
            }

            // Round RGB values to integers for CSS
            r = Math.round(r);
            g = Math.round(g);
            b = Math.round(b);

            body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        } else {
            // --- Default State: When no city is searched or on initial load ---

            // Set hands to 12:00
            hourHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;
            minuteHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;
            secondHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;

            // Digital display shows placeholder
            timeDisplay.textContent = "--:--";

            // Sun/Moon orbit for default (UTC) when no city searched
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

            // Keep a default background color when no city is searched
            body.style.backgroundColor = `rgb(22, 31, 40)`;
        }

        // Always update the city display with currentCity (either searched city or "Search for a City")
        cityDisplay.textContent = currentCity;
    }

    /**
     * Handles the city search logic, mapping user input to IANA timezones.
     */
    async function searchCity() {
        const city = searchInput.value.trim();
        if (!city) {
            alert("Please enter a city name.");
            return;
        }

        // Normalize input for lookup: convert display name back to map key if needed
        let lowerCaseCity = city.toLowerCase();
        let cityData = cityToTimezoneMap[lowerCaseCity];

        // If the direct lowercase input doesn't match a key,
        // try to find a key by matching display names (for cases like "New York" vs "new york")
        if (!cityData) {
            for (const key in cityToTimezoneMap) {
                if (cityToTimezoneMap[key].displayName.toLowerCase() === lowerCaseCity) {
                    cityData = cityToTimezoneMap[key];
                    lowerCaseCity = key; // Set the key to ensure correct map lookup later if needed
                    break;
                }
            }
        }

        if (cityData) {
            // City found in our map
            currentIANAtimezone = cityData.timezone;
            currentCity = cityData.displayName;
            isCitySearched = true;
            horlogeContainer.style.display = 'flex';

            updateClock();
            searchInput.value = ''; // Clear search input after successful search
            autocompleteSuggestionsDiv.style.display = 'none'; // Hide suggestions on successful search
        } else {
            // City not found in our map
            alert(
                `The city "${city}" is not found in our list.\n` +
                "Please check spelling or try another city from the predefined list."
            );
            isCitySearched = false;
            currentIANAtimezone = null;
            currentCity = "Search for a City";
            horlogeContainer.style.display = 'none';

            // Reset visual elements to their default "no city" state
            hourHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;
            minuteHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;
            secondHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;
            body.style.backgroundColor = `rgb(22, 31, 40)`; // Ensure it resets to black/dark
            autocompleteSuggestionsDiv.style.display = 'none'; // Hide suggestions on failed search
        }
    }

    // --- NEW: Autocomplete Event Listener ---
    searchInput.addEventListener('input', function () {
        const inputValue = this.value.trim().toLowerCase();
        autocompleteSuggestionsDiv.innerHTML = ''; // Clear previous suggestions

        if (inputValue.length === 0) {
            autocompleteSuggestionsDiv.style.display = 'none';
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
            matchingCities.forEach(cityName => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('autocomplete-suggestion-item');
                suggestionItem.textContent = cityName;
                suggestionItem.addEventListener('click', () => {
                    searchInput.value = cityName; // Set the input value
                    autocompleteSuggestionsDiv.style.display = 'none'; // Hide suggestions
                    searchCity(); // Trigger the search immediately
                });
                autocompleteSuggestionsDiv.appendChild(suggestionItem);
            });
            autocompleteSuggestionsDiv.style.display = 'block'; // Show suggestions
        } else {
            autocompleteSuggestionsDiv.style.display = 'none'; // Hide if no matches
        }
    });

    // --- NEW: Hide suggestions when clicking outside the search input/suggestions ---
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !autocompleteSuggestionsDiv.contains(e.target)) {
            autocompleteSuggestionsDiv.style.display = 'none';
        }
    });


    // --- Event Listeners for Search Functionality (existing) ---
    searchButton.addEventListener('click', searchCity);
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            searchCity();
        }
    });

    // --- Initial State Setup on Page Load (existing) ---
    cityDisplay.textContent = currentCity;
    timeDisplay.textContent = "--:--";
    horlogeContainer.style.display = 'none';
    isCitySearched = false;

    // Initial clock update and then set interval
    updateClock();
    setInterval(updateClock, 1000);
});