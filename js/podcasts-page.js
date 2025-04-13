//let podcastData = []; // Global variable to store podcast data

// Fetch podcast data from JSON file
async function fetchPodcastData() {
    try {
        const response = await fetch('../data/podcast.json');
        const data = await response.json();
        podcastData = data.podcasts; // Assuming the JSON has a "podcasts" array
        return podcastData;
    } catch (error) {
        console.error('Error loading podcasts:', error);
        return [];
    }
}

function createPodcastCard(podcast) {
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 podcast-card">
                <img src="../${podcast.thumbnail}" class="card-img-top" alt="${podcast.title}">
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="badge bg-primary">${podcast.category}</span>

                    </div>
                    <h5 class="card-title">${podcast.title}</h5>
                    <p class="card-text flex-grow-1">${truncateText(podcast.description, 50)}</p>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">Aired on - ${new Date(podcast.date).toLocaleDateString()}</small>
                        <a href="${podcast.youtubeLink}" class="btn btn-outline-primary btn-sm">Watch Now</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function displayPodcasts(podcasts) {
    const podcastGrid = document.getElementById('podcast-grid');
    podcastGrid.innerHTML = podcasts.map(podcast => createPodcastCard(podcast)).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    // Initial fetch and display
    podcastData = await fetchPodcastData();
    displayPodcasts(podcastData);

    // Search functionality
    document.getElementById('podcast-search').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredPodcasts = podcastData.filter(podcast =>
            podcast.title.toLowerCase().includes(searchTerm) ||
            podcast.description.toLowerCase().includes(searchTerm)
        );
        displayPodcasts(filteredPodcasts);
    });

    // Category filter
    document.getElementById('category-filter').addEventListener('change', (e) => {
        const category = e.target.value;
        const filteredPodcasts = category === 'all'
            ? podcastData
            : podcastData.filter(podcast => podcast.category === category);
        displayPodcasts(filteredPodcasts);
    });

    // Sort functionality
    document.getElementById('sort-option').addEventListener('change', (e) => {
        const sortedPodcasts = [...podcastData].sort((a, b) => {
            return e.target.value === 'newest'
                ? new Date(b.date) - new Date(a.date)
                : new Date(a.date) - new Date(b.date);
        });
        displayPodcasts(sortedPodcasts);
    });
});
function truncateText(text, words) {
    const wordArray = text.split(' ');
    if (wordArray.length > words) {
        return wordArray.slice(0, words).join(' ') + '...';
    }
    return text;
}