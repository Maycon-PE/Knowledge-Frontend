export const userInLocalStorage = '__user'

export const toasts = {
		autoDismiss: true,
	  pouseOnHover: true		
	}

export const userData = {
	name: '',
	email: '',
	password: '',
	confirmPassword: ''
}	

export const pageAdmin = {

	global: {

		INITIO_INTABLE: {
		  ready: false, 
		  failed: false, 
		  filtered: [],
		  requesting: false
		},

		INITIO_MODE: {
		  label: 'Salvar',
		  color: 'primary',
		  exec: false
		},

		INITIO_DIVSEARCH: {
		  opened: false,
		  which: ''
		},

		INITIO_PAGINATION: {
			limit: 1,
			count: 1
		}

	},

	userComponent : {

		INITIO_INTABLE: {
		  mode: 'users', 
		  users: []
		},

		INITIO_USER: {
		  id: false,
		  email: '',
		  name: '',
		  password: '',
		  password2: '',
		  admin: false
		},

		INITIO_FILTERSTERMS: {
		  name: '', 
		  email: '', 
		  admin: 0 
		}

	},

	categoryComponent: {

		INITIO_INTABLE: { 
		  mode: 'categories', 
		  categories: [],
		  paths: []
		},

		INITIO_CATEGORY: {
		  id: false,
		  name: '',
		  path: '',
		  parentId: null
		},

		INITIO_FILTERSTERMS: {
		  name: ''
		}
	},

	articleComponent: {

		INITIO_INTABLE: { 
		  mode: 'articles',
		  limit: 0,
		  count: 0, 
		  articles: []
		},

		INITIO_ARTICLE: {
			id: false,
		  name: '',
			description: '',
			categoryId: '',
			userId: '',
			imageUrl: '',
			author: '',
			category: '',
			content: ''
		},

		INITIO_QUILL: {
		  toolbar: {
		  	container: [
		  	[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		  	[{ 'font': [] }],
			  ['bold', 'italic', 'underline', 'strike'],
			  ['blockquote', 'code-block'],

			  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
			  [{ 'script': 'sub'}, { 'script': 'super' }],
			  [{ 'indent': '-1'}, { 'indent': '+1' }],
			  [{ 'direction': 'rtl' }],

			  [{ 'color': [] }, { 'background': [] }],
			  
			  [{ 'align': [] }]
			]}
		},

		INITIO_FILTERSTERMS: {
		  name: '',
		  category: '',
		  author: ''
		}	
	}

}	
