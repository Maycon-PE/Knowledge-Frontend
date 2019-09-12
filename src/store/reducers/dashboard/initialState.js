const initialState = {
	menu: true,
	user: null,
	titles: {
		index: 0,
		lables: [
			{
				title: {
					text: 'Dashboard',
					icon: 'fa fa-folder-o'
				},
				subtitle: 'Artigos'
			},
			{
				title: {
					text: 'Status',
					icon: 'fa fa-home'
				},
				subtitle: 'Base de Conhecimento'
			}, {
				title: {
					text: 'Administração do Sistema',
					icon: 'fa fa-user-secret'
				},
				subtitle: 'Cadastro & Cia'
			}
		]
	},
	categorySelected: 0
}

export default initialState
