import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config';
import { getJSON, sendJSON } from './helper';

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
		const { data } = await getJSON(`${API_URL}${id}?key=${API_KEY}`);
		state.recipe = data.recipe;
		state.recipe.bookmarked = state.bookmarks.some(bookmark => bookmark.id === state.recipe.id);
	} catch (err) {
		throw err;
	}
}

export async function loadSearchResults(query) {
	try {
		state.search.query = query;
		const { data } = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);

		state.search.results = data.recipes.map(({ id, title, publisher, image_url, key = '' }) => {
			return { id, title, publisher, image_url, key };
		});

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
	persistBookmarks();
}

export function deleteBookmark(id) {
	const index = state.bookmarks.findIndex(el => el.id === id);
	state.bookmarks.splice(index, 1);
	if (state.recipe.id === id) state.recipe.bookmarked = false;
	persistBookmarks();
}

function persistBookmarks() {
	localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

function init() {
	const storage = localStorage.getItem('bookmarks');
	if (storage) state.bookmarks = JSON.parse(storage);
	console.log(state.bookmarks);
}

init();

export async function uploadRecipe(newRecipe) {
	try {
		const ingredients = Object.entries(newRecipe)
			.filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
			.map(ingredient => {
				const items = ingredient[1]
					.replaceAll(' ', '')
					.split(',')
					.map(el => el.trim());

				if (items.length !== 3)
					throw new Error('Wrong ingredient format! Please use the correct format.');

				const [quantity, unit, description] = items;
				return {
					quantity: quantity ? +quantity : null,
					unit,
					description,
				};
			});

		const recipe = {
			title: newRecipe.title,
			source_url: newRecipe.sourceUrl,
			image_url: newRecipe.image,
			publisher: newRecipe.publisher,
			cooking_time: +newRecipe.cookingTime,
			servings: +newRecipe.servings,
			ingredients,
		};

		const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
		state.recipe = data.data.recipe;
		addBookmark(state.recipe);
	} catch (err) {
		throw err;
	}
}