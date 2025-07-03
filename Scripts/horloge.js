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

    // Map des villes avec leurs fusieaux horaires
    const cityToTimezoneMap = {
        
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
            // Brice de Nice
            /*
            if (cityDisplay.textContent == "Nice, France") {


            }
            */

            let r, g, b;

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
            const earlyNightDarkColor = { r: 25, g: 25, b: 70 };    // Darkening blue-purple (around 21:00)


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
                b = earlyNightDarkColor.b + (midnightDeepColor.b - earlyNightDarkColor.b) * progress;
            }

            // arrondissement des valeurs
            r = Math.round(r);
            g = Math.round(g);
            b = Math.round(b);

            body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        } else {
            // --- Valeurs par defau quand aucune ville selectionne ---

            // Set hands to 12:00
            hourHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;
            minuteHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;
            secondHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;

            // heure digital par defaut
            timeDisplay.textContent = "--:--";

            // Sun/Moon orbit par defaut
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

            // couleur background par defaut
            body.style.backgroundColor = `rgb(22, 31, 40)`;
        }

        // Always update the city display with currentCity (either searched city or "Search for a City")
        cityDisplay.textContent = currentCity;
    }

    /*
    function BriceDeNice(bool isBricable) {
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
    */

    //Recherche de la ville dans la map
    async function searchCity() {
        const city = searchInput.value.trim();
        if (!city) {
            alert("Please enter a city name.");
            return;
        }

        // en minuscule pour ne pas etre trop sensible a la case
        let lowerCaseCity = city.toLowerCase();
        let cityData = cityToTimezoneMap[lowerCaseCity];

        if (!cityData) {
            for (const key in cityToTimezoneMap) {
                if (cityToTimezoneMap[key].displayName.toLowerCase() === lowerCaseCity) {
                    cityData = cityToTimezoneMap[key];
                    lowerCaseCity = key;
                    break;
                }
            }
        }

        if (cityData) {
            // ville trouve
            currentIANAtimezone = cityData.timezone;
            currentCity = cityData.displayName;
            isCitySearched = true;
            horlogeContainer.style.display = 'flex';

            updateClock();
            searchInput.value = ""; // vide bar de recherche
            autocompleteSuggestionsDiv.style.display = 'none'; // cache les suggestions 
        } else {
            // ville introuvable
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