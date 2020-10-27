import React, { useState, useEffect, useRef } from 'react';
import firebase from '../../firebase/config';
import Alert from '../Alert/Alert';

const Modal = ({ isOpen, changeStatus, type }) => {
	// Alert
	const [alert, setAlert] = useState({
		isOpen: false,
		message: '',
		type: '',
	});
	const alertChangeStatus = () => {
		if (alert.isOpen) setAlert({ ...alert, isOpen: false });
		else setAlert({ ...alert, isOpen: true });
	};

	const modalElement = useRef();
	const closeModal = () => {
		if (isOpen) changeStatus();
	};

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (e.target === modalElement.current) {
				changeStatus();
			}
		};
		window.addEventListener('click', handleClickOutside);
		return () => window.removeEventListener('click', handleClickOutside);
	}, []);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	/* eslint-disable */
	const handleSubmit = (e) => {
		e.preventDefault();
		if (type === 'signin') {
			firebase
				.auth()
				.signInWithEmailAndPassword(email, password)
				.then((user) => {
					setAlert({
						...alert,
						isOpen: true,
						message: 'Successfully logged in',
						type: 'success',
					});
					changeStatus();
				})
				.catch((err) => {
					setAlert({
						...alert,
						isOpen: true,
						message: `${err}`,
						type: 'danger',
					});
				});
		} else if (type === 'signup') {
			firebase
				.auth()
				.createUserWithEmailAndPassword(email, password)
				.then((user) => {
					console.log('Successfully signed up', user);
					changeStatus();
				})
				.catch((err) => {
					setAlert({
						...alert,
						isOpen: true,
						message: `${err}`,
						type: 'danger',
					});
				});
		}
	};

	return (
		<>
			<div className={isOpen ? 'modal active' : 'modal'} ref={modalElement}>
				<div className="modal__content">
					<div className="modal__header">
						<div className="modal__header__title">
							{type === 'signin' ? 'Sign In' : 'Register'}
						</div>
						<div className="modal__header__close" onClick={closeModal}>
							&times;
						</div>
					</div>
					<hr />
					<div className="modal__body">
						<form id="form" onSubmit={handleSubmit}>
							<input
								type="email"
								className="form-input"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<input
								type="password"
								className="form-input"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</form>
					</div>
					<hr />
					<div className="modal__footer">
						<button
							className="btn-secondary"
							type="button"
							onClick={closeModal}
						>
							Close
						</button>
						<button className="btn-primary" type="submit" form="form">
							Save
						</button>
					</div>
				</div>
			</div>
			{alert.isOpen ? (
				<Alert
					type={alert.type}
					changeStatus={alertChangeStatus}
					isOpen={alert.isOpen}
					message={alert.message}
				/>
			) : (
				''
			)}
		</>
	);
};

export default Modal;
