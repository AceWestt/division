import React, { useState } from 'react';
import { theme } from '../adminContext';
import { Button, ButtonToolbar, Message, Table, toaster } from 'rsuite';
import DeleteDialog from '../components/DeleteDialog';
import { useAxiosGet } from '../../common/hooks/useAxiosGet';
import axios from 'axios';
import AddMedia from '../components/mediaScreenSub/drawers/AddMedia';
import EditMedia from '../components/mediaScreenSub/drawers/EditMedia';

const styles = {
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(10),
	},
};

const Media = () => {
	const [isAdding, setIsAdding] = useState(false);

	const [isEditing, setIsEditing] = useState(false);
	const [editedItem, setEditedItem] = useState(null);

	const [isDeleting, setIsDeleting] = useState(false);
	const [deletedId, setDeletedId] = useState(false);

	const messagePlacement = 'topCenter';

	const { data, success, fetchData } = useAxiosGet('/api/media');

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
			const res = await axios.delete(`/api/media/${deletedId}`, config);
			if (res.data.status === 'success') {
				setIsDeleting(false);
				setDeletedId(null);
				fetchData();
				toaster.push(toastMessage('success', 'Новость удалена!'), {
					placement: messagePlacement,
				});
			}
		} catch (error) {
			if (error.response.data.error) {
				toaster.push(toastMessage('error', error.response.data.error), {
					placement: messagePlacement,
				});
			} else {
				toaster.push(toastMessage('error', 'Не удалось удалить новость!'), {
					placement: messagePlacement,
				});
			}
		}
	};

	return (
		<div className="media-screen" style={styles.root}>
			<ButtonToolbar>
				<Button
					appearance="primary"
					onClick={() => setIsAdding(true)}
					color="green"
				>
					Добавить новость
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
					<Table.Column width={120} align="center" fixed>
						<Table.HeaderCell>Изображение</Table.HeaderCell>
						<ImageCell dataKey="img" />
					</Table.Column>
					<Table.Column flexGrow={1} align="center">
						<Table.HeaderCell>Заголовок</Table.HeaderCell>
						<TextCell dataKey="title" />
					</Table.Column>
					<Table.Column width={120} align="center">
						<Table.HeaderCell>Дата отображения</Table.HeaderCell>
						<DateCell dataKey="date" />
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
			<AddMedia
				open={isAdding}
				fetchData={fetchData}
				onClose={() => {
					setIsAdding(false);
				}}
			/>
			<EditMedia
				open={isEditing}
				fetchData={fetchData}
				media={editedItem}
				onClose={() => {
					setEditedItem(null);
					setIsEditing(false);
				}}
			/>
			<DeleteDialog
				open={isDeleting}
				warning="Удаленную новость нельзя восстановить!"
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

const DateCell = ({ rowData, dataKey, ...props }) => {
	let date = new Date(rowData[dataKey]);
	date = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
	return <Table.Cell {...props}>{date}</Table.Cell>;
};

export default Media;
