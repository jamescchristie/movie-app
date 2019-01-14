<template>
  <div class="root">
    <b-jumbotron header="Zone Movie App" lead="Find your favourite movies, fast.">
      <p>Use the controls below to filter the currently playing movies in the UK</p>

      <b-container fluid>
        <b-row class="my-1">
          <b-col sm="3">
            <label>Rating:</label>
          </b-col>
          <b-col sm="9">
            <b-form-input
              id="rating"
              min="0"
              max="10"
              step="0.5"
              type="number"
              v-model="rating"
              v-on:change="ratingFilter"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row class="my-1" align-h="start">
          <b-col sm="3">
            <label>Genre:</label>
          </b-col>
          <b-col sm="9" class="genreCheckboxes">
            <b-form-checkbox-group
              id="checkboxes1"
              name="flavour1"
              v-model="selectedGenre"
              :options="genres"
              text-field="name"
              value-field="id"
              v-on:input="genreChanged"
            ></b-form-checkbox-group>
          </b-col>
        </b-row>
      </b-container>
    </b-jumbotron>
    <MovieGrid ref="movieGrid"></MovieGrid>
  </div>
</template>

<script>
import MovieGrid from './MovieGrid'
import { mapGetters } from 'vuex'
import { EventBus } from '../event-bus'
import FilterEvent from '../events/FilterEvent'

export default {
  name: 'Home',
  data () {
    return {
      selectedGenre: [],
      rating: 3
    }
  },
  methods: {
    ratingFilter: (rating) => {
      EventBus.$emit(FilterEvent.FILTER_RATING, parseFloat(rating))
    },
    genreChanged: (genre) => {
      EventBus.$emit(FilterEvent.FILTER_GENRE, genre)
    }
  },
  computed: {
    ...mapGetters({
      nowPlaying: 'nowPlaying',
      genres: 'genres'
    })
  },

  mounted () {
    this.$store.dispatch('getNowPlaying')
    this.$store.dispatch('getGenres')
  },

  components: {
    MovieGrid
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.genreCheckboxes {
  text-align: left;
}
</style>
