import styled from 'styled-components'

export const DropDown = styled.div`
	position: relative;
	height: 100%;
	margin: 0 10px;
	min-width: 190px;

	display: flex;
	flex-direction: column;
	align-items: center;

	:hover {
		background: rgba(0, 0, 0, .2);
	}

	:hover > div:nth-child(2) {
		visibility: visible;
		opacity: 1;	
	}
`

export const DropDownVisible = styled.div`
	width: 100%;
	height: 100%;

	display: flex;
	justify-content: space-around;
	align-items: center;

	> img {
		border-radius: 5px;
	}
`

export const DropDownHidden = styled.div`
	width: 100%;
	background: white;
	position: absolute;
	top: 100%;
	visibility: hidden;
	opacity: 1;
	padding: 5px;
	box-shadow: 0px 5px 5px 5px gray;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;

	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;

	transition: opacity .2s ease-in;
	z-index: 1;

	span {
		background: none;
		text-align: center;
		position: relative;
		width: 98%;
		margin: 7px 0px;
		padding: 2px 0;
		cursor: pointer;
	}

	span:hover > label {
		width: center;
		opacity: .5;
		color: red;
	}

	span:not(:last-child) {
		border-top: 1px solid transparent;
	}

	span:last-child {
		border-top: 1px solid rgba(150, 150, 150, .8);
	}

	span > label:hover {
		cursor: pointer
	}

	span:hover > label {

	}

	span > i {
		position: absolute;
		left: -5px;
		top: 7px;
		opacity: 0;

		transition: all .2s ease-in;
	}

	span:hover > i {
		left: 5px;
		opacity: 1
	}
`
