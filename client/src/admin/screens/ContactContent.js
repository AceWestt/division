import React, { useRef, useState, useEffect } from 'react';
import FormWrapper from '../components/FormWrapper';
import SingleInput from '../components/SingleInput';
import MultiLangInputField from '../components/MultiLangInputField';
import ReadOnlyToggle from '../components/ReadOnlyToggle';
import { Schema, Message, Form, ButtonToolbar, Button, toaster } from 'rsuite';
import axios from 'axios';
import { useAxiosGet } from '../../common/hooks/useAxiosGet';

const ContactContent = ({ history }) => {
	const model = Schema.Model({
		email: Schema.Types.StringType()
			.isRequired('Введите текст!')
			.isEmail('Неправильный email!'),
		phone: Schema.Types.StringType().isRequired('Введите текст!'),
		facebook: Schema.Types.StringType()
			.isRequired('Введите текст!')
			.isURL('Неправильный URL'),
		instagram: Schema.Types.StringType()
			.isRequired('Введите текст!')
			.isURL('Неправильный URL'),
		addressRu: Schema.Types.StringType().isRequired('Введите текст на русском!'),
		addressEn: Schema.Types.StringType().isRequired(
			'Введите текст на английском!'
		),
		addressUz: Schema.Types.StringType().isRequired(
			'Введите текст на узбекском!'
		),
		officeCoordLong: Schema.Types.StringType()
			.isRequired('Введтие долготу офиса')
			.pattern(/^-?[0-9]{1,3}(?:\.[0-9]{1,10})?$/, 'Неверное значение'),
		officeCoordLat: Schema.Types.StringType()
			.isRequired('Введтие широту офиса')
			.pattern(/^-?[0-9]{1,3}(?:\.[0-9]{1,10})?$/, 'Неверное значение'),
	});

	const formRef = useRef(null);
	const [formError, setFormError] = useState({});
	const [formValue, setFormValue] = useState({
		email: '',
		phone: '',
		facebook: '',
		instagram: '',
		addressRu: '',
		addressEn: '',
		addressUz: '',
		officeCoordLong: '',
		officeCoordLat: '',
	});

	const [isReady, setIsReady] = useState(false);
	const [isEditable, setIsEditable] = useState(false);
	const [id, setId] = useState(null);

	const { data, success, error, fetchData } = useAxiosGet('/api/contactcontent');

	useEffect(() => {
		if (error) {
			if (error.response.data.error) {
				toaster.push(errorMessage(error.response.data.error), {
					placement: messagePlacement,
				});
			} else {
				toaster.push(errorMessage('Не удалось Получить данные!'), {
					placement: messagePlacement,
				});
			}
		}
		if (success) {
			setIsReady(true);
			setId(data._id);
			setFormValue({
				email: data.email,
				phone: data.phone,
				facebook: data.facebook,
				instagram: data.instagram,
				addressRu: data.address.ru,
				addressEn: data.address.en,
				addressUz: data.address.uz,
				officeCoordLong: data.officeCoords.long,
				officeCoordLat: data.officeCoords.lat,
			});
		}
	}, [data, success, error]);

	const errorMessage = (error) => {
		return (
			<Message showIcon type="error">
				{error}
			</Message>
		);
	};
	const successMessage = () => {
		return (
			<Message showIcon type="success" duration={5000}>
				<b>Успех!</b>
				<br />
				Пожалуйста, не забудьте включить редактирование перед тем как снова
				приступить к работе.
			</Message>
		);
	};
	const messagePlacement = 'topCenter';

	const onSubmit = async () => {
		if (formRef.current.check()) {
			setIsReady(false);
			setIsEditable(false);

			const body = {
				email: formValue.email,
				phone: formValue.phone,
				facebook: formValue.facebook,
				instagram: formValue.instagram,
				address: {
					ru: formValue.addressRu,
					en: formValue.addressEn,
					uz: formValue.addressUz,
				},
				officeCoords: {
					long: formValue.officeCoordLong,
					lat: formValue.officeCoordLat,
				},
			};

			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			};

			try {
				const { data } = await axios.put(`/api/contactcontent/${id}`, body, config);

				if (data.status === 'success') {
					setIsReady(true);
					toaster.push(successMessage(), {
						placement: messagePlacement,
					});
					fetchData();
				}
			} catch (error) {
				if (error.response.data.error) {
					toaster.push(errorMessage(error.response.data.error), {
						placement: messagePlacement,
					});
				} else {
					toaster.push(errorMessage('Не удалось сохранить изменения!'), {
						placement: messagePlacement,
					});
				}
			}
		}
	};
	return (
		<FormWrapper
			customClass="general-content-form"
			formRef={formRef}
			onChange={setFormValue}
			onCheck={setFormError}
			model={model}
			formValue={formValue}
			onSubmit={onSubmit}
			readOnly={!isEditable}
		>
			<ReadOnlyToggle
				checked={isEditable}
				loading={!isReady}
				disabled={!isReady}
				onChange={setIsEditable}
			/>
			<SingleInput
				name="email"
				label="Email"
				popoverProps={{
					text: 'Email',
				}}
				error={formError.email}
			/>
			<SingleInput
				name="phone"
				label="Номер телефона"
				popoverProps={{
					text: 'Номер телефона',
				}}
				error={formError.phone}
			/>
			<SingleInput
				name="facebook"
				label="Ссылка на facebook аккаунт"
				popoverProps={{
					text: 'Ссылка на facebook аккаунт',
				}}
				error={formError.facebook}
			/>
			<SingleInput
				name="instagram"
				label="Ссылка на instagram аккаунт"
				popoverProps={{
					text: 'Ссылка на instagram аккаунт',
				}}
				error={formError.instagram}
			/>
			<MultiLangInputField
				runame="addressRu"
				enname="addressEn"
				uzname="addressUz"
				label="Адрес офиса"
				popoverProps={{
					text: 'Адрес офиса',
				}}
				ruerror={formError.addressRu}
				enerror={formError.addressEn}
				uzerror={formError.addressUz}
				textarea
			/>

			<MultiLangInputField
				runame="officeCoordLong"
				enname="officeCoordLat"
				label="Координаты офиса на карте"
				popoverProps={{
					text: 'Координаты офиса на карте',
				}}
				multiText="д/ш"
				tooltipText="Долгота (слева) / широта (справа)"
				ruerror={formError.officeCoordLong}
				enerror={formError.officeCoordLat}
			/>

			<Form.Group>
				<ButtonToolbar>
					<Button
						appearance="primary"
						color="cyan"
						loading={!isReady}
						disabled={!isEditable}
						type="submit"
					>
						Сохранить
					</Button>
				</ButtonToolbar>
			</Form.Group>
		</FormWrapper>
	);
};

export default ContactContent;
