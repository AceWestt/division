import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { AdminProvider } from './adminContext';
import Secured from './routing/Secured';
import LoginScreen from './screens/LoginScreen';
import AdminRouter from './AdminRouter';
import './Admin.scss';

const Admin = () => {
	const match = useRouteMatch();
	return (
		<div className="admin-root">
			<AdminProvider>
				<Switch>
					<Route exact path={`${match.path}/login`} component={LoginScreen} />
					<Secured path={match.path} component={AdminRouter} />
				</Switch>
			</AdminProvider>
		</div>
	);
};

export default Admin;
