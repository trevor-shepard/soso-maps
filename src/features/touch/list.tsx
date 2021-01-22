import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { useHistory } from 'react-router-dom'
import { CloseIcon } from 'assets/icons'
import TextInput from 'components/inputs/text'
import {
	PageTitle,
	FlexContainer,
	Close,
	TagsContainer,
	Tag
} from 'components/styled'
import { TagType, TAGS } from 'types'

export default function TouchList() {
	const history = useHistory()
	const [search, setSearch] = useState('')
	const [selectedTag, setSelectedTag] = useState<TagType>('misc')
	const touches = useSelector((state: RootState) => state.touch)

	const touchList = Object.values(touches)
		.filter(({ title, notes, location, tag }) => {
			if (tag !== selectedTag) return false
			if (search === '') return true
			return (
				title.includes(search) ||
				notes.includes(search) ||
				location.includes(search)
			)
		})
		.map(({ title, date, tag, id }) => (
			<ListItem
				key={`touch-${id}`}
				onClick={() => history.push(`/touch-detail/${id}`)}
			>
				{title} -{' '}
				{new Date(date).toLocaleString('en-US', {
					day: 'numeric',
					month: 'numeric',
					year: 'numeric'
				})}{' '}
				- {tag}
			</ListItem>
		))

	const tags = TAGS.map(tag => (
		<Tag
			key={`tag-${tag}`}
			onClick={() => {
				setSelectedTag(tag)
			}}
			selected={selectedTag === tag}
		>
			{tag}
		</Tag>
	))

	return (
		<FlexContainer>
			<Close onClick={history.goBack} src={CloseIcon} />
			<PageTitle>Touches</PageTitle>
			<TagsContainer>{tags}</TagsContainer>
			<TextInput
				value={search}
				handleInput={e => setSearch(e.target.value)}
				label="search"
				width="80%"
			/>
			<List>{touchList} </List>
		</FlexContainer>
	)
}

const List = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 80%;
`

const ListItem = styled.div`
	border: 1px solid black;
	border-radius: 2px;
	margin-top: 10px;
	padding: 4px;
	cursor: pointer;
	&:hover {
		color: #6eb8da;
	}
`
