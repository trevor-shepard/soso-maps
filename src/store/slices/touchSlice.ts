import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'

import { AppThunk } from '..'

import { db, storage } from 'utils/firebase'

import { TouchState, Touch, TagType } from 'types'

const initialState: TouchState = {}

const touch = createSlice({
	name: 'touch',
	initialState,
	reducers: {
		recieveMarkers(state, action: PayloadAction<TouchState>) {
			const touches = action.payload

			return {
				...touches
			}
		},
		clear() {
			return {}
		}
	}
})

export const { recieveMarkers, clear } = touch.actions

export default touch.reducer

export const subscribeToMarkers = (dispatch: Dispatch<any>) => {
	const unsubscribe = db.collection('touches').onSnapshot(querySnapshot => {
		const touches: { [id: string]: Touch } = {}

		querySnapshot.forEach(doc => {
			const touch = doc.data() as Touch
			touches[touch.id] = touch
		})

		dispatch(recieveMarkers(touches))
	})

	return unsubscribe
}

export const createMarker = (
	lat: string,
	lng: string,
	title: string,
	notes: string,
	tags: TagType[],
	location: string,
	date: number,
	photo: string | null = null
): AppThunk => async dispatch => {
	try {
		const ref = await db.collection('touches').doc()

		const touch: Touch = {
			lat: parseFloat(lat),
			lng: parseFloat(lng),
			title,
			location,
			date,
			notes,
			tags,
			id: ref.id,
			photo
		}

		if (photo) {
			touch.photo = photo
		}

		await ref.set(touch)
	} catch (error) {
		console.log('error creating touch', error)
	}
}

export const handleFireBaseImageUpload = async (path: string, photo: File) => {
	console.log('start of upload')
	if (photo === null)
		throw Error(`not an image, the image file is a ${typeof photo}`)
	const downloadURL = await storage
		.ref(path)
		.put(photo)
		.then(async () => {
			// gets the functions from storage refences the image storage in firebase by the children
			// gets the download url then sets the image from firebase as the value for the imgUrl key:
			return (await storage.ref(path).getDownloadURL()) as string
		})
		.catch(error => {
			const message = error.message
			console.log(message)
		})

	return downloadURL
}
