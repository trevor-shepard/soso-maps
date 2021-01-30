import React, { useState, useEffect, useCallback, FormEvent } from 'react'
import styled from '@emotion/styled'
import { createTouch } from 'store/slices/touchSlice'
import { handleFireBaseImageUpload } from 'utils/firebase'
import { useParams, useHistory } from 'react-router-dom'
import { RootState } from 'store/rootReducer'
import { useSelector } from 'react-redux'
import { createCommunityMember } from 'store/slices/communitymemberSlice'
import 'react-modern-calendar-datepicker/lib/DatePicker.css'
import { functions } from 'utils/firebase'
import TextAreaInput from 'components/inputs/textArea'
import TextInput from 'components/inputs/text'
import OMV from './omv'
import Phone from './phone'
import Medical from './medical'
import Outreach from './outreach'
import Request from './request'
import Ride from './ride'
import TentRepair from './tentRepair'

import { AddImageIcon, CloseIcon, GroupIcon } from 'assets/icons'
import {
	PageTitle,
	PageSubTitle,
	PageTitleContainer,
	SubmitButton,
	FlexContainer,
	Image,
	FileInput,
	FileInputLabel,
	ImgContainer,
	Error,
	Close,
	Tag,
	TagsContainer,
	CMemberListItem,
	DetailsContainer,
	CmemberName,
	CmemberLocation,
	ProfileImg,
} from 'components/styled'
import { TagType, TAGS, CommunityMember } from 'types'

