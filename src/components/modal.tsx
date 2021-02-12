import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'

interface Props {
	hideModal: () => void
}

const Modal: FunctionComponent<Props> = ({ children, hideModal }) => {
	return (
		<Container>
			<Content onClick={(e) => e.stopPropagation()}>{children}</Content>
			<GreyArea onClick={hideModal} />
		</Container>
	)
}

const Container = styled.div`
	position: relative;
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`

const GreyArea = styled.div`
	height: 100vh;
	width: 100vw;
	z-index: 50;
	opacity: 0.9;
	background-color: #777375;
	position: fixed;
	left: 0;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;
`

const Content = styled.div`
	position: relative;
	z-index: 55;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	width: 90%;
	min-height: 340px;
	max-height: 80%;
	border: 1px solid #000000;
	box-sizing: border-box;
	border-radius: 10px;
	padding-bottom: 20px;
	background: #ffff;
`

export default Modal
