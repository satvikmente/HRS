document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/podcast.json');
        const data = await response.json();
        const podcastContainer = document.getElementById('podcast-container');

        if (podcastContainer) {
            podcastContainer.innerHTML = '';
            const displayPodcasts = data.podcasts.slice(0, 3);

            displayPodcasts.forEach(podcast => {
                const podcastHTML = `
                    <div class="col-lg-4 col-md-6">
                        <div class="card h-100">
                            <img src="${podcast.thumbnail}" class="card-img-top" alt="${podcast.title}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title text-center fw-bold">${podcast.title}</h5>
                                <p class="card-text flex-grow-1">${truncateText(podcast.description, 50)}</p>
                                <div class="text-center mt-auto">
                                    <a href="${podcast.youtubeLink}" class="btn btn-primary" target="_blank">Watch Now</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                podcastContainer.innerHTML += podcastHTML;
            });
        }
    } catch (error) {
        console.error('Error loading podcasts:', error);
    }
});
// Form submissions
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (email) {
            // Create form data to send
            const formData = new FormData();
            formData.append('email', email);

            try {
                // Send POST request to server
                const response = await fetch('http://localhost:3000/save-subscriber', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                });

                if (response.ok) {
                    // Show success message
                    const formParent = newsletterForm.parentElement;
                    const successMessage = document.createElement('div');
                    successMessage.className = 'alert alert-success mt-3';
                    successMessage.innerHTML = 'Thank you for subscribing to our newsletter!';

                    formParent.appendChild(successMessage);
                    emailInput.value = '';

                    setTimeout(() => {
                        successMessage.remove();
                    }, 3000);
                } else {
                    throw new Error('Failed to subscribe');
                }
            } catch (error) {
                // Show error message
                const formParent = newsletterForm.parentElement;
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert alert-danger mt-3';
                errorMessage.innerHTML = 'Sorry, subscription failed. Please try again later.';

                formParent.appendChild(errorMessage);

                setTimeout(() => {
                    errorMessage.remove();
                }, 3000);
            }
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') return;

        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const scrollToAnchor = localStorage.getItem('scrollToAnchor');

    if (scrollToAnchor) {
        // Clear the stored anchor
        localStorage.removeItem('scrollToAnchor');

        // Get the target element
        const element = document.getElementById(scrollToAnchor);

        if (element) {
            // Get navbar height
            const navbarHeight = document.querySelector('.navbar').offsetHeight;

            // Small delay to ensure proper scroll
            setTimeout(() => {
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});

// Initialize animations for elements
const animateOnScroll = function() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
animateOnScroll();


function createPodcastCard(podcast) {
    const card = document.createElement('div');
    card.className = 'col-lg-4 col-md-6 mb-4';
    card.innerHTML = `
        <div class="card h-100">
            <img src="../${podcast.thumbnail}" class="card-img-top" alt="${podcast.title}">
            <div class="card-body">
                <h5 class="card-title">${podcast.title}</h5>
                <p class="card-text text-truncate">${podcast.description}</p>
                <a href="${podcast.youtubeLink}" class="btn btn-primary" target="_blank">Watch Now</a>
            </div>
        </div>
    `;
    return card;
}
function truncateText(text, words) {
    const wordArray = text.split(' ');
    if (wordArray.length > words) {
        return wordArray.slice(0, words).join(' ') + '...';
    }
    return text;
}