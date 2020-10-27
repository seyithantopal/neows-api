import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import List from './List';
import { convertFeed, sortAsteroids } from '../../helpers/index';
import { AsteroidContext } from '../../Context/AsteroidContext';
import { StatusContext } from '../../Context/StatusContext';

const Index = () => {
	const API_KEY = 'RtFkunRWvCnz2YALP9hdRHgnbfxhKHnD7EFrgFVr';

	// States for search feature
	const [search, setSearch] = useState('');
	const [filteredData, setFilteredData] = useState([]);

	// States for asteroid lists
	const [asteroids, setAsteroids] = useContext(AsteroidContext);
	const [status, setStatus] = useContext(StatusContext);

	// States for date picker
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			const data = await axios
				.get(
					`https://api.nasa.gov/neo/rest/v1/neo/browse?page=0&size=10&api_key=${API_KEY}`,
				)
				.then((res) => {
					if (status.initial) {
						setAsteroids(res.data.near_earth_objects);
						setFilteredData(res.data.near_earth_objects);
					}
				})
				.catch((err) => {
					throw err;
				});
		};
		fetchData();
	}, [status]);

	const handleFilter = async () => {
		// validation
		if (startDate === '' || endDate === '') {
			/* eslint-disable no-console */
			console.log('Please pick a date');
		} else {
			const data = await axios
				.get(
					`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&detailed=true&api_key=${API_KEY}`,
				)
				.then((res) => {
					const tempData = convertFeed(res.data.near_earth_objects, 10);
					setStatus({
						initial: false,
						filter: true,
						profile: false,
					});
					setAsteroids(tempData);
					setFilteredData(tempData);
				})
				.catch((err) => {
					throw err;
				});
		}
	};

	// Search filter
	const filter = (input) => {
		setFilteredData(sortAsteroids(asteroids, input));
		if (status.profile) {
			setStatus({
				initial: false,
				filter: true,
				profile: true,
			});
		}
	};

	// Handle search input
	const handleSearch = (event) => {
		const inputSearch = event.target.value;
		setSearch(inputSearch);
		filter(event.target.value);
	};

	// Handle render the right component

	return (
		<>
			<section className="section">
				<div className="date">
					<div className="date__start">
						<label htmlFor="start-date">
							Start Date
							<input
								id="start-date"
								type="date"
								onChange={(e) => setStartDate(e.currentTarget.value)}
							/>
						</label>
					</div>
					<div className="date__end">
						<label htmlFor="end-date">
							End Date
							<input
								id="end-date"
								type="date"
								onChange={(e) => setEndDate(e.currentTarget.value)}
							/>
						</label>
					</div>
					<div className="date__filter">
						<button
							className="btn-secondary"
							type="button"
							onClick={handleFilter}
						>
							Filter
						</button>
					</div>
				</div>
			</section>
			<section className="section">
				<div className="searchbox">
					<input
						type="text"
						placeholder="Search by ID..."
						className="search"
						value={search}
						onChange={handleSearch}
					/>
					<i className="fas fa-search" />
				</div>
			</section>
			<List
				asteroids={
					status.profile && !status.initial && !status.filter
						? asteroids
						: filteredData
				}
			/>
		</>
	);
};

export default Index;
