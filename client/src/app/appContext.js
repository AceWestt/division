import React, { useContext, useEffect, useState } from 'react';

const AppContext = React.createContext();
const smallScreenBreakPoint = 375;

const AppProvider = ({ children }) => {
	const [isSoundOn, setIsSoundOn] = useState(false);
	const [lang, setLang] = useState('ru');
	const [smallScreen, setSmallScreen] = useState(false);

	const [isFooterDisabled, setIsFooterDisabled] = useState(false);

	const handleResize = () => {
		const wWidht =
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth;
		if (wWidht <= smallScreenBreakPoint) {
			setSmallScreen(true);
		} else {
			setSmallScreen(false);
		}
	};

	useEffect(() => {
		handleResize();
	}, []);

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [smallScreen]);

	return (
		<AppContext.Provider
			value={{
				isSoundOn,
				setIsSoundOn,
				lang,
				setLang,
				smallScreen,
				isFooterDisabled,
				setIsFooterDisabled,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	return useContext(AppContext);
};

export { AppContext, AppProvider };
