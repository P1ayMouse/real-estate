import { fetchJSONData } from './modules/JSONData.js';

const itemsPerPage = 10;
let currentPage = 1;
let originalData = [];
let estatesData = [];

export async function render () {
    originalData = await fetchJSONData();
    estatesData = [...originalData];

    setTimeout(() => {
        initControls();
    }, 0);

    return `
      <section id="gallery">
        <div class="sorting">
          <h3>Sort & Filter</h3>
          
          <div class="sort-item">
            <label for="search-input">Search:</label>
            <input type="text" id="search-input" placeholder="Enter a name or city">
          </div>
          
          <div class="sort-item">
            <label for="price-sort">Sort by:</label>
            <select id="price-sort">
              <option value="expensive">Price: High to Low</option>
              <option value="cheap">Price: Low to High</option>
              <option value="size-big">Size: Large first</option>
              <option value="size-small">Size: Small first</option>
              <option value="title-az">Title: A-Z</option>
              <option value="title-za">Title: Z-A</option>
              <option value="city-az">City: A-Z</option>
              <option value="city-za">City: Z-A</option>
            </select>
          </div>
  
          <div class="sort-item">
            <label for="filter-type">Filter by type:</label>
            <select id="filter-type">
              <option value="all">All Types</option>
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          
          <div class="sort-item">
            <label for="filter-city">Filter by city:</label>
            <select id="filter-city">
              <option value="all">All Cities</option>
              <option value="Chicago">Chicago</option>
              <option value="Miami">Miami</option>
              <option value="New York">New York</option>
              <option value="Austin">Austin</option>
              <option value="Springfield">Springfield</option>
            </select>
          </div>
          <div class="sort-item">
            <label for="price-range">Max price: <span id="price-value">$2500000</span></label>
            <input type="range" id="price-range" min="2000" max="2500000" step="1000" value="2500000">
          </div>
        </div>
  
        <div class="gallery-content">
          <h2>Estates list</h2>
          <ul class="gallery-estates-list">
            ${renderEstates(getCurrentPageData())}
          </ul>
  
          <div class="pagination">
            <button id="prev-page">Previous</button>
            <div class="page-numbers"></div>
            <button id="next-page">Next</button>
          </div>
        </div>
      </section>
    `;
}

function renderEstates (data) {
    return data.map(estate => `
        <li class="gallery-estate" id="${estate.id}">
          <a href="#estate/${estate.id}">
            <img src="../src/assets/img/${estate.photos[0]}" alt="${estate.title}" onerror="this.onerror=null; this.src='../src/assets/img/none.png';">
            <div class="estate-info">
              <h3>${estate.title}</h3>
              <p>Location: ${estate.location.city} (${estate.location.state})</p>
              <p>Price: $${estate.price}</p>
            </div>
          </a>
        </li>
      `).join('');
}

function getCurrentPageData () {
    const start = (currentPage - 1) * itemsPerPage;
    return estatesData.slice(start, start + itemsPerPage);
}

function initControls () {
    document.getElementById('filter-type').addEventListener('change', applyFiltersAndSort);
    document.getElementById('filter-city').addEventListener('change', applyFiltersAndSort);
    document.getElementById('price-sort').addEventListener('change', applyFiltersAndSort);
    document.getElementById('price-range').addEventListener('input', () => {
        document.getElementById('price-value').textContent = `$${document.getElementById('price-range').value}`;
        applyFiltersAndSort();
    });

    document.getElementById('search-input').addEventListener('input', applyFiltersAndSort);

    applyFiltersAndSort();
}

function applyFiltersAndSort () {
    const type = document.getElementById('filter-type').value;
    const city = document.getElementById('filter-city').value;
    const maxPrice = parseInt(document.getElementById('price-range').value);
    const sortType = document.getElementById('price-sort').value;
    const searchQuery = document.getElementById('search-input').value.trim().toLowerCase();

    estatesData = originalData.filter(estate => {
        const matchesType = type === 'all' || estate.type === type;
        const matchesCity = city === 'all' || estate.location.city === city;
        const matchesPrice = estate.price <= maxPrice;
        const matchesSearch =
            searchQuery === '' ||
            estate.title.toLowerCase().includes(searchQuery) ||
            estate.location.city.toLowerCase().includes(searchQuery);

        return matchesType && matchesCity && matchesPrice && matchesSearch;
    });

    sortEstates(sortType);
    currentPage = 1;
    initPagination();
}

function sortEstates (type) {
    estatesData.sort((a, b) => {
        switch (type) {
        case 'expensive': return b.price - a.price;
        case 'cheap': return a.price - b.price;
        case 'size-big': return b.size - a.size;
        case 'size-small': return a.size - b.size;
        case 'title-az': return a.title.localeCompare(b.title);
        case 'title-za': return b.title.localeCompare(a.title);
        case 'city-az': return a.location.city.localeCompare(b.location.city);
        case 'city-za': return b.location.city.localeCompare(a.location.city);
        default: return 0;
        }
    });
}

function initPagination () {
    const totalPages = Math.ceil(estatesData.length / itemsPerPage);
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumbersContainer = document.querySelector('.page-numbers');

    function updateButtons () {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    function renderPageNumbers () {
        pageNumbersContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.classList.toggle('active', i === currentPage);
            pageBtn.addEventListener('click', () => updatePage(i));
            pageNumbersContainer.appendChild(pageBtn);
        }
    }

    function updatePage (page) {
        const estatesList = document.querySelector('.gallery-estates-list');
        const pagination = document.querySelector('.pagination');

        estatesList.innerHTML = '';
        pagination.style.display = 'none';

        if (estatesData.length > 0) {
            currentPage = page;
            estatesList.innerHTML = renderEstates(getCurrentPageData());
            if (totalPages > 1) pagination.style.display = 'flex';
            updateButtons();
            renderPageNumbers();
        } else {
            const notFoundEstatesBody = document.createElement('h1');
            notFoundEstatesBody.textContent = 'Estates are not found.';
            notFoundEstatesBody.classList.add('not-found');
            estatesList.appendChild(notFoundEstatesBody);
        }
    }

    prevBtn.onclick = () => currentPage > 1 && updatePage(currentPage - 1);
    nextBtn.onclick = () => currentPage < totalPages && updatePage(currentPage + 1);

    updateButtons();
    renderPageNumbers();
    updatePage(currentPage);
}
