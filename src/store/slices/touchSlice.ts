import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'

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

interface CreateMarkerProps {
	lat: string
	lng: string
	notes: string
	tag: TagType
	location: string
	date: number
	photo: string | null
	cMember: string | null
}

export const createMarker = async ({
	lat,
	lng,
	location,
	date,
	notes,
	tag,
	photo,
	cMember
}: CreateMarkerProps) => {
	try {
		const ref = await db.collection('touches').doc()
		
		const touch: Touch = {
			lat: parseFloat(lat),
			lng: parseFloat(lng),
			cMemeber: cMember ? cMember : null,
			location,
			date,
			notes,
			tag,
			id: ref.id,
			photo: photo ? photo : null,
			resolved: false
		}

		if (photo) {
			touch.photo = photo
		}

		await ref.set(touch)
	} catch (error) {
		console.log('error creating touch', error)
	}
}
