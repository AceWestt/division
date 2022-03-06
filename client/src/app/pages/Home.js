import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import LogoHolder from './home/LogoHolder';
import { useAppContext } from '../appContext';
import MobileCatShevron from '../compontents/home/svgComponents/MobileCatShevron';
import { getFilteredCases } from '../utils/tools/arrayTools';
import OnImagesLoaded from 'react-on-images-loaded';

const Home = () => {
	const {
		smallScreen,
		lang,
		setIsFooterDisabled,
		backendData,
		setIsScreenReady,
	} = useAppContext();

	const [activeCat, setActiveCat] = useState({
		id: '-1',
		title:
			lang === 'ru' ? 'Все кейсы' : lang === 'en' ? 'All Cases' : 'Barcha keyslar',
	});

	const [ready, setReady] = useState(false);

	const imagesHolderRef = useRef(null);
	const [isLogoReady, setIsLogoReady] = useState(false);
	const [areImagesReady, setAreImagesReady] = useState(false);

	useEffect(() => {
		if (isLogoReady && areImagesReady) {
			setIsScreenReady(true);
		} else {
			setIsScreenReady(false);
		}
	}, [isLogoReady, areImagesReady, setIsScreenReady]);

	useEffect(() => {
		let timeout = setTimeout(() => {
			setReady(true);
		}, 100);

		return () => clearTimeout(timeout);
	}, []);

	useEffect(() => {
		setIsFooterDisabled(false);
	}, [setIsFooterDisabled]);

	const getCatNameForDesc = (id) => {
		let catname = '';
		const cat = backendData?.cases?.categories?.filter((f) => f._id === id)[0];
		if (cat && cat.name) {
			catname = cat.name[lang];
		}
		return catname;
	};

	if (ready) {
		return (
			<div className="section section-home">
				<LogoHolder onReadyCallBack={() => setIsLogoReady(true)} />

				<div className="cases-wrap" ref={imagesHolderRef}>
					<CatBlock
						setActiveCat={setActiveCat}
						activeCat={activeCat}
						smallScreen={smallScreen}
						lang={lang}
						categories={backendData.cases.categories}
					/>
					{backendData.cases.cases && backendData.cases.cases.length > 0 && (
						<OnImagesLoaded
							onLoaded={() => setAreImagesReady(true)}
							onTimeOut={() => setAreImagesReady(true)}
							timeout={7000}
						>
							<div className="cases">
								{getFilteredCases(backendData.cases.cases, activeCat)
									.slice(0, 30)
									.map((c, index) => {
										let item = null;
										let mobileClass = 'mobile-full';
										if (c.mobileWidth && c.mobileWidth === 1) {
											mobileClass = 'mobile-half';
										}

										if (activeCat.id !== '-1') {
											mobileClass = 'mobile-half';
										}

										item = c;

										if (item) {
											return (
												<Link
													to={`/cases/${item._id}`}
													className={`case ${mobileClass}`}
													key={`case-${item._id}`}
												>
													<img src={item.preview} alt="case" />
													<div className="desc-block">
														<div className="bg"></div>
														<div className="wrap">
															<div className="title">{item.title[lang]}</div>
															<div className="description">
																{item.description?.[lang] || ''}
															</div>
															<div className="cat-title">
																{getCatNameForDesc(item.category_id)}
															</div>
														</div>
													</div>
												</Link>
											);
										}
										return '';
									})}
							</div>
						</OnImagesLoaded>
					)}

					<div className="btn-holder">
						<Link to="/cases" className="btn btn-primary">
							{lang === 'en'
								? 'View all cases'
								: lang === 'uz'
								? ' Barcha keyslarni ko‘rish'
								: 'Посмотреть все кейсы'}
						</Link>
					</div>
				</div>
				<div className="blocks">
					<AwardBlock backendData={backendData} lang={lang} />
					<ClientsBlock
						activeCat={activeCat}
						smallScreen={smallScreen}
						backendData={backendData}
						lang={lang}
					/>
				</div>
			</div>
		);
	}

	return '';
};

export default Home;

