document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';
    const tableBody = document.querySelector('tbody');
    const searchInput = document.getElementById('searchInput');
    const sortMarketCapButton = document.getElementById('sortMarketCap');
    const sortPercentageChangeButton = document.getElementById('sortPercentageChange');

    let coinsData = [];

    // Fetch data using async/await
    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            coinsData = data;
            renderTable(coinsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Render table with data
    function renderTable(data) {
        tableBody.innerHTML = ''; // Clear existing table data
        data.forEach(coin => {
            const changeClass = coin.price_change_percentage_24h >= 0 ? 'price-up' : 'price-down';
            const row = `
                <tr>
                    <td><img src="${coin.image}" alt="${coin.name} icon"> ${coin.name}</td>
                    <td>${coin.symbol.toUpperCase()}</td>
                    <td>$${coin.current_price.toLocaleString()}</td>
                    <td>$${coin.total_volume.toLocaleString()}</td>
                    <td class="${changeClass}">${coin.price_change_percentage_24h.toFixed(2)}%</td>
                    <td>Mkt Cap: $${coin.market_cap.toLocaleString()}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // Handle search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = coinsData.filter(coin => 
            coin.name.toLowerCase().includes(searchTerm) || 
            coin.symbol.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredData);
    });

    // Sort by market cap
    sortMarketCapButton.addEventListener('click', () => {
        const sortedData = [...coinsData].sort((a, b) => b.market_cap - a.market_cap);
        renderTable(sortedData);
    });

    // Sort by percentage change
    sortPercentageChangeButton.addEventListener('click', () => {
        const sortedData = [...coinsData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        renderTable(sortedData);
    });

    // Initial fetch
    fetchData();
});
