import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { RootState } from 'store/rootReducer'
import TextInput from 'components/inputs/text'
import { GroupIcon } from 'assets/icons'
import { CommunityMember } from 'types'
import {
	CMemberListItem,
DetailsContainer,
CmemberName,
CmemberLocation,
ProfileImg,
} from 'components/styled'
interface Props {
	handleSelect: (member: CommunityMember) => void
	width: string
	height: string
}

export default function CMemberSearch({ handleSelect, height, width }: Props) {
	const history = useHistory()
	const [search, setSearch] = useState('')
	const communitymembers = useSelector(
		(state: RootState) => state.communitymember
	)
	const options = Object.values(communitymembers)
		.filter(
			({ name, notes, location }) =>
				name.includes(search) ||
				notes.includes(search) ||
				(location && location.includes(search))
		)
		.map(member => {
			const { photo, name, location } = member
			return (
				<CMemberListItem onClick={() => handleSelect(member)}>
					{photo ? <ProfileImg src={photo} /> : <ProfileImg src={GroupIcon} />}
					<DetailsContainer>
						<CmemberName>{name}</CmemberName>
						{location && <CmemberLocation>{location}</CmemberLocation>}
					</DetailsContainer>
				</CMemberListItem>
			)
		})
	options.push(
		<CMemberListItem onClick={() => history.push('/community-member-create')}>
			Add New Community Member
		</CMemberListItem>
	)
	return (
		<Container height={height} width={width}>
			<TextInput
				label={'search members'}
				handleInput={e => setSearch(e.target.value)}
				value={search}
			/>
			{search !== '' && <OptionsContainer>{options}</OptionsContainer>}
		</Container>
	)
}

const Container = styled.div<{ height: string; width: string }>`
	height: ${({ height }) => height};
	width: ${({ width }) => width};
	display: flex;
	flex-direction: column;
	position: relative;
`
const OptionsContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: left;
	position: absolute;
	top: 39px;
	border: 2px solid black;
	border-top: none;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	background-color: '#ffff';
	width: 89%;
`

