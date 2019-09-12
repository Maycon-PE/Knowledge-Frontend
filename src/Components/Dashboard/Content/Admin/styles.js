import styled from 'styled-components'

export const Tr = styled.tr`
	transition: background .2s ease-in;

	:hover {
		background: rgba(0, 0, 0, .2) !important;
		cursor: default;
	}
`

export const Thead = styled.th`
	position: relative;

	> span {
		position: absolute;
		left: -3px;
		bottom: 17px;
		height: 23px;
		border-bottom: 1px solid gray;

		overflow: hidden;

		:hover { cursor: pointer; }

		${({ term, active }) => `
				> i {
					position: relative;
					transform: ${ active || term ? 'translate(0, 0)' : 'translate(0, 8px)'};
					transition: all .2s ease-in;
					color: ${ term ? 'green !important' : active ? 'blue' : 'black' };
				}

				:hover > i {
					transform: translate(0, 0);
					color: blue;	
				}
		`}	
}
`

export const Search = styled.div`
	position: absolute;
	min-width: 200px;
	width: 100%;
	left: 0px;
	top: -60px;
	visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
	background: white;
	padding: 5px;
	border-radius: 5px;
	box-shadow: 0 0 28px 5px rgba(0, 0, 0, .2);
	text-align: center;

	z-index: 1;
`

export const TheadTitle = styled.th`
	position: relative;
	text-align: center;
	padding-bottom: 10px;
`

export const Filter = styled.label`
	position: absolute;
	left: 2px;
	font-size: 13px;
	opacity: .6;
	bottom: -10px;

	> i {
		opacity: ${({ on }) => on ? '1' : '0'};
		color: ${({ on }) => on ? 'green' : 'red'};
		margin: 0 5px;
		
		transition: opacity .2s ease-in;
	}

	> i:hover {
		color: ${({ on }) => !on ? 'green' : 'red'};
		cursor: ${({ on }) => on ? 'pointer' : 'default'};
		box-shadow: 0 1px 20px 1px ${({ on }) => !on ? 'green' : 'red'};
	}
`

export const PaginationArea = styled.div`
	opacity: ${({ filtering }) => filtering ? '.6' : '1'};
	pointer-events: ${({ filtering }) => filtering ? 'none' : 'painted'};
	transition: opacity .2s ease-in ;

	display: flex !important;
	justify-items: center !important;
	align-items: center !important;
`
