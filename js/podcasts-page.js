//// podcasts-page.js - Functionality specific to the podcasts listing page
//
//document.addEventListener('DOMContentLoaded', function() {
//    // Variables for pagination
//    const ITEMS_PER_PAGE = 6;
//    let currentPage = 1;
//    let filteredPodcasts = [];
//
//    // Elements
//    const podcastContainer = document.getElementById('all-podcasts-container');
//    const paginationContainer = document.getElementById('pagination-container');
//    const searchInput = document.getElementById('podcast-search');
//    const categoryFilter = document.getElementById('category-filter');
//    const sortOption = document.getElementById('sort-option');
//
//    // Initialize page
//    initPodcastsPage();
//
//    // Main initialization function
//    async function initPodcastsPage() {
//        if (!podcastContainer) return;
//
//        try {
//            // Fetch all podcasts
//            const podcasts = await window.podcastUtils.fetchPodcasts();
//            filteredPodcasts = [...podcasts];
//
//            // Set up event listeners
//            setupEventListeners();
//
//            // Initial display
//            sortAndFilterPodcasts();
//        } catch (error) {
//            console.error('Failed to initialize podcasts page:', error);
//            podcastContainer.innerHTML = '<div class="col-12 text-center"><p>Failed to load podcast episodes. Please try again later.</p></div>';
//        }
//    }
//
//    // Set up event listeners for filtering and sorting
//    function setupEventListeners() {
//        if (searchInput) {
//            searchInput.addEventListener('input', debounce(() => {
//                currentPage = 1;
//                sortAndFilterPodcasts();
//            }, 300));
//        }
//
//        if (categoryFilter) {
//            categoryFilter.addEventListener('change', () => {
//                currentPage = 1;
//                sortAndFilterPodcasts();
//            });
//        }
//
//        if (sortOption) {
//            sortOption.addEventListener('change', () => {
//                sortAndFilterPodcasts();
//            });
//        }
//    }
//
//    // Filter and sort podcasts based on user selections
//    async function sortAndFilterPodcasts() {
//        try {
//            const podcasts = await window.podcastUtils.fetchPodcasts();
//
//            // Apply search filter
//            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
//
//            // Apply category filter
//            const categoryValue = categoryFilter ? categoryFilter.value : 'all';
//
//            // Filter podcasts
//            filteredPodcasts = podcasts.filter(podcast => {
//                const matchesSearch = podcast.title.toLowerCase().includes(searchTerm) ||
//                                     podcast.description.toLowerCase().includes(searchTerm);
//
//                const matchesCategory = categoryValue === 'all' || podcast.category === categoryValue;
//
//                return matchesSearch && matchesCategory;
//            });
//
//            // Apply sorting
//            const sortValue = sortOption ? sortOption.value : 'newest';
//
//            if (sortValue === 'newest') {
//                filteredPodcasts.sort((a, b) => new Date(b.date) - new Date(a.date));
//            } else if (sortValue === 'oldest') {
//                filteredPodcasts.sort((a, b) => new Date(a.date) - new Date(b.date));
//            }
//
//            // Update display
//            displayPodcasts();
//            updatePagination();
//
//        } catch (error) {
//            console.error('Error filtering podcasts:', error);
//        }
//    }
//
//    // Display current page of podcasts
//    function displayPodcasts() {
//        if (!podcastContainer) return;
//
//        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//        const endIndex = startIndex + ITEMS_PER_PAGE;
//        const currentPagePodcasts = filteredPodcasts.slice(startIndex, endIndex);
//
//        if (currentPagePodcasts.length === 0) {
//            podcastContainer.innerHTML = `
//                <div class="col-12 text-center py-5">
//                    <h3>No podcasts found</h3>
//                    <p>Try adjusting your search or filter criteria.</p>
//                </div>
//            `;
//            return;
//        }
//
//        const podcastsHTML = currentPagePodcasts.map(podcast =>
//            window.podcastUtils.createPodcastCard(podcast)
//        ).join('');
//
//        podcastContainer.innerHTML = podcastsHTML;
//    }
//
//    // Update pagination controls
//    function updatePagination() {
//        if (!paginationContainer) return;
//
//        const totalPages = Math.ceil(filteredPodcasts.length / ITEMS_PER_PAGE);
//
//        if (totalPages <= 1) {
//            paginationContainer.innerHTML = '';
//            return;
//        }
//
//        let paginationHTML = `
//            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
//                <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
//                    <span aria-hidden="true">&laquo;</span>
//                </a>
//            </li>
//        `;
//
//        for (let i = 1; i <= totalPages; i++) {
//            paginationHTML += `
//                <li class="page-item ${i === currentPage ? 'active' : ''}">
//                    <a class="page-link" href="#" data-page="${i}">${i}</a>
//                </li>
//            `;
//        }
//
//        paginationHTML += `
//            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
//                <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
//                    <span aria-hidden="true">&raquo;</span>
//                </a>
//            </li>
//        `;
//
//        paginationContainer.innerHTML = paginationHTML;
//
//        // Add event listeners to pagination buttons
//        const pageLinks = paginationContainer.querySelectorAll('.page-link');
//        pageLinks.forEach(link => {
//            link.addEventListener('click', (e) => {
//                e.preventDefault();
//                const pageNum = parseInt(link.getAttribute('data-page'));
//                if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
//                    currentPage = pageNum;
//                    displayPodcasts();
//                    updatePagination();
//                    window.scrollTo({top: 0, behavior: 'smooth'});
//                }
//            });
//        });
//    }
//
//    // Helper function to debounce search input
//    function debounce(func, wait) {
//        let timeout;
//        return function() {
//            const context = this;
//            const args = arguments;
//            clearTimeout(timeout);
//            timeout = setTimeout(() => {
//                func.apply(context, args);
//            }, wait);
//        };
//    }
//});

// podcasts-page.js
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('../data/podcast.json');
        const data = await response.json();

        const podcastGrid = document.querySelector('#podcasts-list-section');
        if (podcastGrid) {
            data.podcasts.forEach(podcast => {
                const card = createPodcastCard(podcast);
                podcastGrid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error loading podcasts:', error);
    }
});