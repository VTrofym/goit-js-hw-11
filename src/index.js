import './css/styles.css';
import { BASE_URL, getPhoto, itemPerPage } from './api/webApi';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const moreBtn = document.querySelector('.load-more');

let page = 1;
let searchValue = '';

let lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });

const totalPages = Math.ceil(500 / itemPerPage);

formEl.addEventListener('submit', onSubmit);

async function loadMoreCards(searchValue) {
  page += 1;
  const data = await getPhoto(searchValue, page);
  const galleryMarkup = createGalleryMarkup(data.hits);
  galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);
  if (page === totalPages) {
  // moreBtn.classList.add('visually-hidden');
  addClass('visually-hidden');
  }
  lightbox.refresh()
}

function onSubmit(event) {
  event.preventDefault();
  clearMarkup(galleryEl);
  searchValue = event.currentTarget[0].value;
  mountData(searchValue);
}

async function mountData(searchValue) {
  try {
    const data = await getPhoto(searchValue, page);

    console.log('data', data);

    const moreBtnClbk = () => {
      loadMoreCards(searchValue);
    }
    // moreBtn.classList.remove('visually-hidden');
    moreBtn.removeEventListener('click', moreBtnClbk);
    moreBtn.addEventListener('click', moreBtnClbk);
    
    if (data.hits.length === 0) {
      moreBtn.classList.add('visually-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images., 500`);
    const galleryMarkup = createGalleryMarkup(data.hits);
    galleryEl.insertAdjacentHTML('beforeend', galleryMarkup);   
  } catch (error) {
    console.log('error', error);
  }
}

function createGalleryMarkup(photoArr) {
  return photoArr.map(({ webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads
  }) =>
    `<div class="photo-card">
    <a class='link-img' href=${largeImageURL}><img src=${webformatURL} alt=${tags} loading="lazy" class="card-img"/></a>
  <div class="info">
    <p class="info-item">
      <b class="info-label">Likes </b><span class="info-span">${likes}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Views </b><span class="info-span">${views}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Comments </b><span class="info-span">${comments}</span>
    </p>
    <p class="info-item">
      <b class="info-label">Downloads </b><span class="info-span">${downloads}</span>
    </p>
  </div>
</div>`).join(''); 
}

function clearMarkup(element) {
  element.innerHTML = '';
}

moreBtn.classList.add('visually-hidden');

function updateGallery() {
  galleryEl.insertAdjacentHTML('beforeend', )
}