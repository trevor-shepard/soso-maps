import styled from '@emotion/styled'

export const ModalTitle = styled.div`
	font-family: Poppins;
	font-style: normal;
	font-weight: 800;
	font-size: 22px;
	margin-top: 5%;
	padding: 5px;
`

export const SubmitButton = styled.button`
	font-family: Poppins;
	border-radius: 2px;
	border: 1px solid black;
	min-width: 200px;
	max-width: 400px;
	padding: 10px;
	background-color: #ffffff;
	margin-bottom: 3%;
`

export const ModalSubTitle = styled.div`
	font-family: Poppins;
	font-style: normal;
	font-weight: 200;
	font-size: 14px;
`

export const Error = styled.div`
	font-family: Poppins;
	font-style: normal;
	font-weight: 200;
	font-size: 14px;
	color: #cc0000;
`

export const PageTitleContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	text-align: left;
	width: 90%;
`

export const PageTitle = styled.div`
	font-family: Poppins;
	font-style: normal;
	font-weight: 800;
	font-size: 22px;
	margin-top: 10%;
	margin-bottom: 10px;
`

export const PageSubTitle = styled.div`
	font-family: Poppins;
	font-style: normal;
	font-weight: 200;
	font-size: 14px;
	margin-bottom: 3%;
`

export const FlexContainer = styled.div`
	height: calc(${() => window.innerHeight}px - 60px);
	width: auto;
	display: flex;
	align-items: center;
	flex-direction: column;
	position: relative;
	overflow: scroll;
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
	height: ${({ height }) => height};
	width: auto;
`

export const Marker = styled.div<{
	lat?: string | number
	lng?: string | number
}>`
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

export const MarkerTitle = styled.div`
	position: absolute;
	width: 50px;
	height: auto;
	left: -25px;
	line-height: 1.2;
	display: flex;
	flex-direction: column;
	justify-content: center;
`
export const MarkerTitleHeader = styled.div`
	font-weight: bold;
`
export const MarkerTitleSubHeader = styled.div``

export const Close = styled.img`
	position: absolute;
	right: 4%;
	top: 3%;
	height: 20px;
	width: 20px;
	cursor: pointer;
`

export const TagsContainer = styled.div`
	display: flex;
	flex-direction: row;
	overflow-x: scroll;
	width: 90%;
	padding: 2%;
	margin-bottom: 10px;
	overflow-y: hidden;
	height: 70px;
`

export const Tag = styled.div<{ selected: boolean }>`
	border: ${({ selected }) =>
		selected ? '4px solid#6eb8da' : '2px solid #666666 '};
	border-radius: 5px;
	padding: 4px;
	margin-top: 10px;
	margin-left: 5px;
	margin-right: 5px;
	color: ${({ selected }) => (selected ? '#000000' : '#666666')};
	font-weight: ${({ selected }) => (selected ? 'bold' : '400')};
	height: 25px;
`

export const CMemberListItem = styled.div`
	display: flex;
	flex-direction: row;
	padding: 3px;
`
export const DetailsContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: left;
	margin-left: 2%;
	width: 100;
`
export const CmemberName = styled.div`
	font-family: Poppins;
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	text-align: left;
`
export const CmemberLocation = styled.div`
	font-family: Poppins;
	font-style: normal;
	font-weight: 200;
	font-size: 14px;
	text-align: left;
`
export const ProfileImg = styled.img`
	height: 40px;
	width: 40px;
	border-radius: 50%;
`
export const ListSwitch = styled.div`
font-family: Poppins;
position: fixed;
right: 10px;
top: 10px
`