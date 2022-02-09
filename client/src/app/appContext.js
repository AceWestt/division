import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAxiosGet } from '../common/hooks/useAxiosGet';

const AppContext = React.createContext();
const smallScreenBreakPoint = 768;

const AppProvider = ({ children }) => {
	const { pathname } = useLocation();
	const [isSoundOn, setIsSoundOn] = useState(false);
	const [lang, setLang] = useState('ru');
	const [smallScreen, setSmallScreen] = useState(false);
	const [backendData, setBackendData] = useState(null);
	const [dataSuccess, setDataSuccess] = useState(false);

	const [isFooterDisabled, setIsFooterDisabled] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

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

	const { data: generalContentData, success: generalContentSuccess } =
		useAxiosGet('/api/generalcontent');
	const { data: casesCategoriesData, success: casesCategoriesSuccess } =
		useAxiosGet('/api/cases/categories');
	const { data: casesData, success: casesSuccess } = useAxiosGet(
		'/api/cases/cases/-1'
	);
	const { data: clientsData, success: clientsSuccess } =
		useAxiosGet('/api/clients');
	const { data: awardsData, success: awardsSuccess } = useAxiosGet('/api/award');
	const { data: aboutContentData, success: aboutContentSuccess } =
		useAxiosGet('/api/aboutcontent');
	const { data: mediaData, success: mediaSuccess } = useAxiosGet('/api/media');
	const { data: teamData, success: teamSuccess } = useAxiosGet('/api/team');
	const { data: servicesData, success: servicesSuccess } =
		useAxiosGet('/api/service');
	const { data: contactContentData, success: contactContentSuccess } =
		useAxiosGet('/api/contactcontent');

	useEffect(() => {
		if (
			generalContentSuccess &&
			casesCategoriesSuccess &&
			casesSuccess &&
			clientsSuccess &&
			awardsSuccess &&
			aboutContentSuccess &&
			mediaSuccess &&
			teamSuccess &&
			servicesSuccess &&
			contactContentSuccess
		) {
			const data = {
				generalContent: generalContentData,
				cases: {
					categories: casesCategoriesData,
					cases: casesData,
				},
				clients: clientsData,
				awards: awardsData,
				aboutContent: aboutContentData,
				media: mediaData,
				team: teamData,
				services: servicesData,
				contactContent: contactContentData,
			};
			setBackendData(data);
			setDataSuccess(true);
		}
	}, [
		generalContentSuccess,
		generalContentData,
		casesCategoriesSuccess,
		casesCategoriesData,
		casesSuccess,
		casesData,
		clientsSuccess,
		clientsData,
		awardsSuccess,
		awardsData,
		aboutContentSuccess,
		aboutContentData,
		mediaSuccess,
		mediaData,
		teamSuccess,
		teamData,
		servicesSuccess,
		servicesData,
		contactContentSuccess,
		contactContentData,
	]);

	if (!dataSuccess) {
		return (
			<div
				style={{
					width: '100vw',
					height: '100vh',
					background: '#000',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					marginTop: smallScreen ? '-8vw' : '-3.125vw',
				}}
			>
				<div style={{ fontSize: '5vw', color: '#fff' }}>Data Loading...</div>
			</div>
		);
	}

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
				pathname,
				backendData,
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
