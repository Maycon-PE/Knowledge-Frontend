
export default {
	setFocus(id) {
		setTimeout(() => document.getElementById(id).focus(), 300)
	},

	verify(action, mode, data) {
	  if (action === 'user-form') {
	    if (mode === 'Editar') {
	      if (data.name === data.originalName && data.email === data.originalEmail && data.admin === data.originalAdmin) {
	        throw { message: 'Nada foi alterado!!!', appearance: 'warning', focus: false }
	      }
	    }

	    if (!data.email.trim() || !data.name.trim() || !data.password.trim() || !data.password2.trim()) {
	      throw { message: 'Campos inválidos!!!', appearance: 'warning', focus: false }
	    }

	    if (data.email.length < 6 || data.email.length > 50) {
	      throw { message: 'Email inválido!!!', appearance: 'warning', focus: 'inputEmail' }
	    }

	    if (data.name.length < 3 || data.name.length > 15) {
	      throw { message: 'Nome inválido!!!', appearance: 'warning', focus: 'inputName-User' }
	    }

	    if (data.password.length < 4 || data.password.length > 11) {
	      throw { message: 'Senha inválida!!!', appearance: 'warning', focus: 'inputPassword' }
	    } else {
	      if (data.password !== data.password2) {
	        throw { message: 'Senhas diferentes!!!', appearance: 'warning', focus: 'inputPassword2' }
	      }  
	    }
	  }

	  if (action === 'category-form') {
	    if (mode === 'Editar') {
	      if (data.name === data.originalName ) {
	        throw { message: 'Nada foi alterado!!!', appearance: 'warning', focus: false }
	      }
	    }

	    if (mode !== 'Excluir' ) {
				if (data.name.length < 3 || data.name.length > 14) {
		      throw { message: 'Nome inválido!!!', appearance: 'warning', focus: 'inputName-Category' }
		    } 	    		
	    }  
	  }

	  if (action === 'article-form') {
	  	if (!+data.userId || !+data.categoryId) {
	  		throw { message: 'Nenhum autor ou categoria selecionada!!!', appearance: 'error', focus: false }
	  	}

	  	if (data.name === data.originalName && data.description === data.originalDescription && data.imageUrl === data.originalImageUrl && data.originalContent === data.content) {
	  		throw { message: 'Nada foi alterado!!!', appearance: 'warning', focus: false }
	  	}

	  	if (mode !== 'Excluir') {
	  		if (data.name.length < 3 || data.name.length > 14) {
		  		throw { message: 'Nome do artigo inválido', appearance: 'warning', focus: 'inputName-Article' }
		  	}

		  	if (data.description.length > 200) {
		  		throw { message: 'Descrição muito longa', appearance: 'warning', focus: 'inputDesc-Article' }
		  	}
	  	}
	  }
	}
}
