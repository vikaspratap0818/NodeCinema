import axios from 'axios';

axios.get('https://api.watchmode.com/v1/autocomplete-search/?apiKey=UiXQGgpwD6CaYuQhsLDCTG0G1ytldwLEvrZQuXSV&search_value=Marvel&search_type=1')
  .then(res => console.log(JSON.stringify(res.data.results[0], null, 2)))
  .catch(err => console.error(err.message));
