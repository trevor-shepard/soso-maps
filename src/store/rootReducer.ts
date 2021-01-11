import { combineReducers } from '@reduxjs/toolkit'
import marker from 'store/slices/markerSlice'
import user from 'store/slices/userSlice'
const rootReducer = combineReducers({
	marker,
	user
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
