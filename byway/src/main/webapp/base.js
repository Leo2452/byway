/* exported configureTripKeyForPath, getTripKeyFromUrl, setProgressBar, setLogoutLink */
/** 
* Sets Progress Bar to correct location based on the page number
* @param {int} pageNumber
*/
function setProgressBar(pageNumber){
  let ul = document.getElementById("progressbar");
  let items = ul.getElementsByTagName("li");
  for(let i=0; i < pageNumber;i++){
    items[i].className = 'active';
  }
}

function setLogoutLink(){
    fetch("/api/login").then(response => response.json()).then((login) =>{
    if (login.isLoggedIn) {
      let logoutLink = document.createElement("a");
      logoutLink.id = "logout-button";
      logoutLink.href = login.url;
      logoutLink.innerText = "LOGOUT";
      let container = document.getElementById("logout-link");
      container.append(logoutLink);
    }
  });
}

/**
 * Go through url to retrieve the trip key.
 * @return String of trip key
 */
function getTripKeyFromUrl() {
  return new URLSearchParams(location.search).get('tripKey');
}

/**
 * Uses the trip key passed in to create a modified path from
 * the path parameter. If the trip key is null, redirects the
 * user to the page where they can make a new trip and have
 * a valid trip key to reference.
 * @param {String} tripKey unique value for a trip
 * @param {String} path to send tripKey across
 * @return String of path with tripKey in query params
 */
function configureTripKeyForPath(tripKey, path) {
  if(tripKey === null) {
    // Send back to page where a trip can be made
    alert("tripKey not created! Create a new trip.");
    window.location.href = '/index.html';
    return "";
  } else {
    return path + "?" + new URLSearchParams({tripKey}).toString();
  }
}