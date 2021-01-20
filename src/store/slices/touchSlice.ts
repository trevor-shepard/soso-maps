import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'

import { AppThunk } from '..'

import { db } from 'utils/firebase'

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
		touchClear() {
			return {}
		}
	}
})

export const { recieveMarkers, touchClear } = touch.actions

export default touch.reducer

export const subscribeToTouches = (dispatch: Dispatch<any>) => {
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
