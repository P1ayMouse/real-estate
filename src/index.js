function loadPage (page) {
    const content = document.getElementById('content');

    if (page.startsWith('estate/')) {
        const estateId = page.split('/')[1];
        import('./js/estate.js').then(async module => {
            content.innerHTML = await module.render(estateId);
        });
        return;
    }

    switch (page) {
    case 'home':
        import('./js/home.js').then(async module => {
            content.innerHTML = await module.render();
        });
        break;
    case 'gallery':
        import('./js/gallery.js').then(async module => {
            content.innerHTML = await module.render();
        });
        break;
    case 'contact':
        import('./js/contact.js').then(module => {
            content.innerHTML = module.render();
        });
        break;
    default:
        import('./js/errorPage.js').then(module => {
            content.innerHTML = module.render();
        });
    }
}

function setActiveLink () {
    const navLinks = document.querySelectorAll('nav a');
    const currentHash = window.location.hash;

    navLinks.forEach(link => {
        const linkHash = link.getAttribute('href');

        if (currentHash === linkHash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.addEventListener('hashchange', () => {
    const page = location.hash.slice(1);
    loadPage(page);
    setActiveLink();
});

document.addEventListener('DOMContentLoaded', () => {
    if (location.hash) {
        loadPage(location.hash.slice(1));
    } else {
        location.hash = 'home';
        loadPage('home');
    }

    setActiveLink();
});

document.getElementById('logo').addEventListener('click', () => {
    window.location.hash = 'home';
});

document.getElementById('burger-menu').addEventListener('click', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('open');
});

document.querySelectorAll('#mobile-menu .has-submenu > a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const submenu = link.nextElementSibling;
        submenu.classList.toggle('open');
    });
});
