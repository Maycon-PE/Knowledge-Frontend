import { changeFilter, changeInTable } from'../search'

export const searchByEmail = (filtersTerms, filter, inTable, key) => {
  const newFiltersTerms = changeFilter(filtersTerms, 'email', key)

  newFiltersTerms.admin = 0

  const { inTable: newInTable, filter: newFilter } = changeInTable(inTable, filter, 'users', 'Email', key)

  newInTable.filtered = inTable.users.filter(({ email }) => email.toLowerCase().includes(key.toLowerCase()))

  return { inTable: newInTable, filtersTerms: newFiltersTerms, filter: newFilter }
}

export const searchByAdmin = (filtersTerms, filter, inTable, key) => {
  const newInTable = { ...inTable }
  const newFiltersTerms = { ...filtersTerms }
  const newFilter = [ ...filter ]

  if (newFiltersTerms.name.length) newFiltersTerms.name = ''
  if (newFiltersTerms.email.length) newFiltersTerms.email = ''

  if (newFilter[0] !== 'Admin' && key !== +0)
    newFilter[0] = 'Admin'

  if (key === +0) {
    newFilter[0] = 'Todos'
    newFilter[1] = ''
  }
  if (key === +1) newFilter[1] = 'Não'
  if (key === +2) newFilter[1] = 'Sim'

  newFiltersTerms.admin = key

  if (newInTable.mode === 'users') newInTable.mode = 'filtered'

  if (key !== +0) newInTable.filtered = newInTable.users.filter(({ admin }) => admin === key - 1)
  else newInTable.mode = 'users'

  return { inTable: newInTable, filter: newFilter, filtersTerms: newFiltersTerms }
}
