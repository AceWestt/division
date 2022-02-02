import React, { useState } from 'react';
import {
	Message,
	toaster,
	List,
	FlexboxGrid,
	Button,
	ButtonToolbar,
	Table,
} from 'rsuite';
import axios from 'axios';
import { useAxiosGet } from '../../common/hooks/useAxiosGet';
import { theme } from '../adminContext';
import AddCat from '../components/caseScreenSub/drawers/AddCat';
import EditCat from '../components/caseScreenSub/drawers/EditCat';
import AddCase from '../components/caseScreenSub/drawers/AddCase';
import EditCase from '../components/caseScreenSub/drawers/EditCase';
import DeleteDialog from '../components/DeleteDialog';

const styles = {
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(7.5),
	},
	categories: {
		root: {
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
		},
		cell: {
			display: 'flex',
			justifyContent: 'center',
		},
	},
};

const Cases = () => {
	const [isAddCatOpen, setIsAddCatOpen] = useState(false);

	const [isEditingCat, setIsEditingCat] = useState(false);
	const [editedCat, setEditedCat] = useState({});

	const [isDeletingCat, setIsDeletingCat] = useState(false);
	const [deletedCatId, setDeletedCatId] = useState(false);

	const [isAddingCase, setIsAddingCase] = useState(false);
	const [caseAddingCat, setCaseAddingCat] = useState(null);

	const [isEditingCase, setIsEditingCase] = useState(false);
	const [editedCase, setEditedCase] = useState(null);

	const [isDeletingCase, setIsDeletingCase] = useState(false);
	const [deletedCaseId, setDeletedCaseId] = useState(null);

	const [showingCasesCategoryId, setShowingCasesCategoryId] = useState(null);

	const messagePlacement = 'topCenter';

	const toastMessage = (type, msg) => {
		return (
			<Message type={type} duration={5000}>
				{msg}
			</Message>
		);
	};

	const { data: categories, fetchData } = useAxiosGet('/api/cases/categories');
	const {
		data: cases,
		fetchData: fetchCaseData,
		success: casesLoadSuccess,
	} = useAxiosGet(`/api/cases/cases/${showingCasesCategoryId || '-1'}`);

	const handleCategoryEdit = (cat) => {
		setEditedCat(cat);
		setIsEditingCat(true);
	};

	const handleCatRemove = async () => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			const res = await axios.delete(
				`/api/cases/categories/${deletedCatId}`,
				config
			);
			if (res.data.status === 'success') {
				setIsDeletingCat(false);
				setDeletedCatId(null);
				fetchData();
				toaster.push(toastMessage('success', 'Категория удалена!'), {
					placement: messagePlacement,
				});
			}
		} catch (error) {
			if (error.response.data.error) {
				toaster.push(toastMessage('error', error.response.data.error), {
					placement: messagePlacement,
				});
			} else {
				toaster.push(toastMessage('error', 'Не удалось удалить категорию!'), {
					placement: messagePlacement,
				});
			}
		}
	};

	const handleCaseEdit = (c) => {
		setEditedCase(c);
		setIsEditingCase(true);
	};

	const handleCaseRemove = async () => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			const res = await axios.delete(`/api/cases/cases/${deletedCaseId}`, config);
			if (res.data.status === 'success') {
				setIsDeletingCase(false);
				setDeletedCaseId(null);
				fetchCaseData();
				toaster.push(toastMessage('success', 'Кейс удален!'), {
					placement: messagePlacement,
				});
			}
		} catch (error) {
			if (error.response.data.error) {
				toaster.push(toastMessage('error', error.response.data.error), {
					placement: messagePlacement,
				});
			} else {
				toaster.push(toastMessage('error', 'Не удалось удалить кейс!'), {
					placement: messagePlacement,
				});
			}
		}
	};

	return (
		<div style={styles.root} className="cases-screen">
			<ButtonToolbar>
				<Button
					appearance="primary"
					onClick={() => setIsAddCatOpen(true)}
					color="green"
				>
					Новая категория кейсов
				</Button>
			</ButtonToolbar>
			<div style={styles.categories.root}>
				{categories && categories.length > 0 ? (
					<List hover>
						<List.Item>
							<FlexboxGrid align="middle" justify="center">
								<FlexboxGrid.Item colspan={10} style={styles.categories.cell}>
									<h5>Название категории</h5>
								</FlexboxGrid.Item>
								<FlexboxGrid.Item colspan={4} style={styles.categories.cell}>
									<h5>Дата добавления</h5>
								</FlexboxGrid.Item>
								<FlexboxGrid.Item colspan={4} style={styles.categories.cell}>
									<h5>Дата изменения</h5>
								</FlexboxGrid.Item>
								<FlexboxGrid.Item colspan={6} style={styles.categories.cell}>
									<h5>Управление</h5>
								</FlexboxGrid.Item>
							</FlexboxGrid>
						</List.Item>
						{categories.map((c, i) => {
							let dateCreated = new Date(c.created);
							dateCreated = `${dateCreated.getDate()}-${
								dateCreated.getMonth() + 1
							}-${dateCreated.getFullYear()}`;
							let dateUpdated = new Date(c.updated);
							dateUpdated = `${dateUpdated.getDate()}-${
								dateUpdated.getMonth() + 1
							}-${dateUpdated.getFullYear()}`;
							return (
								<div key={`categories-${c._id}`}>
									<List.Item
										key={`categories-${c._id}`}
										index={i}
										onClick={() => {
											if (c._id === showingCasesCategoryId) {
												setShowingCasesCategoryId(null);
											} else {
												setShowingCasesCategoryId(c._id);
											}
										}}
									>
										<FlexboxGrid align="middle" justify="center">
											<FlexboxGrid.Item colspan={10} style={styles.categories.cell}>
												{c.name.ru}
											</FlexboxGrid.Item>
											<FlexboxGrid.Item colspan={4} style={styles.categories.cell}>
												{dateCreated}
											</FlexboxGrid.Item>
											<FlexboxGrid.Item colspan={4} style={styles.categories.cell}>
												{dateUpdated}
											</FlexboxGrid.Item>
											<FlexboxGrid.Item
												colspan={6}
												style={{
													...styles.categories.cell,
													gap: theme.spacing(1),
												}}
											>
												<Button
													color="green"
													appearance="subtle"
													onClick={() => {
														setCaseAddingCat(c._id);
														setIsAddingCase(true);
													}}
												>
													Добавить кейс
												</Button>
												<Button
													color="orange"
													appearance="subtle"
													onClick={() => handleCategoryEdit(c)}
												>
													Изменить
												</Button>
												<Button
													color="red"
													appearance="subtle"
													onClick={() => {
														setIsDeletingCat(true);
														setDeletedCatId(c._id);
													}}
												>
													Удалить
												</Button>
											</FlexboxGrid.Item>
										</FlexboxGrid>
									</List.Item>
									{showingCasesCategoryId === c._id && (
										<List.Item>
											<FlexboxGrid align="middle" justify="center">
												<FlexboxGrid.Item colspan={24}>
													{cases && cases.length > 0 ? (
														<Table
															data={cases}
															bordered
															hover={false}
															loading={!casesLoadSuccess}
															cellBordered
														>
															<Table.Column width={200} align="center" fixed>
																<Table.HeaderCell>Заголовок кейса</Table.HeaderCell>
																<TextCell dataKey="title" />
															</Table.Column>
															<Table.Column width={100} align="center">
																<Table.HeaderCell>Превью</Table.HeaderCell>
																<ImageCell dataKey="preview" />
															</Table.Column>
															<Table.Column flexGrow={1}>
																<Table.HeaderCell>Описание кейса</Table.HeaderCell>
																<TextCell dataKey="subtitle" />
															</Table.Column>
															<Table.Column width={120} align="center">
																<Table.HeaderCell>Дата добавления</Table.HeaderCell>
																<DateCell dataKey="created" />
															</Table.Column>
															<Table.Column width={120} align="center">
																<Table.HeaderCell>Дата изменения</Table.HeaderCell>
																<DateCell dataKey="updated" />
															</Table.Column>
															<Table.Column width={200} fixed="right">
																<Table.HeaderCell>Управление</Table.HeaderCell>

																<ControlCell
																	onEditClick={handleCaseEdit}
																	onRemoveClick={(id) => {
																		setDeletedCaseId(id);
																		setIsDeletingCase(true);
																	}}
																/>
															</Table.Column>
														</Table>
													) : (
														'Добавьте кейсы'
													)}
												</FlexboxGrid.Item>
											</FlexboxGrid>
										</List.Item>
									)}
								</div>
							);
						})}
					</List>
				) : (
					<h5>Добавьте категории кейсов</h5>
				)}
			</div>
			<AddCat
				open={isAddCatOpen}
				fetchData={fetchData}
				onClose={() => {
					setIsAddCatOpen(false);
				}}
			/>
			<EditCat
				open={isEditingCat}
				fetchData={fetchData}
				onClose={() => {
					setIsEditingCat(false);
					setEditedCat({});
				}}
				cat={editedCat}
			/>
			<AddCase
				open={isAddingCase}
				cat_id={caseAddingCat}
				fetchCaseData={fetchCaseData}
				onClose={() => {
					setIsAddingCase(false);
					setCaseAddingCat(null);
				}}
			/>
			<EditCase
				open={isEditingCase}
				editedCase={editedCase}
				fetchCaseData={fetchCaseData}
				onClose={() => {
					setIsEditingCase(false);
					setEditedCase(null);
				}}
			/>
			<DeleteDialog
				open={isDeletingCase}
				warning={'После удаления невозможно восстановить кейс!'}
				onClose={() => {
					setIsDeletingCase(false);
					setDeletedCaseId(null);
				}}
				onConfirm={handleCaseRemove}
			/>
			<DeleteDialog
				open={isDeletingCat}
				warning={
					'Удалив категорию вы так же удаляете все кейс входящие под эту категорию навсегда!'
				}
				onClose={() => {
					setIsDeletingCat(false);
					setDeletedCatId(null);
				}}
				onConfirm={handleCatRemove}
			/>
		</div>
	);
};

