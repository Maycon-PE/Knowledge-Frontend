import React from 'react'
import {
	ButtonGroup, Button  
} from 'reactstrap'

const Admin = ({ search, value }) =>
	<ButtonGroup size="sm">
	  <Button onClick={() => search(0)}>Todos</Button>
	  <Button onClick={() => search(1)}>Comuns</Button>
	  <Button onClick={() => search(2)}>Adms</Button>
	</ButtonGroup>

export default Admin
