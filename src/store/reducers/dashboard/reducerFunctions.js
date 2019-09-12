export const toggleMenu = (state, action) => 
	({ ...state, menu: action.data.menu })

export const toggleTitle = (state, action) => {
	const newState = { ...state }
	newState.titles.index = action.data.titleIndex === 2 ? state.user.admin ? action.data.titleIndex : state.titles.index : action.data.titleIndex
	if (action.data.titleIndex !== 0) {
		newState.titles.lables[0].text = 'Dashboard'
	}
	return newState
}

export const toggleCategorySelected = (state, action) => {
	const newState = { ...state }
	newState.categorySelected = action.data.categorySelected
	return newState
}

export const setTitle = (state, action) => {
	const newState = { ...state }
	newState.titles.lables[0] = { ...newState.titles.lables[0], title: { text: action.data.titleName, icon: 'fa fa-folder-o' } }
	return newState
}

export const setUser = (state, action) => {
	return { ...state, user: action.data.user }
}

export const logout = (state, action) => {
	const newState = { ...state }
	newState.user = null
	newState.categorySelected = 0
	newState.menu = true
	newState.titles.index = 0
	newState.titles.lables[0].text = 'Dashboard'
	
	return newState
}