export default function Create() {
	const { coords } = useParams<{ coords: string }>()
	const [lat, lng] = coords.split(',')
	const history = useHistory()
	const [notes, setNotes] = useState('')
	const [location, setLocation] = useState('')
	const [cMember, setCMember] = useState<CommunityMember | null>(null)
	const [newMemberID, setNewMemberIDMember] = useState<string | null>(null)
	const [selectedTag, setSelectedTag] = useState<TagType>('misc')
	const [error, setError] = useState('')
	const [imageAsFile, setImageAsFile] = useState<null | File>(null)
	const [fileAsImage, setFileAsImage] = useState<null | string>(null)

	const [search, setSearch] = useState('')

	const communityMemberState = useSelector(
		(state: RootState) => state.communitymember
	)
	const communityMembers = Object.values(communityMemberState).filter(
		({ name, notes, location }) =>
			name.includes(search) ||
			notes.includes(search) ||
			(location && location.includes(search))
	)

	// methods
	const handleSubmit = async () => {
		try {
			const date = Date.now()

			if (imageAsFile) {
				const downloadURL = await handleFireBaseImageUpload(
					`touch/${location}-${date}`,
					imageAsFile
				)

				await createTouch({
					lat,
					lng,
					notes,
					tag: selectedTag,
					location,
					date: Date.now(),
					photo: downloadURL,
					cMember: cMember ? cMember.id : null,
				})
			} else {
				await createTouch({
					lat,
					lng,
					notes,
					tag: selectedTag,
					location,
					date: Date.now(),
					photo: null,
					cMember: cMember ? cMember.id : null,
				})
			}
		} catch (error) {
			setError(
				'something went wrong, please check your internet connection and try again'
			)
		}

		history.push('/')
	}

	const handleImageAsFile = (event: FormEvent) => {
		const target = event.target as HTMLInputElement
		const files = target.files
		if (files === null) return setError('no image found')
		const file = files[0]
		const image = URL.createObjectURL(file)
		setImageAsFile(file)
		setFileAsImage(image)
	}

	// callbacks
	if (!lat || !lng) history.push('/')
	const getAddress = useCallback(async () => {
		const result = await functions.httpsCallable('getAddress')({
			lat,
			lng,
		})
		const { address } = result.data
		setLocation(address)
	}, [lat, lng])

	// hooks
	useEffect(() => {
		setLocation(coords)
		getAddress()
	}, [coords, getAddress])

	useEffect(() => {
		switch (selectedTag) {
			case 'phone':
				setNotes(
					"- Full name: \n\n- DOB -: \n\n- Last 4 of SSN: \n\n- GOV address (what's listed on their ID): \n\n- Mailing address: \n\n- What govt benefit they have (Medicaid, SNAP, or SSI)"
				)
				break
			case 'omv':
				setNotes(
					'- Full name: \n\n- DOB -: \n\n- Last 4 of SSN: \n\n- Phone #: \n\n- Have they had a LA ID before?: \n\n- If yes, do they have their birth certificate and two forms of ID?: \n\n- What govt benefit they have (Medicaid, SNAP, or SSI)'
				)
				break
			case 'ride':
				setNotes('- Destination: \n\n- Urgency: ')
				break
			case 'request':
				setNotes('- Item: \n\n- Size: ')
				break
			case 'medical':
				setNotes('- Urgency: \n\n- Symptoms: ')
				break
			case 'tentRepair':
				setNotes('- Urgency: \n\n- Issue: ')
				break
			case 'outreach':
				setNotes('- Urgency: \n\n- Issue: ')
				break
			default:
				setNotes('')
				break
		}
	}, [selectedTag, setNotes])

	useEffect(() => {
		if (newMemberID && communityMemberState[newMemberID])
			setCMember(communityMemberState[newMemberID])
	}, [communityMemberState, newMemberID])

	return (
		<Container>
			<Close onClick={history.goBack} src={CloseIcon} />
			<PageTitleContainer>
				<PageTitle>Create A Touch</PageTitle>
				<PageSubTitle>{location}</PageSubTitle>
			</PageTitleContainer>

			{error !== '' && <Error>{error}</Error>}
			<ImgContainer height={'20%'}>
				{fileAsImage ? (
					<Image src={fileAsImage} />
				) : (
					<FileInputLabel>
						<Image src={AddImageIcon} />
						<FileInput id="upload" type="file" onChange={handleImageAsFile} />
					</FileInputLabel>
				)}
			</ImgContainer>
			{cMember ? (
				<CMemberListItem>
					{cMember.photo ? (
						<ProfileImg src={cMember.photo} />
					) : (
						<ProfileImg src={GroupIcon} />
					)}
					<DetailsContainer>
						<CmemberName>{cMember.name}</CmemberName>
						{cMember && <CmemberLocation>{cMember.location}</CmemberLocation>}
					</DetailsContainer>
				</CMemberListItem>
			) : (
				<CmemberSearch>
					<TextInput
						label={'search members'}
						handleInput={(e) => setSearch(e.target.value)}
						value={search}
					/>
					{search !== '' && (
						<CmemberOptionsContainer>
							{communityMembers.map((member) => {
								const { photo, name, location, id } = member
								return (
									<CMemberListItem
										key={`member-${id}`}
										onClick={() => setCMember(member)}
									>
										{photo ? (
											<ProfileImg src={photo} />
										) : (
											<ProfileImg src={GroupIcon} />
										)}
										<DetailsContainer>
											<CmemberName>{name}</CmemberName>
											{location && (
												<CmemberLocation>{location}</CmemberLocation>
											)}
										</DetailsContainer>
									</CMemberListItem>
								)
							})}
							<CMemberListItem
								key={`member-create`}
								onClick={async () => {
									let id
									if (imageAsFile) {
										const downloadURl = await handleFireBaseImageUpload(
											`community-member/${search}-${Date.now()}`,
											imageAsFile
										)

										id = await createCommunityMember(
											search,
											notes,
											location,
											[parseFloat(lat), parseFloat(lng)],
											downloadURl
										)
									} else {
										id = await createCommunityMember(search, notes, location, [
											parseFloat(lat),
											parseFloat(lng),
										])
									}
									if (id) setNewMemberIDMember(id)
								}}
							>
								Add New Community Member
							</CMemberListItem>
						</CmemberOptionsContainer>
					)}
				</CmemberSearch>
			)}

			<TagsContainer>
				{TAGS.map((tag) => (
					<Tag
						key={`tag-${tag}`}
						onClick={() => {
							setSelectedTag(tag)
						}}
						selected={tag === selectedTag}
					>
						{tag}
					</Tag>
				))}
			</TagsContainer>

			{selectedTag === 'omv' && <OMV createNote={setNotes} />}
			{selectedTag === 'phone' && <Phone createNote={setNotes} />}
			{selectedTag === 'medical' && <Medical createNote={setNotes} />}
			{selectedTag === 'outreach' && <Outreach createNote={setNotes} />}
			{selectedTag === 'request' && <Request createNote={setNotes} />}
			{selectedTag === 'ride' && <Ride createNote={setNotes} />}
			{selectedTag === 'tentRepair' && <TentRepair createNote={setNotes} />}
			{selectedTag === 'misc' && (
				<TextAreaInput
					value={notes}
					label={'notes'}
					handleInput={(e) => setNotes(e.target.value)}
					height={'200px'}
				/>
			)}

			<SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
		</Container>
	)
}

const Container = styled(FlexContainer)`
	justify-content: space-between;
	overflow-y: scroll;
	margin-bottom: 65px;
`

const CmemberSearch = styled.div`
	width: 90%;
	display: flex;
	flex-direction: column;
	position: relative;
`
const CmemberOptionsContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: left;
	position: absolute;
	top: 39px;
	border: 2px solid black;
	border-top: none;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	background-color: white;
	width: 89%;
`
