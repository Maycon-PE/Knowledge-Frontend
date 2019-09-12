import styled from 'styled-components'

export const Area = styled.header`
	grid-area: header;
	background: linear-gradient(to right, #1E469A, #49A7C1);

	display: flex;
	justify-content: center;
	align-items: center;
`

export const toggleMenu = styled.span`
	margin-left: 10px;
	font-size: 30px;

	:hover {
		cursor: pointer;
	}

	i {
		transform: translate(0, 0) rotate(${({ opened }) => opened ? 0 : -180 }deg);
		transition: all .3s ease-in;
	}
	
`

export const Title = styled.h1`
	font-size: 23px;
	color: white;
	font-weight: 100;
	flex-grow: 1;
	text-align: center;

	${({ dashboard }) => dashboard && `> span:hover {
		cursor: pointer;
		opacity: .8;
	}`}
`
