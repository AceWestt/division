import React, { useEffect, useRef, useState } from 'react';
import { caseCats, cases } from './home/sampleCases';
import { Link } from 'react-router-dom';
import titleImg from '../images/page-title-cases.svg';
import { useAppContext } from '../appContext';
import MobileCatShevron from '../compontents/home/svgComponents/MobileCatShevron';
import PageTitleHolder from '../compontents/PageTitleHolder';

const Cases = () => {
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
			<div className="section section-home section-cases">
				<PageTitleHolder title={titleImg} />
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
						<Link to="/cases" className="btn btn-primary btn-outlined">
							Eще
						</Link>
					</div>
				</div>
			</div>
		);
	}
	return '';
};

export default Cases;

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
