import { useReducer, useContext, useEffect } from 'react';
import {
	LngLatBounds,
	Map,
	Marker,
	Popup,
	SourceSpecification,
} from 'mapbox-gl';
import { MapContext } from './MapContext';
import { mapReducer } from './MapReducer';
import { PlacesContext } from '../places/PlacesContext';
import directionsApi from '../../apis/directionsApi';
import { DirectionResponse } from '../../interfaces/directions.interface';

export interface MapState {
	isMapReady: boolean;
	map?: Map;
	markers: Marker[];
}

const INITIAL_STATE: MapState = {
	isMapReady: false,
	map: undefined,
	markers: [],
};

interface Props {
	children: JSX.Element | JSX.Element[];
}

export const MapProvider = ({ children }: Props) => {
	const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE);
	const { places } = useContext(PlacesContext);

	useEffect(() => {
		state.markers.forEach((marker) => marker.remove());

		const newMarkers: Marker[] = [];

		for (const place of places) {
			const [lng, lat] = place.geometry.coordinates;
			const popup = new Popup().setHTML(`
          <h6>${place.properties.name_preferred}</h6>
          <p>${place.properties.full_address}</p>
        `);

			const newMarker = new Marker()
				.setPopup(popup)
				.setLngLat([lng, lat])
				.addTo(state.map!);

			newMarkers.push(newMarker);
		}

		//TODO: Limpiar polylines

		dispatch({ type: 'setMarkers', payload: newMarkers });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [places]);

	const setMap = (map: Map) => {
		const myLocationPopup = new Popup().setHTML(`
      <h4>Aquí estoy</h4>
      <p>En algún lugar del mundo</p>
    `);

		new Marker({
			color: '#61DAFB',
		})
			.setLngLat(map.getCenter())
			.setPopup(myLocationPopup)
			.addTo(map);

		dispatch({ type: 'setMap', payload: map });
	};

	const getRouteBetweenPoints = async (
		start: [number, number],
		end: [number, number]
	) => {
		const resp = await directionsApi.get<DirectionResponse>(
			`/${start.join(',')};${end.join(',')}`
		);
		const { distance, duration, geometry } = resp.data.routes[0];
		const { coordinates: coords } = geometry;

		let kms = distance / 1000;
		kms = Math.round(kms * 100);
		kms /= 100;

		const minutes = Math.floor(duration / 60);
		console.log({ distance, minutes, kms });

		const bounds = new LngLatBounds(start, start);

		for (const coord of coords) {
			const newCoord: [number, number] = [coord[0], coord[1]];
			bounds.extend(newCoord);
		}

		state.map?.fitBounds(bounds, {
			padding: {
				top: 200,
				bottom: 200,
				left: 200,
				right: 200,
			},
		});

		//Polyline
		const sourceData: SourceSpecification = {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'LineString',
							coordinates: coords,
						},
					},
				],
			},
		};

    if( state.map?.getLayer('RouteString')) {
      state.map?.removeLayer('RouteString');
      state.map?.removeSource('RouteString');
    }

    state.map?.addSource('RouteString', sourceData);
    state.map?.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'blue',
        'line-width': 3,
      }
    })
	};

	return (
		<MapContext.Provider
			value={{
				...state,

				// Methods
				setMap,
				getRouteBetweenPoints,
			}}
		>
			{children}
		</MapContext.Provider>
	);
};
