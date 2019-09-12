import React, { useState, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import {
	Table, Button, Form, 
  FormGroup, Label, Input, 
  Row, Col, CustomInput
} from 'reactstrap'

import io from '../../../../../../socket'

import * as doSearch from './search'
import { searchByName } from '../search'

import functions from '../../../../../../functions'

import api from '../../../../../../api'

import { pageAdmin, toasts } from '../../../../../../initio_states'

import {
	Tr as TrStyle,
	Thead as TheadStyle,	
	Search as SearchStyle,
  Filter as FilterStyle,
  TheadTitle as TheadTitleStyle
} from '../../styles'

import DropUp from '../DropUp'
import AdminDropUp from './dropsUp/Admin'

const User = ({ token }) => {
  const { addToast } = useToasts()
  const [divSearch, setDivSearch] = useState({ ...pageAdmin.global.INITIO_DIVSEARCH })
  const [filtersTerms, setFiltersTerms] = useState({ ...pageAdmin.userComponent.INITIO_FILTERSTERMS })
  const [filter, setFilter] = useState(['Todos', ''])
	const [mode, setMode] = useState({ ...pageAdmin.global.INITIO_MODE })
	const [user, setUser] = useState({ ...pageAdmin.userComponent.INITIO_USER })
	const [inTable, setInTable] = useState({ ...pageAdmin.userComponent.INITIO_INTABLE, ...pageAdmin.global.INITIO_INTABLE })

  const doRequest = () => {
    api
      .get('/users', { headers: { Authorization: `bearer ${ token }` } })
      .then(({ data }) => {
            const users = { ...pageAdmin.userComponent.INITIO_INTABLE }
            users.users = data.reverse()
            users.ready = true
            users.failed = false
            setInTable(users)
          })
      .catch(e => {
        const users = { ...pageAdmin.userComponent.INITIO_INTABLE }
        users.ready = true
        users.failed = true
        setInTable(users)
      })
  }

  io.on('connect', () => {
    inTable.failed && doRequest()
  })

  io.on('disconnect', () => {
    setInTable({ ...inTable, failed: true })
  })

	useEffect(() => {
    doRequest()
	}, [token])

  const search = (functionName, key) => {
    let result

    if (functionName === 'searchByName') result = searchByName('users', filtersTerms, filter, inTable, key)
    else result = doSearch[functionName](filtersTerms, filter, inTable, key)

    const  { inTable: newInTable, filter: newFilter, filtersTerms: newFiltersTerms } = result

    setInTable({ ...newInTable, ready: newInTable.ready ? true : false})
    setFiltersTerms(newFiltersTerms)
    setFilter(newFilter)

    if (newInTable.mode === 'users') noFilter()
  }

  const noFilter = () => {
    setInTable({ ...inTable, mode: 'users' })
    setFiltersTerms({ ...pageAdmin.userComponent.INITIO_FILTERSTERMS })
    setFilter(['Todos', ''])
  }

  const openOrCloseDivSearch = which => {
    const opened = divSearch.which === which ? false : true

    if (opened) {
      setFiltersTerms({ ...pageAdmin.userComponent.INITIO_FILTERSTERMS })
      window.onkeyup = ({ keyCode }) => {
        if (keyCode === 27) {
          setInTable({ ...inTable, mode: 'users' })
          setFilter(['Todos', ''])
          setDivSearch({ ...pageAdmin.userComponent.INITIO_DIVSEARCH })
        }
      }
    } else {
      setInTable({ ...inTable, mode: 'users' })
      setFilter(['Todos', ''])
      window.onkeyup = () => {}
    }

    which !== 'admin' && functions.setFocus(`input-search-${which}`)

    setDivSearch({ opened, which: opened ? which : '' })
  }

  const submit = e => {
    e.preventDefault()

    try {
      functions.verify('user-form', mode.label, user)

      setMode({ ...mode, exec: true })

      const data = { 
        id: user.id,
        email: user.email, 
        name: user.name, 
        admin: user.admin,
        password: user.password,
        confirmPassword: user.password2 
      }

      switch(mode.label) {
        case 'Excluir':
          api
            .delete(`/users/${user.id}`, { headers: { Authorization: `bearer ${ token }` } })
            .then(() => {
              addToast('Exluido com sucesso!', { ...toasts, appearance: 'info' })
              setUser({ ...pageAdmin.userComponent.INITIO_USER })
              setMode({ ...pageAdmin.global.INITIO_MODE })
              if (user.id) {
                const newUsers = { ...inTable }
                newUsers.users = newUsers.users.filter(({ id }) => user.id !== id)
                setInTable(newUsers)
              }
            }).catch(() => {
              setMode({ ...mode, exec: false })
              addToast('Não foi possível excluir!', { ...toasts, appearance: 'error' })
            })
          break
        case 'Editar':
          api 
            .put(`/users/${user.id}`, data, { headers: { Authorization: `bearer ${ token }` } })
            .then(() => {
              if (user.id) {
                const newUsers = { ...inTable }
                newUsers.users = newUsers.users.map(user => user.id === data.id ? data : user)
                setInTable(newUsers)
              }
              setUser({ ...pageAdmin.userComponent.INITIO_USER })
              setMode({ ...pageAdmin.global.INITIO_MODE })
              addToast('Usuário alterado com sucesso!', { ...toasts, appearance: 'success' })
            })
            .catch(() => {
              setMode({ ...mode, exec: false })
              addToast('Alteração não realizada!', { ...toasts, appearance: 'error' })
            })
          break
         default:
          api
            .post('/users', data, { headers: { Authorization: `bearer ${ token }` } })
            .then(() => {
              setMode({ ...pageAdmin.global.INITIO_MODE })
              setUser({ ...pageAdmin.userComponent.INITIO_USER })
              const newUsers = { ...inTable }
              newUsers.users = [ data, ...inTable.users ]  
              setInTable({ ...newUsers })
              addToast('Cadastro realizado com sucesso!', { ...toasts, appearance: 'success' })
            })
            .catch(() => {
              setMode({ ...mode, exec: false })
              addToast('Cadastro não realizado!', { ...toasts, appearance: 'error' })
            })   
      }
    } catch({ message, appearance, focus }) {
      addToast(message, { ...toasts, appearance: appearance})
      setMode({ ...mode, exec: false })
      focus && functions.setFocus(focus)
    }
  }

	return (
    <div>
      <Form 
        style={{ maxWidth: '900px', margin: 'auto', padding: '10px' }}
        onSubmit={submit}
        autoComplete='off'>
        <Row>
          <Col md='6' sm='12'>
            <FormGroup>
              <Label htmlFor='inputEmail'>Email</Label>
              <Input readOnly={ mode.label === 'Excluir' } type='email' name='email' id='inputEmail' placeholder='Email do usuário' minLength='6' maxLength='50' value={user.email} onChange={({ target }) => setUser({ ...user, email: target.value })} />
            </FormGroup>
          </Col>
          <Col md='6' sm='12'>
            <FormGroup>
              <Label htmlFor='inputName-User'>Nome</Label>
              <Input readOnly={ mode.label === 'Excluir' } name='name' id='inputName-User' placeholder='Nome do usuário' minLength='3' maxLength='14' value={user.name} onChange={({ target }) => setUser({ ...user, name: target.value })} />
            </FormGroup>
          </Col>
          <Col md='6' sm='12'>
            <FormGroup>
              <Label htmlFor='inputPassword1'>Senha</Label>
              <Input type='password' name='password' id='inputPassword1' placeholder='Senha' minLength='4' maxLength='11' value={user.password} onChange={({ target }) => setUser({ ...user, password: target.value })} />
            </FormGroup>
          </Col>
          <Col md='6' sm='12'>
            <FormGroup>
              <Label htmlFor='inputPassword2'>Confirme a senha</Label>
              <Input type='password' name='passwordConfirm' id='inputPassword2' placeholder='Confirme a senha' minLength='4' maxLength='11' value={user.password2} onChange={({ target }) => setUser({ ...user, password2: target.value })} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup check>
              <Label check>
                { mode.label === 'Excluir' ? `Usuário ${user.admin ? 'é' : 'não é'} administrador! ` : <CustomInput checked={ user.admin } type='switch' id='switch-adm' name='admin' label='Administrador' onChange={() => setUser({ ...user, admin: !user.admin })} /> } 
              </Label>
            </FormGroup>
          </Col> 
        </Row>
        <Row>
          <Col className='pt-2'>
            <Button type='submit' color={mode.color} size='md' disabled={ mode.exec }>{ mode.label }</Button>
            <Button type='button' color='secondary' className='ml-2' size='md' disabled={ mode.exec } onClick={() => {
              setUser({ ...pageAdmin.userComponent.INITIO_USER })
              setMode({ ...pageAdmin.global.INITIO_MODE })
            }}>Cancelar</Button>
          </Col>
        </Row>
      </Form>
  	  <Table striped>
        <thead>
          <tr>
            <TheadTitleStyle colSpan='5'>
              <FilterStyle on={ filter[0] !== 'Todos' }><i title='Tirar filtro' onClick={ noFilter } className='fa fa-power-off'></i> { filter[0].length ? filter.join(' > ') : 'Todos >' }</FilterStyle>
              Usuários na plataforma
            </TheadTitleStyle>
          </tr>
          <tr>
            <TheadStyle>#</TheadStyle>
            <TheadStyle active={ divSearch.opened && divSearch.which === 'name-user' } term={ filter[0] === 'Nome' } className='dropup'>Nome 
              <SearchStyle visible={ divSearch.opened && divSearch.which === 'name-user' }> <DropUp placeholder='Filtrar pelo nome' id='input-search-name-user' search={ key => search('searchByName', key) } value={ filtersTerms.name } /> </SearchStyle>
              <span className='icon-filter' onClick={ () => openOrCloseDivSearch('name-user') } title='Filtrar pelo nome'><i className='fa fa-filter'></i></span>
            </TheadStyle>
            <TheadStyle active={ divSearch.opened && divSearch.which === 'email-user' } term={ filter[0] === 'Email' } className='dropup'>Email 
              <SearchStyle visible={ divSearch.opened && divSearch.which === 'email-user' }> <DropUp placeholder='Filtrar pelo email' id='input-search-email-user' search={ key => search('searchByEmail', key) } value={ filtersTerms.email } /> </SearchStyle>
              <span className='icon-filter' onClick={ () => openOrCloseDivSearch('email-user') } title='Filtrar pelo email'><i className='fa fa-filter'></i></span>
            </TheadStyle>
            <TheadStyle active={ divSearch.opened && divSearch.which === 'admin' } term={ filter[0] === 'Admin' } className='dropup'>Admin
              <SearchStyle visible={ divSearch.opened && divSearch.which === 'admin' }> <AdminDropUp search={ key => search('searchByAdmin', key) } value={ filtersTerms.admin } /> </SearchStyle>
              <span className='icon-filter' onClick={ () => openOrCloseDivSearch('admin') } title='Filtrar pelo privilégio'><i className='fa fa-filter'></i></span>
            </TheadStyle>  
            <TheadStyle style={{ width: '152px' }}>Ações</TheadStyle>
          </tr>
        </thead>
        <tbody>
        	{ inTable.ready ? inTable[inTable.mode].length ? inTable[inTable.mode].map(({ id, name, email, admin }, index) => 
          		<TrStyle scope='row' key={ email }>
                <td> { index + 1 }</td>
                <td> { name } </td>
                <td> { email } </td>
                <td> { admin ? 'Sim': 'Não' } </td>
                <td style={{ display: 'flex', flexFlow: 'row wrap', alignItems: 'space-between', justifyContent: 'space-between' }}>
                  <Button style={{ flex: '1' }} onClick={() => {
                    setDivSearch({ ...pageAdmin.global.INITIO_DIVSEARCH })
                    setUser({ ...pageAdmin.userComponent.INITIO_USER, id, name, email, admin, originalName: name, originalEmail: email, originalAdmin: admin })
                    setMode({ label: 'Editar', color: 'warning' })
                  }} color={ mode.label === 'Editar' ? user.id === id ? 'secondary': 'warning' : 'warning' } disabled={ mode.label === 'Editar' ? user.id === id : false } size='sm'>Editar</Button>
                  <Button style={{ flex: '1' }} onClick={() => {
                    setDivSearch({ ...pageAdmin.global.INITIO_DIVSEARCH })
                    setUser({ ...pageAdmin.userComponent.INITIO_USER, id, name, email, admin })
                    setMode({ label: 'Excluir', color: 'danger' })
                  }} color={ mode.label === 'Excluir' ? user.id === id ? 'secondary' : 'danger' : 'danger' } disabled={ mode.label === 'Excluir' ? user.id === id : false } size='sm'>Excluir</Button>
                </td>
              </TrStyle>
        	) : <tr><td colSpan='5' style={{ textAlign: 'center' }}>{ inTable.failed ? 'Reconectando ...' : 'Ninguém :/' }</td></tr> :
          <tr><td colSpan='5' style={{ textAlign: 'center' }}>Carregando...</td></tr> }
        </tbody>
      </Table>
    </div>
	) 
}

export default User
