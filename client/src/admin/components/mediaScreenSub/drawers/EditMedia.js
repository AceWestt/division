import React, { useEffect, useRef, useState } from 'react';
import {
	Schema,
	Message,
	Form,
	ButtonToolbar,
	Button,
	toaster,
	Drawer,
	DatePicker,
} from 'rsuite';
import FormWrapper from '../../FormWrapper';
import FileUploader from '../../FileUploader';
import axios from 'axios';
import SingleInput from '../../SingleInput';
import MultiLangInputField from '../../MultiLangInputField';
import ReadOnlyToggle from '../../ReadOnlyToggle';

const EditMedia = React.forwardRef((props, ref) => {
	const { open, onClose, media, fetchData } = props;

	const model = Schema.Model({
		img: Schema.Types.ArrayType().of(
			Schema.Types.ObjectType().shape({
				blobFile: Schema.Types.ObjectType().shape({
					name: Schema.Types.StringType().pattern(
						/^.*\.(svg|png|jpg|gif)$/i,
						'Неверный формат файла! Разрешен только "svg", "jpg", "gif" или "png"'
					),
					size: Schema.Types.NumberType().max(
						5242880,
						'Размер файла не может превышать 5mb'
					),
				}),
			})
		),
		link: Schema.Types.StringType()
			.isRequired('Введите URL новости')
			.isURL('Неправильный URL'),
		titleRu: Schema.Types.StringType().isRequired('Введите текст на русском!'),
		titleEn: Schema.Types.StringType().isRequired('Введите текст на английском!'),
		titleUz: Schema.Types.StringType().isRequired('Введите текст на узбекском!'),
		date: Schema.Types.DateType().isRequired('Укажите дату!'),
	});

	const defaultFormValue = {
		img: [],
		link: '',
		titleRu: '',
		titleEn: '',
		titleUz: '',
		date: new Date(),
	};

	const formRef = useRef(null);
	const [formError, setFormError] = useState({});
	const [formValue, setFormValue] = useState(defaultFormValue);

	useEffect(() => {
		if (media && media.link) {
			setIsReady(true);
			setIsEditable(false);
			setFormValue({
				img: [],
				link: media.link,
				titleRu: media.title.ru,
				titleEn: media.title.en,
				titleUz: media.title.uz,
				date: new Date(media.date),
			});
		}
	}, [media]);

	const [isReady, setIsReady] = useState(true);
	const [isEditable, setIsEditable] = useState(false);

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
				Изменения сохранены!
			</Message>
		);
	};
	const messagePlacement = 'topCenter';

	const onSubmit = async () => {
		if (formRef.current.check()) {
			setIsReady(false);
			const formData = new FormData();

			formData.append('img', formValue.img?.[0]?.blobFile);
			formData.append('link', formValue.link);
			formData.append(
				'title',
				JSON.stringify({
					ru: formValue.titleRu,
					en: formValue.titleEn,
					uz: formValue.titleUz,
				})
			);
			formData.append('date', formValue.date);
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			};

			try {
				const { data } = await axios.put(
					`/api/media/${media._id}`,
					formData,
					config
				);

				if (data.status === 'success') {
					setIsReady(true);
					setFormValue(defaultFormValue);
					fetchData();
					onClose();
					toaster.push(successMessage(), {
						placement: messagePlacement,
					});
				}
			} catch (error) {
				if (error.response.data.error) {
					toaster.push(errorMessage(error.response.data.error), {
						placement: messagePlacement,
					});
				} else {
					toaster.push(errorMessage('Не удалось изменить новость!'), {
						placement: messagePlacement,
					});
				}
			}
		}
	};

	return (
		<Drawer ref={ref} open={open} onClose={onClose} size="lg" full>
			<Drawer.Header>
				<Drawer.Title>Редактирование новости</Drawer.Title>
			</Drawer.Header>
			<Drawer.Body>
				<FormWrapper
					customClass="products-add-cat-form"
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
						label="Изображение новости"
						name="img"
						oldImg={media?.img}
						disabled={formValue.img.length > 0}
						popoverProps={{
							text: 'Изображение новости',
						}}
						errExt={
							typeof formError.img === 'string'
								? formError.img
								: formError.img?.array?.[0]?.object?.blobFile?.object?.name
										?.errorMessage
						}
						errSize={
							formError.img?.array?.[0]?.object?.blobFile?.object?.size?.errorMessage
						}
					/>
					<SingleInput
						name="link"
						label="URL новости"
						popoverProps={{
							text: 'URL ведущий к порталу с данной новостью',
						}}
						error={formError.link}
					/>
					<MultiLangInputField
						runame="titleRu"
						enname="titleEn"
						uzname="titleUz"
						label="Заголовок новости"
						popoverProps={{
							text: 'Заголовок новости',
						}}
						ruerror={formError.titleRu}
						enerror={formError.titleEn}
						uzerror={formError.titleUz}
						textarea
					/>
					<Form.Group>
						<Form.ControlLabel>Дата</Form.ControlLabel>
						<Form.Control
							name="date"
							accepter={DatePicker}
							oneTap
							placement="autoVerticalStart"
							format="dd-MM-yyyy"
						/>
						{formError.date && (
							<Form.HelpText style={{ color: 'red' }}>{formError.date}</Form.HelpText>
						)}
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
			</Drawer.Body>
		</Drawer>
	);
});

export default EditMedia;
