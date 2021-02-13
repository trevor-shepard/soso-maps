import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'

import { db } from 'utils/firebase'

import { TouchState, Touch, TagType } from 'types'
import { functions } from 'utils/firebase'

const initialState: TouchState = {}

const touch = createSlice({
	name: 'touch',
	initialState,
	reducers: {
		recieveTouches(state, action: PayloadAction<TouchState>) {
			const touches = action.payload

			return touches
		},
		touchClear() {
			return {}
		},
	},
})

export const { recieveTouches, touchClear } = touch.actions

export default touch.reducer

export const subscribeToTouches = async (dispatch: Dispatch<any>) => {
	const unsubscribe = await db
		.collection('touches')
		.onSnapshot((querySnapshot) => {
			const touches: { [id: string]: Touch } = {}

			querySnapshot.forEach((doc) => {
				const touch = doc.data() as Touch
				touches[touch.id] = touch
			})

			dispatch(recieveTouches(touches))
		})

	return () => {
		console.log('unsubscribing from touches')
		unsubscribe()
	}
}

interface CreateTouchProps {
	lat: string
	lng: string
	notes: string
	tag: TagType
	location: string
	date: number
	photo: string | null
	cMember: string | null
	uid: string
}

export const createTouch = async ({
	lat,
	lng,
	location,
	date,
	notes,
	tag,
	photo,
	cMember,
	uid,
}: CreateTouchProps) => {
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
			resolved: '',
			createdBy: uid,
		}

		if (photo) {
			touch.photo = photo
		}

		await ref.set(touch)

		if (cMember) {
			functions.httpsCallable('addTouchToMember')({
				memberID: cMember,
				touchID: ref.id,
			})
		}
	} catch (error) {
		
		console.log('error creating touch', error)
	}
}

export const resolveTouch = async ({ uid, touchID, note}: {uid: string, touchID: string, note: string})=> {
	try {
		await db.collection('touches').doc(touchID).update({
			resolved: uid,
			note
		})
	} catch (error) {
		console.log('error resolving touch', error)
	}
}