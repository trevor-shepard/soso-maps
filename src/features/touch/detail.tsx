import React, { useState, useCallback, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { keyframes } from 'emotion'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import GoogleMapReact from 'google-map-react'
import BeatLoader from 'react-spinners/BeatLoader'
import { useParams, useHistory } from 'react-router-dom'
import { CloseIcon, MarkerIcon } from 'assets/icons'
import { resolveTouch } from 'store/slices/touchSlice'
import Modal from 'components/modal'
import { functions } from 'utils/firebase'

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
import TextInput from 'components/inputs/text'

export default function Detail() {
	const ref = useRef<HTMLDivElement>(null)
	const history = useHistory()

	const { id } = useParams<{ id: string }>()

	if (!id) history.goBack()
	const [loading, setLoading] = useState(false)
	const [showResolve, setShowResolve] = useState(false)
	const [resolveNote, setResolveNote] = useState('')
	const touch = useSelector((state: RootState) => state.touch[id])
	const communityMembers = useSelector((state: RootState) => state.communitymember)
	const uid = useSelector((state: RootState) => state.user.uid as string)
	const latlng = useSelector(
		(state: RootState) => state.user.latlng as { lat: number; lng: number }
	)
	const username = useSelector(
		(state: RootState) => state.user.username as string
	)

	const [currentLocationAddress, setcurrentLocationAddress] = useState('')
	if (!touch || touch === undefined || latlng === undefined) history.goBack()

	const getAddress = useCallback(async () => {
		try {
			const result = await functions.httpsCallable('getAddress')({
				lat: latlng.lat,
				lng: latlng.lng,
			})
			const { address } = result.data
			setcurrentLocationAddress(address)
		} catch (error) {
			console.log('error getting address', error)
		}
		
	}, [latlng.lat, latlng.lng])

	useEffect(() => {
		getAddress()
	}, [getAddress])

	useEffect(() => {
		if (ref.current) ref.current.scrollTo({ top: 0, behavior: 'smooth' })
	}, [showResolve])

	const communityMember = touch.cMemeber ? communityMembers[touch.cMemeber] : false

	const { photo, location, tag, notes, resolved, lat, lng, date } = touch

	const copyNote = async () => {
		setLoading(true)
		try {
			navigator.clipboard.writeText(
				`${TAGS_DISPLAY[tag] === 'REQUEST ' ? 'SHOPPER' : TAGS_DISPLAY[tag]}${
					communityMember && ` ${communityMember.name}`
				}\n${location && `${location}\n`}${notes}`
			)
		} catch (error) {}

		setLoading(false)
	}

	const handleResolve = async () => {
		setLoading(true)
		await resolveTouch({
			uid,
			touchID: touch.id,
			note: `${touch.notes}\n\nRESOLVED\n${resolveNote}`,
		})
		setShowResolve(false)
		setLoading(false)
	}

	const handlePhoneGiven = async () => {
		setLoading(true)
		const response = await functions.httpsCallable('PhoneGiven')({
			user: username,
			community_member: communityMember ? communityMember.name : 'unk',
			date: new Date(date).toLocaleString('en-US', {
				day: 'numeric',
				month: 'numeric',
				year: 'numeric',
			}),
			location: currentLocationAddress,
		})

		console.log('response', response)
		await handleResolve()
	}
	console.log('tag', tag === 'phone')
	return (
		<FlexContainer ref={ref}>
			<Close onClick={history.goBack} src={CloseIcon} />

			{showResolve &&
				(tag === 'phone' ? (
					<Modal hideModal={() => setShowResolve(false)}>
						<PageTitle>Record Phone Given</PageTitle>
						<PageSubTitle>{currentLocationAddress}</PageSubTitle>
						<TextInput
							value={resolveNote}
							label={'notes'}
							handleInput={(e) => setResolveNote(e.target.value)}
						/>
						{loading ? (
							<BeatLoader />
						) : (
							<SubmitButton onClick={handlePhoneGiven}>Submit</SubmitButton>
						)}
					</Modal>
				) : (
					<Modal hideModal={() => setShowResolve(false)}>
						<PageTitle>Resolve Touch</PageTitle>
						<TextInput
							value={resolveNote}
							label={'notes'}
							handleInput={(e) => setResolveNote(e.target.value)}
						/>
						{loading ? (
							<BeatLoader />
						) : (
							<SubmitButton onClick={handleResolve}>Submit</SubmitButton>
						)}
					</Modal>
				))}

			<PageTitle>
				<Tag>
					{tag} on{' '}
					{new Date(date).toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
					})}
					{resolved && '-Resolved'}
				</Tag>
			</PageTitle>

			{communityMember && communityMember.photo && <ProfilePhoto src={communityMember.photo} />}
			{communityMember && communityMember.name && <PageSubTitle>{communityMember.name}</PageSubTitle>}

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
				<Footer>
					<SubmitButton onClick={copyNote}>Copy Note</SubmitButton>
					{touch.resolved === '' && (
						<SubmitButton onClick={() => setShowResolve(true)}>
							Resolve
						</SubmitButton>
					)}
				</Footer>
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
	border: 2px solid black;
	border-radius: 10px;
`

const ProfilePhoto = styled(Image)`
	height: 200px;

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
