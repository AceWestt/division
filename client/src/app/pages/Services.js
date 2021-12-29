import React, { useEffect, useRef, useState } from 'react';
import PageTitleHolder from '../compontents/PageTitleHolder';
import titleImg from '../images/page-title-services.svg';
import chevron from '../images/right-chevron-ICN.svg';
import { useAppContext } from '../appContext';

const Services = () => {
	const { setIsFooterDisabled } = useAppContext();
	useEffect(() => {
		setIsFooterDisabled(false);
	}, [setIsFooterDisabled]);
	return (
		<div className="section section-services">
			<PageTitleHolder title={titleImg} />
			<div className="services">
				{servicesSample.map((s, i) => {
					return <Service key={`service-${i}`} s={s} />;
				})}
			</div>
		</div>
	);
};

export default Services;

const Service = ({ s }) => {
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
				<div className="title">{s.title}</div>
				<div className="open-button">
					<img src={chevron} alt="chevron" />
				</div>
			</div>
			<p ref={textRef}>{s.text}</p>
		</div>
	);
};

const servicesSample = [
	{
		title: 'Брендинг',
		text:
			'Как невозможно себе представить человека без лица, так и нельзя назвать компанию брендом, если у нее нет своего образа.',
	},
	{
		title: 'Стратегия',
		text:
			'Когда нельзя допустить ни одной ошибки, человеку необходимо внимательно продумывать каждый свой шаг. И в этом случае, лучший инструмент – это стратегия.',
	},
	{
		title: 'Диджитал',
		text:
			'Интернет-среда – прекрасный способ общения со всем миром. И не только для людей, но и для бренда.',
	},
	{
		title: 'Дизайн',
		text:
			'Встречают по одежке. С брендом также – первое впечатление клиента зависит от того, насколько правильно продуман его дизайн.',
	},
	{
		title: 'Сайты',
		text:
			'Сайт – это визитная карточка бренда, которая знакомит его с потребителями в интернет-пространстве.',
	},
];
