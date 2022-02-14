import React from 'react';
import { useAppContext } from '../appContext';
import zagluwka from '../images/zaglushka.jpg';
import zagluwkaMobile from '../images/zaglushkaMobile.jpg';

const Zaglushka = () => {
	const { smallScreen } = useAppContext();
	return (
		<img
			src={smallScreen ? zagluwkaMobile : zagluwka}
			style={{
				width: '100vw',
				height: '100vh',
				objectFit: 'cover',
				position: 'fixed',
				top: 0,
				left: 0,
				zIndex: 1000,
			}}
			alt="development"
		/>
	);
};

export default Zaglushka;
