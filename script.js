'use strict';

const form = document.querySelector('.form')
const containerWorkout = document.querySelector('.workouts')
const inputDistance = document.querySelector('.form__input--distance')
const inputType = document.querySelector('.form__input--type')
const inputCadence = document.querySelector('.form__input--cadence')
const inputElevation = document.querySelector('.form__input--elevation')
const inputDuration = document.querySelector('.form__input--duration')


class App {
  #map;
  #mapEvent;
  constructor () {
     this._getPosition()
    form.addEventListener('submit',this._newWorkout.bind(this))
    inputType.addEventListener('change',this._toggleElevationField)
  }
    //Loading the map
  _getPosition() {
    if(navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function (){
      alert("cound't access the coordinates");
    }
    );
  }


  _loadMap(position) {
    
      const {latitude} = position.coords;
      const {longitude} = position.coords;
  
    const coords = [latitude, longitude];
     this.#map = L.map('map').setView(coords, 13);
  
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.#map);
  
  //handling click events
  this.#map.on('click', this._showForm.bind(this))
  
    }
  
  _showForm(mapE) {
    this.#mapEvent = mapE
    form.classList.remove('hidden')
    inputDistance.focus()
  }

  _toggleElevationField() {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
  }

  _newWorkout (e) {
    e.preventDefault()

  inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = ''
  const {lat, lng} = this.#mapEvent.latlng;
  L.marker([lat, lng]).addTo(this.#map)
    .bindPopup(
      L.popup({
           maxWidth: 250,
           minWidth: 100,
           autoClose: false,
           closeOnClick: false,
           className: 'running-popup'
    })).setPopupContent('Workout')
    .openPopup();
  }
}


const app = new App();


