import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import { pageAdmin } from '../../../../../../initio_states'

const Editor = ({ value, onChange, readOnly }) => 
	<ReactQuill 
		value={ value }
    onChange={ onChange }
    placeholder='Escreva aqui seu artigo!'
    modules={{ ...pageAdmin.articleComponent.INITIO_QUILL }} 
    readOnly={ readOnly }
    />

export default Editor
