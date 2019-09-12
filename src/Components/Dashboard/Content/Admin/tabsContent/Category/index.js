import React, { useState, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import PaginationComponent from 'react-reactstrap-pagination'
import {
	Table, Button, Form, 
  FormGroup, Label, Input, 
  Row, Col
} from 'reactstrap'

import io from '../../../../../../socket'

import { searchByName } from '../search'

import functions from '../../../../../../functions'

import api from '../../../../../../api'

import { pageAdmin, toasts } from '../../../../../../initio_states'

import {
	Tr as TrStyle,
	Thead as TheadStyle,	
	Search as SearchStyle,
  Filter as FilterStyle,
  TheadTitle as TheadTitleStyle,
  PaginationArea as PaginationAreaStyle
} from '../../styles'

import DropUp from '../DropUp'

const Category = ({ token }) => {
	const { addToast } = useToasts()
  const [pageActual, setPageActual] = useState(1)
  const [pageSettings, setPageSettings] = useState({ ...pageAdmin.global.INITIO_PAGINATION })
  const [divSearch, setDivSearch] = useState({ ...pageAdmin.global.INITIO_DIVSEARCH })
  const [filtersTerms, setFiltersTerms] = useState({ ...pageAdmin.categoryComponent.INITIO_FILTERSTERMS })
  const [filter, setFilter] = useState(['Todos', ''])
	const [mode, setMode] = useState({ ...pageAdmin.global.INITIO_MODE })
	const [category, setCategory] = useState({ ...pageAdmin.categoryComponent.INITIO_CATEGORY })
	const [inTable, setInTable] = useState({ ...pageAdmin.categoryComponent.INITIO_INTABLE, ...pageAdmin.global.INITIO_INTABLE })

  const doRequest = (p) => {
    const failed = () => {
      const categories = { ...pageAdmin.categoryComponent.INITIO_INTABLE }
      categories.ready = true
      categories.failed = true
      setInTable({ ...categories, requesting: false })
    }

    setInTable({ ...inTable, requesting: true })
    api.get(`/categories?page=${p || 1}`, { headers: { Authorization: `bearer ${ token }` } })
      .then(({ data }) => {
          const categories = { ...pageAdmin.categoryComponent.INITIO_INTABLE }
          setPageSettings({ count: data.count || 1, limit: data.limit })
          categories.categories = data.data
          categories.ready = true
          categories.failed = false
          api.get('/categories?all', { headers: { Authorization: `bearer ${ token }` } })
            .then(res => {
              categories.paths = res.data
              setInTable({ ...categories, requesting: false })
            }).catch(() => {
              failed()
            })
        })
      .catch(() => {
        failed()
      })
  }

  io.on('connect', () => {
    inTable.failed && doRequest(pageActual)
  })

  io.on('disconnect', () => {
    setInTable({ ...inTable, failed: true })
  })

	useEffect(() => {
	  doRequest()
	}, [token])

  const setParentId = (parentId) => {
    if (+parentId === 0) {
      setCategory({ ...category, parentId: null, path: '' })
    } else {
      const parentObject = inTable.paths.find(({ id }) => id === +parentId)
      setCategory({ ...category, changed: false, parentId: parentObject.id, path: parentObject.path })
    }
  }

  const search = (key) => {
    const result = searchByName('categories', filtersTerms, filter, inTable, key)

    const  { inTable: newInTable, filter: newFilter, filtersTerms: newFiltersTerms } = result

    setInTable({ ...newInTable, ready: newInTable.ready ? true : false})
    setFiltersTerms(newFiltersTerms)
    setFilter(newFilter)

    if (newInTable.mode === 'categories') noFilter()
  }

  const noFilter = () => {
    setInTable({ ...inTable, mode: 'categories' })
    setFiltersTerms({ ...pageAdmin.categoryComponent.INITIO_FILTERSTERMS })
    setFilter(['Todos', ''])
  }

  const openOrCloseDivSearch = which => {
    const opened = divSearch.which === which ? false : true

    if (opened) {
      setFiltersTerms({ ...pageAdmin.categoryComponent.INITIO_FILTERSTERMS })
      window.onkeyup = ({ keyCode }) => {
        if (keyCode === 27) {
          setInTable({ ...inTable, mode: 'categories' })
          setFilter(['Todos', ''])
          setDivSearch({ ...pageAdmin.categoryComponent.INITIO_DIVSEARCH })
        }
      }
    } else {
      setInTable({ ...inTable, mode: 'categories' })
      setFilter(['Todos', ''])
      window.onkeyup = () => {}
    }

    setDivSearch({ opened, which: opened ? which : '' })

    functions.setFocus('input-search-name-category')
  }

  const submit = e => {
    e.preventDefault()

    try {
      functions.verify('category-form', mode.label, category)

      setMode({ ...mode, exec: true })

      const data = { 
        name: category.name,
        parentId: category.parentId > 0 ? category.parentId : undefined
      }

      switch(mode.label) {
        case 'Excluir':
          api.delete(`/categories/${category.id}`, { headers: { Authorization: `bearer ${ token }` } })
            .then(() => {
              if (inTable.categories.length - 1 === 0) {
                doRequest(pageActual - 1)
                setPageActual(pageActual - 1)
              } else doRequest(pageActual)


              setMode({ ...pageAdmin.global.INITIO_MODE })
              setCategory({ ...pageAdmin.categoryComponent.INITIO_CATEGORY })
              addToast('Excluido com sucesso!', { ...toasts, appearance: 'info' })
            })
            .catch(() => {
              setMode({ ...mode, exec: false })
              addToast('Não foi possível excluir!', { ...toasts, appearance: 'error' })
            })
          
          break
        case 'Editar':
          api 
            .put(`/categories/${category.id}`, data, { headers: { Authorization: `bearer ${ token }` } })
            .then(() => {
              let path = category.path.split('>')
              const newData = { ...category }
              let newCategories = [ ...inTable.categories ]
              if (path.length) {
                path[path.length - 1] = category.name
                path = path.join(' > ')

                newCategories = inTable.categories.filter(({ id }) => category.id !== id)
              }
              newData.path = path
              setInTable({ ...pageAdmin.categoryComponent.INITIO_INTABLE, categories: [newData, ...newCategories], ready: true, failed: false })
              setCategory({ ...pageAdmin.categoryComponent.INITIO_CATEGORY })
              setMode({ ...pageAdmin.global.INITIO_MODE })
              addToast('Categoria editada com sucesso!', { ...toasts, appearance: 'success'})
            })
            .catch(() => {
              setMode({ ...mode, exec: false })
              addToast('Categoria não foi editada!', { ...toasts, appearance: 'error'})
            })
          break
         default:
          api
            .post('/categories', data, { headers: { Authorization: `bearer ${ token }` } })
            .then(() => {
              setMode({ ...pageAdmin.global.INITIO_MODE })
              setCategory({ ...pageAdmin.categoryComponent.INITIO_CATEGORY })           
              doRequest(pageActual)
              addToast('Categoria salvada com sucesso!', { ...toasts, appearance: 'success'})
              
            })
            .catch(() => {
              setMode({ ...mode, exec: false })
              addToast('Categoria não salvada!', { ...toasts, appearance: 'error'})
            })   
      }
    } catch({ message, appearance, focus }) {
      addToast(message, { ...toasts, appearance: appearance})

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
          <Col md='12'>
            <FormGroup>
              <Label htmlFor='inputName-Category'>Nome</Label>
              <Input readOnly={ mode.label === 'Excluir' } name='name' id='inputName-Category' placeholder='Nome da categoria' minLength='3' maxLength='14' value={category.name} onChange={({ target }) => setCategory({ ...category, name: target.value })} />
            </FormGroup>
          </Col>
        </Row>
         { mode.label === 'Salvar' && <Row>
          <Col md='12'>
            <FormGroup>
              <Label for='inputPath-Category'>Pai</Label>
              <Input type='select' name='path' onChange={({ target }) => setParentId(target.value)}>
                <optgroup label='Destino'>
                  <option value='0'>Raiz (Categoria global)</option>
                  { inTable.paths.map(({ id, name, path }, index) => <option key={`${index}-${path}`} value={ id }>{ name }</option>) }
                </optgroup>
              </Input>
            </FormGroup>
          </Col>
        </Row> }
        <Row>
          <Col md='12'>
            <FormGroup>
              <Label for='path-describe'>Destino</Label>
              <Input type='text' readOnly={true} name='path-describe' id='path-describe' value={ category.path || 'Raiz' } />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className='pt-2'>
            <Button type='submit' color={mode.color} size='md' disabled={ mode.exec }>{ mode.label }</Button>
            <Button type='button' color='secondary' className='ml-2' size='md' disabled={ mode.exec } onClick={() => {
              setCategory({ ...pageAdmin.categoryComponent.INITIO_CATEGORY })
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
              Categorias na plataforma
            </TheadTitleStyle>
          </tr>
          <tr>
            <TheadStyle>#</TheadStyle>
            <TheadStyle active={ divSearch.opened && divSearch.which === 'name-category' } term={ filter[0] === 'Nome' } className='dropup'>Nome 
              <SearchStyle visible={ divSearch.opened && divSearch.which === 'name-category' }> <DropUp placeholder='Filtrar pelo nome' id='input-search-name-category' search={ key => search(key) } value={ filtersTerms.name } /> </SearchStyle>
              <span className='icon-filter' onClick={ () => openOrCloseDivSearch('name-category') } title='Filtrar pelo nome'><i className='fa fa-filter'></i></span>
            </TheadStyle>
            <TheadStyle>Destino</TheadStyle>
            <TheadStyle style={{ width: '152px' }}>Ações</TheadStyle>
          </tr>
        </thead>
        <tbody>
        	{ inTable.ready ? inTable[inTable.mode].length ? inTable[inTable.mode].map(({ id, name, path, parentId }, index) => 
          		<TrStyle scope='row' key={`category_${name}-${id}`}>
                <td> { id }</td>
                <td> { name } </td>
                <td> { path.indexOf('>') === -1 ? 'Raiz' : path } </td>
                <td>
                  <Button onClick={() => {
                    setDivSearch({ ...pageAdmin.global.INITIO_DIVSEARCH })
                    setCategory({ id, name, originalName: name, path, parentId })
                    setMode({ label: 'Editar', color: 'warning' })
                  }} color={ mode.label === 'Editar' ? category.id === id ? 'secondary': 'warning' : 'warning' } disabled={ mode.label === 'Editar' ? category.id === id : false } size='sm'>Editar</Button>
                  <Button className='ml-2' onClick={() => {
                    setDivSearch({ ...pageAdmin.global.INITIO_DIVSEARCH })
                    setCategory({ ...pageAdmin.categoryComponent.INITIO_CATEGORY, id, name, path })
                    setMode({ label: 'Excluir', color: 'danger' })
                  }} color={ mode.label === 'Excluir' ? category.id === id ? 'secondary' : 'danger' : 'danger' } disabled={ mode.label === 'Excluir' ? category.id === id : false } size='sm'>Excluir</Button>
                </td>
              </TrStyle>
        	) : <tr><td colSpan='4' style={{ textAlign: 'center' }}>{ inTable.failed ? 'Reconectando ...' : 'Nenhuma :/' }</td></tr> :
          <tr><td colSpan='4' style={{ textAlign: 'center' }}>Carregando...</td></tr> }
        </tbody>
      </Table>
      <PaginationAreaStyle filtering={ filter[0] !== 'Todos' }  title={`Um total de ${pageSettings.count} artigos`}>
        <PaginationComponent
          firstPageText='<<'
          previousPageText='|<'
          nextPageText='>|'
          lastPageText='>>'
          maxPaginationNumbers={10}
          activePage={pageActual}
          totalItems={pageSettings.count}
          pageSize={pageSettings.limit}
          onSelect={p => {
            doRequest(p)
            setPageActual(p)
          }}
        />
      </PaginationAreaStyle>
    </div>
	) 
}

export default Category
