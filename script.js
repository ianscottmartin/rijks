// Function to fetch artist data from the API
async function fetchArtist() {
    const query = document.getElementById('query').value || 'rembrandt'; // Get query from input
    const url = `https://allorigins.win/get?url=${encodeURIComponent(`http://library.rijksmuseum.nl:9998/biblios?version=1.1&operation=searchRetrieve&query=subject=${query}&maximumRecords=5`)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Raw API response:', data.contents);

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, 'application/xml');
        console.log('Parsed XML document:', xmlDoc);

        const records = xmlDoc.getElementsByTagName('zs:record');
        console.log('Extracted records:', records);

        displayArtistResults(records);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to display the artist results
function displayArtistResults(records) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';  // Clear previous results

    if (records.length > 0) {
        Array.from(records).forEach(record => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');

            // Extract title
            const titleField = record.getElementsByTagName('datafield');
            const title = Array.from(titleField).find(field => field.getAttribute('tag') === '245');
            const titleText = title ? title.getElementsByTagName('subfield')[0]?.textContent : 'No title available';

            // Extract author
            const author = Array.from(titleField).find(field => field.getAttribute('tag') === '100');
            const authorText = author ? author.getElementsByTagName('subfield')[0]?.textContent : 'No author available';

            // Extract image link
            const imageLinkField = Array.from(titleField).find(field => field.getAttribute('tag') === '024');
            const imageLink = imageLinkField ? imageLinkField.getElementsByTagName('subfield')[0]?.textContent : '';

            resultItem.innerHTML = `
                <h3>${titleText}</h3>
                <p><strong>Author:</strong> ${authorText}</p>
                ${imageLink ? `<a href="${imageLink}" target="_blank">View Image</a>` : ''}
            `;

            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.innerHTML = '<p>No results found.</p>';
    }
}

// Event listener for fetching artist data
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const fetchButton = document.getElementById('fetch-button');
    if (fetchButton) {
        fetchButton.addEventListener('click', fetchArtist);
    } else {
        console.error('Fetch button not found in the DOM.');
    }
});
