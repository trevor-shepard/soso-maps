import React, { useState } from 'react'
import styled from '@emotion/styled'
import { keyframes } from 'emotion'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import GoogleMapReact from 'google-map-react'
import BeatLoader from 'react-spinners/BeatLoader'
import { useParams, useHistory } from 'react-router-dom'
import { CloseIcon, MarkerIcon } from 'assets/icons'
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
import { TAGS_DISPLAY } from 'types'

export default function Detail() {
	const history = useHistory()

	const { id } = useParams<{ id: string }>()

	if (!id) history.goBack()
	const [loading, setLoading] = useState(false)
	const touch = useSelector((state: RootState) => state.touch[id])
	const cMembers = useSelector((state: RootState) => state.communitymember)

	if (!touch || touch === undefined) history.goBack()

	const cMember = touch.cMemeber ? cMembers[touch.cMemeber] : false

	const { photo, location, tag, notes, resolved, lat, lng, date } = touch

	const copyNote = async () => {
		setLoading(true)
		try {
			navigator.clipboard.writeText(
				`${TAGS_DISPLAY[tag] === 'request' ? 'SHOPPER' : TAGS_DISPLAY[tag]}${cMember && ` ${cMember.name}`}\n${notes}`
			)
		} catch (error) {}

		setLoading(false)
	}

	return (
		<FlexContainer>
			<Close onClick={history.goBack} src={CloseIcon} />

			<PageTitle>
				<Tag>
					{tag} on{' '}
					{new Date(date).toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
					})}
					{resolved && 'Resolved'}
				</Tag>
			</PageTitle>

			{cMember && cMember.photo && <ProfilePhoto src={cMember.photo} />}
			{cMember && cMember.name && <PageSubTitle>{cMember.name}</PageSubTitle>}

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
			<PageSubTitle>{location}</PageSubTitle>
			{photo && <Photo src={photo} />}

			<NotesContainer>
				{notes.split('\n').map((line, i) => (
					<p key={`${i}-line`}>{line}</p>
				))}
			</NotesContainer>
			{loading ? (
				<BeatLoader />
			) : (
				<SubmitButton onClick={copyNote}>Copy Note</SubmitButton>
			)}
		</FlexContainer>
	)
}

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

const ProfilePhoto = styled(Image)`
	height: 20%;
	width: auto;
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
