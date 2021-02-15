import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { useHistory } from 'react-router-dom'
import TextInput from 'components/inputs/text'
import { PageTitle, FlexContainer, ListSwitch } from 'components/styled'
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
			<ListSwitch onClick={()=> history.push('/touch-list')}>Members</ListSwitch>
			<TextInput
				value={search}
				handleInput={(e) => setSearch(e.target.value.toLocaleLowerCase())}
				label="search"
				width="80%"
			/>
			<List>
				{Object.values(communityMembers)
					.filter(({ notes, location, name }) => {
                        if (notes.includes(search) || location?.includes(search) || name.includes(search)) return true
                        return false
					})
					.sort((a, b) => {
						return a.name < b.name ? 1 : -1
					})
					.map(({ name, photo, id }) => {
						return (
							<ListItem
								key={`touch-${id}`}
								
							>
								{photo ? <SearchListItemPhoto src={photo} /> : <SearchListItemPhoto src={GroupIcon} />} {name}
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

const SearchListItemPhoto = styled.img`
    height: 30px;
    width: 30px;
    border: 2px solid black;
    border-radius: 50%;
    object-fit: scale-down;

`