import { fetchJSONData } from './modules/JSONData.js';

export async function render () {
    const sliderEstatesHtml = await sliderEstatesList();

    setTimeout(() => {
        initSlider();
        initFormValidation();
    }, 0);

    return `
    <section id="home">
      <div class="home-banner">
        <img src="./assets/img/home-banner.jpg" alt="banner">
        <div class="banner-text">
          <h1>Experience Your Dream Home Today</h1>
          <p>Discover the comfort, style, and convenience you deserve in our premium properties.</p>
          <a href="#gallery">Schedule a Tour</a>
        </div>
      </div>
      <div class="slider">
        <img src="./assets/icons/arrow-circle-left.svg" alt="prev" class="slider-arrow" id="slider-prev">
        <div class="slider-container">
          <ul class="slider-estates" id="slider-estates">
            ${sliderEstatesHtml}
          </ul>
        </div>
        <img src="./assets/icons/arrow-circle-right.svg" alt="next" class="slider-arrow" id="slider-next">
      </div>
      <article class="home-form">
        <h2>LET'S FIND YOUR PERFECT PLACE</h2>
        <p>Let's discuss your real estate goals. Contact us for a consultation.</p>
        <form class="form-container">
          <div class="form-row">
            <div class="form-group">
              <label>First name*</label>
              <input type="text" name="first-name" required placeholder="First name*">
            </div>
            <div class="form-group">
              <label>Last name*</label>
              <input type="text" name="last-name" required placeholder="Last name*">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Email address*</label>
              <input type="email" name="email" required placeholder="Email address*">
            </div>
            <div class="form-group">
              <label>Phone number*</label>
              <input type="number" name="phone" required placeholder="Phone number*">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group message">
              <label>Message*</label>
              <textarea name="message" required placeholder="Your message..."></textarea>
            </div>
          </div>  
          <button type="submit">Submit</button>
        </form>  
      </div>  
    </section>
  `;
}

async function sliderEstatesList () {
    const data = await fetchJSONData();
    const expensiveEstates = data.sort((a, b) => b.price - a.price);

    return expensiveEstates.slice(0, 10).map(estate => `
      <li class="slider-estate-card" id="${estate.id}">
        <a href="#estate/${estate.id}">
          <img 
            src="./assets/img/${estate.photos[0]}" 
            alt="${estate.title}" 
            onerror="this.onerror=null; this.src='./assets/img/none.png';"
          >
        </a>
        <div class="overlay-text">${estate.title}${estate.location.city ? ` (${estate.location.city})` : ''}</div>
      </li>
    `).join('');
}

function initSlider () {
    const slider = document.getElementById('slider-estates');
    const slides = slider.querySelectorAll('.slider-estate-card');
    let currentSlide = 0;

    function updateDimensions () {
        if (!slides.length) return { slideWidth: 0, gap: 0, maxSlideIndex: 0 };

        const slideWidth = slides[0].offsetWidth;
        const sliderContainer = document.querySelector('.slider-container') || slider.parentElement;

        if (!sliderContainer) {
            return { slideWidth, gap: 0, maxSlideIndex: 0 };
        }

        const gap = parseInt(getComputedStyle(slider).gap) || 0;
        const visibleSlidesCount = Math.floor((sliderContainer.offsetWidth + gap) / (slideWidth + gap));
        const maxSlideIndex = slides.length - visibleSlidesCount - 1;
        return { slideWidth, gap, maxSlideIndex };
    }

    function updateSlider () {
        const { slideWidth, gap } = updateDimensions();
        slider.style.transform = `translateX(-${currentSlide * (slideWidth + gap)}px)`;
    }

    document.getElementById('slider-prev').addEventListener('click', () => {
        const { maxSlideIndex } = updateDimensions();
        currentSlide = currentSlide > 0 ? currentSlide - 1 : maxSlideIndex;
        updateSlider();
    });

    document.getElementById('slider-next').addEventListener('click', () => {
        const { maxSlideIndex } = updateDimensions();
        currentSlide = currentSlide < maxSlideIndex ? currentSlide + 1 : 0;
        updateSlider();
    });

    window.addEventListener('resize', () => {
        const { maxSlideIndex } = updateDimensions();
        if (currentSlide > maxSlideIndex) {
            currentSlide = maxSlideIndex;
        }
        updateSlider();
    });
}

function initFormValidation () {
    const form = document.querySelector('.form-container');

    const emailRegex = /^(?!\.)(?!.*\.\.)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+){0,63}@(?!-)(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?\d{9,13}$/;

    form.addEventListener('submit', (event) => {
        const emailInput = form.querySelector('input[name="email"]');
        if (!emailRegex.test(emailInput.value)) {
            event.preventDefault();
            alert('Please enter a valid email address.');
        }

        const firstNameInput = form.querySelector('input[name="first-name"]');
        if (firstNameInput.value.trim().length < 2 || firstNameInput.value.trim().length > 15) {
            event.preventDefault();
            alert('Please enter a valid first name.');
        }

        const lastNameInput = form.querySelector('input[name="last-name"]');
        if (lastNameInput.value.trim().length < 2 || lastNameInput.value.trim().length > 15) {
            event.preventDefault();
            alert('Please enter a valid last name.');
        }

        const phoneInput = form.querySelector('input[name="phone"]');
        if (!phoneRegex.test(phoneInput.value.trim())) {
            event.preventDefault();
            alert('Please enter a valid phone number.');
        }

        const messageTextarea = form.querySelector('textarea[name="message"]');
        if (messageTextarea.value.trim().length < 10) {
            event.preventDefault();
            alert('Please enter a message text.');
        }
    });
}
