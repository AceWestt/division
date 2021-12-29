import React, { useEffect, useRef, useState } from 'react';
import { caseCats, cases } from './home/sampleCases';
import { clients } from './home/sampleClients';
import { Link } from 'react-router-dom';
import pentawards from '../images/pentawards.svg';
import tafAward from '../images/taf-award.svg';
import redjolbors from '../images/redjolbors-award.svg';
import adstarsAward from '../images/adstars-award.svg';
import gsap from 'gsap';
import LogoHolder from './home/LogoHolder';
import { useAppContext } from '../appContext';
import MobileCatShevron from '../compontents/home/svgComponents/MobileCatShevron';

const Home = () => {
	const { smallScreen, setIsFooterDisabled } = useAppContext();

	const [activeCat, setActiveCat] = useState(0);

	const [ready, setReady] = useState(false);

	useEffect(() => {
		let timeout = setTimeout(() => {
			setReady(true);
		}, 100);

		return () => clearTimeout(timeout);
	}, []);

	useEffect(() => {
		setIsFooterDisabled(false);
	}, [setIsFooterDisabled]);

	if (ready) {
		return (
			<div className="section section-home">
				<LogoHolder />

				<div className="cases-wrap">
					<CatBlock
						setActiveCat={setActiveCat}
						activeCat={activeCat}
						smallScreen={smallScreen}
					/>
					<div className="cases">
						{cases.map((c, index) => {
							let item = null;
							let mobileClass = 'mobile-full';
							let mobileOrder = null;
							if (c.mobileWidth && c.mobileWidth === 1) {
								mobileClass = 'mobile-half';
							}

							if (activeCat > 0) {
								mobileClass = 'mobile-half';
							}

							if (smallScreen) {
								mobileOrder = c.mobileOrder;
							}

							if (activeCat > 0) {
								if (activeCat === c.cat_id) {
									item = c;
								}
							} else {
								item = c;
							}

							if (item) {
								return (
									<Link
										to={`/cases/${c.id}`}
										className={`case ${mobileClass}`}
										key={`case-${c.id}-${index}`}
										style={{ order: mobileOrder ? mobileOrder : 'auto' }}
									>
										<img src={c.img} alt="case" />
									</Link>
								);
							}
							return '';
						})}
					</div>
					<div className="btn-holder">
						<Link to="/cases" className="btn btn-primary">
							Посмотреть все кейсы
						</Link>
					</div>
					<div className="blocks">
						<AwardBlock />
						<ClientsBlock activeCat={activeCat} smallScreen={smallScreen} />
					</div>
				</div>
			</div>
		);
	}

	return '';
};

export default Home;

