import React, { useEffect, useRef, useState } from 'react';
import PageTitleHolder from '../compontents/PageTitleHolder';
import titleImg from '../images/page-title-services.svg';
import titleImgEn from '../images/page-title-services-en.svg';
import titleImgUz from '../images/page-title-services-uz.svg';
import chevron from '../images/right-chevron-ICN.svg';
import { useAppContext } from '../appContext';

const Services = () => {
	const { setIsFooterDisabled, lang, backendData, setIsScreenReady } =
		useAppContext();
	useEffect(() => {
		setIsFooterDisabled(false);
	}, [setIsFooterDisabled]);

	const [isRuTitleReady, setIsRuTitleReady] = useState(false);
	const [isEnTitleReady, setIsEnTitleReady] = useState(false);
	const [isUzTitleReady, setIsUzTitleReady] = useState(false);

	useEffect(() => {
		if (isRuTitleReady && isEnTitleReady && isUzTitleReady) {
			setIsScreenReady(true);
		} else {
			setIsScreenReady(false);
		}
	}, [isRuTitleReady, isEnTitleReady, isUzTitleReady, setIsScreenReady]);
	return (
		<div className="section section-services">
			<div className="title-holder-wrap">
				<PageTitleHolder
					disabled={lang !== 'en'}
					title={titleImgEn}
					onReadyCallback={() => setIsEnTitleReady(true)}
				/>
				<PageTitleHolder
					disabled={lang !== 'uz'}
					title={titleImgUz}
					onReadyCallback={() => setIsUzTitleReady(true)}
				/>
				<PageTitleHolder
					disabled={lang !== 'ru'}
					title={titleImg}
					onReadyCallback={() => setIsRuTitleReady(true)}
				/>
			</div>
			<div className="services">
				{backendData.services.map((s, i) => {
					return <Service key={`service-${i}`} s={s} lang={lang} />;
				})}
			</div>
		</div>
	);
};

export default Services;

const Service = ({ s, lang }) => {
	const [isActive, setIsActive] = useState(false);

	const serviceRef = useRef(null);
	const headerRef = useRef(null);
	const textRef = useRef(null);

	useEffect(() => {
		const headerHeight = headerRef.current.offsetHeight;
		const textHeight = textRef.current.offsetHeight;

		if (isActive) {
			serviceRef.current.style.height = `${headerHeight + textHeight}px`;
		} else {
			serviceRef.current.style.height = `${headerHeight}px`;
		}
	}, [isActive]);

	return (
		<div className={`service ${isActive ? 'active' : ''}`} ref={serviceRef}>
			<div
				className="header"
				ref={headerRef}
				onClick={() => setIsActive(!isActive)}
			>
				<div className="title">{s.title[lang]}</div>
				<div className="open-button">
					<img src={chevron} alt="chevron" />
				</div>
			</div>
			<p ref={textRef}>{s.text[lang]}</p>
		</div>
	);
};
