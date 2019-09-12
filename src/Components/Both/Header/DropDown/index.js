import React from 'react'
import { connect } from 'react-redux'
import Gravatar from 'react-gravatar'
import hash from 'hash.js'

import * as actions from '../../../../store/reducers/dashboard/actions'

import { userInLocalStorage } from '../../../../initio_states'

import {
  DropDown as DropDownStyle,
  DropDownVisible as DropDownVisibleStyle,
  DropDownHidden as DropDownHiddenStyle
} from './styles'

const makeHash = email => hash.sha256().update(email).digest('hex')

const DropDown = ({ name, email, admin, dispatch, history }) => 
  <DropDownStyle>
    <DropDownVisibleStyle>
      { name }
      <Gravatar email={makeHash(email)} size={30} />
      <i className='fa fa-angle-down'></i>
    </DropDownVisibleStyle>
    <DropDownHiddenStyle>
      <span onClick={() => dispatch(actions.toggleTitle(0))}><i className='fa fa-book'></i><label>Artigos</label></span>
      <span onClick={() => dispatch(actions.toggleTitle(1))}><i className='fa fa-home'></i><label>Estatísticas</label></span>
      { admin ? <span onClick={() => dispatch(actions.toggleTitle(2))}><i className='fa fa-cog'></i><label>Administração</label></span> : null }
      <span onClick={() => {
        dispatch(actions.logout())
        localStorage.removeItem(userInLocalStorage)
        history.push('/')
      }}><i className='fa fa-times-circle'></i><label>Sair</label></span>
    </DropDownHiddenStyle>
  </DropDownStyle>

const mapStateToProps = state => 
  (
    { name: 
       state.pageDashboard.user.name,
      email: 
       state.pageDashboard.user.email,
      admin:
       state.pageDashboard.user.admin
    }
  )

export default connect(mapStateToProps)(DropDown)
