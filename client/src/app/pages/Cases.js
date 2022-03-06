import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import titleImg from '../images/page-title-cases.svg';
import titleImgEn from '../images/page-title-cases-en.svg';
import titleImgUz from '../images/page-title-cases-uz.svg';
import { useAppContext } from '../appContext';
import MobileCatShevron from '../compontents/home/svgComponents/MobileCatShevron';
import PageTitleHolder from '../compontents/PageTitleHolder';
import { getFilteredCases } from '../utils/tools/arrayTools';
import OnImagesLoaded from 'react-on-images-loaded';

const Cases = () => {
	const {
		smallScreen,
		setIsFooterDisabled,
		backendData,
		lang,
		setIsScreenReady,
	} = useAppContext();

	const [activeCat, setActiveCat] = useState({
		id: '-1',
		title:
			lang === 'ru' ? 'Все кейсы' : lang === 'en' ? 'All Cases' : 'Barcha keyslar',
	});

	const [ready, setReady] = useState(false);
	const [limit, setLimit] = useState(30);

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

	const [isRuTitleReady, setIsRuTitleReady] = useState(false);
	const [isEnTitleReady, setIsEnTitleReady] = useState(false);
	const [isUzTitleReady, setIsUzTitleReady] = useState(false);
	const [areImagesReady, setAreImagesReady] = useState(false);

	useEffect(() => {
		if (isRuTitleReady && isEnTitleReady && isUzTitleReady && areImagesReady) {
			setIsScreenReady(true);
		} else {
			setIsScreenReady(false);
		}
	}, [
		isRuTitleReady,
		isEnTitleReady,
		isUzTitleReady,
		areImagesReady,
		setIsScreenReady,
	]);

	if (ready) {
		return (
			<div className="section section-home section-cases">
				<div className="title-holder-wrap">
					<PageTitleHolder
						disabled={lang !== 'en'}
						title={titleImgEn}
						onReadyCallback={() => setIsRuTitleReady(true)}
					/>
					<PageTitleHolder
						disabled={lang !== 'uz'}
						title={titleImgUz}
						onReadyCallback={() => setIsEnTitleReady(true)}
					/>
					<PageTitleHolder
						disabled={lang !== 'ru'}
						title={titleImg}
						onReadyCallback={() => setIsUzTitleReady(true)}
					/>
				</div>
				<div className="cases-wrap">
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
							onTimeout={() => setAreImagesReady(true)}
							timeout={7000}
						>
							<div className="cases">
								{getFilteredCases(backendData.cases.cases, activeCat)
									.splice(0, limit)
									.map((c, index) => {
										let mobileClass = 'mobile-full';
										if (c.mobileWidth && c.mobileWidth === 1) {
											mobileClass = 'mobile-half';
										}

										if (activeCat.id !== '-1') {
											mobileClass = 'mobile-half';
										}

										if (c) {
											return (
												<Link
													to={`/cases/${c._id}`}
													className={`case ${mobileClass}`}
													key={`case-${c._id}`}
												>
													<img src={c.preview} alt="case" />
													<div className="desc-block">
														<div className="bg"></div>
														<div className="wrap">
															<div className="title">{c.title[lang]}</div>
															<div className="description">{c.description?.[lang] || ''}</div>
															<div className="cat-title">
																{getCatNameForDesc(c.category_id)}
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

					{getFilteredCases(backendData.cases.cases, activeCat).length > limit && (
						<div className="btn-holder">
							<Link
								to="/cases"
								className="btn btn-primary btn-outlined"
								onClick={() => setLimit(limit + 10)}
							>
								Eще
							</Link>
						</div>
					)}
				</div>
			</div>
		);
	}
	return '';
};

export default Cases;

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
