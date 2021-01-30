import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'

import { db } from 'utils/firebase'

import { CommunityMember, CommunityMemberState } from 'types'

const initialState: CommunityMemberState = {}

const communitymember = createSlice({
	name: 'communitymember',
	initialState,
	reducers: {
		recieveCommunityMember(state, action: PayloadAction<CommunityMember>) {
			const cMember = action.payload
			return {
				[cMember.id]: cMember,
				...state,
			}
		},
		recieveCommunityMembers(
			state,
			action: PayloadAction<CommunityMemberState>
		) {
			return {
				...state,
				...action.payload,
			}
		},
		cMemberClear() {
			return {}
		},
	},
})

export const {
	recieveCommunityMember,
	recieveCommunityMembers,
	cMemberClear,
} = communitymember.actions

export default communitymember.reducer

export const subscribeToCommunityMembers = (dispatch: Dispatch<any>) => {
	const unsubscribe = db
		.collection('community-members')
		.onSnapshot((querySnapshot) => {
			const cMembers: { [id: string]: CommunityMember } = {}

			querySnapshot.forEach((doc) => {
				const cMember = doc.data() as CommunityMember
				cMembers[cMember.id] = cMember
			})
			dispatch(recieveCommunityMembers(cMembers))
		})

	return unsubscribe
}

export const createCommunityMember = async (
	name: string,
	notes: string,
	location: string | null,
	latLng: [number, number] | null,
	photo?: string
) => {
	try {
		const ref = await db.collection('community-members').doc()

		const cMember: CommunityMember = {
			name,
			photo: photo ? photo : null,
			notes,
			location: location ? location : null,
			lat: latLng ? latLng[0] : null,
			lng: latLng ? latLng[1] : null,
			id: ref.id,
			touches: [],
		}

		await ref.set(cMember)
	} catch (error) {}
}

export const updateCommunityMember = async (
	id: string,
	update: {
		photo?: string
		notes?: string
		location?: string
	}
) => {
	try {
		await db.collection('community-members').doc(id).update(update)
	} catch (error) {}
}
