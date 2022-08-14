import View from './View';
import icons from 'url:../../img/icons.svg';
import { RESULTS_PER_PAGE } from '../config';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const nPages = Math.ceil(this._data.results.length / RESULTS_PER_PAGE);
    const currentPage = this._data.page;

    let markup = ``;
    if (nPages == 1) return markup;
    if (currentPage != 1)
      markup += `
          <button class="btn--inline pagination__btn--prev" data-goto="${
            currentPage - 1
          }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
        `;
    if (currentPage != nPages)
      markup += `
          <button class="btn--inline pagination__btn--next" data-goto="${
            currentPage + 1
          }">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        `;
    return markup;
  }

  addHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }
}

export default new PaginationView();
