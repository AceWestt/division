import React, { useRef, useState, useEffect } from 'react';
import FormWrapper from '../components/FormWrapper';
import FileUploader from '../components/FileUploader';
import MultiLangInputField from '../components/MultiLangInputField';
import ReadOnlyToggle from '../components/ReadOnlyToggle';
import { Schema, Message, Form, ButtonToolbar, Button, toaster } from 'rsuite';
import axios from 'axios';
import { useAxiosGet } from '../../common/hooks/useAxiosGet';

const AboutContent = ({ history }) => {
	const model = Schema.Model({
		sloganRu: Schema.Types.StringType().isRequired('Введите текст на русском!'),
		sloganEn: Schema.Types.StringType().isRequired(
			'Введите текст на английском!'
		),
		sloganUz: Schema.Types.StringType().isRequired('Введите текст на узбекском!'),
		teamPhoto1: Schema.Types.ArrayType().of(
			Schema.Types.ObjectType().shape({
				blobFile: Schema.Types.ObjectType().shape({
					name: Schema.Types.StringType().pattern(
						/^.*\.(jpg|png)$/i,
						'Неверный формат файла! Разрешены "jpg" и "png"'
					),
					size: Schema.Types.NumberType().max(
						5242880,
						'Размер файла не может превышать 5mb'
					),
				}),
			})
		),
		teamPhoto2: Schema.Types.ArrayType().of(
			Schema.Types.ObjectType().shape({
				blobFile: Schema.Types.ObjectType().shape({
					name: Schema.Types.StringType().pattern(
						/^.*\.(jpg|png)$/i,
						'Неверный формат файла! Разрешены "jpg" и "png"'
					),
					size: Schema.Types.NumberType().max(
						5242880,
						'Размер файла не может превышать 5mb'
					),
				}),
			})
		),
		teamPhoto3: Schema.Types.ArrayType().of(
			Schema.Types.ObjectType().shape({
				blobFile: Schema.Types.ObjectType().shape({
					name: Schema.Types.StringType().pattern(
						/^.*\.(jpg|png)$/i,
						'Неверный формат файла! Разрешены "jpg" и "png"'
					),
					size: Schema.Types.NumberType().max(
						5242880,
						'Размер файла не может превышать 5mb'
					),
				}),
			})
		),
		teamPhoto4: Schema.Types.ArrayType().of(
			Schema.Types.ObjectType().shape({
				blobFile: Schema.Types.ObjectType().shape({
					name: Schema.Types.StringType().pattern(
						/^.*\.(jpg|png)$/i,
						'Неверный формат файла! Разрешены "jpg" и "png"'
					),
					size: Schema.Types.NumberType().max(
						5242880,
						'Размер файла не может превышать 5mb'
					),
				}),
			})
		),
		advantageTextRu: Schema.Types.StringType().isRequired(
			'Введите текст на русском!'
		),
		advantageTextEn: Schema.Types.StringType().isRequired(
			'Введите текст на английском!'
		),
		advantageTextUz: Schema.Types.StringType().isRequired(
			'Введите текст на узбекском!'
		),
		energyTextRu: Schema.Types.StringType().isRequired(
			'Введите текст на русском!'
		),
		energyTextEn: Schema.Types.StringType().isRequired(
			'Введите текст на английском!'
		),
		energyTextUz: Schema.Types.StringType().isRequired(
			'Введите текст на узбекском!'
		),
		energyImg: Schema.Types.ArrayType().of(
			Schema.Types.ObjectType().shape({
				blobFile: Schema.Types.ObjectType().shape({
					name: Schema.Types.StringType().pattern(
						/^.*\.(jpg|png|svg)$/i,
						'Неверный формат файла! Разрешены "svg", "jpg" и "png"'
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
		sloganRu: '',
		sloganEn: '',
		sloganUz: '',
		teamPhoto1: [],
		teamPhoto2: [],
		teamPhoto3: [],
		teamPhoto4: [],
		advantageTextRu: '',
		advantageTextEn: '',
		advantageTextUz: '',
		energyTextRu: '',
		energyTextEn: '',
		energyTextUz: '',
		energyImg: [],
	});
	const [isReady, setIsReady] = useState(false);
	const [isEditable, setIsEditable] = useState(false);
	const [id, setId] = useState(null);

	const { data, success, error, fetchData } = useAxiosGet('/api/aboutcontent');

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
				sloganRu: data.slogan?.ru,
				sloganEn: data.slogan?.en,
				sloganUz: data.slogan?.uz,
				teamPhoto1: [],
				teamPhoto2: [],
				teamPhoto3: [],
				teamPhoto4: [],
				advantageTextRu: data.advantageText?.ru,
				advantageTextEn: data.advantageText?.en,
				advantageTextUz: data.advantageText?.uz,
				energyTextRu: data.energyText?.ru,
				energyTextEn: data.energyText?.en,
				energyTextUz: data.energyText?.uz,
				energyImg: [],
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
			formData.append('teamPhoto1', formValue.teamPhoto1?.[0]?.blobFile || null);
			formData.append('teamPhoto2', formValue.teamPhoto2?.[0]?.blobFile || null);
			formData.append('teamPhoto3', formValue.teamPhoto3?.[0]?.blobFile || null);
			formData.append('teamPhoto4', formValue.teamPhoto4?.[0]?.blobFile || null);
			formData.append('energyImg', formValue.energyImg?.[0]?.blobFile || null);
			formData.append(
				'slogan',
				JSON.stringify({
					ru: formValue.sloganRu,
					en: formValue.sloganEn,
					uz: formValue.sloganUz,
				})
			);

			formData.append(
				'advantageText',
				JSON.stringify({
					ru: formValue.advantageTextRu,
					en: formValue.advantageTextEn,
					uz: formValue.advantageTextUz,
				})
			);

			formData.append(
				'energyText',
				JSON.stringify({
					ru: formValue.energyTextRu,
					en: formValue.energyTextEn,
					uz: formValue.energyTextUz,
				})
			);

			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			};

			try {
				const { data } = await axios.put(
					`/api/aboutcontent/${id}`,
					formData,
					config
				);

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
			<MultiLangInputField
				runame="sloganRu"
				enname="sloganEn"
				uzname="sloganUz"
				label="Текст на начале страницы (слоган)"
				popoverProps={{
					text: 'Текст на начале страницы (слоган)',
				}}
				ruerror={formError.sloganRu}
				enerror={formError.sloganEn}
				uzerror={formError.sloganUz}
				textarea
			/>
			<FileUploader
				label="1 фото комманды"
				name="teamPhoto1"
				disabled={formValue.teamPhoto1.length > 0}
				oldImg={data?.teamPhoto1}
				popoverProps={{
					text: '1 фото комманды',
				}}
				errExt={
					formError.teamPhoto1?.array?.[0]?.object?.blobFile?.object?.name
						?.errorMessage
				}
				errSize={
					formError.teamPhoto1?.array?.[0]?.object?.blobFile?.object?.size
						?.errorMessage
				}
			/>
			<FileUploader
				label="2 фото комманды"
				name="teamPhoto2"
				disabled={formValue.teamPhoto2.length > 0}
				oldImg={data?.teamPhoto2}
				popoverProps={{
					text: '2 фото комманды',
				}}
				errExt={
					formError.teamPhoto2?.array?.[0]?.object?.blobFile?.object?.name
						?.errorMessage
				}
				errSize={
					formError.teamPhoto2?.array?.[0]?.object?.blobFile?.object?.size
						?.errorMessage
				}
			/>
			<FileUploader
				label="3 фото комманды"
				name="teamPhoto3"
				disabled={formValue.teamPhoto3.length > 0}
				oldImg={data?.teamPhoto3}
				popoverProps={{
					text: '3 фото комманды',
				}}
				errExt={
					formError.teamPhoto3?.array?.[0]?.object?.blobFile?.object?.name
						?.errorMessage
				}
				errSize={
					formError.teamPhoto3?.array?.[0]?.object?.blobFile?.object?.size
						?.errorMessage
				}
			/>
			<FileUploader
				label="4 фото комманды"
				name="teamPhoto4"
				disabled={formValue.teamPhoto4.length > 0}
				oldImg={data?.teamPhoto4}
				popoverProps={{
					text: '4 фото комманды',
				}}
				errExt={
					formError.teamPhoto4?.array?.[0]?.object?.blobFile?.object?.name
						?.errorMessage
				}
				errSize={
					formError.teamPhoto4?.array?.[0]?.object?.blobFile?.object?.size
						?.errorMessage
				}
			/>
			<MultiLangInputField
				runame="advantageTextRu"
				enname="advantageTextEn"
				uzname="advantageTextUz"
				label="Текст про преимущество"
				popoverProps={{
					text: 'Текст про преимущество',
				}}
				ruerror={formError.advantageTextRu}
				enerror={formError.advantageTextEn}
				uzerror={formError.advantageTextUz}
				textarea
			/>

			<MultiLangInputField
				runame="energyTextRu"
				enname="energyTextEn"
				uzname="energyTextUz"
				label="Текст про энергию"
				popoverProps={{
					text: 'Текст про энергию',
				}}
				ruerror={formError.energyTextRu}
				enerror={formError.energyTextEn}
				uzerror={formError.energyTextUz}
				textarea
			/>
			<FileUploader
				label="Изображение блока энергии"
				name="energyImg"
				disabled={formValue.energyImg.length > 0}
				oldImg={data?.energyImg}
				popoverProps={{
					text:
						'Изобржание (геометрическая фигура по умолчанию) рядом с текстом про энергию',
				}}
				errExt={
					formError.energyImg?.array?.[0]?.object?.blobFile?.object?.name
						?.errorMessage
				}
				errSize={
					formError.energyImg?.array?.[0]?.object?.blobFile?.object?.size
						?.errorMessage
				}
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

export default AboutContent;
