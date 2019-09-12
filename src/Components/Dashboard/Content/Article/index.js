import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import hljs from 'highlightjs/highlight.pack.js'
import 'highlightjs/styles/atom-one-dark.css'
import ReactQuill from 'react-quill'
import { useToasts } from 'react-toast-notifications'
import {
	Button
} from 'reactstrap'

import 'react-quill/dist/quill.snow.css'

import * as actions from '../../../../store/reducers/dashboard/actions'

import api from '../../../../api'
import io from '../../../../socket'

import {
	Area as AreaStyle,
	Ul as UlStyle,
	Img as ImgStyle,
	Info as InfoStyle,
	Load as LoadStyle,
	Content as ContentStyle
} from './styles'


const Articles = ({ categorySelected, token, dispatch }) => {
	const [articles, setArticles] = useState([])
	const [page, setPage] = useState(2)
	const [loadMore, setLoadMore] = useState(true)
	const [content, setContent] = useState(null)
	const [requestSituation, setRequestSituation] = useState({ failed: false })

	const addToast = useToasts()

	const getArticle = id => {
		api
			.get(`/articles/${id}`, { headers: { Authorization: `bearer ${token}` } })
			.then(({ data }) => {
				setContent(`<h1>${data.name}</h1> <h2>${data.description}</h2>` + data.content)
				window.onkeydown = ({ keyCode }) => {
					keyCode === 27 && setContent(null)
					window.onkeydown = () => {}
				}
				setRequestSituation({ failed: false })
			}).catch(e => {
				setRequestSituation({ failed: true })
			})
	}

	const loadMoreRequest = () => {
		api
			.get(`categories/${categorySelected}/articles?page=${page}`, { headers: { Authorization: `bearer ${token}` } })
			.then(({ data }) => {
				setArticles(articles.concat(data))

				setPage(page + 1)
				!data.length && setLoadMore(false)
			}).catch(e => {
				setRequestSituation({ failed: true })
			})
	}

	const doRequest = () => {
		api.get(`/categories/${categorySelected}`, { headers: { Authorization: `bearer ${token}` } })
				.then(({ data }) => {
					dispatch(actions.setTitle(data.name))
					api.get(`categories/${categorySelected}/articles?page=1`, { headers: { Authorization: `bearer ${token}` } })
						.then(({ data }) => {
							setArticles(data)
							!loadMore && setLoadMore(true)
							setRequestSituation({ failed: false })
						}).catch(e => {
							setRequestSituation({ failed: true })
						})
				}).catch(e => {
					setRequestSituation({ failed: true })
				})
	}

	io.on('connect', () => {
		!requestSituation.failed && categorySelected && doRequest()
	})

	useEffect(() => {
		categorySelected && doRequest()
	}, [categorySelected, token])

	useEffect(() => {
		content && !requestSituation.failed && Array.from(document.getElementsByClassName('ql-syntax')).forEach(pre => {
			hljs.configure({ languages: ['javascript', 'babel'] })
			hljs.highlightBlock(pre)
		})
	}, [content, requestSituation])


	return categorySelected ? (
		<AreaStyle>
			<UlStyle>
				{ !requestSituation.failed ? articles.length ? articles.map((atg, index) => {
					return (<li key={atg.name} onClick={() => getArticle(atg.id)}>
							<ImgStyle className='d-none d-sm-block'>
								<img src={ atg.imageUrl.length ? atg.imageUrl : './images/article.png' } alt='Logo do artigo' />
							</ImgStyle>
							<InfoStyle>
								<h2>{ atg.name }</h2>
								<p>{ atg.description.length > 100 ? atg.description.slice(0, 100) + ' ...' : atg.description }</p>
								<span>
									<strong>Autor: </strong>{ atg.author }
								</span>
							</InfoStyle>
						</li>)
				}) : <li>Nenhum</li> : <li>Ocorreu um erro na requisição</li> }
			</UlStyle>
			<LoadStyle>
				{ loadMore && <Button color='secondary' outline onClick={loadMoreRequest}>Carregar mais</Button> }
			</LoadStyle>
			{ content && <ContentStyle>
					<div>
						<ReactQuill 
							value={ content }
					    modules={{ toolbar: { container: [] } }} 
					    readOnly={ true }
					    />
				  </div>
					<Button color='danger' onClick={() => {
						window.onkeydown = () => {}
						setContent(false)
					}} >sair</Button>
				</ContentStyle> }
		</AreaStyle>
	) : <h1 style={{ textAlign: 'center' }}>Nenhuma categoria selecionada!</h1>
}

const mapStateToProps = state => {
	const reduxProps = { categorySelected: state.pageDashboard.categorySelected }

	try {
		reduxProps.token = state.pageDashboard.user.token
	} catch(e) {  }

	return reduxProps
}

export default connect(mapStateToProps)(Articles)
