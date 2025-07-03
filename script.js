'use strict';

const form = document.querySelector('.form')
const containerWorkout = document.querySelector('.workouts')
const inputDistance = document.querySelector('.form__input--distance')
const inputType = document.querySelector('.form__input--type')
const inputCadence = document.querySelector('.form__input--cadence')
const inputElevation = document.querySelector('.form__input--elevation')
const inputDuration = document.querySelector('.form__input--duration')

let map, mapEvent;

//Loading the map
if(navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
function(position){
    const {latitude} = position.coords;
    const {longitude} = position.coords;

  const coords = [latitude, longitude];
   map = L.map('map').setView(coords, 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//handling click events
map.on('click', function(mapE) {
  mapEvent = mapE
   form.classList.remove('hidden')
   inputDistance.focus()

})
},


function (){
  alert("cound't access the coordinates");
}
);

//display marker
form.addEventListener('submit',  function(e){
  e.preventDefault()

  inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = ''
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

//handling type of workouts
inputType.addEventListener('change', function() {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
})