import initMap from './modules/googleMap.js';

export function render () {
    setTimeout(() => {
        initMap(49.2330244, 28.466546);
    }, 0);

    return `
      <section id="contact">
        <div class="contact-banner">
          <h1>Contact Information</h1>
          <p>
            Contact us today for a free consultation. We're here to answer your questions and guide you on your real estate journey.
          </p>
        </div>
        <div id="map" class="map-container"></div>
        <div class="contacts">
          <div class="contact-icon-container">
            <img src="../src/assets/icons/phone.svg" alt="phone" class="contact-icon">
            <p>+380 (12)-34-567</p>
          </div>
          <div class="contact-icon-container">
            <img src="../src/assets/icons/mail.svg" alt="mail" class="contact-icon">
            <p>mail@example.com</p>
          </div>
          <div class="contact-icon-container">
            <img src="../src/assets/icons/location.svg" alt="location" class="contact-icon">
            <p>вулиця Соборна, 69, Вінниця</p>
          </div>
        </div>
      </section>
    `;
}
