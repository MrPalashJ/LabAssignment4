// Function to get location data and display sunrise and sunset information
function getLocation() {
    // Get elements from the DOM
    const locationInput = document.getElementById('location');
    const resultDiv = document.getElementById('result');
    // Get user-inputted location
    const location = locationInput.value;
    //  if the location is not empty
    if (location != "") {
            // Use Geocode API to get latitude and longitude for the location
    $.ajax({
        url: `https://geocode.maps.co/search?q=`+location,
        method: 'GET',
        success: function (geocodeData) {
            if(geocodeData.length != 0){
                console.log(JSON.parse(JSON.stringify(geocodeData)))
                let errorDiv = document.getElementById('errorDiv');
                errorDiv.style.display = "none";
                 const lat = geocodeData[0].lat;
                 const lon = geocodeData[0].lon;
                 var todayDate = new Date();
                 todayDate.setHours(0, 0, 0, 0); 
                 var todayDateFormatted = todayDate.toISOString().split('T')[0];
                 
                // Use Sunrise-Sunset API to get sunrise and sunset data
                $.ajax({
                    url: `https://api.sunrisesunset.io/json?lat=` + lat + `&lng=` + lon + `&date=` +todayDateFormatted,
                    method: 'GET',
                    success: function (todayData) {
                        console.log(JSON.parse(JSON.stringify(todayData)));
                        const todayResults = todayData.results;
    
                         // Calculate the date for tomorrow
                         
                         var tomorrowDate = new Date(todayDate);
                         tomorrowDate.setDate(todayDate.getDate() + 1);
                         var tomorrowDate = tomorrowDate.toISOString().split('T')[0];
                        // Use Sunrise-Sunset API to get sunrise and sunset data for tomorrow
                        $.ajax({
                            url: `https://api.sunrisesunset.io/json?lat=` + lat + `&lng=` + lon + `&date=` +tomorrowDate,
                            method: 'GET',
                            success: function (tomorrowData) {
                                console.log(JSON.parse(JSON.stringify(tomorrowData)));
                                const tomorrowResults = tomorrowData.results;
    
                                // Display results for today and tomorrow
                                displayResults(todayResults, tomorrowResults, location, lat, lon, todayDateFormatted, tomorrowDate);
                            },
                            error: function (error) {
                                showError("Error fetching tomorrow's sunrise and sunset data.");
                            }
                        });
                    },
                    error: function (error) {
                        showError("Error fetching today's sunrise and sunset data.");
                    }
                });
            }
            else{
                showError("Location not found !!")
            }
        },
        error: function (error) {
            showError("Error fetching location data.");
        }
    });
    }
    else{
        showError("Please Enter Location");
    }

}

// Function to display sunrise and sunset information
function displayResults(results, tomorrowResults,location, lat , lon, todayDate, tomorrowDate) {
    const todayBoxDiv = document.getElementById('todayBox');
    todayBoxDiv.innerHTML = `    
            <p>Sunrise: ${results.sunrise}</p>
            <p>Sunset: ${results.sunset}</p>
            <p>Dawn: ${results.dawn}</p>
            <p>Dusk: ${results.dusk}</p>
            <p>Day Length: ${results.day_length}</p>
            <p>Solar Noon: ${results.solar_noon}</p>
            <p>Time Zone: ${results.timezone}</p> `;

    const tomorrowBoxDiv = document.getElementById('tomorrowBox');
    tomorrowBoxDiv.innerHTML = `
            <p>Sunrise: ${tomorrowResults.sunrise}</p>
            <p>Sunset: ${tomorrowResults.sunset}</p>
            <p>Dawn: ${tomorrowResults.dawn}</p>
            <p>Dusk: ${tomorrowResults.dusk}</p>
            <p>Day Length: ${tomorrowResults.day_length}</p>
            <p>Solar Noon: ${tomorrowResults.solar_noon}</p>
            <p>Time Zone: ${tomorrowResults.timezone}</p>`;

    const detailsBoxDiv = document.getElementById('details');
    detailsBoxDiv.innerHTML = `
            <p>Location: ${location}</p>
            <p>Latitude: ${lat}</p>
            <p>Longitude: ${lon}</p>
            <p>Today's Date: ${todayDate}</p>
            <p>Tomorrow's Date: ${tomorrowDate}</p>`;

}

// Function to display error messages
function showError(message) {
    const errorDiv = document.getElementById('errorDiv');
    errorDiv.style.display = "block";
    errorDiv.innerHTML = `<p class="error">${message}</p>`;
}