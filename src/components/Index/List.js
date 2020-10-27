import React, { useState, useContext } from 'react';
import { UserContext } from '../../Context/UserContext';
import { StatusContext } from '../../Context/StatusContext';
import { saveData, checkSaved, removeData } from '../../helpers/index';
import Alert from '../Alert/Alert';

const List = ({ asteroids }) => {
	const [user, setUser] = useContext(UserContext);
	const [status, setStatus] = useContext(StatusContext);

	// Alert
	const [alert, setAlert] = useState({
		isOpen: false,
		message: '',
		type: '',
	});
	const changeStatus = () => {
		if (alert.isOpen) setAlert({ ...alert, isOpen: false });
		else setAlert({ ...alert, isOpen: true });
	};

	const bookmarkAsteroid = (e) => {
		const data = JSON.parse(e.target.dataset.asteroid);
		if (user.length !== 0) {
			// Check if the user has already saved it
			checkSaved(data.id).then((flag) => {
				if (flag) {
					if (status.profile) {
						removeData(data, user);
						setAlert({
							...alert,
							isOpen: true,
							message: 'Deleted',
							type: 'success',
						});
					} else {
						setAlert({
							...alert,
							isOpen: true,
							message: 'You have already saved it',
							type: 'danger',
						});
					}
				} else {
					saveData(data, user);
					setAlert({
						...alert,
						isOpen: true,
						message: 'Saved',
						type: 'success',
					});
				}
			});
		} else {
			setAlert({
				...alert,
				isOpen: true,
				message: 'You have to sign in in order to save it',
				type: 'primary',
			});
		}
	};

	return (
		<>
			<section className="section">
				{asteroids.length === 0 ? (
					<h1>There is no record</h1>
				) : (
					asteroids.map((asteroid, i) => {
						return (
							<div className="card" key={asteroid.id}>
								<div className="card__save">
									<button
										data-asteroid={JSON.stringify(asteroid)}
										onClick={(e) => {
											bookmarkAsteroid(e);
										}}
										type="button"
										className="btn-secondary"
									>
										{status.profile ? 'Delete' : 'Save'}
									</button>
								</div>
								<div
									className={`card__hazardous ${
										asteroid.is_potentially_hazardous_asteroid
											? 'badge-danger'
											: 'badge-success'
									}`}
									title="Hazardous Asteroid"
								>
									{asteroid.is_potentially_hazardous_asteroid
										? 'True'
										: 'False'}
								</div>
								<div className="card__name" title="Asteroid Name">
									{`${asteroid.name} - ${asteroid.id}`}
								</div>
								<div className="card__date" title="Close Approach Date">
									{asteroid.close_approach_data.length > 0
										? asteroid.close_approach_data[0].close_approach_date
										: 'N/A'}
								</div>
							</div>
						);
					})
				)}
			</section>
			{alert.isOpen ? (
				<Alert
					type={alert.type}
					changeStatus={changeStatus}
					isOpen={alert.isOpen}
					message={alert.message}
				/>
			) : (
				''
			)}
		</>
	);
};

export default List;
