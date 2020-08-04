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


// copies of recommendations and selected stops, stored as arrays
// for synchronous updating
let recs = [];
let stops = [];

if (document.readyState === 'loading') {  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', load);
} else {  // `DOMContentLoaded` has already fired
  load();
}

/** Used to restore stops and recommendations upon load or refresh */
function load(){
  getRecsOnload();
  getStopsOnload();
}

function initMap() {
  let directionsService = new google.maps.DirectionsService();
  let directionsRenderer = new google.maps.DirectionsRenderer();
  let start = new google.maps.LatLng(37.7699298, -122.4469157);
  let end = new google.maps.LatLng(37.7683909618184, -122.51089453697205);
  let mapOptions = {
    zoom: 14,
    center: start
  }
  let map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsRenderer.setMap(map);
  document.getElementById("route").addEventListener("click", function() {
    calcRoute(directionsService, directionsRenderer, start, end);
  });
}


/** Displays route overtop the map */
function calcRoute(directionsService, directionsRenderer, start, end) {
  let request = {
    origin:  start,
    destination: end,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(response);
    } else {
      window.alert("Could not calculate route due to: " + status);
    }
  });
}

/** Clear the stops panel in the html */
function clearStops(){
  const stopList = document.getElementById('stop-list');
  if(stopList != null){
    stopList.innerText = ""; // clear list
  }
}

/** Render stop list  */
function renderStops(stop, fromDatastore){
  const stopList = document.getElementById('stop-list');
  // add to stop array in the js 
  if(fromDatastore){
    stops.push(stop);
  }
  let btn = document.createElement('button');
  btn.id = stop.id;
  btn.innerText = stop.placename;
  btn.className =  "btn rec-btn";
  btn.addEventListener("click", function() {
    deleteFromStops(stop); 
  });
  stopList.appendChild(btn);
}

/** Get the new list of stops from datastore onload */
function getStopsOnload(){
  clearStops();
  fetch('/api/stop')
  .then(response => response.json())
  .then((stopsResponse) => {
    stopsResponse.forEach((stop)=>{
      renderStops(stop, true);
    });
  })
}

/** Get the new list of stops locally */
function getStopsList(){
  clearStops();
  // re-render list synchronously
  stops.forEach((stop)=>{
    renderStops(stop, false);
  })
}

/** Add stop locally and to datastore */
function addToStops(stop){
  deleteFromRecs(stop); 
  // add to stops array locally in js
  stops.push(stop);
  getStopsList();

  // add to datastore
  const params = new URLSearchParams();
  params.append("text", stop.placename);
  params.append("action", "add");
  fetch('/api/stop', {method: 'POST', body: params});
}

/** Delete stop locally and from datastore*/
function deleteFromStops(stop){
  addToRecs(stop); 
  console.log("delete " + stop.placename);
  // delete from stops array locally in js
  stops = stops.filter(function(stopObj){
    return stopObj.placename != stop.placename;
  })
  getStopsList();

  // delete from datastore
  const params = new URLSearchParams();
  params.append("text", stop.placename);
  params.append("action", "remove");
  fetch('/api/stop', {method: 'POST', body: params});
}

/** Clear the recommendations panel in the html */
function clearRecs(){
  const recList = document.getElementById('rec-list');
  if(recList != null){
    recList.innerText = ""; // clear list
  }
}

/** Render recommendations list */
function renderRecs(rec, fromDatastore){
  const recsList = document.getElementById('rec-list');
  // populate local js array initially
  if(fromDatastore){
    recs.push(rec);
  }
  var btn = document.createElement('button');
  btn.id = rec.id;
  btn.innerText = rec.placename;
  btn.className =  "btn rec-btn";
  btn.addEventListener("click", function() {
    addToStops(rec); 
  });
  recsList.appendChild(btn);
}

/** Get the new list of recommendations from servlet onload */
function getRecsOnload() {
  clearRecs();
  fetch('/api/recs')
  .then(response => response.json())
  .then((recommendations) => {
    recommendations.forEach((rec)=>{
      renderRecs(rec, true);
    })
  })
}

/** Get the new list of recommendations locally */
function getRecsList(){
  clearRecs();
  // re-render list synchronously
  recs.forEach((rec)=>{
      renderRecs(rec, false);
  })
}

/** Add recommendation locally*/
function addToRecs(rec){
  recs.push(rec);
  getRecsList();
  const params = new URLSearchParams();
  params.append("text", rec.placename);
}

/** Delete recommendation locally */
function deleteFromRecs(rec){
  recs = recs.filter(function(r){
    return r.placename != rec.placename;
  })
  getRecsList();
}

/* exported initMap */
/* global google */

