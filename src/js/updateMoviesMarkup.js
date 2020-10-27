import movieCardTemplate from '../templates/movieCard.hbs';
import refs from './refs';

const updateMoviesMarkup = {
  show(movies) {
    const markup = movieCardTemplate(movies);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
  },
  reset() {
    refs.gallery.innerHTML = '';
  }
};

export default updateMoviesMarkup;