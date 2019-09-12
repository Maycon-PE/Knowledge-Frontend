import initialState from './initialState'

import * as functions from './reducerFunctions'

export const Types = {
	menu: 'TOGGLE_MENU',
	title: 'TOGGLE_TITLE',
	categorySelected: 'TOGGLE_CATEGORY_SELECTED',
	titleName: 'SET_TITLE',
	setUser: 'SET_USER',
	logout: 'LOGOUT'
}

export default function dashboard(state = initialState , action) {

	switch(action.type) {
		case Types.menu:
			return functions.toggleMenu(state, action)
			
		case Types.title:
			return functions.toggleTitle(state, action)

		case Types.categorySelected:
			return functions.toggleCategorySelected(state, action)	

		case Types.titleName:
			return functions.setTitle(state, action)

		case Types.setUser:
			return functions.setUser(state, action)

		case Types.logout:
			return functions.logout(state)	

		default: 
			return state	
	}

}
