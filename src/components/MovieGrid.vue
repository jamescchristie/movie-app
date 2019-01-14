<template>
  <div class="root">
    <b-container fluid>
      <b-row class="my-1">
        <b-col sm="3" v-for="movie in movieList" :key="movie.id">
          <b-card
            :title="movie.title"
            :img-src="movieImage(movie.poster_path)"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2"
          >
            <p class="card-text">{{movie.overview}}</p>
            <b-row>
              <b-col sm-3>
                <label>Rating:
                  <b-badge variant="primary">{{movie.vote_average}}</b-badge>
                </label>
              </b-col>
              <b-col sm-3>
                <label>Popularity:
                  <b-badge variant="primary">{{movie.popularity | popRound}}</b-badge>
                </label>
              </b-col>
            </b-row>
            <b-row align-h="center">
              <b-badge
                class="genreBadge"
                v-for="genre in movie.genre_ids"
                :key="genre"
                variant="info"
              >{{genreLabel(genre)}}</b-badge>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { EventBus } from '../event-bus'
import { mapGetters } from 'vuex'
import FilterEvent from '../events/FilterEvent'

export default {
  name: 'MovieGrid',
  data () {
    return {
      currentRating: 3,
      currentFilter: 'allMovies',
      currentGenres: [],
      genreLookup: {}
    }
  },

  computed: {
    ...mapGetters({
      nowPlaying: 'nowPlaying',
      genres: 'genres'
    }),
    movieList () {
      // ensure our movies are always sorted by popularity
      this.sortMovies()
      let self = this

      // apply all our rating and genre filters
      return self.nowPlaying.filter((movie) => {
        return movie.vote_average >= self.currentRating && this.determineGenres(movie.genre_ids)
      })
    }
  },
  methods: {
    movieImage: (img) => {
      // create an image url
      if (img) {
        return 'http://image.tmdb.org/t/p/w342/' + img
      } else {
        // some images return null - let's use a placeholder
        return '../../static/Iou_decal.png'
      }
    },
    genreLabel (id) {
      // create a dictionary so we don't have to iterate every time
      if (Object.keys(this.genreLookup).length === 0) {
        for (let i = 0; i < this.genres.length; i++) {
          this.genreLookup[this.genres[i].id] = this.genres[i].name
        }
      }
      // use the dictionary to return the genre name
      return this.genreLookup[id]
    },
    applyRatingFilter (rating) {
      this.currentRating = rating
    },
    applyGenreFilter (genres) {
      this.currentGenres = genres
    },
    sortMovies () {
      this.nowPlaying.sort((a, b) => {
        if (a.popularity < b.popularity) {
          return 1
        } else if (a.popularity > b.popularity) {
          return -1
        } else {
          return 0
        }
      })
    },
    determineGenres (genres) {
      // helper function to filter by genre
      for (let i = 0; i < this.currentGenres.length; i++) {
        if (!genres.includes(this.currentGenres[i])) {
          return false
        }
      }
      return true
    }
  },
  filters: {
    popRound: (popularity) => {
      return Math.round(popularity)
    }
  },
  mounted () {
    EventBus.$on(FilterEvent.FILTER_RATING, this.applyRatingFilter)
    EventBus.$on(FilterEvent.FILTER_GENRE, this.applyGenreFilter)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.genreBadge {
  margin-bottom: 5px;
  margin-right: 5px;
}
</style>
