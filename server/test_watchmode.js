import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testSearchAPI() {
    const API_KEY = process.env.WATCHMODE_API_KEY;
    try {
        console.log('Testing WatchMode AutoComplete...');
        const res = await axios.get('https://api.watchmode.com/v1/autocomplete-search/', {
            params: {
                apiKey: API_KEY,
                search_value: 'avengers',
                search_type: 1
            }
        });
        
        console.log('Autocomplete Results (First item):');
        console.log(res.data.results[0]);

        console.log('\nTesting WatchMode Full Search...');
        const searchRes = await axios.get('https://api.watchmode.com/v1/search/', {
            params: {
                apiKey: API_KEY,
                search_field: 'name',
                search_value: 'avengers',
                types: 'movie,tv'
            }
        });

        console.log('Full Search Results (First item):');
        console.log(searchRes.data.title_results[0]);

    } catch (e) {
        console.error('API Error:', e.response ? e.response.data : e.message);
    }
}

testSearchAPI();
