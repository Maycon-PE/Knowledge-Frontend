import styled from 'styled-components'

export const Area = styled.div`

`

export const Ul = styled.ul`
	list-style: none;
	padding: 0;

	> li {
		position: relative;
		display: flex;
		margin: 10px 0;
		padding: 5px;
		border-radius: 5px;
		background: rgba(255, 255, 255, .9);

		transmission: all .2s linear;
	}

	> li:hover {
		cursor: pointer;
		background: rgba(150, 150, 150, .9);	
		color: white;
	}
`

export const Img = styled.div`
	> img {
		margin: 5px;
		width: 200px;
		height: 150px;
		border-radius: 5px;
	}
`

export const Info = styled.div`
	height: 150px;
	border-left: 1px solid rgba( 200, 200, 200,.8);;
	padding-left: 5px;
	margin: 5px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`

export const Load = styled.div`
	display: flex;
	justify-content: center;
`

export const Content = styled.div`
	z-index: 5;
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: rgba(0, 0, 0, .2);

	display: flex;
	justify-content: center;
	align-items: center;

	> div {
		background: white;
		width: 100%;
		height: 95vh;
		max-width: 1200px;
		overflow: hidden;
		overflow-y: scroll;

		.ql-toolbar {
			display: none;
		}

		.ql-editor h1:first-child {
			background: white;
			text-align: center;
			font-size: 50px;
			border-bottom: 1px solid rgba( 200, 200, 200,.8);
			padding-bottom: 5px;
			margin-bottom: 5px;
			cursor: default;
			pointer-events: none;
			user-select: none;
		}

		.ql-editor h2:first-child {
			text-indent: 50px;
			opacity: .8;
			padding: 5px 0;
			margin-bottom: 5px;
			border-bottom: 1px solid rgba( 200, 200, 200,.8);
		}
	}

	> button {
		z-index: 6;
		position: fixed;
		top: 20px;
		right: 20px;
	}
`
