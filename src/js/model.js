import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { getJSON } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
};

export async function loadRecipe(id) {
  try {
    const { data } = await getJSON(`${API_URL}${id}`);
    state.recipe = data.recipe;
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
  } catch (err) {
    throw err;
  }
}
