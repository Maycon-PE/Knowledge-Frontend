import styled from 'styled-components'

export const Area = styled.div`
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	height: 100vh;

	display: grid;
	grid-template-rows: 60px 1fr 60px;
	${({ menu }) => menu ? `
		grid-template-columns: 200px 1fr;
		grid-template-areas:
			'header header'
			'menu content'
			'menu footer'
	` : `
		grid-template-columns: 1fr;
		grid-template-areas:
			'header'
			'content'
			'footer'
	`}
	
`
