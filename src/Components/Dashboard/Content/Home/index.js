import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import api from '../../../../api'

import io from '../../../../socket'

import * as actions from '../../../../store/reducers/dashboard/actions'

import {
	AreaStats as AreaStatsStyle
} from './styles'

import Stat from './Stat/'

const Home = ({ token }) => {
	const [request, setRequest] = useState({ status: null, finished: false })
	const [data, setData] = useState({ categories: 0, users: 0, articles: 0 })

	io.on('connect_error', () => setRequest({ ...request, status: false }))
	io.on('connect', () => {
		!request.status && doRequest()
	})

	const doRequest = () => {
		api('/stats', { headers: { 'Authorization': `bearer ${token}` } })
			.then(({ data }) => {
				setRequest({ status: true, finished: true })
				setData({ categories: data.categories, users: data.users, articles: data.articles })
			})
			.catch(e =>	{
				setRequest({  status: false, finished: true })
			})	
	}

	io.on('new_stats', () => {
		doRequest()
	})

	useEffect(() => {
		!request.finished && doRequest()
	}, [request, token])

	return (
		<AreaStatsStyle>
			<Stat req={ request } value={ data.categories } label='Categorias' color='#D54D50' icon='fa-folder' />
			<Stat req={ request } value={ data.articles } label='Artigos' color='#3BCE80' icon='fa-file' />
			<Stat req={ request } value={ data.users } label='Usuários' color='#3282CD' icon='fa-user' />
		</AreaStatsStyle>
	)
}

const mapStateToProps = state => {
	const reduxProps = { }

	try {
		reduxProps.token = state.pageDashboard.user.token 
	} catch(e) {  }

	return ( reduxProps )
}


export default connect(mapStateToProps)(Home)
