document.addEventListener('DOMContentLoaded', (event) => {
    // DOM
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

    // ------------------- Global Variables for Time and Location -------------------
    let currentCity = "Nom de ville";
    let currentTimezoneOffset = 0;
    let isCitySearched = false;

    // Function to update the clock hands and display
    function updateClock() {
        const now = new Date();
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const utcSeconds = now.getUTCSeconds();

        // Calcule du temps en fonction de la zone
        let localHours = (utcHours + currentTimezoneOffset + 24) % 24;
        const localMinutes = utcMinutes;
        const localSeconds = utcSeconds;

        // ------------------- calcule rotation des aiguilles -------------------
        let secondDegrees, minuteDegrees, hourDegrees;

        if (isCitySearched) {
            secondDegrees = localSeconds * 6;
            minuteDegrees = (localMinutes * 6) + (localSeconds * 0.1);
            hourDegrees = (localHours * 30) + (localMinutes * 0.5);
        } else {
            secondDegrees = 0;
            minuteDegrees = 0;
            hourDegrees = 0;
        }

        hourHand.style.transform = `translate(-50%, -100%) rotate(${hourDegrees}deg)`;
        minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteDegrees}deg)`;
        secondHand.style.transform = `translate(-50%, -100%) rotate(${secondDegrees}deg)`;

        // ------------------- Update heure digital -------------------
        if (isCitySearched) {
            const formattedHours = String(localHours).padStart(2, '0');
            const formattedMinutes = String(localMinutes).padStart(2, '0');
            timeDisplay.textContent = `${formattedHours}:${formattedMinutes}`;
        } else {
            timeDisplay.textContent = "--:--";
        }

        // ------------------- Update la ville -------------------
        cityDisplay.textContent = currentCity;

        // ------------------- Controle le soleil et la lune en orbite -------------------
        let sunOrbitAngle, moonOrbitAngle;
        const orbitRadius = 180;

        if (isCitySearched) { // Animate sun/moon based on searched city's time
            const totalMinutesOfDay = localHours * 60 + localMinutes;
            const totalSecondsOfDay = totalMinutesOfDay * 60 + localSeconds;
            const orbitProgressDegrees = (totalSecondsOfDay / (24 * 3600)) * 360;

            sunOrbitAngle = (orbitProgressDegrees - 90 + 360) % 360;
            moonOrbitAngle = (sunOrbitAngle + 180) % 360;

            // Calcule la rotation du solei let de la lne avec css
            const finalRotateSunAngle = (-sunOrbitAngle + 360) % 360;
            const finalRotateMoonAngle = (-moonOrbitAngle + 360) % 360;

            sun.style.transform = `translate(-50%, -50%) rotate(${finalRotateSunAngle}deg) translateX(${orbitRadius}px) rotate(${-finalRotateSunAngle}deg)`;
            moon.style.transform = `translate(-50%, -50%) rotate(${finalRotateMoonAngle}deg) translateX(${orbitRadius}px) rotate(${-finalRotateMoonAngle}deg)`;

        } else { // Sun/Moon orbit for default (UTC) when no city searched
             const totalSecondsOfDayUTC = (utcHours * 3600) + (utcMinutes * 60) + utcSeconds;
             const orbitProgressDegreesUTC = (totalSecondsOfDayUTC / (24 * 3600)) * 360;

             // Calculates sunOrbitAngle in YOUR system (0=Right, 90=Top, etc. CCW)
             sunOrbitAngle = (orbitProgressDegreesUTC - 90 + 360) % 360;
             moonOrbitAngle = (sunOrbitAngle + 180) % 360;

             // Calculate the final rotation angle for the CSS transform using translateX for radial positioning.
             const finalRotateSunAngle = (-sunOrbitAngle + 360) % 360;
             const finalRotateMoonAngle = (-moonOrbitAngle + 360) % 360;

             sun.style.transform = `translate(-50%, -50%) rotate(${finalRotateSunAngle}deg) translateX(${orbitRadius}px) rotate(${-finalRotateSunAngle}deg)`;
             moon.style.transform = `translate(-50%, -50%) rotate(${finalRotateMoonAngle}deg) translateX(${orbitRadius}px) rotate(${-finalRotateMoonAngle}deg)`;
        }

        // ------------------- Day/Night Background Color Change -------------------
        if (isCitySearched) { // Change background based on local time if a city is searched
            let r, g, b;
            // Define colors for day and night transitions
            const dayColor = { r: 52, g: 73, b: 94 }; // Dark Blueish (early morning)
            const midDayColor = { r: 255, g: 255, b: 255 }; // Whiteish (mid-day peak)
            const eveningColor = { r: 255, g: 140, b: 0 }; // Dark Orange (sunset)
            const nightColor = { r: 44, g: 62, b: 80 }; // Very dark blueish (deep night)

            if (localHours >= 6 && localHours < 12) { // Morning: Dark blueish to Whiteish (6 AM to 12 PM)
                const progress = (localHours - 6 + localMinutes / 60) / 6; // 0 to 1 over 6 hours
                r = dayColor.r + (midDayColor.r - dayColor.r) * progress;
                g = dayColor.g + (midDayColor.g - dayColor.g) * progress;
                b = dayColor.b + (midDayColor.b - dayColor.b) * progress;
            } else if (localHours >= 12 && localHours < 18) { // Afternoon: Whiteish to Orange (12 PM to 6 PM)
                const progress = (localHours - 12 + localMinutes / 60) / 6; // 0 to 1 over 6 hours
                r = midDayColor.r + (eveningColor.r - midDayColor.r) * progress;
                g = midDayColor.g + (eveningColor.g - midDayColor.g) * progress;
                b = midDayColor.b + (eveningColor.b - midDayColor.b) * progress;
            } else if (localHours >= 18 && localHours < 24) { // Evening/Night: Orange to Dark Blue (6 PM to 12 AM)
                const progress = (localHours - 18 + localMinutes / 60) / 6; // 0 to 1 over 6 hours
                r = eveningColor.r + (nightColor.r - eveningColor.r) * progress;
                g = eveningColor.g + (nightColor.g - eveningColor.g) * progress;
                b = eveningColor.b + (nightColor.b - eveningColor.b) * progress;
            } else { // Night/Early Morning: Dark Blue to Dark Blueish (12 AM to 6 AM)
                const progress = (localHours + localMinutes / 60) / 6; // 0 to 1 over 6 hours
                r = nightColor.r + (dayColor.r - nightColor.r) * progress;
                g = nightColor.g + (dayColor.g - nightColor.g) * progress;
                b = nightColor.b + (dayColor.b - nightColor.b) * progress;
            }

            // Ensure values are within 0-255 range and apply
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
            horlogeBG.style.backgroundColor = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.1)`;
        } else {
            // Keep a default background color when no city is searched
            horlogeBG.style.backgroundColor = `rgba(255, 255, 255, 0.1)`;
        }
    }

    // ------------------- recherche -------------------
    async function searchCity() {
        const city = searchInput.value.trim();
        if (!city) {
            alert("Please enter a city name.");
            return;
        }

        const mockTimezones = {
            "québec": -4,
            "washington": -4,
            "montréal": -4,
            "toronto": -4,
            "vancouver": -7,
            "londres": 1,
            "rabat": 1,
            "paris": 2,
            "tokyo": 9,
            "bruxelles": 2,
            "new york": -4,
            "los angeles": -7,
            "sydney": 10,
            "dubai": 4,
            "delhi": 5.5
        };

        const lowerCaseCity = city.toLowerCase();
        if (mockTimezones.hasOwnProperty(lowerCaseCity)) {
            currentTimezoneOffset = mockTimezones[lowerCaseCity];
            currentCity = city;
            isCitySearched = true;
            horlogeContainer.style.display = 'flex';

            updateClock();
            searchInput.value = '';
        } else {
            alert(`La ville "${city}" est introuvable dans ma liste`);
            isCitySearched = false;
            horlogeContainer.style.display = 'none';
            cityDisplay.textContent = "Cherche une ville";
            timeDisplay.textContent = "--:--";

            // Reset les aiguilles 12:00
            hourHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;
            minuteHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;
            secondHand.style.transform = `translate(-50%, -100%) rotate(0deg)`;
            horlogeBG.style.backgroundColor = `rgba(255, 255, 255, 0.1)`; // Reset background color
        }
    }

    // Event Listeners for Search
    searchButton.addEventListener('click', searchCity);
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission
            searchCity();
        }
    });

    // --- Initial state setup ---
    cityDisplay.textContent = "Search for a City";
    timeDisplay.textContent = "--:--";
    horlogeContainer.style.display = 'none';
    isCitySearched = false;

    // Initial call to updateClock to set hands to 12:00 and digital display to --:--
    updateClock();
    setInterval(updateClock, 1000);
});