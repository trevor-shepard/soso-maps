import { combineReducers } from '@reduxjs/toolkit'
import touch from 'store/slices/touchSlice'
import user from 'store/slices/userSlice'
import communitymember from 'store/slices/communitymemberSlice'
import inventory from 'store/slices/inventorySlice'
const rootReducer = combineReducers({
	touch,
	user,
	communitymember,
	inventory
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
