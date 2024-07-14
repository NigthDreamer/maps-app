import { useContext, useState } from 'react';
import { MapContext, PlacesContext } from '../context';
import { LoadingPlaces } from './LoadingPlaces';
import { Feature } from '../interfaces';

export const SearchResult = () => {
	const { places, isLoadingPlaces, userLocation } = useContext(PlacesContext);
	const { map, getRouteBetweenPoints } = useContext(MapContext);

	const [activeId, setActiveId] = useState('');

	const onPlaceClicked = (place: Feature) => {
		setActiveId(place.id);
		const [lgn, lat] = place.geometry.coordinates;

		map?.flyTo({
			zoom: 14,
			center: [lgn, lat],
		});
	};

  const getRoute = (place: Feature) => {
    if ( !userLocation ) return;
    const [lng, lat] = place.geometry.coordinates;
    getRouteBetweenPoints(userLocation, [lng, lat]);
  }

	if (isLoadingPlaces) return <LoadingPlaces />;

	if (places.length === 0) return <></>;

	return (
		<ul className="pointer list-group mt-3">
			{places.map((place) => (
				<li
					key={place.id}
					className={`list-group-item list-group-item-action ${
						activeId === place.id ? 'active' : ''
					}`}
					onClick={() => onPlaceClicked(place)}
				>
					<h6>{place.properties.name_preferred}</h6>
					<p
						style={{
							fontSize: '12px',
						}}
					>
						{place.properties.full_address}
					</p>
					<button
						className={`btn btn-sm ${
							activeId === place.id
								? 'btn-outline-light'
								: 'btn-outline-primary'
						}`}
            onClick={() => getRoute(place)}
					>
						Direcciones
					</button>
				</li>
			))}
		</ul>
	);
};
