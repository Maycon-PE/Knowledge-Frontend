import { Types } from './'

export const toggleMenu = menu => {
	return {
		type: Types.menu,
		data: {
			menu
		}
	}
}

export const toggleTitle = titleIndex => {
  return {
    type: Types.title,
    data: {
    	titleIndex	
    }
  }
}

export const setTitle = titleName => {
	return {
		type: Types.titleName,
		data: {
			titleName
		}
	}
}

export const toggleCategory = categorySelected => {
	return {
		type: 'TOGGLE_CATEGORY_SELECTED',
		data: {
			categorySelected
		}
	}
}

export const setUser = user => {
	return {
		type: 'SET_USER',
		data: {
			user
		}
	}
}

export const logout = () => {
	return {
		type: 'LOGOUT'
	}
}