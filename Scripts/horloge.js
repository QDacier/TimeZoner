document.addEventListener('DOMContentLoaded', (event) => {
    // Get references to the DOM elements
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

    // --- Global Variables for Time and Location ---
    let currentCity = "Search for a City";
    let currentTimezoneOffset = 0; // Default to UTC, treated as 0 hours offset
    let isCitySearched = false; // Flag to track if a city has been successfully searched

    // Function to update the clock hands and display
    function updateClock() {
        const now = new Date(); // Get current date and time in local computer's timezone
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const utcSeconds = now.getUTCSeconds();

        // Calculate time for the selected timezone based on the current offset
        let localHours = (utcHours + currentTimezoneOffset + 24) % 24;
        const localMinutes = utcMinutes;
        const localSeconds = utcSeconds;

        // --- Calculate Rotation Angles for Hands (CONDITIONAL) ---
        let secondDegrees, minuteDegrees, hourDegrees;

        if (isCitySearched) { // Only calculate and move hands based on searched city's time
            secondDegrees = localSeconds * 6;
            minuteDegrees = (localMinutes * 6) + (localSeconds * 0.1);
            hourDegrees = (localHours * 30) + (localMinutes * 0.5);
        } else { // Default to 12:00:00 (all hands pointing straight up) when no city is searched
            secondDegrees = 0;
            minuteDegrees = 0;
            hourDegrees = 0;
        }

        // Apply Rotations to Hands (include translation for centering)
        hourHand.style.transform = `translate(-50%, -100%) rotate(${hourDegrees}deg)`;
        minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteDegrees}deg)`;
        secondHand.style.transform = `translate(-50%, -100%) rotate(${secondDegrees}deg)`;

        // --- Update Digital Time Display (CONDITIONAL) ---
        if (isCitySearched) {
            const formattedHours = String(localHours).padStart(2, '0');
            const formattedMinutes = String(localMinutes).padStart(2, '0');
            timeDisplay.textContent = `${formattedHours}:${formattedMinutes}`;
        } else {
            timeDisplay.textContent = "--:--"; // Ensure it remains default
        }

        // --- Update City Display ---
        cityDisplay.textContent = currentCity;

        // --- Control Sun and Moon Orbit (CONDITIONAL) ---
        let sunOrbitAngle, moonOrbitAngle;
        const orbitRadius = 180;

        if (isCitySearched) { // Animate sun/moon based on searched city's time
            const totalMinutesOfDay = localHours * 60 + localMinutes;
            const totalSecondsOfDay = totalMinutesOfDay * 60 + localSeconds;
            // orbitProgressDegrees: 0 at 00:00, 90 at 06:00, 180 at 12:00, 270 at 18:00
            const orbitProgressDegrees = (totalSecondsOfDay / (24 * 3600)) * 360;

            // Calculates sunOrbitAngle in YOUR system (0=Right, 90=Top, 180=Left, 270=Bottom, CCW)
            sunOrbitAngle = (orbitProgressDegrees - 90 + 360) % 360;
            moonOrbitAngle = (sunOrbitAngle + 180) % 360; // Moon is always opposite the sun

            // Calculate the final rotation angle for the CSS transform using translateX for radial positioning.
            // This converts your (0=Right, 90=Top, CCW) angle to the (0=Right, 90=Bottom, CW) angle needed by rotate() + translateX().
            const finalRotateSunAngle = (-sunOrbitAngle + 360) % 360;
            const finalRotateMoonAngle = (-moonOrbitAngle + 360) % 360;

            // Apply the transform.
            // 1. translate(-50%, -50%): Centers the element itself.
            // 2. rotate(finalRotateAngle): Rotates the element's coordinate system to the desired angle.
            //    (0=Right, 90=Bottom, 180=Left, 270=Top, CW)
            // 3. translateX(orbitRadius): Moves the element outwards along its now-rotated X-axis.
            // 4. rotate(-finalRotateAngle): Counter-rotates the element itself to keep its icon upright.
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

        // --- Day/Night Background Color Change (CONDITIONAL) ---
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

    // --- Search Functionality ---
    async function searchCity() {
        const city = searchInput.value.trim();
        if (!city) {
            alert("Please enter a city name.");
            return;
        }

        const mockTimezones = {
            "quebec city": -4,
            "montreal": -4,
            "toronto": -4,
            "vancouver": -7,
            "london": 1,
            "paris": 2,
            "tokyo": 9,
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
            isCitySearched = true; // Set flag to true on successful search

            horlogeContainer.style.display = 'flex'; // Make the clock visible

            updateClock(); // Update clock with new city's time immediately
            searchInput.value = ''; // Clear search input
        } else {
            alert(`Could not find timezone for "${city}". Please try a different city or ensure it's in our mock list.`);
            isCitySearched = false; // Ensure flag is false if search fails
            horlogeContainer.style.display = 'none'; // Re-hide clock if search fails after being visible
            cityDisplay.textContent = "Search for a City"; // Reset text
            timeDisplay.textContent = "--:--"; // Reset time display

            // Reset hands to default 12:00 position when search fails (include translation)
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
    horlogeContainer.style.display = 'none'; // Ensure clock is hidden on initial load
    isCitySearched = false; // Explicitly set to false at start

    // Initial call to updateClock to set hands to 12:00 and digital display to --:--
    updateClock(); // This will use the default isCitySearched=false logic

    // Set the interval to keep the clock running.
    // TEMPORARY: Set to 100ms for rapid visual feedback. Change back to 1000ms later.
    setInterval(updateClock, 1000);
});