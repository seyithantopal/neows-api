import firebase from '../firebase/config';

export const convertFeed = (object, number) => {
	const arr = [];
	Object.values(object).map((date) => {
		return date.map((asteroid, index) => {
			return index + 1 <= number ? arr.push(asteroid) : '';
		});
	});
	return arr;
};

export const convertFeedBySorting = (object, number, sortBy) => {
	const arr = [];
	Object.values(object).map((date) => {
		return date.map((asteroid, index) => {
			return index + 1 <= number && asteroid.id.toString().startsWith(sortBy)
				? arr.push(asteroid)
				: '';
		});
	});
	return arr;
};

export const sortAsteroids = (asteroids, input) => {
	const arr = [];
	/* eslint-disable array-callback-return */
	asteroids.map((el, i) => {
		if (el.id.toString().indexOf(input) > -1) {
			arr.push(el);
		}
	});
	return arr;
};

/* eslint-disable array-callback-return */
export const checkSaved = async (data) => {
	let isEqual = false;
	await firebase
		.firestore()
		.collection('asteroids')
		.get()
		.then((snapshot) => {
			snapshot.docs.map((doc, i) => {
				if (doc.data().id === data) isEqual = true;
			});
		});
	return isEqual;
};

export const saveData = (data, user) => {
	firebase
		.firestore()
		.collection('asteroids')
		.add({
			id: data.id,
			userId: user.uid,
			isHazardous: data.is_potentially_hazardous_asteroid,
			name: data.name,
			close_approach_data: [
				{
					close_approach_date:
						data.close_approach_data.length > 0
							? data.close_approach_data[0].close_approach_date
							: 'N/A',
				},
			],
		});
};

export const removeData = (data, user) => {
	const query = firebase
		.firestore()
		.collection('asteroids')
		.where('id', '==', data.id);
	query.get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			doc.ref.delete();
		});
	});
};
