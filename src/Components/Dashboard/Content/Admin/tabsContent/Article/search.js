import { changeFilter, changeInTable } from'../search'

export const seachByCategory = (filtersTerms, filter, inTable, key) => {
	const newFiltersTerms = changeFilter(filtersTerms, 'category', key)

  // newFiltersTerms.admin = 0

  const { inTable: newInTable, filter: newFilter } = changeInTable(inTable, filter, 'articles', 'Categoria', key)

  newInTable.filtered = inTable.articles.filter(({ category }) => category.toLowerCase().includes(key.toLowerCase()))

  return { inTable: newInTable, filtersTerms: newFiltersTerms, filter: newFilter }
}

export const seachByAuthor = (filtersTerms, filter, inTable, key) => {
	const newFiltersTerms = changeFilter(filtersTerms, 'author', key)

  // newFiltersTerms.admin = 0

  const { inTable: newInTable, filter: newFilter } = changeInTable(inTable, filter, 'articles', 'Autor', key)

  newInTable.filtered = inTable.articles.filter(({ author }) => author.toLowerCase().includes(key.toLowerCase()))

  return { inTable: newInTable, filtersTerms: newFiltersTerms, filter: newFilter }
}
