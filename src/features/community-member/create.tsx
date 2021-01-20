import React, { useState, FormEvent, useEffect } from 'react'
import styled from '@emotion/styled'
import GoogleMapReact from 'google-map-react'
import { createCommunityMember } from 'store/slices/communitymemberSlice'
import { handleFireBaseImageUpload } from 'utils/firebase'
import { useHistory } from 'react-router-dom'
import { functions } from 'utils/firebase'
import TextInput from 'components/inputs/text'
import TextAreaInput from 'components/inputs/textArea'
import { AddImageIcon, CloseIcon, MarkerIcon } from 'assets/icons'
import {
	PageTitle,
	PageTitleContainer,
	SubmitButton,
	FlexContainer,
	Image,
	FileInput,
	FileInputLabel,
	ImgContainer,
	Error,
	Close,
	Marker,
	MapMarkerIcon,
	MarkerTitle,
	MarkerTitleHeader,
} from 'components/styled'

export default function Create() {
	const history = useHistory()
	const [lastPress, setlastPress] = useState(0)
	const [name, setName] = useState('')
	const [notes, setNotes] = useState('')
	const [latLng, setLatLng] = useState<[number, number] | null>(null)
	const [location, setLocation] = useState<string | null>(null)
	const [Currentlat, setCurrentLat] = useState(29.94639419721249)
	const [Currentlng, setCurrentLng] = useState(-90.07472171802686)
	const [error, setError] = useState('')
	const [imageAsFile, setImageAsFile] = useState<null | File>(null)
	const [fileAsImage, setFileAsImage] = useState<null | string>(null)

	// methods
	const handleSubmit = async () => {
		try {
			if (imageAsFile) {
				const downloadURl = await handleFireBaseImageUpload(
					`community-member/${name}-${Date.now()}`,
					imageAsFile
				)

				await createCommunityMember(name, notes, location, latLng, downloadURl)
			} else {
				await createCommunityMember(name, notes, location, latLng)
			}
		} catch (error) {
			setError(
				'something went wrong, please check your internet connection and try again'
			)
		}

		history.goBack()
	}

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			({ coords: { latitude, longitude } }) => {
				setCurrentLat(latitude)
				setCurrentLng(longitude)
			}
		)
	}, [])

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
		const result = await functions.httpsCallable('getAddress')({
			lat,
			lng
		})
		const { address } = result.data
		setLocation(address)
	}

	return (
		<Container>
			<Close onClick={history.goBack} src={CloseIcon} />
			<PageTitleContainer>
				<PageTitle>Add a Community Member</PageTitle>
			</PageTitleContainer>
			<TextInput
				value={name}
				label={'name'}
				handleInput={e => setName(e.target.value)}
			/>

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

			<MapsContainer>
				<GoogleMapReact
					onClick={async values => {
						const { lat, lng } = values
						const now = Date.now()

						if (now - lastPress < 1000) {
							getAddress(lat, lng)
							setLatLng([lat, lng])

						} else {
							setlastPress(Date.now())
						}
					}}
					bootstrapURLKeys={{
						key: process.env.REACT_APP_FIREBASE_API_KEY as string
					}}
					defaultCenter={{
						lat: Currentlat,
						lng: Currentlng
					}}
					defaultZoom={15}
				>
					{latLng && (
						<Marker
	
							lat={latLng[0]}

							lng={latLng[1]}
						>
							<MapMarkerIcon src={MarkerIcon} />
							<MarkerTitle>
								{location && <MarkerTitleHeader>{location}</MarkerTitleHeader>}
							</MarkerTitle>
						</Marker>
					)}
				</GoogleMapReact>
			</MapsContainer>

			<TextAreaInput
				value={notes}
				label={'notes'}
				handleInput={e => setNotes(e.target.value)}
				height={'200px'}
			/>

			<SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
		</Container>
	)
}

const Container = styled(FlexContainer)`
	justify-content: space-between;
`

const MapsContainer = styled.div`
	height: 30%;
	width: 80%;
`
