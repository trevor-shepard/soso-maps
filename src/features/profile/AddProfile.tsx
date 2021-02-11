import React, { FunctionComponent, useState, FormEvent } from 'react'
import styled from '@emotion/styled'
import { useDispatch } from 'react-redux'
import Modal from 'components/modal'
import { storage } from 'utils/firebase'
import { addUserPhoto } from 'store/slices/userSlice'
import { AddImageIcon } from 'assets/icons'
import {
	Image,
	FileInput,
	FileInputLabel,
	SubmitButton,
	PageTitle
} from 'components/styled'
interface Props {
	hideModal: () => void
	username: string
}

const AddActivityModal: FunctionComponent<Props> = ({
	hideModal,
	username
}) => {
	const [imageAsFile, setImageAsFile] = useState<null | File>(null)
	const [fileAsImage, setFileAsImage] = useState<null | string>(null)
	const [error, setError] = useState('')
	const handleImageAsFile = (event: FormEvent) => {
		const target = event.target as HTMLInputElement
		const files = target.files
		if (files === null) return setError('no image found')
		const file = files[0]
		const image = URL.createObjectURL(file)
		setImageAsFile(file)
		setFileAsImage(image)
	}

	const handleFireBaseUpload = async (e: FormEvent) => {
		e.preventDefault()
		console.log('start of upload')
		if (imageAsFile === null)
			return setError(`not an image, the image file is a ${typeof imageAsFile}`)
		const uploadTask = storage
			.ref(`/images/${username}/${imageAsFile.name}`)
			.put(imageAsFile)
		uploadTask.on(
			'state_changed',
			// monitor upload
			snapShot => {
				//takes a snap shot of the process as it is happening
				console.log(snapShot)
			},
			err => {
				//catches the errors
				setError(
					'sorry there was a problem. check internet connection and try again'
				)
			},
			async () => {
				// gets the functions from storage refences the image storage in firebase by the children
				// gets the download url then sets the image from firebase as the value for the imgUrl key:
				const downloadUrl = await storage
					.ref(`/images/${username}/`)
					.child(imageAsFile.name)
					.getDownloadURL()

				await dispatch(addUserPhoto(downloadUrl))

				hideModal()
			}
		)
	}

	const dispatch = useDispatch()

	return (
		<Modal hideModal={hideModal}>
			<PageTitle>upload a profile picture</PageTitle>
			{error !== '' && error}
			{fileAsImage ? (
					<ProfilePhoto src={fileAsImage} />
				) : (
					<FileInputLabel>
						<Image src={AddImageIcon} />
						<FileInput id="upload" type="file" onChange={handleImageAsFile} />
					</FileInputLabel>
				)}
				<SubmitButton onClick={handleFireBaseUpload}>submit</SubmitButton>
		</Modal>
	)
}


const ProfilePhoto = styled(Image)`
	object-fit: cover;
	height: 200px;
	width: 200px;
	border-radius: 50%;
	border: 2px solid black;
`


export default AddActivityModal
