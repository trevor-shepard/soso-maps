import { combineReducers } from '@reduxjs/toolkit'
import touch from 'store/slices/touchSlice'
import user from 'store/slices/userSlice'
const rootReducer = combineReducers({
	touch,
	user
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
