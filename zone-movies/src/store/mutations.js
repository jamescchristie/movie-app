export default {
  UPDATE_NOW_PLAYING: (state, movies) => {
    state.nowPlaying = movies
  },

  UPDATE_GENRES: (state, genres) => {
    state.genres = genres
  }
}
