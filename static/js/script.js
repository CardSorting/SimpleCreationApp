document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const quoteCategory = document.getElementById('quote-category');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const categorySelect = document.getElementById('category-select');

    function fetchRandomQuote() {
        const selectedCategory = categorySelect.value;
        const url = selectedCategory ? `/api/quotes?category=${selectedCategory}` : '/api/random-quote';

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    data = data[Math.floor(Math.random() * data.length)];
                }
                quoteText.textContent = data.text;
                quoteAuthor.textContent = `- ${data.author}`;
                quoteCategory.textContent = `Category: ${data.category}`;
            })
            .catch(error => {
                console.error('Error fetching quote:', error);
                quoteText.textContent = 'An error occurred while fetching the quote.';
                quoteAuthor.textContent = '';
                quoteCategory.textContent = '';
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

    newQuoteBtn.addEventListener('click', fetchRandomQuote);
    categorySelect.addEventListener('change', fetchRandomQuote);

    // Populate categories and fetch initial quote on page load
    populateCategories();
    fetchRandomQuote();
});
