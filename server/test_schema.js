require('dotenv').config({path: './.env'});
const axios = require('axios');
axios.get('https://api.watchmode.com/v1/search/', {
  params: {
    apiKey: process.env.WATCHMODE_API_KEY,
    search_field: 'name',
    search_value: 'test',
    types: 'movie,tv'
  }
}).then(r => console.log("SEARCH:", JSON.stringify(r.data.title_results.slice(0, 1), null, 2)))
.catch(e => console.log(e.message));

axios.get('https://api.watchmode.com/v1/autocomplete-search/', {
    params: {
      apiKey: process.env.WATCHMODE_API_KEY,
      search_value: 'test',
      search_type: 1
    }
  }).then(r => console.log("AUTOCOMPLETE:", JSON.stringify(r.data.results.slice(0, 1), null, 2)))
  .catch(e => console.log(e.message));
