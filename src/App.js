import React from 'react';
import Index from './components/Index/Index';
import Header from './components/Header/Header';
import { AsteroidProvider } from './Context/AsteroidContext';
import { StatusProvider } from './Context/StatusContext';
import { UserProvider } from './Context/UserContext';

function App() {
	return (
		<>
			<UserProvider>
				<AsteroidProvider>
					<StatusProvider>
						<Header />
						<Index />
					</StatusProvider>
				</AsteroidProvider>
			</UserProvider>
		</>
	);
}

export default App;
