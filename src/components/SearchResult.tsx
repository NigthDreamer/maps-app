import { useContext } from 'react';
import { PlacesContext } from '../context';
import { LoadingPlaces } from './LoadingPlaces';

export const SearchResult = () => {
	const { places, isLoadingPlaces } = useContext(PlacesContext);

	if (isLoadingPlaces) return <LoadingPlaces />;

	if (places.length === 0) return <></>;

	return (
		<ul className="list-group mt-3">
			{places.map((place) => (
				<li key={place.id} className="list-group-item list-group-item-action">
					<h6>{place.properties.name_preferred}</h6>
					<p
						className="text-muted"
						style={{
							fontSize: '12px',
						}}
					>
						{place.properties.full_address}
					</p>
					<button className="btn btn-outline-primary btn-sm">
						Direcciones
					</button>
				</li>
			))}
		</ul>
	);
};
