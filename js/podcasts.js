// podcasts.js - Core functions for loading and displaying podcast data

// Function to fetch podcast data from the JSON file
async function fetchPodcasts() {
    try {
        const response = await fetch('data/podcast.json');
        if (!response.ok) {
            throw new Error('Failed to fetch podcast data');
        }
        const data = await response.json();
        return data.podcasts;
    } catch (error) {
        console.error('Error loading podcast data:', error);
        return [];
    }
}

// Format date to a more readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Create HTML for a single podcast card
function createPodcastCard(podcast) {
    return `
        <div class="col-lg-4 col-md-6">
            <div class="card podcast-card h-100">
                <div class="position-relative">
                    <img src="${podcast.thumbnail}" class="card-img-top" alt="${podcast.title}">
                    <span class="category-badge">${podcast.category}</span>
                </div>
                <div class="card-body">
                    <h3 class="card-title h5">${podcast.title}</h3>
                    <p class="date mb-2"><i class="far fa-calendar-alt me-1"></i>${formatDate(podcast.date)}</p>
                    <p class="card-text">${podcast.description}</p>
                </div>
                <div class="card-footer bg-transparent border-0">
                    <a href="${podcast.youtubeLink}" class="btn btn-watch" target="_blank">
                        <i class="fab fa-youtube me-1"></i> Watch Episode
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Load recent podcasts for homepage
async function loadRecentPodcasts(limit = 3) {
    const container = document.getElementById('podcast-container');
    if (!container) return;

    try {
        const podcasts = await fetchPodcasts();

        // Sort by date (newest first) and take only the specified limit
        const recentPodcasts = podcasts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);

        // Add fade-in animation class to container
        container.classList.add('fade-in');

        // Generate HTML for each podcast
        const podcastsHTML = recentPodcasts.map(podcast => createPodcastCard(podcast)).join('');
        container.innerHTML = podcastsHTML;
    } catch (error) {
        console.error('Error displaying recent podcasts:', error);
        container.innerHTML = '<div class="col-12 text-center"><p>Failed to load podcast episodes. Please try again later.</p></div>';
    }
}

// Initialize podcast functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load recent podcasts on homepage
    if (document.getElementById('podcast-container')) {
        loadRecentPodcasts(3);
    }
});

// Export functions to be used by other scripts
window.podcastUtils = {
    fetchPodcasts,
    formatDate,
    createPodcastCard
};