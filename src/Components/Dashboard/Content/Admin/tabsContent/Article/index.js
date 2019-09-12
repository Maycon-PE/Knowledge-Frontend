import React, { useState, useEffect } from 'react'
import { useToasts } from 'react-toast-notifications'
import { connect } from 'react-redux'
import conv from 'binstring'
import PaginationComponent from 'react-reactstrap-pagination'
import {
	Table, Button, Form, 
  FormGroup, Label, Input, 
  Row, Col
} from 'reactstrap'

import io from '../../../../../../socket'

import { searchByName } from '../search'

import * as doSearch from './search'

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

import Editor from './Editor'

const Article = ({ token }) => {
	const { addToast } = useToasts()
  const [pageActual, setPageActual] = useState(1)
  const [pageSettings, setPageSettings] = useState({ ...pageAdmin.global.INITIO_PAGINATION })
	const [authorsAndCategories, setAuthorsAndCategories] = useState({ authors: [], categories: [] })
  const [divSearch, setDivSearch] = useState({ ...pageAdmin.global.INITIO_DIVSEARCH })
  const [filtersTerms, setFiltersTerms] = useState({ ...pageAdmin.articleComponent.INITIO_FILTERSTERMS })
  const [filter, setFilter] = useState(['Todos', ''])
	const [mode, setMode] = useState({ ...pageAdmin.global.INITIO_MODE })
	const [article, setArticle] = useState({ ...pageAdmin.articleComponent.INITIO_ARTICLE })
	const [inTable, setInTable] = useState({ ...pageAdmin.articleComponent.INITIO_INTABLE, ...pageAdmin.global.INITIO_INTABLE })

  const doRequest = (p) => {

    setInTable({ ...inTable, requesting: true })
   	api
      .get(`/articles?page=${p || 1}`, { headers: { Authorization: `bearer ${ token }` } })
      .then(({ data }) => {
      		const newInTable = { ...inTable }
          newInTable.articles = data.data.reverse()
          setPageSettings({ count: data.count || 1, limit: data.limit })
          newInTable.ready = true
          newInTable.failed = false
          setInTable({ ...newInTable, requesting: false })

        	if (!authorsAndCategories.authors.length) {
        		api.get('/categories', { headers: { Authorization: `bearer ${ token }` } })
				     	.then(({ data: c }) => {
				     		api.get('/users', { headers: { Authorization: `bearer ${ token }` } })
						     	.then(({ data: u }) => {
						     		setInTable({ ...newInTable, requesting: false })
						     		setArticle({ ...article, userId: u[0] ? u[0].id : null , categoryId: c[0] ? c[0].id : null })
						     		setAuthorsAndCategories({ categories: c, authors: u })
						     	})
						     	.catch(requestFailed)
				     	})
				     	.catch(requestFailed)
			     }
        })
      .catch(requestFailed)
  }

  io.on('connect', () => {
    inTable.failed && doRequest(pageActual)
  })

  io.on('disconnect', () => {
    setInTable({ ...inTable, failed: true })
  })

	useEffect(() => {
		addToast('Atenção: \n As vezes, nesta aba, você precisará clicar duas vezes nos botões de editar e excluir.', { ...toasts, appearance: 'info' })
	  doRequest()
	}, [token])

	useEffect(() => {
		if (mode.label === 'Salvar') {
			try { setArticle({ ...pageAdmin.article.INITIO_ARTICLE, userId: authorsAndCategories.authors[0].id, categoryId: authorsAndCategories.categories[0].id }) }
			catch(e) {}
		}
	}, [mode])


	const requestFailed = () => {
		const newInTable = { ...pageAdmin.articleComponent.INITIO_INTABLE }
    newInTable.ready = true
    newInTable.failed = true
    setInTable({ ...newInTable, requesting: false })
	}

  const search = (functionname, key) => {
    let result

    if (functionname === 'searchByName') {
      result = searchByName('articles', filtersTerms, filter, inTable, key)      
    } else {
      result = doSearch[functionname](filtersTerms, filter, inTable, key)
    }

    const  { inTable: newInTable, filter: newFilter, filtersTerms: newFiltersTerms } = result

    setInTable({ ...newInTable, ready: newInTable.ready ? true : false})
    setFiltersTerms(newFiltersTerms)
    setFilter(newFilter)

    if (newInTable.mode === 'articles') noFilter()
  }

  const noFilter = () => {
    setInTable({ ...inTable, mode: 'articles' })
    setFiltersTerms({ ...pageAdmin.articleComponent.INITIO_FILTERSTERMS })
    setFilter(['Todos', ''])
  }

  const openOrCloseDivSearch = which => {
    const opened = divSearch.which === which ? false : true

    if (opened) {
      setFiltersTerms({ ...pageAdmin.articleComponent.INITIO_FILTERSTERMS })
      window.onkeyup = ({ keyCode }) => {
        if (keyCode === 27) {
          setInTable({ ...inTable, mode: 'articles' })
          setFilter(['Todos', ''])
          setDivSearch({ ...pageAdmin.articleComponent.INITIO_DIVSEARCH })
        }
      }
    } else {
      setInTable({ ...inTable, mode: 'articles' })
      setFilter(['Todos', ''])
      window.onkeyup = () => {}
    }

    setDivSearch({ opened, which: opened ? which : '' })

    functions.setFocus(`input-search-${which}`)
  }

  const submit = e => {
    e.preventDefault()

    try {
      functions.verify('article-form', mode.label, article)

      setMode({ ...mode, exec: true })

      const data = { 
        name: article.name,
        description: article.description,
        categoryId: article.categoryId,
        imageUrl: article.imageUrl,
        userId: article.userId,
        content: article.content || '<p></p>'
      }

      switch(mode.label) {
        case 'Excluir':
          api.delete(`/articles/${article.id}`, { headers: { Authorization: `bearer ${ token }` } })
            .then(() => {
              const newArticles = inTable.articles.filter(({ id }) => article.id !== id)

              if (!newArticles.length) {
                doRequest(pageActual - 1)
                setPageSettings({ ...pageSettings, count: pageActual - 1 === 0 ? 1 : 0 })
                setPageActual(pageActual - 1)
              } else setInTable({ ...pageAdmin.articleComponent.INITIO_INTABLE, articles: newArticles, ready: true, failed: false })

              setMode({ ...pageAdmin.global.INITIO_MODE })
              setArticle({ ...pageAdmin.articleComponent.INITIO_ARTICLE, userId: authorsAndCategories.authors[0].id, categoryId: authorsAndCategories.categories[0].id })
              addToast('Excluido com sucesso!', { ...toasts, appearance: 'info' })
            })
            .catch(() => {
              setMode({ ...mode, exec: false })
              addToast('Não foi possível excluir!', { ...toasts, appearance: 'error' })
            })
          
          break
        case 'Editar':
          api 
            .put(`/articles/${article.id}`, data, { headers: { Authorization: `bearer ${ token }` } })
            .then(() => {
            	data.content = { type: 'Buffer', data: Buffer(data.content) }
            	const newArticles = inTable.articles.filter(({ id }) => id !== article.id)
              setInTable({ ...pageAdmin.articleComponent.INITIO_INTABLE, articles: [{ id: article.id, ...data }, ...newArticles], ready: true, failed: false })
              setArticle({ ...pageAdmin.articleComponent.INITIO_ARTICLE, userId: authorsAndCategories.authors[0].id, categoryId: authorsAndCategories.categories[0].id })
              setMode({ ...pageAdmin.global.INITIO_MODE })
              addToast('Artigo editado com sucesso!', { ...toasts, appearance: 'success'})
            })
            .catch(() => {
              setMode({ ...mode, exec: false })
              addToast('Artigo não foi editado!', { ...toasts, appearance: 'error'})
            })
          break
         default:
          api
            .post('/articles', data, { headers: { Authorization: `bearer ${ token }` } })
            .then(() => {
            	data.content = { type: 'Buffer', data: Buffer(data.content) }
            	if (inTable.articles.length < pageSettings.limit) {             
                if (inTable.articles.length > 0) setInTable({ ...inTable, articles: [ ...inTable.articles, { id: inTable.articles[inTable.articles.length - 1].id + 1, ...data}] })
                else setInTable({ ...inTable, articles: [ ...inTable.articles, { id: false, ...data } ] })
              } else {
                setPageSettings({ ...pageSettings, count: pageSettings.count + 1 })
              }
              setMode({ ...pageAdmin.global.INITIO_MODE })
              setArticle({ ...pageAdmin.articleComponent.INITIO_ARTICLE, userId: authorsAndCategories.authors[0].id, categoryId: authorsAndCategories.categories[0].id })
              addToast('Artigo salvado com sucesso!', { ...toasts, appearance: 'success'})
            })
            .catch(() => {
              setMode({ ...mode, exec: false })
              addToast('Artigo não salvado!', { ...toasts, appearance: 'error'})
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
              <Label htmlFor='inputName-Article'>Nome</Label>
              <Input readOnly={ mode.label === 'Excluir' } disabled={ inTable.requesting } id='inputName-Article' placeholder='Nome do artigo' value={article.name} minLength='3' maxLength='14' onChange={({ target }) => setArticle({ ...article, name: target.value })} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md='12'>
            <FormGroup>
              <Label htmlFor='inputDesc-Article'>Descrição</Label>
              <Input readOnly={ mode.label === 'Excluir' } disabled={ inTable.requesting } id='inputDesc-Article' placeholder='Descrição do artigo' maxLength='200' value={article.description} onChange={({ target }) => setArticle({ ...article, description: target.value })} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md='12'>
            <FormGroup>
              <Label htmlFor='inputImageUrl-Article'>URL da imagem</Label>
              <Input readOnly={ mode.label === 'Excluir' } disabled={ inTable.requesting } id='inputImageUrl-Article' placeholder='Url da imagem' value={ article.imageUrl || ''} onChange={({ target }) => setArticle({ ...article, imageUrl: target.value })} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md='12'>
            <FormGroup>
              <Label htmlFor='inputCategory-Article'>{ mode.label === 'Salvar' ? 'Categorias' : 'Categoria' }</Label>
              { mode.label === 'Salvar' ? <Input type='select' name='select' id='inputCategory-Article' onChange={({ target }) => setArticle({ ...article, categoryId: +target.value })}>
		            <optgroup label='Categorias'>
		            	{ authorsAndCategories.categories.length ? authorsAndCategories.categories.map(({ id, name, path }) => {
		            		return <option key={`article_${name}-${id}`} value={id}>{ path }</option>
		            	}) : <option value='0'>Nenhuma categoria</option> }
		            </optgroup>
		          </Input> : <Input readOnly={true} id='inputCategory-Article' value={ { ...authorsAndCategories.categories.find(a => a.id === article.categoryId)}.name } /> }
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md='12'>
            <FormGroup>
              <Label htmlFor='inputAuthor-Article'>{ mode.label === 'Salvar' ? 'Autores' : 'Autor' }</Label>
              { mode.label === 'Salvar' ? <Input type='select' name='select' id='inputAuthor-Article' onChange={({ target }) => setArticle({ ...article, userId: +target.value })}>
		            <optgroup label='Autores'>
		            	{ authorsAndCategories.authors.length ? authorsAndCategories.authors.map(({ id, name, email, admin }) => {
		            		return <option key={`article_${name}-${id}`} value={id}>{ name } - { admin ? 'Administrador' : 'Comum' }</option>
		            	}) : <option value='0'>Nenhum autor possível</option> }
		            </optgroup>
		          </Input> : <Input readOnly={true} id='inputAuthor-Article' value={ { ...authorsAndCategories.authors.find(a => a.id === article.userId)}.name } /> }
            </FormGroup>
          </Col>
        </Row>
        <Row>
        	<Col>
        		<Editor 
              value={ article.content }
              onChange={ text => setArticle({ ...article, content: text }) }
              readOnly={ mode.label === 'Excluir' } />
        	</Col>
        </Row>
        <Row>
          <Col className='pt-2'>
            <Button type='submit' color={mode.color} size='md' disabled={ mode.exec }>{ mode.label }</Button>
            <Button type='button' color='secondary' className='ml-2' size='md' disabled={ mode.exec } onClick={() => {
              setArticle({ ...pageAdmin.articleComponent.INITIO_ARTICLE })
              setMode({ ...pageAdmin.global.INITIO_MODE })
            }}>Limpar</Button>
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
            <TheadStyle active={ divSearch.opened && divSearch.which === 'name-article' } term={ filter[0] === 'Nome' } className='dropup'>Nome 
              <SearchStyle visible={ divSearch.opened && divSearch.which === 'name-article' }> <DropUp placeholder='Filtrar pelo nome' id='input-search-name-article' search={ key => search('searchByName', key) } value={ filtersTerms.name } /> </SearchStyle>
              <span className='icon-filter' onClick={ () => openOrCloseDivSearch('name-article') } title='Filtrar pelo nome'><i className='fa fa-filter'></i></span>
            </TheadStyle>
            <TheadStyle>Descrição</TheadStyle>
            <TheadStyle active={ divSearch.opened && divSearch.which === 'category-article' } term={ filter[0] === 'Categoria' } className='dropup'> Categoria
              <SearchStyle visible={ divSearch.opened && divSearch.which === 'category-article' }> <DropUp placeholder='Filtrar pela categoria' id='input-search-category-article' search={ key => search('seachByCategory', key) } value={ filtersTerms.category } /> </SearchStyle>
              <span className='icon-filter' onClick={ () => openOrCloseDivSearch('category-article') } title='Filtrar pela categoria'><i className='fa fa-filter'></i></span>
            </TheadStyle>
            <TheadStyle active={ divSearch.opened && divSearch.which === 'author-article' } term={ filter[0] === 'Autor' } className='dropup'> Autor
              <SearchStyle visible={ divSearch.opened && divSearch.which === 'author-article' }> <DropUp placeholder='Filtrar pelo autor' id='input-search-author-article' search={ key => search('seachByAuthor', key) } value={ filtersTerms.author } /> </SearchStyle>
              <span className='icon-filter' onClick={ () => openOrCloseDivSearch('author-article') } title='Filtrar pelo autor'><i className='fa fa-filter'></i></span>
            </TheadStyle>
            <TheadStyle style={{ width: '152px' }}>Ações</TheadStyle>
          </tr>
        </thead>
        <tbody>
        	{ inTable.ready ? inTable[inTable.mode].length ? inTable[inTable.mode].map((articleInMap, index) => 
          		<TrStyle scope='row' key={ `article_${articleInMap.name}-${articleInMap.id}` }>
                <td> { articleInMap.name } </td>
                <td> { articleInMap.description.length > 20 ? articleInMap.description.slice(0, 19) + '...' : articleInMap.description } </td>
                <td> { { ...authorsAndCategories.categories.find(a => a.id === articleInMap.categoryId)}.name } </td>
                <td> { { ...authorsAndCategories.authors.find(c => c.id === articleInMap.userId) }.name } </td>
                <td> 
                  <Button onClick={() => {
                    const original = { 
                      originalName: articleInMap.name, originalDescription: articleInMap.description, 
                      originalImageUrl: articleInMap.imageUrl, originalContent: articleInMap.content,
                      originalContent: conv(articleInMap.content.data, { out: 'utf8' })
                    } 
                    setArticle({ ...articleInMap, imageUrl: articleInMap.imageUrl ? articleInMap.imageUrl : '', content: conv(articleInMap.content.data, { out: 'utf8' }), ...original })
                    setDivSearch({ ...pageAdmin.global.INITIO_DIVSEARCH })
                    setMode({ label: 'Editar', color: 'warning' })
                  }} title={articleInMap.id ? 'Clique duas vezes' : 'Recarregue a página!'} color={ mode.label === 'Editar' ? article.id === articleInMap.id ? 'secondary': 'warning' : 'warning' } disabled={ articleInMap.id ? mode.label === 'Editar' ? article.id === articleInMap.id : false : true } size='sm'>Editar</Button>{' '}
                  <Button className='ml-2' onClick={() => {
                    setArticle({ 
                      ...articleInMap, 
                      imageUrl: articleInMap.imageUrl ? articleInMap.imageUrl : '', 
                      content: conv(articleInMap.content.data, { out: 'utf8' }) })
                    setDivSearch({ ...pageAdmin.global.INITIO_DIVSEARCH })
                    setMode({ label: 'Excluir', color: 'danger' })
                  }} title={articleInMap.id ? 'Clique duas vezes' : 'Recarregue a página!'} color={ mode.label === 'Excluir' ? article.id === articleInMap.id ? 'secondary' : 'danger' : 'danger' } disabled={ articleInMap.id ? mode.label === 'Excluir' ? article.id === articleInMap.id : false : true } size='sm'>Excluir</Button>
                </td>
              </TrStyle>
        	) : <tr><td colSpan='5' style={{ textAlign: 'center' }}>{ inTable.failed ? 'Reconectando ...' : 'Nenhum :/' }</td></tr> :
          <tr><td colSpan='5' style={{ textAlign: 'center' }}>Carregando...</td></tr> }
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

export default Article
