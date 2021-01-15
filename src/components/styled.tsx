import styled from '@emotion/styled'

export const ModalTitle = styled.div`
	font-family: Amsi Pro Narw;
	font-style: normal;
	font-weight: 800;
	font-size: 22px;
	margin-top: 5%;
	padding: 5px;
`

export const SubmitButton = styled.button`
	font-family: Amsi Pro Narw;
	border-radius: 2px;
	border: 1px solid black;
	min-width: 200px;
	padding: 10px;
	background-color: #ffffff;
`

export const ModalSubTitle = styled.div`
	font-family: Mulish;
	font-style: normal;
	font-weight: 200;
	font-size: 14px;
`

export const Error = styled.div`
	font-family: Mulish;
	font-style: normal;
	font-weight: 200;
	font-size: 14px;
	color: #cc0000;
`

export const PageTitle = styled.div`
	font-family: Amsi Pro Narw;
	font-style: normal;
	font-weight: 800;
	font-size: 22px;
	margin-top: 5%;
	padding: 5px;
`

export const PageSubTitle = styled.div`
	font-family: Mulish;
	font-style: normal;
	font-weight: 200;
	font-size: 14px;
`

export const FlexContainer = styled.div`
	height: 100%;
	width: auto;
	display: flex;
	align-items: center;
	flex-direction: column;
`

export const Image = styled.img`
	height: 100%;
	width: auto;
`

export const FileInput = styled.input`
	display: none;
	font-size: 16 px;
`
export const FileInputLabel = styled.label``

export const ImgContainer = styled.div<{ height: string }>`
	width: 100%;
	overflow: hidden;
	height: ${({ height }) => height};
	width: auto;
`

export const Tag = styled.div`
	font-family: 'Amiri';
	font-weight: bold;
	position: relative;
	cursor: pointer;
`

export const MarkerPhoto = styled.img`
	position: absolute;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	left: -15px;
	top: -45px;
	z-index: 5;
`

export const MapMarkerIcon = styled.img`
	width: 30px;
	position: absolute;
	left: -15px;
	top: -45px;
	color: ${({ color }) => color};
`

export const TagTitle = styled.div`
	position: absolute;
	width: 50px;
	height: auto;
	left: -25px;
	line-height: 1.2;
	display: flex;
	flex-direction: column;
	justify-content: center;
`
export const TagTitleHeader = styled.div`
	font-weight: bold;
`
export const TagTitleSubHeader = styled.div``

export const Close = styled.img`
	position: absolute;
	left: 3%;
	top: 3%;
	height: 20px;
	width: 20px;
	cursor: pointer;
`
