'use strict';

if(navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
function(position){
    const {latitude} = position.coords;
    const {longitude} = position.coords;

  const coords = [latitude, longitude];
const map = L.map('map').setView(coords, 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('click', function(mapEvent) {

  const {lat, lng} = mapEvent.latlng;
  L.marker([lat, lng]).addTo(map)
    .bindPopup(
      L.popup({
           maxWidth: 250,
           minWidth: 100,
           autoClose: false,
           closeOnClick: false,
           className: 'running-popup'
    })).setPopupContent('Workout')
    .openPopup();
})

},


function (){
  alert("cound't access the coordinates");
}
);