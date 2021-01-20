import React, { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { subscribeToTouches, touchClear } from 'store/slices/touchSlice'
import {
	subscribeToCommunityMembers,
	cMemberClear
} from 'store/slices/communitymemberSlice'

export default function Subscribe() {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(touchClear())
		dispatch(cMemberClear())

		subscribeToTouches(dispatch)
		subscribeToCommunityMembers(dispatch)
	}, [dispatch])
	return <Fragment />
}
