import React from 'react'
import { Provider } from 'react-redux'
import { ToastProvider } from 'react-toast-notifications'

import store from './store/'

import Routes from './routes'

const App = () => 
	<Provider store={store}>
		<ToastProvider>
			<Routes />
		</ToastProvider>
	</Provider>

export default App 
