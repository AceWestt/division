import React, { useEffect, useRef, useState } from 'react';
import {
	Schema,
	Message,
	Form,
	ButtonToolbar,
	Button,
	toaster,
	Drawer,
	IconButton,
	ButtonGroup,
	SelectPicker,
	Divider,
	Panel,
	Badge,
} from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import MinusIcon from '@rsuite/icons/Minus';
import FormWrapper from '../../FormWrapper';
import MultiLangInputField from '../../MultiLangInputField';
import MultiLangInputFieldAlt from '../../MultiLangInputFieldAlt';
import SingleInputAlt from '../../SingleInputAlt';
import FileUploader from '../../FileUploader';
import FileUploaderAlt from '../../FileUploaderAlt';
import axios from 'axios';
import { theme } from '../../../adminContext';

const styles = {
	root: {},
	blocks: {
		root: {
			width: '100%',
		},
		theadRow: {
			height: `${theme.spacing(10)}`,
		},
		theadCell: {
			fontSize: `${theme.spacing(4)}`,
			fontWeight: '700',
			color: '#9228c7',
		},
	},
};

const AddCase = React.forwardRef((props, ref) => {
	const { open, onClose, cat_id, fetchCaseData } = props;

	const model = Schema.Model({
		preview: Schema.Types.ArrayType()
			.minLength(1, 'Загрузите изображение')
			.of(
				Schema.Types.ObjectType().shape({
					blobFile: Schema.Types.ObjectType().shape({
						name: Schema.Types.StringType().pattern(
							/^.*\.(jpg|png|gif)$/i,
							'Неверный формат файла! Разрешен только "jpg", "gif" или "png"'
						),
						size: Schema.Types.NumberType().max(
							5242880,
							'Размер файла не может превышать 5mb'
						),
					}),
				})
			),
		mobileWidth: Schema.Types.NumberType()
			.isRequired('Укажите значение')
			.isOneOf([1, 2], 'Допустимые значения: 1, 2'),
		titleRu: Schema.Types.StringType().isRequired(
			'Введите название кейса на русском!'
		),
		titleEn: Schema.Types.StringType().isRequired(
			'Введите название кейса на английском!'
		),
		titleUz: Schema.Types.StringType().isRequired(
			'Введите название кейса на узбекском!'
		),
		subtitleRu: Schema.Types.StringType().isRequired(
			'Введите описание кейса на русском!'
		),
		subtitleEn: Schema.Types.StringType().isRequired(
			'Введите описание кейса на английском!'
		),
		subtitleUz: Schema.Types.StringType().isRequired(
			'Введите описание кейса на узбекском!'
		),
		descriptionRu: Schema.Types.StringType().isRequired(
			'Введите описание кейса на русском!'
		),
		descriptionEn: Schema.Types.StringType().isRequired(
			'Введите описание кейса на английском!'
		),
		descriptionUz: Schema.Types.StringType().isRequired(
			'Введите описание кейса на узбекском!'
		),
		blocks: Schema.Types.ArrayType().of(
			Schema.Types.ObjectType().shape({
				type: Schema.Types.StringType(),
				text: Schema.Types.ObjectType().shape({
					labelRu: Schema.Types.StringType().isRequired(
						'Введите заголовок блока на русском!'
					),
					labelEn: Schema.Types.StringType().isRequired(
						'Введите заголовок блока на английском!'
					),
					labelUz: Schema.Types.StringType().isRequired(
						'Введите заголовок блока на узбекком!'
					),
					textRu: Schema.Types.StringType().isRequired(
						'Введите текст блока на русском!'
					),
					textEn: Schema.Types.StringType().isRequired(
						'Введите текст блока на английском!'
					),
					textUz: Schema.Types.StringType().isRequired(
						'Введите текст блока на узбекком!'
					),
				}),
				img: Schema.Types.ArrayType()
					.minLength(1, 'Загрузите изображение')
					.of(
						Schema.Types.ObjectType().shape({
							blobFile: Schema.Types.ObjectType().shape({
								name: Schema.Types.StringType().pattern(
									/^.*\.(jpg|png)$/i,
									'Неверный формат файла! Разрешен только "jpg" или "png"'
								),
								size: Schema.Types.NumberType().max(
									5242880,
									'Размер файла не может превышать 5mb'
								),
							}),
						})
					),
				gallery: Schema.Types.ArrayType()
					.minLength(2, 'Загрузите минимум 2 изображения')
					.of(
						Schema.Types.ObjectType().shape({
							blobFile: Schema.Types.ObjectType().shape({
								name: Schema.Types.StringType().pattern(
									/^.*\.(jpg|png)$/i,
									'Неверный формат файла! Разрешен только "jpg" или "png"'
								),
								size: Schema.Types.NumberType().max(
									5242880,
									'Размер файла не может превышать 5mb'
								),
							}),
						})
					),
				video: Schema.Types.ObjectType().shape({
					url: Schema.Types.StringType()
						.isRequired('Введите url к видео')
						.pattern(
							/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/,
							'Неправильный Url'
						),
				}),
			})
		),
	});

	const defaultFormValue = {
		preview: [],
		mobileWidth: 2,
		titleRu: '',
		titleEn: '',
		titleUz: '',
		subtitleRu: '',
		subtitleEn: '',
		subtitleUz: '',
		descriptionRu: '',
		descriptionEn: '',
		descriptionUz: '',
		blocks: [
			{
				type: 'text',
				text: {
					labelRu: '',
					labelEn: '',
					labelUz: '',
					textRu: '',
					textEn: '',
					textUz: '',
				},
			},
		],
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
			let blocksTextToSend = {};
			let blockImgsToSend = [];
			let blocksKeyInfo = [];
			if (formValue.blocks && formValue.blocks.length > 0) {
				const blocks = formValue.blocks;
				blocks.map((b, index) => {
					let blocksKey = {
						type: b.type,
						index: index,
					};
					if (b.type === 'video') {
						const field = {
							type: b.type,
							video: b.video,
						};
						const key = `video_${index}`;
						blocksTextToSend[key] = field;
						blocksKey.key = key;
					} else if (b.type === 'img') {
						const key = `img_${index}`;
						const img = {
							key: key,
							img: b.img?.[0]?.blobFile || null,
						};
						blockImgsToSend.push(img);
						blocksKey.key = key;
					} else if (b.type === 'gallery') {
						const gallery = b.gallery;
						let keys = [];
						if (gallery && gallery.length > 0) {
							gallery.map((g, gindex) => {
								const key = `gallery_${index}_${gindex}`;
								const img = {
									key: key,
									img: g.blobFile || null,
								};
								blockImgsToSend.push(img);
								keys.push(key);
								return g;
							});
						}
						blocksKey.keys = keys;
					} else {
						const key = `text_${index}`;
						const field = {
							type: b.type,
							text: b.text || null,
						};
						blocksTextToSend[key] = field;
						blocksKey.key = key;
					}
					blocksKeyInfo.push(blocksKey);
					return b;
				});
			}

			const formData = new FormData();

			formData.append('preview', formValue.preview?.[0]?.blobFile);
			formData.append('mobileWidth', formValue.mobileWidth);

			formData.append(
				'title',
				JSON.stringify({
					ru: formValue.titleRu,
					en: formValue.titleEn,
					uz: formValue.titleUz,
				})
			);
			formData.append(
				'subtitle',
				JSON.stringify({
					ru: formValue.subtitleRu,
					en: formValue.subtitleEn,
					uz: formValue.subtitleUz,
				})
			);

			formData.append(
				'description',
				JSON.stringify({
					ru: formValue.descriptionRu,
					en: formValue.descriptionEn,
					uz: formValue.descriptionUz,
				})
			);

			formData.append('textBlocks', JSON.stringify(blocksTextToSend));

			if (blockImgsToSend && blockImgsToSend.length > 0) {
				blockImgsToSend.map((img, index) => {
					formData.append(img.key, img.img);
					return img;
				});
			}

			formData.append('blocksKeyInfo', JSON.stringify(blocksKeyInfo));

			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				},
			};

			try {
				const { data } = await axios.post(
					`/api/cases/cases/${cat_id}`,
					formData,
					config
				);

				if (data.status === 'success') {
					setIsReady(true);
					setFormValue(defaultFormValue);
					fetchCaseData();
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
					toaster.push(errorMessage('Не удалось добавить кейс!'), {
						placement: messagePlacement,
					});
				}
			}
		}
	};

	return (
		<Drawer ref={ref} open={open} onClose={onClose} size="lg" full>
			<Drawer.Header>
				<Drawer.Title>Добавить кейс</Drawer.Title>
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
						label="Превью кейса"
						name="preview"
						disabled={formValue.preview.length > 0}
						popoverProps={{
							text: 'Изображение или гифка в качестве превью кейса на каталогах',
						}}
						errExt={
							typeof formError.preview === 'string'
								? formError.preview
								: formError.preview?.array?.[0]?.object?.blobFile?.object?.name
										?.errorMessage
						}
						errSize={
							formError.preview?.array?.[0]?.object?.blobFile?.object?.size
								?.errorMessage
						}
					/>
					<Form.Group>
						<Form.ControlLabel>Ширина превью на мобильном экране</Form.ControlLabel>
						<SelectPicker
							value={formValue.mobileWidth}
							cleanable={false}
							onChange={(val) => setFormValue({ ...formValue, mobileWidth: val })}
							data={[
								{ value: 1, label: 'На половину' },
								{ value: 2, label: 'На всю ширину экрана' },
							]}
						/>
					</Form.Group>

					<MultiLangInputField
						runame="titleRu"
						enname="titleEn"
						uzname="titleUz"
						label="Название кейса"
						popoverProps={{
							text: 'Заголовок кейса',
						}}
						ruerror={formError.titleRu}
						enerror={formError.titleEn}
						uzerror={formError.titleUz}
					/>
					<MultiLangInputField
						runame="subtitleRu"
						enname="subtitleEn"
						uzname="subtitleUz"
						label="Описание кейса"
						textarea
						popoverProps={{
							text: 'Подзаголовок кейса',
						}}
						ruerror={formError.subtitleRu}
						enerror={formError.subtitleEn}
						uzerror={formError.subtitleUz}
					/>
					<MultiLangInputField
						runame="descriptionRu"
						enname="descriptionEn"
						uzname="descriptionUz"
						label="Описание кейса при наведении"
						textarea
						popoverProps={{
							text: 'Описание кейса при наведении на превью',
						}}
						ruerror={formError.descriptionRu}
						enerror={formError.descriptionEn}
						uzerror={formError.descriptionUz}
					/>
					<Divider />
					<Badge
						style={{ width: '100%', marginBottom: theme.spacing(10) }}
						content={formError.blocks?.hasError ? 'Есть ошибки' : ''}
						color={formError.blocks?.hasError ? 'red' : 'green'}
					>
						<Panel header="Блоки" collapsible shaded bordered>
							<Form.Control
								name="blocks"
								accepter={BlockInputController}
								fieldError={formError.blocks}
							/>
						</Panel>
					</Badge>

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

const BlockInputController = ({ value = [], onChange, fieldError }) => {
	const errors = fieldError ? fieldError.array : [];
	const [blocks, setBlocks] = useState(value);
	const handleChangeBlocks = (nextBlocks) => {
		setBlocks(nextBlocks);
		onChange(nextBlocks);
	};
	const handleInputChange = (rowIndex, value) => {
		const nextBlocks = [...blocks];
		nextBlocks[rowIndex] = value;
		handleChangeBlocks(nextBlocks);
	};

	const handleMinus = () => {
		handleChangeBlocks(blocks.slice(0, -1));
	};

	const handleAdd = () => {
		handleChangeBlocks(
			blocks.concat([
				{
					type: 'text',
					text: {
						labelRu: '',
						labelEn: '',
						labelUz: '',
						textRu: '',
						textEn: '',
						textUz: '',
					},
				},
			])
		);
	};
	return (
		<table style={styles.blocks.root}>
			<thead>
				<tr style={styles.blocks.theadRow}>
					<Cell style={styles.blocks.theadCell}>Тип</Cell>
					<Cell style={styles.blocks.theadCell}>Контент</Cell>
				</tr>
			</thead>
			<tbody>
				{blocks.map((rowValue, index) => {
					return (
						<BlockItem
							key={index}
							rowIndex={index}
							rowValue={rowValue}
							rowError={errors[index] ? errors[index].object : null}
							onChange={handleInputChange}
						/>
					);
				})}
			</tbody>
			<tfoot>
				<tr>
					<Cell colSpan={2} style={{ paddingTop: 10 }}>
						<ButtonGroup size="md">
							<IconButton onClick={handleAdd} icon={<PlusIcon />} />
							<IconButton onClick={handleMinus} icon={<MinusIcon />} />
						</ButtonGroup>
					</Cell>
				</tr>
			</tfoot>
		</table>
	);
};

const BlockItem = ({ rowValue = {}, onChange, rowIndex, rowError }) => {
	const [type, setType] = useState(rowValue.type);

	const [galleryErrors, setGalleryErrors] = useState({
		ext: '',
		size: '',
	});

	const defaultTextBlock = {
		labelRu: '',
		labelEn: '',
		labelUz: '',
		textRu: '',
		textEn: '',
		textUz: '',
	};

	const handleTypeChange = (value) => {
		setType(value);
		if (value === 'img') {
			onChange(rowIndex, { type: value, img: [] });
		} else if (value === 'gallery') {
			onChange(rowIndex, { type: value, gallery: [] });
		} else if (value === 'video') {
			onChange(rowIndex, { type: value, video: {} });
		} else {
			onChange(rowIndex, { type: value, text: defaultTextBlock });
		}
	};

	useEffect(() => {
		let extErrorMessage = '';
		let sizeErrorMessage = '';
		if (rowError?.gallery?.errorMessage) {
			extErrorMessage = rowError?.gallery?.errorMessage;
		} else {
			let extNumbers = '';
			let sizeNumbers = '';
			rowError?.gallery?.array?.map((e, i) => {
				if (e.object?.blobFile?.object?.name?.errorMessage) {
					extErrorMessage = e.object?.blobFile?.object?.name.errorMessage;
					extNumbers += `${i + 1}, `;
				}
				if (e.object?.blobFile?.object?.size?.errorMessage) {
					sizeErrorMessage = e.object?.blobFile?.object?.size.errorMessage;
					sizeNumbers += `${i + 1}, `;
				}
				extErrorMessage +=
					extNumbers > 0 ? `. Поменяйте ${extNumbers} изображения!` : '';
				sizeErrorMessage +=
					sizeNumbers > 0 ? `. Поменяйте ${sizeNumbers} изображения!` : '';
				return e;
			});
		}
		setGalleryErrors({ ext: extErrorMessage, size: sizeErrorMessage });
	}, [rowError]);

	return (
		<tr>
			<Cell>
				<SelectPicker
					value={type}
					onChange={handleTypeChange}
					cleanable={false}
					data={[
						{ value: 'text', label: 'Текст' },
						{ value: 'img', label: 'Изображение' },
						{ value: 'gallery', label: 'Галлерея' },
						{ value: 'video', label: 'Ссылка к embed видео' },
					]}
				/>
			</Cell>
			<Cell>
				{type === 'text' && (
					<>
						<MultiLangInputFieldAlt
							label="Заголовок блока"
							valRu={rowValue.text.labelRu}
							valEn={rowValue.text.labelEn}
							valUz={rowValue.text.labelUz}
							onChangeRu={(val) => {
								onChange(rowIndex, {
									...rowValue,
									text: { ...rowValue.text, labelRu: val },
								});
							}}
							onChangeEn={(val) => {
								onChange(rowIndex, {
									...rowValue,
									text: { ...rowValue.text, labelEn: val },
								});
							}}
							onChangeUz={(val) => {
								onChange(rowIndex, {
									...rowValue,
									text: { ...rowValue.text, labelUz: val },
								});
							}}
							popoverProps={{
								text: 'Подзаголовок блока',
							}}
							ruerror={rowError?.text?.object?.labelRu?.errorMessage || ''}
							enerror={rowError?.text?.object?.labelEn?.errorMessage || ''}
							uzerror={rowError?.text?.object?.labelUz?.errorMessage || ''}
						/>
						<MultiLangInputFieldAlt
							label="Текст блока"
							valRu={rowValue.text.textRu}
							valEn={rowValue.text.textEn}
							valUz={rowValue.text.textUz}
							textarea
							onChangeRu={(val) => {
								onChange(rowIndex, {
									...rowValue,
									text: { ...rowValue.text, textRu: val },
								});
							}}
							onChangeEn={(val) => {
								onChange(rowIndex, {
									...rowValue,
									text: { ...rowValue.text, textEn: val },
								});
							}}
							onChangeUz={(val) => {
								onChange(rowIndex, {
									...rowValue,
									text: { ...rowValue.text, textUz: val },
								});
							}}
							popoverProps={{
								text: 'Текст блока',
							}}
							ruerror={rowError?.text?.object?.textRu?.errorMessage || ''}
							enerror={rowError?.text?.object?.textEn?.errorMessage || ''}
							uzerror={rowError?.text?.object?.textUz?.errorMessage || ''}
						/>
					</>
				)}
				{type === 'img' && (
					<FileUploaderAlt
						label="Изображение блока"
						disabled={rowValue.img?.length > 0}
						onChange={(list) => {
							onChange(rowIndex, { ...rowValue, img: list });
						}}
						popoverProps={{
							text: 'Изображение блока',
						}}
						errExt={
							rowError?.img?.errorMessage ||
							rowError?.img?.array?.[0]?.object?.blobFile?.object?.name?.errorMessage
						}
						errSize={
							rowError?.img?.array?.[0]?.object?.blobFile?.object?.size?.errorMessage
						}
					/>
				)}
				{type === 'gallery' && (
					<FileUploaderAlt
						label="Галлерея"
						onChange={(list) => {
							onChange(rowIndex, { ...rowValue, gallery: list });
						}}
						popoverProps={{
							text: 'Блок с 2 или больше изображениями',
						}}
						errExt={galleryErrors.ext}
						errSize={galleryErrors.size}
					/>
				)}
				{type === 'video' && (
					<SingleInputAlt
						label="Ссылка к видео на youtube"
						popoverProps={{
							text: 'Ссылка к видео на youtube',
						}}
						val={rowValue.video.url || ''}
						onChange={(val) => {
							onChange(rowIndex, {
								...rowValue,
								video: { ...rowValue.video, url: val },
							});
						}}
						error={rowError?.video?.object?.url?.errorMessage || ''}
					/>
				)}
			</Cell>
		</tr>
	);
};

const Cell = ({ children, style, ...rest }) => (
	<td
		style={{ padding: '2px 4px 2px 0', verticalAlign: 'top', ...style }}
		{...rest}
	>
		{children}
	</td>
);

export default AddCase;
