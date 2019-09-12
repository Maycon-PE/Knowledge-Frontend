import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'

import io from './socket'

import { toasts } from './initio_states'

import Home from './pages/Home/'
import Dashboard from './pages/Dashboard'

const Routes = () => {
	const { addToast } = useToasts()

	useEffect(() => {
		io.on('connect_error', () => {
			addToast('Reconectando... :/', { 
				...toasts,
			  appearance: 'info'
			})
		})

		io.on('disconnect', () => {
			addToast('Servidor caiu :(', { 
				...toasts,
				autoDismiss: false,
			  appearance: 'error'
			})
		})

		io.on('connect', () => {
			addToast('Servidor OK! <3', { 
				...toasts,
				autoDismiss: false,
		    appearance: 'success'
			})
		})
	}, [])

	return (
		<Router>
			<Switch>
				<Route exact path='/' component={Home} />
				<Route path='/dashboard' component={Dashboard} />
				<Redirect from='*' to='/' />
			</Switch>
		</Router>
	)
}

export default Routes
