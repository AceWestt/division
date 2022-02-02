import React, { useRef, useState } from 'react';
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
import Menu from './compontents/menu/Menu';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const App = () => {
	const match = useRouteMatch();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const footerRef = useRef(null);
	const aboutFooterRef = useRef(null);

	const scrollTo = (obj) => {
		gsap.to(window, { duration: 0.5, scrollTo: obj });
	};

	const handleScrollToFooter = () => {
		if (footerRef.current) {
			scrollTo(footerRef.current);
		} else {
			if (aboutFooterRef.current) {
				scrollTo(aboutFooterRef.current);
			}
		}
	};

	return (
		<div className="app">
			<AppProvider>
				<Navigation
					setIsMenuOpen={setIsMenuOpen}
					handleScrollToFooter={handleScrollToFooter}
				/>
				<Switch>
					<Route exact path={`${match.path}`} component={Home} />
					<Route exact path="/cases" component={Cases} />
					<Route path="/cases/:id" component={Case} />
					<Route exact path="/services" component={Services} />
					<Route exact path="/contact">
						<Contact handleScrollToFooter={handleScrollToFooter} />{' '}
					</Route>
					<Route exact path="/about">
						<About footerRef={aboutFooterRef} />
					</Route>
				</Switch>
				<Footer footerRef={footerRef} />
				{isMenuOpen && (
					<Menu
						setIsMenuOpen={setIsMenuOpen}
						handleScrollToFooter={handleScrollToFooter}
					/>
				)}
			</AppProvider>
		</div>
	);
};

export default App;
