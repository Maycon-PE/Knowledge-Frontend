import React from 'react'
import { connect } from 'react-redux'

import {
	Area as AreaStyle
} from './styles'

const Home = ({ title, subtitle }) => 
	<AreaStyle>
		<h1><i className={ title.icon }></i> { title.text }</h1>
		<h4>{ subtitle }</h4>
		<hr />
	</AreaStyle>
	

const mapStateToProps = state => {
	const index = state.pageDashboard.titles.index

	return (
		{ 
			title: 
				state.pageDashboard.titles.lables[index].title,
			subtitle: 
				state.pageDashboard.titles.lables[index].subtitle,
		}
	)
}
	

export default connect(mapStateToProps)(Home)