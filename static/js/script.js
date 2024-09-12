document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');

    function fetchRandomQuote() {
        fetch('/api/random-quote')
            .then(response => response.json())
            .then(data => {
                quoteText.textContent = data.text;
                quoteAuthor.textContent = `- ${data.author}`;
            })
            .catch(error => {
                console.error('Error fetching quote:', error);
                quoteText.textContent = 'An error occurred while fetching the quote.';
                quoteAuthor.textContent = '';
            });
    }

    newQuoteBtn.addEventListener('click', fetchRandomQuote);

    // Fetch initial quote on page load
    fetchRandomQuote();
});
