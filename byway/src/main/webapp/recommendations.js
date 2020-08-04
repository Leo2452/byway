// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global google */

if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

let map;
let placesService;
let randomLocation;
let RADIUS = 1000; // Measured in meters
let interests = ["bank", "groceries", "park"]

/**
 * Initializes the webpage with a map, random location
 * and recommendations based on user interest.
 */
function initialize() {
  randomLocation = new google.maps.LatLng(33.4806, -112.1864);
  map = new google.maps.Map(document.getElementById('map'), {
      center: randomLocation,
      zoom: 15
  });
  placesService = new google.maps.places.PlacesService(map);
  loadRecommendations();
}

/**
 * Go through a user's interests and find places
 * fitting the interests with the textSearch method.
 */
function loadRecommendations() {
  interests.forEach(placeType => {
      console.log(placeType);
      let request = {
        location: randomLocation,
        radius: RADIUS,
        query: placeType
      };
      placesService.textSearch(request, addRecommendations);
  });
}

/**
 * Checks the response from PlacesService and creates markers
 * on the locations found from the request. Temporarily limit
 * the amount of markers added.
 * TODO: Load all results, but have a list that limits the results
 * shown rather than limiting the results being loaded.
 * @param {PlaceResults[] results} places found with PlaceResult type.
 * @param {PlacesServiceStatus status} status of PlacesService request.
 */
function addRecommendations(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    let maxRecommendations = 3;
    let numRecommendations = 0;
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].formatted_address);
      numRecommendations++;
      if(numRecommendations == maxRecommendations) {
        break;
      }
    }
  } else {
    alert("Status: " + status +
          "\nOur services are currently down. Oops!");
  }
}
