import api from '../api'

export default {

  getNowPlaying: (context) => {
    api.fetchNowPlaying()
      .then((response) => {
        context.commit('UPDATE_NOW_PLAYING', response)
      })
  },

  getGenres: (context) => {
    api.fetchGenres()
      .then((response) => {
        context.commit('UPDATE_GENRES', response)
      })
  }
}
