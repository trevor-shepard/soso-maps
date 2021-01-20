import { combineReducers } from '@reduxjs/toolkit'
import touch from 'store/slices/touchSlice'
import user from 'store/slices/userSlice'
import communitymember from 'store/slices/communitymemberSlice'
const rootReducer = combineReducers({
	touch,
	user,
	communitymember
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
