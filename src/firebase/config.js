import firebase from 'firebase';

const firebaseConfig = {
	apiKey: 'AIzaSyBoiUHen7MS24a3Tb92uyIHc2njQgeaBjk',
	authDomain: 'neo-project-13c10.firebaseapp.com',
	databaseURL: 'https://neo-project-13c10.firebaseio.com',
	projectId: 'neo-project-13c10',
	storageBucket: 'neo-project-13c10.appspot.com',
	messagingSenderId: '257342350934',
	appId: '1:257342350934:web:c50a98fea00c017d22fdf7',
};
firebase.initializeApp(firebaseConfig);

export default firebase;
