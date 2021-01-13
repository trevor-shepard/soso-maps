import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'

import { AppThunk } from '..'

import { db, storage } from 'utils/firebase'

import { MarkerState, Marker, TagType } from 'types'

const initialState: MarkerState = {}

const marker = createSlice({
	name: 'marker',
	initialState,
	reducers: {
		recieveMarkers(state, action: PayloadAction<MarkerState>) {
			const markers = action.payload

			return {
				...markers
			}
		},
		clear() {
			return {}
		}
	}
})

export const { recieveMarkers, clear } = marker.actions

export default marker.reducer

export const subscribeToMarkers = (dispatch: Dispatch<any>) => {
	const unsubscribe = db.collection('markers').onSnapshot(querySnapshot => {
		const markers: { [id: string]: Marker } = {}

		querySnapshot.forEach(doc => {
			const marker = doc.data() as Marker
			markers[marker.id] = marker
		})

		dispatch(recieveMarkers(markers))
	})

	return unsubscribe
}

export const createMarker = (
	lat: string,
	lng: string,
	title: string,
	tags: TagType[],
	date: number,
	photo: string | null = null

): AppThunk => async dispatch => {
	try {
		const ref = await db.collection('markers').doc()

		const marker: Marker = {
			lat: parseFloat(lat),
			lng: parseFloat(lng),
			title,
			location: `${lat},${lng}`,
			date,
			tags,
			id: ref.id,
			photo
		}

		if (photo) {
			marker.photo = photo
		}

		await ref.set(marker)
	} catch (error) {
		console.log('error creating marker', error)
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
