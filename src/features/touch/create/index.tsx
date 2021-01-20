import React, { useState, useEffect, useCallback, FormEvent } from 'react'
import styled from '@emotion/styled'
import { useDispatch } from 'react-redux'
import { createMarker } from 'store/slices/touchSlice'
import { handleFireBaseImageUpload } from 'utils/firebase'
import { useParams, useHistory } from 'react-router-dom'
import { functions } from 'utils/firebase'
import TextInput from 'components/inputs/text'
import TextAreaInput from 'components/inputs/textArea'
import CMemberSearch from './cmemberSearch'
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
	const dispatch = useDispatch()
	const [title, setTitle] = useState('')
	const [notes, setNotes] = useState('')
	const [location, setLocation] = useState('')
	const [cMember, setCMember] = useState<CommunityMember | null>(null)
	const [selectedTags, setSelectedTags] = useState<{ [k in TagType]: boolean }>(
		{
			omv: true,
			tentRepair: true,
			request: true,
			medical: true,
			ride: true,
			phone: true,
			outreach: true,
			misc: true
		}
	)

	const [error, setError] = useState('')
	const [imageAsFile, setImageAsFile] = useState<null | File>(null)
	const [fileAsImage, setFileAsImage] = useState<null | string>(null)

	// methods
	const handleSubmit = async () => {
		try {
			const date = Date.now()
			const tags = TAGS.filter(tag => selectedTags[tag])
			if (imageAsFile) {
				const downloadURL = await handleFireBaseImageUpload(
					`touch/${title}-${date}`,
					imageAsFile
				)

				await dispatch(
					createMarker(
						lat,
						lng,
						title,
						notes,
						tags !== [] ? tags : ['misc'],
						location,
						Date.now(),
						downloadURL
					)
				)
			} else {
				await dispatch(
					createMarker(
						lat,
						lng,
						title,
						notes,
						tags !== [] ? tags : ['misc'],
						location,
						Date.now()
					)
				)
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

	// hooks
	if (!lat || !lng) history.push('/')
	const getAddress = useCallback(async () => {
		const result = await functions.httpsCallable('getAddress')({
			lat,
			lng
		})
		const { address } = result.data
		setLocation(address)
	}, [lat, lng])

	useEffect(() => {
		setLocation(coords)
		getAddress()
	}, [coords, getAddress])

	const tagtoggles = TAGS.map(tag => (
		<Tag
			key={`tag-${tag}`}
			onClick={() => {
				const newSelected = {
					...selectedTags,
					[tag]: !selectedTags[tag]
				}
				setSelectedTags(newSelected)
			}}
			selected={selectedTags[tag]}
		>
			{tag}
		</Tag>
	))

	return (
		<Container>
			<Close onClick={history.goBack} src={CloseIcon} />
			<PageTitleContainer>
				<PageTitle>Create A Touch</PageTitle>
				<PageSubTitle>{location}</PageSubTitle>
			</PageTitleContainer>

			{error !== '' && <Error>{error}</Error>}

			<TextInput
				value={title}
				label={'title'}
				handleInput={e => setTitle(e.target.value)}
			/>

			{ cMember ? <CMemberListItem >
					{cMember.photo ? <ProfileImg src={cMember.photo} /> : <ProfileImg src={GroupIcon} />}
					<DetailsContainer>
						<CmemberName>{cMember.name}</CmemberName>
						{cMember && <CmemberLocation>{cMember.location}</CmemberLocation>}
					</DetailsContainer>
				</CMemberListItem>
				
				:<CMemberSearch
				handleSelect={member => setCMember(member)}
				width={'90%'}
				height={'20%'}
			/>}
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

			<TextAreaInput
				value={notes}
				label={'notes'}
				handleInput={e => setNotes(e.target.value)}
				height={'200px'}
			/>
			<TagsContainer>{tagtoggles}</TagsContainer>

			<SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
		</Container>
	)
}

const Container = styled(FlexContainer)`
	justify-content: space-between;
`
