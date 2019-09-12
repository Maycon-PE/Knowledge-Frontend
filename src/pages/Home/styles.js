import styled from 'styled-components'

export const Area = styled.div`
	height: 100vh;

	display: grid;
	grid-template-rows: 60px 1fr;
	grid-template-columns: 1fr;
	grid-template-areas:
		'header'
		'content'
	;
`

export const Content = styled.div`
	grid-area: content;
	background: rgba(200, 200, 200, .5);
	
	display: flex;
	justify-content: center;
	align-items: center;
`

export const AreaLimit = styled.form`
	width: 100%;
	max-width: 400px;
	padding: 10px;
	border-radius: 10px;
	position: relative;
	background #FFF;

	> img {
		width: 100%;
	}

	> span {
		opacity: .8;
		text-align: center;

		:hover {
			color: blue;
			text-decoration: underline;
			opacity: 1;
			cursor: pointer;
		}
	}
`

export const Base = styled.div`
	display: flex;
	justify-content: flex-end;

	> button {
		margin: 0 5px;
	}
`
