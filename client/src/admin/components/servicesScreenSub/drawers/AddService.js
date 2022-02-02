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
import axios from 'axios';
import MultiLangInputField from '../../MultiLangInputField';

const AddService = React.forwardRef((props, ref) => {
	const { open, onClose, fetchData } = props;

	const model = Schema.Model({
		titleRu: Schema.Types.StringType().isRequired('Введите текст на русском!'),
		titleEn: Schema.Types.StringType().isRequired('Введите текст на английском!'),
		titleUz: Schema.Types.StringType().isRequired('Введите текст на узбекском!'),
		textRu: Schema.Types.StringType().isRequired('Введите текст на русском!'),
		textEn: Schema.Types.StringType().isRequired('Введите текст на английском!'),
		textUz: Schema.Types.StringType().isRequired('Введите текст на узбекском!'),
	});

	const defaultFormValue = {
		titleRu: '',
		titleEn: '',
		titleUz: '',
		textRu: '',
		textEn: '',
		textUz: '',
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
			const body = {
				title: {
					ru: formValue.titleRu,
					en: formValue.titleEn,
					uz: formValue.titleUz,
				},
				text: {
					ru: formValue.textRu,
					en: formValue.textEn,
					uz: formValue.textUz,
				},
			};

			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			};

			try {
				const { data } = await axios.post(`/api/service`, body, config);

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
					toaster.push(errorMessage('Не удалось добавить услугу!'), {
						placement: messagePlacement,
					});
				}
			}
		}
	};

	return (
		<Drawer ref={ref} open={open} onClose={onClose} size="lg" full>
			<Drawer.Header>
				<Drawer.Title>Добавить Услугу</Drawer.Title>
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
					<MultiLangInputField
						runame="titleRu"
						enname="titleEn"
						uzname="titleUz"
						label="Название услуги"
						popoverProps={{
							text: 'Название услуги',
						}}
						ruerror={formError.nameRu}
						enerror={formError.nameEn}
						uzerror={formError.nameUz}
					/>
					<MultiLangInputField
						runame="textRu"
						enname="textEn"
						uzname="textUz"
						label="Описание услуги"
						popoverProps={{
							text: 'Описание услуги',
						}}
						ruerror={formError.textRu}
						enerror={formError.textEn}
						uzerror={formError.textUz}
						textarea
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

export default AddService;
