import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LocationState } from 'types'

const initialState: LocationState = {
	lat: 29.94639419721249,
	lng: -90.07472171802686,
}

const location = createSlice({
	name: 'location',
	initialState,
	reducers: {
		recieveLocation(state, action: PayloadAction<LocationState>) {
			return action.payload
		},
		clearLocation() {
			return {
				lat: 29.94639419721249,
				lng: -90.07472171802686,
			}
		},
	},
})

export const { recieveLocation, clearLocation } = location.actions

export default location.reducer
