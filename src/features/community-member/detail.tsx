import React, { useState } from 'react'
import styled from '@emotion/styled'
import { keyframes } from 'emotion'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { updateCommunityMember } from 'store/slices/communitymemberSlice'
import GoogleMapReact from 'google-map-react'
import BeatLoader from 'react-spinners/BeatLoader'
import { useParams, useHistory } from 'react-router-dom'
import { CloseIcon, MarkerIcon } from 'assets/icons'
import Modal from 'components/modal'
import {
	PageTitle,
	PageSubTitle,
	FlexContainer,
	Image,
	Close,
	Marker,
	MapMarkerIcon,
	SubmitButton,
} from 'components/styled'
import TextInput from 'components/inputs/text'

export default function Detail() {
	const history = useHistory()

	const { id } = useParams<{ id: string }>()

	if (!id) history.goBack()
	const [loading, setLoading] = useState(false)
	const [showAddNote, setShowAddNote] = useState(false)
	const [note, setNote] = useState('')
	const communityMembers = useSelector(
		(state: RootState) => state.communitymember
	)
	const touches = useSelector((state: RootState) => state.touch)
	const user = useSelector((state: RootState) => state.user)
	const member = communityMembers[id]
	if (!member || member === undefined) history.goBack()

	const communityMembersTouches = Object.values(touches).filter(
		(touch) => touch.cMemeber === id
	)

	const { name, notes, location, photo, lat, lng } = member

	const handleAddNote = async () => {
		setLoading(true)
		await updateCommunityMember(id, {
			notes: `${notes}\n${user.username}: ${note} (${new Date().toLocaleString(
				'en-US',
				{
					day: 'numeric',
					month: 'numeric',
					year: 'numeric',
				}
			)})`,
		})
		setShowAddNote(false)
		setLoading(false)
	}

	return (
		<FlexContainer>
			<Close onClick={history.goBack} src={CloseIcon} />

			{showAddNote && (
				<Modal hideModal={() => setShowAddNote(false)}>
					<PageTitle>Add Note to Member</PageTitle>
					<TextInput
						value={note}
						label={'add note'}
						handleInput={(e) => setNote(e.target.value)}
					/>
					{loading ? (
						<BeatLoader />
					) : (
						<SubmitButton onClick={handleAddNote}>Submit</SubmitButton>
					)}
				</Modal>
			)}
			<ProfileTitle>
				{photo && <ProfilePhoto src={photo} />}
				{name}
			</ProfileTitle>
			{communityMembersTouches.length && (
				<List>
					{communityMembersTouches
						.sort((a, b) => {
							return a.date < b.date ? 1 : -1
						})
						.map(({ date, tag, id, resolved }) => (
							<ListItem
								key={`touch-${id}`}
								onClick={() => history.push(`/touch-detail/${id}`)}
							>
								{tag} -
								{new Date(date).toLocaleString('en-US', {
									day: 'numeric',
									month: 'numeric',
									year: 'numeric',
								})}
								{resolved && '- Resolved'}
							</ListItem>
						))}
				</List>
			)}

			{lat && lng && (
				<MapsContainer>
					<GoogleMapReact
						bootstrapURLKeys={{
							key: process.env.REACT_APP_FIREBASE_API_KEY as string,
						}}
						defaultCenter={{
							lat,
							lng,
						}}
						defaultZoom={16}
						options={() => {
							return {
								zoomControl: false,
								fullscreenControl: false,
							}
						}}
					>
						<Marker lat={lat} lng={lng}>
							<MapMarkerIcon src={MarkerIcon} />
						</Marker>
					</GoogleMapReact>
				</MapsContainer>
			)}
			{location && <PageSubTitle>{location}</PageSubTitle>}

			<NotesContainer>
				{notes.split('\n').map((line, i) => (
					<p key={`${i}-line`}>{line}</p>
				))}
			</NotesContainer>
			{loading ? (
				<BeatLoader />
			) : (
				<Footer>
					<SubmitButton onClick={() => setShowAddNote(true)}>
						Add Note
					</SubmitButton>
				</Footer>
			)}
		</FlexContainer>
	)
}

const ProfileTitle = styled(PageTitle)`
	display: flex;
	flex-direction: column;
`

const ProfilePhoto = styled(Image)`
	height: 200px;
	width: 200px;
	object-fit: cover;
	border-radius: 50%;
	border: 2px solid black;
`

const MapsContainer = styled.div`
	height: 30%;
	min-height: 200px;
	width: 80%;
	margin-bottom: 20px;
`

const select = () => keyframes`
to {
    -webkit-user-select: text;
    user-select: text;
  }
`

const NotesContainer = styled.div`
	width: 80%;
	height: auto;
	text-align: left;
	margin-top: 2%;
	-webkit-user-select: text;
	user-select: text;
	&:focus {
		animation: ${select()} 100ms step-end forwards;
	}
`
const Footer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
`

const List = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 90%;
	max-height: 300px;
	border: 2px solid black;
	padding: 5px;
	margin-bottom: 30px;
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
