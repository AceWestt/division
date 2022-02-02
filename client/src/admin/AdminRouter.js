import React, { useState } from 'react';
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';
import { theme, useAdminContext } from './adminContext';
import {
	Container,
	Sidenav,
	Nav,
	Header,
	Content,
	Sidebar,
	Navbar,
	Dropdown,
} from 'rsuite';
import { Icon } from '@rsuite/icons';
import RateIcon from '@rsuite/icons/Rate';
import MediaIcon from '@rsuite/icons/Media';
import PeoplesIcon from '@rsuite/icons/Peoples';
import ScatterIcon from '@rsuite/icons/Scatter';
import UserBadgeIcon from '@rsuite/icons/UserBadge';
import SendIcon from '@rsuite/icons/Send';
import LogoSvg from './components/svgComponents/LogoSvg';
import {
	AiOutlineBlock,
	AiOutlineContacts,
	AiOutlineGlobal,
} from 'react-icons/ai';
import {
	FaAngleLeft,
	FaAngleRight,
	FaBriefcase,
	FaRegHandshake,
} from 'react-icons/fa';
import { BiHelpCircle } from 'react-icons/bi';
import { BsGear } from 'react-icons/bs';
import { VscSignOut } from 'react-icons/vsc';
import { GiGreenhouse } from 'react-icons/gi';
import { HiOutlineViewGridAdd } from 'react-icons/hi';
import { MdConnectWithoutContact } from 'react-icons/md';
import GeneralContent from './screens/GeneralContent';
import AboutContent from './screens/AboutContent';
import Cases from './screens/Cases';
import Clients from './screens/Clients';
import Awards from './screens/Awards';
import Media from './screens/Media';
import Team from './screens/Team';
import Services from './screens/Services';
import ContactContent from './screens/ContactContent';
import Messages from './screens/Messages';

const styles = {
	sidebar: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
	},
	sidebarHeader: {
		padding: theme.spacing(4.5),
		fontSize: theme.spacing(4.5),
		height: 56,
		background: theme.colors.headerBg,
		color: ' #fff',
		overflow: 'hidden',
		alignItems: 'center',
		display: 'flex',
		flexWrap: 'wrap',
	},
	sidebarNav: {
		// width: '100%',
		// height: '100%',
	},
	main: {
		background: theme.colors.mainBg,
	},
	mainHeader: {
		paddingLeft: theme.spacing(4.5),
		fontSize: theme.spacing(4),
		height: 56,
		background: theme.colors.headerBg,
		alignItems: 'center',
		display: 'flex',
		color: '#fff',
	},
	mainContent: {
		padding: theme.spacing(4.5),
	},
	mainContentContainer: {
		background: '#fff',
		padding: theme.spacing(4.5),
		fontSize: theme.spacing(4),
	},
	link: {
		color: '#fff',
	},
	span: {
		marginLeft: theme.spacing(3),
	},
	icon: {
		fontSize: theme.spacing(5),
		marginRight: theme.spacing(3),
	},
};

