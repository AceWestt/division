import React from 'react';
import prelaoderGif from '../images/preloader.gif';

const LoadingScreen = () => {
	return (
		<div
			style={{
				width: '100vw',
				height: '100vh',
				background: '#000',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				top: 0,
				left: 0,
				position: 'fixed',
				zIndex: 10000,
			}}
		>
			<img
				style={{ width: '300px', height: '300px' }}
				src={prelaoderGif}
				alt="loading"
			/>
		</div>
	);
};

export default LoadingScreen;
