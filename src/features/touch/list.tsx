import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { useHistory } from 'react-router-dom'
import TextInput from 'components/inputs/text'
import { PageTitle, FlexContainer, ListSwitch } from 'components/styled'
import { TAGS } from 'types'

export default function TouchList() {
	const history = useHistory()
	const [search, setSearch] = useState('')
	const touches = useSelector((state: RootState) => state.touch)
	const communityMembers = useSelector(
		(state: RootState) => state.communitymember
	)

	return (
		<FlexContainer>
			<PageTitle>Touches</PageTitle>
			<ListSwitch onClick={() => history.push('/community-member-list')}>
				Members
			</ListSwitch>
			<TextInput
				value={search}
				handleInput={(e) => setSearch(e.target.value.toLocaleLowerCase())}
				label="search"
				width="80%"
			/>
			<List>
				{Object.values(touches)
					.filter(({ notes, location, tag, cMemeber }) => {
						const searchTerms = search.split(' ')
						// @ts-ignore
						if (searchTerms.some((term) => TAGS.includes(term))) {
							if (searchTerms.includes(tag)) {
								console.log(tag)
								let searchWithTagRemoved = searchTerms.reduce((acc, curr) => {
									if (acc === '' && curr === ' ') return acc
									return curr === tag ? acc : `${acc} ${curr}`
								}, '')

								if (searchWithTagRemoved[0] === ' ')
									searchWithTagRemoved = searchWithTagRemoved.substr(1)

								return (
									searchWithTagRemoved === '' ||
									(cMemeber &&
										communityMembers[cMemeber] &&
										communityMembers[cMemeber].name
											.toLocaleLowerCase()
											.includes(searchWithTagRemoved.toLocaleLowerCase())) ||
									notes
										.toLowerCase()
										.includes(searchWithTagRemoved.toLocaleLowerCase()) ||
									location
										.toLowerCase()
										.includes(searchWithTagRemoved.toLowerCase())
								)
							} else {
								return false
							}
						}

						return (
							(cMemeber &&
								communityMembers[cMemeber] &&
								communityMembers[cMemeber].name
									.toLocaleLowerCase()
									.includes(search.toLocaleLowerCase())) ||
							notes.toLowerCase().includes(search.toLocaleLowerCase()) ||
							location.toLowerCase().includes(search.toLowerCase())
						)
					})
					.sort((a, b) => {
						return a.date < b.date ? 1 : -1
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
								})}
							</ListItem>
						)
					})}
			</List>
		</FlexContainer>
	)
}

const List = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 90%;
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
