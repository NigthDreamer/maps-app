import axios from 'axios';
import { getEnvironments } from '../helpers';

const searchApi = axios.create({
  baseURL: 'https://api.mapbox.com/search/geocode/v6',
  params: {
    limit: 5,
    language: 'es',
    access_token: getEnvironments().VITE_MAPBOX_KEY,
  }
});

export default searchApi;