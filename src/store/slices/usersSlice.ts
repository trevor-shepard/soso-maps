import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'
import { db } from 'utils/firebase'
import { UsersState, User } from 'types'

const initialState: UsersState = {}

const users = createSlice({
	name: 'users',
	initialState,
	reducers: {
		recieveUsers(state, action: PayloadAction<UsersState>) {
			return action.payload
		},
		usersClear() {
			return {}
		},
	},
})

export const { recieveUsers, usersClear } = users.actions

export default users.reducer

export const subscribeToUsers = async (dispatch: Dispatch<any>) => {
	const unsubscribe = await db
		.collection('users')
		.onSnapshot((querySnapshot) => {
			const users: UsersState = {}

			querySnapshot.forEach((doc) => {
				const user = doc.data() as User
				users[user.uid] = user
			})

			dispatch(recieveUsers(users))
		})

	return () => {
		console.log('unsubscribing from users')
		unsubscribe()
	}
}
