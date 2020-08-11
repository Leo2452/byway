window.onload = function(){
  fetch('/entity');
  document.getElementById('create-trip').addEventListener('click', () => {
    fetch('/entity', {method: 'POST'}).then((response) => response.json()).then((tripKey) =>{
      window.location.href = '/destinations.html?tripKey=' + tripKey;  
    });
  });
}