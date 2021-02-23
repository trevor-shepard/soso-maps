import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'

import { db } from 'utils/firebase'

import { CommunityMember, CommunityMemberState } from 'types'

const initialState: CommunityMemberState = {}

const communitymember = createSlice({
	name: 'communitymember',
	initialState,
	reducers: {
		recieveCommunityMember(state, action: PayloadAction<CommunityMember>) {
			const communityMember = action.payload
			return {
				[communityMember.id]: communityMember,
				...state,
			}
		},
		recieveCommunityMembers(_, action: PayloadAction<CommunityMemberState>) {
			return action.payload
		},
		communityMemberClear() {
			return {}
		},
	},
})

export const {
	recieveCommunityMember,
	recieveCommunityMembers,
	communityMemberClear,
} = communitymember.actions

export default communitymember.reducer

export const subscribeToCommunityMembers = (dispatch: Dispatch<any>) => {
	const unsubscribe = db
		.collection('community-members')
		.onSnapshot((querySnapshot) => {
			const communityMembers: { [id: string]: CommunityMember } = {}

			querySnapshot.forEach((doc) => {
				const communityMember = doc.data() as CommunityMember
				communityMembers[communityMember.id] = communityMember
			})
			dispatch(recieveCommunityMembers(communityMembers))
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

		const communityMember: CommunityMember = {
			name,
			photo: photo ? photo : null,
			notes,
			location: location ? location : null,
			lat: latLng ? latLng[0] : null,
			lng: latLng ? latLng[1] : null,
			id: ref.id,
			touches: [],
		}

		await ref.set(communityMember)

		return ref.id
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
