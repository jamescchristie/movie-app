const axios = require('axios')
const apiRoot = 'https://api.themoviedb.org/3'
let nowPlaying = []
let genres = []

const fetchNowPlaying = async () => {
  // create our api URL
  let url = `${apiRoot}/movie/now_playing?region=GB&page=`
  return await makePagingCall(url, nowPlaying, 'results')
}

const fetchGenres = async () => {
  // create our api URL
  let url = `${apiRoot}/genre/movie/list?page=`
  return await makePagingCall(url, genres, 'genres')
}

const makePagingCall = async (api, data, prop) => {
  let keepGoing = true
  let page = 1

  while (keepGoing) {
    // append the API key
    let url = api + page
    url = addAPIKey(url)
    let response = await axios.get(url)
    response = response.data
    // store the result
    data = data.concat(response[prop])

    // increment our page counter
    page++

    // are there pages left?
    if (!response.total_pages || response.total_pages < page) {
      // kill the loop
      keepGoing = false

      // return our results
      return data
    }
  }
  return data.data
}

const addAPIKey = (url) => {
  const apiKey = 'ec60708aea6f25491324e09cab619d5a'
  return url + '&api_key=' + apiKey
}

export default {
  fetchNowPlaying,
  fetchGenres
}
