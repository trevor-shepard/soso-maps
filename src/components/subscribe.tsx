import React, { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { subscribeToTouches } from 'store/slices/touchSlice'
import { subscribeToInventory } from 'store/slices/inventorySlice'
import { subscribeToCommunityMembers } from 'store/slices/communitymemberSlice'

export default function Subscribe() {
	const dispatch = useDispatch()

	useEffect(() => {
		subscribeToTouches(dispatch)
		subscribeToCommunityMembers(dispatch)
		subscribeToInventory(dispatch)
	}, [dispatch])
	return <Fragment />
}
