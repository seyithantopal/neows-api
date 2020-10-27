import React, { useEffect, useState, useContext } from 'react';
import Modal from '../Modal/Modal';
import firebase from '../../firebase/config';
import { AsteroidContext } from '../../Context/AsteroidContext';
import { StatusContext } from '../../Context/StatusContext';
import { UserContext } from '../../Context/UserContext';

import Logo from '../../assets/images/logo/logo2.png';

const Header = () => {
	const [asteroids, setAsteroids] = useContext(AsteroidContext);
	const [status, setStatus] = useContext(StatusContext);
	const [user, setUser] = useContext(UserContext);

	// Navbar
	const [hamburger, setHamburger] = useState('hamburger');
	const [navLinks, setNavLinks] = useState('navbar navbar__link');

	const handleHamburger = () => {
		if (hamburger === 'hamburger') {
			setHamburger('hamburger toggle');
			setNavLinks('navbar navbar__link active');
		} else {
			setHamburger('hamburger');
			setNavLinks('navbar navbar__link');
		}
	};

	// User Authentication
	useEffect(() => {
		firebase.auth().onAuthStateChanged((authUser) => {
			if (authUser) setUser(authUser);
			else setUser([]);
		});
	}, []);

	const handleLogout = (e) => {
		e.preventDefault();
		firebase.auth().signOut();
		setStatus({
			initial: true,
			filter: false,
			profile: false,
		});
	};

	const handleProfile = async (e) => {
		e.preventDefault();
		firebase
			.firestore()
			.collection('asteroids')
			.where('userId', '==', user.uid)
			.onSnapshot((snapshot) => {
				const data = snapshot.docs.map((doc) => ({
					...doc.data(),
				}));
				setAsteroids(data);
			});
		setStatus({
			initial: false,
			filter: false,
			profile: true,
		});
	};

	const handleLogo = () => {
		setStatus({
			initial: true,
			filter: false,
			profile: false,
		});
	};

	// Modal
	const [isOpen, setIsOpen] = useState(false);
	const [type, setType] = useState('');

	const openModal = (e) => {
		e.preventDefault();
		if (!isOpen) {
			const formType = e.target.dataset.type;
			setIsOpen(true);
			setType(formType);
		}
	};
	const changeStatus = () => {
		if (isOpen) setIsOpen(false);
		else setIsOpen(true);
	};

	return (
		<>
			<header>
				<div className="logo" onClick={handleLogo}>
					<img src={Logo} alt="logo" />
				</div>
				<nav className="navbar">
					<ul className={navLinks}>
						{user.length === 0 ? (
							<>
								<li className="navbar__item">
									<a href="/#" data-type="signin" onClick={openModal}>
										Sign In
									</a>
								</li>
								<li className="navbar__item">
									<a href="/#" data-type="signup" onClick={openModal}>
										Register
									</a>
								</li>
							</>
						) : (
							<li className="navbar__item">
								<a href="/" onClick={(e) => e.preventDefault()}>
									{user.email}
								</a>
								<i className="fa fa-angle-down" aria-hidden="true" />
								<ul className="sub-menu">
									<li>
										<a href="/" onClick={handleProfile}>
											Profile
										</a>
									</li>
									<li>
										<a href="/" onClick={handleLogout}>
											Logout
										</a>
									</li>
								</ul>
							</li>
						)}
					</ul>
				</nav>
				<div className={hamburger} onClick={handleHamburger}>
					<div className="hamburger__line" />
					<div className="hamburger__line" />
					<div className="hamburger__line" />
				</div>
			</header>
			{isOpen ? (
				<Modal type={type} changeStatus={changeStatus} isOpen={isOpen} />
			) : (
				''
			)}
		</>
	);
};

export default Header;
