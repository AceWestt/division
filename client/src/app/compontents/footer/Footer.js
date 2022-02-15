import React, { useEffect, useRef } from 'react';
import phoneIcn from '../../images/footer-phone-ICN.svg';
import emailIcn from '../../images/footer-email-ICN.svg';
import logo from '../../images/footer-logo.svg';
import { useAppContext } from '../../appContext';
import { useForm } from 'react-hook-form';
import { Message, toaster } from 'rsuite';
import axios from 'axios';

const Footer = ({ footerRef }) => {
	const { smallScreen, isFooterDisabled, isSoundOn, lang, backendData } =
		useAppContext();

	const musicRef = useRef(null);

	useEffect(() => {
		if (musicRef.current) {
			if (isSoundOn) {
				musicRef.current.play();
			} else {
				musicRef.current.pause();
			}
		}
	}, [isSoundOn]);

	const successMessage = (type, msg) => {
		return (
			<Message showIcon type={type} duration={5000}>
				{msg}
			</Message>
		);
	};

	const { register, handleSubmit } = useForm();

	const onSubmit = async (data) => {
		const { message, phone, name, email } = data.user;
		let noNameError = 'Вы не указали имя';
		let nophoneError = 'Вы не указали телефон';
		let noEmailError = 'Вы не указали email';
		let noMessageError = 'Вы ничего не написали';
		let succesMessage =
			'Сообщение отправлено. Наш оператор скоро с вами свяжется';
		let errorMessage = 'Ошибка. Повторите еще раз пожалуйста';

		if (lang === 'en') {
			noNameError = 'Вы не указали имя en';
			nophoneError = 'Вы не указали телефон en';
			noEmailError = 'Вы не указали email en';
			noMessageError = 'Вы ничего не написали en';
			succesMessage =
				'Сообщение отправлено. Наш оператор скоро с вами свяжется en';
			errorMessage = 'Ошибка. Повторите еще раз пожалуйста en';
		}
		if (lang === 'uz') {
			noNameError = 'Вы не указали имя uz';
			nophoneError = 'Вы не указали телефон uz';
			noEmailError = 'Вы не указали email uz';
			noMessageError = 'Вы ничего не написали uz';
			succesMessage =
				'Сообщение отправлено. Наш оператор скоро с вами свяжется uz';
			errorMessage = 'Ошибка. Повторите еще раз пожалуйста uz';
		}
		if (!name) {
			toaster.push(successMessage('error', noNameError), {
				placement: 'bottomEnd',
			});
		}
		if (!phone) {
			toaster.push(successMessage('error', nophoneError), {
				placement: 'bottomEnd',
			});
		}
		if (!email) {
			toaster.push(successMessage('error', noEmailError), {
				placement: 'bottomEnd',
			});
		}
		if (!message) {
			toaster.push(successMessage('error', noMessageError), {
				placement: 'bottomEnd',
			});
		}
		if (message && phone && name && email) {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};

			try {
				const { data } = await axios.post(
					'/api/message',
					{
						message,
						name,
						phone,
						email,
					},
					config
				);
				if (data.status === 'success') {
					toaster.push(successMessage('success', succesMessage), {
						placement: 'bottomEnd',
					});
				} else {
					toaster.push(
						successMessage(
							'error',
							lang === 'ru'
								? 'Ошибка. Повторите еще раз пожалуйста'
								: 'Error. Please, repeat again'
						),
						{
							placement: 'bottomEnd',
						}
					);
				}
			} catch (error) {
				toaster.push(successMessage('error', errorMessage), {
					placement: 'bottomEnd',
				});
			}
		}
	};

	if (isFooterDisabled) {
		return '';
	}

	return (
		<div className="section section-footer" ref={footerRef}>
			<h4>
				{lang === 'en'
					? 'Write to us,\nour specialists will contact\nwith you soon'
					: lang === 'uz'
					? 'Bizga xat yozing,\nmutaxassislarimiz tez orada\nsiz bilan bog‘lanadi'
					: 'Напишите нам,\nнаши специалисты свяжутся\nс вами в ближайшее время'}
			</h4>

			<div className="block contact-block">
				<div className="side form-side">
					<form className="footer-form" onSubmit={handleSubmit(onSubmit)}>
						<div className="footer-form-control half name">
							<input
								type="text"
								placeholder={lang === 'ru' ? 'Имя*' : lang === 'en' ? 'Name*' : 'Ism*'}
								{...register('user.name')}
							/>
						</div>
						<div className="footer-form-control half email">
							<input
								type="text"
								placeholder={
									lang === 'ru' ? 'Почта*' : lang === 'en' ? 'Email*' : 'Email*'
								}
								{...register('user.email')}
							/>
						</div>
						<div className="footer-form-control phone">
							<input
								type="text"
								placeholder={
									lang === 'ru' ? 'Телефон*' : lang === 'en' ? 'Phone*' : 'Telefon*'
								}
								{...register('user.phone')}
							/>
						</div>
						<div className="footer-form-control msg">
							<input
								type="text"
								placeholder={
									lang === 'ru'
										? 'Пару слов о проекте...*'
										: lang === 'en'
										? 'Few words about the project...'
										: 'Loyiha haqida bir necha so`z*'
								}
								{...register('user.message')}
							/>
						</div>
						<div className="footer-form-control warning">
							<p>
								{lang === 'en'
									? 'By submitting information, you agree to the privacy policy'
									: lang === 'uz'
									? 'Ma’lumotlarni to‘ldirish orqali siz maxfiylik siyosatiga rozilik bildirasiz'
									: 'Заполняя данные, вы соглашаетесь с политикой конфиденциальности'}
							</p>
						</div>
						<div className="footer-form-control submit">
							<button className="btn btn-outlined btn-footer" type="submit">
								{lang === 'en' ? 'Send' : lang === 'uz' ? ' Yuborish' : 'Отправить'}
							</button>
						</div>
					</form>
				</div>
				<div className="side contact-details-side">
					<div className="item phone">
						<label>
							{lang === 'en' ? 'Phone' : lang === 'uz' ? 'Telefon' : 'Телефон'}
						</label>
						<a
							href={`tel:${backendData.contactContent.phone}`}
							className="btn btn-with-icon btn-link btn-footer"
						>
							<img src={phoneIcn} alt="phone" />{' '}
							<span>{backendData.contactContent.phone}</span>
						</a>
					</div>
					<div className="item email">
						<label>
							{lang === 'en' ? 'Email' : lang === 'uz' ? 'Pochta' : 'Почта'}
						</label>
						<a
							className="btn btn-with-icon btn-link btn-footer"
							href={`mailto:${backendData.contactContent.email}`}
						>
							<img src={emailIcn} alt="phone" />{' '}
							<span>{backendData.contactContent.email}</span>
						</a>
					</div>
					{smallScreen && (
						<div className="item address">
							<label>Локация</label>
							<span>{backendData.contactContent.address[lang]}</span>
						</div>
					)}
				</div>
			</div>

			<div className="block bottom-block">
				<img src={logo} alt="logo" />
				<div className="social-links">
					<a
						href={backendData.contactContent.instagram}
						className="btn btn-link btn-footer"
					>
						Instagram,
					</a>
					<a
						href={backendData.contactContent.facebook}
						className="btn btn-link btn-footer"
					>
						Facebook
					</a>
				</div>
				<div className="address">{backendData.contactContent.address[lang]}</div>
			</div>
			<audio loop src={backendData.generalContent.musicFile} ref={musicRef}>
				Your browser does not support the audio element.
			</audio>
		</div>
	);
};

export default Footer;
