import React from 'react'
import { 
	InputGroup, InputGroupAddon, Input 
} from 'reactstrap'

const DropUp = ({ id, placeholder, search, value }) =>
	<InputGroup>
    <InputGroupAddon addonType="prepend">@</InputGroupAddon>
    <Input id={ id }
     	value={ value }
    	placeholder={ placeholder }
    	onChange={ ({ target }) => search(target.value)} />
   </InputGroup>

export default DropUp
