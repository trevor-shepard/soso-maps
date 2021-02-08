import React, { useState, useEffect, useCallback, FormEvent } from 'react'
import styled from '@emotion/styled'
import { createTouch } from 'store/slices/touchSlice'
import { handleFireBaseImageUpload } from 'utils/firebase'
import { useParams, useHistory } from 'react-router-dom'
import { RootState } from 'store/rootReducer'
import { useSelector } from 'react-redux'
import CreateCommunityMember from './community-member/create'
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
	Image,
	FileInput,
	FileInputLabel,
	Error,
	Close,
	Tag,
	TagsContainer,
	CMemberListItem,
	DetailsContainer,
	CmemberName,
	CmemberLocation,
	ProfileImg,
	ImgContainer,
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
	const [createCommunityMember, setCreateCommunityMember] = useState(false)

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
		if (newMemberID && communityMemberState[newMemberID])
			setCMember(communityMemberState[newMemberID])
	}, [communityMemberState, newMemberID])

	useEffect(() => {
		setNotes('')
	}, [selectedTag, setNotes])

	if (createCommunityMember)
		return (
			<CreateCommunityMember
				close={() => setCreateCommunityMember(false)}
				name={search}
				setCMember={(id: string) => setNewMemberIDMember(id)}
			/>
		)

	return (
		<Container>
			<Close onClick={history.goBack} src={CloseIcon} />
			<PageTitleContainer>
				<PageTitle>Create A Touch</PageTitle>
				<PageSubTitle>{location}</PageSubTitle>
			</PageTitleContainer>

			{error !== '' && <Error>{error}</Error>}
			<ImgContainer height="100px">
				{fileAsImage ? (
					<Image src={fileAsImage} />
				) : (
					<FileInputLabel>
						<AddPhoto src={AddImageIcon} />
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
								onClick={() => setCreateCommunityMember(true)}
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

			<OMV hide={selectedTag !== 'omv'} createNote={setNotes} />
			<Phone hide={selectedTag !== 'phone'} createNote={setNotes} />
			<Medical hide={selectedTag !== 'medical'} createNote={setNotes} />
			<Outreach hide={selectedTag !== 'outreach'} createNote={setNotes} />
			<Request hide={selectedTag !== 'request'} createNote={setNotes} />
			<Ride hide={selectedTag !== 'ride'} createNote={setNotes} />
			<TentRepair hide={selectedTag !== 'tentRepair'} createNote={setNotes} />

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

const Container = styled.div`
	height: 100%;
	width: auto;
	display: flex;
	align-items: center;
	flex-direction: column;
	position: relative;
	overflow: scroll;
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

const AddPhoto = styled(Image)`
	height: 100px;
	width: auto;
`
