import React, { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { subscribeToTouches, touchClear } from 'store/slices/touchSlice'
import {
	subscribeToInventory,
	inventoryClear
} from 'store/slices/inventorySlice'
import {
	subscribeToCommunityMembers,
	cMemberClear
} from 'store/slices/communitymemberSlice'

export default function Subscribe() {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(touchClear())
		dispatch(cMemberClear())
		dispatch(inventoryClear())

		subscribeToTouches(dispatch)
		subscribeToCommunityMembers(dispatch)
		subscribeToInventory(dispatch)
	}, [dispatch])
	return <Fragment />
}
