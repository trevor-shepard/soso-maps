import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { useHistory } from 'react-router-dom'
import TextInput from 'components/inputs/text'
import { PageTitle, FlexContainer, TagsContainer, Tag } from 'components/styled'
import { TagType, TAGS } from 'types'

export default function TouchList() {
	const history = useHistory()
	const [search, setSearch] = useState('')
	const [selectedTag, setSelectedTag] = useState<TagType | null>(null)
	const touches = useSelector((state: RootState) => state.touch)
	const communityMembers = useSelector(
		(state: RootState) => state.communitymember
	)

	return (
		<FlexContainer>
			<PageTitle>Touches</PageTitle>
			<TagsContainer>
				{TAGS.map((tag) => (
					<Tag
						key={`tag-${tag}`}
						onClick={() => {
							setSelectedTag(tag)
						}}
						selected={selectedTag === tag}
					>
						{tag}
					</Tag>
				))}
			</TagsContainer>
			<TextInput
				value={search}
				handleInput={(e) => setSearch(e.target.value)}
				label="search"
				width="80%"
			/>
			<List>
				{Object.values(touches)
					.filter(({ notes, location, tag, cMemeber }) => {
						if (selectedTag && tag !== selectedTag) return false
						if (search === '') return true
						if (
							cMemeber &&
							communityMembers[cMemeber] &&
							communityMembers[cMemeber].name
								.toLocaleLowerCase()
								.includes(search.toLocaleLowerCase())
						)
							return true
						return (
							notes.toLowerCase().includes(search.toLocaleLowerCase()) ||
							location.toLowerCase().includes(search.toLowerCase())
						)
					})
					.map(({ date, tag, id, cMemeber }) => {
						return (
							<ListItem
								key={`touch-${id}`}
								onClick={() => history.push(`/touch-detail/${id}`)}
							>
								{cMemeber &&
									communityMembers[cMemeber] &&
									communityMembers[cMemeber] &&
									`${communityMembers[cMemeber].name} - `}
								{tag} -
								{new Date(date).toLocaleString('en-US', {
									day: 'numeric',
									month: 'numeric',
									year: 'numeric',
								})}{' '}
							</ListItem>
						)
					})}{' '}
			</List>
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
