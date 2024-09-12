document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const quoteCategory = document.getElementById('quote-category');
    const quotePremium = document.getElementById('quote-premium');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const categorySelect = document.getElementById('category-select');
    const favoriteBtn = document.getElementById('favorite-btn');
    const favoritesContainer = document.getElementById('favorites-container');
    const shareTwiterBtn = document.getElementById('share-twitter');
    const shareFacebookBtn = document.getElementById('share-facebook');
    const shareLinkedInBtn = document.getElementById('share-linkedin');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const premiumToggle = document.getElementById('premium-toggle');

    let currentQuote = null;
    let isPremium = false;

    // Dark mode functionality
    function initDarkMode() {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.documentElement.classList.add('dark');
        }
    }

    function toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        if (document.documentElement.classList.contains('dark')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Premium mode functionality
    function togglePremium() {
        fetch('/api/toggle-premium', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            isPremium = data.is_premium;
            premiumToggle.classList.toggle('bg-yellow-500', isPremium);
            premiumToggle.classList.toggle('bg-gray-300', !isPremium);
            fetchRandomQuote();
        })
        .catch(error => {
            console.error('Error toggling premium status:', error);
        });
    }

    premiumToggle.addEventListener('click', togglePremium);

    function fetchRandomQuote() {
        const selectedCategory = categorySelect.value;
        const url = selectedCategory ? `/api/quotes?category=${selectedCategory}` : '/api/random-quote';

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    data = data[Math.floor(Math.random() * data.length)];
                }
                currentQuote = data;
                quoteText.textContent = data.text;
                quoteAuthor.textContent = `- ${data.author}`;
                quoteCategory.textContent = `Category: ${data.category}`;
                quotePremium.classList.toggle('hidden', !data.premium);
            })
            .catch(error => {
                console.error('Error fetching quote:', error);
                quoteText.textContent = 'An error occurred while fetching the quote.';
                quoteAuthor.textContent = '';
                quoteCategory.textContent = '';
                quotePremium.classList.add('hidden');
            });
    }

    function populateCategories() {
        fetch('/api/categories')
            .then(response => response.json())
            .then(categories => {
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }

    function addToFavorites() {
        if (currentQuote) {
            fetch('/api/favorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentQuote),
            })
            .then(response => response.json())
            .then(() => {
                updateFavorites();
            })
            .catch(error => {
                console.error('Error adding to favorites:', error);
            });
        }
    }

    function removeFromFavorites(quote) {
        fetch('/api/favorite', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quote),
        })
        .then(response => response.json())
        .then(() => {
            updateFavorites();
        })
        .catch(error => {
            console.error('Error removing from favorites:', error);
        });
    }

    function updateFavorites() {
        fetch('/api/favorites')
            .then(response => response.json())
            .then(favorites => {
                favoritesContainer.innerHTML = '';
                favorites.forEach(quote => {
                    const quoteElement = document.createElement('div');
                    quoteElement.classList.add('bg-gray-50', 'dark:bg-gray-700', 'border', 'border-gray-200', 'dark:border-gray-600', 'rounded-md', 'p-4', 'mb-4');
                    quoteElement.innerHTML = `
                        <p class="text-gray-700 dark:text-gray-300 mb-2">${quote.text}</p>
                        <p class="text-gray-600 dark:text-gray-400 italic text-sm">- ${quote.author}</p>
                        <p class="text-gray-500 dark:text-gray-500 text-xs mt-1">Category: ${quote.category}</p>
                        ${quote.premium ? '<p class="text-yellow-500 font-bold text-xs mt-1">Premium</p>' : ''}
                        <button class="remove-favorite mt-2 bg-red-500 text-white py-1 px-2 rounded-md text-sm hover:bg-red-600 transition duration-300">Remove</button>
                    `;
                    quoteElement.querySelector('.remove-favorite').addEventListener('click', () => removeFromFavorites(quote));
                    favoritesContainer.appendChild(quoteElement);
                });
            })
            .catch(error => {
                console.error('Error fetching favorites:', error);
            });
    }

    function shareOnTwitter() {
        if (currentQuote) {
            const text = encodeURIComponent(`"${currentQuote.text}" - ${currentQuote.author}`);
            const url = `https://twitter.com/intent/tweet?text=${text}`;
            window.open(url, '_blank');
        }
    }

    function shareOnFacebook() {
        if (currentQuote) {
            const url = encodeURIComponent(window.location.href);
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            window.open(shareUrl, '_blank');
        }
    }

    function shareOnLinkedIn() {
        if (currentQuote) {
            const text = encodeURIComponent(`"${currentQuote.text}" - ${currentQuote.author}`);
            const url = encodeURIComponent(window.location.href);
            const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=Inspiring Quote&summary=${text}`;
            window.open(shareUrl, '_blank');
        }
    }

    newQuoteBtn.addEventListener('click', fetchRandomQuote);
    categorySelect.addEventListener('change', fetchRandomQuote);
    favoriteBtn.addEventListener('click', addToFavorites);
    shareTwiterBtn.addEventListener('click', shareOnTwitter);
    shareFacebookBtn.addEventListener('click', shareOnFacebook);
    shareLinkedInBtn.addEventListener('click', shareOnLinkedIn);

    // Initialize dark mode
    initDarkMode();

    // Populate categories and fetch initial quote on page load
    populateCategories();
    fetchRandomQuote();
    updateFavorites();
});
