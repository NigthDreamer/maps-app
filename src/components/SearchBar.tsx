import { ChangeEvent, useContext, useRef } from 'react';
import { PlacesContext } from '../context';
import { SearchResult } from './SearchResult';

export const SearchBar = () => {
	const debounceRef = useRef<NodeJS.Timeout>();
	const { searchPlacesByTerm } = useContext(PlacesContext);

	const onQueryChanged = (event: ChangeEvent<HTMLInputElement>) => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(() => {
			searchPlacesByTerm(event.target.value);
		}, 1000);
	};

	return (
		<div className="search-container">
			<input
				type="text"
				className="form-control"
				placeholder="Buscar sitio"
				onChange={onQueryChanged}
			/>
			<SearchResult />
		</div>
	);
};
