import React from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'

import { useParams, useHistory } from 'react-router-dom'
import { CloseIcon } from 'assets/icons'
import {
	PageTitle,
	PageSubTitle,
	FlexContainer,
	Image,
	Close
} from 'components/styled'

export default function Detail() {
	const history = useHistory()

	const { id } = useParams<{ id: string }>()

	if (!id) history.goBack()

	const { photo, location, title, tags, notes } = useSelector(
		(state: RootState) => state.touch[id]
	)

	const tagsList = tags.map(tag => <Tag>{tag}</Tag>)
	return (
		<FlexContainer>
			<Close onClick={history.goBack} src={CloseIcon} />
			<PageTitle>{title}</PageTitle>
			<PageSubTitle>{location}</PageSubTitle>
			{photo && <Photo src={photo} />}
			<TagsContainer>{tagsList}</TagsContainer>
			<NotesContainer>{notes}</NotesContainer>
		</FlexContainer>
	)
}

const TagsContainer = styled.div`
	width: 50%;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
`

const Tag = styled.div`
	border: 2px solid black;
	border-radius: 5px;
	padding: 2px;
	margin-top: 10px;
`

const Photo = styled(Image)`
	height: 40%;
	width: auto;
`

const NotesContainer = styled.div`
	width: 80%;
	height: auto;
	text-align: left;
	margin-top: 2%;
`
