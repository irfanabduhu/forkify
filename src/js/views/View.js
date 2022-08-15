import icons from 'url:../../img/icons.svg';

export default class View {
	_data;

	/**
	 * Render the recieved object to the DOM.
	 * @param {Object | Object[]} data the data to be rendered
	 * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM.
	 * @returns {string} A markup string is returned
	 * @this {Object} View instance
	 */
	render(data, render = true) {
		this._data = data;
		if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

		const markup = this._generateMarkup();
		if (render) this._parentElement.innerHTML = markup;
		return markup;
	}

	update(data) {
		this._data = data;

		// select all children of the parent element:
		const currentElements = Array.from(this._parentElement.querySelectorAll('*'));

		const newMarkup = this._generateMarkup(); // template string
		const newDOM = document.createRange().createContextualFragment(newMarkup); // parse into a virtual DOM
		const newElements = Array.from(newDOM.querySelectorAll('*'));

		newElements.forEach((newEl, i) => {
			const currentEl = currentElements[i];
			if (newEl.isEqualNode(currentEl)) return; // continue to the next iteration

			// update text content:
			if (newEl.firstChild?.nodeValue.trim() !== '') {
				currentEl.textContent = newEl.textContent;
			}

			// update attributes:
			Array.from(newEl.attributes).forEach(attr =>
				currentEl.setAttribute(attr.name, attr.value)
			);
		});
	}

	renderSpinner() {
		const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
		this._parentElement.innerHTML = markup;
	}

	renderError(message = this._errorMessage) {
		const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
		this._parentElement.innerHTML = markup;
	}

	renderMessage(message = this._message) {
		const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}.svg#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
		this._parentElement.innerHTML = markup;
	}
}
