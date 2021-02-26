import React, { useState, FormEvent, useEffect } from 'react'
import styled from '@emotion/styled'
import { createCommunityMember } from 'store/slices/communitymemberSlice'
import { handleFireBaseImageUpload } from 'utils/firebase'
import { functions } from 'utils/firebase'
import TextInput from 'components/inputs/text'
import TextAreaInput from 'components/inputs/textArea'
import { AddImageIcon, CloseIcon } from 'assets/icons'
import { RootState } from 'store/rootReducer'
import { useSelector } from 'react-redux'
import BeatLoader from 'react-spinners/BeatLoader'
import {
	PageTitle,
	PageTitleContainer,
	SubmitButton,
	FileInput,
	FileInputLabel,
	Error,
	Close,
	PageSubTitle,
} from 'components/styled'

export default function Create(props: {
	name: string
	close: () => void
	setCMember: (id: string) => void
}) {
	const { lat, lng } = useSelector((state: RootState) =>
		state.user.latlng !== undefined
			? state.user.latlng
			: {
					lat: 29.94639419721249,
					lng: -90.07472171802686,
			  }
	) as { lat: number; lng: number }

	const [name, setName] = useState(props.name)
	const [notes, setNotes] = useState('')
	const [location, setLocation] = useState<string | null>(null)
	const [error, setError] = useState('')
	const [imageAsFile, setImageAsFile] = useState<null | File>(null)
	const [fileAsImage, setFileAsImage] = useState<null | string>(null)
	const [loading, setLoading] = useState(false)
	// methods
	
	
	const handleSubmit = async () => {
		setLoading(true)
		try {
			let id
			if (imageAsFile) {
				const downloadURl = await handleFireBaseImageUpload(
					`community-member/${name}-${Date.now()}`,
					imageAsFile
				)

				id = await createCommunityMember(
					name,
					notes,
					location,
					[lat, lng],
					downloadURl
				)
			} else {
				id = await createCommunityMember(name, notes, location, [lat, lng])
			}
			if (id) props.setCMember(id)

			return props.close()
		} catch (error) {
			setError(
				'something went wrong, please check your internet connection and try again'
			)
		}

		setLoading(false)
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
	const getAddress = async (lat: number, lng: number) => {
		try {
			const result = await functions.httpsCallable('getAddress')({
				lat,
				lng,
			})
			const { address } = result.data
			setLocation(address)
		} catch (error) {
			console.log('error getting addess', error)
		}
		
	}

	useEffect(() => {
		navigator.geolocation.watchPosition(
			({ coords: { latitude, longitude } }) => {
				getAddress(latitude, longitude)
			}
		)
		
		
	}, [])

	return (
		<Container>
			<Close onClick={props.close} src={CloseIcon} />
			<PageTitleContainer>
				<PageTitle>Add a Community Member</PageTitle>
				{location && <PageSubTitle>{location}</PageSubTitle>}
			</PageTitleContainer>
			
			<TextInput
				value={name}
				label={'name'}
				handleInput={(e) => setName(e.target.value)}
			/>

			{error !== '' && <Error>{error}</Error>}

			{fileAsImage ? (
					<Image src={fileAsImage} />
				) : (
					<FileInputLabel>
						<Image src={AddImageIcon} />
						<FileInput id="upload" type="file" onChange={handleImageAsFile} />
					</FileInputLabel>
				)}
			

			<TextAreaInput
				value={notes}
				label={'notes'}
				handleInput={(e) => setNotes(e.target.value)}
				height={'200px'}
			/>

			{loading ? (
				<BeatLoader />
			) : (
				<SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
			)}
		</Container>
	)
}

const Container = styled.div`
	height: calc(${() => window.innerHeight}px - 60px);
	width: auto;
	display: flex;
	align-items: center;
	flex-direction: column;
	position: relative;
	overflow: scroll;
	overflow: scroll;
`
export const Image = styled.img`
	height: 200px;
	width: auto;
	object-fit: cover;
`