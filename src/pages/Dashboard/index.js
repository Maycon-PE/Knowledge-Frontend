import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useToasts } from 'react-toast-notifications'

import {
	Area as AreaStyle
} from './styles'

import * as actions from '../../store/reducers/dashboard/actions'

import { userInLocalStorage, toasts } from '../../initio_states'

import Content from '../../Components/Dashboard/Content/'
import Footer from '../../Components/Both/Footer/'
import Header from '../../Components/Both/Header/'
import Menu from '../../Components/Dashboard/Menu/'

const Dashboard = ({ menu, history, dispatch }) => {
	const { addToast } = useToasts()

	useEffect(() => {
		let user = localStorage.getItem(userInLocalStorage)

		if (user) {
			user = JSON.parse(user)
			if (parseInt(Date.now() / 1000) < user.exp) {
				delete user.password
			  dispatch(actions.setUser(user))
			} else {
				localStorage.removeItem(userInLocalStorage)
				addToast('Ultimo usuário logado teve o token expirado', { ...toasts, appearance: 'info' })
				history.push('/')
			}
		} else {
			addToast('Nenhum usuário logado na aplicação', { ...toasts, appearance: 'info' })
			history.push('/')
		}
	}, [history, dispatch, addToast])

	return (
		<AreaStyle menu={menu}>
			<Header dashboard={true} history={history} />
	  	<Menu />
	  	<Content />
	  	<Footer />
	  </AreaStyle>
	)
}

const mapStateToProps = state =>
	({ menu: state.pageDashboard.menu })

export default connect(mapStateToProps)(Dashboard)
