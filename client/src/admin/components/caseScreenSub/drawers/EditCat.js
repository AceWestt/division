import React, { useEffect, useRef, useState } from 'react';
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
import ReadOnlyToggle from '../../ReadOnlyToggle';
import MultiLangInputField from '../../MultiLangInputField';
import axios from 'axios';

const EditCat = React.forwardRef((props, ref) => {
	const { open, onClose, cat, fetchData } = props;

	const model = Schema.Model({
		nameRu: Schema.Types.StringType().isRequired(
			'Введите название категории на русском!'
		),
		nameEn: Schema.Types.StringType().isRequired(
			'Введите название категории на английском!'
		),
		nameUz: Schema.Types.StringType().isRequired(
			'Введите название категории на узбекском!'
		),
	});

	const defaultFormValue = {
		nameRu: '',
		nameEn: '',
		nameUz: '',
	};

	const formRef = useRef(null);
	const [formError, setFormError] = useState({});
	const [formValue, setFormValue] = useState(defaultFormValue);

	useEffect(() => {
		if (cat && cat.name) {
			setIsReady(true);
			setFormValue({
				nameRu: cat?.name?.ru || '',
				nameEn: cat?.name?.en || '',
				nameUz: cat?.name?.uz || '',
			});
		}
	}, [cat]);

	const [isReady, setIsReady] = useState(false);
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

			const body = {
				name: {
					ru: formValue.nameRu,
					en: formValue.nameEn,
					uz: formValue.nameUz,
				},
			};

			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			};

			try {
				const { data } = await axios.put(
					`/api/cases/categories/${cat._id}`,
					body,
					config
				);

				if (data.status === 'success') {
					setIsReady(true);
					fetchData();
					setIsEditable(false);
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
					toaster.push(errorMessage('Не удалось сохранить изменения продукцию!'), {
						placement: messagePlacement,
					});
				}
			}
		}
	};

	return (
		<Drawer
			ref={ref}
			open={open}
			onClose={() => {
				setIsEditable(false);
				setIsReady(false);
				onClose();
			}}
			size="lg"
			full
		>
			<Drawer.Header>
				<Drawer.Title>Редактировать категорию продукцию</Drawer.Title>
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
					<MultiLangInputField
						runame="nameRu"
						enname="nameEn"
						uzname="nameUz"
						label="Название категории"
						popoverProps={{
							text: 'Название категории',
						}}
						ruerror={formError.nameRu}
						enerror={formError.nameEn}
						uzerror={formError.nameUz}
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
			</Drawer.Body>
		</Drawer>
	);
});

export default EditCat;
