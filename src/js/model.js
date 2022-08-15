import { async } from 'regenerator-runtime';
import { API_URL, RESULTS_PER_PAGE } from './config';
import { getJSON } from './helper';

export const state = {
  recipe: {}, // current recipe
  search: {
    query: '',
    results: [],
    page: 1,
  },
  bookmarks: [],
};

export async function loadRecipe(id) {
  try {
    const { data } = await getJSON(`${API_URL}${id}`);
    state.recipe = data.recipe;
    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === state.recipe.id
    );
  } catch (err) {
    throw err;
  }
}

export async function loadSearchResults(query) {
  try {
    state.search.query = query;
    const { data } = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.recipes.map(
      ({ id, title, publisher, image_url }) => {
        return { id, title, publisher, image_url };
      }
    );

    state.search.page = 1;
  } catch (err) {
    throw err;
  }
}

export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RESULTS_PER_PAGE;
  const end = page * RESULTS_PER_PAGE;
  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  const factor = newServings / state.recipe.servings;
  state.recipe.servings = newServings;
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity = +(factor * ingredient.quantity).toFixed(1);
  });
}

export function addBookmark(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
}

export function deleteBookmark(id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (state.recipe.id === id) state.recipe.bookmarked = false;
  console.log(state.recipe);
}