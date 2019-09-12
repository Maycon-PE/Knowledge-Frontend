import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../store/reducers/dashboard/actions'

import { 
	Area as AreaStyle,
	toggleMenu as MenuStyle,
	Title as TitleStyle
} from './styles'

import DropDown from './DropDown/'

const Header = ({ dashboard, title, menu, dispatch, user, history }) =>
	<AreaStyle>
		{ user && <MenuStyle opened={menu} onClick={() => dispatch(actions.toggleMenu(!menu))}>
			<i className='fa fa-lg fa-angle-left'></i>
		</MenuStyle> }
		<TitleStyle dashboard={dashboard}>
			<span onClick={() => dashboard && dispatch(actions.toggleTitle(0))}> Base de conhecimento </span>
		</TitleStyle>
		{ user && <DropDown history={history} /> }
	</AreaStyle>

const mapStateToProps = state => 
	({ 
		menu: state.pageDashboard.menu,
		user: state.pageDashboard.user,
	})

export default connect(mapStateToProps)(Header)
