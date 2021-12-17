import React from 'react';
import phoneIcn from '../../images/footer-phone-ICN.svg';
import emailIcn from '../../images/footer-email-ICN.svg';
import logo from '../../images/footer-logo.svg';
import { useAppContext } from '../../appContext';

const Footer = () => {
	const { smallScreen, isFooterDisabled } = useAppContext();

	const onSubmit = (e) => {
		e.preventDefault();
	};

	if (isFooterDisabled) {
		return '';
	}

	return (
		<div className="section section-footer">
			<h4>
				Напишите нам, <br />
				наши специалисты свяжутся
				<br /> с вами в ближайшее время
			</h4>
			<div className="block contact-block">
				<div className="side form-side">
					<form className="footer-form" onSubmit={onSubmit}>
						<div className="footer-form-control half name">
							<input type="text" placeholder="Имя*" />
						</div>
						<div className="footer-form-control half email">
							<input type="text" placeholder="Почта*" />
						</div>
						<div className="footer-form-control phone">
							<input type="text" placeholder="Телефон*" />
						</div>
						<div className="footer-form-control msg">
							<input type="text" placeholder="Пару слов о проекте*" />
						</div>
						<div className="footer-form-control warning">
							<p>Заполняя данные, вы соглашаетесь с политикой конфиденциалности</p>
						</div>
						<div className="footer-form-control submit">
							<button className="btn btn-outlined btn-footer" type="submit">
								Отправить
							</button>
						</div>
					</form>
				</div>
				<div className="side contact-details-side">
					<div className="item phone">
						<label>Номер телефона</label>
						<a
							href="tel:+998 97 268 77 70"
							className="btn btn-with-icon btn-link btn-footer"
						>
							<img src={phoneIcn} alt="phone" /> <span>+ 998 97 268 77 70</span>
						</a>
					</div>
					<div className="item email">
						<label>Почта</label>
						<a
							className="btn btn-with-icon btn-link btn-footer"
							href="mailto:u.ergashev@dvsn.uz"
						>
							<img src={emailIcn} alt="phone" /> <span>u.ergashev@dvsn.uz</span>
						</a>
					</div>
					{smallScreen && (
						<div className="item address">
							<label>Локация</label>
							<span>г. Ташкент улица Тадбиркор 78</span>
						</div>
					)}
				</div>
			</div>
			<div className="block bottom-block">
				<img src={logo} alt="logo" />
				<div className="social-links">
					<a href="https://www.instagram.com/" className="btn btn-link btn-footer">
						Instagram,
					</a>
					<a href="https://www.facebook.com/" className="btn btn-link btn-footer">
						Facebook
					</a>
				</div>
				<div className="address">г. Ташкент улица Тадбиркор 78</div>
			</div>
		</div>
	);
};

export default Footer;
