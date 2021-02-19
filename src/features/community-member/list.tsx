import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { useHistory } from 'react-router-dom'
import TextInput from 'components/inputs/text'
import { PageTitle, FlexContainer, ListSwitch, ItemList, ListItem } from 'components/styled'
import { GroupIcon } from 'assets/icons'

export default function TouchList() {
	const history = useHistory()
	const [search, setSearch] = useState('')

	const communityMembers = useSelector(
		(state: RootState) => state.communitymember
	)

	return (
		<FlexContainer>
			<PageTitle>Community Members</PageTitle>
			<ListSwitch onClick={() => history.push('/touch-list')}>
				Members
			</ListSwitch>
			<TextInput
				value={search}
				handleInput={(e) => setSearch(e.target.value.toLocaleLowerCase())}
				label="search"
				width="80%"
			/>
			<ItemList>
				{Object.values(communityMembers)
					.filter(({ notes, location, name }) => {
						if (
							notes.includes(search) ||
							location?.includes(search) ||
							name.includes(search)
						)
							return true
						return false
					})
					.sort((a, b) => {
						return a.name < b.name ? 1 : -1
					})
					.map(({ name, photo, id }) => {
						return (
							<ListItem
								key={`touch-${id}`}
								onClick={() => history.push(`/community-member-detail/${id}`)}
							>
								{photo ? (
									<SearchListItemPhoto src={photo} />
								) : (
									<SearchListItemPhoto src={GroupIcon} />
								)}{' '}
								<MemberName>{name}</MemberName>
							</ListItem>
						)
					})}{' '}
			</ItemList>
		</FlexContainer>
	)
}

const SearchListItemPhoto = styled.img`
	height: 50px;
	width: 50px;
	border: 2px solid black;
	border-radius: 50%;
	object-fit: scale-down;
	margin-left: 10%;
`
const MemberName = styled.div`
	font-family: Poppins;
	font-weight: bold;
	margin-right: 10%;
`