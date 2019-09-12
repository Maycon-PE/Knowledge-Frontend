import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { FormGroup, Label, Input, Col, Row, Button } from 'reactstrap'
import { useToasts } from 'react-toast-notifications'

import api from '../../api'

import * as actions from '../../store/reducers/dashboard/actions'

import { userData, toasts, userInLocalStorage } from '../../initio_states'

import {
	Area as AreaStyle,
	AreaLimit as AreaLimitStyle,
	Content as ContentStyle,
	Base as BaseStyle
} from './styles'

import Header from '../../Components/Both/Header/'
import Footer from '../../Components/Both/Footer/'

const Home = ({ dispatch, history }) => {
	const [login, setLogin] = useState(true)
	const [user, setUser] = useState({ ...userData })

	const { addToast } = useToasts()

	const submit = e => {
		e.preventDefault()

		if (login) {
			if (!user.email.length || !user.password.length) {
				addToast('Preencha todos os campos', { ...toasts, appearance: 'warning' })

				return
			}

			if (user.email.length < 6 || user.email.length > 50) {
				addToast('Email inválido', { ...toasts, appearance: 'warning' })

				return
			}

			if (user.password.length < 5 || user.password.length > 15) {
				addToast('Senha inválida', { ...toasts, appearance: 'warning' })

				return
			}

			api.post('/signin', { email: user.email, password: user.password })
				.then(({ data }) => {
					console.log('data ', data)
					dispatch(actions.setUser(data))
					localStorage.setItem(userInLocalStorage, JSON.stringify(data))

					history.push('/dashboard')
				}).catch(() => {
					addToast('Têm alguma informação errada!', { ...toasts, appearance: 'error' })
				})
		} else {
			if (!user.name.length || !user.email.length || !user.password.length || !user.confirmPassword.length) {
				addToast('Preencha todos os campos', { ...toasts, appearance: 'warning' })

				return
			}

			if (user.name.length < 2 || user.name.length > 15) {
				addToast('Nome inválido', { ...toasts, appearance: 'warning' })

				return	
			}

			if (user.email.length < 6 || user.email.length > 50) {
				addToast('Email inválido', { ...toasts, appearance: 'warning' })

				return
			}

			if (user.password.length < 5 || user.password.length > 15) {
				addToast('Senha inválida', { ...toasts, appearance: 'warning' })

				return
			} else {
				if (user.password === user.confirmPassword) {
					api.post('/signup', user)
						.then(({ data }) => {
							setUser({ ...userData })
							setLogin(true)
							addToast('Cadastrado com sucesso', { ...toasts, appearance: 'success' })
						}).catch(() => {
							addToast('Registro não realizado', { ...toasts, appearance: 'error' })
						})
				} else {
					addToast('Senhas diferentes', { ...toasts, appearance: 'warning' })
				}
			}
		}
	}

	useEffect(() => {
		let user = localStorage.getItem(userInLocalStorage)

		if (user) {
			user = JSON.parse(user)
			if (parseInt(Date.now() / 1000) < user.exp) {
				if (window.confirm(`Já existe um usuário logado, prosseguir como ${user.name}? `)) {
					delete user.password
					dispatch(actions.setUser(user))
					history.push('/dashboard')	
				} else {
					localStorage.removeItem(userInLocalStorage)
				}
			} else {
				localStorage.removeItem(userInLocalStorage)
				addToast('Ultimo usuário logado teve o token expirado', { ...toasts, appearance: 'info' })
			}
		}
	}, [history, dispatch, addToast])

	return <AreaStyle>
		<Header />
		<ContentStyle>
			<AreaLimitStyle onSubmit={submit} autoComplete='off'>
				<img src='./images/logo.png' alt='logo' />
				<hr />
				{ login ? <div>
					<FormGroup>
	          <Label for="signinEmail">Email</Label>
	          <Input value={ user.email } type="email" id="signinEmail" maxLength='50' minLength='6' placeholder="Digite seu email" onChange={({ target }) => setUser({ ...user, email: target.value })} />
	        </FormGroup>
	        <FormGroup>
	          <Label for="signinPassword">Senha</Label>
	          <Input value={ user.password } type="password" id="signinPassword" maxLength='15' minLength='5' placeholder="Digite sua senha" onChange={({ target }) => setUser({ ...user, password: target.value })} />
	        </FormGroup>
				</div> : <div>
					<FormGroup>
	          <Label for="signupName">Nome</Label>
	          <Input value={ user.name } type="text" id="signupName" placeholder="Digite seu nome" maxLength='15' minLength='2' onChange={({ target }) => setUser({ ...user, name: target.value })} />
	        </FormGroup>
					<FormGroup>
	          <Label for="signupEmail">Email</Label>
	          <Input value={ user.email } type="email" id="signupEmail" maxLength='50' minLength='6' placeholder="Digite seu email" onChange={({ target }) => setUser({ ...user, email: target.value })} />
	        </FormGroup>
	        <Row>
	        	<Col>
	        		<FormGroup>
			          <Label for="signupPassword1">Senha</Label>
			          <Input value={ user.password } type="password" id="signupPassword1" maxLength='15' minLength='5' placeholder="Digite sua senha" onChange={({ target }) => setUser({ ...user, password: target.value })} />
			        </FormGroup>	
	        	</Col>
	        	<Col>
	        		<FormGroup>
			          <Label for="signupPassword2">Confirmação</Label>
			          <Input value={ user.confirmPassword } type="password" id="signupPassword2" maxLength='15' minLength='5' placeholder="Confirme a senha" onChange={({ target }) => setUser({ ...user, confirmPassword: target.value })} />
			        </FormGroup>
	        	</Col>
	        </Row>
				</div> }
				<BaseStyle>
					<Button color='secondary' onClick={() => setUser({ ...userData })}>Limpar</Button>
					<Button color='primary' type='submit'>{ login ? 'Entrar' : 'Cadastrar' }</Button>
				</BaseStyle>
				<span onClick={() => {
					setUser({ ...userData })
					setLogin(!login)
				}}>{ login ? 'Não tem uma conta? Crie uma!' : 'Já tenho uma conta!' }</span>
			</AreaLimitStyle>
		</ContentStyle>
	</AreaStyle>
}

const mapStateToProps = state =>
	({})

export default connect(mapStateToProps)(Home)
