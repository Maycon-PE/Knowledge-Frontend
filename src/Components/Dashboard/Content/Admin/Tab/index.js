import React from 'react'
import {
	NavItem, NavLink
} from 'reactstrap'
import classnames from 'classnames'

const Tab = ({ index, label, tab, setTab }) =>
	<NavItem style={{ cursor: 'pointer' }}>
		<NavLink className={classnames({ active: tab === index })}
      onClick={() => setTab(index) } >
      { label }
		</NavLink>
	</NavItem>

export default Tab
	