const CatBlock = ({
	setActiveCat,
	activeCat,
	smallScreen,
	lang,
	categories,
}) => {
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
				setCatWrapHeight(mobileActiveCatHeight + 1);
			}
		}
	}, [isMobileCatsOpen]);

	const handleCatClick = (c) => {
		setIsMobileCatsOpen(false);
		setActiveCat({ id: c._id, title: c.name[lang] });
	};

	if (!categories || categories.length < 1) {
		return '';
	}

	if (smallScreen) {
		return (
			<div className="mobile-categories">
				<div
					className={`categories-wrap ${isMobileCatsOpen ? 'open' : ''}`}
					style={{ height: catWrapHeight }}
				>
					<div className="cat-list" ref={mobileCatListRef}>
						{activeCat.id !== '-1' && (
							<div
								className="cat"
								onClick={() =>
									handleCatClick({
										_id: '-1',
										name: {
											ru: 'Все кейсы',
											en: 'All Cases',
											uz: 'Barcha keyslar',
										},
									})
								}
							>
								Все кейсы
							</div>
						)}
						{categories.map((c, i) => {
							if (c._id === activeCat.id) {
								return '';
							}
							return (
								<div className="cat" key={i} onClick={() => handleCatClick(c)}>
									{c.name[lang]}
								</div>
							);
						})}
					</div>
					<div
						className="chosen-cat"
						onClick={() => setIsMobileCatsOpen(!isMobileCatsOpen)}
						ref={mobileActiveCatRef}
					>
						<span>{activeCat.title}</span>
						<MobileCatShevron />
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className="categories">
			<div
				className={`cat ${activeCat.id === '-1' ? 'active' : ''}`}
				onClick={() =>
					setActiveCat({
						id: '-1',
						title:
							lang === 'ru'
								? 'Все кейсы'
								: lang === 'en'
								? 'All Cases'
								: 'Barcha keyslar',
					})
				}
			>
				{lang === 'ru'
					? 'Все кейсы'
					: lang === 'en'
					? 'All Cases'
					: 'Barcha keyslar'}
			</div>

			{categories.map((cat, index) => {
				return (
					<div
						className={`cat ${activeCat.id === cat._id ? 'active' : ''}`}
						onClick={() => setActiveCat({ id: cat._id, title: cat.name[lang] })}
						key={`case-cat-${cat.id}`}
					>
						{cat.name[lang]}
					</div>
				);
			})}
		</div>
	);
};

const AwardBlock = ({ backendData, lang }) => {
	const columns = useRef([]);

	useEffect(() => {
		if (columns.current.length > 0) {
			columns.current.map((c, index) => {
				let startingX = '-=100%';
				let x = '+=100%';
				if (index % 2 === 0) {
					startingX = '0';
					x = '-=100%';
				}
				gsap.fromTo(
					c.children,
					{ x: startingX },
					{ x: x, duration: 60, repeat: -1, ease: 'none' }
				);
				return c;
			});
		}
	}, []);

	return (
		<div className="block awards">
			<h3>
				{lang === 'en' ? 'Awards' : lang === 'uz' ? ' Sovrinlar' : 'Награды'}
			</h3>
			{backendData.awards && backendData.awards.length > 0 && (
				<div className="award-list">
					{backendData.awards.map((a, index) => {
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
												<span>{a.name}</span>
												<img src={a.logo} alt="award" />
												<span>/</span>
											</div>
										);
									})}
								</div>
								<div className="row-content second">
									{[...Array(20)].map((e, i) => {
										return (
											<div className="award" key={`award-of-${index}-first-content-${i}`}>
												<span>{a.name}</span>
												<img src={a.logo} alt="award" />
												<span>/</span>
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

const ClientsBlock = ({ activeCat, smallScreen, backendData, lang }) => {
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

	if (smallScreen) {
		return (
			<div className="block clients-block" ref={clientsBlockRef}>
				<h3>
					{lang === 'en' ? 'Clients' : lang === 'uz' ? ' Mijozlar' : 'Клиенты'}
				</h3>
				<div className="client-list" ref={clientListRef}>
					<div className={`row`}>
						{backendData.clients.map((cg, index) => {
							return cg.map((c, i) => {
								if (c.hideOnMobile) {
									return '';
								}
								return (
									<div className="client" key={`client-${i}`}>
										<img src={c.logo} alt="client" />
									</div>
								);
							});
						})}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="block clients-block" ref={clientsBlockRef}>
			<h3>
				{lang === 'en' ? 'Clients' : lang === 'uz' ? ' Mijozlar' : 'Клиенты'}
			</h3>
			<div className="client-list" ref={clientListRef}>
				{backendData.clients.map((cg, index) => {
					return (
						<div className={`row`} key={`clients-group-${index}`}>
							{cg.map((c, i) => {
								return (
									<div className="client" key={`client-${i}`}>
										<img src={c.logo} alt="client" />
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
