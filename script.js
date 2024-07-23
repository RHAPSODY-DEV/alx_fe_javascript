// Array to hold quotes
let quotes = [];

// Load quotes and last selected filter from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    const storedFilter = localStorage.getItem('selectedFilter');
    
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        quotes = [
            { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life" },
            { text: "The purpose of our lives is to be happy.", category: "Happiness" },
        ];
    }
    
    if (storedFilter) {
        document.getElementById('categoryFilter').value = storedFilter;
    }
}

// Save quotes and selected filter to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function saveSelectedFilter(filter) {
    localStorage.setItem('selectedFilter', filter);
}

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
    sessionStorage.setItem('lastQuote', JSON.stringify(quote)); // Save last viewed quote in session storage
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes(); // Save quotes to local storage
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
        populateCategoryFilter(); // Update category filter
    } else {
        alert('Please enter both the quote text and category.');
    }
}

// Function to populate the category filter dropdown
function populateCategoryFilter() {
    const categories = Array.from(new Set(quotes.map(quote => quote.category)));
    const categoryFilter = document.getElementById('categoryFilter');
    
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const selectedFilter = localStorage.getItem('selectedFilter');
    if (selectedFilter) {
        categoryFilter.value = selectedFilter;
    }
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }

    quoteDisplay.innerHTML = filteredQuotes.map(quote => `<p>${quote.text}</p><p><em>${quote.category}</em></p>`).join('');
    
    saveSelectedFilter(selectedCategory);
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
    const formHTML = `
        <div>
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button onclick="addQuote()">Add Quote</button>
        </div>
        <button onclick="exportToJsonFile()">Export Quotes</button>
        <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
    `;
    document.body.insertAdjacentHTML('beforeend', formHTML);
}

// Function to export quotes to JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategoryFilter();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Load quotes and set up event listeners on page load
window.onload = function() {
    loadQuotes();
    createAddQuoteForm();
    populateCategoryFilter();
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    filterQuotes();
};
