module.exports = {
	apps: [
		{
			name: 'division',
			script: './server.js',
			watch: true,
			env_production: {
				JWT_SECRET:
					'5ebda1ec93005c9d3143022e553c042f5eab0230d4a182626b0ee4ba61972c7e96846b',
				JWT_EXPIRE: '2d',
				SUPER_ADMIN_USERNAME: 'admin',
				SUPER_ADMIN_PASSWORD: 'Y6(Q4;sF4Z',
			},
		},
	],
};
