import View from './View.js';

class PreviewView extends View {
  _parentElement = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    const activeClass = this._data.id === id ? 'preview__link--active' : '';

    return `
          <li class="preview">
            <a class="preview__link ${activeClass}" href="#${this._data.id}">
              <figure class="preview__fig">
                <img src="${this._data.image_url}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${this._data.title}</h4>
                <p class="preview__publisher">${this._data.publisher}</p>
              </div>
            </a>
          </li>
    `;
  }
}

export default new PreviewView();
