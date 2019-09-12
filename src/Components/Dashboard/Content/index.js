import React from 'react'
import { connect } from 'react-redux'

import { 
	Area as AreaStyle 
} from './styles'

import Title from '../Title/'
import Home from './Home/'
import Admin from './Admin/'
import Article from './Article/'

const Content = ({ index }) => 
	<AreaStyle>
		<Title />
		{ index === 0 && <Article /> }
		{ index === 1 && <Home /> }
		{ index === 2 && <Admin /> }
	</AreaStyle>

const mapStateToProps = state => {
	const index = state.pageDashboard.titles.index

	return ({ index })
}

export default connect(mapStateToProps)(Content)
