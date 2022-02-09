import React, { useEffect, useRef, useState } from 'react';
import PageTitleHolder from '../compontents/PageTitleHolder';
import titleImg from '../images/page-title-services.svg';
import chevron from '../images/right-chevron-ICN.svg';
import { useAppContext } from '../appContext';

const Services = () => {
	const { setIsFooterDisabled, lang, backendData } = useAppContext();
	useEffect(() => {
		setIsFooterDisabled(false);
	}, [setIsFooterDisabled]);
	return (
		<div className="section section-services">
			<PageTitleHolder title={titleImg} />
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
