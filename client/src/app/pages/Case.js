import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { cases } from './home/sampleCases';

const Case = () => {
	const match = useRouteMatch();
	const caseID = match.params.id;
	const currentCase = cases[caseID - 1];
	return (
		<div className="section section-case">
			<div className="title">{currentCase.title}</div>
			<div className="subtitle">{currentCase.subtitle}</div>
			<div className="block client">
				<label>О клиенте</label>
				<div className="text">
					<p>{currentCase.aboutClient}</p>
				</div>
			</div>
			<div className="hero">
				<img src={currentCase.heroImg} alt="hero" />
			</div>
			<div className="block idea">
				<label>Идея</label>
				<div className="text">
					<p>{currentCase.idea}</p>
				</div>
			</div>
			<div className="gallery">
				<div className="imgs">
					{currentCase.gallery.map((i, n) => {
						return (
							<img src={i} alt="img" key={`gallery_img_${currentCase.id}-${n}`} />
						);
					})}
				</div>
			</div>
			<div className="btn-holder">
				<Link to="/cases" className="btn btn-primary btn-outlined">
					Все кейсы
				</Link>
			</div>
		</div>
	);
};

export default Case;
