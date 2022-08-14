import 'core-js/stable'; // to polyfill ES6 stuff
import { async } from 'regenerator-runtime'; // to polyfill async-await
import {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultsPage,
  updateServings,
} from './model';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultView.js';
import paginationView from './views/paginationView.js';

// https://forkify-api.herokuapp.com/v2

init();

function init() {
  recipeView.addHandler(controlRecipe);
  recipeView.addServingsHandler(controlServings);
  searchView.addHandler(controlSearchResults);
  paginationView.addHandler(controlPagination);
}

async function controlRecipe() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 0. Show loading spinner
    recipeView.renderSpinner();

    // 1. Fetch recipe data
    await loadRecipe(id);

    // 2. Render recipe data
    recipeView.render(state.recipe);

    // 3. Mark the active search result
    resultsView.update(getSearchResultsPage());
  } catch (err) {
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    // 0. Show loading spinner
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) throw new Error('No keyword has been provided!');

    // 2. Fetch search results
    await loadSearchResults(query);

    // 3. Render results
    resultsView.render(getSearchResultsPage());

    // 4. Render initial pagination buttons
    paginationView.render(state.search);
  } catch (err) {
    resultsView.renderError(err.message);
  }
}

function controlPagination(gotoPage) {
  // 1. render new page
  resultsView.render(getSearchResultsPage(gotoPage));
  // 2. update pagination buttons
  paginationView.render(state.search);
}

function controlServings(newServings) {
  // Update the recipe servings (in state)
  updateServings(newServings);
  // Rerender the view
  recipeView.update(state.recipe);
}