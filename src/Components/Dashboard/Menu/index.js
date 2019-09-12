import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import TreeMenu from 'react-simple-tree-menu'

import api from '../../../api'
import io from '../../../socket'

import * as actions from '../../../store/reducers/dashboard/actions'

import { 
	Area as AreaStyle 
} from './styles'

const Menu = ({ menu, token, index, dispatch }) => {
	const [node, setNode] = useState([])
	const [requestSituation, setRequestSituation] = useState({ failed: false })

	const doRequest = () => {
		api
			.get('/categories/tree', { headers: { Authorization: `bearer ${token}` } })
			.then(({ data }) => {
				setNode(data)
				setRequestSituation({ failed: false })
			}).catch(e => {
				setRequestSituation({ failed: true })
			})
	}

	const changeCategory = id => {
		dispatch(actions.toggleCategory(id))
	}

	io.on('connect', () => {
		requestSituation.failed && doRequest()
	})

	io.on('new_category', () => {
		doRequest()
	})

	useEffect(() => {
		doRequest()
	}, [token])


	return menu && <AreaStyle>
			{ !requestSituation.failed ? node.length ? 
					<TreeMenu onClickItem={({ id }) => {
						if (index !== 0) {
							dispatch(actions.toggleTitle(0))
						}
						changeCategory(id)
					}} data={node} />
			 : <p>Nada para mostrar :/</p> : <p>Falha na requisição</p> }
		</AreaStyle>		
} 

const mapStateToProps = state => {
	const reduxProps = { menu: state.pageDashboard.menu, index: state.pageDashboard.titles.index }
	
	try {
		reduxProps.token = state.pageDashboard.user.token
	} catch (e) {  }

	return reduxProps
}

export default connect(mapStateToProps)(Menu)

