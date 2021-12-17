import React from 'react';
import './App.scss';
import { AppProvider } from './appContext';
import { Switch, Route, useRouteMatch } from 'react-router';
import Navigation from './compontents/navigation/Navigation';
import Home from './pages/Home';
import Cases from './pages/Cases';
import Case from './pages/Case';
import Services from './pages/Services';
import { gsap } from 'gsap';
import { ScrollToPlugin, ScrollTrigger } from 'gsap/all';
import Footer from './compontents/footer/Footer';
import Contact from './pages/Contact';
import About from './pages/About';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const App = () => {
	const match = useRouteMatch();
	return (
		<div className="app">
			<AppProvider>
				<Navigation />
				<Switch>
					<Route exact path={`${match.path}`} component={Home} />
					<Route exact path="/cases" component={Cases} />
					<Route path="/cases/:id" component={Case} />
					<Route exact path="/services" component={Services} />
					<Route exact path="/contact" component={Contact} />
					<Route exact path="/about" component={About} />
				</Switch>
				<Footer />
			</AppProvider>
		</div>
	);
};

export default App;
