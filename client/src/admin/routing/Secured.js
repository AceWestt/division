import axios from 'axios';
import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';

const Secured = ({ component: Component, ...rest }) => {
	useEffect(() => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		const checkLogin = async () => {
			try {
				const res = await axios.get('/api/auth/checkauthorization', config);
				if (!res.data.success) {
					localStorage.removeItem('authToken');
					window.location.reload();
				}
			} catch (error) {
				localStorage.removeItem('authToken');
				window.location.reload();
			}
		};

		checkLogin();
	}, []);
	return (
		<Route
			{...rest}
			render={(props) =>
				localStorage.getItem('authToken') ? (
					<Component {...props} />
				) : (
					<Redirect to="/admin/login" />
				)
			}
		/>
	);
};

export default Secured;
