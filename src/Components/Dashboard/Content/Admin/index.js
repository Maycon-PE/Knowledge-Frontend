import React, { useState } from 'react'
import { connect } from 'react-redux'
import { 
	TabContent, Nav,
	Card
} from 'reactstrap'

import Tab from './Tab/'
import Category from './tabsContent/Category/'
import User from './tabsContent/User/'
import Article from './tabsContent/Article/'

const Admin = ({ token }) => {
	const [tab, setTab] = useState('3')

	return (
		  <Card style={{ maxWidth: '1250px', margin: 'auto' }}>
        <Nav tabs>
          <Tab label='Categorias' tab={ tab } setTab={ setTab } index='1' />
          <Tab label='Artigos' tab={ tab } setTab={ setTab } index='2' />
          <Tab label='Usuários' tab={ tab } setTab={ setTab } index='3' />
        </Nav>
        <TabContent activeTab={tab}>
            { +tab === 1 && <Category token={ token } /> }
            { +tab === 2 && <Article token={ token } /> }
            { +tab === 3 && <User token={ token } /> }
        </TabContent>
      </Card>
	)
}

const mapStateToProps = state => {
  const reduxProps = {  }

  try {
    reduxProps.token = state.pageDashboard.user.token
  } catch(e) {  }

  return reduxProps
}

export default connect(mapStateToProps)(Admin)
