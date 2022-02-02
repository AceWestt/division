import React, { useContext } from 'react';

const AdminContext = React.createContext();

const theme = {
	colors: {
		mainBg: '#f7f7fa',
		greenBtn: '#24e07c',
		// headerBg: '#34c3ff',
		headerBg: '#333',
	},
	spacing: (value) => {
		return `${value * 4}px`;
	},
};

const AdminProvider = ({ children }) => {
	return (
		<AdminContext.Provider value={{ navElements }}>
			{children}
		</AdminContext.Provider>
	);
};

export const useAdminContext = () => {
	return useContext(AdminContext);
};

export { AdminContext, AdminProvider, theme };

const navElements = [
	'Глобальный контент',
	'Страница “о нас”',
	'Остальные блоки',
	'Кейсы',
	'Клиенты',
	'Награды',
	'Медиа',
	'Сотрудники',
	'Услуги',
	'Контактные данные',
	'Заявки от пользователей',
];