const AdminRouter = () => {
	const { navElements } = useAdminContext();

	const match = useRouteMatch();
	const [expandSidebar, setExpandSidebar] = useState(true);
	const [activeSideNavIndex, setActiveSideNavIndex] = useState(0);

	const RouterLink = React.forwardRef(({ to, children, ...rest }, ref) => (
		<Link ref={ref} to={to} {...rest}>
			{children}
		</Link>
	));
	return (
		<div className="screen main-router-screen">
			<Container>
				<Sidebar
					style={{
						...styles.sidebar,
					}}
					width={expandSidebar ? 240 : 56}
					collapsible
				>
					<Sidenav.Header>
						<Link to="/" target="_blank" style={styles.sidebarHeader}>
							<LogoSvg style={{ width: theme.spacing(5), transform: 'scale(1.5)' }} />
							{expandSidebar && (
								<span style={{ marginLeft: theme.spacing(4.25), fontWeight: '700' }}>
									{' '}
									Division
								</span>
							)}
						</Link>
					</Sidenav.Header>
					<Sidenav
						expanded={expandSidebar}
						style={{ height: '100%' }}
						appearance="subtle"
						defaultOpenKeys={['1']}
					>
						<Sidenav.Body>
							<Nav appearance="tabs">
								<Dropdown
									eventKey="1"
									title="Контент блоков"
									icon={<Icon as={AiOutlineBlock} />}
								>
									<Dropdown.Item
										eventkey="1-1"
										icon={<Icon as={AiOutlineGlobal} />}
										as={RouterLink}
										to={match.path}
										active={activeSideNavIndex === 0}
										onClick={() => {
											setActiveSideNavIndex(0);
										}}
									>
										Глобальный контент
									</Dropdown.Item>
									<Dropdown.Item
										eventkey="1-2"
										icon={<Icon as={AiOutlineContacts} />}
										to={`${match.path}/aboutcontent`}
										onClick={() => {
											setActiveSideNavIndex(1);
										}}
										as={RouterLink}
										active={activeSideNavIndex === 1}
									>
										Страница “о нас”
									</Dropdown.Item>
									<Dropdown.Item
										eventkey="1-3"
										icon={<Icon as={GiGreenhouse} />}
										to={`${match.path}/othersscreen`}
										onClick={() => {
											setActiveSideNavIndex(2);
										}}
										as={RouterLink}
										active={activeSideNavIndex === 2}
									>
										Остальные блоки
									</Dropdown.Item>
								</Dropdown>
								<Dropdown
									eventKey="2"
									title="Динамичный контент"
									icon={<Icon as={HiOutlineViewGridAdd} />}
								>
									<Dropdown.Item
										eventkey="2-1"
										icon={<Icon as={FaBriefcase} />}
										as={RouterLink}
										to={`${match.path}/cases`}
										active={activeSideNavIndex === 3}
										onClick={() => {
											setActiveSideNavIndex(3);
										}}
									>
										Кейсы
									</Dropdown.Item>
									<Dropdown.Item
										eventkey="2-2"
										icon={<Icon as={FaRegHandshake} />}
										as={RouterLink}
										to={`${match.path}/сlients`}
										active={activeSideNavIndex === 4}
										onClick={() => {
											setActiveSideNavIndex(4);
										}}
									>
										Клиенты
									</Dropdown.Item>
									<Dropdown.Item
										eventkey="2-3"
										icon={<RateIcon />}
										as={RouterLink}
										to={`${match.path}/awards`}
										active={activeSideNavIndex === 5}
										onClick={() => {
											setActiveSideNavIndex(5);
										}}
									>
										Награды
									</Dropdown.Item>
									<Dropdown.Item
										eventkey="2-4"
										icon={<MediaIcon />}
										as={RouterLink}
										to={`${match.path}/media`}
										active={activeSideNavIndex === 6}
										onClick={() => {
											setActiveSideNavIndex(6);
										}}
									>
										Медиа
									</Dropdown.Item>
									<Dropdown.Item
										eventkey="2-5"
										icon={<PeoplesIcon />}
										as={RouterLink}
										to={`${match.path}/team`}
										active={activeSideNavIndex === 7}
										onClick={() => {
											setActiveSideNavIndex(7);
										}}
									>
										Сотрудники
									</Dropdown.Item>
									<Dropdown.Item
										eventkey="2-6"
										icon={<ScatterIcon />}
										as={RouterLink}
										to={`${match.path}/services`}
										active={activeSideNavIndex === 8}
										onClick={() => {
											setActiveSideNavIndex(8);
										}}
									>
										Услуги
									</Dropdown.Item>
								</Dropdown>
								<Dropdown
									eventKey="3"
									title="Обратная связь и контакты"
									icon={<Icon as={MdConnectWithoutContact} />}
								>
									<Dropdown.Item
										eventkey="3-1"
										icon={<UserBadgeIcon />}
										as={RouterLink}
										to={`${match.path}/contact`}
										active={activeSideNavIndex === 9}
										onClick={() => {
											setActiveSideNavIndex(9);
										}}
									>
										Контактные данные
									</Dropdown.Item>
									<Dropdown.Item
										eventkey="3-2"
										icon={<SendIcon />}
										as={RouterLink}
										to={`${match.path}/inbox`}
										active={activeSideNavIndex === 10}
										onClick={() => {
											setActiveSideNavIndex(10);
										}}
									>
										Обратная связь
									</Dropdown.Item>
								</Dropdown>
							</Nav>
						</Sidenav.Body>
					</Sidenav>
					<NavToggle
						expand={expandSidebar}
						onChange={() => setExpandSidebar(!expandSidebar)}
					/>
				</Sidebar>

				<Container style={styles.main}>
					<Header style={styles.mainHeader}>
						<h4>{navElements[activeSideNavIndex]}</h4>
					</Header>
					<Content style={styles.mainContent}>
						<Container style={styles.mainContentContainer}>
							<Switch>
								<Route exact path={`${match.path}`} component={GeneralContent} />
								<Route
									exact
									path={`${match.path}/aboutcontent`}
									component={AboutContent}
								/>
								<Route exact path={`${match.path}/cases`} component={Cases} />
								<Route exact path={`${match.path}/сlients`} component={Clients} />
								<Route exact path={`${match.path}/awards`} component={Awards} />
								<Route exact path={`${match.path}/media`} component={Media} />
								<Route exact path={`${match.path}/team`} component={Team} />
								<Route exact path={`${match.path}/services`} component={Services} />
								<Route
									exact
									path={`${match.path}/contact`}
									component={ContactContent}
								/>
								<Route exact path={`${match.path}/inbox`} component={Messages} />
							</Switch>
						</Container>
					</Content>
				</Container>
			</Container>
		</div>
	);
};

const NavToggle = ({ expand, onChange }) => {
	return (
		<Navbar appearance="subtle" className="nav-toggle">
			<Nav>
				<Dropdown placement="topStart" trigger="click">
					<Dropdown.Item as="div" icon={<Icon as={BiHelpCircle} />}>
						Помощь
					</Dropdown.Item>
					<Dropdown.Item as="div" icon={<Icon as={BsGear} />}>
						Настройки
					</Dropdown.Item>

					<Dropdown.Item
						as="div"
						icon={<Icon as={VscSignOut} />}
						onClick={() => {
							localStorage.removeItem('authToken');
							window.location.reload();
						}}
					>
						Выход
					</Dropdown.Item>
				</Dropdown>
			</Nav>

			<Nav pullRight>
				<Nav.Item onClick={onChange} style={{ width: 56, textAlign: 'center' }}>
					{expand ? <FaAngleLeft /> : <FaAngleRight />}
				</Nav.Item>
			</Nav>
		</Navbar>
	);
};

export default AdminRouter;
