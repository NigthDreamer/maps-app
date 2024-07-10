import React from 'react'
import ReactDOM from 'react-dom/client'
import { MapsApp } from './MapsApp.tsx'

if( !navigator.geolocation ) {
  alert('Tu navegador no tiene geolocalizacion');
  throw new Error('Tu navegador no tiene geolocalizacion')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MapsApp />
  </React.StrictMode>,
)
