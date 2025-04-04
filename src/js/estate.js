import { fetchJSONData } from './modules/JSONData.js';
import initMap from './modules/googleMap.js';

export async function render (id) {
    const estates = await fetchJSONData();
    const estateId = Number(id);
    const estate = estates.find((estate) => estate.id === estateId);

    if (!estate) {
        return '<h1 class="undefined-estate">Estate doesn\'t exist.</h1>';
    }

    const estateLat = estate.location.coordinates.lat;
    const estateLng = estate.location.coordinates.lng;

    if (estateLat && estateLng) {
        setTimeout(() => {
            initMap(estateLat, estateLng);
        }, 0);
    }

    return `
      <section id="estate-details">
        <h2>${estate.title} (${estate.type})</h2>
        ${renderEstatePhotos(estate)}
        <div class="estate-info">
          <p class="location"><strong>Location:</strong> ${estate.location.address}, ${estate.location.city}, ${estate.location.state}, ${estate.location.zip}</p>
          <p class="price"><strong>Price:</strong> $${estate.price}</p>
          <p class="size"><strong>Size:</strong> ${estate.size}</p>
          <p class="amenities"><strong>Amenities:</strong> ${estate.amenities.join(', ')}</p>
          <p class="description"><strong>Description:</strong> ${estate.description}</p>
        </div>
        <div id="map" class="map-container"></div>
        <a href="#gallery">Estates list</a>
      </section>
    `;
}

function renderEstatePhotos (estate) {
    if (!estate.photos || estate.photos.length === 0) return '';

    const mainPhoto = `
      <div class="main-photo">
        <img 
          src="../src/assets/img/${estate.photos[0]}" 
          alt="${estate.title}" 
          onerror="this.onerror=null; this.src='./assets/img/none.png';"
        >
      </div>
    `;

    const galleryPhotos = estate.photos.slice(1).map(photo => `
      <div class="photo-thumb">
        <img 
          src="../src/assets/img/${photo}" 
          alt="${estate.title}"
          onerror="this.onerror=null; this.src='./assets/img/none.png';"
        >
      </div>
    `).join('');

    return `
      <div class="photos">
        ${mainPhoto}
        <div class="photo-gallery">
          ${galleryPhotos}
        </div>
      </div>
    `;
}
