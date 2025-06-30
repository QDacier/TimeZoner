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

    // ------------------- Global Variables for Time and Location -------------------
    let currentCity = "Search for a City"; 
    let currentIANAtimezone = null;       
    let isCitySearched = false;           

    // A comprehensive map of common city names to their IANA Timezone IDs and a display name.
    const cityToTimezoneMap = {
        "londres": { timezone: "Europe/London", displayName: "Londres" },
        "paris": { timezone: "Europe/Paris", displayName: "Paris" },
        "new york": { timezone: "America/New_York", displayName: "New York" },
        "los angeles": { timezone: "America/Los_Angeles", displayName: "Los Angeles" },
        "tokyo": { timezone: "Asia/Tokyo", displayName: "Tokyo" },
        "sydney": { timezone: "Australia/Sydney", displayName: "Sydney" },
        "dubai": { timezone: "Asia/Dubai", displayName: "Dubai" },
        "berlin": { timezone: "Europe/Berlin", displayName: "Berlin" },
        "rome": { timezone: "Europe/Rome", displayName: "Rome" },
        "madrid": { timezone: "Europe/Madrid", displayName: "Madrid" },
        "moscow": { timezone: "Europe/Moscow", displayName: "Moscow" },
        "beijing": { timezone: "Asia/Shanghai", displayName: "Beijing" },
        "shanghai": { timezone: "Asia/Shanghai", displayName: "Shanghai" },
        "delhi": { timezone: "Asia/Kolkata", displayName: "Delhi" },
        "mumbai": { timezone: "Asia/Kolkata", displayName: "Mumbai" },
        "singapore": { timezone: "Asia/Singapore", displayName: "Singapore" },
        "hong kong": { timezone: "Asia/Hong_Kong", displayName: "Hong Kong" },
        "cape town": { timezone: "Africa/Johannesburg", displayName: "Cape Town" },
        "johannesburg": { timezone: "Africa/Johannesburg", displayName: "Johannesburg" },
        "rio de janeiro": { timezone: "America/Sao_Paulo", displayName: "Rio de Janeiro" },
        "buenos aires": { timezone: "America/Argentina/Buenos_Aires", displayName: "Buenos Aires" },
        "mexico city": { timezone: "America/Mexico_City", displayName: "Mexico City" },
        "toronto": { timezone: "America/Toronto", displayName: "Toronto" },
        "montreal": { timezone: "America/Montreal", displayName: "Montreal" },
        "québec": { timezone: "America/Montreal", displayName: "Québec" },
        "ottawa": { timezone: "America/Toronto", displayName: "Ottawa" },
        "vancouver": { timezone: "America/Vancouver", displayName: "Vancouver" },
        "sao paulo": { timezone: "America/Sao_Paulo", displayName: "Sao Paulo" },
        "cairo": { timezone: "Africa/Cairo", displayName: "Cairo" },
        "istanbul": { timezone: "Europe/Istanbul", displayName: "Istanbul" },
        "bangkok": { timezone: "Asia/Bangkok", displayName: "Bangkok" },
        "jakarta": { timezone: "Asia/Jakarta", displayName: "Jakarta" },
        "manila": { timezone: "Asia/Manila", displayName: "Manila" },
        "auckland": { timezone: "Pacific/Auckland", displayName: "Auckland" },
        "washington": { timezone: "America/New_York", displayName: "Washington D.C." },
        "bruxelles": { timezone: "Europe/Brussels", displayName: "Bruxelles" },
        "rabat": { timezone: "Africa/Casablanca", displayName: "Rabat" },
        "amsterdam": { timezone: "Europe/Amsterdam", displayName: "Amsterdam" },
        "dublin": { timezone: "Europe/Dublin", displayName: "Dublin" },
        "lisbon": { timezone: "Europe/Lisbon", displayName: "Lisbon" },
        "vienna": { timezone: "Europe/Vienna", displayName: "Vienna" },
        "prague": { timezone: "Europe/Prague", displayName: "Prague" },
        "warsaw": { timezone: "Europe/Warsaw", displayName: "Warsaw" },
        "athens": { timezone: "Europe/Athens", displayName: "Athens" },
        "helsinki": { timezone: "Europe/Helsinki", displayName: "Helsinki" },
        "stockholm": { timezone: "Europe/Stockholm", displayName: "Stockholm" },
        "oslo": { timezone: "Europe/Oslo", displayName: "Oslo" },
        "copenhagen": { timezone: "Europe/Copenhagen", displayName: "Copenhagen" },
        "edinburgh": { timezone: "Europe/London", displayName: "Edinburgh" },
        "chicago": { timezone: "America/Chicago", displayName: "Chicago" },
        "denver": { timezone: "America/Denver", displayName: "Denver" },
        "phoenix": { timezone: "America/Phoenix", displayName: "Phoenix" },
        "anchorage": { timezone: "America/Anchorage", displayName: "Anchorage" },
        "honolulu": { timezone: "Pacific/Honolulu", displayName: "Honolulu" },
        "bogota": { timezone: "America/Bogota", displayName: "Bogota" },
        "lima": { timezone: "America/Lima", displayName: "Lima" },
        "santiago": { timezone: "America/Santiago", displayName: "Santiago" },
        "caracas": { timezone: "America/Caracas", displayName: "Caracas" },
        "lagos": { timezone: "Africa/Lagos", displayName: "Lagos" },
        "nairobi": { timezone: "Africa/Nairobi", displayName: "Nairobi" },
        "riyadh": { timezone: "Asia/Riyadh", displayName: "Riyadh" },
        "jerusalem": { timezone: "Asia/Jerusalem", displayName: "Jerusalem" },
        "seoul": { timezone: "Asia/Seoul", displayName: "Seoul" },
        "kuala lumpur": { timezone: "Asia/Kuala_Lumpur", displayName: "Kuala Lumpur" },
        "ho chi minh city": { timezone: "Asia/Ho_Chi_Minh", displayName: "Ho Chi Minh City" },
        "perth": { timezone: "Australia/Perth", displayName: "Perth" },
        "brisbane": { timezone: "Australia/Brisbane", displayName: "Brisbane" },
        "adelaide": { timezone: "Australia/Adelaide", displayName: "Adelaide" },
        "wellington": { timezone: "Pacific/Auckland", displayName: "Wellington" },
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

            // ------------------- Day/Night Background Color Change -------------------
            let r, g, b;

            // Define RGB colors for different times of day
            const dayColor = { r: 52, g: 73, b: 94 };     
            const midDayColor = { r: 135, g: 206, b: 235 }; 
            const eveningColor = { r: 255, g: 140, b: 0 };  
            const nightColor = { r: 22, g: 31, b: 40 };    

            // Interpolate colors based on local city's hour and minute
            if (localHours >= 6 && localHours < 12) { 
                const progress = (localHours - 6 + localMinutes / 60) / 6;
                r = dayColor.r + (midDayColor.r - dayColor.r) * progress;
                g = dayColor.g + (midDayColor.g - dayColor.g) * progress;
                b = dayColor.b + (midDayColor.b - dayColor.b) * progress;
            } else if (localHours >= 12 && localHours < 18) { 
                const progress = (localHours - 12 + localMinutes / 60) / 6;
                r = midDayColor.r + (eveningColor.r - midDayColor.r) * progress;
                g = midDayColor.g + (eveningColor.g - midDayColor.g) * progress;
                b = midDayColor.b + (eveningColor.b - midDayColor.b) * progress;
            } else if (localHours >= 18 && localHours < 24) { 
                const progress = (localHours - 18 + localMinutes / 60) / 6;
                r = eveningColor.r + (nightColor.r - eveningColor.r) * progress;
                g = eveningColor.g + (nightColor.g - eveningColor.g) * progress;
                b = eveningColor.b + (nightColor.b - eveningColor.b) * progress;
            } else { 
                const progress = (localHours + localMinutes / 60) / 6;
                r = nightColor.r + (dayColor.r - nightColor.r) * progress;
                g = nightColor.g + (dayColor.g - nightColor.g) * progress;
                b = nightColor.b + (dayColor.b - nightColor.b) * progress;
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

        const lowerCaseCity = city.toLowerCase(); 
        const cityData = cityToTimezoneMap[lowerCaseCity]; 

        if (cityData) {
            // City found in our map
            currentIANAtimezone = cityData.timezone; 
            currentCity = cityData.displayName;      
            isCitySearched = true;                   
            horlogeContainer.style.display = 'flex'; 

            updateClock();       
            searchInput.value = ''; 
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
            body.style.backgroundColor = `rgba(255, 255, 255, 0.1)`; 
        }
    }

    // --- Event Listeners for Search Functionality ---
    searchButton.addEventListener('click', searchCity); 
    searchInput.addEventListener('keydown', (event) => { 
        if (event.key === 'Enter') {
            event.preventDefault(); 
            searchCity(); 
        }
    });

    // --- Initial State Setup on Page Load ---
    cityDisplay.textContent = currentCity; 
    timeDisplay.textContent = "--:--";     
    horlogeContainer.style.display = 'none'; 
    isCitySearched = false;                 

    updateClock();
    setInterval(updateClock, 1000);
});