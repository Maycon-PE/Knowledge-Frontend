import React from 'react'

import {
	Area as AreaStyle,
	Icon as IconStyle,
	Info as InfoStyle,
	Title as TitleStyle,
	Value as ValueStyle
} from './styles'


const Stat = ({ req, value, label, icon, color }) => 
	<AreaStyle>
		<IconStyle iconColor={color}>
			<i className={`fa ${icon}`}></i>
		</IconStyle>
		<InfoStyle>
			<TitleStyle>{ label }</TitleStyle>
			{ req.finished ? req.status ? <ValueStyle type={typeof value}>{ value }</ValueStyle> :
					<ValueStyle type='string'>Erro na requisição</ValueStyle> :
					<span><img src='./images/loading.gif' alt='' /></span> 
			}
		</InfoStyle>
	</AreaStyle>

export default Stat