export default function initMap (lat, lng) {
    const mapContainer = document.getElementById('map');

    const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    mapContainer.innerHTML = `<iframe src="${mapSrc}" allowfullscreen></iframe>`;
}
