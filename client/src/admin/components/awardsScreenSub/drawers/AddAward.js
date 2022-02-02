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
import SingleInput from '../../SingleInput';

const AddAward = React.forwardRef((props, ref) => {
	const { open, onClose, fetchData } = props;

	const model = Schema.Model({
		logo: Schema.Types.ArrayType()
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
		name: Schema.Types.StringType().isRequired('Введите название награды'),
	});

	const defaultFormValue = {
		logo: [],
		name: '',
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

			formData.append('logo', formValue.logo?.[0]?.blobFile);
			formData.append('name', formValue.name);
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			};

			try {
				const { data } = await axios.post(`/api/award`, formData, config);

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
					toaster.push(errorMessage('Не удалось добавить награду!'), {
						placement: messagePlacement,
					});
				}
			}
		}
	};

	return (
		<Drawer ref={ref} open={open} onClose={onClose} size="xs">
			<Drawer.Header>
				<Drawer.Title>Добавить награду</Drawer.Title>
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
						label="Лого/изображение награды"
						name="logo"
						disabled={formValue.logo.length > 0}
						popoverProps={{
							text: 'Лого/изображение награды',
						}}
						errExt={
							typeof formError.logo === 'string'
								? formError.logo
								: formError.logo?.array?.[0]?.object?.blobFile?.object?.name
										?.errorMessage
						}
						errSize={
							formError.logo?.array?.[0]?.object?.blobFile?.object?.size?.errorMessage
						}
					/>
					<SingleInput
						name="name"
						label="Название награды"
						popoverProps={{
							text: 'Название награды',
						}}
						error={formError.name}
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

export default AddAward;
