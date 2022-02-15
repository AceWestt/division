import React, { useRef, useState, useEffect } from 'react';
import FormWrapper from '../components/FormWrapper';
import FileUploader from '../components/FileUploader';
import ReadOnlyToggle from '../components/ReadOnlyToggle';
import { Schema, Message, Form, ButtonToolbar, Button, toaster } from 'rsuite';
import axios from 'axios';
import { useAxiosGet } from '../../common/hooks/useAxiosGet';

const GeneralContent = ({ history }) => {
	const model = Schema.Model({
		mainLinkGif: Schema.Types.ArrayType().of(
			Schema.Types.ObjectType().shape({
				blobFile: Schema.Types.ObjectType().shape({
					name: Schema.Types.StringType().pattern(
						/^.*\.(gif)$/i,
						'Неверный формат файла! Разрешен только "gif" '
					),
					size: Schema.Types.NumberType().max(
						5242880,
						'Размер файла не может превышать 5mb'
					),
				}),
			})
		),
		aboutLinkGif: Schema.Types.ArrayType().of(
			Schema.Types.ObjectType().shape({
				blobFile: Schema.Types.ObjectType().shape({
					name: Schema.Types.StringType().pattern(
						/^.*\.(gif)$/i,
						'Неверный формат файла! Разрешен только "gif" '
					),
					size: Schema.Types.NumberType().max(
						5242880,
						'Размер файла не может превышать 5mb'
					),
				}),
			})
		),
		casesLinkGif: Schema.Types.ArrayType().of(
			Schema.Types.ObjectType().shape({
				blobFile: Schema.Types.ObjectType().shape({
					name: Schema.Types.StringType().pattern(
						/^.*\.(gif)$/i,
						'Неверный формат файла! Разрешен только "gif" '
					),
					size: Schema.Types.NumberType().max(
						5242880,
						'Размер файла не может превышать 5mb'
					),
				}),
			})
		),
		servicesLinkGif: Schema.Types.ArrayType().of(
			Schema.Types.ObjectType().shape({
				blobFile: Schema.Types.ObjectType().shape({
					name: Schema.Types.StringType().pattern(
						/^.*\.(gif)$/i,
						'Неверный формат файла! Разрешен только "gif" '
					),
					size: Schema.Types.NumberType().max(
						5242880,
						'Размер файла не может превышать 5mb'
					),
				}),
			})
		),
		contactsLinkGif: Schema.Types.ArrayType().of(
			Schema.Types.ObjectType().shape({
				blobFile: Schema.Types.ObjectType().shape({
					name: Schema.Types.StringType().pattern(
						/^.*\.(gif)$/i,
						'Неверный формат файла! Разрешен только "gif" '
					),
					size: Schema.Types.NumberType().max(
						5242880,
						'Размер файла не может превышать 5mb'
					),
				}),
			})
		),
		musicFile: Schema.Types.ArrayType().of(
			Schema.Types.ObjectType().shape({
				blobFile: Schema.Types.ObjectType().shape({
					name: Schema.Types.StringType().pattern(
						/^.*\.(mp3|wav)$/i,
						'Неверный формат файла! Разрешены только "mp3" или "wav" '
					),
					size: Schema.Types.NumberType().max(
						5242880,
						'Размер файла не может превышать 5mb'
					),
				}),
			})
		),
	});

	const formRef = useRef(null);
	const [formError, setFormError] = useState({});
	const [formValue, setFormValue] = useState({
		mainLinkGif: [],
		aboutLinkGif: [],
		casesLinkGif: [],
		servicesLinkGif: [],
		contactsLinkGif: [],
		musicFile: [],
	});
	const [isReady, setIsReady] = useState(false);
	const [isEditable, setIsEditable] = useState(false);
	const [id, setId] = useState(null);

	const { data, success, error, fetchData } = useAxiosGet('/api/generalcontent');

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
				mainLinkGif: [],
				aboutLinkGif: [],
				casesLinkGif: [],
				servicesLinkGif: [],
				contactsLinkGif: [],
				musicFile: [],
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

			const formData = new FormData();
			formData.append('mainLinkGif', formValue.mainLinkGif?.[0]?.blobFile || null);
			formData.append(
				'aboutLinkGif',
				formValue.aboutLinkGif?.[0]?.blobFile || null
			);
			formData.append(
				'casesLinkGif',
				formValue.casesLinkGif?.[0]?.blobFile || null
			);
			formData.append(
				'servicesLinkGif',
				formValue.servicesLinkGif?.[0]?.blobFile || null
			);
			formData.append(
				'contactsLinkGif',
				formValue.contactsLinkGif?.[0]?.blobFile || null
			);

			formData.append('musicFile', formValue.musicFile?.[0]?.blobFile || null);

			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			};

			try {
				const { data } = await axios.put(
					`/api/generalcontent/${id}`,
					formData,
					config
				);

				if (data.status === 'success') {
					setIsReady(true);
					toaster.push(successMessage(), {
						placement: messagePlacement,
					});
					await fetchData();
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
			<FileUploader
				label='Гифка "Главная"'
				name="mainLinkGif"
				disabled={formValue.mainLinkGif.length > 0}
				oldImg={data?.mainLinkGif}
				popoverProps={{
					text: 'Гифка при наведении на ссылку "Главная"',
				}}
				errExt={
					formError.mainLinkGif?.array?.[0]?.object?.blobFile?.object?.name
						?.errorMessage
				}
				errSize={
					formError.mainLinkGif?.array?.[0]?.object?.blobFile?.object?.size
						?.errorMessage
				}
			/>
			<FileUploader
				label='Гифка "О нас"'
				name="aboutLinkGif"
				disabled={formValue.aboutLinkGif.length > 0}
				oldImg={data?.aboutLinkGif}
				popoverProps={{
					text: 'Гифка при наведении на ссылку "О нас"',
				}}
				errExt={
					formError.aboutLinkGif?.array?.[0]?.object?.blobFile?.object?.name
						?.errorMessage
				}
				errSize={
					formError.aboutLinkGif?.array?.[0]?.object?.blobFile?.object?.size
						?.errorMessage
				}
			/>
			<FileUploader
				label='Гифка "Кейсы"'
				name="casesLinkGif"
				disabled={formValue.casesLinkGif.length > 0}
				oldImg={data?.casesLinkGif}
				popoverProps={{
					text: 'Гифка при наведении на ссылку "Кейсы"',
				}}
				errExt={
					formError.casesLinkGif?.array?.[0]?.object?.blobFile?.object?.name
						?.errorMessage
				}
				errSize={
					formError.casesLinkGif?.array?.[0]?.object?.blobFile?.object?.size
						?.errorMessage
				}
			/>
			<FileUploader
				label='Гифка "Услуги"'
				name="servicesLinkGif"
				disabled={formValue.servicesLinkGif.length > 0}
				oldImg={data?.servicesLinkGif}
				popoverProps={{
					text: 'Гифка при наведении на ссылку "Услуги"',
				}}
				errExt={
					formError.servicesLinkGif?.array?.[0]?.object?.blobFile?.object?.name
						?.errorMessage
				}
				errSize={
					formError.servicesLinkGif?.array?.[0]?.object?.blobFile?.object?.size
						?.errorMessage
				}
			/>
			<FileUploader
				label='Гифка "Контакты"'
				name="contactsLinkGif"
				disabled={formValue.contactsLinkGif.length > 0}
				oldImg={data?.contactsLinkGif}
				popoverProps={{
					text: 'Гифка при наведении на ссылку "Контакты"',
				}}
				errExt={
					formError.contactsLinkGif?.array?.[0]?.object?.blobFile?.object?.name
						?.errorMessage
				}
				errSize={
					formError.contactsLinkGif?.array?.[0]?.object?.blobFile?.object?.size
						?.errorMessage
				}
			/>
			<Form.Group>
				{data?.musicFile && (
					<audio controls style={{ marginTop: '10px' }}>
						<source src={data?.musicFile} />
					</audio>
				)}
				<FileUploader
					label="Фоновая музыка"
					name="musicFile"
					disabled={formValue.musicFile.length > 0}
					accept="all"
					popoverProps={{
						text: 'Фоновая музыка сайта',
					}}
					errExt={
						formError.musicFile?.array?.[0]?.object?.blobFile?.object?.name
							?.errorMessage
					}
					errSize={
						formError.musicFile?.array?.[0]?.object?.blobFile?.object?.size
							?.errorMessage
					}
				/>
			</Form.Group>

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

export default GeneralContent;
