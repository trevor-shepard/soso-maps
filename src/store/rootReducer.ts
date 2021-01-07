import { combineReducers } from '@reduxjs/toolkit'
import marker from 'store/slices/markerSlice'
const rootReducer = combineReducers({
	marker
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
