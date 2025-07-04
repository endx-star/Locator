'use strict';


class Workout {
  date = new Date();
  id = (Date.now() + '' + Math.floor(Math.random() * 10000));
  constructor(coords, distance, duration) {
    this.coords = coords  // [39, -12]
    this.distance = distance  //km
    this.duration = duration  //min
  }

  _setDescription () {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]}${this.date.getDate()}`
  }
}

class Running extends Workout {
  type = 'running'

  constructor (coords, distance, duration, cadence) {
    super(coords, distance, duration)
    this.cadence = cadence
    this._setDescription()
  }
  
  calcPace () {
   this.pace = this.duration /this.cadence
   return this.cadence
  }
}

class Cycling extends Workout {
  type = 'cycling'

  constructor (coords, distance, duration, elevationGain) {
    super(coords, distance, duration)
    this.elevationGain = elevationGain
    this._setDescription()
  }
   
  calcSpeed () {
    this.speed = this.distance/(this.duration / 60)
    return this.speed
  }
}

const form = document.querySelector('.form')
const containerWorkout = document.querySelector('.workouts')
const inputDistance = document.querySelector('.form__input--distance')
const inputType = document.querySelector('.form__input--type')
const inputCadence = document.querySelector('.form__input--cadence')
const inputElevation = document.querySelector('.form__input--elevation')
const inputDuration = document.querySelector('.form__input--duration')


//////////////////////////////////////////////////////////////////
/// App Architecture
class App {
  #map;
  #mapEvent;
  #mapZoomLevel = 13;
  #workouts = [];
  constructor () {
     this._getPosition()
     this._getLocalStorage()

    form.addEventListener('submit',this._newWorkout.bind(this))
    inputType.addEventListener('change',this._toggleElevationField)
    containerWorkout.addEventListener('click', this._moveToPopup.bind(this))
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
     this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
  
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.#map);
  
  //handling click events
  this.#map.on('click', this._showForm.bind(this))

  this.#workouts.forEach(work => {
    this._renderMarkoutMarker(work)
  })
  
    }
  
  _showForm(mapE) {
    this.#mapEvent = mapE
    form.classList.remove('hidden')
    inputDistance.focus()
  }

  _hideForm(){
    inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = ''
    
    form.style.display = 'none'
    form.classList.add('hidden')
    setTimeout(() => form.style.display = 'grid', 1000)
  }

  

  _toggleElevationField() {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
  }

  _newWorkout (e) {
    const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp))
    const allPositive = (...inputs) => inputs.every(inp => inp > 0)
   
    e.preventDefault()

    //Get data from form
    const type = inputType.value
    const distance = +inputDistance.value
    const duration = +inputDuration.value
    const {lat, lng} = this.#mapEvent.latlng;

    let workout;
    
    //If workout running, create running object
    if(type === "running"){
      const cadence = +inputCadence.value
      //Check if data is valid
      if(!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence))
        return alert('Inputs must be positive number')
     
     workout = new Running([lat, lng], distance, duration, cadence)
     workout.calcPace();
    }

    //If workout cycling, create cycling object
    if(type === "cycling"){
      const elevationGain = +inputElevation.value

      //Check if data is valid
      if(!validInputs(distance, duration, elevationGain) || !allPositive(distance, duration))
        return alert('Inputs must be positive number')

      workout = new Cycling([lat, lng], distance, duration, elevationGain)
      workout.calcSpeed();
    }
    //Add new object to workout array
    this.#workouts.push(workout)

    console.log(workout)

   //Render workout on map as marker
    this._renderMarkoutMarker(workout)

    //Render workout on the list
    this._renderWorkout(workout)

    //Hide form + clear input fields
    this._hideForm()
 
    //set localStorage
    this._setLocalStorage()
  }

  _renderMarkoutMarker(workout) {
    L.marker(workout.coords).addTo(this.#map)
    .bindPopup(
      L.popup({
           maxWidth: 250,
           minWidth: 100,
           autoClose: false,
           closeOnClick: false,
           className: `${workout.type}-popup`
    })).setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
    .openPopup();
  }

  _renderWorkout (workout) {
   let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${ workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️' } </span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
   `;
   if(workout.type === 'running')
   html += `
     <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
   `;

   if(workout.type === 'cycling')
    html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
   `

   form.insertAdjacentHTML('afterend', html)
  }

  _moveToPopup (e) {
    const workoutEl = e.target.closest('.workout');
    if(!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    if (!workout) return;

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      }
    });
  }

  _setLocalStorage () {
     localStorage.setItem('workouts', JSON.stringify(this.#workouts))
  }

  _getLocalStorage () {
    const data = JSON.parse(localStorage.getItem('workouts'))

    if(!data) return
    this.#workouts = data

    this.#workouts.forEach(work => {
      this._renderWorkout(work)
    })
  }

  reset() {
    localStorage.removeItem('workouts')
    location.reload()
  }
}


const app = new App();


