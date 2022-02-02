import React, { useState } from 'react';
import { theme } from '../adminContext';
import { Button, ButtonToolbar, Message, Table, toaster } from 'rsuite';
import DeleteDialog from '../components/DeleteDialog';
import { useAxiosGet } from '../../common/hooks/useAxiosGet';
import axios from 'axios';
import AddService from '../components/servicesScreenSub/drawers/AddService';
import EditService from '../components/servicesScreenSub/drawers/EditService';

const styles = {
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(10),
	},
};

const Services = () => {
	const [isAdding, setIsAdding] = useState(false);

	const [isEditing, setIsEditing] = useState(false);
	const [editedItem, setEditedItem] = useState(null);

	const [isDeleting, setIsDeleting] = useState(false);
	const [deletedId, setDeletedId] = useState(null);

	const messagePlacement = 'topCenter';

	const { data, fetchData, success } = useAxiosGet('/api/service');

	const toastMessage = (type, msg) => {
		return (
			<Message type={type} duration={5000}>
				{msg}
			</Message>
		);
	};

	const handleEdit = (value) => {
		setEditedItem(value);
		setIsEditing(true);
	};

	const handleDelete = async () => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			const res = await axios.delete(`/api/service/${deletedId}`, config);
			if (res.data.status === 'success') {
				setIsDeleting(false);
				setDeletedId(null);
				fetchData();
				toaster.push(toastMessage('success', 'Услуга удалена!'), {
					placement: messagePlacement,
				});
			}
		} catch (error) {
			if (error.response.data.error) {
				toaster.push(toastMessage('error', error.response.data.error), {
					placement: messagePlacement,
				});
			} else {
				toaster.push(toastMessage('error', 'Не удалось удалить услугу!'), {
					placement: messagePlacement,
				});
			}
		}
	};
	return (
		<div className="services-screen" style={styles.root}>
			<ButtonToolbar>
				<Button
					appearance="primary"
					onClick={() => setIsAdding(true)}
					color="green"
				>
					Добавить услугу
				</Button>
			</ButtonToolbar>
			{data && data.length > 0 && (
				<Table
					data={data}
					bordered
					hover={false}
					loading={!success}
					autoHeight
					cellBordered
				>
					<Table.Column width={200} align="center" fixed>
						<Table.HeaderCell>Название</Table.HeaderCell>
						<TextCell dataKey="title" />
					</Table.Column>
					<Table.Column flexGrow={1} align="center">
						<Table.HeaderCell>Описание</Table.HeaderCell>
						<TextCell dataKey="text" />
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
							onEditClick={handleEdit}
							onRemoveClick={(id) => {
								setDeletedId(id);
								setIsDeleting(true);
							}}
						/>
					</Table.Column>
				</Table>
			)}
			<AddService
				open={isAdding}
				fetchData={fetchData}
				onClose={() => {
					setIsAdding(false);
				}}
			/>
			<EditService
				open={isEditing}
				fetchData={fetchData}
				service={editedItem}
				onClose={() => {
					setEditedItem(null);
					setIsEditing(false);
				}}
			/>
			<DeleteDialog
				open={isDeleting}
				warning="Удаленную услугу нельзя восстановить!"
				onClose={() => {
					setIsDeleting(false);
					setDeletedId(false);
				}}
				onConfirm={handleDelete}
			/>
		</div>
	);
};

const TextCell = ({ rowData, dataKey, ...props }) => {
	return <Table.Cell {...props}>{rowData[dataKey].ru}</Table.Cell>;
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

const DateCell = ({ rowData, dataKey, ...props }) => {
	let date = new Date(rowData[dataKey]);
	date = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
	return <Table.Cell {...props}>{date}</Table.Cell>;
};

export default Services;
