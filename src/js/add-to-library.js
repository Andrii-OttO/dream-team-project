import refs from './refs';
import modalMarkup from './modal.js';
import API from './api/API';
import { renderGallery } from './render-gallery'
const fetchData = new API();
const { modalFilmEl,galleryList, mainWarning } = refs;
let currentFilm;

modalFilmEl.addEventListener('click', (e) => {
  if (!e.target.classList.contains('modal_btn_wotched') && e.target.classList.contains('watched')) {
    const id = e.target.id;
    const posterImg = e.target.getAttribute('data-poster');
    getData(id, posterImg, 'remove-watched');
    // removeToStore('watched')
    e.target.classList.add('modal_btn_wotched');
    e.target.textContent = 'ADD TO WATCH';
    addWarningDiv()
    return;
  }
  if (!e.target.classList.contains('modal_btn_queue') && e.target.classList.contains('queue')) {
    const id = e.target.id;
    const posterImg = e.target.getAttribute('data-poster');
    getData(id, posterImg, 'remove-queue');
    e.target.classList.add('modal_btn_queue');
    e.target.textContent = 'ADD TO QUEUE';
    addWarningDiv()
    return;
  }
  if (e.target.classList.contains('modal_btn_wotched') && e.target.classList.contains('watched')) {
    const buttonWatchedEl = e.target;
    const id = e.target.id;
    const posterImg = e.target.getAttribute('data-poster');
    getData(id, posterImg, 'watched');
    if (localStorage.getItem('watched')) {
      buttonWatchedEl.textContent = 'REMOVE FROM WATCHED';
    } else {
      buttonWatchedEl.textContent = 'ADD TO WATCHED';
    }
    e.target.classList.remove('modal_btn_wotched');
  }
  if (e.target.classList.contains('modal_btn_queue')) {
    const buttonWatchedEl = e.target;
    const id = e.target.id;
    const posterImg = e.target.getAttribute('data-poster');
    getData(id, posterImg, 'queue');
    if (localStorage.getItem('watched')) {
      buttonWatchedEl.textContent = 'REMOVE FROM QUEUE';
    } else {
      buttonWatchedEl.textContent = 'ADD TO QUEUE';
    }
    e.target.classList.remove('modal_btn_queue');
  }
});

async function getData(id, poster, variable) {
  const getData = await fetchData.getDescriptionMovie(id).then(r => r);
  // getData.poster_path = poster;
  if (variable === 'watched') {
    addToLibrary(getData);
  }
  if (variable === 'queue') {
    addToQueue(getData);
  }
  if (variable === 'remove-watched') {
    removeToStore(getData, 'watched');
  }
  if (variable === 'remove-queue') {
    removeToStore(getData, 'queue');
  }
}


function addToLibrary(data) {
  currentFilm = data;
  currentFilm.newGenres = JSON.stringify(currentFilm.genres);
  const currentMovie = localStorage.getItem('watched');
  const NextMovie = JSON.parse(currentMovie);
  NextMovie.push(currentFilm);
  localStorage.setItem('watched', JSON.stringify(NextMovie));
}

function addToQueue(data) {
  currentFilm = data;
  currentFilm.newGenres = JSON.stringify(currentFilm.genres);
  const currentMovie = localStorage.getItem('queue');
  const NextMovie = JSON.parse(currentMovie);
  NextMovie.push(currentFilm);
  localStorage.setItem('queue', JSON.stringify(NextMovie));
}

function removeToStore(data, storage) {
  currentFilm = data;
  const currentMovie = localStorage.getItem(storage);
  const NextMovie = JSON.parse(currentMovie);
  const UpdateMovie = NextMovie.filter(e => e.id !== currentFilm.id);
  localStorage.setItem(storage, JSON.stringify(UpdateMovie));
  if(localStorage.getItem('page') === 'library'){
    galleryList.innerHTML = '';
    const data = JSON.parse(localStorage.getItem(storage));
    renderGallery(data,galleryList,'library')
  }
}

function addWarningDiv(){
  const page = localStorage.getItem('page')
  if (page === 'library' && galleryList.childNodes.length <= 2) {
    mainWarning.classList.remove('hidden');
  }
}