const TextCell = ({ rowData, dataKey, ...props }) => {
	return <Table.Cell {...props}>{rowData[dataKey].ru}</Table.Cell>;
};

const DateCell = ({ rowData, dataKey, ...props }) => {
	let date = new Date(rowData[dataKey]);
	date = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
	return <Table.Cell {...props}>{date}</Table.Cell>;
};

const ImageCell = ({ rowData, dataKey, ...props }) => {
	const img = rowData[dataKey];
	return (
		<Table.Cell
			{...props}
			style={{
				padding: `${theme.spacing(1)} ${theme.spacing(2.5)}`,
				alignItems: 'center',
				display: 'flex',
			}}
		>
			{img ? (
				<img
					style={{ height: '100%', width: '100%', objectFit: 'cover' }}
					src={rowData[dataKey]}
					alt="preview"
				/>
			) : (
				'No preview'
			)}
		</Table.Cell>
	);
};

const ControlCell = ({ rowData, onEditClick, onRemoveClick, ...props }) => {
	return (
		<Table.Cell {...props} style={{ padding: `${theme.spacing(2)} 0` }}>
			<ButtonToolbar>
				<Button
					size="sm"
					appearance="link"
					color="orange"
					onClick={() => onEditClick(rowData)}
				>
					Редактировать
				</Button>
				<Button
					size="sm"
					appearance="link"
					color="red"
					onClick={() => onRemoveClick(rowData._id)}
				>
					Удалить
				</Button>
			</ButtonToolbar>
		</Table.Cell>
	);
};

export default Cases;
