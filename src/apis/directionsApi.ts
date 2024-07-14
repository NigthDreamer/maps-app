import axios from 'axios';
import { getEnvironments } from '../helpers';

const directionsApi = axios.create({
  baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving',
  params: {
    alternatives: false,
    geometries: 'geojson',
    overview: 'simplified',
    steps: false,
    access_token: getEnvironments().VITE_MAPBOX_KEY,
  }
});

export default directionsApi;