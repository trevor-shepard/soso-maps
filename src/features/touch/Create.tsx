import React, { useState, useEffect, useCallback, FormEvent } from 'react'
import styled from '@emotion/styled'
import { useDispatch } from 'react-redux'
import {
	createMarker,
	handleFireBaseImageUpload
} from 'store/slices/touchSlice'
import { useParams, useHistory } from 'react-router-dom'
import { functions } from 'utils/firebase'
import TextInput from 'components/inputs/text'
import TextAreaInput from 'components/inputs/textArea'
import CheckBox from 'components/inputs/checkbox'
import { AddImageIcon, CloseIcon } from 'assets/icons'
import {
	PageTitle,
	PageSubTitle,
	SubmitButton,
	FlexContainer,
	Image,
	FileInput,
	FileInputLabel,
	ImgContainer,
	Error,
	Close
} from 'components/styled'
import { TagType } from 'types'

export default function Create() {
	const { coords } = useParams<{ coords: string }>()
	const [lat, lng] = coords.split(',')
	const history = useHistory()
	const dispatch = useDispatch()

	const [title, setTitle] = useState('')
	const [notes, setNotes] = useState('')
	const [location, setLocation] = useState('')
	const [tags, setTags] = useState<TagType[]>([])

	const [error, setError] = useState('')
	const [imageAsFile, setImageAsFile] = useState<null | File>(null)
	const [fileAsImage, setFileAsImage] = useState<null | string>(null)

	// methods
	const handleSubmit = async () => {
		try {
			const date = Date.now()
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
						tags,
						location,
						Date.now(),
						downloadURL
					)
				)
			} else {
				await dispatch(
					createMarker(lat, lng, title, notes, tags, location, Date.now())
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

	return (
		<FlexContainer>
			<Close onClick={history.goBack} src={CloseIcon} />
			<PageTitle>Create A Touch</PageTitle>
			<PageSubTitle>{location}</PageSubTitle>
			{error !== '' && <Error>{error}</Error>}

			<InputContainer>
				<TextInput
					value={title}
					label={'title'}
					handleInput={e => setTitle(e.target.value)}
				/>
				<TextAreaInput
					value={notes}
					label={'notes'}
					handleInput={e => setNotes(e.target.value)}
					height={'200px'}
				/>
			</InputContainer>

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
			<CheckBox
				label={'OMV'}
				isSelected={tags.includes('omv')}
				onCheckboxChange={() => {
					if (tags.includes('omv')) {
						setTags(tags.filter(tag => tag !== 'omv'))
					} else {
						setTags([...tags, 'omv'])
					}
				}}
			/>
			<CheckBox
				label={'Tent Repair'}
				isSelected={tags.includes('tentRepair')}
				onCheckboxChange={() => {
					if (tags.includes('tentRepair')) {
						setTags(tags.filter(tag => tag !== 'tentRepair'))
					} else {
						setTags([...tags, 'tentRepair'])
					}
				}}
			/>
			<CheckBox
				label={'Request'}
				isSelected={tags.includes('request')}
				onCheckboxChange={() => {
					if (tags.includes('request')) {
						setTags(tags.filter(tag => tag !== 'request'))
					} else {
						setTags([...tags, 'request'])
					}
				}}
			/>
			<CheckBox
				label={'Medical'}
				isSelected={tags.includes('medical')}
				onCheckboxChange={() => {
					if (tags.includes('medical')) {
						setTags(tags.filter(tag => tag !== 'medical'))
					} else {
						setTags([...tags, 'medical'])
					}
				}}
			/>
			<CheckBox
				label={'Ride'}
				isSelected={tags.includes('ride')}
				onCheckboxChange={() => {
					if (tags.includes('ride')) {
						setTags(tags.filter(tag => tag !== 'ride'))
					} else {
						setTags([...tags, 'ride'])
					}
				}}
			/>
			<CheckBox
				label={'Phone'}
				isSelected={tags.includes('phone')}
				onCheckboxChange={() => {
					if (tags.includes('phone')) {
						setTags(tags.filter(tag => tag !== 'phone'))
					} else {
						setTags([...tags, 'phone'])
					}
				}}
			/>
			<CheckBox
				label={'Outreach'}
				isSelected={tags.includes('outreach')}
				onCheckboxChange={() => {
					if (tags.includes('outreach')) {
						setTags(tags.filter(tag => tag !== 'outreach'))
					} else {
						setTags([...tags, 'outreach'])
					}
				}}
			/>
			<CheckBox
				label={'Misc'}
				isSelected={tags.includes('misc')}
				onCheckboxChange={() => {
					if (tags.includes('misc')) {
						setTags(tags.filter(tag => tag !== 'misc'))
					} else {
						setTags([...tags, 'misc'])
					}
				}}
			/>
			<SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
		</FlexContainer>
	)
}

const InputContainer = styled.div`
	width: 80%;
`
