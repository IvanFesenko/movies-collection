import 'basiclightbox/dist/basicLightbox.min.css';
import * as basicLightbox from 'basiclightbox';
import moviesService from './APIService/moviesAPI-service';
import globalVars from './globalVars/vars';
import updateMoviesMarkup from './updateMoviesMarkup';
import modalOptions from './components/modal/modalOptions';
import lazyLoad from './components/observers/lazyLoad';
import Loader from './components/Loader';
import searchErrorNotFound from './components/notifyErrors';
import {
  checkMovieHandler,
  closeModalEscapeHandler,
} from './components/modal/modalListener';

const loader = new Loader('.js-loader', 'is-hidden');
const fetchedMoviesHandler = (queryType) => {
  const getMovies = async () => {
    return queryType === 'search'
      ? moviesService.fetchMovies()
      : moviesService.fetchPopularMovies();
  };

  // eslint-disable-next-line no-shadow
  const getTrailerFromID = async (queryType) => {
    const url = 'https://www.youtube.com/watch?v=';
    const response = await moviesService.fetchForTrailer(queryType);
    const key = await response.results[0].key;
    return `${url}${key}`;
  };
  // eslint-disable-next-line no-shadow
  const getMovieFromID = async (queryType) => {
    return moviesService.fetchForID(queryType);
  };

  (function () {
    if (queryType === 'search' || queryType === 'popular') {
      loader.show();
      getMovies()
        .then((moviesArr) => {
          const movies = moviesArr ?? [];
          console.log('movies:', movies);
          if (movies.length) {
            globalVars.moviesArr = [...globalVars.moviesArr, ...movies];
            console.log('moviesArr: ', globalVars.moviesArr);
            updateMoviesMarkup.show(movies);
            lazyLoad();
          }
        })
        .catch((err) => {
          searchErrorNotFound(err);
          globalVars.searchQuery = '';
        })
        .finally(() => {
          loader.hide();
        });
      return;
    }
    getTrailerFromID(queryType).then((trailerLink) =>
      console.log('trailerLink:', trailerLink)
    );
    getMovieFromID(queryType)
      .then((movie) => {
        globalVars.currentMovie = movie;
        const instance = basicLightbox.create(
          updateMoviesMarkup.showModalTemplate(movie),
          modalOptions
        );
        instance.show();
        window.addEventListener('keydown', closeModalEscapeHandler);
        document.addEventListener('click', closeModalEscapeHandler);
        document.addEventListener('click', checkMovieHandler);
      })
      .finally(() => {});
  })();
};

export default fetchedMoviesHandler;
