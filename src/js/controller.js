import 'core-js/stable'; // to polyfill ES6 stuff
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime'; // to polyfill async-await
import { state, loadRecipe, loadSearchResults } from './model';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultView.js';

// https://forkify-api.herokuapp.com/v2

init();

function init() {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
}

async function controlRecipe() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 0. Show loading spinner
    recipeView.renderSpinner();

    // 1. fetching recipe data
    await loadRecipe(id);

    // 2. Renderings recipe data
    recipeView.render(state.recipe);
  } catch (err) {
    recipeView.renderError(
      'We could not find that recipe. Please try another one!'
    );
  }
}

async function controlSearchResults() {
  try {
    // 0. Show loading spinner
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Fetch search results
    await loadSearchResults(query);

    // 3. Render results
    console.log(state.search.results);
    resultsView.render(state.search.results);
  } catch (err) {
    console.error(err);
  }
}
