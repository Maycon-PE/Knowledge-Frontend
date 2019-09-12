import styled from 'styled-components'

export const Area = styled.div`
	flex: 1;

	min-width: 250px;
	border-radius: 8px;
	margin: 10px;
	background-color: #FFF;
	padding: 20px;
	border: 1px solid rgba(0, 0, 0, .2);
	box-shadow: 0 1px 5px rgba(0, 0, 0, .15);

	display: flex;
`

export const Icon = styled.div`

	display: flex;
	align-items: center;

	> i {
		color: ${({ iconColor }) => iconColor};
		font-size: 5em;
	}
`

export const Info = styled.div`
	flex: 1;

	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: space-between;

	:hover {
		cursor: default;
	}
`

export const Value = styled.span`
	${({ type }) => type === 'string' ? `
		font-size: 14px;
		color: red;
		opacity: .7;
	` :  `
		font-size: 30px;
	` }
`

export const Title = styled.span`
	opacity: .5;
`