const CatBlock = ({ setActiveCat, activeCat, smallScreen }) => {
	const [isMobileCatsOpen, setIsMobileCatsOpen] = useState(false);
	const [catWrapHeight, setCatWrapHeight] = useState('36px');

	const mobileActiveCatRef = useRef(null);
	const mobileCatListRef = useRef(null);

	useEffect(() => {
		if (mobileActiveCatRef.current && mobileCatListRef.current) {
			const mobileActiveCatHeight = mobileActiveCatRef.current.offsetHeight;
			const mobileCatListHeight = mobileCatListRef.current.offsetHeight;

			if (isMobileCatsOpen) {
				setCatWrapHeight(mobileCatListHeight);
			} else {
				setCatWrapHeight(mobileActiveCatHeight);
			}
		}
	}, [isMobileCatsOpen]);

	const handleCatClick = (i) => {
		setIsMobileCatsOpen(false);
		setActiveCat(i);
	};

	if (smallScreen) {
		return (
			<div className="mobile-categories">
				<div
					className={`categories-wrap ${isMobileCatsOpen ? 'open' : ''}`}
					style={{ height: catWrapHeight }}
				>
					<div className="cat-list" ref={mobileCatListRef}>
						{activeCat !== 0 && (
							<div className="cat" onClick={() => handleCatClick(0)}>
								Все кейсы
							</div>
						)}
						{caseCats.map((c, i) => {
							if (c.id === activeCat) {
								return '';
							}
							return (
								<div className="cat" key={i} onClick={() => handleCatClick(c.id)}>
									{c.title.ru}
								</div>
							);
						})}
					</div>
					<div
						className="chosen-cat"
						onClick={() => setIsMobileCatsOpen(!isMobileCatsOpen)}
						ref={mobileActiveCatRef}
					>
						<span>
							{activeCat === 0 ? 'Все кейсы' : caseCats[activeCat - 1].title.ru}
						</span>
						<MobileCatShevron />
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className="categories">
			<div
				className={`cat ${activeCat === 0 ? 'active' : ''}`}
				onClick={() => setActiveCat(0)}
			>
				Все кейсы
			</div>
			{caseCats.map((cat, index) => {
				return (
					<div
						className={`cat ${activeCat === cat.id ? 'active' : ''}`}
						onClick={() => setActiveCat(cat.id)}
						key={`case-cat-${cat.id}`}
					>
						{cat.title.ru}
					</div>
				);
			})}
		</div>
	);
};

const AwardBlock = () => {
	const columns = useRef([]);

	useEffect(() => {
		gsap.fromTo(
			columns.current[0].children,
			{ x: '0' },
			{ x: '-=100%', duration: 60, repeat: -1, ease: 'none' }
		);
		gsap.fromTo(
			columns.current[1].children,
			{ x: '-=100%' },
			{ x: '0', duration: 60, repeat: -1, ease: 'none' }
		);
		gsap.fromTo(
			columns.current[2].children,
			{ x: '0' },
			{ x: '-=100%', duration: 60, repeat: -1, ease: 'none' }
		);
		gsap.fromTo(
			columns.current[3].children,
			{ x: '-=100%' },
			{ x: '0', duration: 60, repeat: -1, ease: 'none' }
		);
	}, []);

	return (
		<div className="block awards">
			<h3>Награды</h3>
			<div className="award-list">
				{awards.map((a, index) => {
					let right = false;
					if ((index + 1) % 2 === 0) {
						right = true;
					}
					return (
						<div
							className={`row ${right ? 'right' : ''}`}
							key={`award-row-${index}`}
							ref={(e) => {
								if (e) {
									columns.current[index] = e;
								}
							}}
						>
							<div className="row-content first">
								{[...Array(20)].map((e, i) => {
									return (
										<div className="award" key={`award-of-${index}-first-content-${i}`}>
											<span>{a.title}</span>
											<img src={a.icn} alt="award" />
											<span>/</span>
										</div>
									);
								})}
							</div>
							<div className="row-content second">
								{[...Array(20)].map((e, i) => {
									return (
										<div className="award" key={`award-of-${index}-first-content-${i}`}>
											<span>{a.title}</span>
											<img src={a.icn} alt="award" />
											<span>/</span>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const ClientsBlock = ({ activeCat, smallScreen }) => {
	const clientListRef = useRef(null);
	const clientsBlockRef = useRef(null);

	useEffect(() => {
		if (smallScreen) {
			gsap.set(clientListRef.current.children, { x: '0' });
		}
		if (!smallScreen) {
			gsap.to(clientListRef.current.children, {
				x: '0',
				scrollTrigger: {
					trigger: clientsBlockRef.current,
					scrub: true,
					end: '100% 100%',
				},
				ease: 'none',
			});
		}
	}, [activeCat, smallScreen]);

	return (
		<div className="block clients-block" ref={clientsBlockRef}>
			<h3>Клиенты</h3>
			<div className="client-list" ref={clientListRef}>
				{clients.map((cg, index) => {
					return (
						<div className={`row`} key={`clients-group-${index}`}>
							{cg.map((c, i) => {
								return (
									<div className="client" key={`client-${i}`}>
										<img src={c} alt="client" />
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const awards = [
	{ title: 'pentawards shortlist', icn: pentawards },
	{ title: 'taf!', icn: tafAward },
	{ title: 'redjolbors', icn: redjolbors },
	{ title: 'adstars shortlist', icn: adstarsAward },
];
