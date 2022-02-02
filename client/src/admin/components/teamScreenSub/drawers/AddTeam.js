import React, { useRef, useState } from 'react';
import {
	Schema,
	Message,
	Form,
	ButtonToolbar,
	Button,
	toaster,
	Drawer,
} from 'rsuite';
import FormWrapper from '../../FormWrapper';
import FileUploader from '../../FileUploader';
import axios from 'axios';
import MultiLangInputField from '../../MultiLangInputField';

const AddTeam = React.forwardRef((props, ref) => {
	const { open, onClose, fetchData } = props;

	const model = Schema.Model({
		img: Schema.Types.ArrayType()
			.minLength(1, 'Загрузите изображение')
			.of(
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
		nameRu: Schema.Types.StringType().isRequired('Введите текст на русском!'),
		nameEn: Schema.Types.StringType().isRequired('Введите текст на английском!'),
		nameUz: Schema.Types.StringType().isRequired('Введите текст на узбекском!'),

		titleRu: Schema.Types.StringType().isRequired('Введите текст на русском!'),
		titleEn: Schema.Types.StringType().isRequired('Введите текст на английском!'),
		titleUz: Schema.Types.StringType().isRequired('Введите текст на узбекском!'),
	});

	const defaultFormValue = {
		img: [],
		nameRu: '',
		nameEn: '',
		nameUz: '',
		titleRu: '',
		titleEn: '',
		titleUz: '',
	};

	const formRef = useRef(null);
	const [formError, setFormError] = useState({});
	const [formValue, setFormValue] = useState(defaultFormValue);

	const [isReady, setIsReady] = useState(true);

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
				Добавлено!
			</Message>
		);
	};
	const messagePlacement = 'topCenter';

	const onSubmit = async () => {
		if (formRef.current.check()) {
			setIsReady(false);
			const formData = new FormData();

			formData.append('img', formValue.img?.[0]?.blobFile);
			formData.append(
				'name',
				JSON.stringify({
					ru: formValue.nameRu,
					en: formValue.nameEn,
					uz: formValue.nameUz,
				})
			);
			formData.append(
				'title',
				JSON.stringify({
					ru: formValue.titleRu,
					en: formValue.titleEn,
					uz: formValue.titleUz,
				})
			);

			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			};

			try {
				const { data } = await axios.post(`/api/team`, formData, config);

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
					toaster.push(errorMessage('Не удалось добавить сотрудника!'), {
						placement: messagePlacement,
					});
				}
			}
		}
	};

	return (
		<Drawer ref={ref} open={open} onClose={onClose} size="lg" full>
			<Drawer.Header>
				<Drawer.Title>Добавить сотрудника</Drawer.Title>
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
				>
					<FileUploader
						label="Фото сотрудника"
						name="img"
						disabled={formValue.img.length > 0}
						popoverProps={{
							text: 'Фото сотрудника',
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
					<MultiLangInputField
						runame="nameRu"
						enname="nameEn"
						uzname="nameUz"
						label="Имя сотрудника"
						popoverProps={{
							text: 'Имя сотрудника',
						}}
						ruerror={formError.nameRu}
						enerror={formError.nameEn}
						uzerror={formError.nameUz}
					/>
					<MultiLangInputField
						runame="titleRu"
						enname="titleEn"
						uzname="titleUz"
						label="Должность сотрудника"
						popoverProps={{
							text: 'Должность сотрудника',
						}}
						ruerror={formError.titleRu}
						enerror={formError.titleEn}
						uzerror={formError.titleUz}
					/>
					<Form.Group>
						<ButtonToolbar>
							<Button
								appearance="primary"
								color="cyan"
								loading={!isReady}
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

export default AddTeam;
