import React, { useState, createContext } from 'react';

export const AsteroidContext = createContext();

export const AsteroidProvider = ({ children }) => {
	const [asteroids, setAsteroids] = useState([]);

	return (
		<AsteroidContext.Provider value={[asteroids, setAsteroids]}>
			{children}
		</AsteroidContext.Provider>
	);
};
